<template>
    <div>
        <WO001AddAndClose ref="WO001AddAndClose" @tellFather="callback"></WO001AddAndClose>
        <!-- 新增 -->
        <el-dialog v-dialogDrag :title="optName" :visible.sync="dialogAddPeople" :closeOnClickModal="false"  custom-class="width1020" :modal-append-to-body="false">
            <div class="addPeople" v-loading="loading">
                <div class="listBox MXscroll addPeopleMXscroll" style="min-height:400px;"  :style="'height:'+boxHeight">
                    <template v-if="editSet.length!=0&&dialogAddPeople">
                        <div v-for="(item,index) in editSet" :key="index" :class="[item.fieldCategory == 4||item.controlTypeId == 4||item.fieldGroup==1||item.controlTypeId == 15||item.controlTypeId == 46 ? 'listBox1' : 'listBox2']">
                            <el-row v-if="item.fieldGroup == 0">
                                <el-col :span="24">
                                    <template v-if="item.fieldCategory == 4">
                                        <p class="contactTitle">{{ item.cnFieldCaption }}</p>
                                    </template>
                                    <div v-else-if="item.controlTypeId == 4||item.controlTypeId == 15||item.controlTypeId == 46" style="margin-left:30px;">
                                        <component @openCheck="openCheck" :nameId="item.fieldName" :optCode="optCode" :moduleCode="moduleCode" :dataId="'control'+index" @relyOn="relyOn" class="component" labelWidth="80px" v-bind:is="'control'+item.controlTypeId" @closeWindow="closeWindow" :checkRepeat="true" ref="control" :itemData="item" rightWidth="767px"  :controlData.sync="item.controlData" labelPosition="left" @returnFieldList="returnFieldList"></component>
                                    </div>
                                    <component v-else @openCheck="openCheck" @otNew="otNew" :nameId="item.fieldName" :optCode="optCode" :moduleCode="moduleCode" :dataId="'control'+index"  @relyOn="relyOn" style="margin-left:30px;" labelWidth="80px" class="component" v-bind:is="'control'+item.controlTypeId" @closeWindow="closeWindow" :checkRepeat="true" ref="control" :itemData="item" rightWidth="300px"  :controlData.sync="item.controlData" labelPosition="left" @returnFieldList="returnFieldList"></component>
                                </el-col>
                            </el-row>
                            <el-row v-else>
                                <component :nameId="item.fieldName" @relyOn="relyOn" @returnFieldList="returnFieldList" :optCode="optCode" :moduleCode="moduleCode" :dataId="'control'+index" v-if="item.fieldGroup==1" labelWidth="80px" style="margin-left:30px;" class="component" v-bind:is="'group'+item.fieldGroup"  ref="control" :itemData="item"  rightWidth="767px" rightWidth1="152px" labelPosition="left"></component>
                                <component @isPower="isPower" :optCode="optCode" @returnFieldList="returnFieldList" :moduleCode="moduleCode" :nameId="item.fieldName" @relyOn="relyOn" :dataId="'control'+index" v-else class="component" labelWidth="80px" style="margin-left:30px;" v-bind:is="'group'+item.fieldGroup"  ref="control" :itemData="item"   rightWidth="300px" rightWidth1="148px" labelPosition="left"></component>
                            </el-row>
                        </div>
                    </template>
                </div>
                <div class="dialogFooter">
                    <el-button  @click="dialogAddPeople=false">{{$t('mxpcweb.client.1529047588840')}}</el-button>
                    <el-button type="primary" :loading="submitLoading" @click="submitAddFrom(true)">
                        <!-- 保存 -->
                        {{$t('mxpcweb.client.1529042806774')}}
                    </el-button>
                    <el-button v-if="moduleCode == 'WO001'" type="primary" :loading="submitLoading" @click="submitAddFrom()">
                        <!-- 保存后继续新增 -->
                        {{$t('mxpcweb.client.1529042822379')}}
                    </el-button>
                    <!--<el-button type="primary" @click="submitAddFrom()">保存后继续新增</el-button>-->
                </div>
                <to-repeat :moduleCode="moduleCode"  ref="toRepeat"></to-repeat>
            </div>
        </el-dialog>
    </div>
</template>
<script>
/**
 * 描述：客户管理-客户列表-新增单据
 * 作者：何俊峰
 * 时间：2017/11/21
 */
