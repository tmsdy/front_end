<template>
    <div class="DialogSetDept">
        <!-- 选择部门 -->
        <el-dialog :title="$t('mxpcweb.systemset.rolemanag.1530599173339')" :visible.sync="isShowDept" custom-class="width620" :close-on-click-modal="false" v-dialogDrag :modal-append-to-body="false">
            <div style="margin:10px 110px;">
                <!-- 请选择部门  -->
                <el-select v-model="itemData.specifyDept" multiple :placeholder="$t('mxpcweb.systemset.rolemanag.1530599185099')" style="width:360px;">
                    <el-option v-for="(item2,index2) in departmentList" :key="index2" :label="item2.deptName" :value="item2.dkey+''"></el-option>
                </el-select>
            </div>

            <div class="text-center marginTop10" style="margin-top:160px;">
                <el-button type="primary" style="width:200px;" @click="submitDept()">
                    <!-- 确定 -->{{$t('mxpcweb.systemset.rolemanag.1530595915980')}}
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'DialogSetDept',
    props: {
        thisRoleId: {
            type: Number
        },
        tabCode: {
            type: String
        },
        departmentList: {
            type: Array,
            default: function () {
                return []
            }
        }
    },
    data() {
        return {
            // 部门
            isShowDept: false,
            itemData: {}
        }
    },
    created() { },
    mounted() {

    },
    methods: {
        // 部门编辑，弹窗
        isOpen(item) {
            this.itemData = Object.assign({}, item)// 拷贝一下，不然会和父组件同步了
            this.isShowDept = true
        },
        // 提交，部门选择后
        submitDept() {
            let _this = this
            let data = {
                codeValue: [{
                    funCode: this.itemData.funCode,
                    rightValue: this.itemData.rightValue,
                    specifyDept: this.itemData.specifyDept.toString()
                }],
                roleId: _this.thisRoleId + '',
                tabCode: _this.tabCode
            }
            _this.$http.post(_this.Global.baseURL + _this.Global.api.SystemSet.rolemanag.permissionsPut, data).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.isShowDept = false
                    _this.$message.success(_this.msg(res.body))
                    _this.$emit('tellFather')
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
</style>
