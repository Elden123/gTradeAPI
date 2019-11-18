let express = require('express');
let googleTrends = require('google-trends-api');
let port = process.env.PORT || 3000;
let app = express();
//var sentiment = require('./Sentiment');

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
  googleTrends.interestOverTime({keyword: companyName, startTime: new Date(Date.now() - (8 * 24 * 60 * 60 * 1000))}, function(err, results) {
        if (err){
          res.send('oh no error!', err);
        }
        else{
          let results1=JSON.parse(results);
          res.send(results1);
          try{
            console.log(Object.keys(results1));
            for(i in results1.default.timelineData){
              console.log(results1.default.timelineData[i].value);
            }
            if(results1.default.timelineData[6].value[0]==100){
              console.log(companyName+" IS trending!");
            }
            else{
              console.log(companyName+" is NOT trending :(")
            }
          }
          catch(error){
            console.log(error);
          }
        }
  });
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
