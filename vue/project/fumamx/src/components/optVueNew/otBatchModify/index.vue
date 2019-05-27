<template>
    <div class="batchEidt">
        <!-- 批量修改 -->
        <el-dialog v-dialogDrag :title="$t('mxpcweb.client.1529052682658')" :visible.sync="dialog" :closeOnClickModal="false" custom-class="width520">
            <!-- 动态组件 -->
            <div class="listBox">
                <el-form :model="ruleForm" :rules="rules" label-width="90px" label-position="left">
                    <!-- 字段 -->
                    <el-form-item :label="$t('mxpcweb.client.1529052699658')">
                        <!-- 请选择一个字段 -->
                        <el-select  v-model="ruleForm.index"  :placeholder="$t('mxpcweb.client.1529052714564')" @change="filedchange" size="small" style="width:250px">
                            <el-option v-for="(item,index) in editSets" :disabled="item.disabled" v-if="item.uniqueCheck==0&&item.controlTypeId!=0&&item.controlTypeId!=14" :key="index" :label="item.cnFieldCaption" :value="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 新的值 -->
                    <el-form-item  v-if="ruleForm.list.fieldGroup!=undefined" :label="$t('mxpcweb.client.1529052728029')" :prop="prop">
                        <component  v-if="ruleForm.list.fieldGroup == 0" :showLabel="false" :moduleCode="moduleCode" :optCode="optCode"  size="small" labelPosition="left" labelWidth="0" rightWidth="250px" ref="control" v-bind:is="'control'+ruleForm.list.controlTypeId" :itemData="ruleForm.list" :controlData.sync="ruleForm.list.controlData"></component>
                        <component v-else :showLabel="false" labelPosition="left" :moduleCode="moduleCode" :optCode="optCode" labelWidth="0"  size="small" v-bind:is="'group'+ruleForm.list.fieldGroup"  rightWidth="250px" rightWidth1="123px" ref="control" :itemData="ruleForm.list"></component>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialogFooter" style="text-align:center">
                <!-- 取消 -->
                <el-button @click="dialog=false">{{$t('mxpcweb.client.1529047588840')}}</el-button>
                <!-- 保存 -->
                <el-button type="primary" :loading="subLoaing" @click="save()">{{$t('mxpcweb.client.1529042806774')}}</el-button>
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
import Controls from '@/components/Controls/index.js'
import GroupControls from '@/components/GroupControls/index.js'
export default {
    name: 'batchEidt',
    props: {
    },
    data() {
        return {
            dialog: false,
            ruleForm: {
                index: '',
                list: {
                    controlData: '',
                    isNotNull: 0
                },
                value: ''
            },
            prop: 'value',
            rules: {
                value: [
                    { required: true }
                ]
            },
            editSets: [],
            optCode: 'otBatchModify',
            billId: [],
            subLoaing: false,
            moduleCode: '',
            callback: function() {}
        }
    },
    created() {
    },
    mounted() {
    },
    computed: {
    },
    methods: {
        save() {
            let _this = this
            if (_this.ruleForm.index === '') {
                // 您还没有选择字段
                _this.$message(this.$t('mxpcweb.client.1529052753532'))
                return false
            }
            if (_this.$refs.control.submitForm !== undefined) {
                if (!_this.$refs.control.submitForm()) {
                    return false
                }
            }
            let data = {
                'optCode': 'otBatchModify',
                'optModuleCode': _this.moduleCode,
                'targets': _this.billId.toString()
            }
            if (_this.ruleForm.list.fieldGroup == 0) {
                data[_this.ruleForm.list['fieldName']] = _this.ruleForm.list.controlData
            } else {
                _this.ruleForm.list.group.forEach(function(item) {
                    data[item['fieldName']] = item.controlData
                })
            }
            this.subLoaing = true
            _this.$http.put(this.Global.baseURL + this.Global.api.v2.document_operate_listOpt_put, data).then((res) => {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    // _this.$message.success(_this.msg(res.body));
                    _this.subLoaing = false
                    _this.callback()
                    _this.dialog = false
                    ep.emit('batchMsg', res.body)
                } else {
                    _this.subLoaing = false
                    _this.$message.error(_this.msg(res.body))
                }
            }, (res) => {
                _this.subLoaing = false
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        getEditSet() { // 获取数据
            let _this = this
            // _this.$http.get(this.Global.baseURL + this.Global.api.DocumentFramework.ModulesAndFields.fieldShowGet, { params: {
            _this.$http.get(this.Global.baseURL + this.Global.api.v2.fieldShow_get, { params: {
                moduleCode: _this.moduleCode,
                type: 'modifyEditSet'
            } }).then((res) => {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.editSets = _this.swidchEditSet(res.body.data)
                } else {
                    _this.editSets = []
                    _this.$message.error(_this.msg(res.body))
                }
            }, (res) => {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },

        // 转化编辑字段数据（按空间类型（单控件，组控件）顺序）
        swidchEditSet(list) { // 编辑字段数据转化
            let _this = this
             let newLList = []
             let groupFirst = []
            list.forEach((element) => {
                element.controlData = ''
                element.check = ''
                if (element.editState == '0' || element.editState == '3') {
                    element.disabled = true
                }
                element.checkbox = (element.fieldCategory == 2)// 是否启用
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
                            uniqueCheck: element.uniqueCheck,
                            controlTypeId: element.controlTypeId,
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
        },
        openWindow(obj) {
            let _this = this
            _this.optCode = obj.optData.optCode
            _this.moduleCode = obj.optData.optModuleCode
            if (obj.next) {
                _this.callback = obj.next
            } else {
                _this.callback = function() {}
            }
            _this.billId = obj.billId
            _this.ruleForm = {
                index: '',
                list: {
                    controlData: '',
                    isNotNull: 0
                },
                value: ''
            }
            _this.getEditSet()
            _this.dialog = true
        },
        clearData() {
            this.ruleForm.index = ''
            this.ruleForm.list = {}
        },
        filedchange(index) {
            let _this = this
            if (index === '') {
                this.ruleForm.list = []
            } else {
                this.ruleForm.list = this.editSets[index]
            }
            if (this.ruleForm.list.isNotNull && this.ruleForm.list.isNotNull == 1) {
                this.prop = 'value'
            } else {
                this.prop = ''
            }
            setTimeout(function() {
                if (_this.$refs.control != undefined) {
                    if (_this.$refs.control.getData != undefined) {
                        _this.$refs.control.getData()
                        _this.$refs.control.clearData()
                    }
                }
            }, 20)
        }
    },
    watch: {

    },
    components: Object.assign({

    }, Controls, GroupControls)
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.batchEidt{
    .listBox{
        width: 100%;
        padding: 20px 20px 0 50px;
    }
    .dialogFooter {
        width: 100%;
        margin-bottom: 10px;
        text-align: center;
    }
}
</style>
