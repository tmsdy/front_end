<template>
    <div class="FeedbackDetail MXscroll" v-loading="loading">
        <div class="FeedbackBox">
            <div class="title">
                <summary-vue :isContact="isContact" ref="summaryVue" :optCtId="optCtId" :detailOpt="detailOpt" :summarySet="summarySet" :feedbackDetail="feedbackDetail" @PopupClick="PopupClick"></summary-vue>
            </div>
            <div class="title" v-if="addEditSet.length!=0&&feedbackDetail.workState!='4'&&(isOwner||isAccept)">
                <add-link-up :isContact="isContact" @getDetail="getDetail" :isAccept="isAccept" :optCtId="optCtId" :detailOpt="detailOpt" :addEditSet="addEditSet" :moduleCode="moduleCode" :workId="workId"  :owners="owners" @PopupClick="PopupClick"></add-link-up>
            </div>
            <div class="title">
                <link-up :orderRecd="orderRecd" :optCtId="optCtId" :owners="owners" :feedbackDetail="feedbackDetail"></link-up>
            </div>
            <div class="title" v-if="feedbackDetail.workState=='4'">
                <evaluate @PopupClick="PopupClick" :isOwner="isOwner" :orderRecd="orderRecd" :optCtId="optCtId" :owners="owners" :feedbackDetail="feedbackDetail"></evaluate>
            </div>
            <div class="baseMsg">
                <base-msg ref="baseMsg" :viewSet="viewSet" :feedbackDetail="feedbackDetail" :owners="owners" :dKeys="dKeys"></base-msg>
            </div>
        </div>
    </div>
</template>

