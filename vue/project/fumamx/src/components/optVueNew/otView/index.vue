<template>
    <div class="ContactsDetail">
        <el-dialog  v-dialogDrag :title="title" :visible.sync="isOpen" custom-class="width720" :modal-append-to-body="false">
            <!-- 拼命加载中 -->
            <ul v-loading="loading" v-if="isOpen" :element-loading-text="$t('mxpcweb.client.1529055599483')">
                <li v-for="(item2,index2) in fieldList" :key="index2">
                    <template v-if="item2.fieldGroup == 0">
                        <component class="components" v-bind:is="'control'+item2.controlTypeId" :itemData="item2" @modifyData="modifyData" labelWidth="88px"></component>
                    </template>
                </li>
            </ul>
        </el-dialog>
    </div>
</template>

<script>
/**
 * 联系人详情弹窗
*/
import { isObject, isArray } from '@/libs/utils.js'
import ControlsExhibition from '@/components/ControlsExhibition/index.js'
import GroupControlsExhibition from '@/components/GroupControlsExhibition/index.js'
export default {
    name: 'ContactsDetail',
    props: {
    },
    data() {
        return {
            loading: false,
            isOpen: false,
            fieldList: [], // 控件数据
            moduleCode: '',
            billId: '',
            // 通讯录详情
            title: this.$t('mxpcweb.client.detail.1529993364826')// 弹框title
        }
    },
    created() {
        // this.getData();
    },
    mounted() {

    },
    methods: {
        openWindow (obj) {
            this.isOpen = true
            let { itemData, billId, optData } = obj
            this.moduleCode = optData.optModuleCode
            this.getData(itemData, billId)
            this.billId = billId || ''
        },
        showDialog(item) {
            this.isOpen = true
            this.getData(item)
        },
        getData(obj, billId) {
            // console.log(" >>>>>>>>>>>> ")
            // console.log(obj)
            // console.log(" >>>>>>>>>>>> ")
            let _this = this
            _this.loading = true
            // 字段
            let p0 = new Promise((resolve, reject) => {
                let data = {
                    moduleCode: _this.moduleCode,
                    type: 'viewSet'
                }
                _this.$http.get(this.Global.baseURL + this.Global.api.v2.fieldShow_get, { params: data }).then((res) => {
                    if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
                        resolve(res.body.data)
                    } else {
                        _this.$message.error(_this.msg(res.body))
                    }
                }, (res) => {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            })
            // 明细
            let p1 = new Promise((resolve, reject) => {
                let data = {
                    searchType: 'detail',
                    moduleCode: _this.moduleCode,
                    identFieldValue: billId
                }
                _this.$http.get(this.Global.baseURL + this.Global.api.v2.document_generalOperate_get, { params: data }).then((res) => {
                    if (res.body.code.toString() == _this.Global.RES_OK && isObject(res.body.data)) {
                        resolve(res.body.data)
                    } else {
                        _this.$message.error(_this.msg(res.body))
                    }
                }, (res) => {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            })
            // 接口名称: 获取社交类型
            let p2 = new Promise((resolve, reject) => {
                _this.$http.get(this.Global.baseURL + this.Global.api.v2.socialType_get, { params: {} }).then((res) => {
                    if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
                        resolve(res.body.data)
                    } else {
                        _this.$message.error(_this.msg(res.body))
                    }
                }, (res) => {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            })
            Promise.all([p0, p1, p2]).then(function(results) {
                // console.log(results)
                _this.loading = false
                // _this.title = results[1].contName;
                results[0].forEach(function(item) {
                    Object.keys(results[1]).forEach(function(item2) {
                        if (item2 == item.fieldName) {
                            item.fieldValue = results[1][item2]
                        }
                    })
                    item.social = results[2]
                    item.contId = obj.contId
                })
                _this.fieldList = results[0]// *** 这里没做分组 ControlsDataConvertItem
                // console.log(_this.fieldList)
            })
        },
        // 权限
        modifyData(modifyObj) {
            let _this = this
            let data = {
                moduleCode: _this.moduleCode,
                optCode: 'otEdit',
                identFieldValue: _this.billId
            }
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.document_rightCheck_do, { params: data }).then((res) => {
                if (res.body.code.toString() === _this.Global.RES_OK) {
                    // console.log(res.body);
                    _this.modifyDataVal(modifyObj)// 修改单据
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, (res) => {
                _this.$message.error(_this.msg(res.body))
            })
        },
        // 接口名称: 修改单据 修改单个编辑控件传来的值
        modifyDataVal(modifyObj) {
            let _this = this
            // console.log(modifyObj)
            modifyObj['moduleCode'] = _this.moduleCode
            modifyObj['identFieldValue'] = _this.billId
            // console.log(modifyObj);
            _this.$http.put(_this.Global.baseURL + _this.Global.api.v2.document_generalOperate_put, modifyObj).then((res) => {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.$emit('getListData', true)
                    // 修改成功！
                    _this.$message.success(this.$t('mxpcweb.client.1529055558107'))
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, (res) => {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        }
    },
    components: Object.assign({

    }, ControlsExhibition, GroupControlsExhibition)
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.ContactsDetail {
    ul {
        min-height: 380px;
        padding: 0 100px 20px;
    }
}
</style>
