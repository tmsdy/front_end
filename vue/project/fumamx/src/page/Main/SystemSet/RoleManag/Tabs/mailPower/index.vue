<template>
    <div class="mailPower MXscroll">
        <loading v-if="!ruleForm.modules2.length > 0"></loading>
        <template v-else>
            <el-form :model="ruleForm" ref="ruleForm">

                <table class="table">
                    <caption>
                        <!-- 设置角色对邮件的操作权限和数据操作范围 -->{{$t('mxpcweb.systemset.rolemanag.1530597909851')}}
                    </caption>
                    <tbody>
                        <div v-for="(item,index) in ruleForm.modules2" :key="index">
                            <tr>
                                <td :colspan="index">
                                    <span class="name">{{item.moduleName}}</span>
                                </td>
                            </tr>
                            <tr>
                                <!--<td width="80" style="color:#555;">{{item.moduleName}}</td>-->
                                <td>
                                    <table class="tableSub">
                                        <tr>
                                            <th width="133">
                                                <!-- 范围 -->{{$t('mxpcweb.systemset.rolemanag.1530596213845')}}</th>
                                            <th width="70" v-for="(item2,index2) in item.functions" :key="index2" v-if="item2.funType == 2" class="text-center">{{item2.text}}</th>
                                            <th></th>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div class="radio_item">
                                                    <span>
                                                        <!-- 无权限 -->{{$t('mxpcweb.systemset.rolemanag.1530596267150')}}</span>
                                                    <span>
                                                        <!-- 本人的 -->{{$t('mxpcweb.systemset.rolemanag.1530596627229')}}</span>
                                                    <span>
                                                        <!-- 本部门内 -->{{$t('mxpcweb.systemset.rolemanag.1530596659132')}}</span>
                                                    <span>
                                                        <!-- 下级部门 -->{{$t('mxpcweb.systemset.rolemanag.1530596703657')}}</span>
                                                    <span>
                                                        <!-- 本部门及下级部门 -->{{$t('mxpcweb.systemset.rolemanag.1530596734349')}}</span>
                                                    <span>
                                                        <!-- 全部人员 -->{{$t('mxpcweb.systemset.rolemanag.1530596769043')}}</span>
                                                </div>
                                            </td>
                                            <td v-for="(item2,index2) in item.functions" :key="index2" v-if="item2.funType == 2" class="text-center">
                                                <el-radio-group v-model="item2.rightValue">
                                                    <el-radio label="0">&nbsp;</el-radio>
                                                    <el-radio label="1">&nbsp;</el-radio>
                                                    <el-radio label="2">&nbsp;</el-radio>
                                                    <el-radio label="4">&nbsp;</el-radio>
                                                    <el-radio label="8">&nbsp;</el-radio>
                                                    <el-radio label="16">&nbsp;</el-radio>
                                                </el-radio-group>
                                            </td>
                                            <td></td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <hr :key="index">
                        </div>
                    </tbody>
                </table>

            </el-form>

            <el-form :model="ruleForm" ref="ruleForm" class="mailManager">
                <div></div>
                <dl>
                    <dt>
                        <!-- 邮件管理 -->{{$t('mxpcweb.systemset.rolemanag.1530597950777')}}
                    </dt>
                    <!-- 找出特定的项 -->
                    <template v-for="(item) in ruleForm.modules2" v-if="item.moduleCode == 'EM001'">
                        <div v-for="(item2,index2) in item.functions" v-if="item2.funType == 6" :key="index2">
                            <dd>
                                <el-checkbox v-model="item2.rightValue">
                                    {{item2.text.split('&')[0]}}
                                </el-checkbox>
                                <template v-if="item2.funCode == 'E00022'">
                                    <!-- 请选择 -->
                                    <el-select :disabled="!item2.rightValue" v-model="item2.setValue" size="mini" :placeholder="$t('mxpcweb.systemset.rolemanag.1530597502435')" style="width:160px;margin-left:5px;">
                                        <!-- 允许 -->
                                        <el-option value="1" :label="$t('mxpcweb.systemset.rolemanag.1530598093890')"></el-option>
                                        <!-- 允许但需要提示 -->
                                        <el-option value="2" :label="$t('mxpcweb.systemset.rolemanag.1530598107036')"></el-option>
                                    </el-select>
                                    <span class="text-red" v-if="item2.rightValue == 1 && item2.setValue == ''">*</span>
                                </template>

                                <template v-if="item2.funCode == 'E00023'">
                                    <!-- 请选择 -->
                                    <el-select :disabled="!item2.rightValue" v-model="item2.setValue" size="mini" :placeholder="$t('mxpcweb.systemset.rolemanag.1530597502435')" style="width:160px;margin-left:5px;">
                                        <!-- 仅限本人客户 -->
                                        <el-option value="1" :label="$t('mxpcweb.systemset.rolemanag.1530598256908')"></el-option>
                                        <!-- 本人客户及本人掉入公海的客户 -->
                                        <el-option value="2" :label="$t('mxpcweb.systemset.rolemanag.1530598271116')"></el-option>
                                        <!-- 本人客户及公海客户 -->
                                        <el-option value="3" :label="$t('mxpcweb.systemset.rolemanag.1530598298884')"></el-option>
                                        <!-- 所有建档客户 -->
                                        <el-option value="4" :label="$t('mxpcweb.systemset.rolemanag.1530598311379')"></el-option>
                                    </el-select>
                                    <span class="text-red" v-if="item2.rightValue == 1 && item2.setValue == ''">*</span>
                                </template>

                                <span v-if="item2.funCode == 'E00026'" style="color:#222;">
                                    <!-- 请输入 -->
                                    <el-input v-model="item2.setValue" :disabled="!item2.rightValue" size="mini" :placeholder="$t('mxpcweb.systemset.rolemanag.1530598359126')" style="width:66px;margin-left:5px;"></el-input>
                                    <span class="text-red" v-if="item2.rightValue == 1 && item2.setValue == ''">*</span>
                                    {{item2.text.split('&')[1]}}
                                </span>

                                <span v-if="item2.funCode == 'E00027'">
                                    <!-- 请输入 -->
                                    <el-input v-model="item2.setValue" :disabled="!item2.rightValue" size="mini" :placeholder="$t('mxpcweb.systemset.rolemanag.1530598359126')" style="width:333px;margin-left:5px;"></el-input>
                                    <span class="text-red" v-if="item2.rightValue == 1 && item2.setValue == ''">*</span>
                                    {{item2.text.split('&')[1]}}
                                </span>

                                <span v-if="item2.funCode == 'E00028'">
                                    <!-- 请输入 -->
                                    <el-input v-model="item2.setValue" :disabled="!item2.rightValue" size="mini" :placeholder="$t('mxpcweb.systemset.rolemanag.1530598359126')" style="width:333px;margin-left:5px;"></el-input>
                                    <span class="text-red" v-if="item2.rightValue == 1 && item2.setValue == ''">*</span>
                                    {{item2.text.split('&')[1]}}
                                </span>

                            </dd>

                            <dt :key="index2" v-if="item2.funCode == 'E00021'">
                                <!-- 邮件发送 -->{{$t('mxpcweb.systemset.rolemanag.1530598389116')}}
                            </dt>
                            <div :key="index2" v-if="item2.funCode == 'E00028'" style="color:#f60;padding-left:158px;font-size:12px;margin-top:-1px;">{{item2.text.split('&')[2]}}</div>

                        </div>
                    </template>
                </dl>
            </el-form>

            <el-button type="primary" @click="submit()">
                <!-- 保存设置 -->{{$t('mxpcweb.systemset.rolemanag.1530596084320')}}</el-button>
        </template>
    </div>
