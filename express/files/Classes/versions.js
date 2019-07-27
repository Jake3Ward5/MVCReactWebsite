var mongoose = require('mongoose');
let versionsSchema = new mongoose.Schema({
      file_location: String,
      description: String,
      size:  {
        type: Number,
        required : [true, "Please Fill the Size Field"]
      },
      type:  {
        type: String,
        required : [true, "Please Fill the Type Field"]
      },
      date_modified:  {
        type: String,
        required : [true, "lacking Date Modified"]
      },
  });

  module.exports = mongoose.model('versions', versionsSchema)
