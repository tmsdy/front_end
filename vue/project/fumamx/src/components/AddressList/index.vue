<template>
    <div>
        <span class="text-hover" :class="check(item.invokeName) ? 'label1' : 'label'" v-for="(item,index) in options" :key="index" @click="labelClick(item.invokeName)">{{item.name}}</span>
        <!-- 地址簿 -->
        <span v-if="tabData" class="label2 text-hover" @click="tabData = false">+ {{$t('mxpcweb.client.list.1542166132943')}}</span>
        <el-input v-else v-model="newData" @blur="addNew()" @keyup.enter.native="addNew()" style="width:100px;" size="mini"></el-input>
    </div>
</template>

<script>
export default {
    name: 'Controls-Customer',
    props: {
    },
    data () {
        return {
        options: [], // 下拉框选项列表
        checkList: [],
        blockData: { // 分页
            fromNum: 0,
            pageSize: 50
        },
        newData: '',
        tabData: true,
        loading: false
        }
    },
    created () {
        this.getData()// 获取下拉框选项列表
    },
    mounted () {
    },
    methods: {
        submit (list) {
            return new Promise((resolve, reject) => {
               let _this = this
                if (!list || list.length == 0) {
                    // 请先选择邮箱地址
                    _this.$message.error(_this.$t('mxpcweb.client.list.1542166135470'))
                    return reject(new Error())
                }
                if (_this.checkList.length == 0) {
                    // 请先选择地址簿
                    _this.$message.error(_this.$t('mxpcweb.client.list.1542166143806'))
                    return reject(new Error())
                }
                _this.$http.post(this.Global.baseURL + this.Global.api.v2.addrMember_Add, {
                    invokeName: _this.checkList,
                    addressList: list
                }).then(function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        _this.$message.success(_this.msg(res.body))
                        if (res.body.data.failed.length > 0) {
                            let text = ''
                            res.body.data.failed.forEach(element => {
                                text += '<' + element + '> '
                            })
                            const h = this.$createElement
                            _this.$notify.error({
                                // 地址簿添加失败列表
                                title: _this.$t('mxpcweb.client.list.1542166155816'),
                                message: h('i', { style: 'color: #ff4949'}, text)
                            })
                        }
                         resolve()
                    } else {
                        reject(new Error())
                        _this.$message.error(_this.msg(res.body))
                    }
                }, function (res) {
                    reject(new Error())
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            })
        },
        labelClick (invokeName) {
            let isHave = false
            this.checkList.forEach(element => {
                if (element == invokeName) {
                    isHave = true
                }
            })
            if (isHave) {
                this.checkList.splice(this.checkList.indexOf(invokeName), 1)
            } else {
                this.checkList.push(invokeName)
            }
        },
        check (invokeName) {
            let isHave = false
            this.checkList.forEach(element => {
                if (element == invokeName) {
                    isHave = true
                }
            })
            return isHave
        },
        addNew() {
            let _this = this
            let newData = _this.newData.replace(/(^\s*)|(\s*$)/g, '')
            if (_this.newData == '') {
                // 请输入列表名称
                _this.$message(this.$t('mxpcweb.am.1531901936236'))
                return false
            }
            _this.tabData = true
            _this.$http.post(_this.Global.baseURL + _this.Global.api.v2.addrBook_Add, {
                name: newData
            }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.$message.success(_this.msg(res.body))
                    _this.newData = ''
                    _this.getData()
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        // 修改时调用，用于更新传入的数据
        updata (items) {
        },
        more () { // 下拉刷新触发事件，每次新增50条数据
            this.blockData.pageSize += 50
            this.getData()
        },
        getData () { // 获取客户下拉框列表数据
            let _this = this
            let argument = {
                pageN: _this.blockData.fromNum, // parseInt(_this.blockData.fromNum / _this.blockData.pageSize) + 1,
                pageSize: _this.blockData.pageSize
            }
            _this.$http.get(this.Global.baseURL + this.Global.api.v2.addrBook_Get, { params: argument }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    let options = res.body.data.dataList
                    _this.options = options
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        resetForm () { // 重置表单数据方法，暂不需要
            this.$refs.ruleForm.resetFields()
        },
        clearData () { // 清除表单方法，父组件使用v-if后暂时不用
            this.checkList = []
        }
    },
    components: {
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
    .label, .label1, .label2{
        display: inline-block;
        height:26px;
        padding: 0 15px;
        line-height:26px;
        font-size:12px;
        border-radius: 3px;
        margin-right: 15px;
        margin-bottom: 15px;
    }
    .label{
        background: rgba(244, 247, 249, 1);
        border: 1px solid rgba(244, 247, 249, 1);
    }
    .label1{
        background: rgba(252, 237, 233, 1);
        border: 1px solid rgba(252, 237, 233, 1);
        color: #FF6600;
    }
    .label2{
        background: white;
        border: 1px solid rgba(188, 188, 188, 1);
    }
</style>
