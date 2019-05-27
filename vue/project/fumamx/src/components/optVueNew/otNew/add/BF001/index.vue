<template>
    <!-- 新增客户 -->
    <div>
        <div ref="myBox" v-show="!isMini">
            <el-dialog v-dialogDrag :title="optName" :visible.sync="dialogAddPeople" :closeOnClickModal="false" custom-class="width1020" :modal-append-to-body="false">
                <span @click="handleToggleMinimiza()" class="FM-MiniBtn iconfont icon-minus"></span>
                <div class="addPeople">
                    <div v-loading="loading" class="MXscroll addPeopleMXscroll" style="overflow-y:scroll;min-height:400px" :style="'height:'+boxHeight">
                        <el-row v-if="dialogAddPeople">
                            <el-col :span="12">
                                <template v-for="(item,index) in editSet" style="margin-top:5px;">
                                    <template v-if="item.fieldGroup == 0">
                                        <template v-if="item.fieldCategory == 4">
                                            <p class="contactTitle" :key="index">{{ item.cnFieldCaption }}</p>
                                        </template>
                                        <template v-else>
                                            <component :dataId="'control'+index" :nameId="item.fieldName" :optCode="optCode" :moduleCode="moduleCode" style="padding-left:20px;padding-right:20px" labelPosition="left" labelWidth="80px" :key="index" @openCheck="openCheck" @closeWindow="closeWindow" :checkRepeat="true" rightWidth="300px" ref="control" v-bind:is="'control'+item.controlTypeId" :itemData="item" :controlData.sync="item.controlData"></component>
                                        </template>
                                    </template>
                                    <template v-else>
                                        <component :optCode="optCode" :moduleCode="moduleCode" :key="index" :dataId="'control'+index" nameId="" style="padding-left:20px" labelPosition="left" labelWidth="80px" v-bind:is="'group'+item.fieldGroup" rightWidth="300px" rightWidth1="148px" ref="control" :itemData="item"></component>
                                    </template>
                                </template>
                            </el-col>
                            <el-col :span="12">
                                <!-- 主联系人 -->
                                <p class="contactTitle">{{$t('mxpcweb.client.1529026890672')}}</p>
                                <add-contacts-item :optCode="optCode" moduleCode="BF003" ref="AddContactsItem" :detailList="detailList" rightWidth="300px" rightWidth1="148px" style="margin-left:20px" :isShowCustomer="false"></add-contacts-item>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="dialogFooter">
                        <el-button type="primary" size="small" :loading="submitLoading" @click="submitAddFrom(true)">
                            <!-- 保存 -->
                            {{$t('mxpcweb.client.1529042806774')}}
                        </el-button>
                        <!-- 保存后继续新增 -->
                        <el-button type="primary" size="small" :loading="submitLoading" @click="submitAddFrom()">{{$t('mxpcweb.client.1529042822379')}}</el-button>
                        <!-- 保存后查看 -->
                        <el-button type="primary" size="small" :loading="submitLoading" @click="submitAddFrom(true,true)">{{$t('mxpcweb.client.1529042838547')}}</el-button>
                    </div>
                    <check-repeat :moduleCode="moduleCode" ref="checkRepeat"></check-repeat>
                    <to-repeat :moduleCode="moduleCode" ref="toRepeat" @openWindow="openWindow" @closeWindow="closeWindow" :isAdd="true"></to-repeat>
                </div>
            </el-dialog>
        </div>
        <div v-if="isMini" @click="handleToggleMinimiza()" class="FM-MiniWindow">
            <i class="flag iconfont icon-people_list_light"></i>
            恢复新增窗口
        </div>
    </div>
</template>
<script>
/**
 * 描述：客户管理-客户列表-新增客户
 * 作者：何俊峰
 * 时间：2017/11/21
 */
