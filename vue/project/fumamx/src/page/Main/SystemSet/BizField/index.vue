<template>
    <div class="mainWrap BizField">
        <!-- 业务字段 -->
        <page-title :showTitle="false" :title="$t('mxpcweb.systemset.bizfield.1530328175146')" iconfont="icon-field"></page-title>
        <el-tabs v-model="tabDefault" @tab-click="tabClick" class="subTabs-pullRight">
            <el-tab-pane v-for="(item,index) in rootData" :key="index" :label="item.moduleName" :name="'name'+index"></el-tab-pane>
        </el-tabs>

        <ul class="nav">
            <li :class="actionIndex == index ? 'active' : ''" v-for="(item,index) in rootData[tabIndex].moduleStrucs" :key="index" @click='menuClick(index)'>{{item.cnStrucName}}</li>
        </ul>

        <div class="navWindow">
            <h2 class="navWindowTitle" v-if="rootData[tabIndex].moduleStrucs[actionIndex]">
                <span>{{rootData[tabIndex].moduleStrucs[actionIndex].cnStrucName}}</span>
                <!-- 新增字段 -->
                <el-button class="pull-right" type="primary" size="small" @click="$refs.dialogAddField.addField()">{{$t('mxpcweb.systemset.bizfield.1530328248412')}}</el-button>
            </h2>

            <div class="dragList dragHeader" ref="dragHeader">
                <div>
                    <!-- 排序 -->
                    <span>{{$t('mxpcweb.systemset.bizfield.1530328282582')}}</span>
                    <!-- 字段名称 -->
                    <span>{{$t('mxpcweb.systemset.bizfield.1530328379660')}}</span>
                    <!-- 英文名称 -->
                    <span>{{$t('mxpcweb.systemset.bizfield.1530328407834')}}</span>
                    <!-- 类型 -->
                    <span>{{$t('mxpcweb.systemset.bizfield.1530328447594')}}</span>
                    <!-- 启用 -->
                    <span>{{$t('mxpcweb.systemset.bizfield.1530328459139')}}</span>
                    <!-- 必填 -->
                    <span>{{$t('mxpcweb.systemset.bizfield.1530328470247')}}</span>
                    <!-- 说明 -->
                    <span>{{$t('mxpcweb.systemset.bizfield.1530328481883')}}</span>
                </div>
            </div>
            <loading v-if="!rootData[tabIndex].moduleStrucs[actionIndex]"></loading>
            <loading v-if="!itemArray != ''"></loading>

            <div class="dragBody MXscroll">
                <!-- 没有查到相关数据 -->
                <no-data v-if='isNoData' :title="$t('mxpcweb.systemset.bizfield.1530329061803')" class="marginTop15"></no-data>

                <drag-wrap v-if="itemArray != ''" v-model="itemArray" :options="{group:'group01', handle:'.handle'}" @end="moveEnd">
                    <transition-group class="dragList">
                        <template v-for="(item,index) in itemArray">
                            <template v-if="!item.fieldGroup">
                                <div :key="index" v-if="item.fieldCategory==4 " style="background-color:#f7f8f9;color:#909399;font-size:14px;">
                                    <span>
                                        <span class="editBtn">
                                            {{item.cnFieldCaption}}
                                            <em v-if="item.fieldCategory!=1" @click="$refs.dialogAddField.modifyField(item.fieldId,item.controlTypeId,item.cnFieldCaption,item.enFieldCaption,item.cnFieldHint,item.enFieldHint,item.autoIdFormat,item.fieldType)">
                                                <i class="iconfont icon-edit-round"></i>
                                            </em>
                                        </span>
                                    </span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                                <div :key="index" v-else>
                                    <span>
                                        <span :class="itemArray.length>1 ? 'handle' : 'handleDisabled'">
                                            <i class="iconfont icon-drag"></i>
                                        </span>
                                    </span>
                                    <span>
                                        <span class="editBtn">
                                            {{item.cnFieldCaption}}
                                            <em v-if="item.fieldCategory!=1" @click="$refs.dialogAddField.modifyField(item.fieldId,item.controlTypeId,item.cnFieldCaption,item.enFieldCaption,item.cnFieldHint,item.enFieldHint,item.autoIdFormat,item.fieldType)">
                                                <i class="iconfont icon-edit-round"></i>
                                            </em>
                                        </span>
                                    </span>
                                    <span>{{item.enFieldCaption}}</span>
                                    <span>{{item.fieldType}}</span>
                                    <span>
                                        <el-checkbox v-model="item.inUse" @change="isEnable(item.fieldId)" :disabled="item.fieldCategory==1" style="margin-left:8px;"></el-checkbox>
                                    </span>
                                    <span>
                                        <el-checkbox v-model="item.isNotNull" @change="isNotNull(item.fieldId)" :disabled="item.fieldCategory==1" style="margin-left:10px;"></el-checkbox>
                                    </span>
                                    <span>
                                        <!-- 系统字段不许更改 -->
                                        <span v-if="item.fieldCategory==1" style="margin-left:6px;">{{$t('mxpcweb.systemset.bizfield.1530329093515')}}</span>
                                    </span>
                                </div>
                            </template>

                            <template v-else>
                                <div :key="index">
                                    <span :style="dragGroupHeight(item.group.length)">
                                        <table class="dragGroup">
                                            <tr v-for="(item2,index2) in item.group" :key="index2">
                                                <td>
                                                    <span class="handle" v-if="index2 == 0">
                                                        <i class="iconfont icon-drag"></i>
                                                    </span>
                                                </td>
                                                <td>
                                                    <span class="editBtn">
                                                        {{item2.cnFieldCaption}}
                                                        <em v-if="item.fieldCategory!=1" @click="$refs.dialogAddField.modifyField(item2.fieldId,item2.controlTypeId,item2.cnFieldCaption,item2.enFieldCaption,item2.cnFieldHint,item.enFieldHint,item2.autoIdFormat,item2.fieldType)">
                                                            <i class="iconfont icon-edit-round"></i>
                                                        </em>
                                                    </span>
                                                </td>
                                                <td>{{item2.enFieldCaption}}</td>
                                                <td>{{item2.fieldType}}</td>
                                                <td>
                                                    <el-checkbox v-model="item2.inUse" @change="isEnable(item2.fieldId)" :disabled="setDisabledGroup(item2, index2, item.group)" style="margin-left:8px;"></el-checkbox>
                                                </td>
                                                <td>
                                                    <el-checkbox v-model="item2.isNotNull" @change="isNotNull(item2.fieldId)" :disabled="item2.fieldCategory==1" style="margin-left:10px;"></el-checkbox>
                                                </td>
                                                <td>
                                                    <!-- 系统字段不许更改 -->
                                                    <span v-if="item2.fieldCategory==1" style="margin-left:6px;">{{$t('mxpcweb.systemset.bizfield.1530329093515')}}</span>
                                                </td>
                                            </tr>
                                        </table>
                                    </span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </template>
                        </template>
                    </transition-group>
                </drag-wrap>
            </div>
        </div>

        <dialog-add-field ref="dialogAddField" @reGetData="getData" :moduleCode="rootData[tabIndex].moduleCode" :strucId="rootData[tabIndex].moduleStrucs[actionIndex].strucId"></dialog-add-field>

    </div>
