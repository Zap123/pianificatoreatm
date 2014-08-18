//TODO:Route
//TODO:Interfaccia in file separato

var express = require('express'),
    app = express(),
    fetcher = require('./fetchers/atm/atm');


app.get('/cities', function(req,res){
    fetcher.getCities(function(data){
        res.send(data);
    });
});


app.get('/news', function(req,res){
    fetcher.getNews(function(data){
        res.send(data);
    });
});

var server = app.listen(3000, function(){
    console.log('* PianificatoreATM in ascolto sulla porta %d', server.address().port);
});
