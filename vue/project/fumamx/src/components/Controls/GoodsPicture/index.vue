<template>
    <div class="Controls-Picture">

        <fileupload-dialog :url="Global.uploadUrl" ref="fileuploadDialog" method="put" :fileUploadSuccess="fileUploadSuccess" :multiple="false"></fileupload-dialog>

        <el-form :model="ruleForm" :rules="rules" onsubmit="return false" ref="ruleForm" :label-width="labelWidth" :label-position="labelPosition">
            <el-form-item :label="showLabel?itemData.cnFieldCaption:''" :prop="prop()">
                <div style="height:30px;color:#606266">
                    <!-- 建议上传750*750像素以上的实拍大图、包含商品整体款式和商品细节。 -->
                    {{$t('mxpcweb.PP001.PP001List.1543301929027')}}
                </div>
                <div class="openImgBox">
                    <div class="openImg" v-for="(item,index) in picList" :key="index">
                        <a :href="picUrl(item,'100x100')" :data-lightbox="picList[0] + getId()" data-title="FumaMX">
                            <div class="imgBox">
                                <img :src="picUrl(item,'100x100')">
                            </div>
                        </a>
                        <span class="close" v-show="!itemData.disabled">
                            <i class="iconfont icon-del" @click="close(item,index)"></i>
                            <span class="left" v-if="index != 0"><i class="iconfont icon-page-left" @click="leftClick(index)"></i></span>
                            <span class="right" v-if="index != picList.length -1"><i class="iconfont icon-page-right" @click="rightClick(index)"></i></span>
                        </span>
                        <!-- 主图 -->
                        <div class="text-center" v-if="index == 0">{{$t('mxpcweb.PP001.PP001List.1543301969985')}}</div>
                    </div>
                    <label class="add transition_all" @change="onChange" v-show="picList.length < 9&&!itemData.disabled">
                        <input type="file" class="PictureAddFile" :multiple="true" />
                        <i class="iconfont icon-plus-file transition_all" style="color:#606266"></i>
                    </label>
                </div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { isArray } from '@/libs/utils.js'
