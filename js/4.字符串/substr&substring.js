

let str = "aaaa,fff,cccc,";

// console.log(str.lastIndexOf(','))； //13

// 1.substr 包前包后
console.log(str.substr(1, 3)); //aaa

// 2.substring 包前不包后
console.log(str.substring(1, 3)); //aa