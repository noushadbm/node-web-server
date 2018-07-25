const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
  email : {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: (value) => {
        return validator.isEmail(value);
      },
      message: "{VALUE} is not a valid email"
    }
  },
  password : {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access:{
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

UserSchema.methods.toJSON = function(){
  var user = this;
  var userObject = user.toObject();
  return _.pick(userObject, ['_id', 'email']);
}

UserSchema.methods.generateAuthToken = function() {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString()}, 'abc123').toString();

  user.tokens = user.tokens.concat([{access, token}]);

  return user.save().then(()=>{
    return token;
  });
}

UserSchema.statics.findByToken = function(token){
  var User = this;
  var decoded;

  try{
    decoded = jwt.verify(token, 'abc123');
  } catch(e) {
    // return new Promise((resolve, reject)=>{
    //   reject();
    // });
    return Promise.reject('Failed to decode token');
  }
  // returning a promise to make chain in server.js
  return User.findOne({
    '_id': decoded._id,
    'tokens.token' : token,
    'tokens.access' : 'auth'
  });
};

//This will be called before the model is saved to db
UserSchema.pre('save',function (next){
  var user = this;
  if(user.isModified('password')){
    bcrypt.genSalt(10, (err, salt)=>{
      //console.log('-----Breakpoint 1');
      if(err){
        console.log(err);
      }
      bcrypt.hash(user.password, salt, (err, hash)=>{
        if(err){
          console.log(err);
        }
        user.password = hash;
        //console.log('--continue---');
        next();
      });
    });
  } else {
    next();
  }
});

UserSchema.statics.findByCredentials = function(email, password) {
  //var User = this;
  console.log('findByCredentials called.');
  return User.findOne({email})
  .then((user)=>{
    console.log("User in DB:" + user);
    if(!user){
      return Promise.reject('User not found.');
    }

    return new Promise((resolve, reject)=>{
      console.log('Checking password.');
      console.log("password:" + password);
      console.log("user.password:" + user.password);
      bcrypt.compare(password, user.password, (err, result)=>{
        console.log("result:" + result);
        if(result){
          // Promise need to return user object to handle it in server.js
          resolve(user);
        } else {
          reject('Invalid credentials.');
        }
      });
    });
  });
}

var User = mongoose.model('User', UserSchema);

module.exports = {User};
