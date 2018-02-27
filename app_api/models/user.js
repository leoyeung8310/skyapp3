var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var validator = require('../lib/validator');

var UserSchema = new Schema({
  account: {
    type: String,
    required: true,
    unique: true,
    validate:[validator({
      length:{
        min:6,
        max:20
      }
    }), "length must be between 6 to 20 characters"]
  },
  password: {
    type: String,
    required: true,
    validate:[validator({
      length:{
        min:6,
        max:254
      }
    }), "length must be between 6 to 254 characters"]
  },
  fullName: {
    type: String,
    required: true,
    validate:[validator({
      length:{
        min:3,
        max:25
      }
    }), "length must be between 3 to 25 characters"]
  },
  nickName: {
    type: String,
    validate:[validator({
      length:{
        min:3,
        max:25
      }
    }), "length must be between 3 to 25 characters"]
  },
  email: {
    type: String
  },
  type: {
    type: String,
    required: true,
    default: 'Learner'
  },
  schoolName: {
    type: String
  },
  class: {
    type: String
  },
  serverLoc: {
    type: String,
    default: 'localhost'
  },
  language: {
    type: String,
    default: 'tc' //en or tc
  },
  tRegister: {
    type: Date,
    default: Date.now
  },
  tLastLogin: {
    type: Date
  },
  tLastUpdate: {
    type: Date,
    default: Date.now
  }
});

UserSchema.pre('save', function (next) {
  var user = this;
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, null, function (err, hash) {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

UserSchema.methods.comparePassword = function (passw, cb) {
  bcrypt.compare(passw, this.password, function (err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);
