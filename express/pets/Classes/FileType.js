var mongoose = require('mongoose');
const url = 'mongodb://localhost:27017';

mongoose.connect(url);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

var kittySchema = new mongoose.Schema({
    name: String
  });

  var Kitten = mongoose.model('Kitten', kittySchema);
