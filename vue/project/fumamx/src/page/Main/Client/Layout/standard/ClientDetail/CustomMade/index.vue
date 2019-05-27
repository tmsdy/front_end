<template>
    <div class="CustomMade">
        <table>
            <!-- 权限，已删除/公海客户判断一下 -->
            <tr v-if="itemData.delState == '1' || itemData.seasFlag == '1'">
                <td class="text-no">
                    <span>
                        <i class="iconfont icon-star" :class="[isFocusBill(itemData.focusTargets) ? 'text-red' : '']"></i>
                    </span>
                    <!-- '取消关注' : '关注' -->
                    <div>{{isFocusBill(itemData.focusTargets) == 1 ? $t('mxpcweb.client.detail.1530003911735') : $t('mxpcweb.client.detail.1530003937269')}}</div>
                </td>
                <td class="text-no">
                    <span class="text-red" v-if="itemData.custScore !== undefined">{{itemData.custScore}}</span>
                    <span v-else>
                        <!-- 暂无打分 -->
                        <em>{{$t('mxpcweb.client.detail.1530003968517')}}</em>
                    </span>
                    <!--质量打分  -->
                    <div>{{$t('mxpcweb.client.detail.1530004007565')}}</div>
                </td>
                <el-tooltip class="item" effect="dark" placement="bottom-end">
                    <div slot="content" style="width:130px;">
                        <div v-for="(item,index) in scoreDetail" :key="index" style="margin:3px 0;">
                            <!-- 无 -->
                            {{index+1 + '. ' + item.dictName}}： {{item.score == 0 ? $t('mxpcweb.client.detail.1530004038848') : item.score}}
                        </div>
                    </div>
                    <td>
                        <!-- 暂无 -->
                        <span class="text-red">{{itemData.integrityScore !== undefined ? itemData.integrityScore+'%' : $t('mxpcweb.client.detail.1530004065342')}}</span>
                        <div>
                            <!-- 资料完整度 -->{{$t('mxpcweb.client.detail.1530004104910')}}</div>
                    </td>
                </el-tooltip>
            </tr>

            <tr v-else>
                <td @click="focusClick(isFocusBill(itemData.focusTargets))">
                    <span>
                        <i class="iconfont icon-star" :class="[isFocusBill(itemData.focusTargets) ? 'text-red' : '']"></i>
                    </span>
                    <!-- '取消关注' : '关注' -->
                    <div>{{isFocusBill(itemData.focusTargets) ? $t('mxpcweb.client.detail.1530003911735') : $t('mxpcweb.client.detail.1530003937269')}}</div>
                </td>
                <!-- 点击打分 -->
                <td @click="scoreClick(itemData.custScore)" :title="$t('mxpcweb.client.detail.1530004178605')">
                    <span class="text-red" v-if="itemData.custScore !== undefined">{{itemData.custScore}}</span>
                    <span v-else>
                        <!-- 暂无打分 -->
                        <em>{{$t('mxpcweb.client.detail.1530003968517')}}</em>
                    </span>
                    <!-- 质量打分 -->
                    <div>{{$t('mxpcweb.client.detail.1530004007565')}}</div>
                </td>
                <el-tooltip effect="dark" placement="bottom-end">
                    <div slot="content" class="tooltip">
                        <div v-for="(item,index) in scoreDetail" :key="index" style="margin:3px 0;">
                            <!-- 无 -->
                            {{index+1 + '. ' + item.dictName}}： {{item.score == 0 ? $t('mxpcweb.client.detail.1530004038848'): item.score}}
                        </div>
                    </div>
                    <td>
                        <!-- 暂无 -->
                        <span class="text-red">{{itemData.integrityScore !== undefined ? itemData.integrityScore+'%' :$t('mxpcweb.client.detail.1530004065342')}}</span>
                        <!-- 资料完整度 -->
                        <div>{{$t('mxpcweb.client.detail.1530004104910')}}</div>
                    </td>
                </el-tooltip>
            </tr>
        </table>

        <!--  质量打分  -->
        <el-dialog :title="$t('mxpcweb.client.detail.1530004007565')" :visible.sync="isShowScore" custom-class="width420" v-dialogDrag>
            <div class="scoreSlider">
                <el-slider v-model="scoreData" :format-tooltip="formatTooltip" :step="10" show-stops></el-slider>
                <div class="text-center text-red">{{scoreData}}</div>
            </div>
            <div class="text-center">
                <!-- 取消 -->
                <el-button @click="isShowScore = false">{{$t('mxpcweb.client.detail.1529994393355')}}</el-button>
                <el-button type="primary" @click="submitScore()">{{$t('mxpcweb.client.detail.1529994368552')}}</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
/**
 * 描述：客户特有功能，质量打分
 * 作者：向士健
 * 时间：2018/02/10
 */
export default {
    name: 'CustomMade',
    props: {
        itemData: {
            type: Object,
            default: function () {
                return {}
            }
        },
        moduleCode: {
            type: String,
            default: ''
        },
        pageId: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            isShowScore: false,
            scoreData: 0,
            scoreDetail: []
        }
    },
    mounted() {
        // console.log(this.itemData)
        // console.log(this.isFocusBill(this.itemData.focusTargets))
    },
    methods: {
        // 完整度分数明细
        getData() {
            let _this = this
            if (_this.pageId == '') { return }
            this.$http.get(this.Global.baseURL + this.Global.api.v2.customerIntegrity_do, { params: { custId: _this.pageId } }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    // console.log(res.body.data)
                    _this.scoreDetail = res.body.data
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        // 提交打分
        submitScore() {
            let data = {
                'optCode': 'score',
                'score': this.scoreData
            }
            this.submit(data)
        },
        // 统一在此修改
        submit(req) {
            let _this = this
            let data = Object.assign({
                'optModuleCode': _this.moduleCode,
                'identFieldValue': _this.pageId
            }, req)
            this.$http.put(this.Global.baseURL + this.Global.api.v2.document_operate_detailOpt_put, data).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.$message.success(_this.msg(res.body))
                    _this.isShowScore = false
                    if (req.optCode == 'score') {
                        _this.itemData.custScore = _this.scoreData
                    }
                    // if (req.optCode == 'focus') {
                    //     _this.itemData.focusFlag = 1;
                    // }
                    // if (req.optCode == 'unFocus') {
                    //     _this.itemData.focusFlag = undefined;
                    // }
                    _this.$emit('tellFather')
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        // 滑动条
        formatTooltip(val) {
            /* 0分 */
            return this.$t('mxpcweb.client.detail.1530004484156', [val])
        },
        // 点击关注否
        focusClick(flag) {
            let data = {}
            data['optCode'] = flag ? 'unFocus' : 'focus'
            this.submit(data)
        },
        // 打分弹窗
        scoreClick(num) {
            this.isShowScore = true
            this.scoreData = num
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
