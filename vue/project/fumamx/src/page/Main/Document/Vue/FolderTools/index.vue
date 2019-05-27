<template>
    <!-- 文件夹名编辑 -->
    <el-dialog :title="dialog.title[dialog.now]" :visible.sync="folderEditDialog" custom-class="width420" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="dialogBeforeClose">
        <el-form :model="newfolder" :rules="rules" label-width="100px" style="margin:0 25px 50px 0;" ref="newFolderDialogRef" @submit.native.prevent>
            <el-form-item :label="dialog.label[dialog.now]" prop="folderName">
                <el-input v-model="newfolder.folderName" @keyup.enter.native="submitClick"></el-input>
            </el-form-item>
        </el-form>
        <div class="text-center">
            <!-- 取消 -->
            <el-button @click="resetForm">{{$t('mxpcweb.document.global.1529397347341')}}</el-button>
            <!-- 确定 -->
            <el-button type="primary" @click="submitClick">{{$t('mxpcweb.document.global.1529397179241')}}</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { trim } from '@/libs/utils.js'
export default {
    name: 'FolderTools',
    data() {
        var checkFolderName = (rule, value, callback) => {
            if (trim(value, '') === '') {
                /* 不能为空 */
                return callback(new Error(this.$t('mxpcweb.document.global.1529398368008')))
            }
            callback()
        }
        return {
            folderEditDialog: false,
            dialog: {
                now: 0,
                /*   title: ["新建文件夹", "新建共享空间", "修改名称"], */
                title: [this.$t('mxpcweb.document.global.1529397554878'), this.$t('mxpcweb.document.global.1529398495935'), this.$t('mxpcweb.document.global.1529398523519')],
                // label: ["文件夹名称", "空间名称", "新的名称"]

                label: [this.$t('mxpcweb.document.global.1529398557171'), this.$t('mxpcweb.document.global.1529398598840'), this.$t('mxpcweb.document.global.1529398613336')]
            },
            callback: '',
            newfolder: {
                folderName: ''
            },

            rules: {
                folderName: [
                    {
                        validator: checkFolderName,
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    methods: {
        put(obj, fn) {
            this.callback = fn
            this.dialog.now = 2
            this.newfolder = Object.assign(obj, {
                folderName: ''
            })
            this.folderEditDialog = true
        },
        new(obj, fn) {
            this.callback = fn

            this.newfolder = Object.assign(obj, {
                folderName: ''
            })
            this.dialog.now = this.newfolder.folderType - 1
            this.folderEditDialog = true
        },

        resetForm() {
            this.$refs['newFolderDialogRef'].resetFields()
            this.folderEditDialog = false
        },
        dialogBeforeClose(done) {
            this.resetForm()
            done()
        },
        submitClick() {
            this.$refs['newFolderDialogRef'].validate(valid => {
                if (valid) {
                    let url = this.Global.baseURL + this.Global.api.v2.folders_foldersTree
                    this.newfolder.folderName = trim(this.newfolder.folderName, '')
                    let data = this.newfolder
                    console.log(data)

                    let _Phttp
                    if (this.dialog.now === 2) {
                        _Phttp = this.$http.put(url, data)
                    } else {
                        _Phttp = this.$http.post(url, data)
                    }

                    _Phttp
                        .then(res => {
                            if (res.body.code.toString() == this.Global.RES_OK) {
                                this.callback && this.callback({
                                    folderName: this.newfolder.folderName,
                                    folderId: this.newfolder.targetFolderId
                                })
                                this.$message.success(this.msg(res.body))
                            } else {
                                this.$message.error(this.msg(res.body))
                            }
                        })
                        .catch(err => {
                            this.$message.error(this.$t(this.Global.errorTitle))
                        })
                    this.folderEditDialog = false
                } else {
                    return false
                }
            })
        }
    }
}
</script>
