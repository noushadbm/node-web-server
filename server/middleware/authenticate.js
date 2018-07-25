const {User} = require('./../models/user');

//Middleware
var authenticate = (req, res, next) => {
  var token = req.header('x-auth');

  User.findByToken(token).then((user)=>{

    if(!user){
      //instead of directly returning 401, can reject this promise and flow goes
      // to catch block where it returns 401
      //res.status(401).send();
      //Promise.reject('--User not found--'); // This doesnt work
      throw '--User not found--';
    }

    req.user = user;
    req.token = token;

    //res.send(user);
    next();
  }).catch((e)=>{
    console.log(e);
    res.status(401).send();
  });
}

module.exports = {authenticate};
