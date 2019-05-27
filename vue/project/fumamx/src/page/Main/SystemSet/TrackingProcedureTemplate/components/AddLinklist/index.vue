<template>
    <div>
        <el-button class="text-hover textBtn" :class="check(item.nodeId) ? 'label1' : 'label'" v-for="(item,index) in nodeList" :key="index" @click="labelClick(item.nodeId)" :disabled="item.disabled">{{item.nodeName}}
            <i class="el-icon-circle-cross" v-if="item.nodeType == 1 && !item.disabled" @click="deleteNode(item)"></i>
        </el-button>
        <!-- 地址簿 -->
        <span v-if="tabData" class="label2 text-hover" @click="tabData = false">+ 新增环节</span>
        <template v-else>
            <el-input v-model="newData" @keyup.enter.native="addOrderNode()" style="width:100px;height:32px;" clss="addOrder"></el-input>
            <el-button @click="addOrderNode" :loading="isLoading">确定</el-button>
        </template>
    </div>
</template>

<script>
export default {
    name: 'Controls-Customer',
    props: {
        nodeList: {
            type: Array,
            default: function () {
                return []
            }
        },
        processList: {
            type: Array,
            default: function () {
                return []
            }
        }
    },
    data() {
        return {
            checkList: [],
            blockData: { // 分页
                fromNum: 0,
                pageSize: 50
            },
            newData: '',
            tabData: true,
            loading: false,
            isLoading: false
        }
    },
    created() {
        //  this.getData()// 获取下拉框选项列表
    },
    mounted() {
    },
    methods: {
        deleteNode(x) {
            this.$http.delete(this.Global.baseURL + this.Global.api.v2.orderNode, { params: { nodeId: x.nodeId } })
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.$emit('getOrderNode') // 刷新获取节点列表
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                },
                    res => {
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                )
        },
        repeatList() {
            this.nodeList.forEach(item => {
                let flag = false
                this.processList.map(ele => {
                    if (item.nodeId == ele.nodeId) {
                        item.disabled = true
                        flag = true
                    }
                })
                if (!flag) {
                    item.disabled = false
                }
            })
        },
        addOrderNode() {
            if (this.newData == '') {
                this.$message.error('请输入环节')
                return
            }
            let params = {
                nodeName: this.newData
            }
            this.isLoading = true
            this.$http.post(this.Global.baseURL + this.Global.api.v2.orderNode, params)
                .then(res => {
                    this.isLoading = false
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.$message.success(this.msg(res.body))
                        this.$emit('getOrderNode') // 刷新获取节点列表
                        this.tabData = !this.tabData
                        this.newData = ''
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                },
                    res => {
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                )
        },
        clearCheckList() {
            this.checkList = []
        },
        submit(list) {
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
                                message: h('i', { style: 'color: #ff4949' }, text)
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
        labelClick(invokeName) {
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
            this.$emit('setList', this.checkList)
        },
        check(invokeName) {
            let isHave = false
            this.checkList.forEach(element => {
                if (element == invokeName) {
                    isHave = true
                }
            })
            return isHave
        },
        // 修改时调用，用于更新传入的数据
        updata(items) {
        },
        more() { // 下拉刷新触发事件，每次新增50条数据
            this.blockData.pageSize += 50
            // this.getData()
        }
        // getData() { // 获取客户下拉框列表数据
        //     let _this = this
        //     let argument = {
        //         pageN: _this.blockData.fromNum, // parseInt(_this.blockData.fromNum / _this.blockData.pageSize) + 1,
        //         pageSize: _this.blockData.pageSize
        //     }
        //     _this.$http.get(this.Global.baseURL + this.Global.api.v2.addrBook_Get, { params: argument }).then(function (res) {
        //         if (res.body.code.toString() == _this.Global.RES_OK) {
        //             let options = res.body.data.dataList
        //             _this.options = options
        //             console.log(_this.options)
        //         } else {
        //             _this.$message.error(_this.msg(res.body))
        //         }
        //     }, function (res) {
        //         _this.$message.error(_this.$t(_this.Global.errorTitle))
        //     })
        // }
    },
    components: {
    },
    watch: {
        processList: {
            handler(newValue, oldValue) {
                this.repeatList()
            },
            deep: true
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.textBtn {
    position: relative;
}
.label,
.label1,
.label2 {
    display: inline-block;
    height: 32px;
    padding: 0 15px;
    line-height: 32px;
    font-size: 14px;
    border-radius: 3px;
    margin-right: 15px;
    margin-bottom: 15px;
}
.label {
    // background: rgba(244, 247, 249, 1);
    border: 1px solid #eaeaea;
    color: #606266;
}
.label1 {
    // background: rgba(252, 237, 233, 1);
    border: 1px solid #d0021b;
    color: #d0021b;
}
.label2 {
    background: white;
    border: 1px solid rgba(188, 188, 188, 1);
}
.addOrder {
    input {
        height: 32px;
    }
}
.el-icon-circle-cross {
    position: absolute;
    top: -7px;
    right: -7px;
    display: none;
    z-index: 999;
}
.text-hover:hover {
    .el-icon-circle-cross {
        display: block;
    }
}
</style>
