const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();

const database = __dirname + '/database/';
let sessions = [];

const ten_hours = 1000*60*60*10;

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

            let token = Math.random()*Math.pow(10, 18);
            // make sure it's not already a token
            while(sessions.indexOf(token) > -1){
                token = Math.random()*Math.pow(10, 18);
            }
            sessions.push(token);
            setTimeout(() => {
                let index = sessions.indexOf(token);
                sessions = sessions.filter(tkn => {
                    tkn !== token;
                });
            }, ten_hours);

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

app.get('/api/table/:table', (req, res) => {

    res.sendFile(path.join(database, req.params.table + '.json'));

});

app.post('/api/update/:table', (req, res) => {
    if(sessions.indexOf(/* user_token_via_cookie*/) === -1){
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
