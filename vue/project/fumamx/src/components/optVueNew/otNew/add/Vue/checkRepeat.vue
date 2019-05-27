<template>
    <div class="checkRepeat" v-show="dialog">
        <div class="checkBox">
            <!-- 发现重复客户 -->
            <h3 class="text-center"><i class="el-icon-information" style="color:#f4ea2a;margin-right:10px"></i>{{$t('mxpcweb.client.1529043427042')}}</h3>
            <el-row class="list" style="margin-top:20px;">
                <!-- 公司 -->
                <el-col :span="11">{{$t('mxpcweb.client.1529043594694')}}</el-col>
                <!-- 拥有人 -->
                <el-col :span="3">{{$t('mxpcweb.client.1529043616422')}}</el-col>
                <!-- 所属部门 -->
                <el-col :span="4">{{$t('mxpcweb.client.1529043630180')}}</el-col>
                <!-- 创建时间 -->
                <el-col :span="4">{{$t('mxpcweb.client.1529042443916')}}</el-col>
                <!-- 操作 -->
                <el-col :span="2" style="text-align:center">{{$t('mxpcweb.client.1529043665103')}}</el-col>
            </el-row>
            <el-row class="list" v-for="(item,index) in list" :key="index" >
                <el-col :span="8">{{item.custName}}</el-col>
                <el-col :span="3" style="color:#999">
                    <!-- 回收站 -->
                    <span v-if="item.delState == '1'">{{$t('mxpcweb.client.1529043691646')}}</span>
                    <!-- 公海客户 -->
                    <span v-else-if="item.seasFlag == '1'">{{$t('mxpcweb.client.1529043704565')}}</span>
                    <!-- 正常客户 -->
                    <span v-else>{{$t('mxpcweb.client.1529043718439')}}</span>
                </el-col>
                <el-col :span="3">{{returnShow(item.ownerCtId)}}</el-col>
                <el-col :span="4">{{returnDepartName(item.ownerDeptKey)}}</el-col>
                <el-col :span="4">{{item.createDate.substring(0,10)}}</el-col>
                <!-- 领取 -->
                <el-col :span="2" style="text-align:center"><el-button v-if="item.delState == '0'&&item.seasFlag == '1'" type="info" size="mini" @click="otReceive(item.custId)">{{$t('mxpcweb.client.1529043733014')}}</el-button></el-col>
            </el-row>
        </div>
        <div class="text-hover cancel" @click="cancel()">
            <i class="iconfont icon-close"></i>
        </div>
    </div>
</template>
<script>
/**
 * 描述：客户管理-客户列表-新增客户
 * 作者：何俊峰
 * 时间：2017/11/21
 */
import { isArray } from '@/libs/utils.js'
import { mapGetters } from 'vuex'
export default {
    name: 'checkRepeats',
    props: {
        moduleCode: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            dialog: false,
            list: [],
            departments: [],
            value: ''
        }
    },
    created() {
        this.getData()
    },
    mounted() {
        this.setHeight()
    },
    methods: {
        returnShow (value) {
            let content = ''
            if (!value || value == '') {
                return content
            }
            if (this.contactList instanceof Object) {
                content = this.contactList[value]
            }
            return content
        },
        setHeight() {
            this.boxHeight = 0.6 * parseInt($(window).height()) + 'px'
        },
        otReceive(id) {
            let _this = this
            ep.emit('setGlobalLoading', {
                val: true,
                // 权限校验中...
                text: this.$t('mxpcweb.client.list.1550126019122') + '...'
            })
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.document_rightCheck_do, { params: {
                moduleCode: 'BF001',
                identFieldValue: id,
                optCode: 'otReceive'
            } }).then((res) => {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    let obj = {
                        billId: id,
                        optData: {
                            optCode: 'otReceive',
                            optModuleCode: 'BF001',
                            optName: _this.$t('mxpcweb.client.1529043733014')
                        }
                    }
                    ep.emit('optClick', obj)
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
                ep.emit('setGlobalLoading', {
                    val: false,
                    text: ''
                })
            }, (res) => {
                ep.emit('setGlobalLoading', {
                    val: false,
                    text: ''
                })
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        getListData() {
            this.openWindow(this.value)
        },
        openWindow(value) {
            let _this = this
            _this.dialog = true
            _this.value = value
            _this.list = []
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.customerFind, { params: {
                custName: value
              } }).then((res) => {
                  if (res.body.code.toString() == _this.Global.RES_OK) {
                        _this.list.push(res.body.data)
                  } else {
                    _this.$message.error(_this.msg(res.body))
                  }
              }, (res) => {
                  _this.$message.error(_this.$t(_this.Global.errorTitle))
              })
        },
        cancel() {
            this.dialog = false
        },
        returnDepartName(departId) {
            let _this = this
            let name = ''
            _this.departments.forEach((elemennt) => {
                if (elemennt.dkey == departId) {
                    name = elemennt.deptName
                    return false
                }
            })
            return name
        },
        getData() {
            let _this = this
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.accountDropList_get, { params: { moduleCode: _this.moduleCode, dataType: 'department', funType: 'all', deptCascade: false } }).then((res) => {
                if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
                    _this.departments = res.body.data
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, (res) => {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        }
    },
    watch: {
        screenHeight(val) { // 监听屏幕宽度变化
            this.setHeight()
        }
    },
    computed: {
        ...mapGetters([
            'contactList',
            'screenHeight'
        ])
    },
    beforeDestroy: function () {
        this.returnShow = null
    },
    components: {
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.checkRepeat{
    position:fixed;
    left: 0;
    top:0;
    width:100%;
    height:100%;
    .checkBox{
        width:1020px;
        position:fixed;
        background:white;
        min-height:650px;
        padding:30px 46px 10px;
        border:1px solid #f2f2f2;
        border-radius:3px;
        .list{
            height:40px;
            width:100%;
        }
    }
    .cancel{
        width:30px;
        height: 30px;
        line-height: 30px;
        position: absolute;
        right:23px;
        top:20px;
        border-radius: 15px;
        text-align: center;
        color: rgb(191, 203, 217);
        font-weight: 900;
        i{
            font-size: 18px;
        }
    }
}
</style>
