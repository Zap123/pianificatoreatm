//TODO: Eccezioni connessione non avvenuta (throw error)
var request = require('request'),
    cheerio = require('cheerio'),
    fs = require('fs');

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
            callback(that.printRoute(body, maps));
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
                if (elemento.match("/:/")) {
                    //rimuovo caratteri di a capo
                    valore = elemento.replace(/(\r\n|\n|\r)/gm, "").trim();
                    valore = valore.split(":");
                    //estrazione linee per twitter
                    if (valore[0].match("/prendi la linea/")) {
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
        //TODO: Ritornare oggetto regole socket 
        this.twitterNews(linea, function (classObj) {
            console.log(classObj);
        });
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


ATMFetcher.prototype.twitterNews = function (linee) {
    fs.readFile("../../connectors/twitter/cache/atm_informa", function (err, data) {
        var tweets = JSON.parse(data),
            datacur = new Date(tweets[0].created_at),
            cur = 0,
            today = new Date().setHours(0, 0, 0),
            classificationObj = {
                weight: 0,
                news: []
            };
        //controllo se per ogni linea ci sono dei tweet e se quest'informazione è di oggi
        while (linee.length > 0 && cur < tweets.length && datacur > today) {
            //Guardo dentro a un tweet se parla di una linea
            console.log(linee);
            var linea = 0;
            linee.forEach(function(linea, linea_index){
                tweets[cur].entities.hashtags.forEach(function (hash) {
                    //Cerco ':' e prendo solo gli hash precedenti perché sono i soggetti
                    var subjectIndex = tweets[cur].text.indexOf(':');
                    if (hash.indices[1] <= subjectIndex) {
                        if (hash.text.match(new RegExp(linea))) {
                            console.log(tweets[cur].text);
                            classification = this.classify(tweets[cur], hash.text, subjectIndex);
                            //Se è stata applicata una regola
                            //come euristica cancello linea e non cerco altre informazioni
                            //perché probabilmente non più valide
                            if (classification.match) {
                                linee.splice(linea_index, 1);
                                //Se issue === undefined non invio l'oggetto perché info risolta
                                if (classification.issue) {
                                    //do un peso alle notizie
                                    //0:nessun problema, 1:incertezze, 2: rallentamenti, 3:problemi seri
                                    if (classificationObj.weight < classification.weight)
                                        classificationObj.weight = classification.weight;
                                    classificationObj.news.push(classification);
                                }
                            }
                        }
                    }
                }.bind(this));
            }.bind(this));
            cur++;
            datacur = new Date(tweets[cur].created_at);
        }
        console.log(classificationObj);
        return classificationObj;
    }.bind(this));
};

ATMFetcher.prototype.classify = function (tweet, hash, subjectIndex) {
    informationObject = {
        match: false,
    };

    //casistica keyword
    //chiave modifica già gestita da app.web
    rules = {
        'devia|deviano': function () {
            informationObject.issue = ATMFetcher.formatTweet(hash, tweet.text, subjectIndex);
            informationObject.match = true;
            informationObject.weight = "1";
            informationObject.date = tweet.created_at;
        },
        'rallentamenti': function () {
            //Non vengono sempre segnalate le risoluzione, TODO:annullare dopo un paio d'ore
            informationObject.issue = ATMFetcher.formatTweet(hash, tweet.text, subjectIndex);
            informationObject.match = true;
            informationObject.weight = "2";
            informationObject.date = tweet.created_at;
        },
        'riprende|riprendono': function () {
            //Situazione risolta, non la invio, modificare nel caso di sistema continuo
            informationObject.match = true;
        },
        'sospesa': function () {
            informationObject.issue = ATMFetcher.formatTweet(hash, tweet.text, subjectIndex);
            informationObject.match = true;
            informationObject.weight = "3";
            informationObject.date = tweet.created_at;
        },
        'termina': function () {
            informationObject.issue = ATMFetcher.formatTweet(hash, tweet.text, subjectIndex);
            informationObject.match = true;
            informationObject.weight = "3";
            informationObject.date = tweet.created_at;
        },
    };
    //controllo la prima parola dopo ':' se è una keyword
    for (var expr in rules) {
        if (tweet.text.slice(subjectIndex+2).split(' ')[0].match(expr)) {
            console.log(expr);
            rules[expr]();
        }
    }

    console.log(informationObject.issue+"<-----");
    return informationObject;
};

ATMFetcher.formatTweet = function (subject, text, subjectIndex) {
    return subject + text.slice(subjectIndex);
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
fetcher.twitterNews(['M1','50', '16']);

//fetcher.getRoute(function (data) {
//    console.log(data);
//});
