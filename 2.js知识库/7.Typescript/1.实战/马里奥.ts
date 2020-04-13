// 1.怎样给解构值赋类型
var addListener = ({ urls, cancel }: { urls: string[], cancel?: Boolean }) => { }

// 2.自己建一个index.d.ts引入来自定义类型
declare namespace chrome.runtime {
  function sendMessageAsync({ type }: { type: string }): Promise<any>
}

interface Element extends Node, Animatable, ChildNode, InnerHTML, NonDocumentTypeChildNode, ParentNode, Slotable {
  [x: string]: any; // 解决dom上属性的问题
}

// 3.template = {}时不能赋值template.marketScene = '常规投放';
// 得先初始化template = { marketScene: '' }