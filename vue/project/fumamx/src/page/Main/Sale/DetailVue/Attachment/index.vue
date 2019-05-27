<template>
    <div class="Attachment">
        <div class="ListSearchBox">
            <div class="pull-right">
                <!-- 请输入附件名查找 -->
                <input v-model.trim="inputSearch" @keyup.enter="searchIconClick" :placeholder="$t('mxpcweb.client.detail.1529993520289')">
                <i class="iconfont icon-search" @click="searchIconClick"></i>
            </div>
            <!-- 请选择 -->
            <el-select v-model="categoryValue" :placeholder="$t('mxpcweb.sale.components.1557564798885')" style="width:88px; position:relative; top:1px">
                <el-option v-for="item in category" :key="item.code" :label="item.name" :value="item.code"></el-option>
            </el-select>
        </div>

        <list-customer ref="listCustomer" :moduleCode="moduleCode" :itemId="itemId" :windowMode="windowMode" @previewItem="previewItem" @showDetail="showDetail"></list-customer>

        <doc-preview ref="filePreview"></doc-preview>
        <doc-detail ref="docDialog"></doc-detail>
    </div>
</template>
<script>

import DocPreview from '@/components/DocPreview/index'
import DocDetail from '@/components/DocDetail/index'
import ListCustomer from './ListCustomer/index'
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
        itemId: {
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
        activeName: {
            type: String,
            default: ''
        },
        itemActive: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            listTabArr: [ // 按钮组
                {
                    // 客户附件
                    name: this.$t('mxpcweb.sale.components.1557564961979'),
                    value: 'listTab1',
                    isShow: true
                },
                {
                    // 邮件附件
                    name: this.$t('mxpcweb.sale.components.1557564962171'),
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
    },
    mounted() {
    },
    methods: {
        getTabData(obj) {
            this.$refs.listCustomer.getTabData(obj)
        },
        // 打开选文件
        openWindow() {
            let data = {
                url: this.Global.api.v2.folders_files, // api（必传）
                fileSource: 3,
                billId: this.itemId,
                remarks: '',
                moduleCode: this.moduleCode,
                fn: (res) => {
                    this.resetList() // 重置状态
                    this.getTabData() // 刷新
                }
            }
            ep.emit('selectFile', data)// 相当于触发标记
        },
        searchIconClick() {
            this.getTabData({keywords: this.inputSearch})
        },
        // 预览
        previewItem(dataList, index) {
            this.$refs.filePreview.open(dataList, index)
        },
        // 明细修订
        showDetail(item) {
            this.$refs.docDialog.open(item)
        }
    },
    components: {
        'doc-preview': DocPreview,
        'list-customer': ListCustomer,
        'doc-detail': DocDetail
    },
    watch: {
        activeName(val) {
            if (val == this.itemActive) {
                this.$refs.listCustomer.getTabData()
            }
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less">
@import "./zh-cn.less";
@import "./en.less";
</style>
