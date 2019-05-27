<template>
    <div class="FeedbackDetail" v-loading="loading">
         <!-- 问题详情 -->
        <div class="pageTitle">
            <span style="color:RGBA(144, 147, 153, 1);">
                <i class="iconfont icon-feedback"></i>
                <span style="margin:0 4px;" class="text-hover"  @click="toList()">{{$t('mxpcweb.systemset.feedback.1529065183719')}}</span>
                >
            </span>
            {{$t('mxpcweb.systemset.feedback.1529066209963')}}
        </div>
        <!-- 返回 -->
        <el-button class="backList" size="mini" @click="toList">{{$t('mxpcweb.systemset.feedback.1529408396574')}}</el-button>
        <div class="FeedbackBox MXscroll">
            <div class="title" style="margin-bottom:15px;">
                <summary-vue :isContact="isContact" ref="summaryVue" :optCtId="optCtId" :detailOpt="detailOpt" :summarySet="summarySet" :feedbackDetail="feedbackDetail" @PopupClick="PopupClick"></summary-vue>
            </div>
            <div class="title">
                <link-up :orderRecd="orderRecd" :optCtId="optCtId" :owners="owners" :feedbackDetail="feedbackDetail"></link-up>
            </div>
            <div class="title" v-if="addEditSet.length!=0&&feedbackDetail.workState!='4'&&(isOwner||isAccept)">
                <add-link-up :isContact="isContact" @getDetail="getDetail" :isAccept="isAccept" :optCtId="optCtId" :detailOpt="detailOpt" :addEditSet="addEditSet" :moduleCode="moduleCode" :workId="workId"  :owners="owners" @PopupClick="PopupClick"></add-link-up>
            </div>
            <div class="title" v-if="feedbackDetail.workState=='4'">
                <evaluate @PopupClick="PopupClick" :detailOpt="detailOpt" :isOwner="isOwner" :orderRecd="orderRecd" :optCtId="optCtId" :owners="owners" :feedbackDetail="feedbackDetail"></evaluate>
            </div>
        </div><!-- 操作项 -->
    </div>
</template>

