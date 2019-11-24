let express = require('express');
let googleTrends = require('google-trends-api');
let port = process.env.PORT || 3000;
let app = express();
let sentiment = require('./Sentiment');
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('f88adea34f584c2ba358c1ce0783eb78');

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
      res.send('ERROR: ', err);
    }
    else{
      let results1=JSON.parse(results);
      //res.send(results1);
      console.log("\n");
      console.log(companyName)
      for(i in results1.default.timelineData){
        console.log(results1.default.timelineData[i].value);
      }

      if(results1.default.timelineData[6].value[0]==100){
        console.log(companyName+" IS trending!");
        let trendingDiff=100-results1.default.timelineData[5].value[0]
        console.log("Trend increase points: "+trendingDiff);
        res.send("trending" + "+" + trendingDiff);
      }
      else{
        console.log(companyName+" is NOT trending :(")
        var lastTrending=results1.default.timelineData[0].formattedTime;
        for(i in results1.default.timelineData){
          if(results1.default.timelineData[i].value[0]==100){
            lastTrending=results1.default.timelineData[i].formattedTime;
          }
        }
        console.log(companyName+" was last trending on "+lastTrending)
        res.send("not trending" + "+" + lastTrending);
      }
    }
  });
});

app.use(express.json());
app.get('/sentiment/:company', function (req, res) {
  //res.send("All company trends");
      var result = [];
      //'https://www.breitbart.com/clips/2019/11/03/trump-i-think-nancy-pelosi-has-lost-her-mind/', 'Nancy'
      let company = req.params.company;
      let url = req.body.url
      
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

app.get('/links/:company', function (req, res) {
  let urlArray = [];
  let company = req.params.company;
  let newsArticles = newsapi.v2.everything({
      qinTitle: '+' + company,
      q: '+' + company,
      sortBy: 'relevancy',
      language: 'en'
  }).then(response => {
      for (let i = 0; i < response.articles.length; i++)
      {
          // Push URL strings onto array 
          urlArray.push(response.articles[i].url);
      }
      //console.log(urlArray);
      res.send(urlArray);
  }).catch(() => {
      console.log("An error has occured while getting news links");
      res.send([]);
  });
});

app.listen(port, function () {
    console.log('Example app listening on port !');
});
