<template>
    <div>
        <loading v-if="isLoading" style="margin-top: 55px;"></loading>
        <no-data v-if='!isLoading && contactsList.length===0' :title="$t('mxpcweb.client.detail.1529994466441')" img="noAddress"></no-data>

        <draggable v-if='contactsList.length>0' v-model="contactsList" :options="{group:'group01', handle:'.boxHeader'}" @start="drag=true" @end="drag=false" element="ul" class="Contact flex">
            <li class="panel transition_all" v-for="(item,index) in contactsList" :key="index">

                <div class="boxHeader transition_all">
                    <!--<div class="name">{{ item.deptName }}</div>-->
                    <div class="displayOperation">
                        <span class="left">
                            <i v-if="item.sex === '2'" class="iconfont icon-woman girl" title="woman"></i>
                            <i v-if="item.sex === '1'" class="iconfont icon-man male" title="man"></i>
                            <i v-if="item.sex === '0'" class="iconfont icon-avatar unknow" title="unknow"></i>
                            <span class="contName" :title="item.contName">{{ item.contName }}</span>
                            <span class="nickName">{{item.nickName}}</span>
                        </span>
                        <!--<span class="left" v-if="index===0" title="主联系人">
                                        <i class="iconfont icon-avatar avatar"></i>
                                    </span>-->
                        <span class="pull-right">
                            {{item.jobs}}
                        </span>
                        <detail-opt styleType="mini" class="detailOpt" @getListData="getListData()" :detailOptData="detailOptData" :itemData="item" moduleStructId="contId" :moduleCode="itemData.bindModuleCode"></detail-opt>
                    </div>
                    <!--<div class="contactsJob" v-if="item.jobs !== '' && item.jobs !== undefined">
                                    <el-tag>{{item.jobs}}</el-tag>
                                </div>-->
                </div>

                <div class="itemBody MXscroll">
                    <div v-for="(item2,index2) in item.arrayItem" :key="index2">
                        <template v-if="item2.fieldGroup == 0">
                            <component v-bind:is="'control'+item2.controlTypeId" :itemData="item2" @modifyData="modifyData" labelWidth="72px"></component>
                        </template>
                        <template v-else>
                            group
                        </template>
                    </div>
                </div>

            </li>
        </draggable>
        <!-- 暂无联系人 -->

        <!-- 新增联系人 -->
        <fly-button @flyBtnClick="$emit('flyBtnClick', itemData.bindModuleCode, 'otNew')" :fly="false" :title="$t('mxpcweb.client.detail.1529994507329')" :mainObj="mainObj"></fly-button>
    </div>
</template>
<script>
import { isObject, isArray } from '@/libs/utils.js'
import Loading from '@/basecomponents/Loading/index'
import draggable from 'vuedraggable'
import NoData from '@/basecomponents/NoData/index'
import detailOpt from '../../../ClientManagIndex/detailOpt/index'

