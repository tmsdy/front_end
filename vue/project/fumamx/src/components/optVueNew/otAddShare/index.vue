<template>
    <!-- 新增共享协作 -->
    <el-dialog v-dialogDrag :title="$t('mxpcweb.client.1529050572670')" :visible.sync="dialogSetList" :closeOnClickModal="false" custom-class="width620" :modal-append-to-body="false">
        <div class="addShare" v-if="dialogSetList">
            <div class="customer">
                <!-- 共享协作人 -->
                <span class="customerTitle">{{$t('mxpcweb.client.1529050584515')}}：</span>
                <el-select v-model="select"  multiple filterable placeholder=""  style="width:380px;margin-left:145px;">
                    <!-- 暂无人员可选 -->
                    <el-option v-if="personnelTable.length==0" :label="$t('mxpcweb.client.1529050598359')" value="-1">
                    </el-option>
                    <div v-for="(item,index) in personnelTable" :key="index"  v-show="item.inUse===1">
                        <el-option :label="item.realName" :value="item.ctId+''">
                        </el-option>
                    </div>
                </el-select>
            </div>
            <div style="height:360px;overflow:auto;margin-top:30px" class="MXscroll" v-loading="loading">
                <ul v-for="(itemsList,indexsList) in setList" :key="indexsList">
                    <li>{{itemsList.title}}</li>
                    <li v-for="(items,indexs) in itemsList.list" :key="indexs">
                        <span class="listTitle">{{items.moduleName}}</span>
                        <span class="listContent">
                            <span  style="display:inline-block;width:300px;display:inline-block;">
                                <!-- 请选择 -->
                                <el-select v-model="items.value" multiple  :placeholder="$t('mxpcweb.client.1529050621745')" :change="itemChange(indexsList,indexs)" style="min-width:285px;" :disabled="items.value1==0">
                                    <el-option v-for="(item,index) in items.list" :key="index" :label="item.funName" :value="item.funCode" :disabled="!isHave(item.funCode)">
                                    </el-option>
                                </el-select>
                            </span>
                            <!-- 请选择 -->
                            <el-select v-model="items.value1" :placeholder="$t('mxpcweb.client.1529050621745')" @change="allChange(indexsList,indexs)" style="width:120px;">
                                <!-- 全部权限 -->
                                <el-option :label="$t('mxpcweb.client.1529050640192')" value="0">
                                </el-option>
                                <!-- 部分权限 -->
                                <el-option :label="$t('mxpcweb.client.1529050657176')" value="1">
                                </el-option>
                                <!-- 业务权限 -->
                                <el-option :label="$t('mxpcweb.client.detail.1533704634915')" value="2">
                                </el-option>
                            </el-select>
                        </span>
                    </li>
                </ul>
            </div>
        </div>
        <div slot="footer" class="dialogFooter" style="text-align:center">
            <!-- 取消 -->
            <el-button @click="cancel">{{$t('mxpcweb.client.1529047588840')}}</el-button>
            <!-- 确定 -->
            <el-button type="primary" @click="submit" :loading="submitLoading">{{$t('mxpcweb.client.1529047741736')}}</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { isArray } from '@/libs/utils.js'
/**
 * 描述：客户管理-客户列表-设置列表字段
 * 作者：何俊峰
 * 时间：2017/11/10
 */
