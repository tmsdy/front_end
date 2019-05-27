<template>
    <div>
        <el-select v-model="ruleForm.input" multiple @change="change" :style="{width:width}">
            <div style="width:635px;padding-bottom:45px;">
                <!-- 选择接收人 -->
                <div class="optionTitle">{{$t('mxpcweb.am.1531897670095')}}</div>
                <div class="optionBox">
                    <!-- <div class="optionBoxTitle">
              <span class="text-hover" :style="tabSelect=='1'?'color:#3d425e':'color:#6b6b6b'">按客户筛选器过滤1</span>
              <span class="text-hover" style="margin-left:26px;" :style="tabSelect=='2'?'color:#3d425e':'color:#6b6b6b'">指定标签客户</span>
              <span class="text-hover" style="margin-left:26px;" :style="tabSelect=='3'?'color:#3d425e':'color:#6b6b6b'">接收人列表</span>
              <el-input class="search" placeholder="搜索" size="mini"></el-input>
          </div> -->
                    <div class="optionItemBox">
                        <no-data v-if="options.length==0"></no-data>
                        <template v-else>
                            <div class="optionItem1">
                                <el-option v-for="(item,index) in options" :key="index" :label="item.name" :value="item.invokeName">
                                </el-option>
                            </div>
                            <div v-for="(item,index) in options" v-if="item.memberCount!=0" class="ellipsis optionItem text-hover" :class="item.select?'optionItems1':'optionItems2'" :title="item.name" :key="index" @click="changeItem(item)">
                                {{item.name}}
                            </div>
                            <div v-show="blockData.total>blockData.fromNum*blockData.pageSize" class="ellipsis optionItem text-hover optionItems2" @click="loadMore()">
                                ...
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </el-select>
        <!-- 预览 -->
        <span v-if="ruleForm.input.length>0" class="text-hover" style="margin-left:15px;font-size:12px;color:RGBA(208, 2, 27, 1)" @click="dialogSelectOpen()">{{$t('mxpcweb.am.1531893065005')}}</span>
        <!-- 预览 -->
        <span v-else class="text-hover" style="margin-left:15px;font-size:12px;color:RGBA(208, 2, 27, 1);">{{$t('mxpcweb.am.1531893065005')}}</span>
        <dialog-select ref="dialogSelect"></dialog-select>
    </div>
</template>

