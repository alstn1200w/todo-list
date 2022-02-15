// 서버의 메인
var express = require('express')
var cors = require('cors') // cors 설정 => 동일 출처정책(보안)
var logger = require('morgan')
var mongoose = require('mongoose')
var routes = require('./src/routes')
var app = express()
var port = 5000

app.set('case sensitive routing', true)

var corsOptions = { // CORS 옵션
    origin: 'http://localhost:5000',
    credentials: true
} 

const CONNECT_URL = 'mongodb://localhost:27017/syleemomo'
mongoose.connect(CONNECT_URL, { // Mongo DB 서버 연결
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("mongodb connected ..."))
  .catch(e => console.log(`failed to connect mongodb: ${e}`))

//미들웨어
app.use(cors(corsOptions)) // CORS 설정
app.use(express.json()) // request body 파싱
app.use(logger('tiny'))

app.use("/api", routes) // api 라우팅

app.get('/hello', (req, res) => { // URL 응답 테스트
    res.send('hello world !')
})

app.use( (req, res, next) => {  // 사용자가 요청한 페이지가 없는 경우 에러처리
    res.status(404).send("Sorry can't find page")
})

app.use( (err, req, res, next) => { // 서버 내부 오류 처리
    console.error(err.stack)
    res.status(500).send("something is broken on server !")
})

app.listen(port, () => {
    console.log(`sever is running on port ${port}`)
})

