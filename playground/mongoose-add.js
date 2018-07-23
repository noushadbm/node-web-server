var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/app-testdb', { useNewUrlParser: true });

var ToDo = mongoose.model('ToDo', {
  text: { type: String },
  completed: { type: Boolean },
  completedAt: { type: Number }
});

var newTodo = new ToDo({
  text: 'Cook Breakfast',
  completed: false
});

newTodo.save().then((doc)=>{
  console.log(doc);
},(err)=>{
  console.log('Failed to save.', err);
});
