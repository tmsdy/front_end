import 'bootstrap'
import './style.css'
import calc from './a'
// import { Provider } from 'react-redux'
import React from 'react'

// 1.import在生产环境默认tree-shaking,require不行，这是为什么前端用import
console.log(calc.sum(1,2))

// 2.scope hosting 作用域提升
let a = 1;
let b = 2;
let c = 3;
let d = a+b+c; //webpack自动省略一些可以简化的代码
console.log(d)

console.log(DEV)

let button = document.createElement('button')
button.innerHTML = 'hello'
button.addEventListener('click',function(){
  import('./source').then(data=>{
    console.log(data.default) //需要的数据点击时才加载（懒加载，用jsonp实现的）
  })
})
document.body.appendChild(button)

let xhr = new XMLHttpRequest()
// 默认访问当前http://localhost:8080/api/user，webpack-dev-server转发请求到9999端口
xhr.open('GET','/api/user',true)

xhr.onload = function () {
  console.log(xhr.response)
}

xhr.send()


