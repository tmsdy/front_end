<template>
    <div class="view2">
        <!-- 添加联系人，弹窗(列表单分开，客户添加时也用) -->
        <!-- 新增联系人 -->
        <div ref="myBox" v-show="!isMini">
            <el-dialog v-dialogDrag :title="optName" :visible.sync="isOpen" custom-class="width520" :closeOnClickModal="false" @close="resetForm()" :modal-append-to-body="false">
                <span @click="handleToggleMinimiza()" class="FM-MiniBtn iconfont icon-minus"></span>
                <div class="form_body MXscroll addPeopleMXscroll" style="min-height:400px" :style="'height:'+boxHeight" v-loading="loading">
                    <add-contacts-item :optCode="optCode" v-if="isOpen" :detailList="detailList" :moduleCode="moduleCode" ref="AddContactsItem" rightWidth="300px" rightWidths="148px"></add-contacts-item>
                </div>
                <div class="text-center" style="margin-bottom:5px;">
                    <!-- 取消 -->
                    <el-button @click="isOpen=false">{{$t('mxpcweb.client.1529047588840')}}</el-button>
                    <!-- 保存 -->
                    <el-button type="primary" :loading="submitLoading" @click="submitAddContacts()">{{$t('mxpcweb.client.1529042806774')}}</el-button>
                </div>
            </el-dialog>
        </div>
        <div v-if="isMini" @click="handleToggleMinimiza()" class="FM-MiniWindow">
            <i class="flag iconfont icon-contacts"></i>
            恢复新增窗口
        </div>
    </div>
</template>

<script>
/**
 * 描述：客户联系人，添加
 * 作者：向士健
 * 时间：2017/12/18
 * 动态识别控件组件的时候，当 Group!=0 时，以Group为准 否则以 Controls以准
 */
// import Loading from '@/basecomponents/Loading/index'
// import Controls from '@/components/Controls/index.js'
// import GroupControls from '@/components/GroupControls/index.js'
import AddContactsItem from '../Vue/BF003/index'
import { mapGetters, mapMutations } from 'vuex'
import { getAddEditSetList } from '@/page/Main/Client/mixins/index.js'
export default {
    name: 'view2',
    props: {
    },
    data() {
        return {
            isMini: false,
            isOpen: false, // 新增弹窗开关
            firstInto: true,
            boxHeight: 0,
            detailList: [],
            loading: true,
            submitLoading: false,
            moduleCode: '',
            optName: this.$t('mxpcweb.client.1529045815306'),
            optCode: '',
            callback: function () { }
        }
    },
    mounted() {
        this.setHeight()
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
        handleToggleMinimiza() {
            this.isMini = !this.isMini
        },
        openWindow(obj) {
            if (this.isOpen && this.isMini) {
                this.isMini = false
                return
            }
            if (obj && obj.optData) {
                this.optName = obj.optData.optName
                this.optCode = obj.optData.optCode
                this.moduleCode = obj.optData.optModuleCode
                if (obj.next) {
                    this.callback = obj.next
                } else {
                    this.callback = function () { }
                }
            }
            this.isOpen = true
            if (this.firstInto) {
                this.firstInto = false
            }
            this.getEditSet(obj)
        },
        updataOtherObjs(otherObjs) {
            if (otherObjs && otherObjs.length != 0) {
                let _this = this
                setTimeout(function () {
                    if (_this.$refs['AddContactsItem']) {
                        otherObjs.forEach(item => {
                            let { value, fieldName, disable } = item
                            if (value && _this.$refs['AddContactsItem'].$refs['control']) {
                                _this.$refs['AddContactsItem'].$refs['control'].forEach((items) => {
                                    if (items.$attrs.nameId == fieldName) {
                                        items.updatas(value, disable)
                                    }
                                })
                            }
                        })
                    }
                }, 20)
            }
        },
        updatas(itemData, otherObj) {
            if (itemData && itemData != {}) {
                let _this = this
                setTimeout(function () {
                    if (_this.$refs['AddContactsItem']) {
                        _this.$refs['AddContactsItem'].show(itemData)
                    }
                }, 20)
            }
            if (otherObj && otherObj != {}) {
                let _this = this
                setTimeout(function () {
                    if (_this.$refs['AddContactsItem']) {
                        let { value, fieldName, disable } = otherObj
                        if (value && _this.$refs['AddContactsItem'].$refs['control']) {
                            _this.$refs['AddContactsItem'].$refs['control'].forEach((items) => {
                                if (items.$attrs.nameId == fieldName) {
                                    items.updatas(value, disable)
                                }
                            })
                        }
                    }
                }, 20)
            }
        },
        getEditSet(obj) {
            let _this = this
            _this.loading = true
            _this.getAddEditSetList(_this.moduleCode, function (editSets) {
                let objs = JSON.stringify(editSets)
                let editSet = JSON.parse(objs)
                _this.detailList = _this.swidchEditSet(editSet.list)
                if (obj) {
                    let { itemData, otherObj } = obj
                    _this.updatas(itemData, otherObj)
                    if (obj.otherObjs) {
                        _this.updataOtherObjs(obj.otherObjs)
                    }
                }
                _this.loading = false
            })
        },
        swidchEditSet(list) {
            let _this = this
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
                            cnFieldCaption: _this.returnGroupName(element.fieldGroup),
                            isTop: element.isTop,
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
                    newLList.push(element)
                }
            })
            return newLList
        },
        // 父组件来调用，获得数据，提交时来调用取数据
        isGetConatctsData() {
            let newData = this.$refs['AddContactsItem'].isGetConatctsData()
            return newData
        },
        tellFather() {
            this.isOpen = false
            this.submitLoading = false
            this.callback()
        },
        tellFather1() {
            this.submitLoading = false
        },
        // 清空表单
        resetForm(formName) {
            // this.$refs.AddContactsItem.clearControlsData();
        },

        // 保存添加联系人
        submitAddContacts() {
            this.submitLoading = true
            this.$refs.AddContactsItem.isSubmit(this.tellFather, this.tellFather1)
        }
    },
    watch: {
        screenHeight(val) { // 监听屏幕宽度变化
            this.setHeight()
        }
    },
    computed: {
        ...mapGetters([
            'screenHeight'
        ]),
        ...mapGetters('client', [
            'addEditSetList'
        ])
    },
    beforeDestroy: function () {
        this.getEditSet = null
    },
    components: {
        'add-contacts-item': AddContactsItem
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "../miniWindow.less";
@import "./zh-cn.less";
@import "./en.less";
.FM-MiniWindow {
    bottom: 55px;
    .flag {
        background-color: #5ddbe0;
    }
}
</style>
