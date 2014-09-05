//TODO:MAPPA COORDINATE
//TODO:  gestire indirizzo ambiguo
//TODO: estrarre keyword mezzi (prendi la linea)
var request = require('request'),
    cheerio = require('cheerio');

// user-agent necessario per comunicare con il server ATM/Mobile
var options = {
    headers: {
        'User-Agent': 'NokiaN97i/SymbianOS/9.1 Series60/3.0'
    }
};

function ATMFetcher(partenza, comuneS, arrivo, comuneE, opzioni) {
    this.query = {
        'lat': '',
        'lng': '',
        'dlComuneMyPosition': '',
        'selectedComuneS': comuneS,
        'selectedComuneE': comuneE,
        'txtIndirizzoS': partenza,
        'dlComuneS': comuneS,
        'txtIndirizzoE': arrivo,
        'dlComuneE': comuneE,
        'cmdRicerca': 'Calcola',
        'mezzo': '1',
        'opzioni': '0'
    };
}


ATMFetcher.prototype.getRoute = function() {
    // Giromilano trova percorso
    var that = this,
        url = "http://gmmobile.atm-mi.it/wsbw/SoluzioniFreqMode";

    options.url = url;
    request.post(options, function(err, resp, body) {
        that.printRoute(body);
    }).form(this.query);
};

ATMFetcher.prototype.printRoute = function(html) {
    //TODO: SWITCH JSON
    //TODO: Valore0 dinamico, corretta gerarchia
    var $ = cheerio.load(html),
        routes = [],
        hrScope = 0,
        //tempi di percorrenza
        info = $('div span.name').first().text();

    $ = cheerio.load($('.stoplist').html());
    $('hr').each(function(i,el){
        var step = [];
        console.log("STEP " +i);
        $(this).nextUntil('hr').each(function(j,el){
            elemento = $(this).text();
            if(elemento.match(":")){
                //rimuovo caratteri di a capo
                valore = elemento.replace(/(\r\n|\n|\r)/gm,"").trim();
                valore = valore.split(":");
               //risolvere 1 
                console.log(valore[0]);
                step[valore[0]]=valore[1];
            }
        });
        routes[i]= step;
    });
    console.log(routes);
};

/* Non necessaria
 * ATMFetcher.getInfo = function(linea){
    var url = "http://gmmobile.atm-mi.it/wsbw/InfoTraffico",
    query = {
        'codLinea': linea,
        'cmdRicercaDiretta': 'cerca'
//        'routeType':'0',
//        'idLine':'-1'
    };

    options.url = url;
    request.post(options, function(err, resp, body){
        var $ = cheerio.load(body);
        $('div[style*=important]').each(function(i, el){
            console.log('---------------------------');
            console.log(($(this).text()));
        });
    }).form(query); 
};
*/

ATMFetcher.getCities = function(callback) {
    //lista città di partenza-arrivo
    var url = "http://gmmobile.atm-mi.it/wsbw/CalcolaPercorso",
        cities = [];
    options.url = url;
    request(options, function(err, resp, body) {
        var $ = cheerio.load(body);
        $('#dlComuneS').children().each(function(i, el) {
            cities[i] = {
                nome: $(this).text()
            };
        });
        callback(cities);
    });
};

ATMFetcher.getNews = function(callback) {
    //Comunicati ufficiali ATM
    var url = "http://www.atm.it/IT/ATMNEWS/Pagine/default.aspx",
        news = [];

    options.url = url;
    request(options, function(err, resp, body) {
        var $ = cheerio.load(body);
        $('div.news-item').children().each(function(i, el) {
            news[i] = {
                testo: $(this).text(),
                url: $(this).attr('href')
            };
        });
        callback(news);
    });
};


module.exports = ATMFetcher;
//ATMFetcher.getCities(function(data){console.log(data);});
//ATMFetcher.getNews(function(data){
//    console.log(data);
//});

var fetcher = new ATMFetcher('viale fulvio testi 1','milano','viale monza 3','milano','');
fetcher.getRoute();