import Controls from '@/components/Controls/index.js'
import GroupControls from '@/components/GroupControls/index.js'
import toRepeat from '../Vue/toRepeat.vue'
import WO001AddAndClose from '../Vue/WO001/index.vue'
import { mapGetters, mapMutations } from 'vuex'
import { getAddEditSetList } from '@/page/Main/Client/mixins/index.js'
export default {
    name: 'addPeople',
    props: {
    },
    data() {
        return {
            addPeopleFrom: {
                // moduleCode:this.moduleCode
            },
            editSet: [],
            loading: true,
            submitLoading: false,
            argument: true,
            dialogAddPeople: false,
            firstInto: true,
            boxHeight: 0,
            optName: this.$t('mxpcweb.client.1529043854407'),
            moduleCode: '',
            optCode: '',
            callback: () => {}
        }
    },
    created() {
    },
    mounted() {
        this.setHeight()
    },
    computed: {
        ...mapGetters([
            'company',
            'screenHeight'
        ]),
        ...mapGetters('client', [
            'addEditSetList'
        ])
    },
    methods: {
        getAddEditSetList,
        // 同步设置
        ...mapMutations('client', {
            set_addEditSetList: 'SET_ADDEDITSETLIST'
        }),
        upList(fieldName) {
            this.$refs['control'].forEach((item) => {
                if (item.$attrs.nameId == fieldName) {
                    item.upList()
                }
            })
        },
        isPower() { // 判断是否有权限新增
            this.dialogAddPeople = false
        },
        setHeight() {
            this.boxHeight = 0.6 * parseInt($(window).height()) + 'px'
        },
        otNew(moduleCode) {
            this.$emit('otNew', moduleCode)
        },
        // 新建跟进
        openWindow(obj) {
            if (obj && obj.optData) {
                this.optName = obj.optData.optName
                this.moduleCode = obj.optData.optModuleCode
                this.thisModuleCode = obj.moduleCode
                this.optCode = obj.optData.optCode
                if (obj.next) {
                    this.callback = obj.next
                } else {
                    this.callback = () => {}
                }
                this.getEditSet(obj.itemData)
            }
            this.dialogAddPeople = true
        },
        updatas (itemData) {
            if (itemData) {
                if (this.thisModuleCode == 'BF003') {
                    let time1 = setInterval(() => {
                        if (this.$refs['control']) {
                            clearInterval(time1)
                            this.$refs['control'].forEach((item) => {
                                if (item.$attrs.nameId == 'custId') {
                                    item.updatas1(itemData)
                                }
                                if (item.$attrs.nameId == 'contId') {
                                    item.updatas(itemData)
                                }
                            })
                        }
                    }, 10)
                } else if (this.thisModuleCode == 'BF001') {
                    let time2 = setInterval(() => {
                        if (this.$refs['control']) {
                            clearInterval(time2)
                            this.$refs['control'].forEach((item) => {
                                if (item.$attrs.nameId == 'custId') {
                                    item.updatas(itemData)
                                }
                            })
                        }
                    }, 10)
                }
            }
        },
        relyOn(value, name) {
            this.editSet.forEach((item) => {
                if (item.parFilterField == name) {
                     this.$refs['control'].forEach((items) => {
                         if (items.$attrs.nameId == item.fieldName) {
                             items.getData(value, true)
                         }
                    })
                }
            })
        },
        returnFieldList(data, field) {
            let fieldList = field.split(';')
            fieldList.forEach(element => {
                if (element != '') {
                    let elementList = element.split('=')
                    this.$refs['control'].forEach((items) => {
                        if (items.$attrs.nameId == elementList[0]) {
                            items.updata(data[elementList[1]])
                        }
                    })
                }
            })
        },
        getEditSet(itemData) { // 获取数据
            this.getAddEditSetList(this.moduleCode, (editSets) => {
                let obj = JSON.stringify(editSets)
                let editSet = JSON.parse(obj)
                this.editSet = this.swidchEditSet(editSet.list)
                this.loading = false
                if (itemData) {
                    this.updatas(itemData)
                }
            })
        },
        openCheck(value) {
            this.$refs.toRepeat.openWindow(value)
        },
        closeWindow() {
            this.dialogAddPeople = false
            // this.$emitcloseAddPeoples
        },
        swidchEditSet(list) {
             let newLList = []
             let groupFirst = []
            list.forEach((element) => {
                element.controlData = ''
                if (element.editState == '0' || element.editState == '2') {
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
                            cnFieldCaption: this.returnGroupName(element.fieldGroup),
                            isTop: element.isTop,
                            group: []
                        }
                        newObj.group.push(element)
                        newLList.push(newObj)
                        groupFirst.push(element.fieldGroup)
                    } else { // 如果出现过就找之前创建的对象将自己放入到group数组中
                        newLList.forEach((them) => {
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
        },
        submitAddFrom(argument) { // 提交新增客户数据
            this.argument = argument
            let isPass = true
            let firstTo = true
            this.$refs['control'].forEach((item) => {
                if (!item.submitForm()) {
                    isPass = false
                    if (firstTo) {
                        firstTo = false
                        if (item.$attrs.dataId != '') {
                             $('.addPeopleMXscroll').scrollTop($('[dataId=' + item.$attrs.dataId + ']')[0].offsetTop)
                        }
                    }
                }
            })
            // let custContact = {}
            if (!isPass) {
                return isPass
            }
            this.submitLoading = true
            this.editSet.forEach((element) => {
                if (element.fieldCategory != 4) {
                    if (element.fieldGroup == 0) {
                        if (element.controlData != '' && element.controlData != []) {
                            this.addPeopleFrom[element.fieldName] = element.controlData
                        } else if (this.addPeopleFrom[element.fieldName]) {
                            delete this.addPeopleFrom[element.fieldName]
                        }
                    } else {
                        element.group.forEach((item) => {
                            if (item.controlData != '' && item.controlData != []) {
                                this.addPeopleFrom[item.fieldName] = item.controlData
                            } else if (this.addPeopleFrom[item.fieldName]) {
                                delete this.addPeopleFrom[item.fieldName]
                            }
                        })
                    }
                }
            })
            this.addPeopleFrom['moduleCode'] = this.moduleCode
            // this.$http.post(this.Global.baseURL + this.Global.api.DocumentFramework.DocumentOperation.add, this.addPeopleFrom).then((res) => {

            this.getFormKey((formKey, msg) => {
                if (formKey && formKey != '') {
                    this.$http.post(this.Global.baseURL + this.Global.api.v2.document_generalOperate_add, Object.assign(this.addPeopleFrom, {
                        'formKey': formKey
                    })).then((res) => {
                        this.updateFormKey()
                        if (res.body.code.toString() == this.Global.RES_OK) {
                            $('.addPeopleMXscroll').scrollTop(0)
                            this.dialogAddPeople = !argument
                            this.clearEditSet(argument)
                            this.callback()
                            this.submitLoading = false
                            if (this.moduleCode == 'WO001') {
                                this.businessWO001(res.body.data)
                            }
                            this.$message.success(this.msg(res.body))
                        } else {
                            this.submitLoading = false
                            this.$message.error(this.msg(res.body))
                        }
                    }, (res) => {
                        this.submitLoading = false
                        this.$message.error(this.$t(this.Global.errorTitle))
                    })
                } else {
                    this.submitLoading = false
                    this.$message.error(msg)
                }
            })
        },
        businessWO001(data) {
            if (data.acceptCtId == this.company.ctId) {
                this.$refs.WO001AddAndClose.openWindow(data.workId)
            }
        },
        clearEditSet(argument) {
            this.editSet.forEach((elemennt) => {
                if (elemennt.fieldGroup == 0) {
                    elemennt.controlData = ''
                } else {
                    elemennt.group.forEach((items) => {
                        items.controlData = ''
                    })
                }
            })
            this.addPeopleFrom = {}
            if (!argument) {
                this.$refs['control'].forEach((item) => {
                    console.log(item)
                    if (item.clearData) {
                        item.clearData()
                    }
                })
            }
        }
    },
    watch: {
        screenHeight(val) { // 监听屏幕宽度变化
            this.setHeight()
        }
    },
    beforeDestroy: () => {
        this.getEditSet = null
    },
    components: Object.assign({
        'to-repeat': toRepeat,
        'WO001AddAndClose': WO001AddAndClose
    }, Controls, GroupControls)
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
