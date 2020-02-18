//删除数组arr2中与arr1中相同的元素

let arr1 = [1,5,7];
let arr2 = [1,2,3,4,5,6,7]
for(let i = 0;i < arr1.length;i ++){
    for(let x = 0;x < arr2.length;x ++){
        if(arr1[i] === arr2[x]){
            arr2.splice(x,1)
        }
    }
}
console.log(arr2) ;