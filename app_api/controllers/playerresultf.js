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

/* /api/playermark */
/* GET: get players' marks */
/*
db.playermarkfs.aggregate(
  [
    {
      $group:
        {
          _id: "$correctF",
          count: { $sum: 1 }
        }
    }
  ]
)
*/
module.exports.getPlayersMarksOfAChallengeQuestion = function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded;
    try {
      decoded = jwt.verify(token, config.secret);
    } catch (e) {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
    PlayerResultF.aggregate([
      { $match: {
          questionId: new ObjectId(req.params.id)
        }},
      { $sort: {
          correctF: -1
        }},
      { $group: {
          _id: "$correctF",
          count: { $sum: 1 }
        }}
    ], function (err, result) {
      if (err) {
        console.log(err);
        return;
      }
      res.json({success: true, msg: result});
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
};

module.exports.getPlayersTimeSpentsOfAChallengeQuestion = function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded;
    try {
      decoded = jwt.verify(token, config.secret);
    } catch (e) {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
    PlayerResultF.aggregate([
      { $match: {
          questionId: new ObjectId(req.params.id)
        }},
      { $sort: {
          timeSpentF: -1
        }},
      { $group: {
          _id: "$timeSpentF",
          count: { $sum: 1 }
        }}
    ], function (err, result) {
      if (err) {
        console.log(err);
        return;
      }
      res.json({success: true, msg: result});
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
};

module.exports.getPlayerRankOfAChallengeQuestion = function(req, res) {
  console.log ('server getPlayerRankOfAChallengeQuestion');
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
        "questionId": new ObjectId(req.params.qid),
      },
      {
        "_id": 1,
        "correctF": 1,
        "timeSpentF": 1
      },
      function (err, result) {
        if (err) {
          console.log(err);
          return;
        }
        console.log('ca - result');
        console.log(result[0]['correctF']);
        console.log(Math.round(result[0]['timeSpentF']));
        PlayerResultF.find(
          {
            "questionId": new ObjectId(req.params.qid)
          }
        ).count(function(err,total){
          if (err) {
            console.log(err);
            return;
          }
          console.log('PlayerResultF - total');
          console.log(total);
          PlayerResultF.find(
            {
              $and: [
                {"questionId": new ObjectId(req.params.qid)},
                {$or: [
                    {correctF : { $gt : result[0]['correctF'] }},
                    {$and: [
                        {correctF: result[0]['correctF']},
                        {timeSpentF: {$lt: Math.round(result[0]['timeSpentF'])}}
                      ]
                    }
                  ]
                }
              ]
            }
          ).count(function(err,rank){
            if (err) {
              console.log(err);
              return;
            }
            console.log('PlayerResultF - rank');
            console.log(rank);
            var arr = [rank,total];
            res.json({success: true, msg: arr});
          });
        });
      }
    );
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
};
