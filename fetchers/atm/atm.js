var request = require('request');
var cheerio = require('cheerio');
//request = request.defaults({jar: true})
    //npm install tough-cookie

function ATMFetcher(partenza,comuneS, arrivo,comuneE, opzioni){
    url = "http://gmmobile.atm-mi.it/wsbw/SoluzioniFreqMode";

    var query = {
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
        'opzioni': '0',
        'txtbwDateDay':'19',
        'txtbwDateMonth':'07',
        'txtbwDateYear':'2014',
        'txtbwTimeHour':'11',
        'txtbwTimeMinute':'55'
    };
   
    var options = { 
        url: url,
        headers: {'User-Agent':'NokiaN97i/SymbianOS/9.1 Series60/3.0'}
    };

    request.post(options, function(err, resp, body){
        console.log(body);
    }).form(query);
}

module.exports = ATMFetcher;
ATMFetcher('viale fulvio testi 1','milano','viale monza 3','milano','');
