<template>
    <div class="tabIndex">
        <!-- 文章管理 -->
        <page-title title="运营参谋" iconfont="icon-operation-admin"></page-title>
        <div class="mainBody">
            <div class="toolbar">
                <span>
                    <i class="iconfont icon-dot" style="margin-right:4px;color:#8BD867"></i>
                    当前在线人数：
                    <span style="font-size:20px;font-weight:500">{{online}}</span>
                </span>
                <div class="pull-right">
                    <el-button type="primary" class="button" @click="$emit('tabChange', '2')">查看汇总</el-button>
                </div>
            </div>
            <div class="contentBox MXscroll">
                <all-count></all-count>
                <online-chart></online-chart>
                <product-use></product-use>
                <bill-count></bill-count>
            </div>
        </div>
    </div>
</template>

<script>
/**
 * 运维管理
 * 何俊峰
 * 2018-11-18
 */
import PageTitle from '@/components/PageTitle/index' // 大标题
import allCount from '../../Vue/allCount/index' // top展示数据
import onlineChart from '../../Vue/onlineChart/index' // 在线趋势
import productUse from '../../Vue/productUse/index' // 产品分布图
import billCount from '../../Vue/billCount/index' // bottom展示数据
export default {
    name: 'OperationMaintenance',
    data() {
        return {
            moduleCode: '',
            online: '0'
        }
    },
    created() {
        this.getData()
    },
    methods: {
        getData() {
            let _this = this
            _this.$http.get(this.Global.baseURL + this.Global.api.mx.online, {
              params: {}
            }).then(function(res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.online = res.body.data.online
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, function(res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        }
    },
    components: {
        'page-title': PageTitle,
        'all-count': allCount,
        'online-chart': onlineChart,
        'product-use': productUse,
        'bill-count': billCount
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
