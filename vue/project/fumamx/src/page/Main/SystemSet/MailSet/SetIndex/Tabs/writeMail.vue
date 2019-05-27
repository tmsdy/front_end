<template>
    <div class="writeMail MXscroll" ref="writeMail" style="overflow:auto;padding-bottom:25px;">
        <el-form class="formCheckbox" :model="checkForm">
            <!-- 默认账号 -->
            <div class="listTitle">{{$t('mxpcweb.systemset.mailset.setindex.1528980670406')}}</div>
            <div class="listSelect">
                <!-- 新建邮件默认发送账号： -->
                <span>{{$t('mxpcweb.systemset.mailset.setindex.1528980672214')}}</span>
                <!-- 请选择 -->
                <el-select v-model="checkForm23.value" size="small" :placeholder="$t('mxpcweb.systemset.mailset.setindex.1528980672414')">
                    <el-option label="" value=""> </el-option>
                    <!-- <el-option label="aaa" value="aaa"> </el-option>
            <el-option label="aaa" value="aaa"> </el-option>-->
                    <el-option :label="item.sendDisplayName+'<'+item.mailAccount+'>'" v-for="(item,index) in mailInfoList" :key="index" :value="item.sendDisplayName+'<'+item.mailAccount+'>'"> </el-option>
                </el-select>
            </div>
            <div class="listSelect">
                <!-- 回复邮件时发送账号： -->
                <span>{{$t('mxpcweb.systemset.mailset.setindex.1528980672606')}}</span>
                <!-- 请选择 -->
                <el-select v-model="checkForm24.value" size="small" :placeholder="$t('mxpcweb.systemset.mailset.setindex.1528980672414')">
                    <el-option label="" value=""> </el-option>
                    <!-- 使用原邮件的接收账号回复若无权限则使用指定账号 -->
                    <el-option :label="$t('mxpcweb.systemset.mailset.setindex.1528980672778')" value="0"> </el-option>
                    <!-- 仅使用指定账号 -->
                    <el-option :label="$t('mxpcweb.systemset.mailset.setindex.1528980672940')" value="1"> </el-option>
                    <!-- 仅使用原邮件的接收账号 -->
                    <el-option :label="$t('mxpcweb.systemset.mailset.setindex.1528980673303')" value="2"> </el-option>
                </el-select>
            </div>
            <div class="listSelect">
                <!-- 指定发送账号： -->
                <span>{{$t('mxpcweb.systemset.mailset.setindex.1528980673544')}}</span>
                <!-- 请选择 -->
                <el-select v-model="checkForm25.value" size="small" :placeholder="$t('mxpcweb.systemset.mailset.setindex.1528980672414')">
                    <el-option label="" value=""> </el-option>
                    <el-option :label="item.sendDisplayName+'<'+item.mailAccount+'>'" v-for="(item,index) in mailInfoList" :key="index" :value="item.sendDisplayName+'<'+item.mailAccount+'>'"> </el-option>
                </el-select>
            </div>
            <!-- 其他设置 -->
            <div class="listTitle2">{{$t('mxpcweb.systemset.mailset.setindex.1528980750733')}}</div>

            <div v-for="(item,index) in itemList" :key="index" class="itemListClass">
                <!-- <div > -->
                <el-checkbox v-model="item.completed">{{item.textShow}}
                    <el-input v-if="item.variable=='OneToOneLetter'" v-model="checkForm.num " size="small " style="width: 55px;         "></el-input>
                    <!-- 秒 -->
                    <span v-if="item.variable=='OneToOneLetter'">{{$t('mxpcweb.systemset.mailset.setindex.1528980751135')}}</span>
                    <el-input v-if="item.variable=='AutomaticallyDelay'" v-model="checkForm2.value " size="small " style="width: 55px;         "></el-input>
                    <!-- 分钟 -->
                    <span v-if="item.variable=='AutomaticallyDelay'">{{$t('mxpcweb.systemset.mailset.setindex.1528980751619')}}</span>
                    <span>
                        <el-input v-if="item.variable=='AutomaticCopy'" v-model="inputValue" style="width: 300px;"></el-input>
                    </span>

                    <span v-if="item.variable=='AutomaticCopy'">{{$t('mxpcweb.systemset.mailset.setindex.1552443314241')}}</span>
                </el-checkbox><br>

                <div class="checkSend2" v-if="item.variable=='PopUpMailCheckItem'">
                    <div v-for="(items,index2) in arrylist.checkeList" :key="index2">{{items.checkName}}
                        <i class="iconfont icon-close" @click="fDeletecheckName(index2)"></i>
                    </div>

                    <el-button type="primary" size="mini" style="width:48px;height:32px;margin:7px 0 0 10px;border-radius:3px; border: 1px solid red;" @click="open3">{{$t('mxpcweb.systemset.mailset.setindex.1528980783777')}}</el-button>
                </div>

            </div>

            <!-- </div> -->
        </el-form>
        <!-- 保存设置 -->
        <el-button type="primary " style="margin-left:28px;margin-top:20px; " @click="fSaveWriteMaile() ">{{$t('mxpcweb.systemset.mailset.setindex.1528979424189')}}</el-button>
    </div>
