const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017';
const dbName = 'TMS';

var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer'); 
const bcrypt = require('bcrypt');
var upload = multer(); 
var router = express.Router();
let UserModel = require('../Classes/User')

const saltRounds = 10;

/* GET users listing. */
router.post('/login', function(req, res, next) {
  var searchCrit;
  searchCrit = {name : req.body.name};
    mongoose.connect(url + "/" + dbName, {useNewUrlParser: true});
    var db = mongoose.connection;
    db.once('open', function() {
        UserModel.find(searchCrit, function(err, data) {
            if(err) {
              res.json({ success:false, error:err });  
            } else {
              if (data) {
                let foundUser = false;
                data.map(function(item, i){
                  if(bcrypt.compareSync(req.body.password, item.password))
                  {
                    res.json({found : true, cacheVal : item._id, role : item.role, name : item.name})
                    foundUser = true
                  }
                })
                if(foundUser === false) {
                  res.json({found : false})
                }
            } else{
              res.json({found : false})
            }
           }
        });   
    });
});

/* GET  single user. */
router.post('/Single', function(req, res, next) {
  var searchCrit;
  searchCrit = {_id : req.body.id};
    mongoose.connect(url + "/" + dbName, {useNewUrlParser: true});
    var db = mongoose.connection;
    db.once('open', function() {
        UserModel.findOne(searchCrit, function(err, data) {
            if(err) {
              res.json({ success:false, error:err });  
            } else {
              if (data) {
                res.json({data : data})
            } else{
              res.json({found : false})
            }
           }
        });   
    });
});

// GET All
router.get('/users', function(req, res, next) {
  mongoose.connect('mongodb://localhost:27017/TMS', {useNewUrlParser: true});
  var db = mongoose.connection;

      UserModel.find(function(err, data) {
          if(err = null) {
                          res.json({ success:false, error:err });  
                      } else {
                          return res.json({data});
                      }
  });
});

router.post('/add', upload.array(), function (req, res) {
  var pass = bcrypt.hashSync(req.body.password, saltRounds);
  // console.log(pass)
  var userUpload = new UserModel({name:req.body.name, password : pass, role : req.body.role });
  mongoose.connect('mongodb://localhost:27017/TMS', {useNewUrlParser: true});
  console.log(userUpload)
  userUpload.save(function (err, userUpload) {
      if (err) { return res.json({ success:false, error:err }); }
      return res.json({ success:true });
  });
});

router.post('/update', upload.array(), function (req, res) {
  var ObjectId = require('mongoose').Types.ObjectId; 
  var query = { _id: new ObjectId(req.body.id) };
  // console.log(query);
  var pass = bcrypt.hashSync(req.body.password, saltRounds);

  var newvalues = { $set: {password : pass } };
  mongoose.connect('mongodb://localhost:27017/TMS', {useNewUrlParser: true});
  var db = mongoose.connection;
  db.collection("users").updateOne(query, newvalues, function(err, res) {
      if (err) throw err;
      console.log("1 document updated");
      db.close();
    });
});

router.delete('/delete', upload.array(), function (req, res) {
  var query = { _id: req.body.id };
  mongoose.connect('mongodb://localhost:27017/TMS', {useNewUrlParser: true});
  UserModel
      .deleteOne(query)
      .then(doc => {
          console.log(doc)
      })
      .catch(err => {
          console.error(err)
      })
});

module.exports = router;
