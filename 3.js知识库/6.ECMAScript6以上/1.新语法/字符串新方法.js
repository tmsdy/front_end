let name = 'feifei' ;
let age = 22 ;

let str = desc`${name}今年${age}岁了` ;

function desc(strings,name,age){ //可以配合...rest用，写自己的拼接模板字符串的逻辑
    console.log(strings) ;
    console.log(name) ;
    console.log(age) ;
    // reutrn '自己写规则' 
}

// 几个新字符串方法
let str2 = 'http://' ;
let str3 = 'ftp://' ;
let m_img = 'xxx.jpg'

console.log(str2.startsWith('h')) ; //true

if(m_img.endsWith('jpg')){
    console.log('是一张jpg图片')
}

let str4 = 'abcd' ;
console.log(str4.includes('b')) //true 

console.log('7.5'.padStart('0',2))

// 模版字符串的换行：html加<br /> ,text加\n