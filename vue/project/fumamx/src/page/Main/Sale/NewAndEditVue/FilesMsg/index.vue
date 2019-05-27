<template>
    <div class="FilesMsg">
        <template v-if="filesEditSet.attachmentFile">
            <p class="contactTitle">
                <!-- 附件 -->
                {{$t('mxpcweb.sale.components.1557565108595')}}
                <el-button v-if="filesEditSet.attachmentFile.disabled" class="miniButton" size="mini" disabled>
                    <!-- 添加附件 -->
                    <label>{{$t('mxpcweb.sale.components.1557565148517')}}</label>
                </el-button>
                <el-button v-else class="miniButton" size="mini">
                    <!-- 添加附件 -->
                    <label :for="domId" class="add text-hover">{{$t('mxpcweb.sale.components.1557565148517')}}</label>
                </el-button>
            </p>
            <div class="filesBox">
                <!-- 上传附件 -->
                <file-upload ref="fileUpload" :file-list.sync="filesList" :limitSize="10">
                <!-- 选择文件 -->
                    <el-button :id="domId" slot="trigger" size="small" type="primary" v-show="false">{{$t('mxpcweb.client.1529048918632')}}</el-button>
                </file-upload>
            </div>
        </template>
    </div>
</template>
<script>
import FileUpload from '@/components/orderFileUpload/index' // 文件上传
export default {
    name: 'FilesMsg',
    props: {
        filesEditSet: {
            type: Object,
            default: () => {
                return {}
            }
        },
        domId: {
            type: String,
            default: 'file1'
        },
        itemData: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data() {
        return {
            filesList: []
        }
    },
    created() {
    },
    computed: {
    },
    methods: {
        updata() {
            let list = this.itemData.attachmentFile || []
            this.filesList = []
            list.forEach(item => {
                let obj = JSON.stringify(item)
                this.filesList.push(JSON.parse(obj))
            })
            this.$nextTick(() => {
                this.$refs.fileUpload.updata()
            })
        },
        submit() {
            if (this.filesEditSet.attachmentFile) {
                if (this.filesEditSet.attachmentFile.disabled) {
                    return {}
                } else if (this.filesEditSet.attachmentFile.isNotNull == 1) {
                    if (this.filesList.length == 0) {
                        this.$emit('scrollTop', $('.FilesMsg')[0].offsetTop)
                        // 请上传附件！
                        this.$message(this.$t('mxpcweb.sale.components.1557565148700'))
                        return false
                    }
                }
                let data = {}
                if (this.itemData && this.itemData.attachmentFile && this.filesList.length == this.itemData.attachmentFile.length) {
                    let isSame = true
                    this.filesList.forEach((item, index) => {
                        if (JSON.stringify(this.itemData.attachmentFile[index]) != JSON.stringify(item)) {
                            isSame = false
                        }
                    })
                    if (isSame) {
                        return {}
                    }
                }
                data.attachmentFile = this.filesList
                return data
            } else {
                return {}
            }
        },
        clearData() {
            this.filesList = []
            this.$refs.fileUpload.updata()
        }
    },
    components: {
        'file-upload': FileUpload
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
