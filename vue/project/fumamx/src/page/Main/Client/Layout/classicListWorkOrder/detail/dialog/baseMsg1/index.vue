<template>
    <div class="FeedbackDetail MXscroll" v-loading="loading">
        <div class="FeedbackBox">
            <div class="title">
                <div class="titleList1" v-for="(item,index) in summarySet" :key="index">
                    {{item.cnFieldCaption}}:<span class="titleContent">{{feedbackDetail[item.fieldName]}}</span>
                </div>
            </div>
            <div class="addFeedback" v-if="feedbackDetail.workState!='4'&&(company.ctId==feedbackDetail.acceptCtId||company.ctId==feedbackDetail.ownerCtId)">
                <div class="historyTitle">
                    回复
                </div>
                <div class="addFeedbackBox">
                    <div style="margin-bottom: 10px;">
                        <el-input type="textarea" :rows="5" v-model="addRemindForm.content"  size="small"></el-input>
                    </div>
                    <label for="importScollBox_excels2" class="text-hover" style="color:#6CA2FF"><i class="iconfont icon-attachment"></i>上传附件</label>
                    <file-upload :file-list="files" :limitSize="10">
                        <el-button id="importScollBox_excels2" slot="trigger" size="small" type="primary"   v-show="false">选择文件</el-button>
                    </file-upload>
                </div>
                <div class="addFeedbackFoot">
                    <el-button size="small" type="primary" style="width:60px;" @click="submits()" :loading="loading1">提交</el-button>
                    <div style="float:right;">
                        <el-button type="primary"  v-if="company.ctId==feedbackDetail.acceptCtId" size="small" style="width:80px" @click="TransferOrder=true">转交工单</el-button>
                        <el-button type="success"  size="small" style="width:80px" @click="closeOrder=true">关闭工单</el-button>
                    </div>
                </div>
            </div>
            <div class="history">
                <div class="historyTitle">
                    沟通记录
                </div>
                <div class="historyContent">

                    <template v-if="orderRecd&&orderRecd.length>0">
                        <div v-if="orderRecd&&orderRecd.length>0" class="historyContentBox" v-for="(item,index) in orderRecd" :key="index">
                            <div class="historyContentImg">
                                <img class="avatar"  v-imgsrc="avatarSrc(item.modifyCtId)">
                                <!-- <img src="./u16684.jpg" alt=""> -->
                            </div>
                            <div class="historyContentMsg">
                                {{item.recdContent}}
                                <div :style="item.modifyCtId!=feedbackDetail.ownerCtId?'color:black;font-weight:bold':''">
                                    <span v-if="item.recdType=='1'">
                                        <span>{{item.content}}</span>
                                    </span>
                                    <span v-else-if="item.recdType=='2'">
                                        {{item.rawData}}
                                        <span v-if="item.content!=''">&nbsp;&nbsp;&nbsp;&nbsp;备注：{{item.content}}</span>
                                    </span>
                                    <span v-else>
                                        {{item.rawData}}
                                    </span>
                                    <span  v-if="item.fileInfo&&item.fileInfo.length!=0">
                                        <span class="text-hover" style="color:rgb(108, 162, 255);text-decoration:underline;margin-left:10px" v-for="(items,indexs) in item.fileInfo" :key="indexs" @click="downLoad(items)">
                                            附件
                                        </span>
                                    </span>
                                </div>
                                <div>
                                    {{item.modifyDate}}
                                </div>
                            </div>
                        </div>
                    </template>
                    <div v-else class="historyContentNo">
                        暂无沟通记录
                    </div>
                     <div v-if="feedbackDetail.workState=='4'" class="historyContentBox" style="background:#f7f7f7">
                        <template v-if="feedbackDetail.score != 0">
                            <div class="historyContentImg">
                                <img class="avatar"  v-imgsrc="avatarSrc(feedbackDetail.createCtId)">
                            </div>
                            <div class="historyContentMsg">
                                <div>
                                    <span>
                                        {{returnCtIdName(feedbackDetail.createCtId)}}：
                                    </span>
                                </div>
                                <div style="line-height:24px;height:30px">
                                    <span style="float:left">
                                        推荐指数：
                                    </span>
                                    <el-rate style="float:left;padding:0 10px;" v-model="feedbackDetail.score" :texts="evaluateText" text-color="rgb(247, 186, 42)" show-text></el-rate>
                                    <div class="starMask"></div>
                                </div>
                                <div>
                                    <span>
                                        评价内容：{{feedbackDetail.evaluate==""?"无建议和意见":feedbackDetail.evaluate}}
                                    </span>
                                </div>
                                <div>
                                    {{feedbackDetail.modifyDate}}
                                </div>
                            </div>
                        </template>
                        <div v-else class="historyContentMsg">
                            此用户尚未做出评价
                        </div>
                    </div>
                </div>
            </div>
            <div class="baseMsg">
                <div class="historyTitle">
                    工单信息
                </div>
                <div class="baseMsgContent">
                    <div class="baseMsgList" v-for="(item,index) in viewSet" :key="index">
                        <span class="fieldName">{{item.cnFieldCaption}}</span>{{feedbackDetail[item.fieldName]}}
                    </div>
                </div>
            </div>
        </div>
        <el-dialog title="转交工单" :visible.sync="TransferOrder" :closeOnClickModal="false" custom-class="width520" :modal-append-to-body="false">
            <div class="TransferOrderBox">
                工单受理人<br>
                <el-select v-model="Superadministrator" placeholder="超级管理员" size="small" style="margin:10px 0;width:350px;">
                    <el-option v-for="item in personnelTable1" :key="item.ctId" :label="item.realName" :value="item.ctId+''">
                    </el-option>
                </el-select><br>
                <el-input v-model="transferContent" type="textarea" size="small" placeholder="请填写备注"  style="width:350px;"></el-input>
            </div>
            <div slot="footer" class="dialogFooter">
                <el-button type="primary" size="small" style="width:80px;" @click="transfer()"  :loading="loading2">转交工单</el-button>
            </div>
        </el-dialog>
        <el-dialog title="关闭工单" :visible.sync="closeOrder" :closeOnClickModal="false" custom-class="width520" :modal-append-to-body="false">
            <div class="closeProblemBox">
                关闭后，工单将不可再次修改与回复
                    确定关闭该工单？
            </div>
            <div slot="footer" class="dialogFooter">
                <el-button type="primary" size="small" style="width:66px;"  :loading="loading5">确定</el-button>
                <el-button @click="closeOrder = false"  size="small" style="width:66px;">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import PageTitle from '@/components/PageTitle/index' // 大标题
