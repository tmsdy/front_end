<template>
    <!-- 处理工单 -->
    <el-dialog :title="$t('mxpcweb.client.1529134790350')" :visible.sync="dialog1" custom-class="width520" :closeOnClickModal="false" class="addRemindDialog" :modal-append-to-body="false">

        <div class="workResult" v-if="dialog1">
            <!-- 请填写工单处理结果，保存后工单将自动关闭。 -->
            {{$t('mxpcweb.client.1529134836733')}}<br><br>
            <el-input type="textarea" :rows="4" v-model="content"  size="small"></el-input><br><br>
            <!-- 上传附件 -->
            <label for="WO001AddAndClose" class="text-hover" style="color:#6CA2FF"><i class="iconfont icon-attachment"></i>{{$t('mxpcweb.client.1529056859354')}}</label>
            <file-upload ref="fileUpload" :file-list.sync="files" :limitSize="10">
              <!-- 选择文件 -->
                <el-button id="WO001AddAndClose" slot="trigger" size="small" type="primary"   v-show="false">{{$t('mxpcweb.client.1529048918632')}}</el-button>
            </file-upload>
        </div>
        <div slot="footer" class="dialogFooter">
            <!-- 保存 -->
            <el-button type="primary" @click="submitData('1')" :loading="loading">{{$t('mxpcweb.client.1529042806774')}}</el-button>
            <!-- 跳过 -->
            <el-button @click="submitData('2')"  :loading="loading">{{$t('mxpcweb.client.1529134891683')}}</el-button>
        </div>
    </el-dialog>
</template>

<script>
import FileUpload from '@/components/orderFileUpload/index' // 文件上传
export default {
    name: 'QueryRepeats',
    props: {
    },
    data() {
        return {
            dialog1: false,
            content: '',
            loading: false,
            files: [],
            id: ''
        }
    },
    created() {
    },
    methods: {
        submitData (type) {
            console.log(type)
            if (type == '1') {
                let data = {
                    optModuleCode: 'WO001',
                    identFieldValue: this.id,
                    optCode: 'otCloseWork',
                    remark: this.content
                }
                let url = this.Global.api.v2.document_operate_detailOpt_put
                this.loading = true
                this.$http.put(this.Global.baseURL + url, data).then((res) => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.$emit('tellFather')
                        this.loading = false
                        this.dialog1 = false
                        this.$message.success(this.msg(res.body))
                    } else {
                        this.loading = false
                        this.$message.error(this.msg(res.body))
                    }
                }, (res) => {
                    this.loading = false
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
            } else {
                this.dialog1 = false
            }
        },
        openWindow (id) {
            this.id = id
            this.submitData('1')
            // this.content = ''
            // this.files = []
            // this.dialog1 = true
        }
    },
    components: {
        'file-upload': FileUpload
    }
}
</script>
