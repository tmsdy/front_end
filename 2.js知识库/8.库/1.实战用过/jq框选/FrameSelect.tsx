import * as React from "react"
import { Button } from 'antd'

interface IPosTarget {
  x: number,
  y: number,
  width: number,
  height: number
}

interface IState {
  showDrag: boolean,
  posTarget: IPosTarget
}

interface IProps {
  completeSelect: (posTarget: IPosTarget) => void,

}

export default class FrameSelect extends React.Component<IProps, IState> {
  state: IState = {
    showDrag: true,
    posTarget: {
      x: 60,
      y: 30,
      width: 400,
      height: 200
    }
  }

  componentDidMount() {
    setTimeout(() => {
      const totalHeight = document.body.scrollHeight
      console.log('totalHeight:', totalHeight)
      $('.dzFrame').height(totalHeight)
    }, 3000)
    document.onmousedown = (downEvent) => {
      const downX = downEvent.pageX
      const downY = downEvent.pageY
      console.log('onmousedown', downX, downX)
      this.setState({
        posTarget: {
          x: downX,
          y: downY,
          width: 0,
          height: 0
        }
      })
      document.onmousemove = (moveEvent) => {
        // console.log(moveEvent)
        const x = moveEvent.pageX
        const y = moveEvent.pageY
        const _x = Math.abs(x - downX)
        const _y = Math.abs(y - downY)
        if (_x + _y < 60) {
          return
        }
        this.setState({
          showDrag: true,
          posTarget: {
            x: Math.min(x, downX),
            y: Math.min(y, downY),
            width: _x,
            height: _y
          }
        })
        // console.log('onmousemove xy=', x, y)
      }
      document.onmouseup = (upEvent) => {
        const { showDrag } = this.state
        if (showDrag) {
          document.onmousemove = null
          document.onmouseup = null
          this.props.completeSelect(this.state.posTarget)
        }
      }
    }
  }

  render() {
    const { showDrag, posTarget: { x, y, width, height } } = this.state
    return (
      showDrag ? <div className="dzFrame">
        <div style={{ height: y }} className="header">header</div>
        <div style={{ height }} className="middle">
          <div style={{ width: x }} className="left">left</div>
          <div style={{ width, height }} className="center">
            center
          </div>
          <div className="right">right</div>
        </div>
        <div className="bottom">bottom</div>
        <div style={{
          top: y + height + 6,
          left: (x + width) / 2
        }} className="controlRow">
          <Button className="btn" type='primary' size="small">添加至列表</Button>
          <Button className="btn" type='danger' size="small" >从列表中删除</Button>
          <Button size="small" >取消</Button>
        </div>
      </div> : null
    )
  }
}
