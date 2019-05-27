<template>
    <!-- 批量操作 -->
    <div class="BatchOperation" v-if="checkedListAll.length>0&&SearchSelect!='c'">
        <div class="pull-right" @click="$emit('listCheck','close','')">
            <i class="iconfont icon-close"></i>
        </div>
        <el-checkbox v-model="checkedAll" @change="handleCheckAllChange"></el-checkbox>
        <ul>
            <!-- 归并 -->
            <li v-if="selectedBoxId.target!='undistributed'" :title="$t('mxpcweb.mail.1528702678326')" @click="MaileMerge()">
                <i class="iconfont icon-filed"></i>
            </li>
            <!-- 内分发 -->
            <li :title="$t('mxpcweb.mail.1528702683332')" @click="$emit('OperationTrigger','DialogInDistribute',checkedListAll)">
                <i class="iconfont icon-inside"></i>
            </li>
            <!-- 移动 -->
            <li v-if="selectedBoxId.target!='undistributed'" :title="$t('mxpcweb.mail.1528702683623')" @click="$emit('OperationTrigger','openMovingFolders',checkedListAll,checkedListAll.length)">
                <i class="iconfont icon-file-move"></i>
            </li>
            <!-- 举报 -->
            <li :title="$t('mxpcweb.mail.1528702727257')" @click="DialogJunkMail()">
                <i class="iconfont icon-sign"></i>
            </li>
            <!-- 删除 -->
            <li :title="$t('mxpcweb.mail.1528702683911')" class="downBtn" @click="$emit('OperationTrigger', 'MoveRecyclingStation', checkedListAll, 4)">
                <i class="iconfont icon-del"></i>
                <span @click.stop="">
                    <el-dropdown trigger="click" @command="handleCommandDelate">
                        <span class="el-dropdown-link">
                            <i class="iconfont icon-arrow-down"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown" style="margin-top:20px;">
                            <!-- 删除 -->
                            <el-dropdown-item v-if="selectedBoxId.id!=4" :command="{actionName:'delete'}">{{$t('mxpcweb.mail.1528702683911')}}</el-dropdown-item>
                            <!-- 移入垃圾邮件箱 -->
                            <el-dropdown-item v-if="selectedBoxId.id!=5" :command="{actionName:'rubbish'}">{{$t('mxpcweb.mail.1530069582766')}}</el-dropdown-item>
                            <!-- 彻底删除 -->
                            <el-dropdown-item :command="{actionName:'PhysicalDelete'}">{{$t('mxpcweb.mail.1528702684265')}}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </span>
            </li>
            <!-- 更多 -->
            <li :title="$t('mxpcweb.mail.1528708499750')">
                <el-dropdown trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        <i class="iconfont icon-more"></i>
                    </span>

                    <el-dropdown-menu slot="dropdown" style="margin-top:6px;">
                        <!-- 标记为未读 -->
                        <el-dropdown-item :command='{actionName:"UnReadState"}'>{{$t('mxpcweb.mail.1528702486579')}}</el-dropdown-item>
                        <!-- 标记为已读 -->
                        <el-dropdown-item :command='{actionName:"ReadState"}'>{{$t('mxpcweb.mail.1528702491693')}}</el-dropdown-item>
                        <!-- // 标记未回复 -->
                        <el-dropdown-item :command='{actionName:"UnRecoverystate"}'>{{$t('mxpcweb.mail.1528702492152')}}</el-dropdown-item>
                        <!-- 标记已回复 -->
                        <el-dropdown-item :command='{actionName:"Recoverystate"}'>{{$t('mxpcweb.mail.1528702492646')}}</el-dropdown-item>
                        <el-dropdown-item :command='{actionName:"UnForwardingState"}'>{{$t('mxpcweb.mail.1528702493166')}}</el-dropdown-item>
                        <el-dropdown-item :command='{actionName:"ForwardingState"}'>{{$t('mxpcweb.mail.1528702539318')}}</el-dropdown-item>
                        <el-dropdown-item :command='{actionName:"Comment"}'>{{$t('mxpcweb.mail.1528702539712')}}</el-dropdown-item>
                        <el-dropdown-item :command='{actionName:"UnTopOperation"}'>{{$t('mxpcweb.mail.1528702539959')}}</el-dropdown-item>
                        <el-dropdown-item :command='{actionName:"TopOperation"}'>{{$t('mxpcweb.mail.1528702540217')}}</el-dropdown-item>
                        <el-dropdown-item :command='{actionName:"ExportEMLbatch"}'>{{$t('mxpcweb.mail.1528702573274')}}</el-dropdown-item>
                    </el-dropdown-menu>

                </el-dropdown>
            </li>
        </ul>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { isArray } from '@/libs/utils.js'
