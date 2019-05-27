<template>
    <div class="TabDetail">
        <ul>
            <li v-for="(item2,index2) in convertData" :key="index2" :class="isBlock(item2)">
                <!-- 没有字段名的为标题，分隔 -->
                <template v-if="item2.fieldName == ''">
                    <div class="componentTitle">{{item2.cnFieldCaption}}</div>
                </template>
                <!-- 不为组 -->
                <template v-else>
                    <template v-if="item2.fieldGroup == 0">
                        <component class="components" v-bind:is="'control'+item2.controlTypeId" :itemData="item2" @modifyData="modifyData" labelWidth="100px"></component>
                    </template>
                    <template v-else>
                        <component class="components" v-bind:is="'group'+item2.fieldGroup" :itemData="item2" :pageId="pageId" @modifyData="modifyData" labelWidth="100px"></component>
                    </template>
                </template>
            </li>
        </ul>
        <!-- 展开更多 -->
        <fly-button @flyBtnClick="flyBtnClick" :title="$t('mxpcweb.client.detail.1529994648057')" :mainObj="mainObj" :pageId="pageId" :moduleCode="moduleCode"></fly-button>

    </div>
</template>
<script>
import { mapGetters } from 'vuex'

import FlyButton from '../../FlyButton/index.vue'

import ControlsExhibition from '@/components/ControlsExhibition/index.js'
import GroupControlsExhibition from '@/components/GroupControlsExhibition/index.js'
export default {
    name: 'TabDetail',
    props: {
        // 详情数据是和主档一起的，所以从父传过来
        propData: {
            type: Array,
            default: function () {
                return []
            }
        },
        moduleCode: {
            type: String,
            default: ''
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
            groupList: [],
            convertData: []// 重组后的数据
        }
    },
    created() {
        this.getTabData()
        // console.log(this.convertData)
    },
    mounted() { },
    computed: {
        ...mapGetters(['sysBoxValue'])
    },
    methods: {
        // 特定字段给块状，整行显示
        isBlock(item2) {
            return item2.fieldName == '' || item2.fieldName == 'imagesId' || item2.fieldGroup == 1 ? 'block' : ''
        },
        getTabData() {
            let _this = this
            let groupData = this.sysBoxValue.filter(function (item, index) {
                return item.alias == 'fieldgrouptype'
            })
            if (groupData.length > 0 && groupData[0].dictItems) {
                this.groupList = groupData[0].dictItems
            }
            _this.convertData = _this.ControlsDataConvertItem(_this.propData)
        },
        // 返回组控件名称
        returnGroupName(fieldGroup) {
            let _this = this
            let name = ''
            _this.groupList.forEach(function (item) {
                if (fieldGroup == item.dictItemCode) {
                    name = item.itemName
                    return false
                }
            })
            return name
        },
        // 控件数据拆分组件和组
        ControlsDataConvertItem(list) {
            let _this = this
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
                            cnFieldCaption: _this.returnGroupName(element.fieldGroup),

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
        // 权限，修改前，判断下权限
        modifyData(modifyObj) {
            let _this = this
            let data = {
                moduleCode: _this.moduleCode,
                optCode: 'otEdit',
                identFieldValue: _this.pageId
            }
            ep.emit('setGlobalLoading', {
                val: true, // 打开loading
                text: '数据提交中...'
            })
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.document_rightCheck_do, { params: data }).then(function (res) {
                if (res.body.code.toString() === _this.Global.RES_OK) {
                    // console.log(res.body)
                    _this.modifyDataVal(modifyObj)// 修改单据
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.$message.error(_this.msg(res.body))
            })
        },
        // 修改控件传来的值
        modifyDataVal(modifyObj) {
            let _this = this
            modifyObj.moduleCode = _this.moduleCode
            modifyObj.identFieldValue = _this.pageId
            // console.log(" --- ")
            // console.log(modifyObj)
            _this.$http.put(_this.Global.baseURL + _this.Global.api.v2.document_generalOperate_put, modifyObj).then(function (res) {
                ep.emit('setGlobalLoading', {
                    val: false // 关闭loading
                })
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    /* 修改成功 */
                    _this.$message.success(_this.$t('mxpcweb.client.detail.1529994590697'))
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
                _this.$emit('tellFather')// 不管如何，重新调下新数据
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        // 点击漂浮按钮
        flyBtnClick(type, moduleNum, ot) {
            this.$emit('flyBtnClick', type, moduleNum, ot)
        }
    },
    components: Object.assign({
        'fly-button': FlyButton
    }, ControlsExhibition, GroupControlsExhibition),
    watch: {
        // 监听来刷新数据
        mainObj: function (newVal, oldVal) {
            this.getTabData()
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