export default {
    name: 'addShare',
    props: {
    },
    data() {
        return {
            select: [],
            dialogSetList: false, // 设置列表弹框
            id: '',
            moduleCode: '',
            optModuleCode: '',
            itemData: '',
            submitLoading: false,
            setList: [],
            personnelTable: [],
            personRight: [],
            custTitle1: this.$t('mxpcweb.client.1529054746996'),
            custTitle2: this.$t('mxpcweb.client.1529054757881'),
            type: '',
            optCode: '',
            loading: false,
            callback: function() {}
        }
    },
    created () {
    },
    methods: {
        // 获取可共享人员
        getTabData() {
            let _this = this
            let contactData = {
                dataType: 'contact',
                funType: 'withRight',
                moduleCode: 'BF001',
                optCode: 'otAddShare'
            }
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.accountDropList_get, { params: contactData }).then((res) => {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.personnelTable = res.body.data
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, (res) => {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        switch(list) {
            let _this = this
            let newList = [
                {
                    // 客户资料
                    title: _this.custTitle1,
                    list: []
                }, {
                    // 客户相关资料
                    title: _this.custTitle2,
                    list: []
                }
            ]
            list.forEach(function(items) {
                let isHave = false
                newList.forEach(function(lists) {
                    lists.list.forEach(function(item) {
                        if (items.moduleCode == item.moduleCode) {
                            if (_this.isHave(items.funCode)) {
                                item.value.push(items.funCode)
                            };
                            item.list.push(items)
                            isHave = true
                        };
                    })
                })
                if (!isHave) {
                    let value = []
                    if (_this.isHave(items.funCode)) {
                        value.push(items.funCode)
                    };
                    let data = {
                        moduleCode: items.moduleCode,
                        moduleName: items.moduleName,
                        value: value,
                        value1: '0',
                        list: [items]
                    }
                    if (items.moduleCode == 'BF001') {
                        newList[0].list.push(data)
                    } else {
                        newList[1].list.push(data)
                    }
                }
            })
            return newList
        },
        isHave(code) {
            let isHave = false
            this.personRight.forEach(function(item) {
                item.rights.split(',').forEach(function(items) {
                    if (items == code) {
                        isHave = true
                    }
                })
            })
            return isHave
        },
        allChange(indexs, index) {
            let _this = this
            if (this.setList[indexs].list[index].value1 == '2') {
                let value = []
                this.setList[indexs].list[index].list.forEach(function(item, thisIndex) {
                    if (_this.isHave(item.funCode) && thisIndex < 2) {
                        value.push(item.funCode)
                    }
                })
                this.setList[indexs].list[index].value = value
            } else {
                let value = []
                this.setList[indexs].list[index].list.forEach(function(item) {
                    if (_this.isHave(item.funCode)) {
                        value.push(item.funCode)
                    }
                })
                this.setList[indexs].list[index].value = value
            }
        },
        itemChange(indexs, index) {
            // this.setList[indexs].list[index].value1 = this.setList[indexs].list[index].value.length == this.setList[indexs].list[index].list.length?'0':'1';
        },
        openWindow(obj) {
            let { billId, moduleCode, itemData, type, optData, next } = obj
            if (next) {
                this.callback = next
            } else {
                this.callback = function() {}
            }
            this.clearData()
            this.id = billId
            this.moduleCode = moduleCode
            this.optModuleCode = optData.optModuleCode
            this.itemData = itemData
            this.type = type
            this.optCode = optData.optCode
            if (this.personRight.length == 0) {
                this.getMyJurisd()
            }
            if (this.personnelTable.length == 0) {
                this.getTabData()
            }
            this.dialogSetList = true
        },
        submit() {
            let _this = this
            let rights = []
            this.setList.forEach(function(items) {
                items.list.forEach(function(item) {
                    if (item.value1 == '0') {
                        item.list.forEach(function(list) {
                            rights.push(list.funCode)
                        })
                    } else {
                        rights = rights.concat(item.value)
                    }
                })
            })
            rights = rights.toString()
            let data = {}
            let url = ''
            if (this.type === '1') {
                data = {
                    optModuleCode: this.optModuleCode,
                    targets: this.id.join(','),
                    rights: rights,
                    optCode: this.optCode,
                    toCtIds: this.select.join(',')
                }
                url = this.Global.api.v2.document_operate_listOpt_put
            } else {
                data = {
                    optModuleCode: this.optModuleCode,
                    rights: rights,
                    identFieldValue: this.id,
                    optCode: this.optCode,
                    toCtIds: this.select.join(',')
                }
                url = this.Global.api.v2.document_operate_detailOpt_put
            }
            this.submitLoading = true
            this.$http.put(this.Global.baseURL + url, data).then((res) => {
                if (res.body.code.toString() === this.Global.RES_OK) {
                    this.callback()
                    this.dialogSetList = false
                    this.submitLoading = false
                    this.$message.success(_this.msg(res.body))
                } else {
                    this.submitLoading = false
                    this.$message.error(_this.msg(res.body))
                }
            }, (res) => {
                this.submitLoading = false
                this.$message.error(_this.msg(res.body))
            })
        },
        clearData() {
            let _this = this
            this.setList.forEach(function(items) {
                items.list.forEach(function(item) {
                    item.value1 = '0'
                    let value = []
                    item.list.forEach(function(item1, thisIndex) {
                        if (_this.isHave(item1.funCode)) {
                            value.push(item1.funCode)
                        }
                    })
                    item.value = value
                })
            })
            this.select = ''
        },
        // 获取编辑数据
        getSetData() {
            this.$http.get(this.Global.baseURL + this.Global.api.v2.permissions_get, { params: {tabCode: 'T04', type: 'item'} }).then((res) => {
                if (res.body.code.toString() === this.Global.RES_OK && res.body.data) {
                    this.setList = this.switch(res.body.data)
                } else {
                     this.$message.error(_this.msg(res.body))
                }
            }, (res) => {
                this.$message.error(_this.msg(res.body))
            })
        },
        // 获取权限数据
        getMyJurisd() {
            this.loading = true
            this.$http.get(this.Global.baseURL + this.Global.api.v2.customerCooperate_do, { params: {
                type: 'operatePersonRight'
            } }).then((res) => {
                if (res.body.code.toString() == this.Global.RES_OK && isArray(res.body.data)) {
                   this.personRight = res.body.data
                    this.getSetData()
                    this.loading = false
                }
            }, (res) => {
                this.$message.error(this.$t(this.Global.errorTitle))
            })
        },
        cancel() {
            this.dialogSetList = false
        }
    },
    watch: {

    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.addShare{
    padding:20px 0px;
    .customer{
        position:relative;
        line-height:35px;
        .customerTitle{
            font-weight: 900;
            font-size:15px;
            position:absolute;
            top:0;
            left:0;
            padding-left:20px;
        }
    }
    .dialogFooter{
        height: 80px;
    }
    ul {
        li {
            padding:10px 0 10px 20px;
            border-bottom: 1px solid #f2f2f2;
            .listTitle {
                width: 120px;
                display: inline-block;
            }
        }
        >:first-child {
            height: 36px;
            line-height: 36px;
            padding:0 0 0 20px;
            background: #f2f2f2;
            border-radius: 3px;
            color: #66667b;
        }
        >:first-child {
            border: 0;
        }
    }
}
</style>
