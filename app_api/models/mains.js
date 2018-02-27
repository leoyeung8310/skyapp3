var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mainSchema = new Schema({
  version: {type: String},
  description: {type: String},
  createdOn: {
    type: Date,
    "default": Date.now
  }
});

mongoose.model('Main', mainSchema);

// BRING IN OTHER SCHEMAS & MODELS
require('./chat');
require('./user');
require('./challengequestion');

