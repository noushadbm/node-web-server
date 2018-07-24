var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {ToDo} = require('./models/todo');
var {User} = require('./models/user');

var port = process.env.PORT || 3000;

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

app.get('/todos', (req, res) => {
  ToDo.find().then((todos)=>{
    res.send({todos});
  }, (err)=>{
    res.status(400).send({error: err.message});
  });
});

app.listen(port, () => {
  console.log(`Servar started with port ${port}`);
});
