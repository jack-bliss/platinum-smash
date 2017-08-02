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
    let tableUrl = path.join(database, req.params.table + '.json');
    new Promise((resolve, reject) => {

        fs.readFile(tableUrl, 'utf8', (err, table) => {
            resolve(JSON.parse(table));
        });

    }).then(table => {

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

            fs.writeFile(tableUrl, JSON.stringify(table), err => {
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
