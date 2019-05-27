import { isHasSuffix } from '@/libs/utils.js'

export const setFileIcon = ext => `#file-${isHasSuffix(ext)}`

/* 文件大小计算 */
export const byteCalc = size => {
    if (size > 1048576) {
        return (size / 1048576).toFixed(2) + ' M'
    } else {
        return (size / 1024).toFixed(2) + ' KB'
    }
}
/* 判断是不是存在缩略图图片 */

export const hasImage = data => {
    return (_isVideo(data) || _isImage(data)) && data.preViewImageUrl
}
export const isVideo = _isVideo
// export const isImage = _isImage;

function _isImage(data) {
    const imgArr = ['png', 'jpg', 'jpeg', 'gif', 'bmp']
    return imgArr.includes(data.fileExtName.toLowerCase())
};

function _isVideo(data) {
    const videoArr = ['mp4', 'avi', 'flv', 'm3u8', 'rtmp']
    return videoArr.includes(data.fileExtName.toLowerCase())
}

/* 文件下载 */
export const getFile = _getFiles2

function _getFiles2(Filelist = [], docData = [], moduleCode) {
    if (Filelist.length == 1) {
        _getOneFile.apply(this, [Filelist[0], moduleCode])
        return
    }

    if (isTooBig(Filelist, docData)) {
        /* 文件太大请单独下载 */
        this.$message.error(this.$t('mxpcweb.document.global.1531101182644'))
        return
    }
    _getMoreFile.apply(this, [Filelist, moduleCode, true])
};

/* 判断多文件下载的时候所有文件加在一起是不是太大 */
function isTooBig(fileList = [], docData = []) {
    let idArr = fileList.map(item => item.fileId)
    let totalSize = docData.reduce((size, item) => {
        if (idArr.includes(item.fileId)) {
            return size + parseFloat((item.fileSize / 1024).toFixed(2))
        }
        return size
    }, 0)
    /* 目前限定30兆 */
    return totalSize >= 1024 * 30
}

/* 单文件下载 */
function _getOneFile(fileItem = {}, moduleCode) {
    let url = this.Global.baseURL + this.Global.api.v2.folders_fileDownloadV2
    let params = {
        ...fileItem,
        optCode: 'otDownload'
    }
    this.$http.get(url, { params })
        .then(res => {
            if (res.body.code.toString() == this.Global.RES_OK) {
                if (res.body.data.hasTheRight.toString() != 1) {
                    /* 没有下载权限！ */
                    this.$message.error(this.$t('mxpcweb.document.global.1531101224229'))
                    return
                }

                let durl = this.Global.baseURL + this.Global.api.Files.all_download + '?src=' + encodeURIComponent(res.body.data.url)

                this.downloadFile(durl)
            } else {
                this.$message.error(this.msg(res.body))
            }
        })
        .catch(err => {
            this.$message.error(this.$t(this.Global.errorTitle))
        })
};

/**
 * 多文件下载的具体实现方法
 * 参数：isNodeZip选择是node端打包还是java端打包
 * */
function _getMoreFile(fileList = [], moduleCode, isNodeZip = false) {
    let url
    if (isNodeZip) {
        url = this.Global.baseURL + this.Global.api.Files.docFiles_pack
    } else {
        url = this.Global.baseURL + this.Global.api.v2.folders_zipDownloadFiles
    }
    let data = {
        list: fileList,
        optCode: 'otDownload'
    }

    this.fileIsPack = true
    this.$http.post(url, data)
        .then(res => {
            if (res.body.code.toString() == this.Global.RES_OK) {
                if (isNodeZip) {
                    let durl = this.Global.baseURL + this.Global.api.Files.docFiles_download + res.body.data.fileName
                    this.downloadFile(durl)
                } else {
                    /* 如果改为java打包这里要修改   */
                    this.downloadFile(res.body.data.url)
                }
            } else {
                this.$message.error(this.msg(res.body))
            }
            this.fileIsPack = false
        })
        .catch(err => {
            this.fileIsPack = false
            this.$message.error(this.$t(this.Global.errorTitle))
        })
};

/* 文件删除 */
export function deleteFile(fileIdArr, moduleCode, fn) {
    /* '此操作将删除该文件, 是否继续?' */
    let tishi = this.$t('mxpcweb.document.global.1531101263992')
    if (fileIdArr.length > 1) {
        /* '此操作将删除选中的文件, 是否继续?' */
        tishi = this.$t('mxpcweb.document.global.1531101296944')
    }
    /* '提示' */
    let t = this.$t('mxpcweb.document.global.1529990680329')
    /* '确定' */
    let s = this.$t('mxpcweb.document.global.1529397179241')
    /* '取消' */
    let n = this.$t('mxpcweb.document.global.1531101459283')
    this.$confirm(tishi, t, {
        confirmButtonText: s,
        cancelButtonText: n,
        type: 'warning'
    }).then(() => {
        let url = this.Global.baseURL + this.Global.api.v2.folders_files
        let data = {
            body: {
                fileIds: fileIdArr,
                moduleCode: moduleCode
            }
        }
        /* 删除文件 */
        this.$http.delete(url, data)
            .then(res => {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    /* 已删除 */
                    this.$message.success(this.$t('mxpcweb.document.global.1531101498268'))
                    fn && fn()
                } else {
                    this.$message.error(this.msg(res.body))
                }
            })
            .catch(err => {
                console.log(err)
                this.$message.error(this.$t(this.Global.errorTitle))
            })
    }).catch(() => {
        /* 已取消删除 */
        this.$message.info(this.$t('mxpcweb.document.global.1531101544830'))
    })
};

/* 文件夹删除 */
export function deleteFolder(folderId, folderName, folderType, moduleCode, cbfn) {
    /* `将删除 ${folderName}, 是否继续?` */
    let c = this.$t('mxpcweb.document.global.1531101639865', [folderName])
    /* '提示' */
    let t = this.$t('mxpcweb.document.global.1529990680329')
    /* '确定' */
    let s = this.$t('mxpcweb.document.global.1529397179241')
    /* '取消' */
    let n = this.$t('mxpcweb.document.global.1531101459283')
    this.$confirm(c, t, {
        confirmButtonText: s,
        cancelButtonText: n,
        type: 'warning'
    }).then(() => {
        let url = this.Global.baseURL + this.Global.api.v2.folders_foldersTree
        let data = {
            body: {
                folderId,
                moduleCode,
                folderType
            }
        }
        this.$http.delete(url, data)
            .then(res => {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    /* 删除成功 */
                    this.$message.success(this.$t('mxpcweb.document.global.1529397970175'))
                    cbfn && cbfn()
                } else {
                    this.$message.error(this.msg(res.body))
                }
            })
            .catch(err => {
                this.$message.error(this.$t(this.Global.errorTitle))
            })
    }).catch(() => {
        /* '已取消删除' */
        this.$message.info(this.$t('mxpcweb.document.global.1531101544830'))
    })
};
