const ItemSchema = require('../schemas/Item');
const configs = require('../configs/server.config');

/**
 * 查询所有商品
 * @returns <await>Promise
 */
module.exports.getAll = async () => {
	let items = await ItemSchema.findAll();

    let data = [];
    items.forEach( item => {
        if (!item.pid) {
            data.push({
                id: item.id,
                subTitle: item.subTitle,
                title: item.title,
                children: items.filter( child => child.pid === item.id ).map( child => {
                    return {
                        id: child.id,
                        pid: child.pid,
                        name: child.name,
                        price: child.price,
                        stock: child.stock,
                        colorStyle: configs.attachmentUrl + child.colorStyle,
                        cover: configs.attachmentUrl + child.cover,
                        album: Array.isArray(child.album) ? child.album.map( album => {
                            return configs.attachmentUrl + album;
                        } ) : []
                    }
                } )
            });
        }
    } );

    return data;
};

/**
 * 查询指定 ID 的商品
 */
module.exports.getById = async id => {
	let item = await ItemSchema.findById(id);

	let data = {};

	if (item) {
	    if (0 === item.pid) {
            data = {
                id: item.id,
                pid: item.pid,
                title: item.title,
                subTitle: item.subTitle
            };
            let children = await this.getByPid(item.id);

            if (children) {
                data.children = children.map( child => {
                    return {
                        id: child.id,
                        pid: child.pid,
                        name: child.name,
                        price: child.price,
                        stock: child.stock,
                        colorStyle: configs.attachmentUrl + child.colorStyle,
                        cover: configs.attachmentUrl + child.cover,
                        album: Array.isArray(child.album) ? child.album.map( album => {
                            return configs.attachmentUrl + album;
                        } ) : []
                    };
                } );
            }
        } else {
            data = {
                id: item.id,
                pid: item.pid,
                name: item.name,
                price: item.price,
                stock: item.stock,
                colorStyle: configs.attachmentUrl + item.colorStyle,
                cover: configs.attachmentUrl + item.cover,
                album: Array.isArray(item.album) ? item.album.map( album => {
                    return configs.attachmentUrl + album;
                } ) : []
            };
            let parentItem = await this.getById(item.pid);
            if (parentItem) {
                data.title = parentItem.title;
                data.subTitle = parentItem.subTitle;
            }
        }
    }

    return data;
};

/**
 * 查询指定 PID 的商品
 * @param pid
 * @returns {*}
 */
module.exports.getByPid = pid => {
    let where = {
        pid
    };
    return ItemSchema.findAll({
        where
    });
};