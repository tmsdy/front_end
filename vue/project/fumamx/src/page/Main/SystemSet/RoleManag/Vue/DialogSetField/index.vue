<template>
    <div class="DialogSetField">
        <!-- 选择字段条件 -->
        <el-dialog :title="$t('mxpcweb.systemset.rolemanag.1530599273775')" :visible.sync="isShowFiled" custom-class="width620" :close-on-click-modal="false" v-dialogDrag :modal-append-to-body="false">
            <ul class="dialogFieldSet">
                <li v-for="(item1,index1) in selectedFields" :key="index1">
                    <!-- 请选择 -->
                    <el-select v-model="item1.fieldName" :placeholder="$t('mxpcweb.systemset.rolemanag.1530597502435')" style="width:123px;" @change="downChange(index1,item1.fieldName)">
                        <el-option v-for="(item,index) in downFields" :key="index" :label="item.cnFieldCaption" :value="item.fieldName" :disabled="item.isDisabled"></el-option>
                    </el-select>
                    <span style="padding:0 5px;">
                        <!-- 为 -->{{$t('mxpcweb.systemset.rolemanag.1530599460283')}}
                    </span>
                    <!-- 请选择 -->
                    <el-select v-model="item1.dictItemsValues" multiple :placeholder="$t('mxpcweb.systemset.rolemanag.1530597502435')" style="width:385px;" @change="multipleChange(index1,item1.dictItemsValues)" @visible-change="visibleChange">
                        <el-option v-for="(item2,index2) in item1.downValues" :key="index2" :label="item2.itemName" :value="item2.dictItemCode+''"></el-option>
                    </el-select>
                    <!--<span v-if="item1.dictItemsValues.length > 0 && index1 !== selectedFields.length - 1">并且</span>-->
                    <span style="padding:0 5px;" v-if="index1 !== selectedFields.length - 1">
                        <!-- 并且 -->{{$t('mxpcweb.systemset.rolemanag.1530599508868')}}
                    </span>
                </li>
            </ul>
            <div class="text-center marginTop10">
                <!--  -->
                <el-button type="primary" style="width:200px;" @click="submitFiled()">
                    <!-- 确定 -->{{$t('mxpcweb.systemset.rolemanag.1530595915980')}}
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'DialogSetField',
    props: {
        thisRoleId: {
            type: Number
        },
        tabCode: {
            type: String
        },
        tabModuleNum: {
            type: String
        },
        // 下拉
        downFields: {
            type: Array,
            default: function () {
                return []
            }
        }
    },
    data() {
        return {
            isShowFiled: false,
            fieldDada: [], // 所有数据
            selectedFields: []// 已选
        }
    },
    created() { },
    mounted() { },
    methods: {
        isDisabled: function (selected) {
            this.downFields.forEach(item => {
                if (item.fieldName == selected) {
                    return true
                }
            })
        },
        // 父组件开关
        isOpen(fieldDada, selectedFields) {
            this.isShowFiled = true
            this.fieldDada = [].concat(JSON.parse(JSON.stringify(fieldDada)))
            this.selectedFields = [].concat(JSON.parse(JSON.stringify(selectedFields)))
            // this.checkDisabled();
        },
        checkDisabled() {
            // 已选过的不让选
            // this.selectedFields.forEach(item=>{
            //     this.downFields.forEach(item2=>{
            //         if(item.fieldName == item2.fieldName){
            //             item2.isDisabled = true;
            //         }
            //         // if(item.fieldName != item2.fieldName){
            //         //     item2.isDisabled = false;
            //         // }
            //     })
            // })
        },
        // 下拉变化时，对应多选下拉匹配值：
        downChange(index, fieldName) {
            let _this = this
            _this.fieldDada.forEach((item) => {
                if (item.fieldName == fieldName) {
                    _this.selectedFields[index].downValues = item.dictItems// 下拉
                    _this.selectedFields[index].dictItemsValues = []// 置空
                }
            })
        },
        // 多选改变
        multipleChange(index, val) {
            /**
             * 选了不为空时，后面就仅追加一个，
             * 空了，就减一个
             * 并且不能多于总下拉
            */
            if (val.length > 0) {
                // 最后一个时，添加
                if (index + 1 == this.selectedFields.length) {
                    this.selectedFields.push({
                        fieldName: '',
                        dictItemsValues: [],
                        downValues: []
                    })
                }
            } else {
                // 倒数第二个时，删除
                if (index + 2 == this.selectedFields.length) {
                    this.selectedFields.splice(index + 1, 1)
                }
            }
        },
        // 多选下拉是否出现
        visibleChange(isTrue) {

        },
        // 字段提交
        submitFiled(del) {
            let _this = this
            let fieldLimitArr = []
            _this.selectedFields.forEach((item) => {
                if (item.dictItemsValues.length > 0) {
                    fieldLimitArr.push({
                        fieldName: item.fieldName,
                        dictItemCode: item.dictItemsValues + ''
                    })
                }
            })
            // let fieldLimitArr = _this.selectedFields.filter(item=>{
            //     return item.fieldName !== ''
            // });
            // console.log(fieldLimitArr);
            // var hash = {};
            // fieldLimitArr = fieldLimitArr.reduce(function(item, next) {
            //     hash[next.fieldName] ? '' : hash[next.fieldName] = true && item.push({
            //         fieldName: next.fieldName,
            //         dictItemCode: next.dictItemCode,
            //         dictItemsValues: next.dictItemsValues
            //     });
            //     return item
            // }, [])
            // 检查有重复提醒
            let isTrue = true
            let checkArr = []
            fieldLimitArr.forEach(item => {
                if (checkArr.indexOf(item.fieldName) === -1) {
                    checkArr.push(item.fieldName)
                } else {
                    isTrue = false
                }
            })
            // console.log(fieldLimitArr);
            if (!isTrue) {
                /* '字段条件不能重复！' */
                this.$message(this.$t('mxpcweb.systemset.rolemanag.1530599567558'))
                return false
            }
            // return isTrue;
            let data = {}
            // 删除所有字段数据
            if (del) {
                data = {
                    moduleCode: _this.tabModuleNum,
                    type: 'fieldLimit',
                    roleId: _this.thisRoleId,
                    tabCode: _this.tabCode,
                    fieldLimit: []
                }
            } else {
                data = {
                    moduleCode: _this.tabModuleNum,
                    type: 'fieldLimit',
                    roleId: _this.thisRoleId,
                    tabCode: _this.tabCode,
                    fieldLimit: fieldLimitArr
                }
            }
            _this.$http.post(_this.Global.baseURL + _this.Global.api.v2.permissions_do, data).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.$emit('tellFather')
                    /* '设置成功！' */
                    _this.$message.success(this.$t('mxpcweb.systemset.rolemanag.1530599607780'))
                    _this.isShowFiled = false
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        submitFiledDel() {
            let data = {
                moduleCode: _this.tabModuleNum,
                type: 'fieldLimit',
                roleId: _this.thisRoleId,
                tabCode: _this.tabCode,
                fieldLimit: []
            }
            _this.$http.post(_this.Global.baseURL + _this.Global.api.v2.permissions_do, data).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.$emit('tellFather')
                    /* '设置成功！' */
                    _this.$message.success(this.$t('mxpcweb.systemset.rolemanag.1530599607780'))
                    _this.isShowFiled = false
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
ul.dialogFieldSet {
  // border:1px solid red;
  margin-bottom: 120px;
  li {
    // border:1px solid blue;
    margin-bottom: 10px;
  }
}
</style>
