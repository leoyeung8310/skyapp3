var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validator = require('../lib/validator');

var ChallengeQuestionSchema = new Schema({
  ownerId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  ownerName: {
    type: String,
    required: true
  },
  paperVersion: {
    type: Number,
    default: 1.1,
    required: true
  },
  paper: {
    type: Array,
    required: true
  },
  questionName: {
    type: String
  },
  topic: {
    type: String
  },
  subTopic: {
    type: String
  },
  difficulty: {
    type: Number,
    default: 3,
    required: true,
    validate:[validator({
      length:{
        min:1,
        max:5
      }
    }), "value must be between 1 to 5"]
  },
  blurLevel: {
    type: Number,
    default:5,
    required: true,
    validate:[validator({
      length:{
        min:1,
        max:9
      }
    }), "value must be between 1 to 9"]
  },
  tags: {
    type: Array
  },
  thumbnail: {
    type: String
  },
  viewNum: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0
  },
  submissionNum: {
    type: Number,
    default: 0
  },
  sampleAnswers: {
    type: Array
  },
  numberOfPages: {
    type: Number,
    default:5,
    required: true,
    validate:[validator({
      length:{
        min:1,
        max:15
      }
    }), "value must be between 1 to 15"]
  },
  tCreate: {
    type: Date,
    default: Date.now
  },
  tLastUpdate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ChallengeQuestion', ChallengeQuestionSchema);
