let express = require('express');
let port = process.env.PORT || 3000;
let app = express();
app.get('/', function (req, res) {
 res.send(JSON.stringify({ Hello: 'World'}));
});
app.get('/health', function (req, res) {
    res.send('Good connection');
   });
app.listen(port, function () {
 console.log('Example app listening on port !');
});