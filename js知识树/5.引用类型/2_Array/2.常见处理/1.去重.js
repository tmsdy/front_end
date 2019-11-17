
//数组去重 4种方法
const arr = ['a','bb','22','a','yuci','haha','22'];
// 1.es6数据结构Set
let qc_arr1 = Array.from(new Set(arr)) ;
// let qc_arr1 = [...new Set(arr)] ; //另一种写法
console.log(qc_arr1); 

//2.一次遍历向新数组push元素，用indexOf判断新数组中有没有，有就不push了
let qc_arr2 = [];  
for(let i = 0; i < arr.length; i++) {  
    if(qc_arr2.indexOf(arr[i]) == -1) { //不包含某个值则返回-1  
        qc_arr2.push(arr[i]);  
    }  
}  
console.log(qc_arr2); 

//3.排序去除相邻重复元素

let arrSort = arr.sort();  
// console.log(arrSort)
let qc_arr4 = [];  
for(let i = 0; i< arrSort.length; i++) {  
    if(arrSort[i] != arrSort[i+1]) {  
        qc_arr4.push(arrSort[i]);  
    }  
}  
console.log(qc_arr4);