import Controls from '@/components/Controls/index.js'
import GroupControls from '@/components/GroupControls/index.js'
import AddContactsItem from '../Vue/BF003/index'
import checkRepeat from '../Vue/checkRepeat.vue'
import toRepeat from '../Vue/toRepeat.vue'
import { mapGetters, mapMutations } from 'vuex'
import { getAddEditSetList } from '@/page/Main/Client/mixins/index.js'
export default {
    name: 'view1',
    props: {
    },
    data() {
        return {
            isMini: false,
            addPeopleFrom: {

            },
            editSet: [],
            loading: true,
            submitLoading: false,
            dialogAddPeople: false,
            firstInto: true,
            boxHeight: 0,
            detailList: [],
            optCode: '',
            moduleCode: '',
            searchType: '',
            optName: this.$t('mxpcweb.client.1529042727717'),
            callback: () => { }
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
        handleToggleMinimiza() {
            this.isMini = !this.isMini
        },
        lookCust(item) { // 跳转客户详情
            this.closeWindow()
            item.moduleCode = 'BF001'
            item.billId = item.custId
            this.clientDetailPage(item)
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
        getEditSet(obj) { // 获取数据
            let p1 = new Promise((resolve, reject) => {
                this.getAddEditSetList(this.moduleCode, (editSets) => {
                    resolve(editSets)
                })
            })
            let p2 = new Promise((resolve, reject) => {
                this.getAddEditSetList('BF003', (editSets) => {
                    resolve(editSets)
                })
            })
            Promise.all([p1, p2]).then((results) => {
                let objs1 = JSON.stringify(results[0])
                let editSet1 = JSON.parse(objs1)
                this.editSet = this.swidchEditSet(editSet1.list)

                let objs = JSON.stringify(results[1])
                let editSet = JSON.parse(objs)
                let detailList = editSet.list.filter((item) => {
                    return item.fieldName !== 'custId'
                })
                this.detailList = this.swidchEditSet(detailList)
                if (obj && obj.otherObj) {
                    let { value, fieldName, model, disable } = obj.otherObj
                    if (value) {
                        setTimeout(() => {
                            if (model == 'BF001') { // 判断是什么模块的字段
                                this.$refs['control'].forEach((items) => {
                                    if (items.$attrs.nameId == fieldName) {
                                        items.updatas(value, disable)
                                    }
                                })
                            }
                            if (model == 'BF003') { // 判断是什么模块的字段
                                if (this.$refs['AddContactsItem'].$refs['control']) {
                                    this.$refs['AddContactsItem'].$refs['control'].forEach((items) => {
                                        if (items.$attrs.nameId == fieldName) {
                                            items.updatas(value, disable)
                                        }
                                    })
                                }
                            }
                        }, 20)
                    }
                }
                if (obj && obj.otherObjs) {
                    obj.otherObjs.forEach(item => {
                        let { value, fieldName, model, disable } = item
                        if (value) {
                            setTimeout(() => {
                                if (model == 'BF001') { // 判断是什么模块的字段
                                    this.$refs['control'].forEach((items) => {
                                        if (items.$attrs.nameId == fieldName) {
                                            items.updatas(value, disable)
                                        }
                                    })
                                }
                                if (model == 'BF003') { // 判断是什么模块的字段
                                    this.$refs['AddContactsItem'].$refs['control'].forEach((items) => {
                                        if (items.$attrs.nameId == fieldName) {
                                            items.updatas(value, disable)
                                        }
                                    })
                                }
                            }, 20)
                        }
                    })
                }
                this.loading = false
            })
        },
        openWindow(obj) {
            if (this.dialogAddPeople && this.isMini) {
                this.isMini = false
                return
            }
            this.dialogAddPeople = true
            if (this.firstInto) {
                this.firstInto = false
            } else {
                this.clearEditSet()
            }
            if (obj.next) {
                this.callback = obj.next
            } else {
                this.callback = () => { }
            }
            if (obj && obj.optData) {
                this.optName = obj.optData.optName
                this.optCode = obj.optData.optCode
                this.moduleCode = obj.optData.optModuleCode
            }
            this.getEditSet(obj)
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
        submitAddFrom(argument, toDetail) { // 提交新增客户数据
            this.submitLoading = true
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
            let custContact = {}
            if (!isPass) {
                this.submitLoading = false
                return isPass
            } else {
                custContact = this.$refs.AddContactsItem.isGetConatctsData()
                if (!custContact) {
                    this.submitLoading = false
                    return false
                }
            };
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
            this.getFormKey((formKey, msg) => {
                if (formKey && formKey != '') {
                    this.$http.post(this.Global.baseURL + this.Global.api.v2.customerWithContact_add, {
                        'customer': this.addPeopleFrom,
                        'custContact': custContact,
                        'formKey': formKey
                    }).then((res) => {
                        if (res.body.code.toString() == this.Global.RES_OK) {
                            $('.addPeopleMXscroll').scrollTop(0)
                            this.dialogAddPeople = !argument
                            this.clearEditSet(!argument)
                            this.submitLoading = false
                            this.callback(res.body.data)
                            if (toDetail) {
                                this.lookCust(res.body.data)
                            }
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
            if (argument) {
                this.$refs['control'].forEach((item) => {
                    item.clearData()
                })
                this.$refs.AddContactsItem.clearControlsData()
            }
        }
    },
    watch: {
        screenHeight(val) { // 监听屏幕宽度变化
            this.setHeight()
        }
    },
    beforeDestroy: () => {
        this.lookCust = null
        this.getEditSet = null
    },
    components: Object.assign({
        'add-contacts-item': AddContactsItem,
        'check-repeat': checkRepeat,
        'to-repeat': toRepeat
    }, Controls, GroupControls)
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "../miniWindow.less";
@import "./zh-cn.less";
@import "./en.less";
</style>
