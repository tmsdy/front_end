let str = '123456789'

console.log(str.replace('123', 333).replace('789', 999))

let test = `div>
<div id="toggleShow" contenteditable="false" style="color: #007fff;height: 40px;line-height: 40px;"> ——原始邮件—— </div><div id="wrapper">
    <div style="background: #efefef;padding: 8px;margin-bottom: 15px;"><div><span>From：</span>网易邮件中心 &lt;mail@service.netease.com&gt;</div><div><span>Date：</span>2019-10-08 19:40</div><div>`
// const test = ` <div id="toggleShow" contenteditable=false style="color: #007fff;height: 40px;line-height: 40px;"> ——原始邮件—— </div><div id="wrapper"> `
const headerHtml = `<div id="toggleShow" contenteditable="false" style="color: #007fff;height: 40px;line-height: 40px;"> ——原始邮件—— </div><div id="wrapper">`
console.log(test.match(headerHtml))