<script>
import { isArray } from '@/libs/utils.js'
import listPage from '@/components/listPageTwo/index'
import NoData from '@/basecomponents/NoData/index'
import dialogSelect from './dialogSelect.vue'
export default {
    name: 'Controls-SystemDownBox',
    props: {
        sendeePeople: {
            type: String,
            default: ''
        },
        sendeePeopleName: {
            type: String,
            default: ''
        },
        width: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            options: [],
            tabSelect: '3',
            ruleForm: {
                input: []
            },
            // 分页操作
            blockData: {
                pageSize: 20,
                total: 0,
                fromNum: 1
            }
        }
    },
    created() {
        this.getData(true)
    },
    methods: {
        dialogSelectOpen() {
            let list = []
            let options = this.options
            let input = this.ruleForm.input
            options.forEach(function (items) {
                input.forEach(function (invokeName) {
                    if (items.invokeName == invokeName) {
                        list.push(items)
                    }
                })
            })
            if (list.length == 0) {
                return false
            }
            this.$refs.dialogSelect.show(list)
        },
        loadMore() {
            if (this.blockData.pageSize >= this.blockData.total) {
                // 已无更多数据
                this.$message(this.$t('mxpcweb.am.1531901392490'))
                return false
            };
            this.blockData.pageSize += 20
            this.getData()
        },
        getData(type) {
            let _this = this
            _this.$http.get(this.Global.baseURL + this.Global.api.v2.addrBook_Get, {
                params: {
                    pageN: this.blockData.fromNum,
                    pageSize: this.blockData.pageSize
                }
            }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    if (res.body.data.dataList && isArray(res.body.data.dataList)) {
                        res.body.data.dataList.forEach(element => {
                            element.select = false
                        })
                        _this.options = res.body.data.dataList
                        _this.blockData.total = res.body.data.rowTotal
                        let sendeePeople = this.sendeePeople.split(';')
                        let sendeePeopleName = this.sendeePeopleName.split(';')
                        if (sendeePeople.length == 0 || sendeePeopleName.name == 0) {
                            return false
                        }
                        sendeePeople.forEach((element, index) => {
                            let sendee = false
                            _this.options.forEach(item => {
                                if (element == item.invokeName) {
                                    sendee = true
                                }
                            })
                            if (!sendee) {
                                if (sendeePeopleName[index]) {
                                    _this.options.push({
                                        invokeName: element,
                                        name: sendeePeopleName[index],
                                        select: true
                                    })
                                } else {
                                    sendeePeople.splice(index, 1)
                                }
                            }
                        })
                        this.ruleForm.input = sendeePeople
                    } else {
                        _this.options = []
                    }
                } else if (res.body.code.toString() != '-3') {
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        change() {
            console.log('dddddddd')
            let _this = this
            let nameList = []
            let peopleCount = 0
            _this.options.forEach(element => {
                let select = false
                _this.ruleForm.input.forEach(elements => {
                    if (elements == element.invokeName) {
                        select = true
                        nameList.push(element.name)
                        peopleCount = peopleCount + Number(element.memberCount)
                    }
                })
                element.select = select
            })
            this.$emit('update:sendeePeople', this.ruleForm.input.join(';'))
            this.$emit('update:sendeePeopleName', nameList.join(';'))
            this.$emit('update:peopleCount', peopleCount)

            // let _this = this
            // _this.options.forEach(element => {
            //     let select = false
            //     _this.ruleForm.input.forEach(elements => {
            //         if (elements == element.invokeName) {
            //             select = true
            //         }
            //     })
            //     element.select = select
            // })
            // this.$emit('update:sendeePeople', this.ruleForm.input.join(';'))
            // let nameList = []
            // _this.options.forEach(element => {
            //     _this.ruleForm.input.forEach(elements => {
            //         if (elements == element.invokeName) {
            //             nameList.push(element.name)
            //         }
            //     })
            // })
            // this.$emit('update:sendeePeopleName', nameList.join(';'))
        },
        changeItem(item) {
            if (!item.select) {
                this.ruleForm.input.push(item.invokeName)
                item.select = true
            } else {
                let index = this.ruleForm.input.indexOf(item.invokeName)
                if (index > -1) {
                    this.ruleForm.input.splice(index, 1)
                }
                item.select = false
            }
        }
    },
    watch: {
        $sendeePeople: function (newVal) {
            if (newVal == '1') {
                this.getListData()
            }
        }
    },
    components: {
        'list-page': listPage,
        'no-data': NoData,
        'dialog-select': dialogSelect
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
.optionTitle {
    height: 40px;
    background: #f2f2f2;
    line-height: 40px;
    color: #3d425e;
    padding-left: 15px;
    margin-top: -5px;
}
.optionBox {
    padding: 20px 0;
    .optionBoxTitle {
        color: #3d425e;
        height: 30px;
        position: relative;
        margin-left: 15px;
        .search {
            position: absolute;
            right: 15px;
            width: 150px;
        }
    }
    .optionItemBox {
        padding: 0 5px;
        min-height: 50px;
        .optionItem1 {
            height: 0;
            width: 0;
            overflow: hidden;
        }
        .optionItem {
            display: inline-block;
            text-align: center;
            font-size: 12px;
            padding: 5px 5px;
            margin: 5px 10px;
            border-radius: 3px;
        }
        .optionItems1 {
            color: #5bc7f3;
            background: #d4f3fc;
        }
        .optionItems2 {
            color: #c1bcc1;
            background: #f2f2f2;
        }
    }
}
</style>
