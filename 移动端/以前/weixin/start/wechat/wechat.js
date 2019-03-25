var Promise = require('bluebird')
var request = Promise.promisify(require('request'))

var prefix = 'https://api.weixin.qq.com/cgi-bin/' ;
var api = {
    access_token: prefix+'token?grant_type=client_credential'
}

function Wechat(opts){
    this.appID = opts.appID ;
    this.appSecret = opts.appSecret ;
    this.getAccessToken = opts.getAccessToken ;
    this.saveAccessToken = opts.saveAccessToken ;

    this.getAccessToken().then(data=>{
        try{
            data = JSON.parse(data) ;
        }catch(e){
            return this.updateAccessToken() ;
        }

        if(this.isValidAccessToken(data)){
            return new Promise((resolve,reject)=>{
                resolve(data) ;
            })
        }else{
            return this.updateAccessToken() ;
        }

    }).then(data=>{ //把获取的access_token和expires_in挂载在实例上
        console.log(data)
        this.access_token = data.access_token ;
        this.expires_in = data.expires_in ;
        this.saveAccessToken(data) ;
    })
}

Wechat.prototype.isValidAccessToken = function(data){
    if (!data||!data.access_token||!data.expires_in){
        return false 
    }
    // console.log(data)
    let access_token = data.access_token ;
    let expires_in = data.expires_in ;
    let now = (new Date().getTime()) ;

    if( now < expires_in ){ //没过期
        return true 
    }else{
        return false 
    }
}

Wechat.prototype.updateAccessToken = function(){
    let appID = this.appID ;
    let appSecret = this.appSecret ;
    var url = api.access_token + '&appid='+appID+'&secret='+appSecret ;

    return new Promise((resolve,reject)=>{

        request({url,json:true}).then(res=>{
            // console.log(res.body)
            let data = res.body ;
            let now = (new Date().getTime()) ;
            let expires_in = now + (data.expires_in-20)*1000 ;//提前20秒
            data.expires_in = expires_in ;

            resolve(data) ;
        })

    })

}

module.exports = Wechat