var mongoose = require('mongoose');
let fileSchema = new mongoose.Schema({
    id: {
      type: String,
    },
    name:   {
      type: String,
      required : [true, "Please Fill The Name Field"]
    },
    date_created:  {
      type: String,
      required : [true, "lacking Date Created"]
    },
    versions: [{
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
      author:  {
        type: String,
        required : [true, "Please Fill the author Field"]
      },
      date_modified:  {
        type: String,
        required : [true, "lacking Date Modified"]
      },
   }],
    checkedIn:  {
      type: String, //this will be required true later
    },
    archived:  {
      type: Boolean,
      select : false
    },
    tags: {
      type : String
    }
  });

  module.exports = mongoose.model('file', fileSchema)
