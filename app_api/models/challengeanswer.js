var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validator = require('../lib/validator');

var ChallengeAnswerSchema = new Schema({
  questionId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  ownerName: {
    type: String,
    required: true
  },
  markPercentageF: {
    type: Number,
    default: 0
  },
  markPercentageC: {
    type: Number,
    default: 0
  },
  correctF: {
    type: Number,
    default: 0
  },
  correctC: {
    type: Number,
    default: 0
  },
  wrongF: {
    type: Number,
    default: 0
  },
  wrongC: {
    type: Number,
    default: 0
  },
  answersF: {
    type: Array
  },
  answersC: {
    type: Array
  },
  timeSpentF: {
    type: Number,
    default: 0
  },
  timeSpentTotal: {
    type: Number,
    default: 0
  },
  numOfSubmission: {
    type: Number,
    default: 0
  },
  submittedAnswers: {
    type: Array
  },
  paperVersion: {
    type: Number,
    default: 1.2,
    required: true
  },
  paper: {
    type: Array
  },
  log: {
    type: Array
  },
  thumbnail: {
    type: String
  },
  tFirstAccept: {
    type: Date,
    default: Date.now
  },
  tFirstSubmit: {
    type: Date
  },
  tLastAccept: {
    type: Date
  },
  tLastSubmit: {
    type: Date
  },
  tLastUpdate: {
    type: Date,
    default: Date.now
  }
});

ChallengeAnswerSchema.index( { questionId: 1, ownerId: 1 }, { unique: true } );

module.exports = mongoose.model('ChallengeAnswer', ChallengeAnswerSchema);
