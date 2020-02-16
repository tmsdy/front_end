var list = [1,2,3,4,5];

// 删除
list.splice(0,1); // 把数组从第0索引开始删1个，返回[1]
console.log(list); // [2,3,4,5] ；

list.splice(1,2);  // 把数组从第1索引开始删2个，返回[2,3]
console.log(list); // [1,4,5]

list.splice(2); // 把数组从第2索引开始后面全删了，[3,4,5]
console.log(list); // [1,2]

//替换
list.splice(0,1,4); // 把数组从第0索引开始删1个，返回[1]，把删除的位置加了个4
console.log(list);  // [4, 2, 3, 4, 5]

list.splice(1,2,4,5,6); // 把数组从第1索引开始删2个，返回[2,3]，把删除的位置加了4,5,6
console.log(list);  // [4, 5, 6, 3, 4, 5]

//添加
list.splice(1,0,5); // 表示在下标为1处添加一项5
console.log(list);    // [1,5,2,3]