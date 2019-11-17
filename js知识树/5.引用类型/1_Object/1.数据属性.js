    // "use strict" ; //严格模式
    /* 数据属性
        [[Configurable]]:表示能否通过delete删除属性而重新定义属性，默认为true
        [[Enumerable]]:表示能否通过for-in循环返回属性，默认为true，原型的属性这是false
        [[Writable]]:能否修改属性的值，默认为true
        [[value]]:属性的数据值，读取属性值的时候，从这个位置读；写入属性值的时候，把新值保存在这个位置，这个特性默认为undefined
    */
    var person = {//name的[[Configurable]]，[[Enumerable]]，[[Writable]]都为true，[[value]]为"feifei"
        name : "feifei"
    }

    // 修改这些默认的特性,必须使用es5的Object.defineProperty()方法，接收三个参数属性所在对象，属性名，描述符
    var person2 = {} ;
    Object.defineProperty(person2,"name",{
        writable:false ,
        value:"feifei"
    }) ;
    console.log(person2.name) ;
    person2.name = "afang" ;//定义属性值可读不可写，这样赋值在非严格情况会被忽略，严格模式会报错
    console.log(person2.name) ;

    Object.defineProperty(person2,"name",{//改成false就不能再改成true了 会报错
        writable:true ,
        value:"feifei"
    }) ;

//Object.defineProperty 在IE8中实现不彻底