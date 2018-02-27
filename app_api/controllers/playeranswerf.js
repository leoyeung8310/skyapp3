var ChallengeAnswer = require("../models/challengeanswer");
var PlayerAnswerF = require("../models/playeranswerf");
var jwt = require('jsonwebtoken');
var config = require('../config/database');
var ObjectId = require('mongodb').ObjectID;

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

module.exports.getPlayersAnswersOfAChallengeQuestion = function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded;
    try {
      decoded = jwt.verify(token, config.secret);
    } catch (e) {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
    PlayerAnswerF.find(
      {"questionId": new ObjectId(req.params.id)},
      {"ownerId": 0, "questionId": 0, "tCreate": 0},
      function (err, result) {
        if (err) {
          console.log(err);
          return;
        }
        console.log('result');
        // console.log(result);
        res.json({success: true, msg: result});
      }
    );
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
};



