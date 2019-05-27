<template>
    <div class='BuyOrder' ref='BuyOrder'>
        <el-table :data='tableData' style='width: 100%'>
            <el-table-column prop='orderno' label='订单编号' width='180'></el-table-column>
            <el-table-column prop='productname' label='产品名称' width='180'></el-table-column>
            <el-table-column prop='desc' label='订单描述' width="150">
                <template slot-scope="{ row }">
                    <div v-for="(item,index) in row.desc" :key="index">{{item}}</div>
                </template>
            </el-table-column>
            <el-table-column prop='payamount' label='实付金额'>
                <template slot-scope="{ row }">
                    <div>{{returnFloat(row.payamount)}}</div>
                </template>
            </el-table-column>
            <el-table-column prop='createdate' label='下单时间'></el-table-column>
            <!-- <el-table-column prop='createdate' label='操作'>
        <template slot-scope="{ row }">
          <el-button size="mini" @click="delItem(row)">取消订单</el-button>
        </template>
      </el-table-column> -->
        </el-table>
    </div>
</template>

<script>
export default {
    name: 'BuyOrder',
    props: {},
    data() {
        return {
            tableData: []
        }
    },
    created() {
        // this.getDataList()
    },
    mounted() {
        this.$nextTick(() => {
            this.getWinHeight()
            $(window).resize(() => {
                this.getWinHeight()
            })
        })
    },
    methods: {
        returnFloat(x) {
            var value = Math.round(parseFloat(x) * 100) / 100
            var xsd = value.toString().split('.')
            if (xsd.length == 1) {
                value = value.toString() + '.00'
                return value
            }
            if (xsd.length > 1) {
                if (xsd[1].length < 2) {
                    value = value.toString() + '0'
                }
                return value
            }
        },
        // 设置固定高
        getWinHeight() {
            let winHeight = document.body.clientHeight
            this.$refs.BuyOrder.style.height = winHeight - 130 + 'px'
            this.tableHeight = winHeight - 250
        },
        delItem(item) {
            // console.log(item)
            this.$confirm('确定取消这个订单?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.sureDel(item)
            }).catch(() => { })
        },
        sureDel(item) {
            this.$http
                .put(this.Global.baseURL + this.Global.api.v2.payCenter_onlineOrder, {
                    orderno: item.orderno
                })
                .then(
                    res => {
                        if (res.body.code.toString() == this.Global.RES_OK) {
                            this.$message.success('取消成功')
                            this.getDataList()
                        }
                    },
                    res => {
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                )
        },
        getDataList() {
            this.$http
                .get(this.Global.baseURL + this.Global.api.v2.companyOrder, {
                    params: { type: 'list' }
                })
                .then(
                    res => {
                        if (res.body.code.toString() == this.Global.RES_OK) {
                            this.tableData = res.body.data.list
                            this.tableData.map(item => {
                                item.desc = item.desc.split(',')
                            })
                        }
                    },
                    res => {
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                )
        }
    },
    components: {},
    watch: {}
}
</script>

<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