</template>

<script>
// @import url("//unpkg.com/element-ui@2.0.5/lib/theme-chalk/index.css");
import { isArray } from '@/libs/utils.js'
import { mapGetters } from 'vuex'
export default {
    name: 'writeMail',
    props: {
        arrylist: {
            type: Object,
            default: function () {
                return {}
            }
        }
    },
    data() {
        let _this = this
        return {
            inputValue: '',
            mailInfoList: [],
            /**
             * 新建邮件默认发送账号
             */
            checkForm23: {
                checked: false,
                value: '',
                num: 0
            },
            /**
             * 回复邮件时发送账号
             */
            checkForm24: {
                checked: false,
                value: '',
                num: 0
            },
            /**
             * 指定发送账号
             */
            checkForm25: {
                checked: false,
                value: '',
                num: 0
            },
            checkForm: {
                checked: false,
                value: '',
                num: 30
            },
            itemList: [
                { variable: 'ChangeMailTemPChangSender', textShow: _this.$t('mxpcweb.systemset.mailset.setindex.1528980927735'), completed: false }, // 变更发件人时提示更换邮件模板
                { variable: 'ForwardingNoMerge', textShow: _this.$t('mxpcweb.systemset.mailset.setindex.1528980929499'), completed: false }, // 转发邮件后原邮件不自动归并
                // 回复邮件后原邮件不自动归并
                { variable: 'NonAutoMerge', textShow: _this.$t('mxpcweb.systemset.mailset.setindex.1528980929731'), completed: false },
                // 内部分发邮件后原邮件不自动归并
                { variable: 'DistributionDoesNotMerge', textShow: _this.$t('mxpcweb.systemset.mailset.setindex.1528980929911'), completed: false },
                // 智能检测并提示添加附件（如主题或正文提到附件）
                { variable: 'IntelligentDetectionAndPromptAdd', textShow: _this.$t('mxpcweb.systemset.mailset.setindex.1528980930093'), completed: false },
                // 发送邮件前弹出邮件检查项
                { variable: 'PopUpMailCheckItem', textShow: _this.$t('mxpcweb.systemset.mailset.setindex.1528980930269'), completed: false },
                // 回复或转发时如果有两个以上回复或转发前缀则不再添加
                { variable: 'DoNotAddPrefix', textShow: _this.$t('mxpcweb.systemset.mailset.setindex.1528980930467'), completed: false },
                // 回复邮件时保存到草稿箱就标记原邮件已回复
                { variable: 'UnansweredMarkupMail', textShow: _this.$t('mxpcweb.systemset.mailset.setindex.1528980930649'), completed: false },
                // 全部回复时把自己的邮箱地址也作为收件人
                { variable: 'ReplyAllOwnAsRecipient', textShow: _this.$t('mxpcweb.systemset.mailset.setindex.1528981021615'), completed: false },
                // 内送邮件发件人名称使用当前登录人的名称
                { variable: 'UsingNameOfTheLogged', textShow: _this.$t('mxpcweb.systemset.mailset.setindex.1528981021830'), completed: false },
                // 回复/转发邮件时在编辑器内显示原邮件内容
                { variable: 'text26', textShow: _this.$t('mxpcweb.systemset.mailset.setindex.1528981022042'), completed: false },
                // 一对一发信的时间间隔
                { variable: 'OneToOneLetter', textShow: _this.$t('mxpcweb.systemset.mailset.setindex.1528981022224'), completed: false },

                // 常规
                // 每次发邮件时自动延时
                { variable: 'AutomaticallyDelay', textShow: _this.$t('mxpcweb.systemset.mailset.setindex.1528981106074'), completed: false },
                // { variable: "Timevalue", textShow: "30", completed: false }
                // 1、对所有发出的邮件请求回执
                { variable: 'reqReceipt', textShow: _this.$t('mxpcweb.mail.1543209514817'), completed: false },
                // 2、对所有发出的邮件启用千里眼
                { variable: 'enableTrack', textShow: _this.$t('mxpcweb.mail.1543209531573'), completed: false },
                // 当我写邮件时自动抄送给：
                { variable: 'AutomaticCopy', textShow: _this.$t('mxpcweb.systemset.mailset.setindex.1552443067512'), completed: false }
            ],
            // 常规
            checkForm2: {
                checked: false,
                value: 30
            }
        }
    },
    created() {
        this.getMailAccountList()
    },
    computed: {
        ...mapGetters([
            'screenHeight'
        ])
    },
    mounted() {
        let _this = this
        setTimeout(function () {
            _this.getWinHeight()
        }, 2000)
        // window.onresize = function temp() {
        //     _this.getWinHeight()
        // }
    },
    methods: {
        getWinHeight() {
            const _this = this
            let winHeight = document.body.clientHeight
            _this.$refs.writeMail.style.height = winHeight - 130 + 'px'
        },
        /**
         * 获取邮件账户列表
         */
        getMailAccountList() {
            let _this = this
            _this.$http.get(_this.Global.baseURL + _this.Global.api.SystemSet.mailset.mailaccount.accounts,
                { params: { type: 'list' } }).then(
                    function (res) {
                        if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
                            let data = res.body.data
                            _this.mailInfoList = data
                        } else if (res.body.code.toString() == _this.Global.RES_OK) {
                            _this.mailInfoList = []
                            _this.$message(res.data.msg)
                        }
                    },
                    function (res) {
                        _this.$message.error(_this.$t(_this.Global.errorTitle))
                    }
                )
        },
        // 保存
        fSaveWriteMaile() {
            let _this = this
            let data = {
                mailOptionsList: [],
                sendCheckList: []
            }
            _this.itemList.forEach((item, index) => {
                if (item.variable == 'AutomaticCopy') { // 当我写邮件时自动抄送给：为空
                    data.mailOptionsList.push({
                        type: 2,
                        variable: 'CopyAddress',
                        value: _this.inputValue
                    })
                    if (_this.inputValue == '') {
                        data.mailOptionsList.push({
                            type: 2,
                            variable: item.variable,
                            value: '0'
                        })
                    } else {
                        data.mailOptionsList.push({
                            type: 2,
                            variable: item.variable,
                            value: item.completed ? '1' : '0'
                        })
                    }
                }

                data.mailOptionsList.push({
                    type: 2,
                    variable: item.variable,
                    value: item.completed ? '1' : '0'
                })

                if (item.variable == 'OneToOneLetter' && item.completed) {
                    data.mailOptionsList.push({
                        type: 2,
                        variable: 'IntervalTime',
                        value: _this.checkForm.num
                    })
                }
                // 常规
                if (item.variable == 'AutomaticallyDelay' && item.completed) {
                    data.mailOptionsList.push({
                        type: 2,
                        variable: 'Timevalue',
                        value: _this.checkForm2.value
                    })
                }
            })

            _this.arrylist.checkeList.forEach((items, index1) => {
                data.sendCheckList.push({
                    'checkName': items.checkName
                })
            })
            /**
             * 三个下拉的保存
             */
            data.mailOptionsList.push({
                type: 2,
                variable: 'text23',
                value: _this.checkForm23.value
            })
            data.mailOptionsList.push({
                type: 2,
                variable: 'text24',
                value: _this.checkForm24.value
            })
            data.mailOptionsList.push({
                type: 2,
                variable: 'text25',
                value: _this.checkForm25.value
            })
            _this.$http.post(_this.Global.baseURL + _this.Global.api.SystemSet.mailset.setindex.updateOptions, data).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.$message(this.$t('mxpcweb.systemset.mailset.setindex.1528979427238'))// 修改成功
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            },
                function (res) {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                }
            )
        },
        // 检查项添加
        open3() {
            // 邮件检查项  输入
            this.$prompt(this.$t('mxpcweb.systemset.mailset.setindex.1528981243201'), this.$t('mxpcweb.systemset.mailset.setindex.1528981245887'), {
                cancelButtonText: this.$t('mxpcweb.systemset.mailset.setindex.1528981246331'), // '取消',
                confirmButtonText: this.$t('mxpcweb.systemset.mailset.setindex.1528981246109') // '确定',
            }).then(({ value }) => {
                this.$message({
                    type: 'success',
                    message: this.$t('mxpcweb.systemset.mailset.setindex.1528981265711')// "添加成功",
                })
                this.arrylist.checkeList.push({ 'checkName': value })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: this.$t('mxpcweb.systemset.mailset.setindex.1528981266047')// '取消输入'
                })
            })
        },
        // 检查项删除
        fDeletecheckName(res) {
            let _this = this
            _this.arrylist.checkeList.splice(res, 1)
        }
        // getMailList() {
        //   let _this = this;
        //   _this.$http.get(_this.Global.baseURL + _this.Global.api.SystemSet.mailset.mailaccount.account, { params: { type: "my", keywords: "", pageN: 1, pageSize: 10 } })
        //   .then( function(res){
        //
        //     });

        // }
    },
    watch: {
        arrylist: {
            handler(curVal, oldvalue) {
                let _this = this
                if (curVal.writeData.length > 0) {
                    curVal.writeData.forEach((element1, index1) => {
                        _this.itemList.forEach((element2, index2) => {
                            if (element1.variable == 'CopyAddress') {
                                _this.inputValue = element1.value
                            }
                            if (element1.variable == 'IntervalTime') {
                                _this.checkForm.checked = true
                                _this.checkForm.num = element1.value
                            } else if (element1.variable == 'Timevalue') { // 常规
                                _this.checkForm2.checked = true
                                _this.checkForm2.value = element1.value
                            } else if (element1.variable == 'text23') {
                                _this.checkForm23.value = element1.value
                            } else if (element1.variable == 'text24') {
                                _this.checkForm24.value = element1.value
                            } else if (element1.variable == 'text25') {
                                _this.checkForm25.value = element1.value
                            } else if (element1.variable == element2.variable) {
                                element2.completed = element1.value == '1'
                            }
                        })
                    })
                }
            },
            deep: true
        },
        screenHeight (val) { // 监听屏幕宽度变化
            this.getWinHeight()
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.writeMail {
    // border: 1px solid blue;
    @import "./publicLess/formCheckbox.less";
}
</style>
