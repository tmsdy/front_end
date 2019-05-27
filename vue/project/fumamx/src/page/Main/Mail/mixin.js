export default {
    methods: {
        // 自动保存邮件
        autoSaveMail(dbName, version, storeName, saveObject) {
            // let _this = this
            var request = indexedDB.open(dbName, version) // 打开 dbName 数据库
            request.onerror = function (e) {
                console.log(error)
            }
            request.onsuccess = function (e) {
                try {
                    var db = e.target.result
                    var tx = db.transaction(storeName, 'readwrite')
                    var store = tx.objectStore(storeName)
                    var value = saveObject
                    var req = store.put(value) // 保存数据
                    req.onsuccess = function () {
                        console.log('保存成功')
                    }
                } catch (error) {
                    console.log(error)
                }
            }
            request.onupgradeneeded = function (e) {
                var db = e.target.result
                // var store =
                db.createObjectStore(storeName, {
                    keyPath: 'unionId',
                    autoIncrement: false
                })
            }
        }, // 自动获取邮件
        autoGetMail(dbName, version, storeName, unionId, type) {
            let _this = this
            var request = indexedDB.open(dbName, version) // 打开 dbName 数据库
            request.onerror = function (e) {
                // 监听连接数据库失败时执行
                console.log('连接数据库失败')
            }
            request.onsuccess = function (e) {
                // 监听连接数据库成功时执行
                console.log(' 自动获取邮件连接数据库成功' + unionId)
                try {
                    var db = e.target.result
                    var tx = db.transaction(storeName, 'readwrite')
                    var store = tx.objectStore(storeName)
                    var req = store.get(unionId) // 获取索引userId为1的数据
                    req.onsuccess = function () {
                        if (this.result != undefined && this.result != null && type == 'table') {
                            _this.editableTabs = this.result.editableTabs
                        } else if (this.result != undefined && this.result != null && type == 'detail') {
                            _this.cacheBackWrite(this.result.cachParameter)
                        }
                    }
                } catch (error) {
                    console.log('失败' + error)
                }
            }
            request.onupgradeneeded = function (e) {
                var db = e.target.result
                // var store =
                db.createObjectStore(storeName, {
                    keyPath: 'unionId',
                    autoIncrement: false
                })
                console.log('创建对象仓库成功')
            }
        }, // 删除自动保存的离线邮件
        deleteAutoMail(dbName, version, storeName, unionId) {
            // let _this = this
            var request = indexedDB.open(dbName, version) // 打开 dbName 数据库
            request.onerror = function (e) {
                // 监听连接数据库失败时执行
                console.log('连接数据库失败')
            }
            request.onsuccess = function (e) {
                // 监听连接数据库成功时执行
                console.log('删除自动保存连接数据库成功')
                try {
                    var db = e.target.result
                    var tx = db.transaction(storeName, 'readwrite')
                    var store = tx.objectStore(storeName)
                    var req = store.delete(unionId) // 获取索引userId为1的数据
                    req.onsuccess = function () {
                        console.log('删除离线数据成功')
                    }
                } catch (error) {
                    console.log(error)
                }
            }
            request.onupgradeneeded = function (e) {
                var db = e.target.result
                // var store =
                db.createObjectStore(storeName, {
                    keyPath: 'unionId',
                    autoIncrement: false
                })
                console.log('创建对象仓库成功')
            }
        }
    }
}
