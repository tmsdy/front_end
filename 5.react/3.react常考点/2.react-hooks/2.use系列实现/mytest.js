let React = (function () {
    let _val
    return {
        useState(initialVal) {
            _val = _val || initialVal
            function setVal(value) {
                _val = value
            }
            return [_val, setVal]
        }
    }
})()
function Counter() {
    const [count, setCount] = React.useState(0)

    return {
        render: () => console.log(count),
        click: () => setCount(count + 1)
    }
}

Counter().render() // 0
Counter().click()  // 模拟点击
Counter().render() // 1