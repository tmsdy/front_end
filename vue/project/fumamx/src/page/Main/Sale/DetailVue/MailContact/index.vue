<template>
    <div class="MailContact">

        <!-- 邮件列表 -->
        <div class="mailList MXscroll" ref="mailList">

            <loading v-if="isLoading" style="margin-top: 55px;"></loading>
            <!-- 没有查到邮件 -->
            <no-data v-if="!isLoading && listCenterData.length === 0" :title="$t('mxpcweb.client.detail.1529997722762')" img="noMail"></no-data>

            <template v-if="!isLoading && listCenterData.length>0">
                <dl v-for="(item,index) in listCenterData" :key="index">
                    <dt>{{item.dates}}</dt>
                    <dd v-for="(item2,index2) in item.list" :key="index2" @click="$refs.sliderMailDetail.show(item2.mId)">
                        <aside>
                            <single-operation :DetailData="item2" :ListDetail="item" @OperationTrigger="OperationTrigger"></single-operation>
                        </aside>
                        <div class="leftBtns">
                            <div class="checkIt">
                                <i v-if="item2.stickyFlag==1&&checkedListAll.length==0" class="tagStar el-icon-star-on"></i>
                            </div>
                            <div :style="setCommentsColor(item2.comments.length>0?item2.comments[item2.comments.length-1].commentFlag:1)" @click.stop="ShowComment(item2.mId)" :title="item2.comments.length>0?item2.comments[item2.comments.length-1].content:''">
                                <i class="iconfont icon-dot"></i>
                            </div>
                        </div>

                        <div class="mailName">
                            <!--收件箱：显示发件人-->
                            <span v-if="item2.source=='FMR'||item2.source=='FMI'">
                                <span class="shortName">{{item2.fromEx[0].personal==undefined?substringName(item2.fromEx[0].address):item2.fromEx[0].personal}}</span>
                                <span :class="item2.fromEx[0].custName==undefined?'name supply':'name customer'">{{item2.fromEx[0].custName}}
                                    <em>{{item2.fromEx[0].custName==undefined?'陌':'客'}}</em>
                                </span>
                            </span>
                            <!--发件箱/文件夹：显示收件人-->
                            <span v-else>
                                <span class="shortName"> {{item2.recipients[0].personal==undefined?substringName(item2.recipients[0].address):item2.recipients[0].personal}}</span>
                                <span class="name supply">{{item2.recipients[0].custName}}
                                    <em>{{item2.recipients[0].custName==undefined?'陌':'客'}}</em>
                                </span>
                            </span>

                            <el-tag v-for="(item3,index3) in item2.tagObjects" :key="index3" :style="setBgColor(item3.commentFlag)">{{item3.labelName}}</el-tag>

                            <span class="pull-right">
                                <i class="iconfont icon-attachment" v-if="item2.containAttachment"></i>
                                {{item2.sentDate==undefined?'':item2.sentDate.toString().split(' ')[2].toString()}}
                            </span>
                        </div>

                        <div class="mailTitle">
                            <!-- 已回复 -->
                            <i class="iconfont icon-reply" v-if="item2.replyFlag" :title="$t('mxpcweb.client.detail.1529996441745')"></i>
                            <!-- 已转发 -->
                            <i class="iconfont icon-forward" v-if="item2.repostSign" :title="$t('mxpcweb.client.detail.1529996839556')"></i>

                            <span v-html="item2.subject"> </span>
                            <!-- <div v-html="item2.subject" style="margin-left:13px;"></div> -->
                        </div>
                        <div class="mailBrief">
                            <span v-html="item2.plainContent==''?item2.plainContent:item2.plainContent"> </span>
                            <!-- {{item2.abstractText}} -->
                        </div>
                    </dd>
                </dl>
            </template>

            <br>
            <div class="pagination" :style="setPagination">
                <el-pagination v-if="total > pageSize" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5, 10, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
            </div>

        </div>

        <puablic-action v-if="isShow" ref="puablicAction" @LastListCenter="LastListCenter"></puablic-action>

        <!-- 邮件详情，抽屉 -->
        <slider-mail-detail v-if="isShow" ref="sliderMailDetail" :windowMode="windowMode"></slider-mail-detail>
    </div>
</template>
<script>
import { isObject, isArray, tagsBgColor, commentsColor } from '@/libs/utils.js'

