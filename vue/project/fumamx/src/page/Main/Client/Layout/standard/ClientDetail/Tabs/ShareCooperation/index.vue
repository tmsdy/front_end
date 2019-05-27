<template>
    <div class="ShareCooperation">
        <loading v-if="isLoading" style="margin-top: 55px;"></loading>
        <no-data v-if="!isLoading && listInfo.length==0" :title="NoDataTitle" style="margin-top: 39px;"></no-data>
        <ul v-if="!isLoading && listInfo.length>0" class="tableLists">
            <li class="tableTitle">
                <el-row>
                    <el-col :span="4">
                        <div class="grid-content bg-purple">
                            <!--  协作人员 -->{{$t('mxpcweb.client.detail.1529999956879')}}
                        </div>
                    </el-col>
                    <el-col :span="16">
                        <div class="grid-content bg-purple-light">
                            <!-- 权限 -->
                            {{$t('mxpcweb.client.detail.1529999987381')}}
                        </div>
                    </el-col>
                </el-row>
            </li>
            <li class="tableList clearfix" v-for="(list,index) in listInfo" :key="index">
                <el-row>
                    <el-col :span="4">
                        <span>{{returnName(list.cooperateCtId)}}</span>
                    </el-col>
                    <el-col :span="16">
                        <div class="grid-content bg-purple-light ellipsis">
                            <el-popover trigger="hover" placement="top" :open-delay="1000">
                                <!-- 暂无任何权限 -->
                                <span v-if="list.permission.length==0">{{$t('mxpcweb.client.detail.1530000043773')}}</span>
                                <span v-else>
                                    <div v-for="(item,indexs) in list.permission" :key="indexs">
                                        <span style="color:RGBA(208, 2, 27, 1);display:inline-block;width:60px;" v-if="item.rights!=''">{{returnModuleName(item.moduleCode)}}:</span>
                                        <span v-for="(list1,index1) in item.rights.split(',')" :key="index1">
                                            {{index1!=0?'、':''}}{{returnItem(list1)}}
                                        </span>
                                    </div>
                                </span>
                                <div slot="reference">
                                    <span v-if="list.permission.length==0"></span>
                                    <div v-else class="ellipsis" style="margin-top:10px;">
                                        <div v-for="(item,indexs) in list.permission" :key="indexs" class="ellipsis" style="line-height:20px;">
                                            <span style="color:RGBA(208, 2, 27, 1);display:inline-block;min-width:70px;" v-if="item.rights!=''">
                                                {{returnModuleName(item.moduleCode)}}：
                                                </span>
                                            <span v-for="(list1,index1) in item.rights.split(',')" :key="index1">
                                                {{index1!=0?'、':''}}{{returnItem(list1)}}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </el-popover>
                        </div>
                    </el-col>
                    <el-col :span="4">
                        <div class="settingBox">
                            <!-- 权限设置 -->
                            <span class="setting" @click="setJurisdiction(list)" :title="$t('mxpcweb.client.detail.1530000088660')">
                                <i class="iconfont icon-setting" style="font-size:16px;"></i>
                            </span>&nbsp;&nbsp;
                            <!-- 移除 -->
                            <span class="setting" @click="moveOutItem(list.cooperateCtId)" :title="$t('mxpcweb.client.detail.1530000139219')">
                                <i class="iconfont icon-remove" style="font-size:16px;"></i>
                            </span>
                        </div>
                    </el-col>
                </el-row>
            </li>
        </ul>
        <div class="setDialog">
            <!-- 共享协作设置 -->
            <el-dialog :title="$t('mxpcweb.client.detail.1530000184044')" :modal-append-to-body="false" :visible.sync="dialogFormVisible" custom-class="width620">
                <template v-if="dialogFormVisible">
                    <div class="setTitle">
                        <!-- xxx的协作权限  -->

                        <span class="titleName" style=" color: black; margin-right: 5px;">{{returnName(setItem.cooperateCtId)}}</span>
                        <span style="margin-right:-4px;">{{$t('mxpcweb.client.detail.1530264910094')}}</span>
                        {{$t('mxpcweb.client.detail.1530000307423')}}
                    </div>
                    <div style="height:360px;overflow:auto;" class="MXscroll">
                        <ul v-for="(itemsList,indexsList) in setList" :key="indexsList">
                            <li>{{itemsList.title}}</li>
                            <li v-for="(items,indexs) in itemsList.list" :key="indexs">
                                <span class="listTitle">{{items.moduleName}}</span>
                                <span class="listContent">
                                    <span style="display:inline-block;width:300px;display:inline-block;">
                                        <!-- 请选择 -->
                                        <el-select v-model="items.value" multiple :placeholder="$t('mxpcweb.client.detail.1529998414995')" :change="itemChange(indexsList,indexs)" style="min-width:285px;" :disabled="items.value1==0">
                                            <el-option v-for="(item,index) in items.list" :key="index" :label="item.funName" :value="item.funCode" :disabled="!isHave(item.funCode)">
                                            </el-option>
                                        </el-select>
                                    </span>
                                    <!-- 请选择 -->
                                    <el-select v-model="items.value1" :placeholder="$t('mxpcweb.client.detail.1529998414995')" @change="allChange(items)" style="width:120px;">
                                        <!-- 全部权限 -->
                                        <el-option :label="$t('mxpcweb.client.detail.1530000612813')" value="0">
                                        </el-option>
                                        <!-- 部分权限 -->
                                        <el-option :label="$t('mxpcweb.client.detail.1530000675268')" value="1">
                                        </el-option>
                                        <!-- 业务权限 -->
                                        <el-option :label="$t('mxpcweb.client.detail.1533704634915')" value="2">
                                        </el-option>
                                    </el-select>
                                </span>
                            </li>
                        </ul>
                    </div>
                    <!--<p class="setTip"><span class="text-red">注</span>：全部权限 代表对资料具有查看和修改权限<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;只查看 代表只有只读权限<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;无权限 代表不能创建客户的此项资料也不能查看其他人的<br/>
                    </p>-->
                    <div slot="footer" class="dialog-footer">
                        <!-- 确定 -->
                        <el-button type="primary" @click="submit" class="subBotton">{{$t('mxpcweb.client.detail.1529994368552')}}</el-button>
                    </div>
                </template>
            </el-dialog>
        </div>
        <!-- 新增协助 -->
        <fly-button @flyBtnClick="$emit('flyBtnClick', itemData.bindModuleCode,'otAddShare')" :fly="false" :title="$t('mxpcweb.client.detail.1530000842171')" :mainObj="mainObj"></fly-button>
    </div>
