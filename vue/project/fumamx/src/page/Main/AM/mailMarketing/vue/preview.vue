<template>
    <div class="addWork MXscroll">
        <!-- 邮件营销 -->
        <!-- 任务详情 -->
        <page-detail :title="$t('mxpcweb.am.1531897436358')" iconfont="icon-mail" :detailTitle="$t('mxpcweb.am.1531987879073')" @toList="$emit('tabDataCheck','1')"></page-detail>
        <div class="addWorkBox" v-loading="loading">
            <div class="listBox" v-if="!loading">
                <el-form :model="ruleForm" ref="ruleForm" onsubmit="return false" label-position="top">
                    <div class="list">
                        <div class="listItem">
                            <!-- 基本数据 -->
                            <span class="listTitle">{{$t('mxpcweb.am.1531897456157')}}</span>
                        </div>
                        <div class="listItem1">
                            <div>
                                <!-- 任务名称 -->
                                <span class="listTitle">{{$t('mxpcweb.am.1531897456597')}}</span>
                                <span class="listRight">
                                    <el-form-item class="formItem">
                                        {{ruleForm.workName}}
                                    </el-form-item>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="list">
                        <div class="listItem">
                            <!-- 发件人信息 -->
                            <span class="listTitle">{{$t('mxpcweb.am.1532074873490')}}</span>
                        </div>
                        <div class="listItem1">
                            <div>
                                <!-- 发件人 -->
                                <span class="listTitle">{{$t('mxpcweb.am.1531897635637')}}</span>
                                <span class="listRight">
                                    {{ruleForm.sendPeopleName}}&#60;{{ruleForm.sendPeople}}&#62;
                                </span>
                            </div>
                            <div>
                                <!-- 回复地址 -->
                                <span class="listTitle">{{$t('mxpcweb.am.1531897636341')}}</span>
                                <span class="listRight">
                                    {{ruleForm.replyPeople}}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="list">
                        <div class="listItem">
                            <!-- 接收人信息 -->
                            <span class="listTitle">{{$t('mxpcweb.am.1532074825173')}}</span>
                        </div>
                        <div class="listItem1">
                            <div>
                                <!-- 接收人 -->
                                <span class="listTitle">{{$t('mxpcweb.am.1531897676549')}}</span>
                                <span class="listRight">
                                    <template v-if="ruleForm.sendeePeopleName != ''">
                                        <span v-for="(item,index) in ruleForm.sendeePeopleName.split(';')" class="optionItem" :title="item" :key="index">
                                            {{item}}
                                        </span>
                                    </template>
                                    <!-- 预览 -->
                                    <span v-if="ruleForm.sendeePeople" class="text-hover lookItem" @click="dialogSelectOpen()">{{$t('mxpcweb.am.1531893065005')}}</span>
                                    <!-- 预览 -->
                                    <span v-else class="lookItem">{{$t('mxpcweb.am.1531893065005')}}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="list">
                        <div class="listItem">
                            <!-- 内容选项 -->
                            <span class="listTitle">{{$t('mxpcweb.am.1531897676765')}}</span>
                        </div>
                        <div class="listItem1">
                            <div>
                                <!-- 开发信模板 -->
                                <span class="listTitle">{{$t('mxpcweb.am.1531897676973')}}</span>
                                <span class="listRight">
                                    <el-form-item class="formItem">
                                        {{ruleForm.developmentLetterName}}
                                        <span v-if="ruleForm.developmentLetter!=''" class="text-hover" style="margin-left:15px;font-size:12px;color:RGBA(208, 2, 27, 1)" @click="$refs.preview.isShowTemplate(ruleForm.developmentLetter)">{{$t('mxpcweb.am.1531893065005')}}</span>
                                        <span v-else style="margin-left:15px;font-size:12px;color:RGBA(208, 2, 27, 1)">{{$t('mxpcweb.am.1531893065005')}}</span>
                                    </el-form-item>
                                </span>
                            </div>
                            <div v-show="ruleForm.files.length>0">
                                <!-- 附件 -->
                                <span class="listTitle">{{$t('mxpcweb.am.1531897705558')}}</span>
                                <span class="listRight">
                                    <el-form-item class="formItem">
                                        <file-upload ref="fileUpload" :file-list="ruleForm.files" :limitSize="5" :multiple="false" :disable="true">
                                            <!-- 选择文件 -->
                                            <el-button id="addMailWork_excels1" slot="trigger" size="small" type="primary" v-show="false">{{$t('mxpcweb.am.1531897718879')}}</el-button>
                                        </file-upload>
                                    </el-form-item>
                                </span>
                            </div>
                        </div>
                        <div class="listRight" v-if="cost>0&&peopleCount>0" style="color: #6B6B6B;font-size: 12px;margin-left: 95px;">邮件0.02元/封，超过200KB，每200KB算一封；当前任务总大小{{costSize}}，预计消费{{(cost*peopleCount).toFixed(2)}}元（实际消费以使用情况为准）</div>
                    </div>

                    <div class="list" style="border:0;">
                        <div class="listItem">
                            <!-- 发送时间详情 -->
                            <span class="listTitle">{{$t('mxpcweb.am.1531897725350')}}</span>
                        </div>
                        <div class="listItem1">
                            <div>
                                <!-- 发送时间选项 -->
                                <span class="listTitle">{{$t('mxpcweb.am.1531897725878')}}</span>
                                <span class="listRight">
                                    <el-form-item class="formItem">
                                        <span v-if="taskType == 'N'">{{$t('mxpcweb.am.1531897739630')}}</span>
                                        <span v-if="taskType == 'D'">{{$t('mxpcweb.am.1531897739853')}}</span>
                                        <span v-if="taskType == 'C'">{{$t('mxpcweb.am.1531897740597')}}</span>
                                        <span class="formItemTit" v-if="taskType=='N'">
                                            <!-- （任务将会在创建成功后5分钟内执行） -->
                                            {{$t('mxpcweb.am.1531897740822')}}
                                        </span>
                                    </el-form-item>
                                </span>
                            </div>
                            <div v-if="taskType=='D'">
                                <!-- 传送时间 -->
                                <span class="listTitle">{{$t('mxpcweb.am.1531897758405')}}</span>
                                <span class="listRight">
                                    {{sendTime1}}
                                </span>
                            </div>
                            <div v-if="taskType=='C'">
                                <span class="listTitle"></span>
                                <span class="listRight">
                                    {{ruleForm.cycleTitle}}
                                    <div v-if="ruleForm.cycleEndTime!=''" style="height:30px;line-height:30px">
                                        <!-- (周期结束时间) -->
                                        {{ruleForm.cycleEndTime}}{{$t('mxpcweb.am.1531897775157')}}
                                    </div>
                                </span>
                            </div>
                        </div>
                    </div>
                </el-form>
                <!-- 预览 -->
                <editor-preview ref="preview"></editor-preview>
                <dialog-select ref="dialogSelect"></dialog-select>
            </div>
        </div>
    </div>

