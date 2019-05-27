<template>
    <div class="popup" >
        <component v-for="(item, index, i) in allOpt" :ref="index" v-bind:is="index" :key="i"></component>
        <!-- <div v-for="(item, index) in allOpt" :key="index">{{index}}</div> -->
    </div>
</template>
<script>
/**
 * 描述：客户管理-客户列表-设置列表字段
 * 作者：何俊峰
 * 时间：2017/11/10
 */
import otControls from '@/components/optVueNew/index.js'
export default {
    name: 'popup',
    props: {
    },
    data() {
        return {
            allOpt: {
            }
        }
    },
    created() {
    },
    mounted() {
        ep.tail('optClick', (data) => {
            this.optClick(data)
        })
        ep.tail('batchMsg', (datas) => {
            if (this.allOpt.batchMsg) {
                this.$refs.batchMsg[0].openWindow(datas)
            } else {
                let data = {}
                data.batchMsg = '1'
                this.allOpt = Object.assign({}, this.allOpt, data)
                this.$nextTick(() => {
                    this.$refs.batchMsg[0].openWindow(datas)
                })
            }
        })
        // 缓存页面路由
        ep.tail('clickAddpeople', (obj) => {
            ep.emit('setGlobalLoading', {
                val: true,
                // 权限校验中...
                text: this.$t('mxpcweb.client.list.1550126019122') + '...'
            })
            this.$http.get(this.Global.baseURL + this.Global.api.v2.document_rightCheck_do, { params: {
                moduleCode: obj.optData.optModuleCode,
                identFieldValue: 0,
                optCode: obj.optData.optCode
            } }).then((res) => {
                ep.emit('setGlobalLoading', {
                    val: false,
                    text: ''
                })
                if (res.body.code.toString() == this.Global.RES_OK) {
                    this.optClick(obj)
                } else {
                    this.$message.error(this.msg(res.body))
                }
            }, (res) => {
                ep.emit('setGlobalLoading', {
                    val: false,
                    text: ''
                })
                this.$message.error(this.$t(this.Global.errorTitle))
            })
        })
    },
    computed: {
    },
    methods: {
        optClick(obj) { // 单项操作事件
            let optCode = obj.optData.optCode
            if (this.allOpt[optCode]) {
                this.$refs[optCode][0].openWindow(obj)
            } else {
                let data = {}
                data[optCode] = '1'
                this.allOpt = Object.assign({}, this.allOpt, data)
                this.$nextTick(() => {
                    setTimeout(() => {
                        this.$refs[optCode][0].openWindow(obj)
                    }, 10)
                })
            }
        }
    },
    watch: {

    },
    components: Object.assign({}, otControls)
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
// .popup{
//     min-height: 40px;
//     width: 100px;
//     position:fixed;
//     top: 20px;
//     right: 20px;
//     border: 1px solid red;
// }
</style>
