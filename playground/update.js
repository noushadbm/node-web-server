const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

//mongodb://127.0.0.1:27017
//mongodb://user1:password1@ds235181.mlab.com:35181/app-testdb
MongoClient.connect('mongodb://127.0.0.1:27017', {useNewUrlParser: true},(err, client) => {
  if(err){
    return console.log('Error connecting db');
  }

  console.log('Connected to mongo db');
  const db = client.db('app-testdb');
  db.collection('ToDos').findOneAndUpdate({
    _id: new ObjectID("5b50345ed2a1c9392813f66f")
  },
  {
    $set: {
      'completed' : true
    }
  },
  {
    returnOriginal : false
  }).then((result) => {
    console.log(result);
  },(error) => {
    console.log('Failed to update.', error);
  });

  //client.close();
});
