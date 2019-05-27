<template>
    <div class="dialogWrap">
        <page-detail :detailTitle="subtitle" @toList="back" class="pageTitle"></page-detail>
        <div class="tableBox">
            <div class="tableChioceBox">
                <div class="selectBox">
                    <el-select v-model="value" placeholder="快速查询项">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-model="value1" placeholder="请选择">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </div>
                <div class="btnBox">
                    <el-button type="primary">打印</el-button>
                    <el-dropdown>
                        <el-button type="primary">
                            导出<i class="el-icon-caret-bottom el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>EXCEL</el-dropdown-item>
                            <el-dropdown-item>PDF</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-button type="primary" @click="insertOption('email')">发送邮件</el-button>
                    <el-button type="primary">订阅</el-button>
                </div>
            </div>
            <div class="tableMain MXscroll">
                <chart-box></chart-box>
                <table-data></table-data>
            </div>
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="[100, 200, 300, 400]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="400">
                </el-pagination>
            </div>
            <!-- 弹出框-嵌入选项-->
            <dialog-inset ref="dialogWrap"></dialog-inset>
        </div>
    </div>
</template>

<script>
import PageDetail from '@/components/PageDetail/index' // 大标题
import ChartBox from './ChartBox/index'
import TableData from './TableData/index'
import DialogInset from './DialogInset/index'
export default {
    name: 'DialogInset',
    data() {
        return {
            subtitle: '新建报表',
            options: [{
                value: '选项1',
                label: '黄金糕'
            }, {
                value: '选项2',
                label: '双皮奶'
            }],
            value: '',
            value1: '',
            currentPage4: 4
        }
    },
    // props: {
    //     itemData: {
    //         type: Object,
    //         default: function () {
    //             return {

    //             }
    //         }
    //     }
    // },
    created() {
        // this.getDetailPage()
    },
    mounted() { },
    methods: {
        back() {
            // this.$router.back(-1)
        },
        handleSizeChange(val) {
            // console.log(`每页 ${val} 条`)
        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`)
        },
        insertOption(x) { // 打开弹框并赋值行数据给子组件
            this.$refs.dialogWrap.open(x)
            // console.log(x)
        }
    },
    components: {
        'page-detail': PageDetail,
        'chart-box': ChartBox,
        'table-data': TableData,
        'dialog-inset': DialogInset
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
