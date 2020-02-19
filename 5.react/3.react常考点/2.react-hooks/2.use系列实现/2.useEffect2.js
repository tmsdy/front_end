const React = (function () {
    const hooks = []
    let currentHook = 0

    return {
        render(Component) {
            const component = Component()
            component.render()
            currentHook = 0 // 重置, 这里很关键, 将 hooks 的执行放到 hooks 队列中, 确保每次执行的顺序保持一致。
            return component
        },
        useState(initialValue) {
            hooks[currentHook] = hooks[currentHook] || initialValue

            function setVal(value) {
                hooks[currentHook] = value
            }

            return [hooks[currentHook++], setVal]
        },
        useEffect(callback, deps) {
            const ifUpdate = !deps

            // 判断 Deps 中的依赖是否改变
            const ifDepsChange = hooks[currentHook] ? !hooks[currentHook].every((r, index) => r === deps[index]) : true

            if (ifUpdate || ifDepsChange) {
                callback()

                hooks[currentHook++] = deps || []
            }
        }
    }
})()
var { useState, useEffect } = React

function Counter() {
    const [count, setCount] = useState(0)
    const [type, setType] = useState('hi')

    useEffect(() => {
        console.log('useEffect', count)
        console.log('type', type)
    }, [count, type])

    return {
        render: () => console.log('render', count),
        click: () => setCount(count + 1),
        noop: () => setCount(count), // 保持不变, 观察 useEffect 是否被调用
    }
}

/* 如下 mock 执行了 useEffect、render; 这里使用 React.render 的原因是为了重置 currentHook 的值 */
let comp = React.render(Counter) // useEffect 0 type hi render 0

/* 如下 mock 只执行了 render */
comp.noop()
comp = React.render(Counter) // render 0

/* 如下 mock 重新执行了 useEffect、render */
comp.click()
React.render(Counter) // useEffect 1, render 1