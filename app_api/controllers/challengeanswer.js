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

/* /api/challengeanswer */
/* /challengeanswer/qid/:qid/uid/:uid */
// db.challengeanswer.find({"_id": ObjectId("5a3c90e61862dd0a744ffade")}).toArray();
module.exports.getAChallengeAnswer = function(req, res) {
  console.log ('server getAChallengeAnswer');
  console.log (req.params.uid);
  console.log (req.params.qid);
  var token = getToken(req.headers);
  if (token) {
    var decoded;
    try {
      decoded = jwt.verify(token, config.secret);
    } catch (e) {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
    ChallengeAnswer.find(
      {
        "ownerId": new ObjectId(req.params.uid),
        "questionId": new ObjectId(req.params.qid)
      },
      {},
      function (err, obj) {
        if (err) {
          console.log(err);
          res.json({success: false, msg: err.message});
        }
        res.json({success: true, msg: obj});
      }
      );
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
};


/* /api/challengeanswer */
/* create a new challengeanswer */
module.exports.createAChallengeAnswer = function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded;
    try {
      decoded = jwt.verify(token, config.secret);.0
    } catch (e) {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
    var newChallengeAnswer = new ChallengeAnswer({
      ownerId: decoded._id,
      ownerName: decoded.fullName,
      questionId: req.body.questionId, //***
      markPercentageF: req.body.markPercentageF,
      markPercentageC: req.body.markPercentageC,
      correctF: req.body.correctF,
      correctC: req.body.correctC,
      wrongF: req.body.wrongF,
      wrongC: req.body.wrongC,
      answersF: req.body.answersF,
      answersC: req.body.answersC,
      timeSpentF: req.body.timeSpentF,
      timeSpentTotal: req.body.timeSpentTotal,
      numOfSubmission: req.body.numOfSubmission,
      submittedAnswers: req.body.submittedAnswers,
      paperVersion: req.body.paperVersion,
      paper: req.body.paper,
      log: req.body.log,
      thumbnail: req.body.thumbnail,
      tFirstAccept: req.body.tFirstAccept,
      tFirstSubmit: req.body.tFirstSubmit,
      tLastAccept: req.body.tLastAccept,
      tLastSubmit: req.body.tLastSubmit,
      tLastUpdate: req.body.tLastUpdate
    });
    console.log('req.body');
    console.log(req.body);
    newChallengeAnswer.save(function(err) {
      if (err) {
        console.log(err);
        res.json({success: false, msg: err.message});
      }
      res.json({success: true, msg: 'Successfully created new Challenge Answer .'});
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
};


/* /api/challengeanswer */
/* accept a challenge */
module.exports.acceptAChallenge = function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded;
    try {
      decoded = jwt.verify(token, config.secret);
    } catch (e) {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
    var newChallengeAnswer = new ChallengeAnswer({
      ownerId: decoded._id,
      ownerName: decoded.fullName,
      questionId: new ObjectId(req.body.questionId),
      tfirstAccept: Date.now(),
      tLastAccept: Date.now(),
    });
    newChallengeAnswer.save(function(err, obj) {
      if (err) {
        console.log(err);
        res.json({success: false, msg: err.message});
      }
      res.json({success: true, msg: obj});
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
};

/* /api/challengeanswer */
/* submit an answer */
module.exports.submitAnAnswer = function(req, res) {
  console.log('--- submitAnswer ---');
  var token = getToken(req.headers);
  if (token) {
    var decoded;
    try {
      decoded = jwt.verify(token, config.secret);
    } catch (e) {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
    var update;
    var timeSpent = Math.abs((new Date().getTime() - new Date(req.body.tLastAccept).getTime()) / 1000);
    timeSpent = timeSpent > 3600? 3600: timeSpent;
    var timeSpentTotal = req.body.timeSpentTotal + timeSpent;
    timeSpentTotal = timeSpentTotal > 3600? 3600: timeSpentTotal;
    if (req.body.tLastSubmit) {
      // not first time
      console.log('not first time');
      update = {
        markPercentageC: req.body.markPercentageC,
        correctC: req.body.correctC,
        wrongC: req.body.wrongC,
        answersC: req.body.answersC,
        timeSpentTotal: timeSpentTotal,
        numOfSubmission: req.body.numOfSubmission,
        submittedAnswers: req.body.submittedAnswers,
        paperVersion: req.body.paperVersion,
        paper: req.body.paper,
        log: req.body.log,
        thumbnail: req.body.thumbnail,
        tLastSubmit: Date.now(),
        tLastUpdate: Date.now()
      };
    } else {
      // first time
      console.log('first time');
      update = {
        markPercentageF: req.body.markPercentageC,
        markPercentageC: req.body.markPercentageC,
        correctF: req.body.correctC,
        correctC: req.body.correctC,
        wrongF: req.body.wrongC,
        wrongC: req.body.wrongC,
        answersF: req.body.answersC,
        answersC: req.body.answersC,
        timeSpentF: timeSpent,
        timeSpentTotal: timeSpent,
        numOfSubmission: req.body.numOfSubmission,
        submittedAnswers: req.body.submittedAnswers,
        paperVersion: req.body.paperVersion,
        paper: req.body.paper,
        log: req.body.log,
        thumbnail: req.body.thumbnail,
        tFirstSubmit: Date.now(),
        tLastSubmit: Date.now(),
        tLastUpdate: Date.now()
      };
      // update challenge question
      console.log('update challenge question');
      // console.log('req.body');
      // console.log(req.body);
      // save first submitted player's mark
      var newPlayerResultF = new PlayerResultF({
        ownerId: decoded._id,
        questionId: req.body.questionId, //***
        correctF: req.body.correctC,
        timeSpentF: timeSpent,
        tCreate: Date.now()
      });
      newPlayerResultF.save(function(err) {
        if (err) {
          console.log(err);
          res.json({success: false, msg: err.message});
        }
        console.log('successfully saved newPlayerResultF');
      });
      // save first submitted answer
      const answersCArr = Array.from(req.body.answersC);
      var insertArr = [];
      for (var i = 0; i < answersCArr.length; i++) {
        for (var j = 0; j < answersCArr[i].length; j++) {
          var ansArr = answersCArr[i][j];
          if (ansArr[0] !== null && ansArr[0] !== undefined && ansArr[0] !== "") { // ignore comment
            insertArr.push({
              ownerId: decoded._id,
              questionId: req.body.questionId, //***
              pageNumber: i,
              answerNumber: ansArr[3],
              answer: ansArr[0] === null ? "" : ansArr[0],
              tCreate: Date.now()
            });
          }
        }
      }
      if (insertArr.length != 0) {
        PlayerAnswerF.insertMany(insertArr, function(err) {
          if (err) {
            console.log(err);
            res.json({success: false, msg: err.message});
          }
          insertArr = [];
          console.log('successfully saved newPlayerAnswerF');
        });
      }
    }
    console.log('id = ' + req.body._id);
    const id = req.body._id;
    ChallengeAnswer.findByIdAndUpdate(
      id,
      {$set: update},
      {new: true},
      function (err, obj) {
        if (err) {
          console.log(err);
          res.json({success: false, msg: err.message});
        }
        res.json({success: true, msg: obj});
      }
    );
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
};

/* /api/challengeanswer */
/* accept updating a challenge */
module.exports.acceptUpdateAChallenge = function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded;
    try {
      decoded = jwt.verify(token, config.secret);
    } catch (e) {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
    var update = {
      tLastAccept: Date.now(),
      tLastUpdate: Date.now()
    }
    ChallengeAnswer.findByIdAndUpdate(
      {"_id": new ObjectId(req.body._id)},
      {$set: update},
      {new: true},
      function (err, obj) {
        if (err) {
          console.log(err);
          res.json({success: false, msg: err.message});
        }
        res.json({success: true, msg: obj});
      });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
};


