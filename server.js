const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();

const database = __dirname + '/database/';
let sessions = [];

const thirty_minutes = 1000 * 60 * 30;
const twelve_hours = thirty_minutes * 24;

const session_expirer = setInterval(() => {
    sessions = sessions.filter(session => session.expires <= Date.now());
}, thirty_minutes);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './dist')));

const port = process.env.PORT || 3001;

app.post('/api/auth', (req, res) => {
    new Promise((resolve, reject) => {
        fs.readFile(path.join(database, 'password.txt'), 'utf8', (err, password) => {
            resolve(password.trim());
        })
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
        return session.token === req.body.token;
    });
    if(existing.length === 1){
        existing[0].expires = Date.now() + twelve_hours;
    }
    res.send(JSON.stringify({
        'success': existing.length === 1
    }));
});

function loadTable(table) {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(database, table + '.json'), 'utf8', (err, table) => {
            resolve(JSON.parse(table));
        });
    })
}

app.get('/api/rebuild_players/:tag?', (req, res) => {

    Promise.all(['events', 'matches', 'players', 'tiers'].map(loadTable)).then(data => {
        let events  = data[0];
        let matches = data[1];
        let players = data[2];
        let tiers   = data[3];
        if(req.params.tag){
            let eventIDs = events.filter(event => event.tags.indexOf(req.params.tag) > -1).map(event => event.id);
            matches = matches.filter(match => eventIDs.indexOf(match.completedAt) > -1);
        }

        players = players.map(player => {
            return Object.assign({}, player, {
                rank: 0,
                tier: 0
            });
        });

        matches.forEach(match => {
            let winner = players.filter(player => player.id === match.winnerId)[0];
            let loser = players.filter(player => player.id === match.loserId)[0];
            winner.rank++;
            if(winner.rank > tiers[winner.tier].ranks && tiers[winner.tier].ranks !== -1){
                winner.rank = 0;
                winner.tier++;
            }
            if(tiers[loser.tier].cantloose === false){
                winner.rank--;
                if(winner.rank < 0){
                    winner.tier--;
                    winner.rank = 0;
                }
            }
        });

        return new Promise((resolve, reject) => {
            fs.writeFile(path.join(database, 'players.json'), JSON.stringify(players), err => {
                resolve(true);
            })
        });

    }).then(() => {
        res.send(JSON.stringify({
            success: true
        }))
    })

});

app.get('/api/table/:table', (req, res) => {

    res.sendFile(path.join(database, req.params.table + '.json'));

});

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
    loadTable(req.params.table).then(table => {

        switch(req.body.action){
            case 'push':
                if(!req.body.data.hasOwnProperty('id')){
                    let id = table.reduce((max, row) => {
                        return row.id > max ? row.id : max;
                    }, 0);
                    req.body.data.id = id+1;
                }
                table.push(req.body.data);
            case 'set':
                table = table.map(row => {
                    if(row.id === req.body.id){
                        return Object.assign({}, row, req.body.data);
                    } else {
                        return row;
                    }
                });
        }

        return new Promise((resolve, reject) => {

            fs.writeFile(path.join(database, req.params.table+'.json'), JSON.stringify(table), err => {
                resolve(true);
            });

        });

    }).then(() => {

        res.send(JSON.stringify({
            "success": true
        }));

    });

});

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/dist/index.html');
});

app.listen(port, () => console.log('Listening on port', port));