</template>

<script>
/**
 * 描述：客户详情-共享协作
 * 作者：何俊峰
 * 时间：2017/11/16
 */

// import addShare from '../../../ClientManagIndex/customerLists/addShare/index.vue'
import { isArray } from '@/libs/utils.js'
import NoData from '@/basecomponents/NoData/index'
import Loading from '@/basecomponents/Loading/index'
import { mapGetters } from 'vuex'
import FlyButton from '../../FlyButton/index.vue'
export default {
    name: 'ShareCooperation',
    props: {
        itemData: {
            type: Object,
            default: function () {
                return {}
            }
        },
        // moduleCode: {
        //     type: String,
        //     default: ''
        // },
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
            listInfo: [],
            setItem: {
                cooperateCtId: ''
            },
            myCtId: '',
            baseList: [],
            setList: [],
            dialogFormVisible: false,
            personnelTable: [], // 过滤后的协作人员  供选择
            personnelTables: [], // 所有人员供展示
            personRight: [],
            personnelMsg: '', // 权限消息处理
            /* 暂无数据 */
            NoDataTitle: this.$t('mxpcweb.client.detail.1530000884300')
        }
    },
    created() {
        // this.getTabData()
        this.myCtId = this.company.ctId
    },
    mounted() {

    },
    computed: {
        ...mapGetters([
            'individualConfigInfo',
            'company'
        ])
    },
    methods: {
        allChange(items) {
            let _this = this
            if (items.value1 == '0') {
                let value = []
                items.list.forEach(function (item) {
                    if (_this.isHave(item.funCode)) {
                        value.push(item.funCode)
                    }
                })
                items.value = value
            } else if (items.value1 == '2') {
                let value = []
                items.list.forEach(function (item, index) {
                    if (_this.isHave(item.funCode) && index < 2) {
                        value.push(item.funCode)
                    }
                })
                items.value = value
            }
        },
        itemChange(indexs, index) {
            // this.setList[indexs].list[index].value1 = this.setList[indexs].list[index].value.length == this.setList[indexs].list[index].list.length?'0':'1';
        },
        isHave(code) {
            let isHave = false
            this.personRight.forEach(function (item) {
                item.rights.split(',').forEach(function (items) {
                    if (items == code) {
                        isHave = true
                    }
                })
            })
            return isHave
        },
        isHaveListNum(list) {
            let isHave = 0
            let _this = this
            list.forEach(function (code) {
                _this.personRight.forEach(function (item) {
                    item.rights.split(',').forEach(function (items) {
                        if (items == code.funCode) {
                            isHave++
                        }
                    })
                })
            })
            return isHave
        },
        getMyJurisd() {
            this.$http.get(this.Global.baseURL + this.Global.api.v2.customerCooperate_do, { params: {
                    type: 'operatePersonRight'
                } }).then(function (res) {
                if (res.body.code.toString() == this.Global.RES_OK && isArray(res.body.data)) {
                    this.personRight = res.body.data
                    this.getSetData()
                } else {
                    // this.$message.error(_this.msg(res.body));
                    this.NoDataTitle = this.msg(res.body)
                }
            }, function (res) {
                this.$message.error(this.$t(this.Global.errorTitle))
            })
        },
        getListData() {
            let _this = this
            this.$http.get(_this.Global.baseURL + _this.Global.api.v2.customerCooperate_do, { params: {
                    type: 'cooperatePersonList',
                    custId: _this.pageId
                } }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
                    _this.listInfo = res.body.data
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        returnName(id) {
            let name = ''
            this.personnelTables.forEach(function (item) {
                if (item.ctId == id) {
                    name = item.realName
                    return false
                }
            })
            return name
        },
        //  returnImg(id){
        //     let img = '';
        //     this.personnelTable.forEach(function(item){
        //         if(item.ctId==id){
        //             img = item.avatar;
        //             return false;
        //         }
        //     });
        //     return img;
        // },
        // 获取可共享人员
        getTabData() {
            let _this = this
            let contactData = {
                dataType: 'contact',
                funType: 'withRight',
                moduleCode: 'BF001',
                optCode: 'otAddShare'
            }
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.accountDropList_get, { params: contactData }).then(function (res) {
                this.isLoading = false
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.personnelMsg = ''
                    _this.personnelTable = res.body.data
                } else {
                    _this.personnelMsg = ''
                    // _this.$message.error(_this.msg(res.body));
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
            let allContactData = {
                dataType: 'contact',
                funType: 'all'
            }
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.accountDropList_get, { params: allContactData }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.personnelTables = res.body.data
                    _this.getMyJurisd()
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        switch(list) {
            let _this = this
            let newList = [
                {
                    title: _this.$t('mxpcweb.client.detail.1530000928099'), // "客户资料"
                    list: []
                }, {
                    title: _this.$t('mxpcweb.client.detail.1530000961669'), // "客户相关资料"
                    list: []
                }
            ]
            list.forEach(function (items) {
                let isHave = false
                newList.forEach(function (lists) {
                    lists.list.forEach(function (item) {
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
                        list: [
                            items
                        ]
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
        // 打开设置共享
        setJurisdiction(list) {
            this.clearData()
            console.log(list)
            this.setItem = list
            // this.clearData();
            this.setList.forEach((items) => {
                items.list.forEach((item) => {
                    list.permission.forEach((me) => {
                        if (me.moduleCode == item.moduleCode) {
                            item.value = []
                            if (me.rights) {
                                item.value = me.rights.split(',')
                            }
                            item.value1 = (item.value.length == this.isHaveListNum(item.list) ? '0' : '1')
                        }
                    })
                })
            })
            console.log(this.setList)
            this.dialogFormVisible = true
        },
        // 获取编辑数据
        getSetData() {
            this.$http.get(this.Global.baseURL + this.Global.api.v2.permissions_get, { params: { tabCode: 'T04', type: 'item' } }).then((res) => {
                if (res.body.code.toString() === this.Global.RES_OK && res.body.data) {
                    this.baseList = res.body.data
                    this.setList = this.switch(res.body.data)
                    this.getListData()
                } else {
                    this.$message.error(this.msg(res.body))
                }
            }, (res) => {
                this.$message.error(this.msg(res.body))
            })
        },
        // 删除提醒
        moveOutItem(id) {
            /* 此操作将删除该【提醒】, 是否继续? */
            let c = this.$t('mxpcweb.client.detail.1530001018428')
            /* 提示 */
            let t = this.$t('mxpcweb.client.detail.1529994349587')
            /* 确定 */
            let s = this.$t('mxpcweb.client.detail.1529994368552')
            /* 取消 */
            let n = this.$t('mxpcweb.client.detail.1529994393355')
            this.$confirm(c, t, {
                confirmButtonText: s,
                cancelButtonText: n,
                type: 'warning'
            }).then(() => {
                this.delete(id)
            }).catch(() => {
            })
        },
        // 删除
        delete(id) {
            this.$http.delete(this.Global.baseURL + this.Global.api.v2.customerCooperate_do, { params: {
                    'custId': this.pageId,
                    'cooperateCtId': id
                } }).then((res) => {
                if (res.body.code.toString() === this.Global.RES_OK) {
                    this.$message.success(this.msg(res.body))
                    // this.getListData();
                    this.$emit('tellFather')// 更新客户详情数据，当前tab也会更新的（在tellFather方法里）
                } else {
                    this.$message.error(this.msg(res.body))
                }
            }, (res) => {
                this.$message.error(this.msg(res.body))
            })
        },
        // 提交数据
        submit() {
            let rights = []
            this.setList.forEach((items) => {
                items.list.forEach((item) => {
                    if (item.value1 == '0') {
                        item.list.forEach((list) => {
                            rights.push(list.funCode)
                        })
                    } else {
                        rights = rights.concat(item.value)
                    }
                })
            })
            rights = rights.toString()
            let data = {
                custId: this.pageId,
                cooperateCtId: this.setItem.cooperateCtId,
                rights: rights
            }
            this.$http.put(this.Global.baseURL + this.Global.api.v2.customerCooperate_do, data).then((res) => {
                if (res.body.code.toString() === this.Global.RES_OK) {
                    this.$message.success(this.msg(res.body))
                    this.getListData()
                    this.dialogFormVisible = false
                } else {
                    this.$message.error(this.msg(res.body))
                }
            }, function (res) {
                this.$message.error(this.msg(res.body))
            })
        },
        returnModuleName(code) {
            let name = ''
            this.setList.forEach((items) => {
                items.list.forEach((item) => {
                    if (item.moduleCode == code) {
                        name = item.moduleName
                        return false
                    };
                })
            })
            return name
        },
        returnItem(code) {
            let name = ''
            this.baseList.forEach((item) => {
                if (item.funCode == code) {
                    name = item.funName
                };
            })
            return name
        },
        clearData() {
            this.setList.forEach((items) => {
                items.list.forEach((item) => {
                    item.value1 = '0'
                    let value = []
                    item.list.forEach((list) => {
                        value.push(list.funCode)
                    })
                    item.value = value
                })
            })
        }
    },
    watch: {

    },
    components: {
        'no-data': NoData,
        loading: Loading,
        'fly-button': FlyButton
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
