const express = require('express')
const req = require('express/lib/request')
const TodoRouter = express.Router() //하위 url 에 대한 요청을 처리하기 위하여
const Todo = require("../../models/Todo") // 정의한 모델 가져오기 

TodoRouter.route('/').get( async (req, res) => {
    // 데이터베이스에서 전체 할일 목록 조회
    const todos = await Todo.find()
    res.json({ status: 200, todos}) // 함수 리턴이랑 동일함
})

// /api/todos/{id}
TodoRouter.route('/:id').get( (req, res) => {
    Todo.findById(req.params.id, (err, todo) => {
        if(err) throw err;
        res.json({ status: 200, todo})
    })
})

// /api/todos
TodoRouter.route('/').post( (req, res) => {
    console.log(`name: ${req.body.name}`)
    // 데이터베이스 접속 후 데이터 찾기 =>
    Todo.findOne({ name: req.body.name, done: false }, async (err, todo) => { // 중복체크
        if(err) throw err;
        if(!todo){ // 데이터베이스에서 해당 할일을 조회하지 못한 경우
            const newTodo = new Todo(req.body) // 할 일 생성하기
            await newTodo.save().then( () => {
                res.json({ status: 201, msg: 'new todo created in db !', newTodo})
            })

        }else{ // 생성하려는 할일과 같은 이름이고 아직 끝내지 않은 할일이 이미 데이터베이스에 존재하는 경우
            const msg = 'this todo already exists in db !'
            console.log(msg) 
            res.json({ status: 204, msg})
        }
    })
})

// /api/todos/{id}
TodoRouter.route('/:id').put( (req, res) => {
    // 데이터베이스에서 파라미터로 전달된 id 값으로 해당 할일 도큐먼트를 찾음
    Todo.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, todo) => {
        if(err) throw err;
        res.json({ status: 204, msg: `todo ${req.params.id} updated in db !`, todo})
    })
})

TodoRouter.route('/:id').delete( (req, res) => {
    res.send(`todo ${req.params.id} removed`)
})

module.exports = TodoRouter