<template>
    <div class="QueryRepeat" v-show="dialogAddPeople">
        <div class="checkBox MXscroll">
            <!-- 查重 -->
            <div class="title">{{$t('mxpcweb.client.1529043090630')}}</div>
            <div class="searchBox">
                <!-- 输入公司名称关键词、联系人、电话、手机、邮箱、网址、域名等 -->
                <el-input class="searchInput" @keyup.enter.native="checkRepeats()" size="large"
                v-bind:placeholder="$t('mxpcweb.client.1529027712956')"
                 v-model="input" clearable>
                </el-input>
                <div class="iconBox"><i class="el-icon-search text-hover" @click="checkRepeats()"></i></div>
            </div>
            <div class="listBox" v-if="unit">
                <div v-if="list.totalNum==0" class="text-center">
                    <div class="noData">
                        <!-- 未发现重复，此客户系统内没有找到！ -->
                        {{$t('mxpcweb.client.1529046177230')}}
                    </div>
                    <!-- 立即创建 -->
                    <el-button v-if="isAdd" type="primary" size="small" @click="newAdd()">{{$t('mxpcweb.client.1529028045434')}}</el-button>
                </div>
                <div v-else>
                    <!-- 找到 -->
                    <!-- 个 -->
                    <!-- 公司信息 -->
                    <div class="tip">
                        {{$t('mxpcweb.client.detail.1532398291278')}}
                        <span style="color:red;margin:0 5px">{{list.totalNum}}</span>
                        {{$t('mxpcweb.client.1529027792262')}}
                        {{$t('mxpcweb.client.detail.1532397174964')}}
                        {{$t('mxpcweb.client.detail.1532398317425')}}
                        <!-- 找到14个相似客户信息，当前仅展示前 6 条 -->
                    </div>
                    <cust-card :list="list.list" :showList="showList" @lookCust="lookCust"></cust-card>
                </div>
            </div>
            <div class="text-hover cancel" @click="dialogAddPeople = false">
                <i class="el-dialog__close el-icon el-icon-close"></i>
            </div>
        </div>
    </div>
</template>
<script>
import { isArray } from '@/libs/utils.js'
import CustCard from '@/components/CustCard/index.vue'
export default {
    name: 'QueryRepeats',
    props: {
        moduleCode: {
            type: String,
            default: ''
        },
        isAdd: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            input: '',
            list: {
                list: [],
                totalNum: 0
            },
            showList: [],
            unit: false,
            loading: true,
            dialogAddPeople: false
        }
    },
    created() {
        this.getData()
    },
    methods: {
        lookCust(item) {
            let _this = this
            _this.$confirm('跳转详情页面将会关闭新增弹窗，是否继续跳转？', _this.$t('mxpcweb.client.1529047715824'), {
                confirmButtonText: _this.$t('mxpcweb.client.1529047741736'),
                cancelButtonText: _this.$t('mxpcweb.client.1529047588840'),
                type: 'warning'
            }).then(() => {
                _this.$emit('closeWindow')
                item.moduleCode = 'BF001'
                item.billId = item.custId
                _this.clientDetailPage(item)
            })
        },
        getSetData() {
            let _this = this
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.fieldShow_custCheck_do, { params: { type: 'show'} }).then((res) => {
                if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
                    _this.showList = res.body.data
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, (res) => {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        newAdd() {
            let obj = {
                value: this.input,
                fieldName: 'custName',
                model: 'BF001',
                disable: false
            }
            this.$emit('openWindow', obj)
            this.dialogAddPeople = false
        },
        getData() {
            this.getSetData()
        },
        openWindow(value) {
            this.input = value
            this.list = {
                list: [],
                totalNum: '0'
            }
            this.dialogAddPeople = true
            this.checkRepeats()
        },
        checkRepeats() {
            let _this = this
            if (_this.input == '') {
                return false
            }
            _this.loading = true
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.customerCheck_get, { params: {
                type: '1',
                keywords: _this.input.replace(/(^\s*)|(\s*$)/g, ''),
                from: 0,
                size: 6
            } }).then((res) => {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.list.totalNum = res.body.data.totalNum
                    _this.list.list = res.body.data.list
                    if (_this.unit == false) {
                        _this.unit = true
                    }
                    _this.loading = false
                } else {
                    _this.$message.error(_this.msg(res.body))
                    _this.loading = false
                }
            }, (res) => {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
                _this.loading = false
            })
        }
    },
    beforeDestroy: function () {
        this.lookCust = null
    },
    components: {
        'cust-card': CustCard
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.QueryRepeat{
    position:fixed;
    left: 0;
    top:0;
    right:0;
    bottom:0;
    background: white;
    border-radius: 2px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    padding-bottom: 0;
    .MXscroll::-webkit-scrollbar, .rightWindow > div::-webkit-scrollbar, .mainWindow > div::-webkit-scrollbar, .el-dialog__wrapper::-webkit-scrollbar {
        width: 5px;
        height: 5px;
        background-color: #F5F5F5;
    }
    .checkBox{
        min-height: 350px;
        height: 100%;
        padding: 16px;
        border: 1px solid #f2f2f2;
        border-radius: 3px;
        position: relative;
        overflow: auto;
        .title{
            height:25px;
            font-size:18px;
            color:rgba(34,34,34,1);
            line-height:25px;
        }
        .cancel{
            width:17px;
            height: 17px;
            line-height: 17px;
            position: absolute;
            right: 19px;
            top: 19px;
            font-size: 12px;
            text-align: center;
            color: rgb(191, 203, 217);
        }
        .searchBox{
            width:550px;
            margin:40px auto 0;
            position: relative;
            padding-right: 50px;
            .searchInput{
                height:42px;
                font-size:14px;
            }

                .iconBox{
                    position: absolute;
                    right:0;
                    top:0;
                    width:40px;
                    height:40px;
                    background:linear-gradient(135deg,rgba(255,105,124,1),rgba(208,2,27,1));
                    border-radius:4px;
                    line-height: 40px;
                    text-align: center;
                    color: white;
                    font-size: 20px;
                    cursor: pointer;
                }
                .iconBox:hover{
                    background: #E6001F;
                }
        }
        .listBox{
            text-align: center;
            .tip{
                margin:30px 0;
                text-align: center;
                height:17px;
                font-size:12px;

                color:rgba(144,147,153,1);
                line-height:17px;
            }
            .noData{
                text-align: center;
                height:17px;
                font-size:12px;

                color:rgba(144,147,153,1);
                line-height:17px;
                margin:30px 0 10px;
            }
        }
        .setting{
            position: absolute;
                right:10px;
                top:10px;
        }
    }
}
</style>
