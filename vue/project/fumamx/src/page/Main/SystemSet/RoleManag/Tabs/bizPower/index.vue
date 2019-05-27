<template>

    <div class="customerPower MXscroll">
        <loading v-if="ruleForm.modules2.length === 0"></loading>
        <el-form v-else :model="ruleForm" ref="ruleForm">
            <table class="table">
                <caption>{{itemTab.desc}}</caption>
                <tbody v-for="(item,index) in ruleForm.modules2" :key="'a'+index">
                    <tr>
                        <td :colspan="index">
                            <span class="name">{{item.moduleName}}</span>
                        </td>
                    </tr>
                    <tr>
                        <!--<td width="80" style="color:#555;" :rowspan="item.moduleCode == 'BF003' || item.moduleCode == 'BF004' ? 3 : 0">{{item.moduleName}}</td>-->
                        <td>
                            <table class="tableSub">
                                <tr>
                                    <th width="133">
                                        <!-- 范围 -->{{$t('mxpcweb.systemset.rolemanag.1530596213845')}}</th>
                                    <th width="70" v-for="(item2,index2) in item.functions" :key="'b'+index2" class="text-center">{{item2.text}}</th>
                                    <th></th>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="radio_item">
                                            <span>
                                                <!-- 无权限 -->{{$t('mxpcweb.systemset.rolemanag.1530596267150')}}</span>
                                            <span v-if="item.moduleCode != 'DC001'">
                                                <!-- 本人的 -->{{$t('mxpcweb.systemset.rolemanag.1530596627229')}}</span>
                                            <span v-if="item.moduleCode != 'DC001'">
                                                <!-- 本部门内 -->{{$t('mxpcweb.systemset.rolemanag.1530596659132')}}</span>
                                            <span v-if="item.moduleCode != 'DC001'">
                                                <!-- 下级部门 -->{{$t('mxpcweb.systemset.rolemanag.1530596703657')}}

                                            </span>
                                            <span v-if="item.moduleCode != 'DC001'">
                                                <!-- 本部门及下级部门 -->{{$t('mxpcweb.systemset.rolemanag.1530596734349')}}</span>
                                            <span>
                                                <!-- 全部人员 -->{{$t('mxpcweb.systemset.rolemanag.1530596769043')}}</span>
                                            <span v-if="item.moduleCode == 'BF003' || item.moduleCode == 'BF004'" class="deptRadioName">
                                                <!-- 指定部门 -->{{$t('mxpcweb.systemset.rolemanag.1530597475707')}}</span>
                                        </div>
                                    </td>
                                    <td v-for="(item2,index2) in item.functions" :key="'c'+index2" class="text-center">
                                        <el-radio-group v-model="item2.rightValue">
                                            <el-radio label="0"> &nbsp; </el-radio>
                                            <el-radio label="1" v-if="item.moduleCode != 'DC001'"> &nbsp; </el-radio>
                                            <el-radio label="2" v-if="item.moduleCode != 'DC001'"> &nbsp; </el-radio>
                                            <el-radio label="4" v-if="item.moduleCode != 'DC001'"> &nbsp; </el-radio>
                                            <el-radio label="8" v-if="item.moduleCode != 'DC001'"> &nbsp; </el-radio>
                                            <el-radio label="16"> &nbsp; </el-radio>
                                            <div class="deptRadio" v-if="item.moduleCode == 'BF003' || item.moduleCode == 'BF004'">
                                                <el-radio label="32">&nbsp;</el-radio>
                                                <div v-if="item2.rightValue == '32'" @click="$refs.DialogSetDept.isOpen(item2)">
                                                    <el-button type="primary" v-if="item2.specifyDeptName.length === 0">
                                                        <!-- 请选择 -->{{$t('mxpcweb.systemset.rolemanag.1530597502435')}}
                                                    </el-button>
                                                    <el-button type="primary" v-else>
                                                        <!-- 修改 -->{{$t('mxpcweb.systemset.rolemanag.1530595058837')}}
                                                    </el-button>
                                                </div>
                                            </div>
                                        </el-radio-group>
                                    </td>
                                    <td></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <template v-if="item.moduleCode == 'BF003'">
                        <tr>
                            <td>
                                <table class="tableSub">
                                    <tr>
                                        <td width="133">
                                            <!-- 字段权限 -->{{$t('mxpcweb.systemset.rolemanag.1530597680349')}}
                                        </td>
                                        <td style="line-height:25px;">
                                            <el-button :plain="true" type="info" @click="$refs.DialogFieldPower.isOpen(item.moduleCode)" style="padding-left:7px; padding-right:8px;">
                                                <!-- 编辑 -->{{$t('mxpcweb.systemset.rolemanag.1530597618237')}}
                                            </el-button>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </template>
                    <template v-if="item.moduleCode == 'BF004'">
                        <tr>
                            <td>
                                <table class="tableSub">
                                    <tr>
                                        <td width="133">
                                            <!-- 字段条件 -->{{$t('mxpcweb.systemset.rolemanag.1530597557446')}}
                                        </td>
                                        <td style="line-height:25px;">

                                            <template v-for="(item,index) in selectedFields" v-if="item.fieldName != ''">
                                                <span :key="'d'+index" class="text-red">{{item.cnFieldCaption}}</span>
                                                <!-- 为 -->{{$t('mxpcweb.systemset.rolemanag.1530599460283')}}
                                                <span v-for="(item2,index2) in item.dictItemsValues" :key="'e'+index2">
                                                    <span v-for="(item3,index3) in item.downValues" :key="'f'+index3" v-if="item2 == item3.dictItemCode" class="text-yellow">
                                                        {{item3.itemName}}{{item.dictItemsValues.length-1 !== index2 ? '、' : ''}}
                                                    </span>
                                                </span>
                                                <!-- '并且' -->
                                                <span :key="index" style="padding:0 12px;">{{selectedFields.length-2 !== index ? $t('mxpcweb.systemset.rolemanag.1530599508868') : ''}}</span>
                                            </template>

                                            <el-button :plain="true" type="info" style="padding-left:7px; padding-right:8px;" @click="$refs.DialogSetField.isOpen(fieldDada,selectedFields)">
                                                <!-- '请选择': '编辑' -->
                                                {{selectedFields.length === 1 ?$t('mxpcweb.systemset.rolemanag.1530597502435'): $t('mxpcweb.systemset.rolemanag.1530597618237')}}
                                            </el-button>

                                            <el-button :plain="true" type="danger" style="padding-left:7px; padding-right:8px;" @click="delFieldSet" v-if="selectedFields.length !== 1">
                                                <!-- 删除 -->{{$t('mxpcweb.systemset.rolemanag.1530597641740')}}
                                            </el-button>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <table class="tableSub">
                                    <tr>
                                        <td width="133">
                                            <!-- 字段权限 -->{{$t('mxpcweb.systemset.rolemanag.1530597680349')}}
                                        </td>
                                        <td style="line-height:25px;">
                                            <el-button :plain="true" type="info" @click="$refs.DialogFieldPower.isOpen(item.moduleCode)" style="padding-left:7px; padding-right:8px;">
                                                <!-- 编辑 -->{{$t('mxpcweb.systemset.rolemanag.1530597618237')}}
                                            </el-button>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </template>
                    <hr :key="index">
                </tbody>
            </table>

            <el-button type="primary" @click="submit()">
                <!-- 保存设置 -->{{$t('mxpcweb.systemset.rolemanag.1530596084320')}}</el-button>
        </el-form>

        <!-- 选择部门，弹窗 -->
        <dialog-set-dept ref="DialogSetDept" :departmentList="departmentList" :tabCode="itemTab.tabCode" :thisRoleId="thisRoleId" @tellFather="getData"></dialog-set-dept>

        <!-- 字段设置，弹窗 -->
        <dialog-set-field ref="DialogSetField" :downFields="downFields" :tabModuleNum="tabModuleNum" :tabCode="itemTab.tabCode" :thisRoleId="thisRoleId" @tellFather="getData"></dialog-set-field>

        <!-- 字段权限，弹窗 -->
        <dialog-field-power ref="DialogFieldPower" :tabCode="itemTab.tabCode" :thisRoleId="thisRoleId" @tellFather="getData"></dialog-field-power>

    </div>
