<template>
    <div class="addName MXscroll">
        <!-- 接收人 -->
        <!-- 新建接收人列表 -->
        <page-detail :title="$t('mxpcweb.am.1542012292798')" iconfont="icon-mail" :detailTitle="$t('mxpcweb.am.1542012644547')" @toList="$emit('tabDataCheck','1')"></page-detail>
        <!-- <h3 style="height:70px;line-height:50px;">
            <span class="text-hover" @click="$emit('tabDataCheck','1')" style="color:#b9b9b9;margin-right:20px;font-size:12px;" >
                <i class="iconfont icon-page-left"></i>
            </span>
            <span style="color:#6b6b6b;font-weight:400">新建接收人列表</span>
        </h3> -->
        <template v-if="tabList=='0'">
            <div class="list">
                <div style="padding:20px 0 10px;">
                    <!-- 列表名称 -->
                    {{$t('mxpcweb.am.1542013124901')}}
                    <el-input style="width:468px;margin-left:15px;" :maxlength="20" v-model="name">
                    </el-input>
                </div>
                <div style="padding:10px 0;">
                    <!-- 下一步 -->
                    <el-button type="primary" style="margin-left:76px;" @click="addName()" size="small">{{$t('mxpcweb.am.1531896641080')}}</el-button>
                </div>
            </div>
        </template>
        <template v-if="tabList=='1'">
            <div class="tabList" style="border-bottom:1px solid rgba(234,237,239,1);">
                <el-tabs class="tabBox" v-model="tabData">
                    <!-- 批量导入 -->
                    <el-tab-pane :label="$t('mxpcweb.am.1531901875669')" name="0">
                    </el-tab-pane>
                    <!-- 手动添加 -->
                    <el-tab-pane :label="$t('mxpcweb.am.1531901880389')" name="1">
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div class="list">
                <template v-if="tabData=='0'">
                    <div style="padding:10px 0;">
                        <!-- 下载示例模板 -->
                        <a class="text-hover" style="color:#008cee" href="/file/孚盟邮件营销示例文件.xlsx">{{$t('mxpcweb.am.1531901880588')}}</a>
                    </div>
                    <!-- 上传文件 -->
                    {{$t('mxpcweb.am.1531901880805')}}
                    <div style="padding:10px 0;">
                        <el-input style="width:468px;" v-model="filesName"></el-input>
                        <input type="file" id="sendeeBox_excel" @change="excel($event)" style="position: absolute;display: none;">
                        <!-- 浏览 -->
                        <label for="sendeeBox_excel" class="filedInput text-hover">{{$t('mxpcweb.am.1531901881004')}}</label>
                    </div>
                </template>
                <template v-if="tabData=='1'">
                    <!-- 请输入接收人信息 -->
                    {{$t('mxpcweb.am.1531901899686')}}
                    <div style="padding:10px 0;">
                        <el-row :gutter="20">
                            <el-col :span="7">
                                <!-- 邮箱 -->
                                <div style="padding:5px 20px 5px 0;">{{$t('mxpcweb.am.1531900664136')}}</div>
                            </el-col>
                            <el-col :span="7">
                                <!-- 昵称 -->
                                <div style="padding:5px 20px 5px 0;">{{$t('mxpcweb.am.1531900824830')}}</div>
                            </el-col>
                            <el-col :span="7">
                                <!-- 手机 -->
                                <div style="padding:5px 20px 5px 0;">{{$t('mxpcweb.am.1531901900133')}}</div>
                            </el-col>
                        </el-row>
                        <el-form onsubmit="return false" ref="ruleForm" label-width="0" :model="formData">
                            <el-row :gutter="20" v-for="(item,index) in formData.address" :key="index">
                                <el-col :span="7">
                                    <div style="padding:5px 30px 5px 0;">
                                        <el-form-item :rules="rulesMailVal" :prop="'address.' + index + '.address'">
                                            <el-input v-model="item.address" size="small"></el-input>
                                        </el-form-item>
                                    </div>
                                </el-col>
                                <el-col :span="7">
                                    <div style="padding:5px 30px 5px 0;">
                                        <el-input v-model="item.name" size="small"></el-input>
                                    </div>
                                </el-col>
                                <el-col :span="7">
                                    <div style="padding:5px 30px 5px 0;position:relative;">
                                        <el-form-item :rules="rulesPhone" :prop="'address.' + index + '.phone'">
                                            <el-input v-model="item.phone" size="small"></el-input>
                                        </el-form-item>
                                        <span class="optBut optBut1" v-if="index==formData.address.length-1">
                                            <i class="iconfont icon-plus-file text-hover" @click="addressAdd"></i>
                                        </span>
                                        <span class="optBut optBut2" v-if="index==formData.address.length-1&&formData.address.length>1">
                                            <i class="iconfont icon-minus text-hover" @click="addressDel"></i>
                                        </span>
                                    </div>
                                </el-col>
                            </el-row>
                        </el-form>
                    </div>
                </template>
            </div>
            <div style="padding:0 30px">
                <!-- 确认导入 -->
                <el-button v-if="tabData=='0'" type="primary" @click="importFiles()" size="small">{{$t('mxpcweb.am.1531901919892')}}</el-button>
                <!-- 确认添加 -->
                <el-button v-if="tabData=='1'" type="primary" @click="submit()">{{$t('mxpcweb.am.1531901920068')}}</el-button>
            </div>
            <div class="lastList" style="font-size:12px;color:#6b6b6b">
                <!-- 说明： -->
                {{$t('mxpcweb.am.1531901920309')}}<br><br>
                <!-- 1、单个上传文件的数据量不超过1000条； -->
                {{$t('mxpcweb.am.1531901935644')}}<br>
                <!-- 2、列表联系人个数单次上传不要超过1000个，总联系人个数不限； -->
                {{$t('mxpcweb.am.1542259024059')}}<br>
                <!-- 3、邮箱和手机至少填写一项 -->
                {{$t('mxpcweb.am.1531901936061')}}<br>
            </div>
        </template>
    </div>
