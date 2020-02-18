//把字符串转成对象
// 方法一
var str = "?user=admin&pass=admin&age=18"
function parseObject(sVal){
    let obj = {}
    //删除第一个字符？操作,截取？之后所有的字符
    sVal = sVal.substr(1,sVal.length);
    //把字符串拆分成数组元素，转化成数组
    sVal = sVal.split("&"); 
    //循环数组
    for(let [index,val] of sVal.entries()){
        //针对数组元素再次拆分成数组
        let cVal = val.split("=");
        //并把数组分为对象的键（数组的第一个元素）和对象的值（数组的第二个元素）
        obj[cVal[0]] = cVal[1]
    }
    return obj
}
console.log(parseObject(str))

// 方法二 转JSON
function queryString(url){
    let arr=[]; //存储参数的数组
    let res={}; //存储最终JSON结果对象
    arr=url.split("?")[1].split("&"); //arr=["a=1", "b=2", "c=test", "d"]

    for(let i=0,len=arr.length;i<len;i++){
        //如果有等号，则执行赋值操作
        if(arr[i].indexOf("=")!=-1){
            let str=arr[i].split("=");
            //str=[a,1];
            res[str[0]]=str[1];
        }else{//没有等号，则赋予空值
            res[arr[i]]="";
        }
    }
    res=JSON.stringify(res);//转化为JSON字符串
    return res; //{"a": "1", "b": "2", "c": "test", "d": ""}
}
console.log(queryString('www.baidu.com?a=1&b=2&c=test&d'));