import FileuploadDialog from '@/basecomponents/FileuploadDialog/index'
// import 'lightbox2'
export default {
    name: 'Controls-Picture',
    props: {
        itemData: {
            type: Object,
            default: function () {
                return {}
            }
        },
        isProp: {
            type: Boolean,
            default: false

        },
        labelWidth: {
            type: String,
            default: '100px'
        },
        labelPosition: {
            type: String,
            default: 'right'
        },
        showLabel: {
            type: Boolean,
            default: true
        },
        size: {
            type: String,
            default: 'small'
        }
    },
    data() {
        return {
            picList: [], // 图片所有ID
            ruleForm: {
                input: ''
            },
            rules: {
                input: []
            }
        }
    },
    created() {

    },
    methods: {
        getId() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
                let r = Math.random() * 16 | 0
                let v = c == 'x' ? r : (r & 0x3 | 0x8)
                return v.toString(16)
            })
        },
        rightClick(index) {
            let picList = []
            this.picList.forEach(item => {
                picList.push(item)
            })
            this.picList = []
            let temp = picList[index]
            picList[index] = picList[index + 1]
            picList[index + 1] = temp
            this.picList = picList
        },
        leftClick(index) {
            let picList = []
            this.picList.forEach(item => {
                picList.push(item)
            })
            this.picList = []
            let temp = picList[index]
            picList[index] = picList[index - 1]
            picList[index - 1] = temp
            this.picList = picList
        },
        close(item, index) {
            this.picList.splice(index, 1)
        },
        onChange(e) {
            let inputElement = e.target
            let files = []
            if (Array.isArray(inputElement)) { // [file] 直接是文件数组
                inputElement.forEach(function (element) {
                    // 解决图片name丢失问题
                    files.push(dataURLtoBlob(element))
                }, this)
            } else { // 是input type="file"
                if (Array.isArray(inputElement.files)) {
                    files = inputElement.files
                } else {
                    Object.keys(inputElement.files).forEach(function (key) {
                        files.push(inputElement.files[key])
                    })
                }
            }
            let _this = this
            if (files.length + this.picList.length > 9) {
                // 图片总数超过最大限制，请重新选择！
                _this.$confirm(_this.$t('mxpcweb.PP001.PP001List.1543302028817'), _this.$t('mxpcweb.client.1529047715824'), {
                    confirmButtonText: _this.$t('mxpcweb.client.1529047741736'),
                    cancelButtonText: _this.$t('mxpcweb.client.1529047588840'),
                    type: 'warning'
                }).then(() => {
                }).catch(() => {
                })
            } else {
                _this.$refs['fileuploadDialog'].upload(inputElement)
            }
        },
        // 图片更新成功的返回
        fileUploadSuccess(res) {
            this.picList.push(res.data)
        },
        getOpenpicList() {
            return this.picList
        },
        // 图片展示的URL
        picUrl(picId, picSize) {
            return this.getGlobalImgSrc(picId, picSize)
        },
        updatas(list) {
            let newArray = []
            if (isArray(list)) {
                list.forEach(element => {
                    newArray.push(element)
                })
                this.picList = newArray
            }
        },
        updata() {
            let newArray = []
            let { fieldValue } = this.itemData
            if (isArray(fieldValue)) {
                fieldValue.forEach(element => {
                    newArray.push(element)
                })
                this.picList = newArray
            }
        },
        prop() {
            if (this.itemData.disabled) {
                return ''
            };
            if (this.isProp == true) {
                return ''
            } else {
                if (this.itemData.isNotNull == 1) {
                    return 'input'
                } else {
                    return ''
                }
            }
        },
        clearData() {
            this.picList = []
        },
        submitForm() {
            let _this = this
            let isPass = true
            this.$refs['ruleForm'].validate((valid) => {
                if (!valid) {
                    isPass = false
                } else {
                    _this.$emit('update:controlData', _this.picList)
                }
            })
            return isPass
        }
    },
    components: {
        'fileupload-dialog': FileuploadDialog
    },
    beforeDestroy: function () {
        this.updatas = null
        this.picUrl = null
        this.onChange = null
        this.leftClick = null
        this.rightClick = null
        this.fileUploadSuccess = null
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.Controls-Picture {
    position: relative;
    .openImgBox {
        width: 100%;
        height: 130px;
        .openImg {
            width: 102px;
            height: 102px;
            display: block;
            float: left;
            position: relative;
            border-radius: 4px;
            border: 1px solid rgba(234, 237, 239, 1);
            margin-right: 5px;
            margin-top: 5px;
            .imgBox {
                width: 100px;
                height: 100px;
                position: relative;
                img {
                    max-width: 100px;
                    max-height: 100px;
                    position: absolute;
                    margin: auto;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    border-radius: 3px;
                }
            }
            .close {
                width: 100px;
                height: 100px;
                border-radius: 4px;
                line-height: 100px;
                text-align: center;
                background-color: #fff;
                position: absolute;
                left: 0;
                top: 0;
                background: rgba(0, 0, 0, 0.5);
                display: none;
                i {
                    font-size: 16px;
                    color: white;
                    &:hover {
                        cursor: pointer;
                    }
                }
                .left,
                .right {
                    width: 16px;
                    height: 16px;
                    border-radius: 8px;
                    background: white;
                    position: absolute;
                    bottom: 10px;
                    display: inline-block;
                    line-height: 16px;
                    text-align: center;
                    i {
                        font-size: 12px;
                        color: black;
                    }
                }
                .left {
                    left: 30px;
                }
                .right {
                    right: 30px;
                }
            }
            &:hover {
                .close {
                    display: inline-block;
                    // &:hover{
                    //   color: #008cee;
                    //   font-weight:bold;
                    //   cursor: pointer;
                    // }
                }
            }
        }
        .add {
            width: 100px;
            height: 100px;
            display: block;
            float: left;
            background: rgba(255, 255, 255, 1);
            border-radius: 4px;
            border: 1px solid rgba(234, 237, 239, 1);
            margin-top: 5px;
            .PictureAddFile {
                display: none;
            }
            i {
                font-size: 20px;
                display: block;
                margin-left: 38px;
                margin-top: 28px;
            }
            &:hover {
                border-color: #555;
                cursor: pointer;
            }
        }
    }
}
</style>
