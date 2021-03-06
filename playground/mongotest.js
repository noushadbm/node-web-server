const MongoClient = require('mongodb').MongoClient;

//mongodb://127.0.0.1:27017
//mongodb://user1:password1@ds235181.mlab.com:35181/app-testdb
MongoClient.connect('mongodb://127.0.0.1:27017', {useNewUrlParser: true},(err, client) => {
  if(err){
    return console.log('Error connecting db');
  }

  console.log('Connected to mongo db');
  const db = client.db('app-testdb');
  db.collection('ToDos').insertOne({
    text : 'Walk the dog',
    completed : false
  },(err, result)=>{
    if(err){
      return console.log('Error inserting record.');
    }

    console.log(JSON.stringify(result.ops, undefined, 2));
  });

  client.close();
});
