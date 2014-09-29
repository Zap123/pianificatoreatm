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
        if (err) throw err;
        that.getMap(function (maps) {
            var route = that.printRoute(body, maps);
            if (route.twitter) {
                that.twitterNews(route.twitter, function (tweets) {
                    route.twitter = tweets;
                    callback(route);
                });
            } else {
                callback(route);
            }
        });

    }).form(this.query);
};

ATMFetcher.prototype.printRoute = function (html, mapsImg) {
    var $ = cheerio.load(html),
        hrScope = 0,
        linee = {
            nomi: [],
            direzioni: []
        },
        routes = {
            mapsImg: mapsImg
        },
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
                if (elemento.indexOf(":") !== -1) {
                    //rimuovo caratteri di a capo
                    valore = elemento.replace(/(\r\n|\n|\r)/gm, "").trim();
                    valore = valore.split(":");
                    //estrazione linee per twitter
                    if (valore[0].indexOf("prendi la linea") !== -1) {
                        i_leftpar = valore[1].indexOf('(');
                        i_dash = valore[1].indexOf('-', i_leftpar);
                        var direzione = valore[1].slice(i_leftpar + 1, i_dash);
                        linee.nomi.push(valore[1].split(' ')[1]);
                        linee.direzioni.push(direzione);
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
        routes.twitter = linee;
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


ATMFetcher.prototype.twitterNews = function (linee, callback) {
    fs.readFile("./connectors/twitter/cache/atm_informa", function (err, data) {
        if (err) throw err;
        var tweets = JSON.parse(data),
            datacur = new Date(tweets[0].created_at),
            cur = 0,
            today = new Date().setHours(0, 0, 0),
            classificationObj = {
                weight: 0,
                problem: [],
                news: []
            };
        //controllo se per ogni linea ci sono dei tweet e se quest'informazione è di oggi
        console.log("informazioni valide:");
        console.log(datacur > today);
        //GiroMilano dà solo il numero della linea e non il mezzo
        while (linee.nomi.length > 0 && cur < tweets.length && datacur > today) {
            //Guardo dentro a un tweet se parla di una linea
            console.log(linee);
            var alreadyUsedTweet = false;
            hashtags = tweets[cur].entities.hashtags;
            for (var linea = 0; linea < linee.nomi.length; linea++) {
                var hash = 0;
                var found = false;
                while (!found && hash < hashtags.length) {
                    //Cerco ':' e prendo solo gli hash precedenti perché sono i soggetti
                    //se non trovo il soggetto nel primo ':' controllo negli altri
                    var subjectIndex = tweets[cur].text.indexOf(':');
                    var isSubject = false;
                    while (!isSubject && subjectIndex != -1) {
                        if (hashtags[hash].indices[1] <= subjectIndex) {
                            isSubject = true;
                        } else {
                            subjectIndex = tweets[cur].text.indexOf(':', subjectIndex + 1);
                        }
                    }
                    if (isSubject) {
                        console.log(hashtags[hash].text + "-" + linee.nomi[linea]);
                        if (!isNaN(linee.nomi[linea]))
                            found = hashtags[hash].text.match(new RegExp('^(?:[A-Z_a-z]+(' + linee.nomi[linea] + '))$'));
                        else {
                            found = hashtags[hash].text.indexOf(linee.nomi[linea]) !== -1;
                        }
                        if (found) {
                            console.log(tweets[cur].text);
                            classification = this.classify(tweets[cur], hashtags[hash].text, subjectIndex);
                            //Se è stata applicata una regola
                            //come euristica cancello linea e non cerco altre informazioni
                            //perché probabilmente non più valide
                            if (classification.match) {
                                linee.nomi.splice(linea, 1);
                                // [x,y] cancellando x => [y] non incremento contatore
                                linea--;
                                //Se issue === undefined non invio l'oggetto perché info risolta
                                if (classification.issue) {
                                    //do un peso alle notizie
                                    //0:nessun problema, 1:incertezze, 2: rallentamenti, 3:problemi seri
                                    if (classificationObj.weight < classification.weight)
                                        classificationObj.weight = classification.weight;
                                    if (!alreadyUsedTweet) {
                                        classificationObj.news.push(tweets[cur].text.replace(/&gt;/g, '>'));
                                        alreadyUsedTweet = true;
                                    }
                                    classificationObj.problem.push(hashtags[hash].text);
                                }
                            }
                        }
                    }
                    hash++;
                }
            }
            cur++;
            if (tweets[cur] !== undefined)
                datacur = new Date(tweets[cur].created_at);
        }
        callback(classificationObj);
    }.bind(this));
};

ATMFetcher.prototype.classify = function (tweet, hash, subjectIndex) {
    informationObject = {
        match: false,
    };

    //casistica keyword
    rules = {
        'devia|deviano|deviazione': function () {
            informationObject.issue = true;
            informationObject.match = true;
            informationObject.weight = "1";
            informationObject.date = tweet.created_at;
        },
        'rallentamenti': function () {
            //Non vengono sempre segnalate le risoluzione, annullare dopo un paio d'ore
            if (new Date() - new Date(tweet.created_at) < 7200000) {
                informationObject.issue = true;
                informationObject.match = true;
                informationObject.weight = "2";
                informationObject.date = tweet.created_at;
            } else {
                informationObject.match = true;
                informationObject.issue = false;
            }
        },
        'riprende|riprendono': function () {
            //Situazione risolta, non la invio, modificare nel caso di sistema continuo
            informationObject.match = true;
            informationObject.issue = false;
        },
        'modifica|modificano|modifiche': function () {
            //chiave modifica già gestita da app.web
            informationObject.match = true;
            informationObject.issue = false;
        },
        'sospesa|sospensione|sospendono': function () {
            informationObject.issue = true;
            informationObject.match = true;
            informationObject.weight = "3";
            informationObject.date = tweet.created_at;
        },
        'termina': function () {
            informationObject.issue = true;
            informationObject.match = true;
            informationObject.weight = "3";
            informationObject.date = tweet.created_at;
        },
    };
    //controllo la prima parola dopo ':' se è una keyword
    for (var expr in rules) {
        if (this.stripUnwanted(tweet.text.slice(subjectIndex + 2)).split(' ')[0].match(expr)) {
            console.log(expr);
            rules[expr]();
        }
    }

    return informationObject;
};


ATMFetcher.prototype.stripUnwanted = function (text) {
    var words = {
        'la circolazione è sospesa': 'sospesa',
        'circolazione sospesa': 'sospesa',
        'la circolazione riprende': 'riprende',
        'la circolazione è normale': 'riprende',
        'la circolazione sta riprendendo': 'riprende',
        'riprende il percorso regolare con rallentamenti': 'rallentamenti',
        'la circolazione subisce rallentamenti': 'rallentamenti',
        'bus di collegamento': 'sospesa',
        'utilizzare il': 'sospesa',
        'prosegue la deviazione': 'deviazione',
        'la circolazione viene effettuata con': 'sospesa'
    };
    for (var strip in words) {
        text = text.replace(strip, words[strip]);
        console.log(text);
    }
    console.log(text);
    return text;
};

ATMFetcher.prototype.getMap = function (callback) {
    // Giromilano trova percorso
    var that = this,
        url = "http://gmmobile.atm-mi.it/wsbw/FullNavigator";
    request(url, function (err, resp, body) {
        if (err) throw err;
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
        if (err) throw err;
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
        if (err) throw err;
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

/*var fetcher = new ATMFetcher('viale fulvio testi', 'milano', 'viale monza', 'milano', {
    mezzi: 1,
    percorso: 0
});*/
//fetcher.twitterNews(['16']);

//fetcher.getRoute(function (data) {
//    console.log(data);
//});
