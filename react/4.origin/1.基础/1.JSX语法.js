/*

1.React和JSX相关，所以每个页面必须引用

2.转换为JSX：
    1）一般情况：
    <div id="red" key="color_1">
        <p>我是子元素</p>
        <p>我是子元素</p>
    </div>
    
    React.createElement("div", {
            id: "red",
            key: "color_1"
        }, 
        React.createElement("p", null, "\u6211\u662F\u5B50\u5143\u7D20"), 
        React.createElement("p", null, "\u6211\u662F\u5B50\u5143\u7D20")
    );
    2）函数返回:
    function comp(){
        return <a>123</a>
    }
    <Comp>
        <div id="red" key="color_1">
            <p>我是子元素</p>
            <p>我是子元素</p>
        </div>
    </Comp>
    
    function comp() {
        return React.createElement("a", null, "123");
    }

    React.createElement(
        Comp, //如果是小写的comp，这里翻译成'comp'被认为是原生dom节点，后面运行会报错
        null, 
        React.createElement("div", {
        id: "red",
        key: "color_1"
    }, React.createElement("p", null, "\u6211\u662F\u5B50\u5143\u7D20"), React.createElement("p", null, "\u6211\u662F\u5B50\u5143\u7D20")));

*/