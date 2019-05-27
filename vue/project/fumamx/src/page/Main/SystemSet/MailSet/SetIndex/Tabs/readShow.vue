<template>
    <div class="readShow MXscroll" ref="readShow">
        <el-form class="formCheckbox" style="margin-top:30px;">
            <div v-for="(item,index) in itemList" :key="index" class="readListClass">
                <el-checkbox v-model="item.completed">{{item.textShow}}</el-checkbox>
                <!-- <span v-if="item.variable=='AutomaticCopy'"> -->
                <!-- <el-input v-if="item.variable=='AutomaticCopy'" v-model="inputValue" style="width: 300px;margin-left: -25px;"></el-input> -->

                <!-- <span v-if="item.variable=='AutomaticCopy'">{{$t('mxpcweb.systemset.mailset.setindex.1552443314241')}}</span> -->
                <!-- </span> -->
                <br>
            </div>

        </el-form>
        <!-- 保存设置 -->
        <el-button type="primary" style="margin-left:28px;margin-top:30px;margin-bottom: 16px;" @click="fSaveRead()">{{$t('mxpcweb.systemset.mailset.setindex.1528979424189')}}</el-button>
    </div>
</template>

<script>
export default {
    name: 'readShow',
    props: {
        arrylist: {
            type: Array,
            default: function () {
                return []
            }
        },
        checkeList: {
            type: Array,
            default: function () {
                return []
            }
        }
    },
    data() {
        let _this = this
        return {
            checkForm: {
                checked: true,
                value: 'CustomerQuan'
            },
            itemList: [
                // { variable: "TraditionalPaging", textShow: "邮件列表使用传统带页码方式分页", completed: false },
                // 手动归并后自动将邮件不标记为已读
                { variable: 'ManualMergeMarkForRead', textShow: _this.$t('mxpcweb.systemset.mailset.setindex.1528979426633'), completed: false },
                // 移动邮件后自动将邮件不标记为已读
                { variable: 'MobileMarkupForRead', textShow: _this.$t('mxpcweb.systemset.mailset.setindex.1528979426854'), completed: false },
                {
                    variable: 'MouseDisplayAddress',
                    // 邮件列表中的收发件人鼠标停靠显示邮箱地址
                    textShow: _this.$t('mxpcweb.systemset.mailset.setindex.1528979427046'),
                    completed: false
                },
                // 文件夹不显示关注客户
                { variable: 'FoldersShowCustomer', textShow: _this.$t('mxpcweb.systemset.mailset.setindex.1528979599883'), completed: false },
                // 收到新邮件PC端消息不提醒
                { variable: 'MessageReminder', textShow: _this.$t('mxpcweb.systemset.mailset.setindex.1558316545146'), completed: false }
                // 当我写邮件时自动抄送给：
                // { variable: 'AutomaticCopy', textShow: _this.$t('mxpcweb.systemset.mailset.setindex.1552443067512'), completed: false }
                // {
                //   variable: "MailPreview",
                //   textShow: "邮件预览时显示收发件和抄送地址同时邮件地址",
                //   completed: false
                // }
            ]
            // ,            inputValue: ''
        }
    },
    created() { },
    mounted() {
        // let _this = this
        // setTimeout(function () {
        //   _this.getWinHeight()
        // }, 200)
        // window.onresize = function temp () {
        //   _this.getWinHeight()
        // }
    },
    methods: {
        getWinHeight() {
            const _this = this
            let winHeight = document.body.clientHeight
            _this.$refs.readShow.style.height = winHeight - 130 + 'px'
        },
        fSaveRead() {
            let _this = this
            let data = {
                mailOptionsList: [],
                sendCheckList: _this.checkeList
            }
            _this.itemList.forEach((item, index) => {
                // if (item.variable == 'AutomaticCopy') { // 当我写邮件时自动抄送给：为空
                //     data.mailOptionsList.push({
                //         type: 1,
                //         variable: 'CopyAddress',
                //         value: _this.inputValue
                //     })
                //     if (_this.inputValue == '') {
                //         data.mailOptionsList.push({
                //             type: 1,
                //             variable: item.variable,
                //             value: '0'
                //         })
                //     } else {
                //         data.mailOptionsList.push({
                //             type: 1,
                //             variable: item.variable,
                //             value: item.completed ? '1' : '0'
                //         })
                //     }
                // } else {
                data.mailOptionsList.push({
                    type: 1,
                    variable: item.variable,
                    value: item.completed ? '1' : '0'
                })
                // }

                // }
            })
            _this.$http.post(_this.Global.baseURL + _this.Global.api.SystemSet.mailset.setindex.updateOptions, data).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.$message(this.$t('mxpcweb.systemset.mailset.setindex.1528979427238'))//
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            },
                function (res) {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                }
            )
        }
    },
    components: {},
    watch: {
        arrylist: {
            handler(curVal, oldvalue) {
                let _this = this
                if (curVal.length > 0) {
                    curVal.forEach((element1, index1) => {
                        // if (element1.variable == 'CopyAddress') {
                        //     _this.inputValue = element1.value
                        // }
                        _this.itemList.forEach((element2, index2) => {
                            if (element1.variable == element2.variable) {
                                element2.completed = element1.value == '1'
                            } else if (element1.variable == 'CustomerCheck') {
                                _this.checkForm.value = element1.value
                                _this.checkForm.checked = true
                            }
                        })
                    })
                }
            },
            deep: true
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./publicLess/formCheckbox.less";
</style>
