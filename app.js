var express = require('express');
var hbs = require('hbs');

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

app.get('/', function(req, resp){
  console.log('Request received...');
  //resp.send('<h1>Hello world</h1><br><h2>' + new Date() + '</h2>');
  resp.render('home.hbs',{
    message : 'This is home page',
    dateString : new Date()
  });
});

app.listen(8080, '192.168.0.116', function(){
  console.log("Server started");
});
