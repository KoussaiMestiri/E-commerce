const User = require('../models/User')
const jwt = require('jsonwebtoken') // to generate signed token
const expressJwt = require('express-jwt') //used to check authorization 
const {errorHandler} = require('../helpers/dbErrorHandlers')



exports.signup = (req, res) => {
    const user = new User(req.body);
    user.save((err, user) => {
        if(err) {
            return res.status(400).json({
                err: errorHandler(err)
            });
        }
        res.json({user});
    });
};

exports.signin = (req, res) => {
    //find the user based on the email
    const {email, password} = req.body
    User.findOne({"profile.email": email}, (err, user) => {
        if(err || !user){
            return res.status(400).json({
                error: "User is Not Found!"
            });
        }
        // if user if found we check the email and pass id correct
        //create auth in user model 
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: 'Email and password not correct'
            });
        }
        User.findOneAndUpdate({_id: user._id}, {$push: {"profile.history.loggedAt": Date.now()}}, {new: true}, (err, user) => {
            if(err) {
                return res.status(400).json({
                    error: "You Are Not Authorized Tp Perform This Action"
                });
            }});
        //generate a signed token with user id and secret
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET)
        //persist the token as 't' in cookie with expiry date
        res.cookie('t', token, {expire: new Date() + 9999});
        //return response with user and token to frontend client
        const{_id, name, email, role} = user
        return res.json({token, user: {_id, email, name, role}});
    });

}

exports.signout = (req, res) => {
    res.clearCookie('t');
    res.json({message: "Sign Out success"});
}

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"], 
    userProperty: "auth",
  });


  exports.isAuth = (req, res, next) => {
      let user = req.profile && req.auth && req.profile._id == req.auth._id
      if(!user) {
          return res.status(400).json({
              error: "Access Denied"
          })
      }
      next();
  }

  exports.isAdmin = (req, res, next) => {
      if(req.profile.role === 0) {
          return res.status(403).json({
              error: "Admin privilege"
          });
        };
        next();
  }