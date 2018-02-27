var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChatSchema = new Schema({
  room: String,
  nickname: String,
  message: String,
  updated_at: { type: Date, default: Date.now },
});

//exports required for Socket IO
module.exports = mongoose.model('Chat', ChatSchema);
