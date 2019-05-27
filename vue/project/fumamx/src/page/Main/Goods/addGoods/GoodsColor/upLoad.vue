<template>
<div style="display:inline-block;vertical-align: bottom;margin-left:10px;height:32px;">
    <template v-if="picList!=''">
        <div class="imgBox">
            <img :src="picUrl(picList)" alt="">
        </div>
        <!-- 删除图片 -->
        <span class="text-hover" style="color:#008CEE" @click="close()">删除图片</span>
    </template>
    <label v-else class="add transition_all" @change="onChange">
        <input type="file" class="PictureAddFile" />
        <!-- 上传图片 -->
        <div class="addBut">上传图片</div>
    </label>
    <fileupload-dialog :url="Global.uploadUrl" ref="fileuploadDialog" method="put" :fileUploadSuccess="fileUploadSuccess"></fileupload-dialog>
</div>
</template>

<script>
import FileuploadDialog from '@/basecomponents/FileuploadDialog/index'
export default {
    name: 'Controls-Color',
    props: {
        imagesId: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            picList: ''
        }
    },
    created() {
    },
    mounted() {
    },
    methods: {
        close () {
            this.picList = ''
        },
        picUrl (picId) {
            return this.getGlobalImgSrc(picId)
        },
        // 图片更新成功的返回
        fileUploadSuccess (res) {
            let _this = this
            if (res.code.toString() == _this.Global.RES_OK) {
                this.picList = res.data
                this.$emit('update:value', this.picList)
            } else {
                this.$message.error(this.msg(res.body))
            }
        },
        onChange (e) {
            this.$refs['fileuploadDialog'].upload(e.target)
        },
        updata () {
            this.picList = this.imagesId
        }
    },
    components: {
        'fileupload-dialog': FileuploadDialog
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.imgBox{
    width: 32px;
    height: 32px;
    display: inline-block;
    vertical-align: middle;
    border-radius: 3px;
    overflow: hidden;
    margin-right: 10px;
    position: relative;
    border:1px solid #eee;
    img{
        max-width: 32px;
        max-height: 32px;
        position: absolute;
        margin: auto;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
}
.add {
    .PictureAddFile {
        display: none;
    }
    .addBut{
        font-size: 12px;
        height: 32px;
        line-height: 32px;
        padding: 0 10px;
        border: 1px solid #DFE2E4;
        display: inline-block;
        border-radius: 3px;
        &:hover {
            border-color: #D0021B;
            color: #D0021B;
            cursor: pointer;
        }
    }
}
</style>
