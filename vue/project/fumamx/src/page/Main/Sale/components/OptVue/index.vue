<template>
    <div class="OptVue">
        <add-documentary @getData="getData" @submit="submit" ref="addDocumentary"></add-documentary>
        <assign @getData="getData" ref="assign" :optCode="optCode"></assign>
        <status-task @getData="getData" ref="statusTask"></status-task>
        <results-completed @getData="getData" ref="resultsCompleted"></results-completed>
        <add-receipts @getData="getData" ref="addReceipts"></add-receipts>
        <add-msg @getData="getData" ref="addMsg"></add-msg>
        <add-msgOff @getData="getData" ref="addMsgOff"></add-msgOff>
    </div>
</template>

<script>
import Assign from '../Assign'
import AddMsg from '../AddMsg'
import AddMsgOff from '../AddMsgOff'
import AddDocumentary from '../AddDocumentary'
import StatusTask from '../StatusTask'
import ResultsCompleted from '../ResultsCompleted'
import AddReceipts from '../AddReceipts'
export default {
    name: 'OptVue',
    props: {
        optCode: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
        }
    },
    created() {
    },
    mounted() {
    },
    computed: {
    },
    methods: {
        getData() {
            this.$emit('getData')
        },
        submit(list) {
            this.$emit('submit', list)
        },
        addDocumentary(obj) {
            this.$refs.addDocumentary.showDialog(obj)
        },
        optClick(item, type) {
            if (type == 'assign') {
                this.assign(item)
            }
            if (type == 'statusTask') {
                this.openOpt(item)
            }
            if (type == 'resultsCompleted') {
                this.resultsCompleted(item)
            }
            if (type == 'notice') {
                if (item.nodeStatus == '1') {
                    this.$refs.addMsg.showDialog(item)
                } else if (item.nodeStatus == '2') {
                    this.$refs.addMsgOff.showDialog(item)
                }
            }
        },
        openOpt(item) {
            if (item.nodeStatus == '1') {
                this.$refs.addReceipts.showDialog(item)
            } else if (item.nodeStatus == '2') {
                this.$refs.statusTask.showDialog(item)
            } else {
                // 该环节任务类型未指定！
                this.$message(this.$t('mxpcweb.sale.components.1557564916721'))
            }
        },
        resultsCompleted(item) {
            this.$refs.resultsCompleted.showDialog(item)
        },
        assign(item) {
            this.$refs.assign.showDialog(item)
        }
    },
    components: {
        'add-documentary': AddDocumentary,
        'assign': Assign,
        'status-task': StatusTask,
        'results-completed': ResultsCompleted,
        'add-receipts': AddReceipts,
        'add-msgOff': AddMsgOff,
        'add-msg': AddMsg
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
</style>
