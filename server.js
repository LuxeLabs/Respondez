var http = require('http');
var port = process.env.PORT || 1337;
var app  = require('./controllers/app');

if (!process.env.UPDATE_PHONE) throw Error('Missing: process.env.UPDATE_PHONE');
if (!process.env.UPDATE_EMAIL) throw Error('Missing: process.env.UPDATE_EMAIL');
if (!process.env.TWILIO_PHONE) throw Error('Missing: process.env.TWILIO_PHONE');
if (!process.env.TWILIO_SID) throw Error('Missing: process.env.TWILIO_SID');
if (!process.env.TWILIO_TOKEN) throw Error('Missing: process.env.TWILIO_TOKEN');
if (!process.env.SENDGRID_KEY) throw Error('Missing: process.env.SENDGRID_KEY');
if (!process.env.MONGO_CONNECTION) throw Error('Missing: process.env.MONGO_CONNECTION');

http.createServer(app).listen(port, function () {
   console.log('Listening on ' + port);
});
