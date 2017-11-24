// UTIL
const path = require('path');
const url = require('url');

// EXPRESS SERVER
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './dist')));

// CONTENTFUL
const contentful = require('contentful');

const contenfulClient = contentful.createClient({
    space: 'yt3y05y0gcz1',
    accessToken: process.env.CONTENTFUL_KEY
});

// SESSIONS
let sessions = [];

const thirty_minutes = 1000 * 60 * 30;
const twelve_hours = thirty_minutes * 24;

const session_expirer = setInterval(() => {
    sessions = sessions.filter(session => session.expires <= Date.now());
}, thirty_minutes);

// POSTGRES
const { Pool } = require('pg');
const pg_params = url.parse(process.env.DATABASE_URL);
const pg_auth = pg_params.auth.split(":");

const pool = Pool({
    host: pg_params.hostname,
    port: pg_params.port,
    user: pg_auth[0],
    database: pg_params.pathname.split('/')[1],
    password: pg_auth[1],
    ssl: true
});

pool.on('error', (err, client) => {
    console.error(err);
    console.log(client);
});

// sql helper functions
function loadSQLTable(table){
    let q = 'SELECT * FROM ' +table;
    if(table === 'matches'){
        q += ' ORDER BY completed_at ASC';
    } else if(table === 'tiers'){
        q += ' ORDER BY key ASC';
    }
    return new Promise((resolve, reject) => {
        pool.query(q)
            .then(response => {
                return resolve(response.rows);
            })
            .catch(err => reject(err));
    });
}

