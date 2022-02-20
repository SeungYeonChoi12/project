/**
 * Module dependencies.
 */
 const express = require('express');
 const router = express.Router();
 const MongoClient = require('mongodb').MongoClient;

// 회원 인증을 위해 필요한 라이브러리 다운 : npm install passport passport-local express-session
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
 
/**
 * Connect Mongo Driver to MongoDB.
 */
 var db;
 MongoClient.connect("mongodb://localhost:27017/trackDB", (err, client)=> {
    console.log("Connected to MongoDB");
    db = client.db('trackDB'); // todoapp이라는 database에 연결
});

/**
 * app.use(미들웨어)
 * 웹서버는 요펑-응답해주는 머신
 * 미들웨어 : 요청-응답 중간에 뭔가 실행되는 코드
 *          미들웨어는 운영 체제에서 제공하지 않는 일반적인 서비스와 기능을 애플리케이션에 제공하는 소프트웨어
 *          데이터 관리, 애플리케이션 서비스, 메시징, 인증 및 API 관리는 주로 미들웨어를 통해 처리
 */
 router.use(session({secret : '비밀코드', resave:true, saveUninitialized:false}));
 router.use(passport.initialize());
 router.use(passport.session());

 router.get('/login', function(요청, 응답){
    // 응답.render('login.ejs');
});

router.post('/login', passport.authenticate('local', {
    // local 방식으로 회원인지 인증
    failureRedirect : '/fail' // 회원인증 실패하면 /fail로 이동
}), function(요청, 응답){
    // 응답.redirect('/');
    응답.send("200 OK");
});

passport.use(new LocalStrategy({
    usernameField : 'id', // form의 name 값 == id
    passwordField : 'pw', 
    session : true, // 로그인 후 세션에 저장할 것인지 여부
    passReqToCallback : false // 아이디, 비번 이외에 다른 정보 검증 시
}, function(입력한아이디, 입력한비번, done){
    console.log(입력한아이디, 입력한비번);
    db.collection('member').findOne({id : 입력한아이디}, function(에러, 결과){
        // done(서버에러, 성공시사용자DB데이터, 에러메세지)
        //      성공시사용자DB데이터 : 아이디/비번 안맞으면 false 넣어야함
        if(에러) return done(에러);
        if(!결과) return done(null, false, {message : '존재하지 않는 아이디입니다'});
        if(입력한비번 == 결과.pw){
            // 아이디/비번 맞으면 세션을 하나 만들어줘야 함
                // 로그인 성공 -> 세션정보를 만듦 -> 마이페이지 방문시 세션검사
            return done(null, 결과);
        } else {
            return done(null, false, {message : '비밀번호가 올바르지 않습니다'});
        }
    })
}));

// id를 이용해서 세션을 저장시키는 코드(로그인 성공시 발동) -> 암호화 해서 쿠키에 저장
passport.serializeUser(function(user, done){
    done(null, user.id)
});

// 마이페이지 접속 시 발동 -> 이 세션 데이터를 가진 사람을 DB에서 찾아주세요
// 로그인한 유저의 개인정보를 DB에서 찾는 역할 
    // -> 로그인한 유저의 세션아이디를 바탕으로 개인정보를 DB에서 찾는 역할
passport.deserializeUser(function(아이디, done){
    db.collection('member').findOne({id : 아이디}, function(에러, 결과){
        done(null, 결과);
    });
});

// 미들웨어 쓰는 법
router.get('/mypage', isLogin, function(요청, 응답){
    console.log(요청.user);
    // 응답.render('mypage.ejs', {사용자 : 요청.user});
});

function isLogin(요청, 응답, next){
    if(요청.user){
        next(); // 다음으로 통과시키라는 뜻
    } else {
        응답.send('로그인하지 않음');
    }
}

 module.exports = router;