<template>
    <div class="mainWrap BizDict">
        <!--业务字典-->
        <page-title :showTitle="false" :title="$t('mxpcweb.systemset.bizdict.1530326922441')" iconfont="icon-biz-field"></page-title>
        <el-tabs v-model="tabDefault" @tab-click="tabClick" class="subTabs-pullRight">
            <el-tab-pane v-for="(item,index) in rootData" :key="index" :label="item.moduleName" :name="'name'+index"></el-tab-pane>
        </el-tabs>

        <ul class="nav">
            <li :class="actionIndex == index ? 'active' : ''" v-for="(item,index) in rootData[tabIndex].dictList" :key="index" @click='menuClick(index)'>{{item.dictName}}</li>
        </ul>

        <div class="navWindow MXscroll">
            <h2 class="navWindowTitle" v-if="rootData[tabIndex].dictList[actionIndex]">
                <span>{{rootData[tabIndex].dictList[actionIndex].dictName}}</span>
                <el-button class="pull-right" type="primary" size="small" @click="btnAdd()">
                    <!-- 添加 -->{{$t('mxpcweb.systemset.bizdict.1530327239042')}}
                </el-button>
            </h2>

            <div class="dragList dragHeader">
                <div>
                    <!-- 排序 -->
                    <span>{{$t('mxpcweb.systemset.bizdict.1530327033547')}}</span>
                    <!-- 名称 -->
                    <span>{{$t('mxpcweb.systemset.bizdict.1530327046560')}}</span>
                    <!--  英文名称-->
                    <span>{{$t('mxpcweb.systemset.bizdict.1530327057426')}}</span>
                    <!--启用  -->
                    <span>{{$t('mxpcweb.systemset.bizdict.1530327070659')}}</span>
                    <!--说明  -->
                    <span>{{$t('mxpcweb.systemset.bizdict.1530327082771')}}</span>
                </div>
            </div>
            <loading v-if="!rootData[tabIndex].dictList[actionIndex]"></loading>
            <loading v-if="!itemList != ''"></loading>
            <div class="dragBody MXscroll">
                <drag-wrap v-if="itemList != ''" v-model="itemList" :options="{group:'group01', handle:'.handle'}" @update="moveEnd">
                    <transition-group class="dragList">
                        <div v-for="(item,index) in itemList" :key="'a'+index">
                            <span>
                                <span class="handle">
                                    <i class="iconfont icon-drag"></i>
                                </span>
                            </span>
                            <span>
                                <span class="editBtn">
                                    {{item.itemName}}
                                    <em v-if="item.valueType != 0" @click="btnModify(item.dictItemCode, item.itemName, item.itemEnName)">
                                        <i class="iconfont icon-edit-round"></i>
                                    </em>
                                </span>
                            </span>
                            <span>{{item.itemEnName}}</span>
                            <span>
                                <el-checkbox v-model="item.inUse" :disabled="item.valueType == 0" @change="isEnable(item.dictItemCode)" style="margin-left:6px;"></el-checkbox>
                            </span>
                            <span>
                                <!-- 系统字典值不许更改 -->
                                <span v-if="item.valueType == 0">{{$t('mxpcweb.systemset.bizdict.1530327104867')}}</span>
                            </span>
                        </div>
                    </transition-group>
                </drag-wrap>
            </div>
        </div>

        <!-- 弹窗 / 添加 -->
        <el-dialog v-dialogDrag :title="dialog.title" :visible.sync="dialog.enable" custom-class="width420" :modal-append-to-body="false" @close="resetForm('dialogForm')">
            <el-form :model="dialog" :rules="dialogRules" ref="dialogForm" label-width="90px">
                <!-- 名称 -->
                <el-form-item :label="$t('mxpcweb.systemset.bizdict.1530327046560')" prop="name">
                    <!--  请输入名称-->
                    <el-input v-model="dialog.name" :placeholder="$t('mxpcweb.systemset.bizdict.1530327168170')"></el-input>
                </el-form-item>
                <!-- 英文名称 -->
                <el-form-item :label="$t('mxpcweb.systemset.bizdict.1530327057426')" prop="nameEn">
                    <!-- 请输入英文名称 -->
                    <el-input v-model="dialog.nameEn" :placeholder="$t('mxpcweb.systemset.bizdict.1530327217818')"></el-input>
                </el-form-item>
                <el-form-item>
                    <!-- 添加 -->
                    <el-button type="primary" v-show="dialog.btnTodo == 'add'" @click="submitAdd('dialogForm')" style="width:200px;">{{$t('mxpcweb.systemset.bizdict.1530327239042')}}</el-button>
                    <i></i>
                    <!--修改  -->
                    <el-button type="primary" v-show="dialog.btnTodo == 'modify'" @click="submitModify('dialogForm')" style="width:200px;">{{$t('mxpcweb.systemset.bizdict.1530327278916')}}</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

    </div>
