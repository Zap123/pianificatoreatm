//TODO:MAPPA COORDINATE
//TODO: Eccezioni connessione non avvenuta
var request = require('request'),
    cheerio = require('cheerio');

request = request.defaults({
    jar: true,
    headers: {
        'User-Agent': 'NokiaN97i/SymbianOS/9.1 Series60/3.0'
    }
});


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
        'mezzo': opzioni.mezzi,
        'opzioni': opzioni.percorso
    };
}


ATMFetcher.prototype.getRoute = function (callback) {
    // Giromilano trova percorso
    var that = this,
        url = "http://gmmobile.atm-mi.it/wsbw/SoluzioniFreqMode";

    request.post(url, function (err, resp, body) {
        that.getMap(function (maps) {
            callback(that.printRoute(body,maps));
        });
    }).form(this.query);
};

ATMFetcher.prototype.printRoute = function (html, mapsImg) {
    var $ = cheerio.load(html),
        hrScope = 0,
        routes = {
            mapsImg: mapsImg
        },
        linea = [],
        stoplist,
        //tempi di percorrenza
        info = $('div span.name').first().text().trim();

    routes.info = info;
    routes.steps = [];
    stoplist = $('.stoplist').html();
    //Se esiste un percorso lo prendo 
    if (stoplist) {
        $ = cheerio.load(stoplist);
        $('hr').each(function (i, el) {
            var step = {};
            $(this).nextUntil('hr').each(function (j, el) {
                elemento = $(this).text();
                if (elemento.match(":")) {
                    //rimuovo caratteri di a capo
                    valore = elemento.replace(/(\r\n|\n|\r)/gm, "").trim();
                    valore = valore.split(":");
                    //estrazione linee per twitter
                    if (valore[0].match("prendi la linea")) {
                        linea.push(valore[1].split(' ')[1]);
                    }
                    step[valore[0].trim()] = valore[1].trim();
                }
                //Trattazione dei casi per i link a funzionalità
                if ($(this).attr('class') === "orariPdf") {
                    step.pdf = $(this).children().attr('href');
                }
                if ($(this).attr('class') === "listIcon" && $(this).children().children().attr('alt') === "orari") {
                    step.infoTraffico = "http://gmmobile.atm-mi.it" + $(this).children().attr('href');
                }
            });
            routes.steps[i] = step;
        });
        console.log(routes.maps);
        ATMFetcher.twitterNews(linea);
    } else {
        var partenza = [],
            arrivo = [];
        routes.error = true;
        $('#dlIndirizzoS').children().each(function (i, el) {
            partenza[i] = {
                nome: $(this).text()
            };
        });
        $('#dlIndirizzoE').children().each(function (i, el) {
            arrivo[i] = {
                nome: $(this).text()
            };
        });
        routes.arrivo = arrivo;
        routes.partenza = partenza;
    }
    return routes;
};


ATMFetcher.twitterNews = function (linee) {
    linee.forEach(function (el) {
        console.log(el);
    });
};

ATMFetcher.prototype.getMap = function (callback) {
    // Giromilano trova percorso
    var that = this,
        url = "http://gmmobile.atm-mi.it/wsbw/FullNavigator";
    request(url, function (err, resp, body) {
        $ = cheerio.load(body);
        callback($("img[style*=margin-left]").attr("src"));
    });
};


/* Non necessaria
 * ATMFetcher.getInfo = function(linea){
    var url = "http://gmmobile.atm-mi.it/wsbw/InfoTraffico",
    query = {
        'codLinea': linea,
        'cmdRicercaDiretta': 'cerca'
        'routeType':'0',
        'idLine':'-1'
    };

    request.post(url, function(err, resp, body){
        var $ = cheerio.load(body);
        $('div[style*=important]').each(function(i, el){
            console.log('---------------------------');
            console.log(($(this).text()));
        });
    }).form(query); 
};
*/

ATMFetcher.getCities = function (callback) {
    //lista città di partenza-arrivo
    var url = "http://gmmobile.atm-mi.it/wsbw/CalcolaPercorso",
        cities = [];
    request(url, function (err, resp, body) {
        var $ = cheerio.load(body);
        $('#dlComuneS').children().each(function (i, el) {
            cities[i] = {
                nome: $(this).text()
            };
        });
        callback(cities);
    });
};

ATMFetcher.getNews = function (callback) {
    //Comunicati ufficiali ATM
    var url = "http://www.atm.it/IT/ATMNEWS/Pagine/default.aspx",
        news = [];

    request(url, function (err, resp, body) {
        var $ = cheerio.load(body);
        $('div.news-item').children().each(function (i, el) {
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

var fetcher = new ATMFetcher('viale fulvio testi', 'milano', 'viale monza', 'milano', {
    mezzi: 1,
    percorso: 0
});
fetcher.getRoute(function (data) {
    console.log(data);
});
