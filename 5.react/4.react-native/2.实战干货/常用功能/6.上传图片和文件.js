/*
1.react-native-fs 记得手动link
link第一个.a文件

2.上传方式：FormData+axios.post
let formData = new FormData()
formData.append('file', {
    uri: path,
    type: mime,
    name: escape(name),
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

3.注意：
对name字段编码（后台接收需要解码，才能得到真正的文件名），不然会报类似的错误
unexpected char 0*6587 at 34 in content-disposition


*/