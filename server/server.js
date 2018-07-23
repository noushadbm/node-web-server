var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {ToDo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new ToDo({
    text: req.body.text
  });

  todo.save().then((doc)=>{
    console.log(doc);
    res.send(doc);
  }, (err)=> {
    console.log(err);
    res.status(400).send({error: err.message});
  });
});

app.listen(3000, () => {
  console.log('Servar started...');
});
