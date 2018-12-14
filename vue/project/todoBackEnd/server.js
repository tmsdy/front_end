const express = require('express');
const bodyParser = require('body-parser');

const server = express();

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

let maxId = 2;
let todos = [
    {
        id: 1,
        title: '测试任务一',
        completed: false
    },
    {
        id:2,
        title: '测试任务二',
        completed: true
    }
]

server.get('/', (req, res) => {
    res.json({message:"hello"});
});

server.get('/getAll', (req, res) => {
    res.json(todos);
});

server.post('/add', (req, res) => {
    let title = req.body.title;

    if (title == '') {
        res.json({error: -1, data: "任务标题不能为空"});
    }

    let newTodo = {
        id: ++maxId,
        title,
        completed: false
    }
    todos.unshift(newTodo);
    res.json(newTodo);
});

server.post('/remove', (req, res) => {
    let id = req.body.id;

    todos = todos.filter(todo => todo.id != id);

    res.json({error: 0, data: "删除成功"});
});

server.listen(7777, '0.0.0.0');
