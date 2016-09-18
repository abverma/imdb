var request = require('request');

var stdin = process.stdin;
var stdout = process.stdout;
var protocol = 'http://'
var url = 'www.omdbapi.com';
var path = '/?t={title}&y=&plot=short&r=json';
var question = 'Enter a title to search';
var fetchTime = 'Fetch time';

process.stdin.resume();
process.stdin.setEncoding('utf8');

console.log('******** IMDB Search *********');
stdout.write(question + ": ");

stdin.on('data', function (text) {
    if (text === 'quit\n') {
        done();
    }

    path = path.replace('{title}', text.trim());
    console.time(fetchTime);
    fetchResult(protocol + url + path)
        .then(function (result) {
            console.log(result);
            console.timeEnd(fetchTime);
            done();
        })
        .catch(function(err){
            console.log(err);
            done();
        })
    console.log('Getting your details....');
});

function done() {
    process.exit(0);
}

var fetchResult = function (uri) {
    return new Promise(function (resolve, reject) {
        request(uri, function (err, response, body) {
            if (err)
                reject(err);
            else {
                body = JSON.parse(body);
                //body = body.Search[0];
                if (body.Response && body.Response === 'False')
                    reject(body.Error);
                else {
                    var result = '';
                    result += ('Title:       ' + body.Title);
                    result += ('\nImdb Id:     ' + body.imdbID);
                    result += ('\nRating:      ' + body.imdbRating);
                    result += ('\nPlot:        ' + body.Plot);
                    if (body.Type = 'series' && body.totalSeasons)
                        result += ('\nLast season: ' + body.totalSeasons);
                    resolve(result);
                }
            }            
        });
    })

}