</template>

<script>
import PageDetail from '@/components/PageDetail/index' // 大标题
import FileUpload from '@/components/FileUpload/index' // 文件上传
import editorPreview from '@/components/editorPreview/index' // 预览
import dialogSelect from './dialogSelect.vue'
import mixin from '../../mixin.js'
export default {
    name: 'addWork',
    mixins: [mixin],
    props: {
        itemData: {
            type: Object,
            default: function () {
                return {

                }
            }
        }
    },
    data() {
        return {
            ruleForm: {
                workName: '',
                sendPeople: '',
                replyPeople: '',
                sendeePeople: '',
                sendeePeopleName: '',
                sendPeopleName: '',
                sendData: '1',
                developmentLetter: '',
                developmentLetterName: '',
                transmissionTime: '',
                sendTimeBase: '',
                sendTime: '',
                sendTimes: '',
                files: [],
                cycleTitle: '',
                cycleEndTime: '',
                cycleType: 'everyday'
            },
            // 星期日
            // 星期一
            // 星期二
            // 星期三
            // 星期四
            // 星期五
            // 星期六
            weekData: ['', this.$t('mxpcweb.am.1531899922192'), this.$t('mxpcweb.am.1531899914414'), this.$t('mxpcweb.am.1531899919352'), this.$t('mxpcweb.am.1531899919696'), this.$t('mxpcweb.am.1531899920064'), this.$t('mxpcweb.am.1531899920888'), this.$t('mxpcweb.am.1531899921696')],
            taskType: 'N',
            sendTime: '',
            sendTime1: '',
            pageSize: 50,
            loading: true,
            downloadBaseUrl: this.Global.downloadBaseUrl,
            sendeeList: [],
            contenSize: 0,
            attchSize: 0,
            cost: 0,
            costSize: '',
            peopleCount: 0,
            Letter: ''
        }
    },
    mounted() {

    },
    created() {
        let _this = this
        let itemDatas = this.itemData
        var p1 = new Promise((resolve, reject) => {
            _this.$http.get(this.Global.baseURL + this.Global.api.v2.task_Get, { params: {
                    taskId: itemDatas.taskId
                } }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    resolve(res.body.data)
                } else if (res.body.code.toString() != '-3') {
                    _this.loading = false
                    _this.$message.error(_this.msg(res.body))
                } else {
                    _this.loading = false
                }
            }, function (res) {
                _this.loading = false
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        })
        Promise.all([p1]).then(function (results) {
            let itemData = results[0]
            _this.ruleForm = {
                workName: itemDatas.taskName,
                sendPeople: itemData.sendAddress,
                replyPeople: itemData.replyAddress,
                sendeePeople: itemData.addrInvokeName,
                // sendeePeopleName: itemData.addrInvokeName,
                sendPeopleName: itemData.sendName,
                sendData: '1',
                developmentLetter: itemData.tmplInvokeName,
                developmentLetterName: itemData.templateName,
                transmissionTime: '',
                files: [],
                cycleEndTime: itemData.endDate && itemData.endDate != '' ? _this.dateFormat(itemData.endDate, 'yyyy-MM-dd hh:mm') : '',
                cycleType: itemData.taskType
            }
            _this.Letter = itemData.tmplInvokeName
            let sendeePeopleNameArry = ''
            let pCount = 0
            for (let index = 0; index < itemData.addressInfo.length; index++) {
                const element = itemData.addressInfo[index]
                sendeePeopleNameArry += element.name + ';'
                pCount = pCount + Number(element.memberCount)
            }
            _this.peopleCount = pCount
            _this.ruleForm.sendeePeopleName = sendeePeopleNameArry.substr(0, sendeePeopleNameArry.length - 1)
            let arr = []
            let tsize = 0
            if (itemData.attachments != null) {
                let attachmentList = JSON.parse(itemData.attachments)
                attachmentList.forEach(function (item) {
                    if (item.url) {
                        let obj = {
                            name: item.fileName,
                            url: item.url.replace(_this.downloadBaseUrl, ''),
                            size: item.size / 1024
                        }
                        tsize = tsize + Number(item.size)
                        arr.push(obj)
                    }
                })
            }
            _this.ruleForm.files = arr
            _this.showSize(tsize)
            if (itemData.sendTimeType == 'D') {
                _this.taskType = 'D'
                _this.ruleForm.sendTime = itemData.deliverDate
                _this.sendTime1 = _this.dateFormat(itemData.deliverDate, 'yyyy-MM-dd hh:mm')
            } else if (itemData.sendTimeType == null || itemData.sendTimeType == 'N') {
                _this.taskType = 'N'
            } else {
                _this.taskType = 'C'
                // let name = ''
                let CCtime = _this.returnCTime(itemData.deliverDate)
                _this.ruleForm.sendTimes = CCtime
                _this.ruleForm.sendTimeBase = CCtime
                _this.ruleForm.cycleTitle = CCtime
            }
            _this.loading = false
        })
    },
    methods: {
        dialogSelectOpen() {
            let list = this.ruleForm.sendeePeople.split(';')
            let listName = this.ruleForm.sendeePeopleName.split(';')
            let arr = []
            list.forEach(function (item, index) {
                arr.push({
                    invokeName: item,
                    name: listName[index]
                })
            })
            this.$refs.dialogSelect.show(arr)
        },
        returnCTime(Time) {
            let _this = this
            let name = ''
            let CCtime = ''
            let thisTime = Time.split(' ')
            if (thisTime[3] == '?' && thisTime[5] !== '*') {
                // 每周
                // let weekTime = _this.$moment(_this.$utcToLocal('2018-06-10 ' + (thisTime[2].length == 2 ? thisTime[2] : '0' + thisTime[2]) + ':' + (thisTime[1].length == 2 ? thisTime[1] : '0' + thisTime[1]) + ':00'))
                // let weekDate = (parseInt(thisTime[5]) + parseInt(weekTime.format('DD')) - 10) % 7
                // if (weekDate == 0) {
                //     weekDate = 7
                // }
                // name = _this.$t('mxpcweb.am.1531900125000') + _this.weekData[weekDate]
                // CCtime = weekTime.format('HH:mm')
                let dataName = new Date('2018/06/10 ' + (thisTime[2].length == 2 ? thisTime[2] : '0' + thisTime[2]) + ':' + (thisTime[1].length == 2 ? thisTime[1] : '0' + thisTime[1]) + ':00')
                let weekDate = parseInt(thisTime[5]) // (parseInt(thisTime[5]) + parseInt(weekTime.format('DD')) - 10) % 7
                if (weekDate == 0) {
                    weekDate = 7
                }
                name = _this.$t('mxpcweb.am.1531900125000') + _this.weekData[weekDate]
                CCtime = '  ' + dataName.getHours() + ':' + dataName.getMinutes()
            } else if (thisTime[3] !== '*' && thisTime[3] !== '?') {
                // 每月
                // name = _this.$t('mxpcweb.am.1531900145370')
                // CCtime = _this.$moment(_this.$utcToLocal('2018-07-' + (thisTime[3].length == 2 ? thisTime[3] : '0' + thisTime[3]) + ' ' + (thisTime[2].length == 2 ? thisTime[2] : '0' + thisTime[2]) + ':' + (thisTime[1].length == 2 ? thisTime[1] : '0' + thisTime[1]) + ':00')).format('DD HH:mm')
                name = _this.$t('mxpcweb.am.1531900145370')
                let dataName = new Date('2018/07/' + (thisTime[3].length == 2 ? thisTime[3] : '0' + thisTime[3]) + ' ' + (thisTime[2].length == 2 ? thisTime[2] : '0' + thisTime[2]) + ':' + (thisTime[1].length == 2 ? thisTime[1] : '0' + thisTime[1]) + ':00')
                CCtime = dataName.getDate() + '  ' + ('00' + dataName.getHours()).slice(-2) + ':' + ('00' + dataName.getMinutes()).slice(-2)
            } else {
                // 每天
                // utcToLocal
                // name = _this.$t('mxpcweb.am.1531900110152')
                // CCtime = _this.$moment(_this.$utcToLocal('2018-06-10 ' + (thisTime[2].length == 2 ? thisTime[2] : '0' + thisTime[2]) + ':' + (thisTime[1].length == 2 ? thisTime[1] : '0' + thisTime[1]) + ':00')).format('HH:mm')
                name = _this.$t('mxpcweb.am.1531900110152')
                let dataName = new Date('2018/06/10 ' + (thisTime[2].length == 2 ? thisTime[2] : '0' + thisTime[2]) + ':' + (thisTime[1].length == 2 ? thisTime[1] : '0' + thisTime[1]) + ':00')
                CCtime = ('00' + dataName.getHours()).slice(-2) + ':' + ('00' + dataName.getMinutes()).slice(-2)
            }
            return name + CCtime
        },
        showSize(size) {
            if (size > 1024) {
                this.costSize = (size / 1024).toFixed(2) + ' M'
            } else {
                this.costSize = size.toFixed(2) + ' KB'
            }
        },
        getsize(invokeName) {
            let _this = this
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.template_list, { params: { invokeName: invokeName } })
                .then(function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        if (res.body.data.html != undefined) {
                            let htmlB = res.body.data.html.replace(/[^u4E00-u9FA5]/g, 'aa').length
                            this.contenSize = Number(htmlB) / 1024
                            let tSize = Number(this.attchSize) + Number(this.contenSize)
                            this.showSize(tSize)
                            this.cost = Math.ceil(tSize / 200) * 0.02
                        } else {
                            this.contenSize = 0
                        }
                    }
                }, function (res) {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
        }
    },
    components: {
        'page-detail': PageDetail,
        'file-upload': FileUpload,
        'editor-preview': editorPreview,
        'dialog-select': dialogSelect
    },
    watch: {
        Letter: {
            handler(curVal, oldvalue) {
                this.getsize(curVal)
            }

        }
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
.addWork {
    overflow: auto;
    background: white;
    height: 100%;
    .addWorkBox {
        height: 100%;
    }
    .listBox {
        padding: 0 35px 49px 33px;
        .list {
            border-bottom: 1px solid RGBA(238, 238, 238, 1);
            position: relative;
            padding-top: 3px;
            padding-bottom: 17px;
            margin-bottom: 3px;
            .listItem {
                min-height: 50px;
                line-height: 50px;
                .listTitle {
                    font-size: 16px;
                    color: RGBA(48, 49, 51, 1);
                    display: inline-block;
                    width: 99px;
                }
                .listRight {
                    font-size: 12px;
                    color: #222;
                    position: relative;
                    top: 1px;
                    left: -4px;
                }
            }
            .listItem1 {
                padding-left: 4px;
                min-height: 32px;
                line-height: 32px;
                .listTitle {
                    font-size: 14px;
                    color: rgba(144, 147, 153, 1);
                    display: inline-block;
                    width: 95px;
                    height: 30px;
                    line-height: 30px;
                }
                .listRight {
                    display: inline-block;
                    font-size: 12px;
                    color: #222;
                    position: relative;
                    top: 1px;
                    left: -3px;
                    min-height: 30px;
                    width: 400px;
                    .optionItem {
                        display: inline-block;
                        text-align: center;
                        font-size: 12px;
                        height: 30px;
                        line-height: 30px;
                        padding: 0 5px;
                        margin-top: 5px;
                        margin-right: 5px;
                        border-radius: 3px;
                        color: #5bc7f3;
                        background: #d4f3fc;
                    }
                    .lookItem {
                        margin-left: 15px;
                        font-size: 12px;
                        color: RGBA(208, 2, 27, 1);
                        height: 30px;
                        line-height: 30px;
                        display: inline-block;
                    }
                    .formItemTit {
                        font-size: 12px;
                        color: rgba(144, 147, 153, 1);
                        position: absolute;
                        top: 32px;
                        left: -6px;
                    }
                    .cycleSeting {
                        padding: 1px 5px;
                        border-radius: 3px;
                        color: #fff;
                        background: #f0ad4e;
                        border: 1px solid #eea236;
                    }
                }
            }
        }
    }
}
</style>
