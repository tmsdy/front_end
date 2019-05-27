<template>
    <div>
        <el-dropdown @command="CommandAttach">
            <span class="el-dropdown-link text-hover" style="color:#909399">
                <!-- <i class="iconfont icon-attachment"></i> -->
                <!-- 添加附件 -->
                {{$t('mxpcweb.mail.1528788528013')}}
                <i class="iconfont icon-page-down"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <!-- 添加本地附件 -->
                <el-dropdown-item :command="{actionName:'AddLocal'}">{{$t('mxpcweb.mail.1544860049516')}}
                </el-dropdown-item>
                <!-- 添加在线文档 -->
                <el-dropdown-item :command="{actionName:'AddOnline'}">{{$t('mxpcweb.mail.1544860057294')}}
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>

        <dialog-doc ref="DialogDoc" @checkedDoc="checkedOnlineDoc"></dialog-doc>
    </div>
</template>
<script>
// import { isArray } from '@/libs/utils.js'
import DialogDoc from '@/page/Main/Mail/Vue/DialogDoc/index' // 在线文档选择
export default {
    name: 'pickAttachment',
    props: {
    },
    data() {
        return {
        }
    },
    created() {
    },
    mounted() {
    },
    methods: {
        /* 选择在线文档 */
        async checkedOnlineDoc(fileArr) {
            // console.log(fileArr)
            // console.log(fileArr)
            // let url = this.Global.baseURL + this.Global.api.v2.folders_moveFiles
            // let data = { files: fileArr }

            // let res = await this.$http.post(url, data)
            // if (res.body.code.toString() == this.Global.RES_OK) {
            //     let fileArry = res.body.data
            //     if (isArray(fileArry)) {
            //         // let BaseUrl = this.Global.downloadBaseUrl
            //         for (let index = 0; index < fileArry.length; index++) {
            //             const fileobj = {}
            //             const element = fileArry[index]
            //             fileobj.url = element.attachmnentId
            //             fileobj.status = 1
            //             fileobj.name = element.fileName
            //             fileobj.size = (element.fileSize / 1024).toFixed(2)
            //             this.fileList.push(fileobj)
            //         }
            //     }
            // } else {
            //     this.$message.error(this.msg(res.body))
            // }
        },
        // 添加附件
        CommandAttach(command) {
            if (command.actionName == 'AddLocal') { // 添加本地附件
                this.$emit('change', command)
            } else { // 添加在线文档
                this.$refs.DialogDoc.open()
            }
        }
    },
    components: {
        'dialog-doc': DialogDoc
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>

</style>
