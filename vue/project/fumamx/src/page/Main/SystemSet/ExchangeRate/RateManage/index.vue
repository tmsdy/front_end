<template>
    <div class='RateManage MXscroll' ref='RateManage' v-loading="isLoading">
        <div class="boxHeader">
            <el-input placeholder="输入货币代号、货币中文名" v-model="search" @keyup.enter.native="searchEnterFun" style="width: 300px;"></el-input>
            <el-button type="primary" @click="searchEnterFun">搜索</el-button>
        </div>
        <el-table :data='tableData' style='width: 100%;height: 100%;' :height="tableHeight-50">
            <el-table-column prop='currencyCode' label='货币代号' min-width='80'></el-table-column>
            <el-table-column prop='name' label='货币中文名' min-width='100'></el-table-column>
            <el-table-column prop='symbol' label='国际符号' min-width="100">
            </el-table-column>
            <el-table-column prop='usdExRate' label='当前人民币汇率' min-width="100">
                <template slot-scope="{ row }">
                    <div>{{row.showFlag == 0 ? row.fixedRate: row.cnyExRate}}</div>
                </template>
            </el-table-column>
            <el-table-column label='汇率类型' min-width="100">
                <template slot-scope="{ row }">
                    <div>{{row.showFlag == 0 ? '固定汇率': '实时汇率'}}</div>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="{ row }">
                    <i class="iconfont icon-setting" @click="handleEdit(row)" style="cursor: pointer;"></i>
                </template>
            </el-table-column>
        </el-table>
        <dialog-change ref="dialogChange" @success="getRateList"></dialog-change>
    </div>
</template>

<script>
import DialogChange from './dialogchange'
export default {
    name: 'RateManage',
    props: {
        tableHeight: {
            type: Number,
            default: 300
        }
    },
    data() {
        return {
            tableData: [],
            isLoading: true,
            search: ''
        }
    },
    created() {
        this.getRateList()
    },
    mounted() {
    },
    methods: {
        searchEnterFun() {
            this.getRateList(this.search)
        },
        handleEdit(row) {
            console.log(row)
            this.$refs.dialogChange.open(row)
        },
        getRateList(x) {
            this.isLoading = true
            let params = {
                curCode: x
            }
            if (x == undefined) {
                params = {}
            }
            this.$http.get(this.Global.baseURL + this.Global.api.v2.rateManage, { params: params })
                .then(
                    res => {
                        this.isLoading = false
                        if (res.body.code.toString() == this.Global.RES_OK) {
                            this.tableData = res.body.data.list
                        }
                    },
                    res => {
                        this.isLoading = false
                        /* 网络异常 */
                        this.$message.error(this.$t('mxpcweb.mai.sys.gro.networkAnomaly'))
                    }
                )
        }
    },
    components: {
        'dialog-change': DialogChange
    },
    watch: {
        $route() {
            if (this.$route.path == '/main/systemset/exchangeRate') {
                this.getRateList()
            }
        }
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
.boxHeader {
    margin-bottom: 20px;
}
</style>