import { isArray } from '@/libs/utils.js'
import { mapGetters } from 'vuex'
import FileUpload from '@/components/FileUpload/index' // 文件上传
export default {
    name: 'FeedbackDetail',
    props: {
    },
    data() {
        return {
            evaluateText: ['1.0  产品功能差', '2.0  产品功能一般', '3.0  产品功能还行', '4.0  产品很稳定，愿意推荐', '5.0  产品很好用，非常愿意推荐'],
            previousRequest: null,
            loading: false,
            loading1: false,
            loading2: false,
            loading5: false,
            pageName: '',
            personnelTable: [],
            personnelTable1: [],
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
            files: [],
            addRemindForm: {
                content: '',
                workId: '',
                recdType: '1',
                sourceId: 'pc'
            },
            orderRecd: [], // 历史记录
            closeOrder: false,
            TransferOrder: false,
            Superadministrator: '',
            transferContent: '',
            workId: '',
            firstData: true,
            viewSet: [],
            summarySet: [],
            addEditSet: []
        }
    },
    mounted() {

    },
    created() {
        let _this = this
        _this.workId = _this.$route.params.id
        // 缓存页面路由
        this.pageName = this.$route.name
        this.getDetail()
        this.getOrderRecd()
        this.getPeopleList()
    },
    mounted() {
    },
    computed: {
        ...mapGetters([
            'company'
        ])
    },
    methods: {

        downLoad(obj) {
            window.location.href = this.Global.downloadBaseUrl + obj.url
        },
        transfer() {
            if (this.Superadministrator == '') {
                this.$message.error('请选择移交人员')
            } else {
                this.submit('2')
                this.loading2 = true
            }
        },
        submits() {
            let _this = this
            if (this.addRemindForm.content == '') {
                this.$message.error('请添加描述')
            } else {
                _this.loading1 = true
                _this.$http.post(_this.Global.baseURL + _this.Global.api.v2.document_generalOperate_add, {
                    workId: this.$route.params.id,
                    moduleCode: 'WO001',
                    strucId: '2',
                    recdContent: this.addRemindForm.content,
                    attachfile: this.addRemindForm.files
                }).then((res) => {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        _this.$message.success(_this.msg(res.body))
                        this.addRemindForm.content = ''
                        _this.getOrderRecd()
                        _this.loading1 = false
                    } else {
                        _this.$message.error(_this.msg(res.body))
                        _this.loading1 = false
                    }
                }, (res) => {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                    _this.loading1 = false
                })
            }
        },

        // 图像
        avatarSrc(modifyCtId) {
            let imgId = this.returnImg(modifyCtId)
            if (!imgId || imgId.length === 0) {
                imgId = '3,02e1899eb0d8' // 为空时，默认灰头像
            }
            return this.getGlobalImgSrc(imgId, '55x55')
        },
        getDetail() {
            let _this = this
            let p1 = new Promise((resolve, reject) => {
                if (this.$route.params.id) {
                    let data = {
                        identFieldValue: this.$route.params.id,
                        moduleCode: 'WO001',
                        searchType: 'detail'
                    }
                    _this.$http.get(this.Global.baseURL + this.Global.api.v2.document_generalOperate_get, { params: data}).then((res) => {
                        if (res.body.code.toString() == _this.Global.RES_OK) {
                                resolve(res.body.data)
                                _this.loading = false
                        } else {
                            _this.loading = false
                            _this.$message.error(_this.msg(res.body))
                        }
                    }, (res) => {
                        _this.loading = false
                        _this.$message.error(_this.$t(_this.Global.errorTitle))
                    })
                } else {
                    this.toList()
                }
            })
            let p2 = new Promise((resolve, reject) => {
                if (this.$route.params.id) {
                    _this.$http.get(this.Global.baseURL + this.Global.api.v2.statusChange_get, { params: {
                        workId: this.$route.params.id
                    } }).then((res) => {
                        if (res.body.code.toString() == _this.Global.RES_OK) {
                            resolve(res.body.data.list)
                        } else {
                            resolve([])
                            _this.$message.error(_this.msg(res.body))
                        }
                    }, (res) => {
                        _this.$message.error(_this.$t(_this.Global.errorTitle))
                    })
                } else {
                    _this.toList()
                }
            })

            let p3 = new Promise((resolve, reject) => {
                if (this.$route.params.id) {
                    _this.$http.get(this.Global.baseURL + this.Global.api.v2.fieldShow_get, { params: {
                        moduleCode: 'WO001',
                        type: 'viewSet'
                    } }).then((res) => {
                        if (res.body.code.toString() == _this.Global.RES_OK) {
                            resolve(res.body.data)
                        } else {
                            _this.loading = false
                            _this.$message.error(_this.msg(res.body))
                        }
                    }, (res) => {
                        _this.loading = false
                        _this.$message.error(_this.$t(_this.Global.errorTitle))
                    })
                } else {
                    _this.toList()
                }
            })

            let p4 = new Promise((resolve, reject) => {
                if (this.$route.params.id) {
                    _this.$http.get(this.Global.baseURL + this.Global.api.v2.fieldShow_get, { params: {
                        moduleCode: 'WO001',
                        type: 'summarySet'
                    } }).then((res) => {
                        if (res.body.code.toString() == _this.Global.RES_OK) {
                            resolve(res.body.data)
                        } else {
                            _this.loading = false
                            _this.$message.error(_this.msg(res.body))
                        }
                    }, (res) => {
                        _this.loading = false
                        _this.$message.error(_this.$t(_this.Global.errorTitle))
                    })
                } else {
                    _this.toList()
                }
            })
            let p5 = new Promise((resolve, reject) => {
                if (this.$route.params.id) {
                    _this.$http.get(this.Global.baseURL + this.Global.api.v2.fieldShow_get, { params: {
                        moduleCode: 'WO001',
                        type: 'addEditSet',
                        strucId: '2'
                    } }).then((res) => {
                        if (res.body.code.toString() == _this.Global.RES_OK) {
                            resolve(res.body.data)
                        } else {
                            _this.loading = false
                            _this.$message.error(_this.msg(res.body))
                        }
                    }, (res) => {
                        _this.loading = false
                        _this.$message.error(_this.$t(_this.Global.errorTitle))
                    })
                } else {
                    _this.toList()
                }
            })
            Promise.all([p1, p2, p3, p4, p5]).then(function(results) {
                if (results[0].length == 0) {
                    _this.loading = false
                    return false
                }
                if (isArray(results[0].orderMemberInfo)) {
                    _this.personnelTable = results[0].orderMemberInfo
                }
                _this.feedbackDetail = results[0]
                _this.orderRecd = results[1]
                _this.viewSet = results[2]
                _this.summarySet = results[3]
                _this.addEditSet = results[4]
                // console.log(results[0])
                // console.log(results[1])
                // console.log(results[2])
                // console.log(results[3])
                // console.log(results[4])
                _this.loading = false
            })
        },
        getOrderRecd() {
            let _this = this
            if (this.$route.params.id) {
                let data = {
                        identFieldValue: this.$route.params.id,
                        moduleCode: 'WO001',
                        searchType: 'childList',
                        strucId: '2'
                    }
                _this.$http.get(this.Global.baseURL + this.Global.api.v2.document_generalOperate_get, {
                    params: data
                }).then((res) => {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        console.log(res.body.data)
                        if (isArray(res.body.data.list)) {
                            _this.orderRecd = res.body.data.list
                        } else {
                            _this.orderRecd = []
                        }
                    } else {
                        _this.$message.error(_this.msg(res.body))
                    }
                }, (res) => {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            } else {
                this.toList()
            }
        },
        toList() {
            this.$router.push('/main/client/tabs/list/WO001/index')
        },
        getPeopleList() {
            let _this = this
            let contactData = {
                dataType: 'contact',
                funType: 'all'
            }
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.accountDropList_get, { params: contactData }).then((res) => {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.personnelTable1 = res.body.data
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, (res) => {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        returnImg(itemCode) {
            let userName = ''
            this.personnelTable.forEach(element => {
                if (element.ctId == itemCode) {
                    userName = element.avatar
                }
            })
            return userName
        },
        returnCtIdName(itemCode) {
            let userName = ''
            this.personnelTable.forEach(element => {
                if (element.ctId == itemCode) {
                    userName = element.userName
                }
            })
            return userName
        }
    },
    components: {
    },
    watch: {
        '$route': function(val, old) {
            if (val.name == this.pageName) {
                this.files = []
                this.addRemindForm = {
                    content: '',
                    workId: '',
                    recdType: '1',
                    sourceId: 'pc'
                }
                this.feedbackDetail = {
                    workId: '',
                    workcode: '',
                    caption: '',
                    content: '',
                    category: '',
                    createDate: '',
                    priority: '',
                    workState: '',
                    mail: '',
                    product: '',
                    ownerctid: '',
                    acceptctid: ''
                }
                this.orderRecd = []
                this.workId = this.$route.params.id
                this.firstData = true
                this.getDetail()
                this.getPeopleList()
            }
        }
    },
    components: {
        'page-title': PageTitle,
        'file-upload': FileUpload
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