import NoData from '@/basecomponents/NoData/index'
import Loading from '@/basecomponents/Loading/index'
import sliderMailDetail from './sliderMailDetail/index'
import SingleOperation from './Vue/SingleOperation/index'
import puablicAction from '@/page/Main/Mail/Home/vue/puablicAction'

export default {
    name: 'MailContact',
    props: {
        windowMode: {
            type: Boolean,
            default: false
        },
        moduleCode: {
            type: String,
            default: ''
        },
        itemId: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            isShow: false,
            checked: false,
            isLoading: false,
            listCenterData: [],
            dynamicTags: [], // 标签数组
            // 分页
            type: 'all',
            total: 0,
            pageSize: 5,
            currentPage: 1,
            from: 0,
            // ===============================
            position: 0,
            positionList: 0,
            Obj: {}
        }
    },
    created() {

    },
    mounted() {
        // this.getMaillist()
    },
    computed: {
        setPagination() {
            return this.windowMode ? 'left:auto;width:800px;' : ''
        }
    },
    methods: {
        getTabData() {
            this.isShow = true
            if (this.listCenterData.length === 0) {
                this.isLoading = true
            }
            this.$nextTick(_ => {
                this.getMaillist()
                this.maillabelsGet()
            })
        },
        // 名称截取
        substringName(adderss) {
            let str = adderss.split('@')
            return str[0]
        },
        // 批注色彩
        setCommentsColor(flag) {
            return commentsColor(flag)
        },
        // 背景色
        setBgColor(id) {
            return tagsBgColor(id)
        },
        // 数据处理（匹配）
        TagsOjectList(Listdata) {
            if (!isArray(Listdata)) {
                return []
            }
            let TagsAayy = []
            let tagObjects = []
            for (let i = 0; i < Listdata.length; i++) { // 标签
                if (isArray(Listdata[i].tags)) {
                    tagObjects = []
                    for (let r = 0; r < Listdata[i].tags.length; r++) {
                        for (let k = 0; k < this.dynamicTags.length; k++) {
                            if (Listdata[i].tags[r] == this.dynamicTags[k].labelId) {
                                tagObjects.push({ labelId: this.dynamicTags[k].labelId, labelName: this.dynamicTags[k].labelName, commentFlag: this.dynamicTags[k].color })
                                break
                            }
                        }
                    }
                }

                TagsAayy.push({
                    replyFlag: Listdata[i].replyFlag,
                    longSentDate: Listdata[i].longSentDate,
                    references: Listdata[i].references,
                    subject: Listdata[i].subject,
                    messageId: Listdata[i].messageId,
                    containAttachment: Listdata[i].containAttachment,
                    sentDate: Listdata[i].sentDate,
                    fromEx: Listdata[i].fromEx,
                    originSentDate: Listdata[i].originSentDate,
                    recipients: Listdata[i].recipients,
                    status: Listdata[i].status,
                    attachmentList: Listdata[i].attachmentList,
                    tmpFile: Listdata[i].tmpFile,
                    mId: Listdata[i].mId,
                    stickyFlag: Listdata[i].stickyFlag,
                    tags: Listdata[i].tags,
                    mId: Listdata[i].mId,
                    attachmentList: Listdata[i].attachmentList,
                    replyTo: Listdata[i].replyTo,
                    abstractText: Listdata[i].abstractText,
                    repostSign: Listdata[i].repostSign,
                    htmlContent: Listdata[i].htmlContent,
                    plainContent: Listdata[i].plainContent,
                    tagObjects: tagObjects,
                    repostSign: Listdata[i].repostSign == undefined ? false : Listdata[i].repostSign,
                    rawData: Listdata[i].rawData,
                    mailAddress: Listdata[i].mailAddress,
                    comments: Listdata[i].comments == undefined ? [] : Listdata[i].comments,
                    custName: Listdata[i].custName == undefined ? '' : Listdata[i].custName,
                    cc: Listdata[i].cc,
                    source: Listdata[i].source == undefined ? 'FMR' : Listdata[i].source
                })
            }
            return TagsAayy
        },
        // 数据分组
        dataGrouping(Data) {
            let dates = ''
            let str = ''
            let dates2 = ''
            let str2 = ''
            let list = []
            let count = 0
            let Arry = []
            this.checkedListAll = []
            this.listALL = []
            for (let i = 0; i < Data.length; i++) {
                if (Data[i].sentDate == '' || Data[i].sentDate == undefined) {
                    continue
                }
                str = Data[i].sentDate.split(' ')
                dates = str[0].toString()// 显示日期
                list.push(Data[i])
                count = i + 1
                if (count < Data.length) {
                    if (Data[count].sentDate == '' || Data[count].sentDate == undefined) {
                        Arry.push({ 'dates': dates, 'list': list })
                        list = []
                        continue
                    }
                    str2 = Data[count].sentDate.split(' ')
                    dates2 = str2[0].toString()// 显示日期
                    if (dates != dates2) {
                        Arry.push({ 'dates': dates, 'list': list })
                        list = []
                    }
                } else {
                    Arry.push({ 'dates': dates, 'list': list })
                    list = []
                }
            }
            return Arry
        },
        // 删除设置
        deleteMailSettings(data, actionName, Difference, type) {
            // let count = 0;
            let parameters = {}
            let url = ''
            // if (this.selectedBoxId.id == 4) {//回收站垃圾邮件删除
            //     parameters = { mIds: data.mIds };
            //     url = this.Global.baseURL + this.Global.api.Mail.mailDelete;
            // } else {
            //     parameters = data;
            //     url = this.Global.baseURL + this.Global.api.Mail.ManyMaillistPut;

            // }
            // if(this.subordinateCtid!=this.company.ctId&&this.subordinateCtid !=0&&this.subordinateCtid !=0){
            //     parameters.ctid=this.subordinateCtid;
            // }else{
            //      delete parameters.ctid;
            // }
            parameters = data
            url = this.Global.baseURL + this.Global.api.Mail.ManyMaillistPut
            this.$http.post(url, parameters).then(function (res) {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    //   if(this.selectedBoxId.id==0){ //待处理删除刷新文件夹
                    //         this.set_refurbishBool(1);
                    //     }
                    // this.RefreshOrFlip = "R";
                    // let idKey = this.listCenterData[this.checkedListCenterData].list[this.checkedList].mId;
                    // let idKey2 = this.operatingItem(idKey, data.mIds);
                    // this.Rsta = idKey2;
                    // this.filterGetMail('', '', '', '', '');//刷新
                    /* 删除成功 */
                    this.$message.success(this.$t('mxpcweb.client.detail.1529997938926'))
                    this.getTabData()// 刷新
                } else {
                    this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                this.$message.error(this.$t(this.Global.errorTitle))
            })
        },
        filterGetMail() {
            this.getTabData()
        },
        // 获取用户标签列表
        maillabelsGet() {
            this.$http.get(this.Global.baseURL + this.Global.api.v2.label_get, { params: { searchType: 'list', moduleCode: 'EM001' } }).then(function (res) {
                if (res.body.code.toString() == this.Global.RES_OK && isArray(res.body.data)) {
                    let datas = res.body.data
                    let arry = []
                    for (let i = 0; i < datas.length; i++) {
                        arry.push(datas[i])
                    }
                    this.dynamicTags = arry
                }
            }, function (res) {
                this.$message.error(this.$t(this.Global.errorTitle))
            })
        },
        GetObjById(idkey) {
            let blg = false
            for (let i = 0; i < this.listCenterData.length; i++) {
                for (let j = 0; j < this.listCenterData[i].list.length; j++) {
                    if (this.listCenterData[i].list[j].mId == idkey) {
                        this.position = i
                        this.positionList = j
                        this.Obj = this.listCenterData[i].list[j]
                        blg = true
                        break
                    }
                }
                if (blg) {
                    break
                }
            }
        },
        // 批准弹出
        ShowComment(mId) {
            if (mId > 0) {
                // 获取mail object
                this.GetObjById(mId)
                var mailObj = this.Obj
                if (mailObj != null) {
                    this.$refs.DialogMailComment.isDialog('open', '邮件', 'EM001', mId, mailObj.subject, mailObj)
                }
            }
        },
        handleSizeChange(val) {
            // console.log(`每页 ${val} 条`);
            this.pageSize = val
            this.getTabData()// 获取数据
        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.currentPage = val
            this.from = (this.currentPage - 1) * this.pageSize
            // console.log(this.from)
            this.getTabData()// 获取数据
        },
        // 获取指定文件夹的邮件列表
        getMaillist() {
            let data = {
                target: 'cust',
                custId: this.itemId,
                from: this.from,
                size: this.pageSize,
                type: this.type
            }
            this.$http.get(this.Global.baseURL + this.Global.api.Mail.getMaillist, { params: data }).then((res) => {
                this.isLoading = false
                if (res.body.code.toString() == this.Global.RES_OK) {
                    // console.log(res.body.data)
                    if (!isObject(res.body.data)) {
                        return
                    }
                    let ResultData = this.TagsOjectList(res.body.data.list)
                    this.total = res.body.data.totalNum
                    if (ResultData.length <= 0) {
                        this.listCenterData = []
                    } else {
                        this.listCenterData = this.dataGrouping(ResultData)
                    }
                } else {
                    this.$message.error(this.msg(res.body))
                }
            }, function (res) {
                this.$message.error(this.$t(this.Global.errorTitle))
            })
        },
        // 操作
        OperationTrigger(key, key2, key3, key4) {
            switch (key) {
                case 'DialogInDistribute':// 内分发
                    // key2=checkedListAll
                    this.$refs.puablicAction.DialogInDistribute(key2)
                    break
                case 'MaileMerge':// 归并
                    // key2=data
                    // key3=checkedListAll
                    this.$refs.puablicAction.MaileMerge(key2, key3)
                    break
                case 'openMovingFolders':// 移动
                    // key2=checkedListAll
                    // key3=个数
                    this.$emit('openMovingFolders', key2, key3)
                    break
                case 'DialogJunkMail':// 举报
                    // key2=type
                    // key3=data
                    // key4=paramsData
                    this.$refs.puablicAction.DialogJunkMail(key2, key3, key4)
                    break
                case 'MoveRecyclingStation':// 删除
                    // key2=checkedListAll
                    // key3=boxid
                    this.$refs.puablicAction.MoveRecyclingStation(key2, key3)
                    break
                case 'PhysicalDelete':// 彻底删除
                    // key2=checkedListAll
                    this.$refs.puablicAction.PhysicalDelete(key2)
                    break
                case 'handleCommand':// 更多操作
                    // key2=command
                    // key3=checkedListAll
                    this.handleCommand(key2, key3)
                    break
                case 'DialogSetTagShow': // 标签
                    // key2=DetailData
                    this.$refs.puablicAction.DialogSetTagShow(key2, 'EM001')
                    break

                default:
                    break
            }
        },
        handleCommand(command, checkedListAll) {
            this.$refs.puablicAction.Operation(command, checkedListAll)
        },
        LastListCenter(mIds, actionName) {
            // 置顶、删除、彻底删除、归并、
            // 内分发(定位不改变)、移动邮件刷新 （树刷新了） （列表数量） （定位改变）
            if (actionName == 'TopOperation' || actionName == 'UnTopOperation' || actionName == 'MoveRecyclingStation' || actionName == 'PhysicalDelete' || actionName == 'MaileMerge' || actionName == 'JunkMail') {
                // 区分是列表操作（勾选、非勾选）还是详情操作
                if (mIds.length == 1) { // 单条
                    this.filterGetMail('', '', '', '', '') // 刷新
                    // this.set_boxCount(1)
                    // let curId = this.listCenterData[this.checkedListCenterData].list[this.checkedList].mId
                    // if (mIds[0] == curId) { // 是当前选中的
                    //     let activeId = this.SeekActive(mIds[0], [mIds[0]])
                    //     if (activeId == -2) { // 当前也全部被操作需要换页
                    //         this.RefreshOrFlip = 'F'
                    //     } else {
                    //         this.Rsta = activeId // 寻找到可以选中的id
                    //     }
                    // } else { // 当前选中没有被操作
                    //     this.Rsta = curId
                    // }
                    // this.filterGetMail('', '', '', '', '') // 刷新
                } else if (mIds.length > 1) {
                    let curId = this.listCenterData[this.checkedListCenterData].list[this.checkedList].mId
                    // this.set_boxCount(1)
                    let activeId = this.getActiveMid(curId, 'many')
                    this.RefreshOrFlip = 'R'
                    if (activeId == -1) { // 当前选中没有被操作
                        this.Rsta = curId
                    } else if (activeId == -2) { // 当前也全部被操作需要换页
                        this.RefreshOrFlip = 'F'
                    } else {
                        this.Rsta = activeId // 寻找到可以选中的id
                    }
                    this.filterGetMail('', '', '', '', '') // 刷新
                }
            } else {
                if (actionName == 'ReadState' || actionName == 'UnReadState') {
                    // this.set_boxCount(1)
                }
                this.RefreshOrFlip = 'R'
                this.filterGetMail('', '', '', '', '') // 刷新
            }
        }
    },
    components: {
        'slider-mail-detail': sliderMailDetail,
        'single-operation': SingleOperation,
        'puablic-action': puablicAction,
        loading: Loading,
        'no-data': NoData
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