</template>

<script>
/**
 * 描述：系统设置=>业务字段配置
 * 作者：向士健
 * 时间：2017/11/30
 */
import { isArray } from '@/libs/utils.js'
import PageTitle from '@/components/PageTitle/index' // 大标题
import draggable from 'vuedraggable'
import Loading from '@/basecomponents/Loading/index'
import NoData from '@/basecomponents/NoData/index'
import dialogAddField from './dialogAddField/index'// 弹窗
export default {
    name: 'bizfield',
    props: {

    },
    data() {
        return {
            isNoData: false,

            tabDefault: 'name0', // tab默认高亮项
            tabIndex: 0, // tab,以0开始
            actionIndex: 0, // 左菜单
            rootData: [
                {
                    moduleStrucs: [
                        {
                            strucId: 0
                        }
                    ]
                }
            ],
            itemArray: [], // 右侧拖拽列表
            itemArrayBak: [] // 右侧拖拽列表
        }
    },
    mounted() {
        this.getData()// 获取页面数据
        // setTimeout(() => {
        //   this.getWinHeight()
        // }, 200)
        $(window).resize(() => {
            this.getWinHeight()
        })
    },
    methods: {
        // 针对组做规则，比如国家地址
        setDisabledGroup(item, index, group) {
            // 系统字段首先禁用
            if (item.fieldCategory != 1) {
                // 取得 group 里 为 false 的 length
                let arr = []
                group.forEach(function (item) {
                    if (item.inUse == false) {
                        arr.push('flag')
                    }
                })
                // 为最后2项特殊设置:
                if (item.inUse == true && index == group.length - (arr.length + 1)) {
                    return false // 开启
                } else if (item.inUse == false && index == group.length - (arr.length)) {
                    return false // 开启
                } else {
                    return true // 禁用
                }
            } else {
                return true // 禁用
            }
        },
        // 拖拽组的高度，计算一下
        dragGroupHeight(num) {
            return 'height:' + (36 * num + 5) + 'px'
        },
        getWinHeight() {
            let dragHeaderH = this.$refs.dragHeader.offsetWidth
            setTimeout(function () {
                $('.dragGroup').css('width', dragHeaderH - 5 + 'px')
            }, 20)
        },
        // 获取页面数据
        getData() {
            let _this = this
            _this.isNoData = false
            _this.$http.get(this.Global.baseURL + this.Global.api.SystemSet.bizfield.bizNavigatorGet).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
                    // console.log(res.body.data)
                    _this.rootData = res.body.data
                    let data = {
                        type: 'bizField',
                        moduleCode: _this.rootData[_this.tabIndex].moduleCode,
                        strucId: _this.rootData[_this.tabIndex].moduleStrucs[_this.actionIndex].strucId
                    }
                    // console.log(data);
                    // 获取右侧列表数据
                    _this.$http.get(this.Global.baseURL + this.Global.api.SystemSet.bizfield.bizFieldQuery, { params: data }).then(function (res) {
                        if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
                            // console.log(res.body.data);
                            let arrRoot = res.body.data

                            arrRoot.forEach(function (item) {
                                item.inUse = item.inUse == 1
                                item.isNotNull = item.isNotNull == 1
                            })

                            if (_this.ControlsDataConvert(arrRoot).length < 1) {
                                _this.isNoData = true
                            } else {
                                _this.isNoData = false
                                _this.itemArray = _this.ControlsDataConvert(arrRoot)
                                _this.itemArrayBak = Object.assign(_this.ControlsDataConvert(arrRoot))// 备件一份，用于排序，防乱序
                            }
                            _this.getWinHeight()// 再算下拖拽组的宽
                        } else {
                            _this.$message.error(_this.msg(res.body))
                        }
                    }, function (res) {
                        _this.$message.error(_this.$t(_this.Global.errorTitle))
                    })
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        // 启用，是否
        isEnable(id) {
            let _this = this
            let isTrue = event.target.checked
            let data = {
                type: 'isuse',
                strucId: _this.rootData[_this.tabIndex].moduleStrucs[_this.actionIndex].strucId,
                moduleCode: _this.rootData[_this.tabIndex].moduleCode,
                fieldId: id,
                inUse: isTrue == true ? '1' : '0'
            }
            // console.log(data);
            _this.$http.post(_this.Global.baseURL + _this.Global.api.SystemSet.bizfield.bizFieldUpdate, data).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    /* '已启用' : '已禁用' */
                    _this.$message.success(isTrue == true ? this.$t('mxpcweb.systemset.bizfield.1530329410107') : this.$t('mxpcweb.systemset.bizfield.1530329437805'))
                    _this.updateEditSetList(_this.rootData[_this.tabIndex].moduleCode) // 更新客户模块字段
                    // _this.getData();//获取页面数据
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        // 必填，是否
        isNotNull(id) {
            let _this = this
            let isTrue = event.target.checked
            let data = {
                type: 'isnotnull',
                strucId: _this.rootData[_this.tabIndex].moduleStrucs[_this.actionIndex].strucId,
                moduleCode: _this.rootData[_this.tabIndex].moduleCode,
                fieldId: id,
                isNotNull: isTrue == true ? '1' : '0'
            }
            // console.log(data);
            _this.$http.post(_this.Global.baseURL + _this.Global.api.SystemSet.bizfield.bizFieldUpdate, data).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    /*  '已修改为必填' : '已修改为非必填' */
                    _this.$message.success(isTrue == true ? this.$t('mxpcweb.systemset.bizfield.1530329462538') : this.$t('mxpcweb.systemset.bizfield.1530329497124'))
                    _this.updateEditSetList(_this.rootData[_this.tabIndex].moduleCode)// 更新客户模块字段
                    // _this.getData();//获取页面数据
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
            _this.itemArray = ''// 清空加loading...效果
            _this.tabIndex = tab.index
            _this.actionIndex = 0 // 左菜单必须置0,否则右侧会找不到数据错误
            _this.getData()// 获取页面数据
        },
        // 左菜单切换
        menuClick(index) {
            let _this = this
            _this.itemArray = ''// 清空并加loading...效果
            _this.actionIndex = index
            _this.getData()// 获取页面数据
        },
        // 拖拽结束时
        moveEnd(evt) {
            let _this = this
            _this.getWinHeight() // 执行一下动态表格组宽
            // console.log(evt.oldIndex);
            // console.log(evt.newIndex);
            let data = {
                type: 'sort',
                strucId: _this.rootData[_this.tabIndex].moduleStrucs[_this.actionIndex].strucId,
                moduleCode: _this.rootData[_this.tabIndex].moduleCode,
                fieldId1: _this.itemArrayBak[evt.oldIndex].fieldId ? _this.itemArrayBak[evt.oldIndex].fieldId : _this.itemArrayBak[evt.oldIndex].group.pop().fieldId,
                fieldId2: _this.itemArrayBak[evt.newIndex].fieldId ? _this.itemArrayBak[evt.newIndex].fieldId : _this.itemArrayBak[evt.newIndex].group.pop().fieldId
            }
            // console.log(data);
            _this.$http.post(_this.Global.baseURL + _this.Global.api.SystemSet.bizfield.bizFieldUpdate, data).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    /* 排序成功 */
                    _this.$message.success(this.$t('mxpcweb.systemset.bizfield.1530329573802'))
                    _this.getData()// 获取页面数据
                    _this.updateEditSetList(_this.rootData[_this.tabIndex].moduleCode)// 更新客户模块字段
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
        'no-data': NoData,
        'loading': Loading,
        'dialog-add-field': dialogAddField
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
