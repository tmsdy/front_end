<template>
    <div class="DialogFieldPower">
        <el-dialog title="编辑字段权限" :visible.sync="isShowFiled" custom-class="width620" :close-on-click-modal="false" v-dialogDrag top="10%" :modal-append-to-body="false">

            <table class="tableHead widthFull">
                <tr>
                    <td width="95"></td>
                    <td width="88" align='center' style="border-right:1px solid #eee;">
                        <!-- 可否显示 -->{{$t('mxpcweb.systemset.rolemanag.1530598971339')}}
                    </td>
                    <td class="editHead">
                        <span>
                            <!-- 只读 -->{{$t('mxpcweb.systemset.rolemanag.1530599028917')}}
                        </span>
                        <span>
                            <!-- 可编辑 -->{{$t('mxpcweb.systemset.rolemanag.1530599040932')}}
                        </span>
                        <span>
                            <!-- 新增时不可编辑 -->{{$t('mxpcweb.systemset.rolemanag.1530599052626')}}
                        </span>
                        <span>
                            <!-- 修改时不可编辑 -->{{$t('mxpcweb.systemset.rolemanag.1530599063707')}}
                        </span>
                    </td>
                </tr>
            </table>
            <div class="tableWrap MXscroll">
                <loading v-if="convertData.length === 0"></loading>
                <table v-else class="widthFull">
                    <tr v-for="(item,index) in convertData" :key="index">
                        <td width="95">{{item.cnFieldCaption}}</td>
                        <td width="88" align='center' style="border-right:1px solid #eee;">
                            <el-checkbox v-model="item.showFlag"></el-checkbox>
                        </td>
                        <td>
                            <el-radio-group v-model="item.editState">
                                <el-radio :label="0" style="margin-left:15px"> &nbsp; </el-radio>
                                <el-radio :label="1" style="margin-left:20px"> &nbsp; </el-radio>
                                <el-radio :label="2" style="margin-left:52px"> &nbsp; </el-radio>
                                <el-radio :label="3" style="margin-left:80px"> &nbsp; </el-radio>
                            </el-radio-group>
                        </td>
                    </tr>
                </table>
            </div>

            <div class="text-center marginTop10">
                <el-button type="primary" style="width:200px;" @click="submit()">
                    <!-- 确定 -->{{$t('mxpcweb.systemset.rolemanag.1530595915980')}}
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Loading from '@/basecomponents/Loading/index'

