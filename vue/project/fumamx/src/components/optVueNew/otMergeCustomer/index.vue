<template>
    <div class="marge">
        <!-- 客户合并 -->
        <el-dialog v-dialogDrag :title="$t('mxpcweb.client.1529053535838')" :visible.sync="dialog" :closeOnClickModal="false" custom-class="width820">
            <!-- 动态组件 -->
            <div class="listBox MXscroll" style="min-height:400px;" v-if="dialog" :style="'height:'+boxHeight" v-loading="loading">
                <template>
                    <el-row :gutter="20" style="margin: 0;">
                        <el-col :span="8" class="mini-box bg-color">
                            <div class="list1 ellipsis" style="text-align:left">
                                <!-- 合并后主档 -->
                                <span class="cnFieldCaption">{{$t('mxpcweb.client.1529053626530')}}</span>
                                <template v-if="list.length!=0">
                                    <span class="content" :title="list[0].custName" v-if="parseInt(allSelect)==0">{{list[0].custName}}</span>
                                    <span class="content" :title="list[1].custName"  v-if="parseInt(allSelect)==1">{{list[1].custName}}</span>
                                </template>
                            </div>
                        </el-col>
                        <el-col :span="16" class="mini-box" style="padding:0;">
                            <el-radio-group v-model="allSelect" @change="change">
                                <el-row style="margin: 0;">
                                    <el-col :span="12">
                                        <div class="list1 ellipsis" style="border-bottom: 0;padding:0 10px;">
                                            <el-radio class="radio" label="0list">
                                                <!-- 全选 -->
                                                <span class="allCheck">{{$t('mxpcweb.client.1529053640498')}}</span>
                                                <!-- 客户 -->
                                                {{$t('mxpcweb.client.1529049476377')}}(<span :title="list[0]?list[0].custName:''">{{list[0]?list[0].custName:''}}</span>)
                                            </el-radio>
                                        </div>
                                    </el-col>
                                    <el-col :span="12">
                                        <div class="list1 ellipsis" style="border-bottom: 0;border-left: 1px solid rgba(228, 228, 228, 1);padding:0 10px;">
                                            <el-radio class="radio"  label="1list" :disabled="list[1].affCompanyId && list[1].affCompanyId == ''">
                                                <!-- 全选 -->
                                                <span class="allCheck">{{$t('mxpcweb.client.1529053640498')}}</span>
                                                <!-- 客户 -->
                                                {{$t('mxpcweb.client.1529049476377')}}(<span :title="list[1]?list[1].custName:''">{{list[1]?list[1].custName:''}}</span>)
                                            </el-radio>
                                        </div>
                                    </el-col>
                                </el-row>
                            </el-radio-group>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" style="margin: 0;">
                        <el-col :span="8" class="mini-box bg-color" style="padding:0">
                            <template v-for="(item,index) in editSet" >
                                <div v-if="item.controlTypeId!=0&&item.controlTypeId!=14" class="list ellipsis" :key="index">
                                    <span class="cnFieldCaption" :style="item.isNotNull?'color:red':''">{{item.cnFieldCaption}}</span>
                                    <span v-if="parseInt(item.value+'')==3"></span>
                                    <span v-else class="content">
                                        <template v-if="item.fieldGroup==0">
                                            <span v-if="item.controlTypeId==2||item.controlTypeId==38">{{returnFieldName(item.dictCode,list[parseInt(item.value+'')][item.fieldName+''])}}</span>
                                            <span v-else-if="item.controlTypeId==3||item.controlTypeId==37">
                                                {{returnCusFieldName(item.dictCode,list[parseInt(item.value+'')][item.fieldName+''])}}
                                            </span>
                                            <span v-else-if="item.controlTypeId==15">
                                                <img class="openImg" v-for="(img,imgindex) in list[parseInt(item.value+'')][item.fieldName+'']" :key="imgindex" :src="picUrl(img,'80x80')">
                                            </span>
                                            <span v-else-if="item.controlTypeId==17">
                                                <cust-name :custId="list[parseInt(item.value+'')][item.fieldName+'']"></cust-name>
                                            </span>
                                            <span v-else>{{list[parseInt(item.value+'')][item.fieldName+'']?list[parseInt(item.value+'')][item.fieldName+'']:''}}</span>
                                        </template>
                                        <template v-else>
                                            <region :group="item" :items="list[parseInt(item.value+'')]" :types="item.value"></region>
                                        </template>
                                    </span>
                                </div>
                            </template>
                        </el-col>
                        <el-col :span="8" v-for="(items,indexs) in list"  :key="indexs" class="mini-box" style="padding:0">

                            <template v-for="(item,index) in editSet" >
                                <div  v-if="item.controlTypeId!=0&&item.controlTypeId!=14" class="list ellipsis" :key="index">
                                    <template v-if="item.fieldGroup==0">
                                        <el-radio  class="radio" v-model="item.value" :label="indexs+''+item.fieldName">
                                            <span v-if="item.controlTypeId==2||item.controlTypeId==38">{{returnFieldName(item.dictCode,list[indexs][item.fieldName+''])}}</span>
                                            <span v-else-if="item.controlTypeId==3||item.controlTypeId==37">{{returnCusFieldName(item.dictCode,list[indexs][item.fieldName+''])}}</span>
                                            <span v-else-if="item.controlTypeId==15">
                                                <img class="openImg" v-for="(img,imgindex) in list[indexs][item.fieldName+'']" :key="imgindex" :src="picUrl(img,'80x80')">
                                            </span>
                                            <span v-else-if="item.controlTypeId==17">
                                                <cust-name  :moduleCode="moduleCode" :custId="list[indexs][item.fieldName+'']"></cust-name>
                                            </span>
                                            <span v-else>{{items[item.fieldName+'']?items[item.fieldName+'']:''}}</span>
                                        </el-radio>
                                    </template>
                                    <template v-else>
                                        <el-radio class="radio" v-model="item.value" :label="indexs+''+item.fieldName">
                                            <region  :moduleCode="moduleCode"  :group="item" :items="items"></region>
                                        </el-radio>
                                    </template>
                                </div>
                            </template>
                        </el-col>
                    </el-row>
                </template>
            </div>
            <div slot="footer" class="dialogFooter" style="text-align:center">
                <!-- 取消 -->
                <el-button @click="dialog=false">{{$t('mxpcweb.client.1529047588840')}}</el-button>
                <!-- 合并 -->
                <el-button type="primary" @click="save()" :loading="subLoading">{{$t('mxpcweb.client.1529053721235')}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
/**
 * 描述：客户管理-客户列表-编辑客户
 * 作者：何俊峰
 * 时间：2017/11/22
 */
import { isArray, delEmptyStrObj} from '@/libs/utils.js'
import custName from '../vue/custName.vue'
import region from '../vue/region.vue'
import { mapGetters } from 'vuex'
export default {
    name: 'marge',
    props: {
    },
    data() {
        return {
            dialog: false,
            editSet: [],
            boxHeight: 0,
            list: [],
            allSelect: 3,
            allSelectBase: 3,
            loading: true,
            subLoading: false,
            moduleCode: '',
            callback: function() {}
        }
    },
    created() {
    },
    mounted() {
        this.setHeight()
    },
    computed: {
        ...mapGetters([
            'sysBoxValue',
            'cusBoxValue',
            'screenHeight'
        ])
    },
    methods: {
        setHeight() {
            this.boxHeight = 0.6 * parseInt($(window).height()) + 'px'
        },
        change(val) {
            if (val == 3) {
                return false
            }
            let isCust1 = false
            let isCust2 = false
            if (this.list[0].affCompanyId && this.list[0].affCompanyId != '') {
                isCust1 = true
            }
            if (this.list[1].affCompanyId && this.list[1].affCompanyId != '') {
                isCust2 = true
            }
            if (isCust1 && isCust2) {
                this.$message('客户<' + this.list[0].custName + '>与客户<' + this.list[1].custName + '>都已关联企业，无法合并！')
                this.allSelect = this.allSelectBase
                return false
            }
            if (isCust1 && !isCust2 && val == '1list') {
                this.$message('客户<' + this.list[0].custName + '>已关联企业，无法被合并！')
                this.allSelect = this.allSelectBase
                return false
            }
            if (!isCust1 && isCust2 && val == '0list') {
                this.$message('客户<' + this.list[1].custName + '>已关联企业，无法被合并！')
                this.allSelect = this.allSelectBase
                return false
            }
            if (this.allSelectBase != this.allSelect) {
                this.editSet.forEach(function(item) {
                    item.value = parseInt(val) + '' + item.fieldName
                })
                this.allSelectBase = this.allSelect
            }
        },
        save() {
            let _this = this
            let form = {}
            if (parseInt(_this.allSelect) == 0) {
                form['mergeCustId'] = _this.list[0].custId
                form['beMergeCustId'] = _this.list[1].custId
            } else if (parseInt(_this.allSelect) == 1) {
                form['mergeCustId'] = _this.list[1].custId
                form['beMergeCustId'] = _this.list[0].custId
            } else {
                // 请选择一个客户做为主档客户
                 _this.$message(this.$t('mxpcweb.client.1529053745899'))
                 return false
            }
            let customer = {}
            this.editSet.forEach(function(item) {
                if (item.controlTypeId != 0 && item.controlTypeId != 14) {
                    if (parseInt(item.value + '') != 3) {
                        customer[item.fieldName + ''] = _this.list[parseInt(item.value + '')][item.fieldName + ''] == undefined ? '' : _this.list[parseInt(item.value + '')][item.fieldName + '']
                    }
                }
            })
            form.customer = customer
            delEmptyStrObj(form, true)
            // console.log(form);
            _this.subLoading = true
            _this.$http.post(this.Global.baseURL + this.Global.api.v2.customerMerge_do, form).then((res) => {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.subLoading = false
                    _this.callback()
                     this.dialog = false
                     _this.$message.success(_this.msg(res.body))
                } else {
                    _this.subLoading = false
                    _this.$message.error(_this.msg(res.body))
                }
            }, (res) => {
                _this.subLoading = false
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },

        openWindow(obj) {
            let {billId, customerLists, next} = obj
            this.moduleCode = obj.optData.optModuleCode
            if (next) {
                this.callback = next
            } else {
                this.callback = function() {}
            }
            if (billId.length == 2) {
                let list = []
                billId.forEach(function(items, indexs) {
                    customerLists.forEach(function(item, index) {
                        if (item.custId == items) {
                            list.push(item)
                        }
                    })
                })
                this.list = list
                this.dialog = true
                if (this.editSet.length == 0) {
                    this.getEditSet()
                } else {
                    this.editSet.forEach(function(item) {
                        item.value = 3
                    })
                    this.allSelect = 3
                    this.allSelectBase = 3
                }
            } else {
                // 请选中两位客户进行合并操作!
                // 提示
                // 我知道了
                this.$confirm(this.$t('mxpcweb.client.1529052307352'), this.$t('mxpcweb.client.1529047715824'), {
                    confirmButtonText: this.$t('mxpcweb.client.1529052329386'),
                    type: 'warning'
                }).then(() => {
                }).catch(() => {
                })
            }
        },
        getEditSet() { // 获取数据
            let _this = this
            _this.loading = true
            _this.$http.get(this.Global.baseURL + this.Global.api.v2.fieldShow_get, { params: {
                moduleCode: _this.moduleCode,
                type: 'modifyEditSet'
            }}).then((res) => {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                   let editSet = _this.swidchEditSet(res.body.data)
                   _this.editSet = editSet
                    _this.allSelect = 3
                   _this.loading = false
                } else {
                   _this.loading = false
                    _this.$message.error(_this.msg(res.body))
                }
            }, (res) => {
                _this.loading = false
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        // 图片展示的URL
        picUrl(picId, picSize) {
            return this.getGlobalImgSrc(picId, picSize)
        },
        swidchEditSet(list) {
            let _this = this
             let newLList = []
             let groupFirst = []
            list.forEach((element) => {
                element.value = 3
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
                            value: 3,
                            group: [],
                            fieldName: element.fieldName
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
        },

         // 从系统字段的下拉列表中匹配code对应的名称
        returnFieldName(dictCode, dictItemCode) { // 返回字段名称
            let _this = this
            if (!dictItemCode) {
                return ''
            };
            let value = []
            let dictItem = (dictItemCode + '').split(',')
            let options = _this.getFieldData(dictCode)
            dictItem.forEach(function(item) {
                options.forEach(function(element) {
                    if (element.dictItemCode == item) {
                        value.push(element.itemName)
                    }
                })
            })
            return value.join(',')
        },
        returnCusFieldName(dictCode, dictItemCode) {
            let _this = this
            if (!dictItemCode) {
                return ''
            };
            let value = []
            let dictItem = (dictItemCode + '').split(',')
            let options = _this.getCusFieldData(dictCode)
            dictItem.forEach(function(item) {
                options.forEach(function(element) {
                    if (element.dictItemCode == item) {
                        value.push(element.itemName)
                    }
                })
            })
            return value.join(',')
        },
        // 到系统取得相应字段的下拉列表
        getFieldData(dictCode) {
            let options = []
            if (isArray(this.sysBoxValue) && this.sysBoxValue != undefined) {
                this.sysBoxValue.forEach(element => {
                    if (element.dictCode == dictCode) {
                    options = element.dictItems
                    }
                })
            }
            return options
        },
        // 到系统取得相应字段的下拉列表
        getCusFieldData(dictCode) {
            let options = []
            if (isArray(this.cusBoxValue) && this.cusBoxValue != undefined) {
                this.cusBoxValue.forEach(element => {
                    if (element.dictCode == dictCode) {
                    options = element.customDictitems
                    }
                })
            }
            return options
        }
    },
    watch: {
        screenHeight(val) { // 监听屏幕宽度变化
            this.setHeight()
        }
    },
    components: {
        'cust-name': custName,
        'region': region
    },
    beforeDestroy: function () {
        this.getFieldData = null
        this.getCusFieldData = null
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.marge{
    .el-radio-group{
        width: 100%;
    }
    .cnFieldCaption{
        display:inline-block;
        width:80px;
    }
    .listBox{
        width: 100%;
        padding: 0 10px;
        overflow: auto;
        .bg-color{
            background: inherit;
            background-color: rgba(242, 242, 242, 1);
        }

        .list{
            height: 40px;
            line-height: 40px;
            border-bottom: 1px solid rgba(228, 228, 228, 1);
            padding:0 10px;
            .openImg {
                width: 30px;
                height: 30px;
                border-radius: 3px;
                position: relative;
                border: 1px #cccccc solid;
                margin-right: 5px;
                vertical-align: middle;
            }
        }
        .allCheck{
            color: #FF9900;
        }
        .list1{
            text-align: center;
            height: 40px;
            line-height: 40px;
        }
        .mini-box{
            box-sizing: border-box;
            border: 1px solid rgba(228, 228, 228, 1);
            padding-left: 0;
            padding-right: 0;
            border-bottom:0;
            .content{
                color:#999;
            }
        }
    }
    .dialogFooter {
        width: 100%;
        margin-bottom: 10px;
        text-align: center;
    }
}
</style>
