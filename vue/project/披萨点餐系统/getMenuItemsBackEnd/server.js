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
];
let getMenuItems = [

	{
	'name': '榴莲pizza',
		'description': '这是喜欢吃榴莲朋友的最佳选择',
		'options': [{
		'size': 9,
		'price': 38
	}, {
		'size': 12,
		'price': 48
	}]
},

{
	'name': '芝士pizza',
		'description': '芝士杀手,浓浓的芝士丝, 食欲瞬间爆棚',
		'options': [{
		'size': 9,
		'price': 38
	}, {
		'size': 12,
		'price': 48
	}]
},

    {
	'name': '夏威夷pizza',
		'description': '众多人的默认选择',
		'options': [{
		'size': 9,
		'price': 36
	}, {
		'size': 12,
		'price': 46
	}]
}

]

server.get('/', (req, res) => {
    res.json({message:"hello"});
});

server.get('/getAll', (req, res) => {
    res.json(getMenuItems);
});

server.post('/add', (req, res) => {
    //let title = req.body.title;

    // if (title == '') {
    //     res.json({error: -1, data: "任务标题不能为空"});
    // }

	// let newMenuItems = {
	// 	name:req.body.data.name,
	// 	description:req.body.data.description,
	// 	options:[
	// 		{
	// 			size:req.body.data.size1,
	// 			price:req.body.data.price1
	// 		},
	// 		{
	// 			size:req.body.data.size2,
	// 			price:req.body.data.price2
	// 		}
	// 	]
	// };
	 let newMenuItems = req.body.data.data ;
	 getMenuItems.unshift(newMenuItems);
    res.json(newMenuItems);
	//res.json(res.body.data);
});

server.post('/remove', (req, res) => {
    let id = req.body.id;

    todos = todos.filter(todo => todo.id != id);

    res.json({error: 0, data: "删除成功"});
});

server.listen(9999, '0.0.0.0');