import ControlsExhibition from '@/components/ControlsExhibition/index.js'
import GroupControlsExhibition from '@/components/GroupControlsExhibition/index.js'
import FlyButton from '../../FlyButton/index.vue'
export default {
    name: 'Contact',
    props: {
        windowMode: {
            type: Boolean,
            default: false
        },
        itemData: {
            type: Object,
            default: function () {
                return {}
            }
        },
        pageId: {
            type: String,
            default: ''
        },
        mainObj: {
            type: Object,
            default: function () {
                return {}
            }
        }
    },
    data() {
        return {
            isLoading: true,
            contactsList: [],
            groupList: [], // 为了取得组名
            detailOptData: [] // 列表右边的详情操作
        }
    },
    created() {
        // this.getTabData()
    },
    methods: {
        getListData() {
            this.getTabData()
            this.$emit('tellFather')
        },
        // 权限
        modifyData(modifyObj) {
            let data = {
                moduleCode: this.itemData.bindModuleCode,
                optCode: 'otEdit',
                identFieldValue: modifyObj.contId
            }
            ep.emit('setGlobalLoading', {
                val: true, // 打开loading
                text: '数据提交中...'
            })
            this.$http.get(this.Global.baseURL + this.Global.api.v2.document_rightCheck_do, { params: data }).then(function (res) {
                if (res.body.code.toString() === this.Global.RES_OK) {
                    // console.log(res.body)
                    this.modifyDataVal(modifyObj)// 修改单据
                } else {
                    this.$message.error(this.msg(res.body))
                }
            }, function (res) {
                this.$message.error(this.msg(res.body))
            })
        },
        // 接口名称: 修改单据 修改单个编辑控件传来的值
        modifyDataVal(modifyObj) {
            // console.log(modifyObj);
            modifyObj['moduleCode'] = this.itemData.bindModuleCode
            modifyObj['identFieldValue'] = modifyObj.contId
            // console.log(modifyObj);
            this.$http.put(this.Global.baseURL + this.Global.api.v2.document_generalOperate_put, modifyObj).then(function (res) {
                ep.emit('setGlobalLoading', {
                    val: false // 关闭loading
                })
                if (res.body.code.toString() == this.Global.RES_OK) {
                    /* 修改成功 */
                    this.$message.success(this.$t('mxpcweb.client.detail.1529994590697'))
                } else {
                    this.$message.error(this.msg(res.body))
                }
                this.$emit('tellFather')// 更新，成功没成功，都更新
            }, function (res) {
                this.$message.error(this.$t(this.Global.errorTitle))
            })
        },
        // 获取组控件列表
        getGroupList() {
            this.$http.get(this.Global.baseURL + this.Global.api.v2.dictionary + 'fieldgrouptype', { params: {} }).then(function (res) {
                if (res.body.code.toString() == this.Global.RES_OK && isArray(res.body.data)) {
                    this.groupList = res.body.data
                } else {
                    this.$message.error(this.msg(res.body))
                }
            }, function (res) {
                this.loading = false
                this.$message.error(this.$t(this.Global.errorTitle))
            })
        },
        // 返回组控件名称
        returnGroupName(fieldGroup) {
            let name = ''
            this.groupList.forEach(function (item) {
                if (fieldGroup == item.dictItemCode) {
                    name = item.itemName
                    return false
                }
            })
            return name
        },
        // 控件数据拆分组件和组
        ControlsDataConvertItem(list) {
            let newLList = []
            let groupFirst = []
            if (!list) { return }
            list.forEach((element) => {
                // element.checkbox = (element.fieldCategory == 2);//是否启用
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
                            cnFieldCaption: this.returnGroupName(element.fieldGroup),
                            fieldGroup: element.fieldGroup,
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
                    if (element.controlTypeId != 0) {
                        element.controlData = ''
                    }
                    newLList.push(element)
                }
            })
            return newLList
        },
        getTabData() {
            this.getGroupList()
            let data = {
                // 接口名称: 获取单据列表
                generalOperate: {
                    moduleCode: this.itemData.bindModuleCode,
                    searchType: 'allList',
                    order: 'asc',
                    sort: 'createDate',
                    custId: this.pageId,
                    from: 0,
                    size: 100
                },
                // 接口名称: 获取业务字段展示
                fieldShow: {
                    moduleCode: this.itemData.bindModuleCode,
                    type: 'viewSet'
                },
                // 社交类型所有数据
                socialType: {},

                // 接口名称: 获取单据操作项
                moduleOptSet: {
                    viewType: this.windowMode ? this.getRoute('/main/client/tabs/list/BF001').viewType : this.getRoute().viewType,
                    moduleCode: this.itemData.bindModuleCode
                }
            }
            this.$http.get(this.Global.baseURL + this.Global.api.Client.list.getListDetail_contacts, { params: data }).then((res) => {
                this.isLoading = false
                if (res.body.code.toString() == this.Global.RES_OK && isObject(res.body.data)) {
                    // console.log(" =========================================================== ");
                    // console.log(res.body.data);
                    // console.log(" =========================================================== ");
                    let { res_generalOperate, res_fieldShow, res_socialType, res_moduleOptSet } = res.body.data
                    // 过期判断
                    if (!isArray(res_socialType.data) || !isObject(res_moduleOptSet.data) || !isObject(res_generalOperate.data) || !isArray(res_fieldShow.data)) {
                        return
                    }
                    // 空对象处理
                    if (Object.keys(res_generalOperate.data).length == 0) {
                        return
                    }

                    // 列表操作项
                    this.detailOptData = res_moduleOptSet.data.detailOpt

                    // 过滤掉不需在列表操作的项
                    let noArray = ['custId', 'contName', 'sex', 'nickName', 'jobs']
                    // let noArray = ['custId','contName','sex','nickName','cardImagesId','imagesId','','birthday','','','tel','mobile',''];
                    res_fieldShow.data = res_fieldShow.data.filter(function (item) {
                        return noArray.indexOf(item.fieldName) == -1 && item.fieldGroup != 3
                    })

                    let allListData = res_generalOperate.data.list
                    // console.log(allListData);

                    // 对应的值，传入对象
                    allListData.forEach((item, index) => {
                        item['arrayItem'] = []
                        res_fieldShow.data.forEach((item2) => {
                            item['arrayItem'].push({
                                social: item2.fieldName == 'social' ? res_socialType.data : [], // 社交
                                custId: item.custId,
                                contId: item.contId,
                                cnFieldCaption: item2.cnFieldCaption,
                                controlTypeId: item2.controlTypeId,
                                fieldGroup: item2.fieldGroup,
                                fieldName: item2.fieldName,
                                fieldValue: item[item2.fieldName] || '', // 值传进去
                                editState: this.mainObj.delState == 1 || this.mainObj.seasFlag == 1 ? 0 : item2.editState
                            })
                        })
                    })

                    // 判断列表是不是为空
                    if (allListData.length === 0) {
                        this.contactsList = []
                    } else {
                        this.contactsList = allListData
                    }
                    // console.log(this.contactsList);
                } else {
                    this.$message.error(this.msg(res.body))
                }
            }, function (res) {
                this.$message.error(this.$t(this.Global.errorTitle))
            })
        }
    },
    components: Object.assign({
        'no-data': NoData,
        loading: Loading,
        'draggable': draggable,
        'detail-opt': detailOpt,
        'fly-button': FlyButton
    }, ControlsExhibition, GroupControlsExhibition)
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
