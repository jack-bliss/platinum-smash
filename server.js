const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();

const database = __dirname + '/database/';

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './dist')));

const port = process.env.PORT || 3001;

app.get('/api/table/:table', (req, res) => {

    res.sendFile(path.join(database, req.params.table + '.json'));

});

app.post('/api/update/:table', (req, res) => {

    let tableUrl = path.join(database, req.params.table + '.json');
    new Promise((resolve, reject) => {

        fs.readFile(tableUrl, 'utf8', (err, table) => {
            resolve(JSON.parse(table));
        });

    }).then(table => {

        switch(req.body.action){
            case 'push':
                table.push(req.body.data);
            case 'set':
                table = table.map(entry => {
                    if(entry.id === req.body.id){
                        return Object.assign({}, entry, req.body.data);
                    } else {
                        return entry;
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
