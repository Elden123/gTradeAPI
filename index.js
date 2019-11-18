let express = require('express');
let googleTrends = require('google-trends-api');
let port = process.env.PORT || 3000;
let app = express();
//let sentiment = require('Sentiment.js');

app.get('/', function (req, res) {
    res.send(JSON.stringify({ Hello: 'World'}));
});

app.get('/health', function (req, res) {
    res.send('Great connection');
});

app.get('/trend/', function (req, res) {
    //res.send("All company trends");
    googleTrends.realTimeTrends({
        geo: 'US',
        category: 'b',
      }, function(err, results) {
        if (err) {
          res.send(err);
        }else{
          res.send(results);
        }
      });
});

app.get('/trends/:company', function (req, res) {
  //res.send("All company trends");
  var companyName=req.params.company.toLowerCase();
  // res.send(companyName);
  googleTrends.interestOverTime({keyword: companyName, startTime: new Date(Date.now() - (7 * 24 * 60 * 60 * 1000))}, function(err, results) {
    if (err) res.send('oh no error!', err);
    else res.send(results);
  });
});

app.get('/sentiment', function (req, res) {
  //res.send("All company trends");
      var result = [];
      sentiment.getSentiment('https://www.breitbart.com/clips/2019/11/03/trump-i-think-nancy-pelosi-has-lost-her-mind/', 'Nancy').then(analysisResults => {
        result.push(analysisResults.result.sentiment.targets[0].label);
        result.push(analysisResults.result.sentiment.targets[0].score);
        res.send(results);
        console.log(result);
      })
      .catch(err => {
        console.log('error:', err);
      });
});

app.listen(port, function () {
    console.log('Example app listening on port !');
});
