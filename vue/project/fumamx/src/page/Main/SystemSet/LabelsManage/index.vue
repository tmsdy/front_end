<template>
    <div class="LabelsList MXscroll mainWrap">
        <div class="Search">
            <div class="addButtonBox">
                <!-- 新建标签 -->
                <el-button class="addButton" type="primary" size="small" @click="$refs.addLabel.openWindow(moduleCode)">{{$t('mxpcweb.systemset.SY022.1550113498074')}}</el-button>
            </div>
            <!-- 搜索标签 -->
            <el-input class="addInput" v-model="keywords" clearable :placeholder="$t('mxpcweb.systemset.SY022.1550113647254')" icon="search" @keyup.enter.native="getListData" @blur="getListData" :on-icon-click="getListData"></el-input>
            <!-- 搜索 -->
            <el-button type="primary" @click="getListData()">{{$t('mxpcweb.systemset.SY022.1550113657254')}}</el-button>
        </div>
        <div class="titleBox" :style="{'padding-right': hasScrollbarValue ? '6px' : '0'}">
            <el-row class="list" :gutter="20">
                <!-- 标签 -->
                <el-col :span="10">{{$t('mxpcweb.systemset.SY022.1550113657496')}}</el-col>
                <!-- 更新时间 -->
                <el-col :span="10">{{$t('mxpcweb.systemset.SY022.1550113664723')}}</el-col>
                <!-- 更新人 -->
                <el-col :span="4">{{$t('mxpcweb.systemset.SY022.1550113664934')}}</el-col>
            </el-row>
        </div>
        <el-checkbox-group v-model="controlData.checkedCities" @change="handleCheckedCitiesChange">
            <div class="boxList boxTit MXscroll" ref="customerTables" v-loading="loading">
                <no-data v-if="list.length==0" style="background:rgba(255,255,255,0)"></no-data>
                <el-row v-else class="list1" :gutter="20" v-for="(item,index) in list" :key="index">
                    <el-col :span="10">
                        {{item.labelName}}
                        <span class="useNum text-hover" title="标签使用数量" @click="getNum(item)">
                            {{item.useNum}}
                        </span>
                    </el-col>
                    <el-col :span="10" class="LabelsMsg">
                        {{item.modifyDate && item.modifyDate != '1970-01-01 00:00:00' ? item.modifyDate : item.createDate != '1970-01-01 00:00:00' ? item.createDate : '-'}}
                    </el-col>
                    <el-col :span="4" class="LabelsMsg ownerCtId">
                        {{peopleListReturn(item.modifyCtid || item.createCtid)}}&nbsp;
                    </el-col>
                    <el-col :span="4" class="listCol4" v-if="item.color!=11">
                        <div class="listCol4Item">
                            <!-- 编辑 -->
                            <span class="optButton right10" @click="$refs.addLabel.openWindow(moduleCode, item)" :title="$t('mxpcweb.systemset.SY022.1550113687390')">
                                <i class="iconfont icon-edit" style="font-size: 12px"></i>
                            </span>
                            <!-- 删除 -->
                            <span class="optButton right10" @click="deleteItem(item)" :title="$t('mxpcweb.systemset.SY022.1550113687644')">
                                <i class="iconfont icon-del" style="font-size: 12px"></i>
                            </span>
                        </div>
                    </el-col>
                    <el-col :span="4" class="listCol4" v-else>
                        <div class="listCol4Item">
                            <!-- 系统字段不允许编辑 -->
                            <span class="optButtonNo right10" :title="$t('mxpcweb.systemset.SY022.1550114640541')">
                                <i class="iconfont icon-edit" style="font-size: 12px"></i>
                            </span>
                            <!-- 系统字段不允许删除 -->
                            <span class="optButtonNo right10" :title="$t('mxpcweb.systemset.SY022.1550114643530')">
                                <i class="iconfont icon-del" style="font-size: 12px"></i>
                            </span>
                        </div>
                    </el-col>
                    <div :class="controlData.checkedCities.length==0?'checkboxLeft':'checkboxLeft1'">
                        <el-checkbox :label="item.labelId" size="small" :disabled="item.color==11">&nbsp;</el-checkbox>
                    </div>
                </el-row>
            </div>
        </el-checkbox-group>
        <!--footer-->
        <foot-control ref="footControl" style="z-index:10" moduleCode="GD001" :moduleStruct="moduleStruct" @getListData="getListData" :listOpt="listOpt" :customerLists="list" :controlData="controlData" iseType="通用"></foot-control>
        <!-- 标签管理 -->
        <page-title :showTitle="false" :title="$t('mxpcweb.systemset.SY022.1550113707848')" iconfont="icon-tag">
        </page-title>
        <div class="pageTab">
            <el-tabs class="subTabs-pullRight" v-model="moduleCode" @tab-click="getListData()">
                <!-- 客户管理 -->
                <el-tab-pane :label="$t('mxpcweb.systemset.SY022.1550113708051')" name="BF001">
                </el-tab-pane>
                <!-- 孚盟邮 -->
                <el-tab-pane :label="$t('mxpcweb.systemset.SY022.1550113722245')" name="EM001">
                </el-tab-pane>
                <!-- 通讯录 -->
                <el-tab-pane label="通讯录" name="BF003">
                </el-tab-pane>
                <!-- 跟进 -->
                <el-tab-pane label="跟进" name="BF004">
                </el-tab-pane>
                <!-- 报价 -->
                <el-tab-pane label="报价" name="SC001">
                </el-tab-pane>
                <!-- 订单 -->
                <el-tab-pane label="订单" name="SC002">
                </el-tab-pane>
            </el-tabs>
        </div>
        <add-label ref="addLabel" @getListData="getListData"></add-label>
    </div>
</template>

