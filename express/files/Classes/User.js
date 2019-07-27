var mongoose = require('mongoose');
let userSchema = new mongoose.Schema({
    id: {
      type: String,
    },
    name:   {
      type: String,
      required : [true, "Please Fill The Name Field"]
    },
    password:  {
      type: String,
      required : [true, "Please Fill the Type Field"]
    },
    team:  {
        type: Number,
      },
    role:  {
      type: String,
      required : [true, "Please Fill the Type Field"]
    },
  });

  module.exports = mongoose.model('user', userSchema)
