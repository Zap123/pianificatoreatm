var Parsimmon = require('parsimmon')

var util = require('util');
var regex = Parsimmon.regex;
var string = Parsimmon.string;
var optWhitespace = Parsimmon.optWhitespace;
var lazy = Parsimmon.lazy;
var seq = Parsimmon.seq
var letters = Parsimmon.letters
var alt = Parsimmon.alt
var takeWhile = Parsimmon.takeWhile

rule = []

var tram = seq(
    string('e').atMost(1),
    optWhitespace,
    string('#'), 
    letters,
    Parsimmon.digits, 
    optWhitespace).many()
    .map(function(x) {
        trams = x.map(function(t) { return t[3]+t[4]} )
        if (trams.length > 0)
            rule.push({name: trams, dest:[]})
    })

function lexeme(p) { return p.skip(optWhitespace); }

var city = Parsimmon.custom(function(success, failure) {
    return function(stream, i) {
        var result = ""

        while (i < stream.length) {
            var c = stream.charAt(i)
            if (c == 'e' && stream.slice(i, i+3) == 'e #') {
                return success(i+1, result)
            }

            if (c == ',') {
                return success(i+1, result)
            }

            if (c == ':') {
                return success(i, result)
            }

            result += c

            i++
        }
        return success(i+1, result)
    }
});


var to = seq(optWhitespace,
             string('>'), 
             optWhitespace,
             city).map(
    function(x) {
        rule[rule.length-1].dest.push({to: x[3]})
    })

var desc = Parsimmon.takeWhile(
        function(x) { 
            return x != ';' && x != ',' && x != '#' })
        .map(function(x) {
            //console.log("Message: " + x)

            var t = rule[rule.length-1]
            var d = t.dest[t.dest.length-1]

            if (d)
                d.message=x
            else
                t.dest.push({message: x})
        })

var parser = seq(
    seq(
        tram,
        to
        ).many(),
    takeWhile (function(x) { return x != ':' }),
    string(':'),
    desc
).many()

//parser.parse('#bus54 > Lambrate, #bus61 > Murani e #busX73 > Linate: deviano da c.so Indipendenza a c.so Plebisciti (urto tra mezzi privati). #ATM #Milano');
//parser.parse('#bus54 > Lambrate: ciao; #bus61 > Murani e #busX73 > Linate: deviano da c.so Indipendenza a c.so Plebisciti (urto tra mezzi privati). #ATM #Milano');
//parser.parse('#tram14 e #bus90 #bus91: riprendono il percorso regolare con rallentamenti dopo deviazione per urto tra privati. #ATM #Milano');
//parser.parse('#tram16 > Segesta: riprende il percorso regolare. #tram16 > Monte Velino: prosegue la deviazione tra largo d’Ancona e piazzale Baracca.');
//parser.parse('#bus54 > Lambrate, #bus61 > Murani e #busX73 > Linate: deviano da c.so Indipendenza a c.so Plebisciti (urto tra mezzi privati). #ATM #Milano');

//parser.parse('#tram16 &gt; Segesta: riprende il percorso regolare. #tram16 &gt; Monte Velino: prosegue la deviazione tra largo d’Ancona e piazzale Baracca.'.replace(/&gt;/g, '>'))

console.log(util.inspect(rule, {depth: 12}))













