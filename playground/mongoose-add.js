var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/app-testdb', { useNewUrlParser: true });

var ToDo = mongoose.model('ToDo', {
  text: { type: String },
  completed: { type: Boolean },
  completedAt: { type: Number }
});

var newTodo = new ToDo({
  text: 'Double save test2',
  completed: false
});

newTodo.save().then((todo)=>{
  console.log('First call...' + todo);
  todo.completed = true;
  todo.save().then((second)=>{
    console.log('Second call...' + second);
  });

},(err)=>{
  console.log('Failed to save.', err);
});
