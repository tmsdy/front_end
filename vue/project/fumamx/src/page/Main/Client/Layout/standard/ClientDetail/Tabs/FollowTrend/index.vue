<template>
    <div class="FollowTrend">

        <!-- 栅栏数据统计表格 -->
        <table>
            <tr>
                <td v-for="(item,index) in dataTotalTable" :key="index">
                    <div>
                        <span>{{item.count}}</span><br>
                        <span>{{item.itemName}}</span>
                    </div>
                </td>
            </tr>
        </table>
        <loading v-if="isLoading" class="loadingWrap"></loading>

        <!-- 筛选 -->
        <el-form :model="formData" :inline="true" class="screenSelect marginTop15">
            <!-- 跟进方式 -->
            <el-form-item :label="$t('mxpcweb.client.detail.1529994742611')">
                <!--跟进方式筛选  -->
                <el-select clearable v-model="formData.followUpMode.value" @change="getTabData" :placeholder="$t('mxpcweb.client.detail.1529994784857')" size="small">
                    <el-option v-for="item in formData.followUpMode.list" :key="item.dictItemCode" :label="item.itemName" :value="item.dictItemCode"> </el-option>
                </el-select>
            </el-form-item>
            <!-- 跟进时间筛选 -->
            <el-form-item :label="$t('mxpcweb.client.detail.1529994829977')" class="pull-right">
                <!-- 请选择时间范围 -->
                <el-date-picker v-model="formData.time" @change="getTabData" format="yyyy-MM-dd HH:mm" size="small" :picker-options="pickerOptions" type="datetimerange" :placeholder="$t('mxpcweb.client.detail.1529994855648')" style="width:268px"></el-date-picker>
            </el-form-item>
        </el-form>

        <!-- 跟进明细，时间轴 -->
        <follow-up-list ref="followUpList" :itemData="itemData" :pageId="pageId" :followUpModeList="formData.followUpMode.list"></follow-up-list>
        <!-- 新增跟进 -->
        <fly-button @flyBtnClick="$emit('flyBtnClick', itemData.bindModuleCode, 'otNew')" :fly="false" :title="$t('mxpcweb.client.detail.1529994896682')" :mainObj="mainObj"></fly-button>
    </div>
</template>
<script>
import { isArray } from '@/libs/utils.js'
import Loading from '@/basecomponents/Loading/index'
import { mapGetters } from 'vuex'
import FlyButton from '../../FlyButton/index.vue'
import FollowUpList from './list/index.vue'

export default {
    name: 'FollowTrend',
    props: {
        itemData: {
            type: Object,
            default: function () {
                return {}
            }
        },
        pageId: {
            type: String,
            default: ''
        },
        mainObj: {
            type: Object,
            default: function () {
                return {}
            }
        }
    },
    data() {
        return {
            isLoading: true,
            formData: {
                followUpMode: {
                    value: '',
                    list: [] // 操作人员下拉
                },
                time: [] // 操作时间
            },

            dataTotalTable: [], // 跟进统计数据
            pickerOptions: {
                shortcuts: [{
                    /* 最近一周 */
                    text: this.$t('mxpcweb.client.detail.1529994970771'),
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    // 最近一个月
                    text: this.$t('mxpcweb.client.detail.1529994995745'),
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    /* 最近三个月 */
                    text: this.$t('mxpcweb.client.detail.1529995029033'),
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                        picker.$emit('pick', [start, end])
                    }
                }]
            }
        }
    },
    created() {
        // 过滤找出跟进方式下拉
        this.sysBoxValue.forEach((item) => {
            if (item.dictCode == 12) {
                this.formData.followUpMode.list = item.dictItems
            }
        })
    },
    mounted() {
        // this.getTabData()
    },
    computed: {
        ...mapGetters(['sysBoxValue'])
    },
    methods: {
        // 获取跟进统计表格数据
        getTableData() {
            let data = {
                moduleCode: this.itemData.bindModuleCode,
                custId: this.pageId
            }
            this.$http.get(this.Global.baseURL + this.Global.api.v2.stat_pers_trackDetail_get, { params: data }).then(function (res) {
                this.isLoading = false
                if (res.body.code.toString() == this.Global.RES_OK && isArray(res.body.data)) {
                    // console.log(res.body.data)
                    this.dataTotalTable = res.body.data
                } else {
                    this.$message.error(this.msg(res.body))
                }
            }, function (res) {
                this.$message.error(this.$t(this.Global.errorTitle))
            })
        },
        // 往组件传入要过滤的字段
        getTabData() {
            let req = {
                trackMode: this.formData.followUpMode.value,
                startDate: this.$m_unifiedTime(this.formData.time[0]),
                endDate: this.$m_unifiedTime(this.formData.time[1])
            }
            if (this.$refs.followUpList) {
                this.$refs.followUpList.getListData(req)// 往组件里传值查询
            }
            if (this.isLoading) {
                this.getTableData() // 获取跟进统计表格数据
            } else {
                setTimeout(() => {
                    // 新增时，缓一秒，不然数据返回统计数据不是最新的
                    this.getTableData() // 获取跟进统计表格数据
                }, 1000)
            }
        }
    },
    components: {
        loading: Loading,
        'fly-button': FlyButton,
        'follow-up-list': FollowUpList
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
