var Koa = require('koa') 
var sha1 = require('sha1')
var path = require('path')
var wechat = require('./wechat/g')
var util = require('./libs/util')
var wechat_file = path.join(__dirname,'./config/wechat.txt') ;
var app = new Koa() ;

var config = {
    wechat : {
        appID:'wxd891af28f217bace',
        appSecret:'22218ed962f6ed488387eb40495b78b9',
        token:'feifeidegongzhonghaokaifa',
        getAccessToken(){
            return util.readFileAsync(wechat_file)
        },
        saveAccessToken(data){
            data = JSON.stringify(data) ;
            return util.writeFileAsync(wechat_file,data)
        }
    }
}


app.use(wechat(config.wechat)) ;

app.listen(4444) ;
console.log('服务器在运行')

