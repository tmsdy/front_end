<template>
    <!-- 客户负责人转移 -->
    <span>
        <detailOpt ref="detailOpt" :personnelTable="personnelTable" @getListData="getListData"></detailOpt>
        <listOpt ref="listOpt" :personnelTable="personnelTable" @getListData="getListData"></listOpt>
    </span>
</template>
<script>
/**
 * 描述：客户管理-客户列表-设置列表字段
 * 作者：何俊峰
 * 时间：2017/11/10
 */
import detailOpt from './detailOpt.vue'
import listOpt from './listOpt.vue'
export default {
    name: 'addShare',
    props: {
    },
    data() {
        return {
            personnelTable: [],
            callback: function() {}
        }
    },
    created() {
    },
    mounted() {
    },
    computed: {
    },
    methods: {
        // 打开窗口
        openWindow(obj) {
            if (obj.next) {
                this.callback = obj.next
            } else {
                this.callback = function() {}
            }
            if (obj.optData) {
                this.getTable(obj.optData.optModuleCode)
            }
            if (obj.type == '1') {
                this.$refs.listOpt.openWindow(obj)
            } else {
                this.$refs.detailOpt.openWindow(obj)
            }
        },
        listBatchMsg(list) {
            this.$emit('listBatchMsg', list)
        },
        // 获取企业下
        getTable(moduleCode) {
            let _this = this
            let contactData = {
                dataType: 'contact',
                funType: 'withRight',
                moduleCode: moduleCode,
                optCode: 'otDistribution'
            }
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.accountDropList_get, { params: contactData }).then((res) => {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.personnelTable = res.body.data
                } else {
                    _this.$message.error(_this.$msg(res.body))
                }
            }, (res) => {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        getListData() {
            this.callback()
        }
    },
    components: {
        'listOpt': listOpt,
        'detailOpt': detailOpt
    }
}
</script>
