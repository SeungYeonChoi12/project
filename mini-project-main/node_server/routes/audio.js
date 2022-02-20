/**
 * Module dependencies.
 */
 const express = require('express');
 const router = express.Router();
 const multer = require('multer');
 const mongoose = require('mongoose');
 const { ObjectID } = require('mongodb');
 const { createModel } = require('mongoose-gridfs');
 const { Readable } = require('stream');
 
 /**
  * Create Express server && Express Router configuration.
  */
 //global
 let Attachment;
 
 /**
  * Connect Mongo Driver to MongoDB.
  */
 mongoose.connect("mongodb://localhost:27017/trackDB", {
     useNewUrlParser: true
 }).then(()=> {
     console.log("Connected to MongoDB");
    // router.listen(8080, function(){ // 함수 안에 함수 : 콜백함수 -> 순차적으로 실행하고 싶을 때 씀
    // console.log('listening on 8080');
    // }); 
     Attachment = createModel();
 }).catch((error) => {
     console.error(error);
 });
 
 /**
  * GET /audio/:trackID
  */
  router.get('/:trackID', (req, res) => {
     if(!req.params.trackID) {
         return res.status(400).json({
             message: "Invalid trackID in URL parameter."
         });
     }
     res.set('content-type', 'audio/mp3');
     res.set('accept-ranges', 'bytes');
     
     try {
         const reader = Attachment.read({_id: ObjectID(req.params.trackID)});   

         reader.on('data', (chunk)=> {
             res.write(chunk);
         });
         reader.on('close', () => {
             console.log("All Sent!");
             res.end();
         });
     } catch(err) {
         console.log(err);
         res.status(404).json({
             message:"Cannot find files that have the ID",
         });
     }
 });
 
 /**
  * POST /audio
  * req : title, singer, file
  */
  router.post('/', (req, res) => {
     const storage = multer.memoryStorage()
     const upload = multer({ storage: storage, limits: { fields: 4, fileSize: 6000000, files: 1, parts: 4 }});
     upload.single('track')(req, res, (err) => {
         if (err) {
             console.log(err);
             return res.status(400).json({ message: "Upload Request Validation Failed" });
         } else if(!req.body.title) { // 변경가능
             return res.status(400).json({ message: "No track title in request body" });
         } else if(!req.body.singer) { // 변경가능
            return res.status(400).json({ message: "No track singer in request body" });
        }
 
         const readStream = Readable.from(req.file.buffer);
         console.log(req.file);
         const options = ({ metadata:`${req.body.title}/${req.body.singer}`, filename:req.file.originalname, contenttype: 'audio/mp3'});
         Attachment.write(options, readStream, (err, file) => {
             if (err)
                 return res.status(400).json({message: "Bad Request"});
             else {
                 console.log("Posted! \n" + file.toString());
                 return res.status(200).json({
                     message: "Successfully Saved!",
                     file: file,
             });
             }
         })
     });
 });
 
 /**
  * DELETE /audio/:trackID
  */
  router.delete("/:trackID", (req, res)=> {
     if(!req.params.trackID) {
         return res.status(400).json({
             message: "Invalid trackID in URL parameter."
         });
     }
     
     Attachment.unlink({_id: ObjectID(req.params.trackID)}, (err, file)=> {
         if (err) {
             console.log("Failed to delete\n" + err);
             return res.status(400).json({
                 message: "Wrong Request",
                 error: err.message,
             });
         }
         
         console.log('Deleted\n' + file);
         return res.status(200).json({
             message: "Successfully Deleted",
             file: file,
         });
     });   
 });

 module.exports = router;