<script>
import PageTitle from '@/components/PageTitle/index' // 大标题
import NoData from '@/basecomponents/NoData/index'
import footControl from '@/page/Main/Client/Layout/standard/ClientManagIndex/customerLists/footControl/index'
import { mapGetters } from 'vuex'
import addLabel from './dialog/addLabel'

export default {
    name: 'LabelsList',
    props: {
    },
    data() {
        return {
            moduleStruct: {
                identField: 'labelId',
                titleField: 'labelName'
            },
            // 底部操作
            controlData: {
                checkedCities: [],
                checkAll: false, // 列表全选状态弹框
                isIndeterminate: false//
            },
            keywords: '',
            list: [],
            moduleCode: 'BF001',
            listOpt: [{
                iconURI: 'icon-groups',
                optCode: 'otMergeLabel',
                optModuleCode: 'BF001',
                // 合并
                optName: this.$t('mxpcweb.systemset.SY022.1550113722444')
            }, {
                iconURI: 'icon-del',
                optCode: 'otLabelsDelete',
                optModuleCode: 'BF001',
                // 批量删除
                optName: this.$t('mxpcweb.systemset.SY022.1550113739814')
            }],
            loading: true,
            path: '',
            hasScrollbarValue: true
        }
    },
    created() {
        this.path = this.$route.path
        this.getListData()
    },
    mounted() {
    },
    methods: {
        getNum(item) {
            this.$http.get(this.Global.baseURL + this.Global.api.v2.labelManage, {
                params: {
                    moduleCode: this.moduleCode,
                    labelIds: item.labelId
                }
            }).then((res) => {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    item.useNum = res.body.data[item.labelId + ''] || '0'
                } else {
                    this.$message.error(this.msg(res.body))
                }
            }, (res) => {
                this.$message.error(this.$t(this.Global.errorTitle))
            })
        },
        peopleListReturn(ctId) {
            if (!ctId || ctId == '') {
                return ''
            }
            if (ctId == '10000') {
                // 系统
                return this.$t('mxpcweb.systemset.SY022.1550113740010')
            }
            let content = ''
            if (this.contactList instanceof Object) {
                content = this.contactList[ctId] || ''
            }
            return content
        },
        hasScrollbar() {
            let time = setTimeout(() => {
                let thisDom = this.$refs.customerTables
                if (thisDom) {
                    this.hasScrollbarValue = thisDom.scrollHeight > thisDom.clientHeight
                } else {
                    this.hasScrollbarValue = false
                }
                window.clearTimeout(time)
            }, 5)
        },
        getListData() {
            this.controlData = {
                checkedCities: [],
                checkAll: false, // 列表全选状态弹框
                isIndeterminate: false//
            }
            let data = {
                moduleCode: this.moduleCode,
                searchType: 'list'
            }
            if (this.keywords != '') {
                data.keywords = this.keywords
            }
            let p1 = new Promise((resolve, reject) => {
                this.$http.get(this.Global.baseURL + this.Global.api.v2.label_get, { params: data }).then((res) => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        let list = res.body.data || []
                        resolve(list)
                    } else {
                        resolve([])
                    }
                }, (res) => {
                    resolve([])
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
            })
            let p2 = new Promise((resolve, reject) => {
                this.$http.get(this.Global.baseURL + this.Global.api.v2.labelManage, {
                    params: {
                        moduleCode: this.moduleCode
                    }
                }).then((res) => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        resolve(res.body.data || {})
                    } else {
                        resolve({})
                        this.$message.error(this.msg(res.body))
                    }
                }, (res) => {
                    resolve({})
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
            })
            Promise.all([p1, p2]).then((results) => {
                results[0].forEach(element => {
                    element.useNum = results[1][element.labelId + ''] || '0'
                })
                this.list = results[0]
                this.loading = false
                this.$nextTick(() => {
                    this.hasScrollbar()
                })
            })
            this.listOpt = [{
                iconURI: 'icon-groups',
                optCode: 'otMergeLabel',
                optModuleCode: this.moduleCode,
                // 合并
                optName: this.$t('mxpcweb.systemset.SY022.1550113722444')
            }, {
                iconURI: 'icon-del',
                optCode: 'otLabelsDelete',
                optModuleCode: this.moduleCode,
                // 批量删除
                optName: this.$t('mxpcweb.systemset.SY022.1550113739814')
            }]
        },
        deleteItem(item) {
            this.$confirm('删除后标签将不能恢复，是否删除？', this.$t('mxpcweb.client.1529047715824'), {
                confirmButtonText: this.$t('mxpcweb.client.1529047741736'),
                cancelButtonText: this.$t('mxpcweb.client.1529047588840'),
                type: 'warning'
            }).then(() => {
                this.$http.delete(this.Global.baseURL + this.Global.api.v2.label_delete, { params: { moduleCode: this.moduleCode, labelId: item.labelId } })
                    .then((res) => {
                        if (res.body.code.toString() == this.Global.RES_OK) {
                            this.$message.success(this.msg(res.body))
                            this.getListData()
                        } else {
                            this.$message.error(this.msg(res.body))
                        }
                    }, (res) => {
                        this.$message.error(this.$t(this.Global.errorTitle))
                    })
            }).catch(() => {
            })
        },
        // 单选触发事件
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length
            this.controlData.checkAll = checkedCount === this.list.length// 选中的个数是否等于总个数
            this.controlData.isIndeterminate = checkedCount > 0 && checkedCount < this.list.length
        }
    },
    computed: {
        ...mapGetters([
            'contactList'
        ])
    },
    watch: {
        $route(val, old) {
            if (val.path === this.path) {
                this.getListData()
            }
        }
    },
    components: {
        'page-title': PageTitle,
        'no-data': NoData,
        'foot-control': footControl,
        'add-label': addLabel
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
