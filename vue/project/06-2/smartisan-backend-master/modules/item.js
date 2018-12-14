const express = require('express');
const ItemModel = require('../models/Item');

const router = express.Router();

/*
 * 获取商品列表
 * @Method GET
 * @Url /item
 * @Return [Array] 商品列表数组
 * */
router.get('/', async (req, res) => {

	let data = await ItemModel.getAll();

	res.json({
        code: 0,
        data
    });
});

/*
 * 获取指定商品详情
 * @Method GET
 * @Url /item/:id
 * @params id 要获取的商品ID
 * @Return {Object} 商品详情信息
 * */
router.get('/:id', async (req, res) => {
	const id = req.params.id || null;

	if (!id) {
		res.json({
			code: 1,
			data: '缺少参数'
		});
		return;
	}

	let data = await ItemModel.getById(id);

	res.json({
		code: 0,
        data
	});

});

module.exports = router;