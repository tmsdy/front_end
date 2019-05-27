<template>
    <!-- 新增 -->
    <el-dialog v-dialogDrag :title="optName" :visible.sync="dialogAddPeople" :closeOnClickModal="false"  custom-class="width1020" :modal-append-to-body="false">
        <div class="addPeople">
            <div class="listBox MXscroll addPeopleMXscroll" style="min-height:400px;"  :style="'height:'+boxHeight" v-loading="loading">
                <div v-if="editSet.length!=0&&dialogAddPeople">
                    <div v-for="(item,index) in editSet" :key="index" :class="[item.fieldCategory == 4||item.controlTypeId == 4||item.fieldGroup==1||item.controlTypeId == 15||item.controlTypeId == 46 ? 'listBox1' : 'listBox2']">
                        <el-row v-if="item.fieldGroup == 0">
                            <el-col :span="24">
                                <template v-if="item.fieldCategory == 4">
                                    <p class="contactTitle">{{ item.cnFieldCaption }}</p>
                                </template>
                                <div v-else-if="item.controlTypeId == 4||item.controlTypeId == 15||item.controlTypeId == 46" style="margin-left:30px;">
                                    <component :nameId="item.fieldName" :optCode="optCode" :moduleCode="moduleCode" :dataId="'control'+index" @relyOn="relyOn" class="component" labelWidth="80px" v-bind:is="'control'+item.controlTypeId" @returnFieldList="returnFieldList" @closeWindow="closeWindow" ref="control" :itemData="item" rightWidth="767px"  :controlData.sync="item.controlData" labelPosition="left"></component>
                                </div>
                                <component v-else  :nameId="item.fieldName" :optCode="optCode" :moduleCode="moduleCode" :dataId="'control'+index"  @relyOn="relyOn" style="margin-left:30px;" labelWidth="80px" class="component" v-bind:is="'control'+item.controlTypeId" @returnFieldList="returnFieldList" @closeWindow="closeWindow" ref="control" :itemData="item" rightWidth="300px"  :controlData.sync="item.controlData" labelPosition="left"></component>
                            </el-col>
                        </el-row>
                        <el-row v-else>
                            <component :nameId="item.fieldName" @relyOn="relyOn"  :optCode="optCode" :moduleCode="moduleCode" :dataId="'control'+index" v-if="item.fieldGroup==1" labelWidth="80px" style="margin-left:30px;" class="component" v-bind:is="'group'+item.fieldGroup"  ref="control" :itemData="item"  rightWidth="767px" rightWidth1="152px" labelPosition="left"></component>
                            <component :optCode="optCode" :moduleCode="moduleCode" :nameId="item.fieldName" @relyOn="relyOn" :dataId="'control'+index" v-else class="component" labelWidth="80px" style="margin-left:30px;" v-bind:is="'group'+item.fieldGroup"  ref="control" :itemData="item"   rightWidth="300px" rightWidth1="148px" labelPosition="left"></component>
                        </el-row>
                    </div>
                </div>
            </div>
            <div class="dialogFooter">
                <el-button  @click="dialogAddPeople=false">{{$t('mxpcweb.client.1529047588840')}}</el-button>
                <el-button type="primary" :loading="submitLoading" @click="submitAddFrom()">
                    <!-- 保存 -->
                    {{$t('mxpcweb.client.1529042806774')}}
                </el-button>
            </div>
        </div>
    </el-dialog>
</template>
<script>
/**
 * 描述：客户管理-客户列表-新增单据
 * 作者：何俊峰
 * 时间：2017/11/21
 */
import Controls from '@/components/Controls/index.js'
import GroupControls from '@/components/GroupControls/index.js'
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
            dialogAddPeople: false,
            firstInto: true,
            boxHeight: 0,
            optName: this.$t('mxpcweb.client.1529045936384'),
            thisModuleCode: '',
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
        setHeight() {
            this.boxHeight = 0.6 * parseInt($(window).height()) + 'px'
        },

        // 新建跟进
        openWindow(obj) {
            if (obj) {
                let { itemData, optData, moduleCode } = obj
                this.thisModuleCode = moduleCode
                this.optName = optData.optName
                this.optCode = optData.optCode
                this.moduleCode = optData.optModuleCode
                if (obj.next) {
                    this.callback = obj.next
                } else {
                    this.callback = () => {}
                }
                this.getEditSet(itemData, optData.optModuleCode)
                this.dialogAddPeople = true
            }
        },
        returnFieldList(data, field) {
            let fieldList = field.split(';')
            fieldList.forEach(element => {
                if (element != '') {
                    let elementList = element.split('=')
                    if (elementList[0] && elementList[1]) {
                        this.$refs['control'].forEach((items) => {
                            if (items.$attrs.nameId == elementList[0]) {
                                let value = data[elementList[1]] ? data[elementList[1]] : ''
                                items.updata(value, value)
                            }
                        })
                    }
                }
            })
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
        getEditSet(itemData, optModuleCode) { // 获取数据
            this.loading = true
            this.getAddEditSetList(optModuleCode, (editSets) => {
                let obj = JSON.stringify(editSets)
                let editSet = JSON.parse(obj)
                this.editSet = this.swidchEditSet(editSet.list)
                this.loading = false
                if (itemData) {
                    this.updatas(itemData)
                }
            })
        },
        closeWindow() {
            this.dialogAddPeople = false
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
        submitAddFrom() { // 提交新增客户数据
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
            this.submitLoading = true

            this.getFormKey((formKey, msg) => {
                if (formKey && formKey != '') {
                    this.$http.post(this.Global.baseURL + this.Global.api.v2.document_generalOperate_add, Object.assign(this.addPeopleFrom, {
                        'formKey': formKey
                    })).then((res) => {
                        if (res.body.code.toString() == this.Global.RES_OK) {
                            $('.addPeopleMXscroll').scrollTop(0)
                            this.dialogAddPeople = false
                            this.clearEditSet()
                            this.submitLoading = false
                            this.callback()
                            this.$message.success(this.msg(res.body))
                        } else {
                            this.submitLoading = false
                            this.$message.error(this.msg(res.body))
                        }
                        this.updateFormKey()
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
        clearEditSet() {
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
    components: Object.assign({}, Controls, GroupControls)
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