</template>

<script>
import Loading from '@/basecomponents/Loading/index'
import { isArray } from '@/libs/utils'
import { mapGetters } from 'vuex'
import DialogSetDept from '../../Vue/DialogSetDept/index'
import DialogSetField from '../../Vue/DialogSetField/index'
import DialogFieldPower from '../../Vue/DialogFieldPower/index'

export default {
    name: 'customerPower',
    props: {
        thisRoleId: {
            type: Number
        },
        itemTab: {
            type: Object,
            default: function () {
                return {}
            }
        }
    },
    data() {
        return {
            departmentList: [], // 部门下拉

            downFields: [], // 待选下拉字段
            selectedFields: [], // 已选
            fieldDada: [], // 整合后的待用数据

            tabModuleNum: 'BF004',
            ruleForm: {
                modules2: []
            }
            // 字段权限
            // fieldPowerArr: [],
        }
    },
    created() { },
    mounted() {
        this.getData()
        setTimeout(() => {
            this.getWinHeight()
        }, 200)
        $(window).resize(() => {
            this.getWinHeight()
        })
    },
    computed: {
        ...mapGetters(['sysBoxValue'])
    },
    methods: {
        // 设置固定高
        getWinHeight() {
            let height = document.documentElement.clientHeight - 230
            this.$el.style.height = `${height}px`
        },
        // 获取功能数据
        getData() {
            let _this = this
            _this.getWinHeight()
            // _this.ruleForm.modules2 = '';    //先清空数据，再加载
            // 接口名称: 查询权限项目定义
            var p1 = new Promise((resolve, reject) => {
                _this.$http.get(_this.Global.baseURL + _this.Global.api.SystemSet.rolemanag.permissionsGet, {
                    params: {
                        type: 'item',
                        tabCode: _this.itemTab.tabCode
                    }
                }).then(function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        resolve(res.body.data)
                    } else {
                        _this.$message.error(_this.msg(res.body))
                    }
                }, function (res) {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            })
            // 接口名称: 查询权限分配
            var p2 = new Promise((resolve, reject) => {
                _this.$http.get(_this.Global.baseURL + _this.Global.api.SystemSet.rolemanag.permissionsGet, {
                    params: {
                        roleId: _this.thisRoleId,
                        type: 'right',
                        tabCode: _this.itemTab.tabCode
                    }
                }).then(function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        resolve(res.body.data)
                    } else {
                        _this.$message.error(_this.msg(res.body))
                    }
                }, function (res) {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            })
            // 接口名称: 获取业务字段展示 --- 2018.04.12 新增：字段条件 ---
            var p3 = new Promise((resolve, reject) => {
                let data = {
                    moduleCode: _this.tabModuleNum,
                    type: 'conditionSet'
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
            // 接口名称: 权限字段限制查询 --- 2018.04.12 新增：字段条件 ---
            var p4 = new Promise((resolve, reject) => {
                let data = {
                    moduleCode: _this.tabModuleNum,
                    type: 'limitQuery',
                    roleId: _this.thisRoleId,
                    tabCode: _this.itemTab.tabCode
                }
                _this.$http.post(_this.Global.baseURL + _this.Global.api.v2.permissions_do, data).then(function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        resolve(res.body.data)
                    } else {
                        _this.$message.error(_this.msg(res.body))
                    }
                }, function (res) {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            })
            // 接口名称: 获取部门信息
            var p5 = new Promise((resolve, reject) => {
                _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.department + '0').then(function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        resolve(res.body.data)
                    } else {
                        _this.$message.error(_this.msg(res.body))
                    }
                }, function (res) {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            })
            // 接口名称: 获取业务字段展示
            // var p6 = new Promise((resolve, reject) => {
            //     let data = {
            //         moduleCode: _this.tabModuleNum,
            //         type: 'showRight'
            //     }
            //     _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.fieldShow_get, { params: data }).then(function(res) {
            //         if (res.body.code.toString() == _this.Global.RES_OK) {
            //             resolve(res.body.data);
            //         } else {
            //             _this.$message.error(_this.msg(res.body));
            //         }
            //     }, function(res) {
            //         _this.$message.error(_this.$t(_this.Global.errorTitle));
            //     });
            // });
            // //接口名称: 获取字段权限配置
            // var p7 = new Promise((resolve, reject) => {
            //     let data = {
            //         roleId: _this.thisRoleId,
            //         tabCode: _this.itemTab.tabCode,
            //         type: 'fieldRights'
            //     }
            //     _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.rolesField_do, { params: data }).then(function(res) {
            //         if (res.body.code.toString() == _this.Global.RES_OK) {
            //             resolve(res.body.data);
            //         } else {
            //             _this.$message.error(_this.msg(res.body));
            //         }
            //     }, function(res) {
            //         _this.$message.error(_this.$t(_this.Global.errorTitle));
            //     });
            // });
            Promise.all([p1, p2, p3, p4, p5]).then(function (results) {
                // http://www.xiaoyaoji.cn/doc/1Tmks22sLj
                // http://www.xiaoyaoji.cn/doc/7vH5yZYVL
                // http://www.xiaoyaoji.cn/doc/8HJZkisaH
                // console.log(" ++++++++++++++++++++++ ")
                // console.log(results)
                // console.log(" ++++++++++++++++++++++ ")
                if (!isArray(results[0]) || !isArray(results[1])) {
                    return
                }
                // 先合并（按功能），再分解
                results[0].forEach((element1) => {
                    results[1].forEach((element2) => {
                        if (element1.funCode == element2.funCode) {
                            Object.assign(element1, element2)
                        }
                    })
                })
                // console.log(results[0])

                let arrPart2 = results[0]
                // console.log(arrPart2)

                // 按模块号分组
                let arrPart2Sub1 = []
                arrPart2.forEach(function (item) {
                    if (arrPart2Sub1.indexOf(item.moduleName) == -1) {
                        arrPart2Sub1.push(item.moduleName)
                    }
                })
                // console.log(arrPart2Sub1)

                // 按模块号，重组对应配置项
                let arrPart2Sub2 = []
                _this.departmentList = results[4]// 部门
                arrPart2Sub1.forEach(function (item) {
                    let arrP2Sub2_2 = []
                    let moduleId
                    arrPart2.forEach(function (item2) {
                        if (item2.moduleName == item) {
                            moduleId = item2.moduleCode
                            // 部门处理
                            let departmentArr = (item2.specifyDept && item2.specifyDept !== '') ? item2.specifyDept.split(',') : []
                            let departmentName = []
                            // console.log(departmentArr)
                            departmentArr.forEach((item3) => {
                                results[4].forEach((item4) => {
                                    if (item3 == item4.dkey) {
                                        departmentName.push(item4.deptName)
                                    }
                                })
                            })
                            arrP2Sub2_2.push({
                                text: item2.funName, // 表头展示用
                                funCode: item2.funCode,
                                rightValue: item2.rightValue != undefined ? item2.rightValue.toString() : '0',
                                // 部门限制（当rightValue为32必传）（部门信息dKey,逗号分割）。【转成数组】
                                // specifyDept: item2.specifyDept !== '' ? item2.specifyDept.split(',') : []
                                specifyDept: departmentArr,
                                specifyDeptName: departmentName
                            })
                        }
                    })
                    arrPart2Sub2.push({
                        moduleName: item,
                        moduleCode: moduleId,
                        functions: arrP2Sub2_2
                    })
                })
                _this.ruleForm.modules2 = arrPart2Sub2
                // console.log(arrPart2Sub2)

                /*********************************************
                         * 客户字段条件数据处理
                        *********************************************/
                // 先所有数据整合到一起，后面用到，展示也用到
                _this.sysBoxValue.forEach((item) => {
                    results[2].forEach((item2) => {
                        // 匹配对应的项，把下拉值放进去
                        if (item.dictCode == item2.dictCode) {
                            item2.dictItems = item.dictItems// 对应的下拉项放进去
                            // 匹配选中哪些值，非空值判断
                            if (results[3].fieldLimit && results[3].fieldLimit.length > 0) {
                                results[3].fieldLimit.forEach((item3) => {
                                    if (item3.fieldName == item2.fieldName) {
                                        item2.dictItemsValues = item3.dictItemCode.split(',')// 转成数组匹配后，值放上
                                    }
                                })
                            } else {
                                item2.dictItemsValues = []// 没有则为空
                            }
                        }
                    })
                })
                _this.fieldDada = results[2]

                // 待选值
                _this.downFields = results[2]

                /**
                         * 有已选值，则放进来，空的，则仅给一个让用户选
                        */
                // 有已选值
                if (results[3].fieldLimit && results[3].fieldLimit.length > 0) {
                    results[3].fieldLimit.forEach((item3) => {
                        item3.dictItemsValues = item3.dictItemCode.split(',')// 转成数组匹配后，值放上
                        _this.fieldDada.forEach((item4) => {
                            if (item3.fieldName == item4.fieldName) {
                                item3.downValues = item4.dictItems
                                item3.cnFieldCaption = item4.cnFieldCaption
                            }
                        })
                    })
                    _this.selectedFields = results[3].fieldLimit// 下拉备选字段
                } else {
                    // 没有则置空
                    _this.selectedFields = []
                }
                // 没有选值
                _this.selectedFields.push({
                    fieldName: '',
                    dictItemsValues: [],
                    downValues: []
                })
                // console.log(_this.selectedFields)

                // http://www.xiaoyaoji.cn/doc/1Tmks22sLj
                // http://www.xiaoyaoji.cn/doc/DoUPIJDLk
                // http://www.xiaoyaoji.cn/doc/DMko1q4sO
                /**
                         * 字段权限数据处理
                        */
                // 先过滤出 客户相关权限值
                // let fieldRightsCust = results[6].moduleRights.filter(item => {
                //     return item.moduleCode == 'BF004';
                // });
                // // console.log(fieldRightsCust)
                // let fieldP = results[5].concat();
                // fieldP.forEach(item => {
                //     //默认定个权限
                //     item.showFlag = true;
                //     item.editState = 1;
                //     if (fieldRightsCust.length > 0 && fieldRightsCust[0].fieldRights) {
                //         fieldRightsCust[0].fieldRights.forEach(item2 => {
                //             if (item2.fieldId == item.fieldId) {
                //                 item.showFlag = item2.showFlag == 1 ? true : false;//有值就覆盖上
                //                 item.editState = item2.editState;//有值就覆盖上
                //             }
                //         });
                //     }
                // });
                // // console.log(fieldP)
                // _this.fieldPowerArr = fieldP;
            })
        },
        delFieldSet() {
            /* '将删除字段条件权限, 是否继续?' */
            let c = this.$t('mxpcweb.systemset.rolemanag.1530597002221')
            /* '提示' */
            let t = this.$t('mxpcweb.systemset.rolemanag.1530595863629')
            /* '确定' */
            let s = this.$t('mxpcweb.systemset.rolemanag.1530595915980')
            /* '取消' */
            let n = this.$t('mxpcweb.systemset.rolemanag.1530595955452')
            this.$confirm(c, t, {
                confirmButtonText: s,
                cancelButtonText: n,
                type: 'warning'
            }).then(() => {
                this.$refs.DialogSetField.submitFiled(true)
            }).catch(() => { })
        },
        // Tab页面总提交
        submit() {
            let _this = this
            let arrDataValue = []
            let isSubmit = true
            _this.ruleForm.modules2.forEach(function (item) {
                item.functions.forEach(function (item2) {
                    /**
                               * 指定部门特殊，rightValue 为 32
                               * 部门在弹窗里提交了，这里过滤掉，并给空值提醒
                               * */
                    if (item2.rightValue == '32') {
                        if (item2.specifyDept.length === 0) {
                            isSubmit = false
                        }
                    } else {
                        arrDataValue.push(item2)
                    }
                })
            })
            let data = {
                codeValue: arrDataValue,
                roleId: _this.thisRoleId,
                tabCode: _this.itemTab.tabCode
            }
            if (!isSubmit) {
                /* '指定部门项请选择部门！' */
                this.$message(this.$t('mxpcweb.systemset.rolemanag.1530597065963'))
                return
            }
            _this.$http.post(_this.Global.baseURL + _this.Global.api.SystemSet.rolemanag.permissionsPut, data).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    /* 保存成功 */
                    _this.$message.success(this.$t('mxpcweb.systemset.rolemanag.1530596143028'))
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        }
    },
    watch: {
        thisRoleId(curVal, oldVal) {
            this.getData()
        }
    },
    components: {
        'loading': Loading,
        'dialog-set-dept': DialogSetDept,
        'dialog-set-field': DialogSetField,
        'dialog-field-power': DialogFieldPower
    }
}
</script>
