<template>
<!-- 编辑 -->
    <el-dialog v-dialogDrag :title="optName" :visible.sync="dialogListEdit" :closeOnClickModal="false"  :custom-class="optModuleCode!='BF003'?'width1020':'width520'"  :modal-append-to-body="false">
        <div class="listEdit" v-if="dialogListEdit">
            <div class="listBox MXscroll addPeopleMXscroll" style="min-height:400px;"  :style="'height:'+boxHeight" v-loading="loading">
                <span id="top"></span>
                <div v-for="(item,index) in editSet" :key="index" :datasId="'control'+index" :class="[optModuleCode!='BF003'?item.fieldCategory == 4||item.controlTypeId == 4||item.fieldGroup==1||item.controlTypeId == 15||item.controlTypeId == 46 ? 'listBox1' : 'listBox2':'listBox1']">
                    <el-row v-if="item.fieldGroup == 0">
                        <el-col :span="24">
                            <template v-if="item.fieldCategory == 4">
                                <p class="contactTitle">{{ item.cnFieldCaption }}</p>
                            </template>
                            <div v-else-if="item.controlTypeId == 4||item.controlTypeId == 15||item.controlTypeId == 46" :style="optModuleCode!='BF003'?'margin-left:30px;':'margin-left:15px;'">
                                <component @returnFieldList="returnFieldList" :nameId="item.fieldName" @relyOn='relyOn' :moduleCode="optModuleCode" :identFieldValue="identFieldValue" :dataId="'control'+index" class="component" v-bind:is="'control'+item.controlTypeId" @closeWindow="closeWindow" :checkRepeat="true" ref="control" :itemData="item" :rightWidth="optModuleCode!='BF003'?'778px':'300px'"  :controlData.sync="item.controlData" labelWidth="80px" labelPosition="left"></component>
                            </div>
                            <component v-else @openCheck="openCheck" @returnFieldList="returnFieldList" :moduleCode="optModuleCode" :nameId="item.fieldName" @relyOn='relyOn' :identFieldValue="identFieldValue"  :dataId="'control'+index" :style="optModuleCode!='BF003'?'margin-left:30px;':'margin-left:15px;'" class="component" v-bind:is="'control'+item.controlTypeId" @closeWindow="closeWindow" :checkRepeat="true" ref="control" :itemData="item" rightWidth="300px"  labelWidth="80px" :controlData.sync="item.controlData" labelPosition="left"></component>
                        </el-col>
                    </el-row>
                    <el-row v-else>
                        <component  :nameId="item.fieldName" @relyOn='relyOn' :identFieldValue="identFieldValue"  :dataId="'control'+index" v-if="item.fieldGroup==1"  :style="optModuleCode!='BF003'?'margin-left:30px;':'margin-left:15px;'" class="component" v-bind:is="'group'+item.fieldGroup"  ref="control" :itemData="item"  :rightWidth="optModuleCode!='BF003'?'778px':'300px'" rightWidth1="163px"  labelWidth="80px" labelPosition="left"></component>
                        <component @isPower="isPower" optCode="otEdit" :moduleCode="optModuleCode" :nameId="item.fieldName" @relyOn='relyOn' :identFieldValue="identFieldValue"  :dataId="'control'+index" v-else class="component"  :style="optModuleCode!='BF003'?'margin-left:30px;':'margin-left:15px;'" v-bind:is="'group'+item.fieldGroup"  ref="control" :itemData="item"  rightWidth="300px" rightWidth1="148px" labelWidth="80px" labelPosition="left"></component>
                    </el-row>
                </div>
            </div>
            <div slot="footer" class="dialogFooter">
                <!-- 取消 -->
                <el-button  @click="dialogListEdit=false">{{$t('mxpcweb.client.1529047588840')}}</el-button>
                <!-- 保存 -->
                <el-button type="primary" :loading="submitLoading" @click="submitAddFrom">{{$t('mxpcweb.client.1529042806774')}}</el-button>
            </div>
            <to-repeat :moduleCode="optModuleCode"  ref="toRepeat" @openCheck="openCheck" @openWindow="openWindow"></to-repeat>
            <check-repeat :moduleCode="optModuleCode" ref="checkRepeat" ></check-repeat>
        </div>
    </el-dialog>
</template>
<script>
/**
 * 描述：客户管理-客户列表-编辑客户
 * 作者：何俊峰
 * 时间：2017/11/22
 */
