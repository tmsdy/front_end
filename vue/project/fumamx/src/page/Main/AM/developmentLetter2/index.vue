<template>
    <div class="developmentLetter2 MXscroll">
        <div v-if="tabData=='1'">
            <div class="developmentLetterBox">
                <div class="developmentLetterBoxSearch">
                    <div class="addButtonBox">
                        <!-- 新建开发信 -->
                        <el-button class="addButton" type="primary" @click="addButton()" size="small">{{$t('mxpcweb.am.1531892988479')}}</el-button>
                    </div>
                    <!-- 模板名称 -->
                    <el-input class="addInput" v-model="keywords" :placeholder="$t('mxpcweb.am.1531893007933')" icon="search" @keyup.enter.native="getListData" :on-icon-click="getListData"></el-input>
                    <el-select class="addInput" v-if="isContact" v-model="ownersSelect" filterable @change="getListData()">
                        <el-option v-for="item in owners" :key="item.ctId" v-if="item.inUse==1" :label="item.realName" :value="item.ctId">
                        </el-option>
                    </el-select>
                </div>
                <div class="developmentLetterBoxList developmentLetterBoxTit MXscroll" v-loading="loading" :style="blockData.total>blockData.pageSize?'padding-bottom: 44px;':'padding-bottom: 0;'">
                    <el-row class="list" :gutter="20">
                        <!-- 模板名称 -->
                        <el-col :span="4">{{$t('mxpcweb.am.1531893007933')}}</el-col>
                        <!-- 所属模块 -->
                        <el-col :span="3">{{$t('mxpcweb.am.1541590431848')}}</el-col>
                        <!-- 邮件主题 -->
                        <el-col :span="3">{{$t('mxpcweb.am.1531893014400')}}</el-col>
                        <!-- 模板类型 -->
                        <!-- <el-col :span="2">{{$t('mxpcweb.am.1531893015388')}}</el-col> -->
                        <!-- 使用人员 -->
                        <el-col :span="3">{{$t('mxpcweb.am.1531904286368')}}</el-col>

                        <!-- 创建时间 -->
                        <el-col :span="4">{{$t('mxpcweb.am.1543298040294')}}</el-col>
                        <!-- 创建人 -->
                        <el-col :span="3">{{$t('mxpcweb.am.1543298040653')}}</el-col>
                        <el-col :span="4"></el-col>
                    </el-row>
                    <no-data v-if="developmentLetterList.length==0&&!loading" style="background:rgba(255,255,255,0)"></no-data>
                    <el-row v-else class="list1" :gutter="20" v-for="(item,index) in developmentLetterList" :key="index">
                        <el-col :span="4" class="ellipsis" :title="item.name">{{item.name}}&nbsp;</el-col>
                        <!-- 所属模块 -->
                        <el-col :span="3" class="ellipsis">{{moduleCodeListGet(item.moduleCode)}}&nbsp;</el-col>
                        <el-col :span="3" class="ellipsis" :title="item.subject">{{item.subject}}&nbsp;</el-col>
                        <!-- 触发 -->
                        <!-- 批量 -->
                        <!-- <el-col :span="2">{{item.type=="0"?$t('mxpcweb.am.1531893043662'):$t('mxpcweb.am.1531893050821')}}</el-col> -->
                        <!-- 仅自己 -->
                        <!-- 全体人员 -->
                        <el-col :span="3" class="ellipsis">{{item.isPublic == '0' ? $t('mxpcweb.am.1540284818773') : $t('mxpcweb.am.1540284862709')}}</el-col>

                        <el-col :span="4" class="ellipsis" :title="item.createDate">{{dateFormat(item.createDate,'yyyy-MM-dd hh:mm')}}&nbsp;</el-col>
                        <el-col :span="3" class="ellipsis">{{returnPeople(item.createCtId)}}&nbsp;</el-col>
                        <el-col :span="4" class="listCol4">
                            <div class="listCol4Item">
                                <!-- 发信 -->
                                <span class="optButton" v-if="item.isPublic==1||item.createCtId==company.ctId" @click="sendMail(item)" :title="$t('mxpcweb.am.1531893058358')">
                                    <i class="iconfont icon-send"></i>
                                </span>
                                <!-- 预览 -->
                                <span class="optButton left10" @click="$refs.preview.isShowTemplate(item.invokeName)" :title="$t('mxpcweb.am.1531893065005')">
                                    <i class="iconfont icon-eye"></i>
                                </span>
                                <!-- 编辑 -->
                                <span class="optButton left10" v-if="item.createCtId==company.ctId" style="margin-left:10px;" @click="toEditThis(item)" :title="$t('mxpcweb.am.1531893071733')">
                                    <i class="iconfont icon-edit"></i>
                                </span>
                                <!-- 复制 -->
                                <span class="optButton left10" style="margin-left:10px;" @click="$refs.clone.showDialog(item)" :title="$t('mxpcweb.am.1531893077381')">
                                    <i class="iconfont icon-copy"></i>
                                </span>
                                <!-- 删除 -->
                                <span class="optButton left10" v-if="item.createCtId==company.ctId" style="margin-left:10px;" @click="deleteItem(item)" :title="$t('mxpcweb.am.1531893085173')">
                                    <i class="iconfont icon-del"></i>
                                </span>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <clone ref="clone" @getListData="getListData"></clone>
            <!-- 开发信 -->
            <!-- <page-title :title="$t('mxpcweb.am.1531893092789')" iconfont="icon-edit-single">
            </page-title> -->
            <!--分页-->
            <list-page style="background:#f7f8f9;text-align:center" :blockData="blockData" @getListData="getListData"></list-page>
        </div>
        <add-name v-if="tabData=='2'" @tabDataCheck="tabDataCheck" @toAddTemplateDrag="toAddTemplateDrag" @toAddTemplateCode="toAddTemplateCode" :moduleCodeList="moduleCodeList" :templateMarketId="templateMarketId"></add-name>
        <!-- 编辑器 -->
        <template-editor :visible.sync="isOpenDrag" :TemplateID='tempId' @success="unit()" ref="templateEditorDrag"></template-editor>
        <!-- html编辑器 -->
        <html-editor :visible.sync="isOpenCode" :TemplateID='tempId' @success="unit()" ref="templateEditorCode"></html-editor>
        <!-- 预览 -->
        <editor-preview ref="preview"></editor-preview>
    </div>
