
//数组去重 4种方法
const arr = ['a', 'bb', '22', 'a', 'yuci', 'haha', '22'];
// 1.es6数据结构Set
let qc_arr1 = Array.from(new Set(arr));
// let qc_arr1 = [...new Set(arr)] ; //另一种写法
console.log(qc_arr1);

//2.一次遍历向新数组push元素，用indexOf判断新数组中有没有，有就不push了
let qc_arr2 = [];
for (let i = 0; i < arr.length; i++) {
    // if (qc_arr2.indexOf(arr[i]) == -1) { //不包含某个值则返回-1  
    if (!qc_arr2.includes(arr[i])) {
        qc_arr2.push(arr[i]);
    }
}
console.log(qc_arr2);

//3.sort排序 -> 去除相邻重复元素
let arrSort = arr.sort();
// console.log(arrSort)
let qc_arr4 = [];
for (let i = 0; i < arrSort.length; i++) {
    if (arrSort[i] != arrSort[i + 1]) {
        qc_arr4.push(arrSort[i]);
    }
}
console.log(qc_arr4);

// 对象数组去重 过滤相同id
let responseList = [
    { id: 1, a: 2 },
    { id: 1, a: 1 },
    { id: 2, a: 3 },
    { id: 2, a: 1 },
    { id: 3, a: 4 },
]
let result = responseList.reduce((acc, cur) => {
    return Array.isArray(acc) && !acc.some(item => item.id === cur.id) ? acc.concat(cur) : acc
}, [])
console.log(result)
