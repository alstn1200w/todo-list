const express = require('express')
const TodoRouter = express.Router() //하위 url 에 대한 요청을 처리하기 위하여

TodoRouter.route('/').get( (req, res) => {
    res.send('all todo list') //함수 리턴이랑 동일
})

module.exports = TodoRouter