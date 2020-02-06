// react
import { findDomNode } from 'react-dom';
console.log(findDomNode(this.recipientRef.current))

// react-native

// 1.public recipientRef = React.createRef()
// 2.ref={this.recipientRef}
this.recipientRef.current.measure((fx, fy, width, height, px, py) => {
    console.log('Component width is: ' + width)
    console.log('Component height is: ' + height)
    console.log('X offset to frame: ' + fx)
    console.log('Y offset to frame: ' + fy)
    console.log('X offset to page: ' + px)
    console.log('Y offset to page: ' + py)
})
// 或者
import { UIManager, findNodeHandle } from 'react-native';
UIManager.measure(findNodeHandle(this.recipientRef.current), (x, y, width, height, pageX, pageY) => {
    console.log(x, y, width, height, pageX, pageY)
    toTop = Number((height + pageY / scale).toFixed(2))
    console.log('toTop11', toTop)
    return {
        top: toTop,
        height: SCREEN_HEIGHT - toTop,
    }
})

