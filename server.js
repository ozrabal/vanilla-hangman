var express = require('express');
var request = require('request');
var app = express();

app.use('/js',express.static(__dirname + '/app/js'));
app.use('/assets',express.static(__dirname + '/app/assets'));

app.get('/', function(req, res) {
    //res.sendFile('app/index.html', { root: __dirname });
    res.sendFile((__dirname + '/app/index.html'));
});

app.listen(3000, function () {
    console.log('App listening on port 3000');
});