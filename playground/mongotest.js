const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://user1:password1@ds235181.mlab.com:35181/app-testdb', {useNewUrlParser: true},(err, client) => {
  if(err){
    return console.log('Error connecting db');
  }

  console.log('Connected to mongo db');
  const db = client.db('app-testdb');
  db.collection('ToDos').insertOne({
    text : 'Something to do',
    completed : false
  },(err, result)=>{
    if(err){
      return console.log('Error inserting record.');
    }

    console.log(JSON.stringify(result.ops, undefined, 2));
  });

  client.close();
});
