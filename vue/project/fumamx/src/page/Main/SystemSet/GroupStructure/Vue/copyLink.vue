<template>
    <div class="copyLink">
        <el-dialog v-dialogDrag :title="$t('mxpcweb.systemset.groupstructure.1529406600242')" :visible.sync="dialogVisible" size="tiny" :before-close="handleClose" :modal-append-to-body="false">
            <br>
            <el-row :gutter="20">
                <el-col :span="20"><input type="text" :value="url" ref="contents" class="contents" id="foo" readonly></el-col>
                <el-col :span="4">
                    <button @click="CopyClick" ref="copyButton" class="copyButton" data-clipboard-action="copy" data-clipboard-target="#foo">{{$t('mxpcweb.systemset.groupstructure.1529402371677')}}</button>
                </el-col>
            </el-row>
            <img :src="src" class="QRCode" ref="QRCode">
        </el-dialog>
    </div>
</template>
<script>
import QRCode from 'qrcode'
import Clipboard from 'clipboard'
export default {
    name: 'copyLink',
    props: {
    },
    data() {
        return {
            dialogVisible: false,
            url: '',
            src: ''
        }
    },
    methods: {
        copyLinkShow(href) {
            let _this = this
            _this.dialogVisible = true
            QRCode.toDataURL(href, function (err, url) {
                _this.src = url
            })

            _this.url = href
        },
        handleClose(done) {
            done()
        },
        CopyClick() {
            let clipboard = new Clipboard(this.$refs.copyButton)
            clipboard.on('success', (e) => {
                this.$message.success(this.$t('mxpcweb.am.1531904029672')) // 复制成功
            })
        }
    },
    components: {

    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.copyLink {
    .contents {
        width: 100%;
        height: 30px;
        border: 1px #ccc solid;
        border-radius: 3px;
    }
    .copyButton {
        width: 100%;
        height: 30px;
        border: 1px #ccc solid;
        cursor: pointer;
        border-radius: 3px;
        background-color: #fff;
    }
    .copyButton:hover {
        background-color: #ccc;
    }
    .QRCode {
        width: 50%;
        margin: 20px auto;
        display: block;
    }
}
</style>