</template>

<script>
import Loading from '@/basecomponents/Loading/index'
import { isArray, isBoolean } from '@/libs/utils'
export default {
    name: 'mailPower',
    props: {
        thisRoleId: {
            type: Number
        }
    },
    data() {
        return {
            tabCode: 'T06',
            ruleForm: {
                noViewField: {},
                modules2: []
            }
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
                _this.$http.get(_this.Global.baseURL + _this.Global.api.SystemSet.rolemanag.permissionsGet, { params: { type: 'item', tabCode: _this.tabCode } }).then(function (res) {
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
                _this.$http.get(_this.Global.baseURL + _this.Global.api.SystemSet.rolemanag.permissionsGet, { params: { roleId: _this.thisRoleId, type: 'right', tabCode: _this.tabCode } }).then(function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        resolve(res.body.data)
                    } else {
                        _this.$message.error(_this.msg(res.body))
                    }
                }, function (res) {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            })
            Promise.all([p1, p2]).then(function (results) {
                // console.log(' >>>>>>>>>>>>>> ')
                // console.log(results)
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

                let arrPart2Sub2 = []
                arrPart2Sub1.forEach(function (item) {
                    let arrP2Sub2_2 = []
                    let moduleId
                    arrPart2.forEach(function (item2) {
                        if (item2.moduleName == item) {
                            moduleId = item2.moduleCode
                            arrP2Sub2_2.push({
                                text: item2.funName,
                                funCode: item2.funCode,
                                funType: item2.funType,
                                setValue: item2.setValue,
                                rightValue: item2.rightValue != undefined ? item2.rightValue.toString() : '0'
                            })
                        }
                    })
                    arrPart2Sub2.push({
                        moduleName: item,
                        moduleCode: moduleId,
                        functions: arrP2Sub2_2
                    })
                })

                // 为 checked 转换值类型
                arrPart2Sub2.forEach(item => {
                    if (item.moduleCode == 'EM001') {
                        item.functions.forEach(item2 => {
                            if (item2.funType == 6) {
                                item2.rightValue = !!parseInt(item2.rightValue)
                            }
                        })
                    }
                })

                _this.ruleForm.modules2 = arrPart2Sub2
                // console.log(arrPart2Sub2)
            })
        },
        // 提交
        async submit() {
            let _this = this
            // console.log(this.ruleForm.modules2)
            /**
                   * table 2 的所选值转换
                  */
            let arrDataValue2 = []
            // let rootArr = [].concat(_this.ruleForm.modules2);
            var rootArr = [].concat(JSON.parse(JSON.stringify(_this.ruleForm.modules2)))// 拷贝数组,注意这行的深拷贝方法
            rootArr.forEach(function (item) {
                item.functions.forEach(function (itemSon) {
                    arrDataValue2.push(itemSon)
                    if (isBoolean(itemSon.rightValue)) {
                        itemSon.rightValue = itemSon.rightValue ? '1' : '0'
                    }
                })
            })
            // console.log(arrDataValue2)

            // 必填空值判断提示，forEach 跳出循环
            try {
                arrDataValue2.forEach(item => {
                    let codeArr = ['E00022', 'E00023', 'E00026', 'E00027', 'E00028']
                    codeArr.forEach(item2 => {
                        if (item.funCode == item2 && item.rightValue == '1' && item.setValue == '') {
                            _this.$message(this.$t('mxpcweb.systemset.rolemanag.1530598525725', [item.text.split('&')[0]]))

                            foreach.break = new Error('StopIteration')
                        }
                    })
                })
            } catch (e) {
                if (e.message === 'foreach is not defined') {
                    return
                } else throw e
            }

            // 邮件暗送要检测
            let checkAddress
            arrDataValue2.forEach(item => {
                if (item.funCode == 'E00028' && item.rightValue == '1' && item.setValue != '') {
                    checkAddress = item.setValue
                }
            })
            // console.log(checkAddress);
            // 有值时同步检查
            if (checkAddress) {
                if (!await _this.isCheckAddress(checkAddress)) {
                    return
                }
            }
            // console.log(" 666 ");

            let data = {
                codeValue: arrDataValue2,
                roleId: _this.thisRoleId,
                tabCode: _this.tabCode
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
        },
        // 检查
        isCheckAddress(mail) {
            let _this = this
            return new Promise((resolve, reject) => {
                _this.$http.post(_this.Global.baseURL + _this.Global.api.v2.mails_accounts, { addressStr: mail }).then(function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        resolve(true)
                    } else {
                        _this.$message.error(_this.msg(res.body))
                        resolve(false)
                    }
                }, function (res) {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            })
        }
    },
    watch: {
        thisRoleId(curVal, oldVal) {
            this.getData()
        }
    },
    components: {
        'loading': Loading
    }
}
</script>
