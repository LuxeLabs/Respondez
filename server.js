var http = require('http');
var port = process.env.PORT || 1337;
var app  = require('./controllers/app');

http.createServer(app).listen(port, function () {
   console.log('Listening on ' + port);
});
