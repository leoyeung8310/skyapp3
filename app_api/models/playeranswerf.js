var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlayerAnswerFSchema = new Schema({
  questionId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  pageNumber: {
    type: Number,
    required: true
  },
  answerNumber: {
    type: Number,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  tCreate: {
    type: Date,
    default: Date.now
  }
});

PlayerAnswerFSchema.index(
  { questionId: 1, ownerId: 1, answerNumber: 1 },
  { unique: true }
);

module.exports = mongoose.model('PlayerAnswerF', PlayerAnswerFSchema);