</template>

<script>
import PageTitle from '@/components/PageTitle/index' // 大标题
import draggable from 'vuedraggable'
import Loading from '@/basecomponents/Loading/index'
export default {
    name: 'BizDict',
    props: {

    },
    data() {
        return {
            dialog: {
                title: '',
                id: '', // item id
                btnTodo: '',
                enable: false, // 弹窗开关
                name: '',
                nameEn: ''
            },
            dialogRules: {
                name: [
                    /* 请输入状态项名称 */
                    { required: true, message: this.$t('mxpcweb.systemset.bizdict.1530327427099'), trigger: 'blur' },
                    /* 长度在 1 到 50 个字符 */
                    { min: 1, max: 50, message: this.$t('mxpcweb.systemset.bizdict.1530327453314'), trigger: 'blur' }
                ],
                nameEn: [
                    /* 请输入状态项英文名称 */
                    { required: true, message: this.$t('mxpcweb.systemset.bizdict.1530327539931'), trigger: 'blur' },
                    /* 长度在 1 到 50 个字符 */
                    { min: 1, max: 50, message: this.$t('mxpcweb.systemset.bizdict.1530327453314'), trigger: 'blur' }
                ]
            },
            tabDefault: 'name0', // tab默认高亮项
            actionIndex: 0, // 左菜单
            tabIndex: 0, // tab
            rootData: [
                {
                    dictList: []
                }
            ],
            itemList: [], // 查到的右侧拖拽列表
            itemListBak: [] // 备份
        }
    },
    created() {
        this.getData()// 获取页面数据
    },
    methods: {
        // 启用项是否
        isEnable(id) {
            let _this = this
            let isTrue = event.target.checked
            let data = {
                type: 'inuse',
                inUse: isTrue == true ? 1 : 0,
                dictCode: _this.rootData[_this.tabIndex].dictList[_this.actionIndex].dictCode,
                dictItemCode: id
            }
            // console.log(data);
            _this.$http.post(_this.Global.baseURL + _this.Global.api.SystemSet.bizdict.dictionarysUpdate, data).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    // console.log(isTrue);
                    /* '已启用' : '已禁用'  */
                    _this.$message.success(isTrue == true ? this.$t('mxpcweb.systemset.bizdict.1530327647875') : this.$t('mxpcweb.systemset.bizdict.1530327676250'))
                    // _this.getData();//获取页面数据
                    ep.emit('storeInit')// 更新 store 数据
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        // 修改按钮点击
        btnModify(thisId, name, nameEn) {
            let _this = this
            _this.dialog = {
                title: this.$t('mxpcweb.systemset.bizdict.1530327715370', [_this.rootData[_this.tabIndex].dictList[_this.actionIndex].dictName]),
                btnTodo: 'modify',
                enable: true,
                name: name,
                nameEn: nameEn,
                id: thisId
            }
            // console.log(_this.dialog);
        },
        // 提交修改
        submitModify(formName) {
            let _this = this
            _this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = {
                        type: 'name',
                        itemName: _this.dialog.name,
                        itemEnName: _this.dialog.nameEn,
                        dictCode: _this.rootData[_this.tabIndex].dictList[_this.actionIndex].dictCode,
                        dictItemCode: _this.dialog.id
                    }
                    // console.log(data);
                    _this.$http.post(_this.Global.baseURL + _this.Global.api.SystemSet.bizdict.dictionarysUpdate, data).then(function (res) {
                        if (res.body.code.toString() == _this.Global.RES_OK) {
                            /* 修改成功 */
                            _this.$message.success(this.$t('mxpcweb.systemset.bizdict.1530327764098'))
                            _this.dialog.enable = false
                            _this.getData()// 获取页面数据
                            ep.emit('storeInit')// 更新 store 数据
                        } else {
                            _this.$message.error(_this.msg(res.body))
                        }
                    }, function (res) {
                        _this.$message.error(_this.$t(_this.Global.errorTitle))
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        // 添加按钮点击
        btnAdd() {
            let _this = this
            _this.dialog = {
                /* 添加 */
                title: this.$t('mxpcweb.systemset.bizdict.1530328026401', [_this.rootData[_this.tabIndex].dictList[_this.actionIndex].dictName]),
                btnTodo: 'add',
                enable: true
            }
            // console.log(_this.dialog);
        },
        // 提交添加
        submitAdd(formName) {
            let _this = this
            _this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = {
                        itemName: _this.dialog.name,
                        itemEnName: _this.dialog.nameEn,
                        dictCode: _this.rootData[_this.tabIndex].dictList[_this.actionIndex].dictCode
                    }
                    // console.log(data);
                    _this.$http.post(_this.Global.baseURL + _this.Global.api.SystemSet.bizdict.dictionarysAdd, data).then(function (res) {
                        if (res.body.code.toString() == _this.Global.RES_OK) {
                            /* 添加成功 */
                            _this.$message.success(this.$t('mxpcweb.systemset.bizdict.1530328077452'))
                            _this.dialog.enable = false
                            _this.getData()// 获取页面数据
                            ep.emit('storeInit')// 更新 store 数据
                        } else {
                            _this.$message.error(_this.msg(res.body))
                        }
                    }, function (res) {
                        _this.$message.error(_this.$t(_this.Global.errorTitle))
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        // 获取页面数据
        getData() {
            let _this = this
            _this.$http.get(this.Global.baseURL + this.Global.api.SystemSet.bizdict.dictNavigatorGet, { params: {} }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK && res.body.data) {
                    _this.rootData = res.body.data
                    let dictCode = _this.rootData[_this.tabIndex].dictList[_this.actionIndex].dictCode// 当前菜单（字典项）id
                    _this.$http.get(this.Global.baseURL + this.Global.api.SystemSet.bizdict.dictionarysQuery, { params: { dictCode: dictCode } }).then(function (res) {
                        if (res.body.code.toString() == _this.Global.RES_OK && Object.prototype.toString.call(res.body.data) == '[object Array]') {
                            // console.log(res.body.data)
                            let arr = res.body.data
                            arr.forEach(item => {
                                item.inUse = !!item.inUse
                            })
                            _this.itemList = arr
                            _this.itemListBak = Object.assign(arr)// 备件一份，用于排序，防乱序
                        } else {
                            _this.$message.error(_this.msg(res.body))
                        }
                    }, function (res) {
                        _this.$message.error(_this.$t(_this.Global.errorTitle))
                        _this.itemList = ['']
                    })
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        // 点右上角的tab切换
        tabClick(tab, event) {
            let _this = this
            _this.itemList = []// 清空加loading...效果
            _this.tabIndex = tab.index
            _this.actionIndex = 0 // 左菜单必须置0,否则右侧会找不到数据错误
            _this.getData()// 获取页面数据
        },
        // 左菜单切换
        menuClick(index) {
            let _this = this
            _this.itemList = []// 清空加loading...效果
            _this.actionIndex = index
            _this.getData()// 获取页面数据
        },
        // 清空表单
        resetForm(formName) {
            this.$refs[formName].resetFields()
        },
        // 拖拽
        moveEnd(evt) {
            let _this = this
            let data = {
                type: 'sortOrder',
                dictCode: _this.rootData[_this.tabIndex].dictList[_this.actionIndex].dictCode,
                dictItemCode1: _this.itemListBak[evt.oldIndex].dictItemCode,
                dictItemCode2: _this.itemListBak[evt.newIndex].dictItemCode
            }
            _this.$http.post(_this.Global.baseURL + _this.Global.api.SystemSet.bizdict.dictionarysUpdate, data).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    /* 成功排序 */
                    _this.$message.success(this.$t('mxpcweb.systemset.bizdict.1530328109893'))
                    _this.getData()// 获取页面数据
                    ep.emit('storeInit')// 更新 store 数据
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        }
    },
    components: {
        'page-title': PageTitle,
        'drag-wrap': draggable,
        'loading': Loading
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
