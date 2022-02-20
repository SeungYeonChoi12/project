// var express = require('express');
// var router = express.Router();

// const MongoClient = require('mongodb').MongoClient; // 몽고디비 사용을 위한 require

// var db;
// MongoClient.connect('mongodb+srv://admin:qwer1234@cluster0.8g4vn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', function(에러, client){
//     // DB 접속 후 function 실행! => 연결되면 할 일
//     if(에러) {
//         return console.log(에러);
//     }

//     db = client.db('TeamProject'); // todoapp이라는 database에 연결

//     // listen()으로 서버 열 수 있는데 어디에 열지 정해야 함
//     //router.listen(8080, function(){ // 함수 안에 함수 : 콜백함수 -> 순차적으로 실행하고 싶을 때 씀
//     //    console.log('listening on 8080');
//     //}); 
// });

// router.get('/get', function (req, res, next) {
//     console.log('GET 호출 / data : ' + req.query.data);
//     console.log('path : ' + req.path);
//     let list;

//     db.collection('memo').find().toArray(function(err, res){
//         list = res;
//         console.log(res);
//     });

//     res.send('get success', {posts : list});
// });

// router.post('/post', function (req, res, next) {
//     console.log('POST 호출 / data : ' + req.body.data);
//     console.log('path : ' + req.path);

//     db.collection('counter').findOne({name : 'totalCount'}, function(err, res){
//         console.log(res.totalCount);
//         var totalCount = res.totalCount;

//         db.collection('memo').insertOne({_id:totalCount + 1, title:req.body.data[0], data:req.body.data[1]}, function(err, res){
//             console.log(`${req.body.data.title} 저장완료`);

//             db.collection('counter').updateOne({name : 'totalCount'}, { $inc : {totalCount:1} }, function(err, res){
//                 if(err) {
//                     return console.log(err);
//                 }
//             });
            
//         });
//     });

//     res.send('post success');
// });

// router.put('/put/:id', function (req, res, next) {
//     console.log('UPDATE 호출 / id : ' + req.params.id);
//     console.log('body : ' + req.body.data);
//     console.log('path : ' + req.path);

//     db.collection('memo').updateOne({id : req.params.id}, { $set : {title:req.body.title, data:req.body.data} }, function(err, res){
//         if(err) {
//             return console.log(err);
//         }
//     });

//     res.send('put success')
// });

// router.delete('/delete/:id', function (req, res, next) {
//     console.log('DELETE 호출 / id : ' + req.params.id);
//     console.log('path : ' + req.path);
//     res.send('delete success')
// });



// module.exports = router;