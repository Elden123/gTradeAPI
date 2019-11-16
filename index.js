let express = require('express');
let googleTrends = require('google-trends-api');
let port = process.env.PORT || 3000;
let app = express();
var sentiment = require('./Sentiment');

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
  let company=req.query.company;
  res.send(company+"\n");
  googleTrends.interestByRegion({keyword: company, startTime: new Date('2019-11-15'), endTime: new Date('2019-11-16'), geo: 'US'});
  // .then((results) => {
  //   res.send(results);
  // })
  // .catch((err) => {
  //   res.send(err);
  // })
});

app.get('/sentiment/:url/:company', function (req, res) {
  //res.send("All company trends");
      var result = [];
      //'https://www.breitbart.com/clips/2019/11/03/trump-i-think-nancy-pelosi-has-lost-her-mind/', 'Nancy'
      let company=req.query.company;
      let url=req.query.url;
      sentiment.getSentiment(url, company).then(analysisResults => {
        result.push(analysisResults.result.sentiment.targets[0].label);
        result.push(analysisResults.result.sentiment.targets[0].score);
        res.send(result);
        console.log(result);
      })
      .catch(err => {
        console.log('error:', err);
      });
});

app.listen(port, function () {
    console.log('Example app listening on port !');
});
