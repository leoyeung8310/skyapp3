var ChallengeQuestion = require("../models/challengequestion");
var ChallengeAnswer = require("../models/challengeanswer");
var PlayerAnswerF = require("../models/playeranswerf");
var PlayerResultF = require("../models/playerresultf");
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

/* /api/challengequestion */
/* get all challengequestion */
// db.challengequestions.find({},{ "paper": 0, "ChallengerAnswers": 0}).toArray();
module.exports.getAllChallengeQuestions = function(req, res) {
  // this function does not require token.
  // 1) find all challengess
  ChallengeQuestion.find({}, {"paper": 0, "ChallengerAnswers": 0}, function (err, questions) {
    if (err) {
      console.log(err);
      return;
    }
    // 2) count of challengess
    ChallengeQuestion.count({}, function(err, c) {
      if (err) {
        console.log(err);
        return;
      }
      questions['countOfChallengeQuestion'] = c;
      // 3) count of submission + revision
      ChallengeAnswer.aggregate([
        { $match: {
          }},
        { $group: {
            _id: null,
            total : {
              $sum : "$numOfSubmission"
            }
          }}
      ], function (err, s) {
        if (err) {
          console.log(err);
          return;
        }
        ChallengeAnswer.find(
          {},
          {"_id":1, "submittedAnswers": 1},
          function (err, result) {
            if (err) {
              console.log(err);
              return;
            }
            var attempts = 0;
            for (var i = 0; i < result.length; i++) {
              for (var j = 0; j < result[i]['submittedAnswers'].length; j++) {
                attempts += result[i]['submittedAnswers'][j][1];
              }
            }
            res.json({
              success: true,
              msg: questions,
              countOfChallengeQuestions:c,
              countOfSubmissions:s[0]===undefined?0:s[0]['total'],
              countOfSubmittedAnswers:attempts
            });
          }
        );
      });
    });
  });
};

/* /api/challengequestion */
/* get a challengequestion */
// db.challengequestions.find({"_id": ObjectId("5a3c90e61862dd0a744ffade")}).toArray();
module.exports.getAChallengeQuestion = function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded;
    try {
      decoded = jwt.verify(token, config.secret);
    } catch (e) {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
    ChallengeQuestion.find({"_id": new ObjectId(req.params.id)}, {}, function (err, questions) {
      if (err) {
        console.log(err);
        return;
      }
      res.json({success: true, msg: questions});
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
};


/* /api/challengequestion */
/* create a new challengequestion */
module.exports.createAChallengeQuestion = function(req, res) {
  console.log('run createAChallengeQuestion');
  var token = getToken(req.headers);
  if (token) {
    var decoded;
    try {
      decoded = jwt.verify(token, config.secret);
    } catch (e) {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
    var newChallengeQuestion = new ChallengeQuestion({
      ownerId: decoded._id,
      ownerName: decoded.fullName,
      paperVersion: req.body.paperVersion,
      paper: req.body.paper,
      questionName: req.body.questionName,
      topic: req.body.topic,
      subTopic: req.body.subTopic,
      difficulty: req.body.difficulty,
      blurLevel: req.body.blurLevel,
      numberOfPages: req.body.numberOfPages,
      tags: req.body.tags,
      thumbnail: req.body.thumbnail,
      sampleAnswers: req.body.sampleAnswers
    });
    newChallengeQuestion.save(function(err) {
      if (err) {
        console.log(err);
        return res.json({success: false, msg: err.message});
      }
      res.json({success: true, msg: 'Successfully created new Challenge Question .'});
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
};

