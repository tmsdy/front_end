//1.函数参数解构,并可以赋默认值
function fileSammary({ name, extension, size = 0 }) {
    return `${name}.${extension}的总大小是${size}`;
}
console.log(fileSammary(saveFiled));

//2.自定义key
let obj = { id: 22, val: '111' };
let { id: m_id, val: m_val } = obj;

console.log(m_id, m_val);

//3.结合展开运算符
let [name, ...rest] = names;
//console.log(...rest) ; //...rest就代表name后面的两个了

// 4.数据格式转换
const points = [
    [4, 5],
    [10, 1],
    [0, 40]
]
// * 期望数据格式
[
    { x: 4, y: 5 },
    { x: 10, y: 1 },
    { x: 0, y: 40 }
]
let newPoints = points.map(([x, y]) => {
    return { x, y }
})
console.log(newPoints);