</template>

<script>
import PageDetail from '@/components/PageDetail/index' // 大标题
import { checkPhone } from '@/libs/utils.js'
export default {
    name: 'addName',
    props: {

    },
    data() {
        var checkPhones = (rule, value, callback) => {
            if (value === '') {
                callback()
            } else {
                if (!checkPhone(value)) {
                    // 请输入正确的手机号
                    callback(new Error(this.$t('mxpcweb.am.1531902510388')))
                } else {
                    callback()
                }
            }
        }
        return {
            tabData: 0,
            tabList: 0,
            formData: {
                address: [{
                    name: '',
                    address: '',
                    phone: ''
                },
                {
                    name: '',
                    address: '',
                    phone: ''
                }, {
                    name: '',
                    address: '',
                    phone: ''
                }, {
                    name: '',
                    address: '',
                    phone: ''
                }, {
                    name: '',
                    address: '',
                    phone: ''
                }]
            },
            name: '',
            detailData: '',
            files: [],
            filesName: '',
            importLoading: false,
            rulesMailVal: [
                // 请输入正确的邮箱地址
                { type: 'email', message: this.$t('mxpcweb.am.1531902516260'), trigger: 'blur,change' }
            ],
            rulesPhone: [
                // 请输入正确的手机号
                { validator: checkPhones, trigger: 'blur' }
            ]
        }
    },
    methods: {
        addressAdd() {
            this.formData.address.push({
                name: '',
                address: '',
                phone: ''
            })
        },
        addressDel() {
            if (this.formData.address.length > 1) {
                this.formData.address.pop()
            }
        },
        importFiles() {
            let _this = this
            if (this.files.length == 0) {
                // 请先选择文件
                this.$message(this.$t('mxpcweb.am.1531983790003'))
                return false
            }
            this.importLoading = true
            let url = this.Global.baseURL + this.Global.api.v2.addrMember_Import
            let fd = new FormData()
            let { accessToken } = this.getToken()
            fd.append('accessToken', accessToken)
            fd.append('fileToUpload', _this.files[0], _this.files[0].name)
            fd.append('invokeName', _this.detailData)
            _this.$http.post(url, fd).then(function (res) {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    _this.$emit('getListData')
                    _this.$message.success(res.body.msg)
                    _this.importLoading = false
                    setTimeout(() => {
                        _this.$emit('tabDataCheck', '3', {
                            invokeName: _this.detailData,
                            name: _this.name
                        })
                    }, 100)
                } else if (res.body.code.toString() != '-3') {
                    _this.$message.error(_this.msg(res.body))
                    _this.importLoading = false
                } else {
                    _this.importLoading = false
                }
            })
        },
        async excel(e) { // 导入excel解析
            let files = e.target.files
            this.files = files
            this.filesName = files[0].name
        },
        addName() {
            let _this = this
            if (this.name == '') {
                // 请输入列表名称
                _this.$message(this.$t('mxpcweb.am.1531901936236'))
                return false
            };
            _this.$http.post(this.Global.baseURL + this.Global.api.v2.addrBook_Add, {
                name: this.name.replace(/(^\s*)|(\s*$)/g, '')
            }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    this.detailData = res.body.data.invokeName
                    this.tabList = '1'
                } else if (res.body.code.toString() != '-3') {
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        submit() {
            let _this = this
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    let list = []
                    _this.formData.address.forEach(element => {
                        if (element.address != '') {
                            let str = {
                                name: element.name,
                                address: element.address,
                                phone: element.phone,
                                vars: { phone: element.phone, recipientName: element.name }
                            }
                            list.push(str)
                        }
                    })
                    if (list.length == 0) {
                        // 信息未填写或不完整，请重新填写后重试！
                        _this.$message(this.$t('mxpcweb.am.1531901960919'))
                        return false
                    }
                    _this.$http.post(this.Global.baseURL + this.Global.api.v2.addrMember_Add, {
                        invokeName: [_this.detailData],
                        addressList: list
                    }).then(function (res) {
                        if (res.body.code.toString() == _this.Global.RES_OK) {
                            _this.$message.success(_this.msg(res.body))
                            _this.$emit('tabDataCheck', '3', {
                                invokeName: _this.detailData,
                                name: _this.name
                            })
                        } else if (res.body.code.toString() != '-3') {
                            _this.$message.error(_this.msg(res.body))
                        }
                    }, function (res) {
                        _this.$message.error(_this.$t(_this.Global.errorTitle))
                    })
                } else {
                    return false
                }
            })
        }
    },
    components: {
        'page-detail': PageDetail
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
.addName {
    background: white;
    height: 100%;
    overflow: auto;
    padding-bottom: 30px;
    .tabList {
        padding: 5px 30px;
        border-bottom: 1px solid rgba(234, 237, 239, 1);
        .tabBox {
            position: relative;
            top: 6px;
        }
    }
    .list {
        padding: 10px 30px;
        .optBut {
            display: inline-block;
            width: 32px;
            height: 32px;
            background: #d0021b;
            line-height: 32px;
            text-align: center;
            border-radius: 16px;
            color: white;
            position: absolute;
            top: 5px;
            i {
                font-size: 20px;
            }
        }
        .optBut1 {
            right: -15px;
        }
        .optBut2 {
            right: -55px;
        }
    }
    .lastList {
        padding: 16px;
        margin: 20px 0 0 31px;
        width: 439px;
        height: 118px;
        background: rgba(247, 248, 249, 1);
        border-radius: 4px;
        border: 1px solid rgba(234, 237, 239, 1);
    }
    .filedInput {
        background: rgba(255, 255, 255, 1);
        border-radius: 2px;
        border: 1px solid rgba(223, 226, 228, 1);
        font-size: 12px;
        padding: 8px 16px;
        position: relative;
        top: -1px;
        &:hover {
            background: rgba(208, 2, 27, 0.05);
            border: 1px solid rgba(243, 192, 198, 1);
        }
        &:link {
            background: rgba(208, 2, 27, 0.05);
            border: 1px solid rgba(208, 2, 27, 1);
        }
    }
}
</style>
