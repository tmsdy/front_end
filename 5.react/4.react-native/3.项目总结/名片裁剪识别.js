/*

1.设置宽高比防止图片裁剪模糊 & 压缩图片(compressImageQuality)防止解析时间过慢
ImagePicker.openCropper({
    path: image.path,
    width: image.width,
    height: (image.width * 16) / 9,
    compressImageQuality: 0.7,
}).then(image => {
    let { path, mime, size } = image
    let matchRes = path.match(/[^<>/\\\|:""\*\?]+\.\w+$/)
    let name = matchRes && matchRes[0]
    let imgInfo = {
        uri: path,
        type: mime,
        name,
        size
    }
    this.setState({
        imgInfo
    })
    this.uploadPic(imgInfo)
});


*/