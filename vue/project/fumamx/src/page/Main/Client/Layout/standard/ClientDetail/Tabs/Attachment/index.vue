<template>
    <div class="Attachment">
        <div class="ListSearchBox">
            <!-- <div class="pull-right">
                <pick-attachment @change="pickAttachmentChange" style="margin-top: 5px; margin-left:15px;" />
            </div> -->
            <div class="pull-right">
                <!-- 请输入附件名查找 -->
                <input v-model.trim="inputSearch" @keyup.enter="searchIconClick" :placeholder="$t('mxpcweb.client.detail.1529993520289')">
                <i class="iconfont icon-search" @click="searchIconClick"></i>
            </div>
            <span v-if="mailAddress === ''" style="margin-right:8px;">
            <el-button v-for="(item,index) in listTabArr" :key="index" :type="listTabVal == item.value ? 'danger' : ''" @click="listTabVal = item.value; categoryValue = 'list'">{{item.name}}</el-button>
            </span>
            <el-select v-model="categoryValue" @change="selectChange" placeholder="请选择" style="width:88px; position:relative; top:1px">
                <el-option v-for="item in category" :key="item.code" :label="item.name" :value="item.code"></el-option>
            </el-select>
        </div>

        <list-customer v-if="listTabVal == listTabArr[0].value" :ref="listTabArr[0].value" :moduleCode="moduleCode" :pageId="pageId" :windowMode="windowMode" @previewItem="previewItem" @showDetail="showDetail"></list-customer>
        <list-mail v-if="listTabVal == listTabArr[1].value" :ref="listTabArr[1].value" :moduleCode="moduleCode" :pageId="pageId" :windowMode="windowMode" :mailAddress="mailAddress"></list-mail>

        <!-- 上传附件 -->
        <fly-button v-if="mailAddress == ''" @flyBtnClick="openWindow" :fly="false" :title="$t('mxpcweb.client.detail.1529993973241')" :mainObj="mainObj"></fly-button>

        <doc-preview ref="filePreview"></doc-preview>
        <doc-detail ref="docDialog"></doc-detail>
    </div>
</template>
<script>
import FlyButton from '../../FlyButton/index.vue'

import DocPreview from '@/components/DocPreview/index'
import DocDetail from '@/components/DocDetail/index'
// import pickAttachment from './pickAttachment/index'
import ListCustomer from './ListCustomer/index'
import ListMail from './ListMail/index'
export default {
    name: 'Attachment',
    props: {
        windowMode: {
            type: Boolean,
            default: false
        },
        itemData: {
            type: Object,
            default: function () {
                return {}
            }
        },
        pageId: {
            type: String,
            default: ''
        },
        mainObj: {
            type: Object,
            default: function () {
                return {}
            }
        },
        moduleCode: {
            type: String,
            default: ''
        },
        mailAddress: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            listTabVal: '', // 活动项按钮
            listTabArr: [ // 按钮组
                {
                    name: '客户附件',
                    value: 'listTab1',
                    isShow: true
                },
                {
                    name: '邮件附件',
                    value: 'listTab2',
                    isShow: true
                }
            ],
            categoryValue: 'list',
            category: [
                {
                    name: this.$t('mxpcweb.client.detail.1529994111184'), // 全部
                    code: 'list'
                },
                {
                    name: this.$t('mxpcweb.client.detail.1529994170657'), // 图片
                    code: 'PICTURE'
                },
                {
                    name: this.$t('mxpcweb.client.detail.1529994243701'), // 视频
                    code: 'VIDEO'
                },
                {
                    name: 'DOC',
                    code: 'DOC'
                },
                {
                    name: 'XLS',
                    code: 'XLS'
                },
                {
                    name: 'PPT',
                    code: 'PPT'
                },
                {
                    name: 'PDF',
                    code: 'PDF'
                }
            ],
            inputSearch: ''
        }
    },
    created() {
        // this.getTabData()
        console.log(this.mailAddress)
        if (this.mailAddress != '') {
            this.listTabVal = 'listTab2'
            this.listTabArr[0].isShow = false
        }
    },
    mounted() {
    },
    methods: {
        getTabData() {
            // console.log(' jjj ')
            if (this.listTabVal == this.listTabArr[0].value) {
                this.$refs[this.listTabVal].getTabData()
            } else {
                this.listTabVal = this.listTabArr[0].value
            }
        },
        // pickAttachmentChange(command) {
        //     // console.log(command)
        //     if (command.actionName == 'AddLocal') { // 添加本地附件
        //         this.openWindow()
        //     } else { // 添加在线文档
        //         // this.$refs.DialogDoc.open()
        //     }
        // },
        selectChange(val) {
            // console.log(val)
            // this.type = val
            // this.from = 0
            // this.getTabData()// 获取数据

            this.$refs[this.listTabVal].type = val
            this.$refs[this.listTabVal].getTabData()
        },
        // 打开选文件
        openWindow() {
            let _this = this
            let data = {
                url: this.Global.api.v2.folders_files, // api（必传）
                fileSource: 3,
                billId: this.pageId,
                custId: this.pageId,
                remarks: '',
                moduleCode: this.moduleCode,
                fn(res) {
                    _this.resetList() // 重置状态
                    _this.getTabData() // 刷新
                }
            }
            ep.emit('selectFile', data)// 相当于触发标记
        },
        searchIconClick() {
            // console.log('search ---')
            this.resetList()// 重置状态
            if (this.inputSearch == '') {
                this.getTabData()
            } else {
                this.$refs[this.listTabVal].getTabData({
                    wildCardWords: this.inputSearch,
                    keywords: this.inputSearch,
                    type: 'SEARCH'
                })
                // this.getTabData()
            }
        },
        // 重置状态
        resetList() {
            // this.type = 'list'
            // this.currentPage = 1
            // this.from = 0
        },
        // 预览
        previewItem(dataList, index) {
            console.log(dataList)
            this.$refs.filePreview.open(dataList, index)
        },
        // 明细修订
        showDetail(item) {
            this.$refs.docDialog.open(item)
        }
    },
    components: {
        'fly-button': FlyButton,
        'doc-preview': DocPreview,
        // 'pick-attachment': pickAttachment,
        'list-customer': ListCustomer,
        'list-mail': ListMail,
        'doc-detail': DocDetail
    }
}
</script>

<style lang="less" rel="stylesheet/less">
@import "./zh-cn.less";
@import "./en.less";
</style>
