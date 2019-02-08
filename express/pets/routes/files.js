const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'TMS';
const client = new MongoClient(url);

var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer'); 
var upload = multer(); 
var router = express.Router();

// GET list of pets to show that we're up and running
router.get('/files', function(req, res, next) {
    client.connect(function(err,data) { 
        const db = client.db(dbName);
        const collection = db.collection('files');
        collection.find({}).toArray(function(err, data) {
            if(err = null) {
                return res.json({ success:false, error:err });  
            } else {
                return res.json({ data });
               // return res.json({"banana": "banana"})
            }
        });
    });
});



// get the form to add a new pet
router.get('/files/add', function(req, res, next){
   res.send('Got a GET request at /pet/add');
});


router.post('/files', upload.array(), function (req, res) {
    let nu = { name:req.body.name, file:req.body.file, TaC:req.body.Tac, size:req.body.size, type:req.body.type, date_created:req.body.date_created, date_modified:req.body.date_modified };
    console.log(req);
    client.connect(function(err) {
        const db = client.db(dbName);
        const collection = db.collection('files');
        collection.insertOne(nu, function(err, result) {
            if(err != null) { return res.json({ success:false, error:err }); }
             return res.json({ success:true });
        });
    });
});

router.post('/pet/update', upload.array(), function (req, res) {
    let nu = { name:req.body.nom, species:req.body.species, breed:req.body.breed, age:req.body.age, colour:req.body.colour };

    client.connect(function(err) {
        const db = client.db(dbName);
        const collection = db.collection('animals');
        collection.updateOne(req.body._id, nu, function(err, result) {
            if(err != null) { console.log(err);}
            res.redirect('/petshop/pet');
        });
    });
});




// accept PUT request at /user
router.put('/pet', function (req, res) {
  res.send('Got a PUT request at /pet');
});


// accept DELETE request at /user
router.delete('/pet', function (req, res) {
  res.send('Got a DELETE request at /pet');
});

module.exports = router;

