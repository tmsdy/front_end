/*
1.react-native-fs 记得手动link
link第一个.a文件

2.上传：RNFS.uploadFiles(options).promise
在安卓正常，在ios只有begin和progress，这个promise reject了
推断：
1）选图片时候以file:///data/user/...开头的图片路径才能正常上传
const options = {
            toUrl: uploadUrl,
            files: fileList,
            headers: {
                'Accept': 'application/json',
            },
            method: 'POST',
            begin: (res: { jobId: number }) => {
                console.log('begin', res);
            },
            progress: (res: ProgressRes) => {
                console.log('progress', res);
                this.setState({
                    extraList: this.state.extraList.map((item, i) => {
                        if (item.id === newId) {
                            item.jobId = res.jobId
                            item.sendSize = res.totalBytesSent
                            item.totalSize = res.totalBytesExpectedToSend
                        }
                        return item
                    })
                })
            }
        }
        RNFS.uploadFiles(options).promise
            .then(res => {
                console.log(res)
                // let response = JSON.parse(res.body);
                // if (response.code == "0") {
                //     this.setState({
                //         extraList: this.state.extraList.map((item, i) => {
                //             if (item.id === newId) {
                //                 item.sentOff = false
                //                 item.url = downloadBaseUrl + response.data
                //             }
                //             return item
                //         })
                //     }, () => {
                //         console.log(this.state.extraList)
                //     })
                //     this.forceUpdate()
                // }
            })
            .catch(err => {
                Toast.fail('上传图片出错')
            })

    selectLocalFile = () => {
        let filename
        this.closeCopyDark()
        RNFileSelector.Show(
            {
                title: '选择文件作为附件',
                onDone: (path: string) => {
                    console.log('file selected: ' + path)
                    let matchRes = path.match(/[^<>/\\\|:""\*\?]+\.\w+$/)
                    filename = matchRes && matchRes[0]
                    console.log(filename)
                    this.id += 1
                    if (filename && filename.includes('.')) {
                        this.uploadFileItem([{
                            name: filename.split('.')[0],
                            filename,
                            filepath: path,
                            filetype: Mime.getType(filename.split('.')[1])
                        }], this.id + 1)
                    }
                },
                onCancel: () => {
                    console.log('cancelled')
                }
            }
        )
    }

*/