let names = []
//元素增加
names[4]="小胡";                    //通过赋值，直接添加了两项，null和“小胡”
names.unshift("小李","小兰");       //首部添加
names.push("小李","小兰");          //末尾添加
console.log(names)

//元素删除
var item = names.pop();             //尾部删除
item=names.shift();                 //首部删除
console.log(names)
console.log(item)

 //参数表示开始删除的位(包含),要删除的数目，在删除位置处添加的元素，修改源数组
 names.splice(2,1,"小季","小明"); 
 console.log(names)