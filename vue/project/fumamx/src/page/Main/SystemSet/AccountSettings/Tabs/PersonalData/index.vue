<template>
    <div class="PersonalData">
        <!-- 个人资料 -->
        <el-form :rules="rulesPersonalData" :model="personalData" ref="PersonalData" label-width="100px" label-position="left">

            <set-avatar></set-avatar>

            <div class="input_title">
                <!-- 个人资料 -->{{ $t('mxpcweb.systemset.personaldata.1530594235877') }}</div>
            <!-- 姓名 -->
            <el-form-item :label="$t('mxpcweb.systemset.personaldata.1530594276223')" prop="realName">
                <!-- 你的真实姓名 -->
                <el-input v-model="personalData.realName" :placeholder="$t('mxpcweb.systemset.personaldata.1530594299900')" style="width:320px;"></el-input>
            </el-form-item>
            <!-- 昵称 -->
            <el-form-item :label="$t('mxpcweb.systemset.personaldata.1530594326782')" prop="nickName">
                <!-- 让其他成员知道怎么称呼你 -->
                <el-input v-model="companyObj.companies[0].nickName" :placeholder="$t('mxpcweb.systemset.personaldata.1530594362217')" style="width:320px;"></el-input>
            </el-form-item>
            <!-- 职位 -->
            <el-form-item :label="$t('mxpcweb.systemset.personaldata.1530594388341')" prop="title">
                <!-- 让其他成员知道你是做什么的 -->
                <el-input v-model="companyObj.companies[0].title" :placeholder="$t('mxpcweb.systemset.personaldata.1530594420887')" style="width:320px;"></el-input>
            </el-form-item>
            <!-- 个性签名 -->
            <el-form-item :label="$t('mxpcweb.systemset.personaldata.1530594447309')" prop="signature">
                <!-- 传递正能量、个性爱好或小目标... -->
                <el-input v-model="personalData.signature" :placeholder="$t('mxpcweb.systemset.personaldata.1530594473917')" style="width:320px;"></el-input>
            </el-form-item>

            <el-form-item label="" prop="domain">
                <el-button size="large" type="primary" @click="dataSubmit('PersonalData')">
                    <!-- 保存设置 -->{{$t('mxpcweb.systemset.personaldata.1530594515396')}}</el-button>
            </el-form-item>

        </el-form>
    </div>
</template>

<script>
/**
 * 描述：系统设置=>系统参数
 * 作者：向士健
 * 时间：2017/7/12
 */
import { isObject } from '@/libs/utils.js'
import SetAvatar from './SetAvatar/index' // 头像上传部分
import { mapMutations } from 'vuex'

export default {
    name: 'PersonalData',
    props: {},
    data() {
        return {
            // 个人资料数据
            nickName: '',
            title: '',
            companyObj: {
                'companies': [
                    {
                        'cId': '',
                        'ctId': '',
                        'nickName': '',
                        'title': ''
                    }
                ]
            },
            personalData: {
                realName: '',
                signature: '',
                flags: ''
            },
            // 表单验证
            rulesPersonalData: {}
        }
    },
    created() {

    },
    mounted() {
        this.getPersonalData()
    },
    methods: {
        getPersonalData() {
            let _this = this
            let url = this.Global.baseURL + this.Global.api.SystemSet.personaldata.accountIndividualInf
            this.$http.get(url, { params: {} }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK && isObject(res.body.data)) {
                    let data = res.body.data
                    this.personalData.realName = data.realName
                    this.companyObj.companies[0].nickName = data.companies[0].nickName
                    this.companyObj.companies[0].title = data.companies[0].title
                    this.companyObj.companies[0].cId = data.companies[0].cId
                    this.companyObj.companies[0].ctId = data.companies[0].ctId
                    this.personalData.signature = data.signature
                    this.personalData.flags = data.flags
                } else {
                    _this.$message.error(res.data.msg)
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        // 表单提交
        dataSubmit(formName) {
            let _this = this
            let url = this.Global.baseURL + this.Global.api.SystemSet.personaldata.accountPut
            let objData = Object.assign(this.personalData, this.companyObj)
            this.$http.post(url, objData).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.$message.success(_this.msg(res.body))
                    _this.setPersonalInfo(res.body.data)
                    // console.log(res.body.data);
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        // 做Mutations对象映射。在其他方法中可直接调用mutations.js内的方法
        ...mapMutations({
            setPersonalInfo: 'SET_PERSONALINFO'// this.$store.commit('SET_PERSONALINFO')
        })
    },
    components: {
        'set-avatar': SetAvatar
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
