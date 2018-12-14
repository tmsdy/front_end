var fs = require('fs') ;
var Promise = require('bluebird') ;

exports.readFileAsync = function(fpath,encoding){ //读文件
    return new Promise((resolve,reject)=>{
        fs.readFile(fpath,encoding,(err,content)=>{
            if(err){
                reject(err) ;
            }else{
                resolve(content) ;
            }
        })
    })
}

exports.writeFileAsync = function(fpath,content){ //写文件
    return new Promise((resolve,reject)=>{
        fs.writeFile(fpath,content,(err)=>{
            if(err){
                reject(err) ;
            }else{
                resolve() ;
            }
        })
    })
}