var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlayerResultFSchema = new Schema({
  questionId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  correctF: {
    type: Number,
    default: 0
  },
  timeSpentF: {
    type: Number,
    get: v => Math.round(v),
    set: v => Math.round(v),
    alias: 'i'
  },
  tCreate: {
    type: Date,
    default: Date.now
  }
});

PlayerResultFSchema.index( { questionId: 1, ownerId: 1 }, { unique: true } );

module.exports = mongoose.model('PlayerResultF', PlayerResultFSchema);
