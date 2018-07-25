const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const {mongoose} = require('./db/mongoose');
const {ToDo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');
const ObjectId = mongoose.Types.ObjectId;

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

app.get('/todos/:id', (req, res) => {
  var id = req.params.id;

  if(!ObjectId.isValid(id)){
    return res.status(404).send();
  }

  ToDo.findById(id).then((todo)=>{
    if(!todo){
      return res.status(404).send();
    }

    res.send(todo);
  }, (err)=>{
    res.status(400).send(err.message);
  });
});

app.delete('/todos/:id', (req, res)=>{
  var id = req.params.id;

  if(!ObjectId.isValid(id)){
    return res.status(404).send();
  }

  ToDo.findByIdAndRemove(id)
  .then((todo)=>{
    if(!todo){
      return res.status(404).send();
    }

    res.send(todo);
  })
  .catch((err)=>{
    res.status(400).send(err.message);
  });
});

app.patch('/todos/:id', (req, res)=>{
  var id = req.params.id;

  if(!ObjectId.isValid(id)){
    return res.status(404).send();
  }

  var body = _.pick(req.body, ['text','completed']);
  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  ToDo.findByIdAndUpdate(id, {$set: body}, {new: true})
  .then((todo)=> {
    if(!todo){
      return res.status(404).send();
    }

    res.send({todo});
  })
  .catch((e)=>{
    res.status(400).send();
  });
});

// ADD user
app.post('/users', (req, res)=>{
  var body = _.pick(req.body, ['email','password']);
  var user = new User(body);
  user.save().then((user)=>{
    //res.send(user);
    return user.generateAuthToken();
  }).then((token)=>{
    res.header('x-auth', token).send(user);
  }).catch((err)=>{
    res.status(400).send(err.message);
  });
});

//User login route
app.post('/users/login', (req, res)=>{
  var body = _.pick(req.body, ['email','password']);

  User.findByCredentials(body.email, body.password)
  .then((user)=>{
    //res.send(user);
    user.generateAuthToken().then((token)=>{
      res.header('x-auth', token).send(user);
    });
  })
  .catch((err)=>{
    console.log('Failed');
    res.status(401).send();
  });
});

// Get user from token
app.get('/users/me', authenticate, (req, res)=>{
    // request will come here from middleware
    res.send(req.user);
});

app.delete('/users/me/token',authenticate, (req, res)=>{
  // in 'authenticate' method user and token is set to request
  req.user.removeToken(req.token).then(()=>{
    res.status(200).send();
  }).catch((err)=>{
    res.status(400).send();
  });
});

app.listen(port, () => {
  console.log(`Servar started with port ${port}`);
});
