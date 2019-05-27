<template>
    <div class="addPage landingPage">
        <page-detail :detailTitle="subtitle" @toList="$emit('changeTabData','2')" class="addpagetitle"></page-detail>
        <div class="list">
            <div class="wrapBox">
                <change-title :titleData="this.formdata.pageName" class="addTitle" @visibleChange="getChangeName"></change-title>
                <el-row :gutter="20" class="dragBox">
                    <el-col :span="8">
                        <div class="labelBox">
                            <el-tabs v-model="activeName" @tab-click="handleClick" style="width:100%" v-loading="loading">
                                <el-tab-pane label="字段列表" name="first" style="width:100%">
                                    <div class="tabbox">
                                        <!-- <div class="search">
                                            <el-input placeholder="搜索字段" icon="search" v-model="inputlabel" :on-icon-click="seachLabel"></el-input>
                                        </div> -->
                                        <draggable class="list-group" element="ul" v-model="list" :options="dragOptions" :move="onMove" @start="isDragging=true" @end="isDragging=false" :style="{height: fieldBoxH + 'px'}">
                                            <transition-group type="transition" :name="'flip-list'">
                                                <li class="list-group-item" v-for="element in list" :key="element.fieldId">
                                                    <span class="badge">{{element.cnFieldCaption}}</span>
                                                </li>
                                            </transition-group>
                                        </draggable>
                                    </div>
                                </el-tab-pane>
                                <!-- <el-tab-pane label="高级工具" name="second" >
                                    <draggable class="list-group" element="ul" v-model="list1" :options="dragOptions" :move="onMove" @start="isDragging=true" @end="isDragging=false">
                                        <transition-group type="transition" :name="'flip-list'">
                                            <li class="list-group-item" v-for="element in list1" :key="element.key">
                                                <span class="badge">{{element.cnFieldCaption}}</span>
                                            </li>
                                        </transition-group>
                                    </draggable>
                                </el-tab-pane> -->
                            </el-tabs>
                        </div>
                    </el-col>
                    <el-col :span="16">
                        <div class="targetBox" :style="{'font-size': diyArr.fontsize, 'font-family':diyArr.fontFamily, 'color': diyArr.color, 'background': diyArr.background}">
                            <target-header @showPreview="showPreview" @diyStyle="getdiyStyle"></target-header>
                            <el-form label-width="200px">
                                <draggable element="ul" class="list-target" v-model="list2" :options="dragOptions" :move="onMove">
                                    <transition-group name="no">
                                        <el-row :gutter="14" v-for="element in list2" :key="element.fieldId" style="height:40px;margin-bottom: 10px;" :class="{hideflag: element.hideFlag}">
                                            <el-col :span="8">
                                                <div :style="{'text-align': diyArr.textalign}">{{element.cnFieldCaption}}<label v-if="element.isNotNull" style="color: red">*</label></div>
                                            </el-col>
                                            <el-col :span="10">
                                                <div>
                                                    <el-input v-if="element.controlTypeId !== 2 && element.controlTypeId !== 4" v-model="element.value"></el-input>
                                                    <el-input type="textarea" v-if="element.controlTypeId == 4" v-model="element.value"></el-input>
                                                    <el-select v-if="element.controlTypeId == 2" placeholder="请选择" v-model="element.value" style="width:100%">
                                                        <el-option v-for="item in element.options" :key="item.dictItemCode" :label="item.itemName" :value="item.dictItemCode">
                                                        </el-option>
                                                    </el-select>
                                                </div>
                                            </el-col>
                                            <el-col :span="2">
                                                <div style="height:50px;line-height:50px;">
                                                    <el-tooltip v-if="element.helpText && !element.helpUrl" class="item" effect="dark" :content="element.helpText" placement="bottom">
                                                        <span class="tips"><i class="iconfont icon-ask-mark"></i></span>
                                                    </el-tooltip>
                                                    <a v-if="element.helpUrl" target="_blank" :href="element.helpUrl" style="text-align:center">{{element.helpText}}</a>
                                                </div>
                                            </el-col>
                                            <el-col :span="2" style="height:50px;line-height:50px;">
                                                <div class="iconwrap" @click="setting(element)">
                                                    <!-- 设置 -->
                                                    <i class="iconfont icon-setting-main"></i>
                                                </div>
                                            </el-col>
                                            <el-col :span="2" style="height:50px;line-height:50px;">
                                                <div class="iconwrap" @click="del(element)" v-if="element.isNotNull == 0">
                                                    <!-- 删除 -->
                                                    <i class="iconfont icon-del"></i>
                                                </div>
                                            </el-col>
                                        </el-row>
                                        <div style="height:15%;text-align: center" :key="1">
                                            <el-button type="primary">提交</el-button>
                                            <el-button>重置</el-button>
                                        </div>
                                    </transition-group>
                                </draggable>

                            </el-form>
                        </div>
                    </el-col>
                </el-row>
                <div class="dialog">
                    <el-dialog :visible.sync="showView" :close-on-click-modal="false" :title="this.formdata.pageName" size="small" custom-class="width620">
                        <div :style="{'font-size': diyArr.fontsize, 'font-family':diyArr.fontFamily, 'color': diyArr.color, 'background': diyArr.background}">
                            <el-row :gutter="14" v-for="element in list2" :key="element.fieldId" style="height:50px;line-height: 50px" v-show="!element.hideFlag">
                                <el-col :span="8">
                                    <div :style="{'text-align': diyArr.textalign}">{{element.cnFieldCaption}}<label v-if="element.isNotNull" style="color: red">*</label></div>
                                </el-col>
                                <el-col :span="10">
                                    <div>
                                        <el-input v-if="element.controlTypeId != 2 && element.controlTypeId != 4" v-model="element.value"></el-input>
                                        <el-input type="textarea" v-if="element.controlTypeId == 4" v-model="element.value"></el-input>
                                        <el-select v-if="element.controlTypeId == 2" placeholder="请选择" v-model="element.value" style="width: 100%">
                                            <el-option v-for="item in element.options" :key="item.dictItemCode" :label="item.itemName" :value="item.dictItemCode">
                                            </el-option>
                                        </el-select>
                                    </div>
                                </el-col>
                                <el-col :span="6">
                                    <div style="height:50px;line-height: 50px">
                                        <el-tooltip v-if="element.helpText && !element.helpUrl" class="item" effect="dark" :content="element.helpText" placement="bottom">
                                            <span class="tips"><i class="iconfont icon-ask-mark"></i></span>
                                        </el-tooltip>
                                        <a v-if="element.helpUrl" target="_blank" :href="element.helpUrl" style="text-align:center">{{element.helpText}}</a>
                                    </div>
                                </el-col>
                            </el-row>
                            <div style="height:15%;text-align: center;margin: 10px 0;" :key="1">
                                <el-button type="primary">提交</el-button>
                                <el-button>重置</el-button>
                            </div>
                        </div>
                    </el-dialog>
                </div>
                <div class="btnwrap">
                    <el-button type="primary" @click="next">下一步</el-button>
                    <el-button @click="cancelSubmit">取消</el-button>
                </div>
            </div>
        </div>
        <!-- 设置弹窗 -->
        <dialog-wrap ref="dialogWrap"></dialog-wrap>
    </div>
