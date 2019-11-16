let express = require('express');
let googleTrends = require('google-trends-api');
let port = process.env.PORT || 3000;
let app = express();

app.get('/', function (req, res) {
    res.send(JSON.stringify({ Hello: 'World'}));
});

app.get('/health', function (req, res) {
    res.send('Great connection');
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

app.listen(port, function () {
    console.log('Example app listening on port !');
});
