const mongoose = require('mongoose');

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'TMS';
const client = new MongoClient(url);

var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer'); 
var upload = multer(); 
var router = express.Router();
let FileModel = require('../Classes/FileType')
let VersionModel = require('../Classes/versions')


// GET list of Files
router.get('/files', function(req, res, next) {
    mongoose.connect('mongodb://localhost:27017/TMS', {useNewUrlParser: true});
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        FileModel.find({"archived": false}, function(err, data) {
            if(err = null) {
                            res.json({ success:false, error:err });  
                        } else {
                            return res.json({data});
                        }
    });

});
});

// GET Single File
router.get('/filesOne', function(req, res, next) {
    var searchCrit = req.query.ID;
    mongoose.connect('mongodb://localhost:27017/TMS', {useNewUrlParser: true});
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        FileModel.findById(searchCrit, function(err, data) {
            if(err = null) {
                res.json({ success:false, error:err });  
            } else {
                return res.json({data});
            }
    });
});
});

// GET list of Files by search criteria
router.post('/Search', function(req, res, next) {
    var searchCrit = req.body.searching;
    console.log(req.body)
    mongoose.connect('mongodb://localhost:27017/TMS', {useNewUrlParser: true});
    // console.log("searchCrit")
    FileModel.find({ $and: [ { "$or":[
        { "name": { $regex: '.*' + searchCrit + '.*' }},
        { "tags": { $regex: '.*' + searchCrit + '.*' }},
    ] },
    { "archived": false}
]},
    function(err,data){
        if(err)
        {
            res.json({err})
        }
        else{
            // console.log(data);
            res.json({data: data})
        }
   });
});

// Create a new File
router.post('/files', upload.array(), function (req, res) {
    var fileUpload = new FileModel({name:req.body.name, date_created:req.body.date_created, checkedIn : req.body.checkedIn, versions :[{ file_location:req.body.file_location, size:req.body.size, type:req.body.type, description : req.body.description, date_modified:req.body.date_modified, author : req.body.author}], archived : false, tags : req.body.tags });
    mongoose.connect('mongodb://localhost:27017/TMS', {useNewUrlParser: true});
    console.log(fileUpload)
    fileUpload.save(function (err, fileUpload) {
        if (err) { return res.json({ success:"Falied to Upload" }); }
        return res.json({ success:"Uploaded File" });
    });
});

// Create a new Version of a File
router.post('/newVersion', upload.array(), function (req, res) {
    let versions = {id : req.body.id ,file_location : req.body.file_location, size : req.body.size, description : req.body.description, type : req.body.type, date_modified : req.body.date_modified, author : req.body.author}
    // console.log(versions);
    mongoose.connect('mongodb://localhost:27017/TMS', {useNewUrlParser: true});
    var db = mongoose.connection;
    // var query = { _id: new ObjectId(req.body.id) };
    var ObjectId = require('mongoose').Types.ObjectId; 
    var query = { _id: new ObjectId(req.body.id) };
    // console.log(query)
    db.collection("files").updateOne(query, { $push: { versions: versions }},
        function(err, blogModels) {
            if (err) { return res.json({ success:"Falied to Upload" }); }
            return res.json({ success:"Uploaded File" });
          });
        //   return res.json(true);
});

//                  I DO NOT THINK I AM USING THIS?
router.post('/update', upload.array(), function (req, res) {
    let fileUpload = new FileModel({name:req.body.name, size:req.body.size, description:req.body.description, type:req.body.type, file_location:req.body.file_location, date_created:req.body.date_created, date_modified:req.body.date_modified, previous:req.body.previous });
    console.log(fileUpload);
    var ObjectId = require('mongoose').Types.ObjectId; 
    var query = { _id: new ObjectId(req.body.id) };
    // console.log(query);
    var newvalues = { $set: {name: fileUpload.name, size: fileUpload.size, description : fileUpload.description, type: fileUpload.type, file_location: fileUpload.file_location, date_created : fileUpload.date_created, date_modified : fileUpload.date_modified } };
    mongoose.connect('mongodb://localhost:27017/TMS', {useNewUrlParser: true});
    var db = mongoose.connection;
    db.collection("files").updateOne(query, newvalues, function(err, res) {
        if (err) throw err;
        console.log("1 document updated");
        db.close();
      });
});     

// Check in and out the File
router.post('/checkingItem', upload.array(), function (req, res) {
    var ObjectId = require('mongoose').Types.ObjectId; 
    var query = { _id: new ObjectId(req.body.id) };
     console.log(query);
    var newvalues = { $set: { checkedIn : req.body.newVal } };
    console.log(newvalues)
    mongoose.connect('mongodb://localhost:27017/TMS', {useNewUrlParser: true});
    var db = mongoose.connection;
    db.collection("files").updateOne(query, newvalues, function(err, res) {
        if (err) throw err;
        console.log("1 document updated");
        db.close();
      });
});

// Delete file (not used only included for full use of CRUD)
router.delete('/delete', upload.array(), function (req, res) {
    var query = { _id: req.body.id };
    mongoose.connect('mongodb://localhost:27017/TMS', {useNewUrlParser: true});

    FileModel
        .deleteOne(query)
        .then(doc => {
            res.json({ success:"Uploaded File" });
        })
        .catch(err => {
            res.json({ success:"Falied to Upload" });
        })
});

// Deletes the file by setting the archive flag to true
router.delete('/archive', upload.array(), function (req, res) {
    var ObjectId = require('mongoose').Types.ObjectId; 
    var query = { _id: new ObjectId(req.body.id) };
     console.log(query);
    var newvalues = { $set: { archived : true } };
    console.log(newvalues)
    mongoose.connect('mongodb://localhost:27017/TMS', {useNewUrlParser: true});
    var db = mongoose.connection;
    db.collection("files").updateOne(query, newvalues,
        function(err, blogModels) {
            if (err) { return res.json({ success:"Falied to Delete" }); }
            return res.json({ success:"Deleted File" });
          });
});

module.exports = router;