function insertSQL(table, row){
    let qu = 'INSERT INTO '+table;
    qu += ' (';

    qu += Object.keys(row).join(', ');
    qu += ') VALUES(';

    qu += Object.keys(row).map(key => {
        return row[key];
    }).map(val => {
        if(Array.isArray(val)){
            return "'" + (val.join(", ")).replace(/\'/g, "''") + "'";
        } else if(typeof val === 'string'){
            return "'"+(val).replace(/\'/g, "''")+"'";
        } else {
            return val;
        }
    }).join(', ');
    qu += ');';
    console.log(qu);
    return new Promise((resolve, reject) => {
        pool.query(qu)
            .then(response => resolve(response))
            .catch(err => reject(err));
    })
}

function updateSQL(table, id, row){
    let qu = 'UPDATE '+table+' ';
    qu += 'SET ';
    qu += Object.keys(row).map(key => {
        let pair = [key, row[key]];
        let s = pair[0] + '=';
        if(typeof pair[1] === 'string'){
            s += "'"+pair[1]+"'";
        } else {
            s += pair[1];
        }
        return s;
    }).join(', ');
    qu += ' WHERE id='+id+';';
    return new Promise((resolve, reject) => {
        pool.query(qu)
            .then(response => resolve(response))
            .catch(err => reject(err));
    });
}

function countMatches(id1, id2){
    return pool.query('SELECT COUNT(*) FROM matches WHERE (player1id='+id1+' AND player2id='+id2+') OR (player1id='+id2+' AND player2id='+id1+')');
}

// API
// security
app.post('/api/auth', (req, res) => {
    new Promise((resolve, reject) => {
        loadSQLTable('password').then(rows => {
            resolve(rows[0].hash);
        });
    }).then(password => {
        if(password === req.body.password){

            let token;
            let existing = [0];
            while(existing.length){
                token = Math.random() * Math.pow(10, 18);
                existing = sessions.filter(session => session.token === token);
            }
            sessions.push({
                token: token,
                expires: Date.now() + twelve_hours
            });

            res.send(JSON.stringify({
                "success": true,
                "token": token
            }));

        } else {
            res.send(JSON.stringify({
                "success": false
            }));

        }
    })
});

app.post('/api/verify_token', (req, res) => {
    let existing = sessions.filter(session => {
        return session.token+''.trim() === req.body.token+''.trim();
    });

    if(existing.length === 1){
        existing[0].expires = Date.now() + twelve_hours;
    }
    res.send(JSON.stringify({
        'success': existing.length === 1
    }));
});

// delete a match
app.get('/api/delete_match/:id', (req, res) => {
    pool.query('DELETE FROM matches WHERE id='+req.params.id)
        .then(response => {
            return buildLadder()
        }, err => {
            res.send(JSON.stringify({
                'success': false,
                'error': err
            }))
        })
        .then(response => {
            res.send(JSON.stringify({
                'success': true
            }))
        });
});

// count matches between players
app.get('/api/count_matches/:id1/:id2', (req, res) => {
    countMatches(req.params.id1, req.params.id2)
        .then(response => {
            res.send(JSON.stringify({
                'success': true,
                'count': parseInt(response.rows[0].count)
            }))
        }, err => {
            res.send(JSON.stringify({
                'success': false
            }))
        });
});

// rebuilding ladder
function buildLadder(tag){

    return Promise.all(['events', 'matches', 'players', 'tiers'].map(loadSQLTable)).then(data => {

        let events  = data[0];
        let matches = data[1];
        let players = data[2];
        let tiers   = data[3];

        if(tag){
            let eventIDs = events.filter(event => event.tags.split(', ').indexOf(tag) > -1).map(event => event.id);
            matches = matches.filter(match => eventIDs.indexOf(match.eventid) > -1);
        }

        players = players.map(player => {
            return Object.assign({}, player, {
                rank: 0,
                tier: 0
            });
        });

        matches.forEach(match => {
            let winner = players.filter(player => player.id === match.winnerid)[0];
            let loser = players.filter(player => player.id === match.loserid)[0];

            winner.rank++;
            if(winner.rank > tiers[winner.tier].ranks && tiers[winner.tier].ranks !== -1){
                winner.rank = 0;
                winner.tier++;
            }
            if(tiers[loser.tier].cantloose === false){
                loser.rank--;
                if(loser.rank < 0){
                    loser.tier--;
                    loser.rank = tiers[loser.tier].ranks;
                }
            }
        });

        return Promise.all(players.map(player => {
            return updateSQL('players', player.id, player);
        }));

    })
}

app.get('/api/rebuild_players/:tag?', (req, res) => {

    buildLadder(req.params.tag).then(() => {
        res.send(JSON.stringify({
            success: true
        }))
    })

});

// list all players with wins/losses
app.get('/api/players', (req, res) => {
    const grid = {
        wins: {},
        losses: {}
    };
    loadSQLTable('matches')
        .then(matches => {
            for(let i = 0; i < matches.length; i++){
                if(grid.wins.hasOwnProperty(matches[i].winnerid)){
                    grid.wins[matches[i].winnerid].push(matches[i].loserid);
                } else {
                    grid.wins[matches[i].winnerid] = [matches[i].loserid];
                }

                if(grid.losses.hasOwnProperty(matches[i].loserid)){
                    grid.losses[matches[i].loserid].push(matches[i].winnerid);
                } else {
                    grid.losses[matches[i].loserid] = [matches[i].winnerid];
                }
            }
            return loadSQLTable('players');
        }).then(players => {
            for(let i = 0; i < players.length; i++){
                if(grid.wins.hasOwnProperty(players[i].id)){
                    players[i].wins = grid.wins[players[i].id];
                } else {
                    players[i].wins = [];
                }
                if(grid.losses.hasOwnProperty(players[i].id)){
                    players[i].losses = grid.losses[players[i].id];
                } else {
                    players[i].losses = [];
                }
            }
            res.send(JSON.stringify(players));
        });
});

// dump a psql tablle
app.get('/api/table/:table', (req, res) => {

    loadSQLTable(req.params.table).then(table => {
        res.send(JSON.stringify(table));
    })

});

// update a psql table somehow
app.post('/api/update/:table', (req, res) => {
    let session = sessions.filter(session => {
        return session.token === req.body.token && session.expires >= Date.now();
    });
    if(session.length === 0){
        return res.send(JSON.stringify({
            "success": false,
            "reason": "Invalid token"
        }));
    }
    let p;
    switch(req.body.action){
        case 'push':
            p = insertSQL(req.params.table, req.body.data);
            break;
        case 'set':
            p = updateSQL(req.params.table, req.body.id, req.body.data);
            break;
        default:
            p = Promise.reject("Couldn't tell what you wanted me to do with that");
    }
    p.then(result => {
        res.send(JSON.stringify({
            "success": true
        }));
    }).catch(err => {
        res.send(JSON.stringify({
            "success": false,
            "reason": err
        }))
    });
});

// contentful
// list events
app.get('/api/contentful/events', (req, res) => {
    contenfulClient.getEntries({
        "content_type": "event",
        "order": "fields.date"
    }).then(response => {
        const events = response.items.map(item => {
            return item.fields;
        });
        res.send(JSON.stringify(events));
    });
});
// get a key/value pair (e.g., header image)
app.get('/api/contentful/lookup/:key', (req, res) => {
    contenfulClient.getEntries({
        "content_type": "lookup"
    }).then(response => {
        const value = response.items
            .filter(item => {
                return item.fields.key === req.params.key;
            });
        if(value.length !== 1) {
            res.send(JSON.stringify({
                success: false,
                error: "Couldn't uniquely find the requested key."
            }));
        } else {
            res.send(JSON.stringify({
                success: true,
                value: value[0].fields.value
            }));
        }
    }, err => {
        res.send(JSON.stringify({
            success: false,
            error: "Couldn't uniquely find the requested key."
        }));
    })
});

// reidrectors
app.get('/stats', (req, res) => {
    res.redirect('http://jackbliss.co.uk/brighton-glicko');
});
app.get('/fb', (req, res) => {
    res.redirect('https://www.facebook.com/BrightonStockSmash/');
});
app.get('*', (req, res) => {
    res.sendFile(__dirname + '/dist/index.html');
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log('Listening on port', port));