</template>

<script>
import PageTitle from '@/components/PageTitle/index' // 大标题
import listPage from '@/components/listPageTwo/index' // 分页
import { isArray, setStore } from '@/libs/utils.js'
import NoData from '@/basecomponents/NoData/index'
import addName from './vue/addName'
import clone from './vue/clone'
import editorTemplate from '@/components/editorTemplate/index'
import editorHtml from '@/components/editorHtml/index'
import editorPreview from '@/components/editorPreview/index' // 预览
import mixin from '../mixin.js'

import { mapGetters } from 'vuex'
export default {
    name: 'developmentLetter2',
    props: {

    },
    mixins: [mixin],
    data() {
        return {
            isOpenDrag: false,
            isOpenCode: false,
            tempId: null,
            loading: true,
            keywords: '',
            tabData: '1',
            developmentLetterList: [],
            // 分页操作
            blockData: {
                pageSize: 20,
                total: 0,
                fromNum: 1
            },
            owners: [],
            isContact: true,
            ownersSelect: '',
            moduleCodeList: [],
            isAdd: false,
            templateMarketId: ''
        }
    },
    created() {
        this.routeUrl = this.$route.path
        // this.contactCheck()
        this.unit()
        this.getModule()
    },
    methods: {
        addButton() {
            this.isAdd = true
            this.tabData = '2'
        },
        moduleCodeListGet(code) {
            let text = ''
            this.moduleCodeList.forEach(element => {
                if (element.moduleCode == code) {
                    text = element.showName
                }
            })
            return text
        },
        // 去编辑这条列表，打开编辑器
        toEditThis(item) {
            if (item.editType == 0) {
                this.isOpenDrag = true // 拖拽打开
            }
            if (item.editType == 1) {
                this.isOpenCode = true // 源码打开
            }
            this.tempId = item.invokeName
        },
        // 监听,去新增一个拖拽模板
        toAddTemplateDrag(obj) {
            this.isOpenDrag = true
            this.$refs.templateEditorDrag.addOneTemp(obj)
        },
        // 监听,去新增一个源码模板
        toAddTemplateCode(obj) {
            this.isOpenCode = true
            this.$refs.templateEditorCode.addOneTemp(obj)
        },
        // contactCheck() {
        //     let _this = this
        //     _this.$http.get(this.Global.baseURL + this.Global.api.v2.contact_do, {
        //         params: {
        //             type: 'isAdmin'
        //         }
        //     }).then(function (res) {
        //         if (res.body.code.toString() == _this.Global.RES_OK) {
        //             if (res.body.data.isAdmin) {
        //                 _this.isContact = true
        //                 // _this.ownersSelect = _this.company.ctId
        //             } else {
        //                 _this.isContact = false
        //             }
        //         } else if (res.body.code.toString() != '-3') {
        //             _this.$message.error(_this.msg(res.body))
        //         }
        //     }, function (res) {
        //         // _this.loading = false;
        //         _this.$message.error(_this.$t(_this.Global.errorTitle))
        //     })
        // },
        sendMail(item) {
            setStore('sendMailTopageData', { invokeName: item.invokeName, type: '2', types: '1' })
            this.$router.push('/main/am/mailMarketing')
        },
        tabDataCheck(type) {
            this.tabData = type
            if (type == '1') {
                if (this.isAdd) {
                    this.blockData.fromNum = 1
                    this.isAdd = false
                }
                this.getListData()
            }
        },
        returnPeople(ctid) {
            let name = ''
            this.owners.forEach(element => {
                if (element.ctId === ctid) {
                    name = element.realName
                }
            })
            return name
        },
        deleteItem(item) {
            let _this = this
            // 是否删除模板:
            // 提示
            this.$confirm(this.$t('mxpcweb.am.1531897095537') + ':(' + item.name + ')?', this.$t('mxpcweb.am.1531893166645'), {
                // 确定
                confirmButtonText: this.$t('mxpcweb.am.1531893129621'),
                // 取消
                cancelButtonText: this.$t('mxpcweb.am.1531893140621'),
                type: 'warning'
            }).then(() => {
                _this.$http.delete(this.Global.baseURL + this.Global.api.v2.template_delete, { params: { invokeName: item.invokeName } }).then(function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        _this.getListData()
                        _this.$message.success(_this.msg(res.body))
                    } else if (res.body.code.toString() != '-3') {
                        _this.$message.error(_this.msg(res.body))
                    }
                }, function (res) {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            }).catch(() => {
            })
        },
        unit() {
            let _this = this
            _this.tabDataCheck('1') // 新增后初始到当前
            var p1 = new Promise((resolve, reject) => {
                let contactData = {
                    // dataType: 'contact',
                    // funType: 'all'
                    dataType: 'contact',
                    funType: 'withRight',
                    moduleCode: 'AM001', // this.moduleCode,
                    optCode: 'otView'
                }
                _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.accountDropList_get, { params: contactData }).then(function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        let data = res.body.data
                        let str = _this.$t('mxpcweb.am.1541747843192')
                        data.splice(0, 0, { ctId: '', inUse: 1, realName: str })
                        _this.owners = data
                        resolve([])
                    } else {
                        _this.$message(_this.msg(res.body))
                        resolve([])
                    }
                }, function (res) {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            })

            var p2 = new Promise((resolve, reject) => {
                let data = {
                    pageN: _this.blockData.fromNum, // parseInt(_this.blockData.fromNum / _this.blockData.pageSize) + 1,
                    pageSize: _this.blockData.pageSize,
                    emailType: 1
                }
                if (this.keywords != '') {
                    data.keyword = this.keywords
                };
                if (this.ownersSelect != '') {
                    data.subCtId = this.ownersSelect
                }
                _this.$http.get(this.Global.baseURL + this.Global.api.v2.template_list, { params: data }).then(function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        if (res.body.data.tmplList && isArray(res.body.data.tmplList)) {
                            resolve(res.body.data)
                        } else {
                            resolve({ resultCount: 0, tmplList: [] })
                        }
                    } else if (res.body.code.toString() != '-3') {
                        _this.$message.error(_this.msg(res.body))
                    }
                    _this.loading = false
                }, function (res) {
                    _this.loading = false
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            })
            Promise.all([p1, p2]).then(function (results) {
                _this.loading = false
                _this.developmentLetterList = results[1].tmplList
                _this.blockData.total = results[1].rowTotal
            })
        },
        getModule() {
            let _this = this
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.autoStrategy_controlTypeV2, {
                params: {
                    actionId: 1,
                    dataType: 'modules',
                    placeHolderFlag: 0
                }
            }).then((res) => {
                if (res.body.code.toString() === _this.Global.RES_OK) {
                    if (isArray(res.body.data.list)) {
                        _this.moduleCodeList = res.body.data.list
                    } else {
                        _this.moduleCodeList = []
                    }
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.$message.error(this.$t(this.Global.errorTitle))
            })
        },
        getListData(obj) {
            let _this = this
            let data = {
                pageN: _this.blockData.fromNum, // parseInt(_this.blockData.fromNum / _this.blockData.pageSize) + 1,
                pageSize: _this.blockData.pageSize,
                emailType: 1
            }
            if (this.keywords != '') {
                data.keyword = this.keywords
            }
            if (this.ownersSelect != '') {
                data.subCtId = this.ownersSelect
            }
            _this.$http.get(this.Global.baseURL + this.Global.api.v2.template_list, { params: data }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    if (res.body.data.tmplList && isArray(res.body.data.tmplList)) {
                        _this.developmentLetterList = res.body.data.tmplList
                        _this.blockData.total = res.body.data.rowTotal
                    } else {
                        _this.developmentLetterList = []
                        _this.blockData.total = 0
                    }
                    _this.loading = false
                } else if (res.body.code.toString() != '-3') {
                    _this.$message.error(_this.msg(res.body))
                    _this.loading = false
                } else {
                    _this.loading = false
                }
            }, function (res) {
                _this.loading = false
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        // 检测来自模板市场
        checkRouteByTemplateMarket(item) {
            // console.log(' jii ')
            this.tabData = '2'
            this.templateMarketId = item.templateId + ''
            // if (window.marketId && window.marketId != '') {
            //     this.templateMarketId = window.marketId
            //     this.tabData = '2'
            //     delete window.marketId
            // } else {
            //     this.templateMarketId = ''
            //     this.tabData = '1'
            // }
        }
    },
    computed: {
        ...mapGetters(['company'])
    },
    watch: {
        '$route': function (val, old) {
            if (val.path == this.routeUrl) {
                this.tabData = '1'
                this.getListData()
            }
        },
        tabData: function (val, old) {
            // 切走了，就清空
            if (val != '2') {
                this.templateMarketId = ''
                this.isOpenDrag = false
            }
        }
    },
    components: {
        'page-title': PageTitle,
        'list-page': listPage,
        'no-data': NoData,
        'add-name': addName,
        'template-editor': editorTemplate,
        'html-editor': editorHtml,
        'clone': clone,
        'editor-preview': editorPreview
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