export default {
    name: 'BatchOperation',
    props: {
        checkedListAll: {
            type: Array,
            default: function () {
                return []
            }
        },
        SearchSelect: {
            type: String,
            default: function () {
                return ''
            }
        },
        listCenterData: {
            type: Array,
            default: function () {
                return []
            }
        }

    },
    data() {
        return {
            checkedAll: false // 全选
        }
    },
    computed: {
        ...mapGetters('mail', [
            'selectedBoxId',
            'refurbishListBool',
            'refurbishlabelList',
            'subordinateCtid'
        ])

    },
    created() {

    },
    methods: {
        checkedAllChange(blg) {
            this.checkedAll = blg
        },
        handleCheckAllChange(event) {
            this.$emit('listCheck', 'CheckAll', event.target.checked)
        },
        // 归并
        MaileMerge() {
            let mIdstr = ''
            let data = {}

            for (let i = 0; i < this.checkedListAll.length; i++) {
                mIdstr = mIdstr + this.checkedListAll[i] + ','
            }
            data = {
                mId: mIdstr.substring(0, mIdstr.length - 1)
            }
            this.$emit('OperationTrigger', 'MaileMerge', data, this.checkedListAll)
        }, // 邮件移动文件夹
        FoladMoving(mIds, Dif, status) {
            let count = 0
            if (Dif == 1) { // 多个
                mIds = this.checkedListAll
                count = this.GetStateAcount(-1) // 获取未读数
            } else {
                if (status == -1) { // 未读
                    count = 1 // 获取未读数
                }
                this.clickOperation = true
            }
            $emit('OperationTrigger', 'openMovingFolders', mIds, count)
        }, // 垃圾邮件
        DialogJunkMail() {
            let data = []
            let paramsData = []
            let blg = false
            let str = ''
            for (let k = 0; k < this.checkedListAll.length; k++) {
                blg = false
                for (let i = 0; i < this.listCenterData.length; i++) {
                    for (let j = 0; j < this.listCenterData[i].list.length; j++) {
                        if (this.listCenterData[i].list[j].mId == this.checkedListAll[k]) {
                            this.AtypismAddress = ''
                            str = ''
                            this.adderssComparison(this.listCenterData[i].list[j].replyTo, this.listCenterData[i].list[j].fromEx)
                            for (let p = 0; p < this.listCenterData[i].list[j].fromEx.length; p++) { // 发件地址
                                str = str + this.listCenterData[i].list[j].fromEx[p].address + ','
                            }
                            if (this.AtypismAddress != '') { // 回复地址不一致
                                str = str + this.AtypismAddress + ','
                            }
                            data.push({
                                'ownerMailAddress': this.listCenterData[i].list[j].mailAddress,
                                'junkMailAddress': str.substring(0, str.length - 1),
                                'mid': this.listCenterData[i].list[j].mId
                            })
                            paramsData.push({
                                'mid': this.listCenterData[i].list[j].mId,
                                'rawData': this.listCenterData[i].list[j].rawData,
                                'size': this.listCenterData[i].list[j].size,
                                'subject': this.listCenterData[i].list[j].subject
                            })
                            blg = true
                            break
                        }
                    }
                    if (blg) {
                        break
                    }
                }
            }
            this.$emit('OperationTrigger', 'DialogJunkMail', 'bulk', data, paramsData)
        },
        // 回复地址不一致   AtypismAddress
        adderssComparison(replyTo, fromEx) {
            if (!isArray(replyTo) || !isArray(fromEx)) {
                return
            }
            let count = 0
            for (let j = 0; j < replyTo.length; j++) {
                count = 0
                for (let i = 0; i < fromEx.length; i++) {
                    if (replyTo[j].address == fromEx[i].address) {
                        break
                    } else {
                        count++
                    }
                }
                if (count == fromEx.length) {
                    this.AtypismAddress = this.AtypismAddress + replyTo[j].address + ','
                }
            }
        }, // 删除下拉框
        handleCommandDelate(command) {
            if (command.actionName == 'delete') {
                this.$emit('OperationTrigger', 'MoveRecyclingStation', this.checkedListAll, 4)
            } else if (command.actionName == 'rubbish') {
                this.$emit('OperationTrigger', 'MoveRecyclingStation', this.checkedListAll, 5)
            } else if (command.actionName == 'PhysicalDelete') {
                this.$emit('OperationTrigger', 'PhysicalDelete', this.checkedListAll)
            }
        },
        // 下拉框事件触发 批量
        handleCommand(command) {
            this.$emit('OperationTrigger', 'handleCommand', command, this.checkedListAll)
        }
    }

}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