<script>
import { isArray } from '@/libs/utils.js'
import { mapGetters } from 'vuex'
import summaryVue from './detailModule/summary/index'
import addLinkUp from './detailModule/addLinkUp/index'
import linkUp from '@/page/Main/Client/Layout/classicListWorkOrder/detail/detailModule/linkUp/index'
import evaluate from './detailModule/evaluate/index'
export default {
    name: 'FeedbackDetail',
    props: {
    },
    data() {
        return {
            loading: true,
            path: '',
            owners: [],
            dKeys: [],
            feedbackDetail: {
                workId: '',
                workcode: '',
                caption: '',
                content: '',
                category: '',
                createDate: '',
                modifyDate: '',
                priority: '',
                workState: '',
                mail: '',
                product: '',
                ownerctid: '',
                acceptctid: ''
            },
            orderRecd: [], // 历史记录
            workId: '',
            summarySet: [],
            addEditSet: [],
            moduleCode: '',
            viewType: '',
            viewLayout: '',
            detailOpt: [],
            optCtId: '',
            isContact: false,
            isOptUse: false,
            isOwner: false,
            isAccept: false,
            moduleStructId: 'workId',
            moduleStructName: 'workCode'
        }
    },
    mounted() {
    },
    created() {
        let _this = this
        this.unit()
        ep.tail('upDateFeedbackDetail', function (obj) {
            _this.unit()
        })
    },
    mounted() {
    },
    computed: {
        ...mapGetters([
            'company'
        ])
    },
    methods: {
        unit() {
            let _this = this
            this.optCtId = this.company.ctId + ''
            this.viewLayout = 'classicListWorkOrder'
            this.viewType = 'detail'
            this.moduleCode = 'WO001'
            _this.workId = _this.$route.params.id
            // 缓存页面路由
            this.path = this.$route.path
            this.getDetail()
        },
        getData() {
            let _this = this
            setTimeout(function() {
                _this.PopupClick({optCode: 'otEvaluate', optModuleCode: 'WO001'})
            }, 200)
            _this.getDetail()
        },
        PopupClick(item) {
            let _this = this
            let obj = {
                optData: item,
                itemData: _this.feedbackDetail,
                billId: _this.feedbackDetail[_this.moduleStructId],
                billName: _this.feedbackDetail[_this.moduleStructName],
                moduleCode: _this.moduleCode
            }
            if (item.optCode == 'otCloseWork' && _this.isOwner) {
                obj.next = _this.getData
            } else {
                obj.next = _this.getDetail
            }
            if (item.optCode == 'otAddAttach') {
                _this.addAttach(obj)
                return false
            }
            _this.$http.get(this.Global.baseURL + this.Global.api.v2.document_rightCheck_do, { params: {
                moduleCode: _this.moduleCode,
                identFieldValue: _this.feedbackDetail[_this.moduleStructId],
                optCode: item.optCode
            } }).then((res) => {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    ep.emit('optClick', obj)
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, (res) => {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        getDetail() {
            let _this = this
            if (!this.$route.params.id) {
                this.toList()
                return false
            }
            this.loading = true
            let p1 = new Promise((resolve, reject) => {
                    let data = {
                        workId: _this.workId,
                        moduleCode: 'WO001',
                        searchType: 'detail'
                    }
                    _this.$http.get(this.Global.baseURL + this.Global.api.v2.document_feedback, { params: data}).then((res) => {
                        if (res.body.code.toString() == _this.Global.RES_OK) {
                            resolve(res.body.data)
                            _this.loading = false
                        } else {
                            _this.toList()
                            _this.loading = false
                            _this.$message.error(_this.msg(res.body))
                        }
                    }, (res) => {
                        _this.loading = false
                        _this.$message.error(_this.$t(_this.Global.errorTitle))
                    })
            })
            let p2 = new Promise((resolve, reject) => {
                resolve([])
            })
            let p3 = new Promise((resolve, reject) => {
                _this.$http.get(this.Global.baseURL + this.Global.api.v2.fieldShow_get, { params: {
                    moduleCode: 'WO001',
                    type: 'addEditSet',
                    strucId: '2'
                } }).then((res) => {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        resolve(res.body.data)
                    } else {
                        _this.toList()
                        _this.loading = false
                        _this.$message.error(_this.msg(res.body))
                    }
                }, (res) => {
                    _this.loading = false
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            })
            let p4 = new Promise((resolve, reject) => {
                let data = {
                        workId: this.$route.params.id,
                        moduleCode: 'WO001',
                        searchType: 'childList',
                        strucId: '2',
                        from: 0,
                        size: 50,
                        sort: 'createDate',
                        order: 'desc'
                    }
                _this.$http.get(this.Global.baseURL + this.Global.api.v2.document_generalOperate_get, {
                    params: data
                }).then((res) => {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        if (isArray(res.body.data.list)) {
                            resolve(res.body.data.list)
                        } else {
                            resolve([])
                        }
                    } else {
                        _this.toList()
                        _this.loading = false
                        _this.$message.error(_this.msg(res.body))
                    }
                }, (res) => {
                    _this.loading = false
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            })
            let p5 = new Promise((resolve, reject) => {
                let contactData = {
                    dataType: 'contact',
                    funType: 'all'
                }
                _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.accountDropList_get, { params: contactData }).then((res) => {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        resolve(res.body.data)
                    } else {
                        _this.toList()
                        _this.loading = false
                        _this.$message.error(_this.msg(res.body))
                    }
                }, (res) => {
                    _this.loading = false
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            })
            let p6 = new Promise((resolve, reject) => {
                let contactData = {
                    dataType: 'department',
                    funType: 'all',
                    deptCascade: 'false'
                }
                _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.accountDropList_get, { params: contactData }).then((res) => {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        resolve(res.body.data)
                    } else {
                        _this.toList()
                        _this.loading = false
                        _this.$message.error(_this.msg(res.body))
                    }
                }, (res) => {
                    _this.loading = false
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            })
            let p7 = new Promise((resolve, reject) => {
                 // 获取空间操作按钮列表
                _this.$http.get(this.Global.baseURL + this.Global.api.v2.moduleOptSet_get, { params: {
                    viewType: _this.viewType,
                    viewLayout: _this.viewLayout,
                    moduleCode: _this.moduleCode
                } }).then((res) => {
                    if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data.fastOpt)) {
                        // _this.fastOpt = res.body.data.fastOpt
                        resolve(res.body.data.detailOpt)
                        // _this.listOpt = res.body.data.listOpt
                    } else {
                        _this.toList()
                        _this.loading = false
                        _this.$message.error(_this.msg(res.body))
                    }
                }, (res) => {
                    _this.loading = false
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            })
            let p8 = new Promise((resolve, reject) => {
                _this.$http.get(this.Global.baseURL + this.Global.api.v2.contact_do, {
                    params: {
                        type: 'isAdmin'
                    }
                }).then((res) => {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        resolve(res.body.data.isAdmin)
                    } else {
                        _this.toList()
                        _this.$message.error(_this.msg(res.body))
                    }
                }, (res) => {
                    // _this.loading = false;
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            })
            Promise.all([p1, p2, p3, p4, p5, p6, p7, p8]).then(function(results) {
                _this.owners = results[4]
                _this.dKeys = results[5]
                _this.detailOpt = results[6]
                _this.feedbackDetail = results[0]
                _this.summarySet = results[1]
                _this.addEditSet = results[2]
                _this.orderRecd = results[3]
                _this.isContact = results[7]
                _this.isAccept = _this.optCtId == _this.feedbackDetail.acceptCtId
                _this.isOwner = _this.optCtId == _this.feedbackDetail.ownerCtId
                // console.log(results[0])
                // console.log(results[1])
                // console.log(results[2])
                // console.log(results[3])
                // console.log(results[4])
                _this.loading = false
            })
        },
        toList() {
            this.$router.push('/main/systemset/feedback')
        }
    },
    components: {
        'summary-vue': summaryVue,
        'add-link-up': addLinkUp,
        'link-up': linkUp,
        'evaluate': evaluate
    },
    watch: {
        '$route': function(val, old) {
            if (val.path === this.path) {
                let _this = this
                this.optCtId = this.company.ctId + ''
                this.viewLayout = 'classicListWorkOrder'
                this.viewType = 'detail'
                this.moduleCode = 'WO001'
                _this.workId = _this.$route.params.id
                // 缓存页面路由
                this.path = this.$route.path
                _this.feedbackDetail = {
                    workId: '',
                    workcode: '',
                    caption: '',
                    content: '',
                    category: '',
                    createDate: '',
                    modifyDate: '',
                    priority: '',
                    workState: '',
                    mail: '',
                    product: '',
                    ownerctid: '',
                    acceptctid: ''
                }
                this.getDetail()
            }
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