<script>
import { isArray } from '@/libs/utils.js'
import { mapGetters } from 'vuex'
import summaryVue from './detailModule/summary/index'
import baseMsg from './detailModule/baseMsg/index'
import addLinkUp from './detailModule/addLinkUp/index'
import linkUp from './detailModule/linkUp/index'
import evaluate from './detailModule/evaluate/index'
export default {
    name: 'FeedbackDetail',
    props: {
    },
    data() {
        return {
            loading: false,
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
            viewSet: [],
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
        this.optCtId = this.company.ctId + ''
        let { viewLayout, moduleCode } = this.getRoute()
        this.viewLayout = viewLayout
        this.viewType = 'detail'
        this.moduleCode = moduleCode
        _this.workId = _this.$route.params.id
        // 缓存页面路由
        this.path = this.$route.path
        this.getDetail()
        // 注册刷新详情页事件
        ep.tail(this.path + 'update', () => {
            this.getDetail(true)
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
        PopupClick(item) {
            let _this = this
            let obj = {
                optData: item,
                itemData: _this.feedbackDetail,
                billId: _this.feedbackDetail[_this.moduleStructId],
                billName: _this.feedbackDetail[_this.moduleStructName],
                moduleCode: _this.moduleCode
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
                    if (item.optCode == 'otCloseWork' && _this.isOwner) {
                        obj.next = _this.getData
                    } else {
                        obj.next = _this.getDetail
                    }
                    ep.emit('optClick', obj)
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, (res) => {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        getData() {
            let _this = this
            setTimeout(function() {
                _this.PopupClick({optCode: 'otEvaluate', optModuleCode: 'WO001'})
            }, 200)
            _this.getDetail()
        },
        getDetail(update) {
            let _this = this
            if (!this.$route.params.id) {
                this.toList()
                return false
            }
            if (update) {
                this.loading = true
            }
            let p1 = new Promise((resolve, reject) => {
                    let data = {
                        identFieldValue: _this.workId,
                        moduleCode: 'WO001',
                        searchType: 'detail'
                    }
                    _this.$http.get(this.Global.baseURL + this.Global.api.v2.document_generalOperate_get, { params: data}).then((res) => {
                        if (res.body.code.toString() == _this.Global.RES_OK) {
                            resolve(res.body.data)
                            _this.loading = false
                        } else {
                            _this.loading = false
                            _this.toList()
                            _this.$message.error(_this.msg(res.body))
                        }
                    }, (res) => {
                        _this.loading = false
                        _this.$message.error(_this.$t(_this.Global.errorTitle))
                    })
            })

            let p2 = new Promise((resolve, reject) => {
                _this.$http.get(this.Global.baseURL + this.Global.api.v2.fieldShow_get, { params: {
                    moduleCode: 'WO001',
                    type: 'viewSet'
                } }).then((res) => {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        resolve(res.body.data)
                    } else {
                        _this.loading = false
                        _this.toList()
                        _this.$message.error(_this.msg(res.body))
                    }
                }, (res) => {
                    _this.loading = false
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            })

            let p3 = new Promise((resolve, reject) => {
                _this.$http.get(this.Global.baseURL + this.Global.api.v2.fieldShow_get, { params: {
                    moduleCode: 'WO001',
                    type: 'summarySet'
                } }).then((res) => {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        resolve(res.body.data)
                    } else {
                        _this.loading = false
                        _this.toList()
                        _this.$message.error(_this.msg(res.body))
                    }
                }, (res) => {
                    _this.loading = false
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            })
            let p4 = new Promise((resolve, reject) => {
                _this.$http.get(this.Global.baseURL + this.Global.api.v2.fieldShow_get, { params: {
                    moduleCode: 'WO001',
                    type: 'addEditSet',
                    strucId: '2'
                } }).then((res) => {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        resolve(res.body.data)
                    } else {
                        _this.loading = false
                        _this.toList()
                        _this.$message.error(_this.msg(res.body))
                    }
                }, (res) => {
                    _this.loading = false
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            })
            let p5 = new Promise((resolve, reject) => {
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
                        _this.loading = false
                        _this.toList()
                        _this.$message.error(_this.msg(res.body))
                    }
                }, (res) => {
                    _this.loading = false
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            })
            let p6 = new Promise((resolve, reject) => {
                let contactData = {
                    dataType: 'contact',
                    funType: 'all'
                }
                _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.accountDropList_get, { params: contactData }).then((res) => {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        resolve(res.body.data)
                    } else {
                        _this.loading = false
                        _this.toList()
                        _this.$message.error(_this.msg(res.body))
                    }
                }, (res) => {
                    _this.loading = false
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            })
            let p7 = new Promise((resolve, reject) => {
                let contactData = {
                    dataType: 'department',
                    funType: 'all',
                    deptCascade: 'false'
                }
                _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.accountDropList_get, { params: contactData }).then((res) => {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        resolve(res.body.data)
                    } else {
                        _this.loading = false
                        _this.toList()
                        _this.$message.error(_this.msg(res.body))
                    }
                }, (res) => {
                    _this.loading = false
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            })
            let p8 = new Promise((resolve, reject) => {
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
            let p9 = new Promise((resolve, reject) => {
                _this.$http.get(this.Global.baseURL + this.Global.api.v2.contact_do, {
                    params: {
                        type: 'isAdmin'
                    }
                }).then((res) => {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        resolve(res.body.data.isAdmin)
                    } else {
                        _this.loading = false
                        _this.toList()
                        _this.$message.error(_this.msg(res.body))
                    }
                }, (res) => {
                    // _this.loading = false;
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            })
            Promise.all([p1, p2, p3, p4, p5, p6, p7, p8, p9]).then(function(results) {
                _this.owners = results[5]
                _this.dKeys = results[6]
                _this.feedbackDetail = results[0]
                _this.viewSet = results[1]
                _this.summarySet = results[2]
                _this.addEditSet = results[3]
                _this.orderRecd = results[4]
                _this.detailOpt = results[7]
                _this.isContact = results[8]
                _this.isAccept = _this.optCtId == _this.feedbackDetail.acceptCtId
                _this.isOwner = _this.optCtId == _this.feedbackDetail.ownerCtId
                _this.loading = false
            })
        },
        toList() {
            this.$router.push('/main/client/tabs/list/WO001/index')
        }
    },
    components: {
        'summary-vue': summaryVue,
        'base-msg': baseMsg,
        'add-link-up': addLinkUp,
        'link-up': linkUp,
        'evaluate': evaluate
    },
    watch: {
        '$route': function(val, old) {
            if (val.path === this.path) {
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
