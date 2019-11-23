
var obj1 = { a: 1, arr: [2, 3] };
var obj2 = deepCopy(obj1);

obj1.a = 5;
obj1.arr[1] = 5;

console.log(obj2.a); // 1
console.log(obj2.arr[1]); // 3

function deepCopy(obj) {
    if (!obj) return obj
    var newObj = Array.isArray(obj) ? [] : {};// 确认obj是数组还是对象
    if (typeof obj === 'object') {
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                // 如果obj的子元素是对象，递归操作
                if (obj[key] && typeof obj[key] === 'object') {
                    newObj[key] = deepCopy(obj[key]);
                } else {
                    // 如果不是，直接赋值
                    newObj[key] = obj[key];
                }
            }
        }
    }
    return newObj;

}
console.log(deepCopy(null))