import { mapGetters } from 'vuex'
export default {
    name: 'DialogFieldPower',
    props: {
        thisRoleId: {
            type: Number
        },
        tabCode: {
            type: String
        }
        // fieldPowerArr: {
        //     type: Array,
        //     default: function() {
        //         return []
        //     }
        // },
        // fieldPowerData: {
        //     type: Array,
        //     default: function() {
        //         return []
        //     }
        // },
    },
    data() {
        return {
            loading: true,
            isShowFiled: false,
            groupList: [],
            convertData: [], // 重组后的数据
            fieldPowerArr: [],
            moduleNum: null
        }
    },
    created() {

    },
    computed: {
        ...mapGetters(['sysBoxValue'])
    },
    methods: {
        getData() {
            let _this = this
            // 接口名称: 获取业务字段展示
            var p6 = new Promise((resolve, reject) => {
                let data = {
                    moduleCode: _this.moduleNum,
                    type: 'showRight'
                }
                _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.fieldShow_get, { params: data }).then(function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        resolve(res.body.data)
                    } else {
                        _this.$message.error(_this.msg(res.body))
                    }
                }, function (res) {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            })
            // 接口名称: 获取字段权限配置
            var p7 = new Promise((resolve, reject) => {
                let data = {
                    roleId: _this.thisRoleId,
                    tabCode: _this.tabCode,
                    type: 'fieldRights'
                }
                _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.rolesField_do, { params: data }).then(function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        resolve(res.body.data)
                    } else {
                        _this.$message.error(_this.msg(res.body))
                    }
                }, function (res) {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            })
            Promise.all([p6, p7]).then(function (results) {
                // console.log(results)
                // 先过滤出 相关权限值
                let fieldRightsCust = results[1].moduleRights.filter(item => {
                    return item.moduleCode == _this.moduleNum
                })
                // console.log(fieldRightsCust)
                let fieldP = results[0].concat()
                fieldP.forEach(item => {
                    // 默认定个权限
                    item.showFlag = true
                    item.editState = 1
                    if (fieldRightsCust.length > 0 && fieldRightsCust[0].fieldRights) {
                        fieldRightsCust[0].fieldRights.forEach(item2 => {
                            if (item2.fieldId == item.fieldId) {
                                item.showFlag = item2.showFlag == 1// 有值就覆盖上
                                item.editState = item2.editState// 有值就覆盖上
                            }
                        })
                    }
                })
                // console.log(fieldP)
                _this.fieldPowerArr = fieldP
                _this.getTabData()
            })
        },
        getTabData(data) {
            let _this = this
            let groupData = this.sysBoxValue.filter(function (item, index) {
                return item.alias == 'fieldgrouptype'
            })
            this.groupList = groupData[0].dictItems

            let arr = _this.ControlsDataConvertItem(_this.fieldPowerArr)
            arr.forEach(item => {
                // 给组项加特殊
                if (item.group && item.group.length > 0) {
                    item.showFlag = item.group[0].showFlag == 1
                    item.editState = item.group[0].editState
                }
            })
            _this.convertData = arr
            // console.log(_this.convertData)
        },
        // 返回组控件名称
        returnGroupName(fieldGroup) {
            let _this = this
            let name = ''
            _this.groupList.forEach(function (item) {
                if (fieldGroup == item.dictItemCode) {
                    name = item.itemName
                    return false
                }
            })
            return name
        },
        // 控件数据拆分组件和组
        ControlsDataConvertItem(list) {
            let _this = this
            let newLList = []
            let groupFirst = []
            if (!list) { return }
            list.forEach((element) => {
                // element.checkbox = (element.fieldCategory == 2);//是否启用
                if (element.fieldGroup !== 0) { // 判断是否是一个组
                    let isHave = false
                    let thisGroup = ''
                    groupFirst.forEach((item) => { // 判断这个组是否出现过，出现则在groupFirst里做个标记
                        if (item == element.fieldGroup) {
                            isHave = true
                            thisGroup = item // 记住这个组id
                        }
                    })
                    if (!isHave) { // 如果没有出现过新建一个对象放入newList里面
                        let newObj = {
                            cnFieldCaption: _this.returnGroupName(element.fieldGroup),

                            fieldGroup: element.fieldGroup,
                            group: []
                        }
                        newObj.group.push(element)
                        newLList.push(newObj)
                        groupFirst.push(element.fieldGroup)
                    } else { // 如果出现过就找之前创建的对象将自己放入到group数组中
                        newLList.forEach(function (them) {
                            if (them.fieldGroup == thisGroup) {
                                them.group.push(element)
                            }
                        })
                    }
                } else {
                    if (element.controlTypeId != 0) {
                        element.controlData = ''
                    }
                    newLList.push(element)
                }
            })
            return newLList
        },

        isOpen(moduleNum) {
            this.convertData = []
            this.isShowFiled = true
            this.moduleNum = moduleNum// 当前模块号放上
            this.getData()
        },
        submit() {
            let _this = this
            _this.isShowFiled = false
            // console.log(_this.convertData)
            let rights = []
            this.convertData.forEach(item => {
                if (item.group && item.group.length > 0) {
                    item.group.forEach(item2 => {
                        // 为组则ID为各自ID，显示和编辑为外部编辑
                        rights.push({
                            fieldId: item2.fieldId,
                            showFlag: item.showFlag ? 1 : 0,
                            editState: item.editState
                        })
                    })
                } else {
                    rights.push({
                        fieldId: item.fieldId,
                        showFlag: item.showFlag ? 1 : 0,
                        editState: item.editState
                    })
                }
            })
            // console.log(rights)

            let data = {
                roleId: _this.thisRoleId,
                tabCode: _this.tabCode,
                moduleRights: [
                    {
                        moduleCode: _this.moduleNum,
                        fieldRights: rights
                    }
                ]
            }
            _this.$http.post(_this.Global.baseURL + _this.Global.api.v2.rolesField_do, data).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.$message.success(_this.msg(res.body))
                    _this.$emit('tellFather')
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        }
    },
    components: {
        'loading': Loading

    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.DialogFieldPower {
  // border:1px solid red;
  .tableHead {
    td {
      padding: 8px 5px;
    }
    .editHead > span {
      margin-left: 10px;
    }
  }
  .tableWrap {
    min-height: 300px;
    max-height: 480px;
    overflow: auto;
    table {
      tr {
        th {
          font-weight: normal;
          padding: 8px 5px;
        }
        td {
          padding: 5px;
        }
        &:hover {
          background-color: #f9f9f9;
        }
      }
    }
  }
}
</style>
