var twitter = require('twit'),
    fs = require('fs');

function TwitterConnector(channel) {

    this.params = {
        screen_name: channel,
        count: 200,
        trim_user: true,
        include_rts: false,
        exclude_replies: 'true'
    };
}

TwitterConnector.prototype.init = function () {
    fs.readFile('./connectors/twitter/developerkey.json', 'utf8', function (err, data) {
        if (err) throw err;
        keys = JSON.parse(data);
        this.tweeter = new twitter(keys);
        //Scarico lo stream aggiornato
        this.getTimeline();
        //Stream per tenere aggiornate le informazioni
        var stream = this.tweeter.stream('statuses/filter', {
            follow: ['988355810']
        });
        stream.on('tweet', function (data) {
            console.log("Aggiornamento...");
            //            console.log(data);
            this.updateTweets(data);
        }.bind(this));
    }.bind(this));
};

TwitterConnector.prototype.updateTweets = function (tweet) {
    fs.readFile("./connectors/twitter/cache/" + this.params.screen_name, 'utf8', function (err, data) {
        if (err) throw err;
        var tweets = JSON.parse(data);
        //Se aggiornando mi accorgo che le informazioni a mia disposizione
        //sono vecchie (più di un giorno), le cancello.
        console.log("------");
        console.log(tweets[0].created_at);
        console.log(new Date(tweets[0].created_at));
        console.log(new Date().setHours(0, 0, 0));
        console.log(new Date(tweets[0].created_at) < new Date().setHours(0, 0, 0));
        console.log("------");

        if (new Date(tweets[0].created_at) < new Date().setHours(0, 0, 0)) {
            tweets = [];
        }
        //aggiungo nuovi messaggi in testa
        tweets.unshift(tweet);
        this.write(tweets);
    }.bind(this));
};

TwitterConnector.prototype.write = function (data) {
    fs.writeFile("./connectors/twitter/cache/" + this.params.screen_name, JSON.stringify(data), function (err) {
        if (err) throw err;
        console.log("Scrittura...");
        console.log(data);
    }.bind(this));
};

TwitterConnector.prototype.getTimeline = function () {
    this.tweeter.get('statuses/user_timeline', this.params, function (err, data) {
        if (err) throw err;
        this.write(data);
    }.bind(this));
};


module.exports = TwitterConnector;
//var twitt = new TwitterConnector("atm_informa");
//twitt.init();
