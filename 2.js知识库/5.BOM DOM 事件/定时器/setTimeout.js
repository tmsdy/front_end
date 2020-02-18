
// 1.可传参
function sayHello(name, age) {　　//在2秒钟后打印"我叫CodePlayer，今年18岁!"
    console.log("我叫" + name + "，今年" + age + "岁!");
}
setTimeout(sayHello, 2000, "CodePlayer", 18);