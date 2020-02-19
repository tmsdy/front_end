import React, { ConcurrentMode } from 'react'
import { flushSync } from 'react-dom'
import './index.css'

class Parent extends React.Component {
    state = {
        async: true,
        num: 1,
        length: 2000,
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            this.updateNum()
        }, 200)
    }

    componentWillUnmount() {
        // 别忘了清除interval
        if (this.interval) {
            clearInterval(this.interval)
        }
    }

    updateNum() {
        const newNum = this.state.num === 3 ? 0 : this.state.num + 1
        if (this.state.async) { // 动画流畅，数字变化较慢
            this.setState({
                num: newNum,
            })
        } else {
            flushSync(() => { // 可以提升setState优先级,然后数字变化频繁但动画会卡
                this.setState({
                    num: newNum,
                })
            })
        }
    }

    render() {
        const children = []

        const { length, num, async } = this.state

        for (let i = 0; i < length; i++) {
            children.push(
                <div className="item" key={i}>
                    {num}
                </div>,
            )
        }

        return (
            <div className="main">
                async:{' '}
                <input
                    type="checkbox"
                    checked={async}
                    onChange={() => flushSync(() => this.setState({ async: !async }))}
                />
                <div className="wrapper">{children}</div>
            </div>
        )
    }
}
/*
让react的整体渲染流程有优先级的排比，让整体的渲染流程变得可中断，这样就能进行调度了，把更多CPU性能给优先级高的交互任务
*/
export default () => (
    // ConcurrentMode下组件的setState更新都是第一优先级的
    <ConcurrentMode>
        <Parent />
    </ConcurrentMode>
)
