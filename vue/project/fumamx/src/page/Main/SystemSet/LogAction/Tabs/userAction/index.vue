<template>
    <div class="userAction MXscroll" ref="userAction">
        <!-- 表单 过滤条件 -->
        <el-form :model="formData" :inline="true" style="margin-top: 5px;">
            <!-- 操作人员 -->
            <el-form-item :label="$t('mxpcweb.systemset.logaction.1530345368161')">
                <!-- 请选择 -->
                <el-select clearable v-model="formData.operationUser" @change="getData" :placeholder="$t('mxpcweb.systemset.logaction.1530345396024')" style="width:110px;">
                    <el-option v-for="(item,index) in userList" :key="index" :label="item.realName" :value="item.ctId"></el-option>
                </el-select>
            </el-form-item>
            <!-- 操作时间 -->
            <el-form-item :label="$t('mxpcweb.systemset.logaction.1530345424447')">
                <!-- 请选择时间范围 -->
                <el-date-picker v-model="formData.time" @change="getData" format="yyyy-MM-dd HH:mm" :picker-options="pickerOptions" type="datetimerange" :placeholder="$t('mxpcweb.systemset.logaction.1530342578081')" style="width:280px"></el-date-picker>
            </el-form-item>
            <!-- 模块 -->
            <el-form-item :label="$t('mxpcweb.systemset.logaction.1530345507783')">
                <!-- 请选择 -->
                <el-select clearable @clear="operationList=Object.freeze([])" v-model="formData.module" @change="moduleListChange" :placeholder="$t('mxpcweb.systemset.logaction.1530345396024')" style="width:150px;">
                    <el-option v-for="(item) in moduleList" :key="item.index" :label="item.moduleName" :value="item.moduleCode"></el-option>
                </el-select>
            </el-form-item>
            <!-- 操作 -->
            <el-form-item :label="$t('mxpcweb.systemset.logaction.1530345579674')">
                <!-- 请选择 -->
                <el-select clearable v-model="formData.operation" @change="getData" :placeholder="$t('mxpcweb.systemset.logaction.1530345396024')" style="width:130px;">
                    <el-option v-for="(item) in operationList" :key="item.index" :label="item.optName" :value="item.optCode"></el-option>
                </el-select>
            </el-form-item>
            <!-- 显示查看记录 -->
            <el-checkbox v-model="formData.isShowView" @change="getData" style="margin-top:8px;">{{$t('mxpcweb.systemset.logaction.1530345655768')}}</el-checkbox>

        </el-form>

        <!-- 时间轴，行为列表，外包滚动层 -->
        <div class="timeAxisList MXscroll" ref="timeAxisList">
            <user-action-list ref="userActionList"></user-action-list>
        </div>
    </div>
</template>

<script>
/**
 * 描述：系统设置=>日志与行为
 * 作者：向士健
 * 时间：2017/10/31
 */
import { isObject, isArray } from '@/libs/utils.js'
import userActionList from './userActionList/index.vue'

export default {
    name: 'userAction',
    props: {
        pickerOptions: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            userList: Object.freeze([]),
            moduleList: Object.freeze([]),
            operationList: Object.freeze([]),
            formData: {
                operationUser: '',
                time: [], // 操作时间
                module: '',
                // 选操作
                operation: '',
                isShowView: true // 是否显示查看记录（不显示传false）
            }

        }
    },
    created() {
        this.getOperationUser()// 操作人员下拉
        this.getModuleListdata()// 模块下拉
    },
    mounted() {
        /*  setTimeout(() => {
             this.getWinHeight()
         }, 200)
         window.addEventListener('resize', this.getWinHeight) */
        /*  $(window).resize(() => {
             this.getWinHeight()
         }) */

    },
    /*  beforeDestroy() {
         window.removeEventListener('resize', this.getWinHeight)
     }, */
    methods: {
        // 设置固定高
        /*  getWinHeight() {
             if (this.$refs.userAction) {
                 let winHeight = document.body.clientHeight

                 this.$refs.userAction.style.height = winHeight - 130 + 'px'

                 this.tableHeight = winHeight - 250
             }
         }, */
        // 设置固定高
        // getWinHeight() {
        //     const _this = this;
        //     let winHeight = document.body.clientHeight;
        //     let thisToTop = _this.$refs.timeAxisList.offsetTop;
        //     _this.$refs.timeAxisList.style.height = winHeight - thisToTop - 110 + "px";
        // },
        // 操作人员下拉
        getOperationUser() {
            const url = this.Global.baseURL + this.Global.api.v2.accountDropList_get
            this.$http.get(url, { params: { dataType: 'contact', funType: 'customerSearch' } })
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK && isArray(res.body.data)) {
                        this.userList = Object.freeze(res.body.data)
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                })
                .catch(err => {
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        },
        // 模块列表下拉
        getModuleListdata() {
            const url = this.Global.baseURL + this.Global.api.SystemSet.logaction.moduleGet
            this.$http.get(url)
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK && isObject(res.body.data)) {
                        this.moduleList = Object.freeze(res.body.data.moduleList)
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                })
                .catch(err => {
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        },
        // 模块列表选值变化时
        moduleListChange(val) {
            // console.log(val);

            this.formData.operation = '' // 先清空上次值
            this.moduleList.forEach(item => {
                if (item.moduleCode == val) {
                    this.operationList = Object.freeze([].concat(item.rightOptRelationList))
                }
            })
            this.getData()
        },
        // 获取数据
        getData() {
            // 组件传入要过滤的字段
            let req = {
                ctId: this.formData.operationUser, // 操作人员
                startDate: this.$m_unifiedTime(this.formData.time[0]),
                endDate: this.$m_unifiedTime(this.formData.time[1]),
                moduleCode: this.formData.module, // 模块识别码
                optCode: this.formData.operation, // 操作识别码
                isShowView: this.formData.isShowView
            }
            this.$refs.userActionList.getListData(req)// 往组件里传值查询
        }
    },
    components: {
        'user-action-list': userActionList
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