import { isArray, isNumber } from '@/libs/utils.js'
import Controls from '@/components/Controls/index.js'
import GroupControls from '@/components/GroupControls/index.js'
import toRepeat from '@/components/optVueNew/otNew/add/Vue/toRepeat.vue'
import checkRepeat from '@/components/optVueNew/otNew/add/Vue/checkRepeat.vue'
import { mapGetters, mapMutations } from 'vuex'
import { getModifyEditSetList } from '@/page/Main/Client/mixins/index.js'
export default {
    name: 'listEdit',
    props: {
        moduleCode: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            addPeopleFrom: {

            },
            dialogListEdit: false, // 客户编辑弹窗开关
            editSet: [],

            // 编辑
            openFirst: true, // 是否首次打开
            identFieldValue: 0, // 当前点击的客户id
            isClick: false, // 是否有点击事件正在进行
            boxHeight: 0,
            title: '',
            submitLoading: false,
            optModuleCode: '',
            optName: this.$t('mxpcweb.client.1529054228538'),
            itemData: {},
            callback: function() {}
        }
    },
    created() {
        // this.getEditSet();
    },
    mounted() {
        this.setHeight()
    },
    computed: {
        ...mapGetters([
            'screenHeight'
        ]),
        ...mapGetters('client', [
            'modifyEditSetList'
        ])
    },
    methods: {
        getModifyEditSetList,
        // 同步设置
        ...mapMutations('client', {
            set_modifyEditSetList: 'SET_MODIFYEDITSETLIST'
        }),
        isPower() { // 判断是否有权限新增
            this.dialogListEdit = false
        },
        setHeight() {
            this.boxHeight = 0.6 * parseInt($(window).height()) + 'px'
        },
        openCheck(value, type) {
            if (type == 0) {
                this.$refs.checkRepeat.openWindow(value)
            } else {
                this.$refs.toRepeat.openWindow(value)
            }
        },
        openEidt(obj) { // 打开编辑弹窗
            let { itemData, billId, optData } = obj
            this.optName = optData.optName
            this.itemData = itemData
            if (this.optModuleCode != optData.optModuleCode) {
                this.editSet = []
                this.optModuleCode = optData.optModuleCode
            }
            if (obj.next) {
                this.callback = obj.next
            } else {
                this.callback = function() {}
            }
            this.getEditSet(itemData)
            this.identFieldValue = billId
        },
        openWindow(obj) {
            let _this = this
            if (obj) {
                let {value, fieldName, model, disable} = obj
                if (value) {
                    setTimeout(function() {
                        if (model == 'BF001') { // 判断是什么模块的字段
                            _this.$refs['control'].forEach((items) => {
                                if (items.$attrs.nameId == fieldName) {
                                    items.updatas(value, disable)
                                }
                            })
                        } else {
                            _this.$refs['AddContactsItem'].$refs['control'].forEach((items) => {
                                if (items.$attrs.nameId == fieldName) {
                                    items.updatas(value, disable)
                                }
                            })
                        }
                    }, 20)
                }
            }
        },
        relyOn(value, name) {
            let _this = this
            _this.editSet.forEach(function(item) {
                if (item.parFilterField == name) {
                     _this.$refs['control'].forEach((items) => {
                         if (items.$attrs.nameId == item.fieldName) {
                             items.getData(value, true)
                         }
                    })
                }
            })
        },
        returnFieldList(data, field) {
            let _this = this
            let fieldList = field.split(';')
            fieldList.forEach(element => {
                if (element != '') {
                    let elementList = element.split('=')
                    if (elementList[0] && elementList[1]) {
                        _this.$refs['control'].forEach((items) => {
                            if (items.$attrs.nameId == elementList[0]) {
                                let value = data[elementList[1]] ? data[elementList[1]] : ''
                                items.updata(value, value)
                            }
                        })
                    }
                }
            })
        },
        closeWindow() {
            this.$emit('closeWindow')
        },
        // 获取编辑字段数据
        getEditSet(list) {
            let _this = this
            if (_this.optModuleCode && _this.optModuleCode != '') {
                _this.loading = true
                _this.dialogListEdit = true
                _this.getModifyEditSetList(_this.optModuleCode, function(editSets) {
                    let obj = JSON.stringify(editSets)
                    let editSet = JSON.parse(obj)
                    _this.editSet = _this.swidchEditSet(editSet.list)
                    _this.swidchEdit(list)
                    if (_this.openFirst) {
                        _this.openFirst = false
                    } else {
                        _this.clearEditSet()
                    }
                    setTimeout(function() {
                        _this.updata()
                        _this.loading = false
                    }, 20)
                })
            }
        },
        submitAddFrom() { // 提交新增客户数据
            let _this = this
            let isPass = true
            let firstTo = true
            _this.$refs['control'].forEach((item) => {
                if (!item.submitForm()) {
                    isPass = false
                    if (firstTo) {
                        firstTo = false
                        $('.addPeopleMXscroll').scrollTop($('[datasId=' + item.$attrs.dataId + ']')[0].offsetTop - $('.addPeopleMXscroll')[0].offsetTop)
                    }
                }
            })
            if (!isPass) {
                return isPass
            };
            _this.editSet.forEach(function(element) {
                if (element.fieldCategory != 4) {
                    if (element.fieldGroup == 0) {
                        if (element.controlData != element.fieldValue && element.controlData != undefined) {
                            _this.addPeopleFrom[element.fieldName] = element.controlData == '' ? isArray(element.controlData) ? [] : 0 : element.controlData
                        } else if (_this.addPeopleFrom[element.fieldName]) {
                            delete _this.addPeopleFrom[element.fieldName]
                        }
                    } else {
                        element.group.forEach(function(item) {
                            if (item.controlData != item.fieldValue && item.controlData != undefined) {
                                _this.addPeopleFrom[item.fieldName] = item.controlData == '' ? 0 : item.controlData
                            } else if (_this.addPeopleFrom[item.fieldName]) {
                                delete _this.addPeopleFrom[item.fieldName]
                            }
                        })
                    }
                }
            })
            if (_this.isEmptyObject(_this.addPeopleFrom)) {
                // 您未作任何修改，不能保存！
                _this.$message(_this.$t('mxpcweb.client.1529054287744'))
                return false
            };
            _this.submitLoading = true
            _this.addPeopleFrom['identFieldValue'] = _this.identFieldValue
            _this.addPeopleFrom['moduleCode'] = _this.optModuleCode
            let addPeopleFrom = _this.addPeopleFrom
            _this.$http.put(_this.Global.baseURL + _this.Global.api.v2.document_generalOperate_put, addPeopleFrom).then((res) => {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.submitLoading = false
                    _this.dialogListEdit = false
                    _this.callback()
                    _this.$message.success(_this.msg(res.body))
                } else {
                    _this.submitLoading = false
                    _this.$message.error(_this.msg(res.body))
                }
            }, (res) => {
                _this.submitLoading = false
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        isEmptyObject(obj) {
            for (let key in obj) {
                return false
            }
            return true
        },
        updata() {
            this.$refs['control'].forEach((item, index) => {
                // console.log(item);
                item.updata()
            })
        },
        clearEditSet() {
            this.editSet.forEach((elemennt) => {
                if (elemennt.fieldGroup == 0) {
                    elemennt.controlData = ''
                } else {
                    elemennt.group.forEach(function(items) {
                        items.controlData = ''
                    })
                }
            })
            this.addPeopleFrom = {}
        },
        // 转化编辑数据（按顺序）
        swidchEdit(list) {
            let _this = this
            _this.editSet.forEach(function(item) {
                item.inDefaultValue = ''
                if (item.editState == '0' || item.editState == '3') {
                    item.disabled = true
                }
                if (item.fieldGroup == 0) {
                    if (list[item.fieldName]) {
                        item.fieldValue = isNumber(list[item.fieldName]) ? list[item.fieldName].toString() : list[item.fieldName]
                    } else {
                        item.fieldValue = ''
                    }
                } else {
                    item.group.forEach(function(element) {
                        if (list[element.fieldName]) {
                            element.fieldValue = isNumber(list[element.fieldName]) ? list[element.fieldName].toString() : list[element.fieldName]
                        } else {
                            element.fieldValue = ''
                        }
                    })
                }
            })
        },
        // 转化编辑字段数据（按空间类型（单控件，组控件）顺序）
        swidchEditSet(list) {
            let _this = this
             let newLList = []
             let groupFirst = []
            list.forEach((element) => {
                element.controlData = ''
                if (element.editState == '0' || element.editState == '3') {
                    element.disabled = true
                }
                element.fieldValue = element.inDefaultValue
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
                            fieldGroup: element.fieldGroup,
                            cnFieldCaption: _this.returnGroupName(element.fieldGroup),
                            isTop: element.isTop,
                            group: []
                        }
                        newObj.group.push(element)
                        newLList.push(newObj)
                        groupFirst.push(element.fieldGroup)
                    } else { // 如果出现过就找之前创建的对象将自己放入到group数组中
                        newLList.forEach(function(them) {
                            if (them.fieldGroup == thisGroup) {
                                them.group.push(element)
                            }
                        })
                    }
                } else {
                    newLList.push(element)
                }
            })
            return newLList
        }
    },
    watch: {
        screenHeight (val) { // 监听屏幕宽度变化
            this.setHeight()
        }
    },
    components: Object.assign({
        'to-repeat': toRepeat,
        'checkRepeat': checkRepeat
    }, Controls, GroupControls),
    beforeDestroy: function () {
        this.getEditSet = null
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
