const MongoClient = require('mongodb').MongoClient;

//mongodb://127.0.0.1:27017
//mongodb://user1:password1@ds235181.mlab.com:35181/app-testdb
MongoClient.connect('mongodb://127.0.0.1:27017', {useNewUrlParser: true},(err, client) => {
  if(err){
    return console.log('Error connecting db');
  }

  console.log('Connected to mongo db');
  const db = client.db('app-testdb');
  db.collection('ToDos').find({completed: false}).toArray().then((docs) => {
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err) => {
    console.log('Unable to fetch the data');
  });

  client.close();
});
