//TODO:Planner interfaccia post
//TODO:Interfaccia in file separato
var express = require('express'),
    app = express(),
    fetcher = require('./fetchers/atm/atm'),
    bodyParser = require('body-parser');

app.use(express.static(__dirname + '/app'));
app.use(bodyParser.json());

app.get('/cities', function(req, res) {
    fetcher.getCities(function(data) {
        res.send(data);
    });
});

app.get('/news', function(req, res) {
    fetcher.getNews(function(data) {
        res.send(data);
    });
});

app.post('/route', function(req, res) {
    var from = req.param('from'),
        cityS = req.param('cityS'),
        to = req.param('to'),
        cityE = req.param('cityE'); 
    if (from && to) {
        var atm = new fetcher(from, cityS, to, cityE, '');
        res.send(atm.getRoute());
        
    }
    /*
    res.send(500, {
        status: 500,
        message: 'Errore',
        type: 'internal'
    });
    */
});

var server = app.listen(3000, function() {
    console.log('* PianificatoreATM in ascolto sulla porta %d', server.address().port);
});
