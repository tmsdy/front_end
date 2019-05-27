<template>
    <div class="SingleOperation">
        <!-- 归并 -->
        <span v-if="selectedBoxId.target!='undistributed'" :title="$t('mxpcweb.mail.1528702678326')" @click.stop="$emit('OperationTrigger', 'MaileMerge',{mId:DetailData.mId},[DetailData.mId])">
            <i class="iconfont icon-filed"></i>
        </span>
        <!-- 内分发 -->
        <!-- <span :title="$t('mxpcweb.mail.1528702683332')" @click.stop="$emit('OperationTrigger','DialogInDistribute',[DetailData.mId])">
            <i class="iconfont icon-inside"></i>
        </span> -->
        <!-- 移动 -->
        <!-- <span v-if="selectedBoxId.target!='undistributed'" :title="$t('mxpcweb.mail.1528702683623')" @click.stop="$emit('OperationTrigger','openMovingFolders',[DetailData.mId],1)">
            <i class="iconfont icon-file-move"></i>
        </span> -->
        <!-- 删除 -->
        <span :title="$t('mxpcweb.mail.1528702683911')" @click.stop="$emit('OperationTrigger', 'MoveRecyclingStation', [DetailData.mId], 4)">
            <span>
            </span>
            <i class="el-icon-delete2"></i>
        </span>
        <!-- 取消星标置顶':'星标置顶 -->
        <span v-if="DetailData.stickyFlag==1" :title="$t('mxpcweb.mail.1528702539959')" @click.stop="
        $emit('OperationTrigger', 'handleCommand', {actionName:'UnTopOperation',mId:DetailData.mId},[DetailData.mId])">
            <i class="iconfont icon-star"></i>
        </span>
        <span v-if="DetailData.stickyFlag==0" :title="$t('mxpcweb.mail.1528702540217')" @click.stop="
         $emit('OperationTrigger', 'handleCommand', {actionName:'TopOperation',mId:DetailData.mId},[DetailData.mId])">
            <i class="iconfont icon-star"></i>
        </span>
        <span :title="$t('mxpcweb.mail.1528702726743')" @click.stop="$emit('OperationTrigger','DialogSetTagShow',DetailData)">
            <!--标签设置-->
            <i class="iconfont icon-tag"></i>
        </span>
        <!-- 更多 -->
        <span :title="$t('mxpcweb.mail.1528708499750')" @click.stop="">
            <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                    <i class="iconfont icon-more" style="color:#fff;"></i>
                </span>
                <el-dropdown-menu slot="dropdown" style="margin-top:7px;">
                    <el-dropdown-item v-if="DetailData.status!=-1" :command='{actionName:"UnReadState",mId:DetailData.mId,status:DetailData.status}'>{{$t('mxpcweb.mail.1528702486579')}} </el-dropdown-item>
                    <el-dropdown-item v-if="DetailData.status==-1" :command='{actionName:"ReadState",mId:DetailData.mId,status:DetailData.status}'> {{$t('mxpcweb.mail.1528702491693')}}</el-dropdown-item>
                    <el-dropdown-item v-if="DetailData.replyFlag" :command='{actionName:"UnRecoverystate",mId:DetailData.mId}'>
                        {{$t('mxpcweb.mail.1528702492152')}}</el-dropdown-item>
                    <el-dropdown-item v-if="!DetailData.replyFlag" :command='{actionName:"Recoverystate",mId:DetailData.mId}'>
                        {{$t('mxpcweb.mail.1528702492646')}}</el-dropdown-item>
                    <el-dropdown-item v-if="DetailData.repostSign" :command='{actionName:"UnForwardingState",mId:DetailData.mId}'>
                        {{$t('mxpcweb.mail.1528702493166')}}</el-dropdown-item>
                    <el-dropdown-item v-if="!DetailData.repostSign" :command='{actionName:"ForwardingState",mId:DetailData.mId}'>
                        {{$t('mxpcweb.mail.1528702539318')}}</el-dropdown-item>
                    <el-dropdown-item :command='{actionName:"Comment",mId:DetailData.mId,subject:DetailData.subject}'>
                        {{$t('mxpcweb.mail.1528702539712')}}</el-dropdown-item>
                    <el-dropdown-item v-if="DetailData.stickyFlag ==1" :command='{actionName:"UnTopOperation",mId:DetailData.mId}'>
                        {{$t('mxpcweb.mail.1528702539959')}}</el-dropdown-item>
                    <el-dropdown-item v-if="DetailData.stickyFlag ==0" :command='{actionName:"TopOperation",mId:DetailData.mId}'>
                        {{$t('mxpcweb.mail.1528702540217')}}</el-dropdown-item>
                    <el-dropdown-item :command='{actionName:"AttachmentsSend",mId:DetailData.mId,subject:DetailData.subject,size:DetailData.size,rawData:DetailData.rawData}'>{{$t('mxpcweb.mail.1528702540482')}}</el-dropdown-item>
                    <el-dropdown-item v-if="DetailData.source!='FMDRAFT'&&ListDetail.folder!=3" :command='{actionName:"ExportEML",mId:DetailData.mId}'>{{$t('mxpcweb.mail.1528702573274')}}</el-dropdown-item>
                    <el-dropdown-item :command='{actionName:"updataSubject",subject:DetailData.subject,mId:DetailData.mId}'>
                        {{$t('mxpcweb.mail.1528702573934')}}</el-dropdown-item>
                    <el-dropdown-item v-if="DetailData.source=='FMD'" :command='{actionName:"EditAgain",mId:DetailData.mId,subject:DetailData.subject}'>{{$t('mxpcweb.mail.1528702592843')}}
                    </el-dropdown-item>
                    <!-- 内分发 -->
                    <el-dropdown-item :command='{actionName:"DialogInDistribute",mId:DetailData.mId,address:DetailData.fromEx[0].address}'>{{$t('mxpcweb.mail.1528702683332')}}
                    </el-dropdown-item>
                    <!-- 移动 -->
                    <el-dropdown-item :command='{actionName:"openMovingFolders",mId:DetailData.mId}'>{{$t('mxpcweb.mail.1528702683623')}}
                    </el-dropdown-item>

                    <!-- <el-dropdown-item v-if="DetailData.stickyFlag ==1" :command='{actionName:"UnTopOperation",mId:DetailData.mId}'>{{$t('mxpcweb.mail.1528702539959')}}</el-dropdown-item>
                    <el-dropdown-item v-if="DetailData.stickyFlag ==0" :command='{actionName:"TopOperation",mId:DetailData.mId}'>{{$t('mxpcweb.mail.1528702540217')}}</el-dropdown-item> -->

                </el-dropdown-menu>
            </el-dropdown>
        </span>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    name: '',
    props: {
        DetailData: {
            type: Object,
            default: function () {
                return {}
            }
        },
        ListDetail: {
            type: Object,
            default: function () {
                return {}
            }
        }
    },
    data() {
        return {
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
        handleCommand(command) {
            switch (command.actionName) {
                case 'DialogInDistribute':
                    this.$emit('OperationTrigger', 'DialogInDistribute', [command.mId], command.address)
                    break
                case 'openMovingFolders':
                    this.$emit('OperationTrigger', 'openMovingFolders', [command.mId], 1)
                    break
                default:
                    this.$emit('OperationTrigger', 'handleCommand', command, [this.DetailData.mId])
                    break
            }
        }
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
