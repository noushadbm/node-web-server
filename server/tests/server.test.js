const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const{app} = require('./../server');
const{ToDo} = require('./../models/todo');

//require("leaked-handles");

const defaultRecords = [{
  _id: new ObjectID(),
  text: 'First record'
},{
  _id: new ObjectID(),
  text: 'Second record'
}];

// Clear of DB before each test case
beforeEach((done)=>{
  ToDo.remove({}).then(()=>{
    return ToDo.insertMany(defaultRecords);
  }).then(()=> done());
});

describe('POST /todos', ()=>{
  var text = 'Text to test';
  it('It should create new todo', (done)=>{
    //console.log('----------------------------');
    request(app)
    .post('/todos')
    .send({text})
    .expect(200)
    .expect((res)=>{
      expect(res.body.text).toBe(text);
    })
    .end((err, res)=>{
      if(err){
        return done(err);
      }

      ToDo.find({text}).then((todos)=>{
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((err)=> done(err));
    });
  });

  it('It sould not create new todo',(done)=>{
    //console.log('----------------------------');
    request(app)
    .post('/todos')
    .send({})
    .expect(400)
    .end((err, res)=>{
      if(err){
        return done(err);
      }

      ToDo.find().then((todos)=>{
        expect(todos.length).toBe(2); //expect 2 default records
        done();
      }).catch((err)=> done(err));
    });
  })
});

describe('GET /todos', ()=>{
  it('Should get all todos', (done)=>{
    request(app)
    .get('/todos')
    .expect(200)
    .expect((res)=>{
      expect(res.body.todos.length).toBe(2);
    })
    .end(done);
  });
});

describe('GET /todos/:id', ()=>{
  //console.log(defaultRecords);
  //console.log(`/todos/${defaultRecords[0]._id.toHexString()}`);
  it('Should return one todo records',(done)=>{
    request(app)
    .get(`/todos/${defaultRecords[0]._id.toHexString()}`)
    .expect(200)
    .expect((res)=>{
      //console.log(res.body);
      expect(res.body.todo.text).toBe(defaultRecords[0].text);
    })
    .end(done);
  });

  it('Should return 404 when todo not found',(done)=>{
    newId = new ObjectID();
    request(app)
    .get(`/todos/${newId.toHexString()}`)
    .expect(404)
    .end(done);
  });

  it('Should return 404 for non-ObjectIDs',(done)=>{
    request(app)
    .get('/todos/12345')
    .expect(404)
    .end(done);
  });
});

describe('DELETE /todos/:id', ()=>{
  it('Should delete a record',(done)=>{
    var hexId = defaultRecords[1]._id.toHexString();
    request(app)
    .delete(`/todos/${hexId}`)
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo._id).toBe(hexId);
    })
    .end((err, result)=>{
      if(err) {
        return done(err);
      }

      ToDo.findById(hexId)
      .then((todo)=>{
        expect(todo).toNotExist();
        done();
      })
      .catch((e)=> done(e));
    });
  });

  it('Should return 404 if todo not found',(done)=>{
    newId = new ObjectID();
    request(app)
    .delete(`/todos/${newId.toHexString()}`)
    .expect(404)
    .end(done);
  });

  it('Should return 404 for non-ObjectId',(done)=>{
    newId = new ObjectID();
    request(app)
    .delete('/todos/12345')
    .expect(404)
    .end(done);
  });
});

describe('PATCH /totos/:id',()=>{
  it('Should update the todo records',(done)=>{
    var newText = 'This is changed text';
    request(app)
    .patch(`/todos/${defaultRecords[0]._id.toHexString()}`)
    .send({text:newText, completed: true})
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo.text).toBe(newText);
      expect(res.body.todo.completed).toBe(true);
      expect(res.body.todo.completedAt).toBeA('number');
    })
    .end(done);
  });

  it('Should not update \'completeAt\'',(done)=>{
    request(app)
    .patch(`/todos/${defaultRecords[1]._id.toHexString()}`)
    .send({completed: false})
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo.completed).toBe(false);
      expect(res.body.todo.completedAt).toNotExist();
    })
    .end(done);
  });
});