</template>

<script>
import ChangeTitle from './ChangeTitle/index'
import TargetHeader from './TargetHeader/index'
import Dialog from './Dialog/index'
import PageDetail from '@/components/PageDetail/index' // 大标题
import draggable from 'vuedraggable'
import { mapGetters } from 'vuex'
const message = []
export default {
    name: 'List',
    data() {
        return {
            itemData: '',
            subtitle: '编辑页面',
            formtitle: '测试测试测试1232131',
            list: message,
            list2: [],
            editable: true,
            isDragging: false,
            delayedDragging: false,
            activeName: 'first',
            inputlabel: '',
            loading: false,
            formData: {},
            personOption: [], // 人员下拉
            branchOption: [], // 部门下拉
            fieldBoxH: '',
            showView: false,
            diyArr: {},
            ishideFlag: true
        }
    },
    created() {
        // this.getpersonOption()
        // this.getbranchOption()
        this.getFieldData()
    },
    updated() {
        this.getHeight()
    },
    computed: {
        dragOptions() {
            return {
                animation: 150,
                group: 'description',
                disabled: !this.editable,
                ghostClass: 'ghost',
                target: {}
            }
        },
        ...mapGetters(['company']),
        sysBoxValue() {
            let { sysBoxValue } = this.$store.state
            let map = {}
            // console.log(sysBoxValue)
            sysBoxValue.forEach(item => {
                let tempObj = []
                item.dictItems.forEach(item2 => {
                    tempObj.push({ 'dictItemCode': item2.dictItemCode, 'itemName': item2.itemName })
                })
                map[item.dictCode] = tempObj
            })
            return map
        }
    },
    mounted() { },
    methods: {
        getChangeName(data) {
            this.formdata.pageName = data
        },
        getHeight() {
            let labelBoxH = $('.labelBox').height()
            this.fieldBoxH = labelBoxH - 112
        },
        showPreview(bool) {
            this.showView = bool
        },
        getdiyStyle(data) {
            this.diyArr = data
        },
        getpersonOption() {
            this.isLoading = true
            let data = {
                funType: 'all',
                dataType: 'contact'
            }
            this.$http.get(this.Global.baseURL + this.Global.api.v2.accountDropList_get, { params: data })
                .then(res => {
                    this.isLoading = false
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.personOption = res.body.data
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                },
                    res => {
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                )
        },
        getbranchOption() {
            this.isLoading = true
            let data = {
                funType: 'all',
                deptCascade: false,
                dataType: 'department'
            }
            this.$http.get(this.Global.baseURL + this.Global.api.v2.accountDropList_get, { params: data })
                .then(res => {
                    this.isLoading = false
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.branchOption = res.body.data
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                },
                    res => {
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                )
        },
        gedivata(evt) {
            console.log(evt.draggedContext.element.id)
        },
        del(el) {
            let that = this
            this.list2 = this.list2.filter(function (item) {
                if (item.fieldId === el.fieldId) {
                    that.list.push(el)
                    return false
                }
                return true
            })
        },
        datadragEnd(evt) {
            console.log('拖动前的索引：' + evt.oldIndex)
            console.log('拖动后的索引：' + evt.newIndex)
        },
        orderList() {
            this.list = this.list.sort((one, two) => {
                return one.order - two.order
            })
        },
        onMove({ relatedContext, draggedContext }) {
            const relatedElement = relatedContext.element
            const draggedElement = draggedContext.element
            return (
                (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
            )
        },
        handleClick(tab, event) {
            console.log(tab, event)
        },
        seachLabel() {

        },
        setting(item) {
            this.$refs.dialogWrap.open(item)
        },
        next() {
            if (this.list2.length > 0) {
                let newObj = {}
                newObj = this.formdata
                newObj.landingPageField = this.list2
                let required = []
                let requiredLabel = []
                this.list2.map(function (item) {
                    if (item.isNotNull) {
                        required.push(item.fieldName)
                        requiredLabel.push(item.cnFieldCaption)
                    }
                })
                newObj.diyStyle = this.diyArr
                this.$emit('createFromData', newObj)
                this.$emit('changeTabData', '4')
            } else {
                this.$message({
                    message: '请至少选择一个表单',
                    type: 'warning'
                })
            }
        },
        cancelSubmit() {
            this.$emit('changeTabData', '1')
        },
        getFieldData() {
            this.list = []
            this.list2 = []
            this.loading = true
            let { accessToken } = this.getToken()
            let params = {
                accessToken: accessToken,
                type: 'bizField',
                moduleCode: this.formdata.moduleCode
            }
            if (this.searchKey != '') {
                params.wildcardWords = this.searchKey
            }
            let url = this.Global.baseURL + this.Global.api.v2.bizField_query
            this.$http.get(url, { params })
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        let fieldList = res.body.data
                        let that = this
                        if (this.formdata.fieldInfo) { // 有fieldInfo属性，是编辑页面
                            // console.log('拉到的数据', fieldList)
                            // console.log('传过来的数据', this.formdata.fieldInfo)
                            let passData = this.formdata.fieldInfo // 传过来的数据
                            let dd = []
                            for (var value of passData) {
                                dd.push(value.fieldId)
                            }
                            fieldList.map(function (item) {
                                if (item.controlTypeId == 2) {
                                    if (that.sysBoxValue[item.dictCode]) {
                                        item.options = that.sysBoxValue[item.dictCode]
                                    }
                                }
                                if (dd.indexOf(item.fieldId) < 0) {
                                    if (item.fieldCategory === 2 && item.controlTypeId !== 11 && item.controlTypeId !== 16 && item.fieldName != 'custId' && item.fieldName != 'contId') { // 过滤掉系统字段
                                        that.list.push(item)
                                    }
                                } else {
                                    that.list2.push(item)
                                }
                            })
                        } else { // 没有fieldInfo属性，是新增页面
                            for (let i = 0; i < fieldList.length; i++) {
                                // 过滤掉系统字段
                                if (fieldList[i].fieldCategory === 2 && fieldList[i].controlTypeId !== 11 && fieldList[i].controlTypeId !== 16 && fieldList[i].fieldName != 'custId' && fieldList[i].fieldName != 'contId') {
                                    if (fieldList[i].isNotNull === 1) { // 找出必填字段放入list2
                                        that.list2.push(fieldList[i])
                                    } else {
                                        that.list.push(fieldList[i])
                                    }
                                    if (fieldList[i].controlTypeId == 2) {
                                        fieldList[i].options = this.sysBoxValue[fieldList[i].dictCode]
                                    }
                                }
                            }
                        }

                        this.loading = false
                    } else {
                        this.loading = false
                        this.$message.error(this.msg(res.body))
                    }
                })
                .catch(err => {
                    this.loading = false
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        }
    },
    props: {
        formdata: {
            type: Object,
            default: function () {
                return {}
            }
        }
        // editRowData: {
        //     type: Object,
        //     default: function () {
        //         return {}
        //     }
        // }
    },
    watch: {
        isDragging(newValue) {
            if (newValue) {
                this.delayedDragging = true
                return
            }
            this.$nextTick(() => {
                this.delayedDragging = false
            })
        }
    },
    components: {
        'page-detail': PageDetail,
        'draggable': draggable,
        'change-title': ChangeTitle,
        'target-header': TargetHeader,
        'dialog-wrap': Dialog
    }
}
</script>
<style lang="less">
.landingPage {
    .el-tabs__nav {
        width: 100% !important;
        // background-color: #000 !important;
    }
    .el-tabs__nav .el-tabs__active-bar {
        width: 100% !important;
    }
    .el-tabs__nav .el-tabs__item.is-active {
        width: 100% !important;
        text-align: center !important;
    }
    .addpagetitle .backList {
        display: none;
    }
    .hideflag {
        background-color: #dfe2e4;
    }
    .el-textarea__inner {
        height: 50px;
    }
}
</style>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
