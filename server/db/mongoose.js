var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var mongoDbUrl = process.env.MONGO_URL;
console.log("mongo URL:" + mongoDbUrl);

mongoose.connect(mongoDbUrl, {useNewUrlParser: true});

// module.exports = {
//   mongoose: mongoose
// };

module.exports = { mongoose};
