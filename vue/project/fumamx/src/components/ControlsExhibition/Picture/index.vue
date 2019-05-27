<template>
    <div class="ControlsExhibition">
        <span class="label" :style="{width:labelWidth,'text-align':labelPosition}" style="padding-top:1px;">{{itemData.cnFieldCaption}}</span>

        <div class="content" :style="{'margin-left':labelWidth}">
            <div class="openImgBox">

                <div class="openImg" v-for="(item,index) in picList" :key="index">
                    <a :href="picUrl(item,'orig')" :data-lightbox="picList[0]" data-title="FumaMX"><img :src="picUrl(item,'80x80')"></a>
                    <span class="close" @click="close(item,index)" v-if="itemData.editState == 1">
                        <i class="iconfont icon-close"></i>
                    </span>
                </div>

                <template v-if="itemData.editState == 1">
                    <label class="add transition_all" @change="onChange" v-show="picList.length < 9">
                        <input type="file" class="PictureAddFile">
                        <i class="iconfont icon-plus-file transition_all"></i>
                    </label>
                </template>

            </div>
        </div>

        <fileupload-dialog :url="Global.uploadUrl" ref="fileuploadDialog" method="put" :fileUploadSuccess="fileUploadSuccess"></fileupload-dialog>
    </div>
</template>

<script>
import FileuploadDialog from '@/basecomponents/FileuploadDialog/index'
// import 'lightbox2'
export default {
    name: 'ControlsExhibition',
    props: {
        itemData: {
            type: Object,
            default: function () {
                return {}
            }
        },
        labelWidth: {
            type: String,
            default: '100px'
        },
        labelPosition: {
            type: String,
            default: 'left'
        },
        size: {
            type: String,
            default: 'small'
        }
    },
    data() {
        let _this = this
        return {
            picList: [], // 图片所有ID
            ruleForm: {
                input: ''
            },
            rules: {
                // 请上传
                input: [{ required: true, message: this.$t('mxpcweb.components.1530845849475') + _this.itemData.cnFieldCaption, trigger: 'blur' }]
            }
        }
    },
    created() {
        this.picList = Object.assign([], this.itemData.fieldValue) // 复制一份，后面比较用
        // console.log(this.itemData);
        // console.log(this.picList);
    },
    methods: {
        // 提交数据
        submit() {
            this.$emit('modifyData', {
                contId: this.itemData.contId,
                [this.itemData.fieldName]: this.picList
            })
        },
        close(item, index) {
            this.picList.splice(index, 1)
            this.submit()// 提交数据
        },
        onChange(e) {
            this.$refs['fileuploadDialog'].upload(e.target)
        },
        // 图片更新成功的返回
        fileUploadSuccess(res) {
            if (res.code === this.Global.RES_OK) {
                this.picList.push(res.data)
                this.submit()// 提交数据
            } else {
                this.$message.error(res.msg)
            }
            // console.log(res)
        },
        // 图片展示的URL
        picUrl(picId, picSize) {
            return this.getGlobalImgSrc(picId, picSize)
        }
    },
    components: {
        'fileupload-dialog': FileuploadDialog
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "../zh-cn.less";
@import "../en.less";
</style>
