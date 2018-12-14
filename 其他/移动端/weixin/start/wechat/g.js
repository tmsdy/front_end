// 对于koa，作为中间件需要用generator写法
var sha1 = require('sha1')
var getRawBody = require('raw-body')
var Wechat = require('./wechat') 
var util = require('./util')

module.exports = function(opts) { //配置验证
    // var wechat = new Wechat(opts) ; //初始化Wechat拿到实例
    return function *(next){
        console.log(this.query) ;
        var that = this ;
        let token = opts.token ;
        let signature = this.query.signature ;
        let nonce = this.query.nonce ;
        let timestamp = this.query.timestamp ;
        let echostr = this.query.echostr ;
    
        let str = [token,timestamp,nonce].sort().join('') ;//字典排序
        let sha = sha1(str) ; //加密
    
        if(this.method === 'GET'){
            if(sha===signature){
                this.body = echostr+'' ;
            }else{
                this.body = 'wrong' ;
            }
        }else if(this.method === 'POST'){
            if(sha!==signature){
                this.body = 'wrong' ;
                return false
            }
            
            var data = yield getRawBody(this.req,{
                length: this.length,
                limit:'1mb' ,
                encoding:this.charset
            })
            console.log(data.toString()) ;
            var content = yield util.parseXMLAsync(data) ;
            console.log(content) ;
            var message = util.formatMessage(content.xml) ;
            console.log(message)

            // if(message.MsgType === 'event'&&message.Event === 'subscribe'){
            if(message.MsgType === 'text'){
                console.log('订阅了')
                let now = new Date().getTime() ;
                that.status = 200 ;
                that.type = 'application/xml' ;
                that.body = '<xml>'+
                '<ToUserName><![CDATA['+message.FromUserName+']]></ToUserName>'+
                '<FromUserName><![CDATA['+message.ToUserName+']]></FromUserName>'+
                '<CreateTime>'+now+'</CreateTime>'+
                '<MsgType><![CDATA[text]]></MsgType>'+
                '<Content><![CDATA[你好，欢迎来到飞飞的公众号]]></Content></xml>'
                return
            }
        }
        
    
    }
}



