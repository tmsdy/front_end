/**
 * 适配步骤
 * 1.获取宽度方向的缩放比例：let scale = Dimensions.get('window').width / 375
 * 2.我们照设计图写的大小 * scale 就是正确的大小了
 */
export const SCREEN_WIDTH = Dimensions.get('window').width
export const SCREEN_HEIGHT = Dimensions.get('window').height

export const px2dp = (px) => {
    let scaleWidth = SCREEN_WIDTH / designWidth * designPR; //1.05
    let scaleHeight = SCREEN_HEIGHT / designHeight * designPR; //1.2
    let scale = Math.min(scaleWidth, scaleHeight); //这个是取小的，其实就取宽的比例就行
    px = Math.round((px * scale + 0.5));
    return px / designPR;
};

// 获取距顶部的定位
export const scale = Number((SCREEN_WIDTH / designWidth).toFixed(2))
UIManager.measure(findNodeHandle(currentRef), (x, y, width, height, pageX, pageY) => {
    console.log(x, y, width, height, pageX, pageY)
    toTop = Number((pageY / scale).toFixed(2))
    this.setState({
        toTop
    })
})