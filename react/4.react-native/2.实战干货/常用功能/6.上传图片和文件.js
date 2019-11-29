/*
1.react-native-fs 记得手动link
link第一个.a文件

2.上传方式：FormData+axios.post
let formData = new FormData()
formData.append('file', {
    uri: path,
    type: mime,
    name,
    size
})
axios({
    url: BaseURL + 'client/cardscan/',
    method: 'POST',
    onUploadProgress: (event) => { //原生获取上传进度的事件
        console.log(event.lengthComputable, event.total, event.loaded)
    },
    data: formData
}).then(res => {
    console.log('res===', res)
})

3.


*/