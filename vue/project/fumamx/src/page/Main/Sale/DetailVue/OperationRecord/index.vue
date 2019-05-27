<template>
    <div class="OperationRecord">
        <el-form :model="formData" :inline="true">
            <!-- 操作人员 -->
            <el-form-item :label="$t('mxpcweb.client.detail.1529998359283')">
                <!-- 请选择 -->
                <el-select clearable v-model="formData.operationUser.value" @change="getTabData" size="small" :placeholder="$t('mxpcweb.client.detail.1529998414995')" style="width:110px;">
                    <el-option v-for="(item,index) in formData.operationUser.list" :key="index" :label="item.realName" :value="item.ctId"></el-option>
                </el-select>
            </el-form-item>
            <!-- 操作时间 -->
            <el-form-item :label="$t('mxpcweb.client.detail.1529998454370')">
                <!-- 请选择时间范围 -->
                <el-date-picker v-model="formData.time" @change="getTabData" format="yyyy-MM-dd HH:mm" size="small" :picker-options="pickerOptions" type="datetimerange" :placeholder="$t('mxpcweb.client.detail.1529994855648')" style="width:270px"></el-date-picker>
            </el-form-item>
            <!--  显示查看记录-->
            <el-checkbox v-model="formData.isShowView" @change="getTabData" style="margin-top: 7px;">{{$t('mxpcweb.client.detail.1529998559834')}}</el-checkbox>
        </el-form>

        <!-- 操作记录时间轴 -->
        <user-action-list ref="userActionList"></user-action-list>
    </div>
</template>

<script>
import { isArray } from '@/libs/utils.js'
import userActionList from '@/page/Main/SystemSet/LogAction/Tabs/userAction/userActionList/index.vue'
export default {
    name: 'OperationRecord',
    props: {
        itemId: {
            type: String,
            default: ''
        },
        moduleCode: {
            type: String,
            default: ''
        },
        activeName: {
            type: String,
            default: ''
        },
        itemActive: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            formData: {
                operationUser: {
                    value: '',
                    list: [] // 操作人员下拉
                },
                time: [], // 操作时间

                isShowView: true // 是否显示查看记录（不显示传false）
            },
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
                    /* 最近一个月 */
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

    },
    mounted() {
        // this.getTabData()
    },
    methods: {
        // 操作人员下拉
        getOperationUser() {
            let _this = this
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.accountDropList_get, {
                params: {
                    dataType: 'contact',
                    funType: 'withRight',
                    moduleCode: _this.moduleCode,
                    optCode: 'otView'
                }
            }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
                    _this.formData.operationUser.list = res.body.data
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        getTabData() {
            this.getOperationUser()// 操作人员下拉
            // 组件传入要过滤的字段
            let req = {
                ctId: this.formData.operationUser.value, // 操作人员
                startDate: this.$m_unifiedTime(this.formData.time[0]),
                endDate: this.$m_unifiedTime(this.formData.time[1]),
                isShowView: this.formData.isShowView,
                objectId: this.itemId,
                moduleCode: this.moduleCode
            }
            this.$refs.userActionList.getListData(req)// 往组件里传值查询
        }
    },
    components: {
        'user-action-list': userActionList
    },
    watch: {
        activeName(val) {
            if (val == this.itemActive) {
                this.getTabData()
            }
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
