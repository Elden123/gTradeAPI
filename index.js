const express = require('express');
const googleTrends = require('google-trends-api');
const app = express();
const port = 3000;

app.get('/health', function (req, res) {
    res.status(200);
    res.send('Good connection');
});

app.get('/trends/', function (req, res) {
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
  googleTrends.realTimeTrends({
      geo: 'US',
      category: 'b',
    }, function(err, results) {
      if (err) {
        res.send(err);
      }else{
        var companyName=req.params.company.toLowerCase();
        var firstLetter=companyName.charAt(0).toLowerCase();
        console.log("Searching for " + companyName + " and the first letter is "+ firstLetter)
        for(i in results){
          //console.log(results[i])
          var match=false;
          if (results[i].toLowerCase()==firstLetter.toLowerCase()){
            console.log("found firstLetter " + firstLetter);
            match=true;
            for(let j=0; j<companyName.length; j++){
              if(results[i+j].toLowerCase()==companyName.charAt(j).toLowerCase()){
                console.log("letter matches at index " + j + "letter is "+ companyName.charAt(j))
              }
              else{
                console.log("letter doesn't match at index" + j)
                match=false;
              }
            }
            if(match==true){
              console.log("Found string "+companyName)
            }
            else{
              console.log("Does not match"+companyName)
            }
          }

        }
        res.send(results);
      }
    });
});


// app.get('/trends/:company', function (req, res) {
//     //res.send("Trend for company: " + req.params.company);
//     googleTrends.interestOverTime({keyword: ""+req.params.company})
//       .then(function(results){
//         res.send('Trend for company: ' + results);
//       })
//       .catch(function(err){
//         res.send('Error: '+err);
//     });
//
// });

app.listen(port, () => console.log(`API listening on port ${port}!`));