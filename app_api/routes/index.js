var mongoose = require('mongoose');
var passport = require('passport');
require('../controllers/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();

var ChallengeQuestion = require("../models/challengequestion");
var ChallengeAnswer = require("../models/challengeanswer");
var PlayerAnswerF = require("../models/playeranswerf");
var PlayerResultF = require("../models/playerresultf");

// Socket IO Demo API
/*  "/api/mains"
 *    GET: finds latest main info
 *    POST: creates a new main info
 *    PUT: update a main info
 *    DELETE: delete a main info
 */
var ctrlMains = require('../controllers/mains');
router.get('/mains', ctrlMains.mainReadLatestOne);
router.post('/mains', ctrlMains.mainCreate);
router.put('/mains/:mainid', ctrlMains.mainUpdateOne);
router.delete('/mains/:mainid', ctrlMains.mainDeleteOne);

// User API
/*  "/api/signup"
 *    POST: creates a new user account
 *
 *  "/api/signin"
 *    POST: login with account name and password, return token
 */
var ctrlUser = require('../controllers/user');
router.post('/signup', ctrlUser.signUp);
router.post('/signin', ctrlUser.signIn);

// Challenge Question API
/*  "/api/challengequestion"
 *    GET: get all Challenge Question detail
 *    GET: get a Challenge Question detail
 *    POST: create a new Challenge Question
 */
var ctrlChallengeQuestion = require('../controllers/challengequestion');
router.get('/challengequestion', ctrlChallengeQuestion.getAllChallengeQuestions);
router.get('/challengequestion/:id', passport.authenticate('jwt', { session: false}), ctrlChallengeQuestion.getAChallengeQuestion);
router.post('/challengequestion', passport.authenticate('jwt', { session: false}), ctrlChallengeQuestion.createAChallengeQuestion);

/*  "/api/challengequestion"
 *    GET: get players' marks
 */
var ctrlPlayerResultF = require('../controllers/playerresultf');
router.get('/playersmarks/:id', passport.authenticate('jwt', { session: false}), ctrlPlayerResultF.getPlayersMarksOfAChallengeQuestion);
router.get('/playerstimespents/:id', passport.authenticate('jwt', { session: false}), ctrlPlayerResultF.getPlayersTimeSpentsOfAChallengeQuestion);
router.get('/playersrank/qid/:qid/uid/:uid', passport.authenticate('jwt', { session: false}), ctrlPlayerResultF.getPlayerRankOfAChallengeQuestion);

var ctrlPlayerAnswerF = require('../controllers/playeranswerf');
router.get('/playersanswers/:id', passport.authenticate('jwt', { session: false}), ctrlPlayerAnswerF.getPlayersAnswersOfAChallengeQuestion);

// Challenge Answer API
/*  "/api/challengeanswer"
 *    GET: get all Challenge Answer detail
 *    POST: create a new Answer Question
 */
var ctrlChallengeAnswer = require('../controllers/challengeanswer');
router.get('/challengeanswer/qid/:qid/uid/:uid', passport.authenticate('jwt', { session: false}), ctrlChallengeAnswer.getAChallengeAnswer);
router.post('/challengeanswer', passport.authenticate('jwt', { session: false}), ctrlChallengeAnswer.createAChallengeAnswer);
router.post('/challengeanswer/accept', passport.authenticate('jwt', { session: false}), ctrlChallengeAnswer.acceptAChallenge);
router.post('/challengeanswer/submit', passport.authenticate('jwt', { session: false}), ctrlChallengeAnswer.submitAnAnswer);
router.post('/challengeanswer/acceptUpdate', passport.authenticate('jwt', { session: false}), ctrlChallengeAnswer.acceptUpdateAChallenge);

// Book API (Testing)
/*  "/api/book"
 *    GET: get all books detail
 *    POST: create a new book
 */
var ctrlBook = require('../controllers/book');
router.get('/book', passport.authenticate('jwt', { session: false}), ctrlBook.getAllBooks);
router.post('/book', passport.authenticate('jwt', { session: false}), ctrlBook.createABook);

// Delete all results (Testing)
/*  "/api/deleteAllQuestions"
 *    GET: delete all results
 */
router.get('/deleteAllQuestions', function(req, res) {
  ChallengeQuestion.remove({}, function(err) {
    console.log('ChallengeQuestion is removed');
    res.json({success: true, msg: 'success'});
  });
});

// Delete all results (Testing)
/*  "/api/deleteAllAnswers"
 *    GET: delete all results
 */
router.get('/deleteAllAnswers', function(req, res) {
  ChallengeAnswer.remove({}, function(err) {
    console.log('ChallengeAnswer is removed');
    PlayerAnswerF.remove({}, function(err) {
      console.log('PlayerAnswerF is removed');
      PlayerResultF.remove({}, function(err) {
        console.log('PlayerResultF is removed');
        res.json({success: true, msg: 'success'});
      });
    });
  });
});

module.exports = router;
