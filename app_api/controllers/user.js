var User = require("../models/user");
var jwt = require('jsonwebtoken');
var config = require('../config/database');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

/* /api/signup */
/* Sign Up */
// 403 means validation fail
module.exports.signUp = function(req, res) {
  // required keys
  if (!req.body.account || !req.body.password || !req.body.fullName) {
    sendJSONresponse(res, 403, {success: false, msg: 'Please enter account name, password and full name.'});
    // res.json({success: false, msg: 'Please enter account name, password and full name.'});
  } else if (req.body.code !== config.code) {
    sendJSONresponse(res, 403, {success: false, msg: 'Wrong passcode.'});
  } else if (req.body.password !== req.body.confirmPassword) {
    sendJSONresponse(res, 403, {success: false, msg: 'Passwords do not match.'});
  }  else {
    // possible input keys
    var newUser = new User({
      account: req.body.account,
      password: req.body.password,
      fullName: req.body.fullName,
      nickName: req.body.nickName,
      email: req.body.email,
      type: req.body.type,
      schoolName: req.body.schoolName,
      class: req.body.class,
      serverLoc: req.body.serverLoc,
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        // console.log(err);
        // handling many error messages, including duplicated account name, length error, etc
        return sendJSONresponse(res, 403, {success: false, msg: err.message});
      }
      sendJSONresponse(res, 200, {success: true, msg: 'Successfully created a new user.'});
    });
  }
};

/* /api/signin */
/* Sign in */
// 401 means authentication failed
module.exports.signIn = function(req, res) {
  User.findOne({
    account: req.body.account
  }, function(err, user) {
    if (err) throw err;
    if (!user) {
      res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // update last login and update time
          User.update(
            {account: req.body.account},
            {tLastLogin: Date.now(), tLastUpdate: Date.now()}).exec(function (err, result) {
            if (err) throw err;
            // if user is found and password is right create a token
            var token = jwt.sign(user.toObject(), config.secret);
            // return the information including token as JSON
            res.json({
              success: true,
              token: 'JWT ' + token,
              id: user._id,
              account: user.account,
              fullName: user.fullName,
              email: user.email,
              serverLoc: user.serverLoc,
              type: user.type,
              language: user.language
            });
          });
        } else {
          res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
};

/*
User.findOneAndUpdate({account: req.body.account},{tLastLogin: Date.now},{upsert: true},function(err, user) {
  if (err) throw err;
  // if user is found and password is right create a token
  var token = jwt.sign(user.toObject(), config.secret);
  // return the information including token as JSON
  res.json({
    success: true,
    token: 'JWT ' + token,
    account: user.account,
    fullName: user.fullName,
    email: user.email,
    serverLoc: user.serverLoc,
    type: user.type,
    language: user.language
  });
})
  */
