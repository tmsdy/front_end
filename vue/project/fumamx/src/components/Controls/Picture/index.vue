<template>
    <div class="Controls-Picture">

        <fileupload-dialog :url="Global.uploadUrl" ref="fileuploadDialog" method="put" :fileUploadSuccess="fileUploadSuccess" :fileUploadError="fileUploadError" :maxNum="maxNum"></fileupload-dialog>

        <el-form :model="ruleForm" :rules="rules" onsubmit="return false" ref="ruleForm" :label-width="labelWidth" :label-position="labelPosition">
            <el-form-item :label="showLabel?itemData.cnFieldCaption:''" :prop="prop()">
                <div class="openImgBox" style="width:170px">

                    <div class="openImg" v-for="(item,index) in picList" :key="index">
                        <a :href="picUrl(item, 'orig')" :data-lightbox="picList[0] + getId()" data-title="FumaMX"><img :src="picUrl(item,'80x80')"></a>
                        <span class="close" v-show="!itemData.disabled" @click="close(item,index)"><i class="iconfont icon-close"></i></span>
                    </div>

                    <label v-if="inputHave" class="add transition_all" @change="onChange" v-show="picList.length < 9&&!itemData.disabled">
                        <input type="file" class="PictureAddFile" :multiple="true"/>
                        <i class="iconfont icon-plus-file transition_all"></i>
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
            },
            inputHave: true,
            maxNum: 9,
            maxNumBase: 9
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
        close(item, index) {
            this.picList.splice(index, 1)
            this.maxNum = this.maxNumBase - this.picList.length
        },
        onChange(e) {
            this.$refs['fileuploadDialog'].upload(e.target)
        },
        // 图片更新成功的返回
        fileUploadSuccess(res) {
            this.picList.push(res.data)
            this.maxNum = this.maxNumBase - this.picList.length
            this.inputHave = false
            this.$nextTick(() => {
                this.inputHave = true
            })
        },
        fileUploadError() {
            this.inputHave = false
            this.$nextTick(() => {
                this.inputHave = true
            })
        },
        getOpenpicList() {
            return this.picList
        },
        // 图片展示的URL
        picUrl(picId, picSize) {
            return this.getGlobalImgSrc(picId, picSize)
        },
        updata() {
            let newArray = []
            let { fieldValue } = this.itemData
            if (isArray(fieldValue)) {
                fieldValue.forEach(element => {
                    newArray.push(element)
                })
                this.picList = newArray
                this.maxNum = this.maxNumBase - this.picList.length
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
            this.maxNum = this.maxNumBase - this.picList.length
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
        this.close = null
        this.picUrl = null
        this.fileUploadSuccess = null
        this.onChange = null
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.Controls-Picture {
    position: relative;
    .openImgBox {
        width: 100%;
        .openImg {
            width: 40px;
            height: 40px;
            display: block;
            float: left;
            position: relative;
            border-radius: 4px;
            border: 1px solid rgba(234, 237, 239, 1);
            margin-right: 5px;
            margin-bottom: 5px;
            img {
                width: 100%;
                height: 100%;
                display: block;
                border-radius: 3px;
            }
            .close {
                border: 1px solid #ccc;
                display: inline-block;
                width: 18px;
                height: 18px;
                line-height: 16px;
                text-align: center;
                background-color: #fff;
                border-radius: 50%;
                position: absolute;
                top: -6px;
                right: -3px;
                display: none;
                i {
                    font-size: 10px;
                }
            }
            &:hover {
                .close {
                    display: inline-block;
                    &:hover {
                        color: #008cee;
                        font-weight: bold;
                        cursor: pointer;
                    }
                }
            }
        }
        .add {
            width: 40px;
            height: 40px;
            display: block;
            float: left;
            background: rgba(255, 255, 255, 1);
            border-radius: 4px;
            border: 1px solid rgba(234, 237, 239, 1);
            margin-bottom: 5px;
            .PictureAddFile {
                display: none;
            }
            i {
                font-size: 20px;
                display: block;
                margin-left: 10px;
                margin-top: 1px;
            }
            &:hover {
                border-color: #555;
                cursor: pointer;
            }
        }
    }
}
</style>
