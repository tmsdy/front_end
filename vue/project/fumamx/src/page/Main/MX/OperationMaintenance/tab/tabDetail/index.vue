<template>
    <div class="tabDetail">
        <page-detail title="运营参谋" iconfont="icon-operation-admin" towTitle="企业汇总" detailTitle="详情" @toList="$emit('tabChange','2')" @toListOne="$emit('tabChange','1')"></page-detail>
        <div class="mainBody MXscroll">
            <div class="detailBox">
                <div class="custNameBox">
                    <span class="custList">
                        <i class="iconfont icon-company-set" style="color: #909399;font-size:16px;"></i>
                        {{item.enterprise ? item.enterprise : ''}}
                    </span>
                    <span class="custList">
                        <i class="iconfont icon-mx-bg" style="color: #D0021B;font-size:40px;position:relative;top:10px;"></i>
                        {{item.pkname ? item.pkname : ''}}
                    </span>
                    <span class="custList">
                        <i class="iconfont icon-time-bold" style="color: #D0021B;"></i>
                        开通月数：{{item.monthcount ? item.monthcount : ''}}
                    </span>
                    <span class="custList">
                        <i class="iconfont icon-online" style="color: #8BD867;font-size:16px;"></i>
                        {{online ? online : '0'}}/{{ item.usercount ? item.usercount : '0'}}
                    </span>
                    <span class="custList">
                        <i class="iconfont icon-balance" style="color: #D0021B;font-size:16px;"></i>
                        余额：￥{{item.overallbalance ? item.overallbalance : ''}}
                    </span>
                    <span class="people">
                        <i class="iconfont icon-service" style="color: #909399;font-size:16px;"></i>
                        {{itemData.service ? itemData.service : ''}}
                    </span>
                </div>
                <div>
                    <bill-count :item="item"></bill-count>
                </div>
                <div style="margin-top:20px;">
                    <all-count :itemData="itemData"></all-count>
                </div>
                <div>
                    <online-chart :itemData="itemData"></online-chart>
                </div>
                <div style="margin-top:20px;">
                    <time-chart :itemData="itemData"></time-chart>
                </div>
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
import PageDetail from '@/components/PageDetail/index' // 大标题
import billCount from './Vue/billCount/index' // 大标题
import allCount from './Vue/allCount/index' // 大标题
import onlineChart from './Vue/onlineChart/index' // 大标题
import timeChart from './Vue/timeChart/index' // 大标题
export default {
    name: 'tabDetail',
    props: {
        itemData: {
            type: Object,
            default: function() {
                return {}
            }
        }
    },
    data() {
        return {
            moduleCode: '',
            item: {},
            online: ''
        }
    },
    created() {
        this.getData()
    },
    methods: {
        getData() {
            let _this = this
            if (_this.itemData.cid) {
                _this.$http.get(this.Global.baseURL + this.Global.api.mx.enterprise_detail, {
                    params: {
                        cid: _this.itemData.cid
                    }
                }).then(function(res) {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        _this.item = res.body.data
                    } else {
                        _this.$message.error(_this.msg(res.body))
                    }
                }, function(res) {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
                _this.$http.get(this.Global.baseURL + this.Global.api.mx.enterprise_online, {
                    params: {
                        cid: _this.itemData.cid
                    }
                }).then(function(res) {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        _this.online = res.body.data.online
                    } else {
                        _this.$message.error(_this.msg(res.body))
                    }
                }, function(res) {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            } else {
                _this.$message('企业ID不存在')
                _this.$emit('tabChange', '2')
            }
        }
    },
    components: {
        'page-detail': PageDetail,
        'bill-count': billCount,
        'all-count': allCount,
        'online-chart': onlineChart,
        'time-chart': timeChart
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
