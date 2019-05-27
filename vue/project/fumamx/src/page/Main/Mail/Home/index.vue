<template>
    <div class="Home">
        <!-- 中间邮件列表 -->
        <list-center @ShowDetail="ShowDetail" ref="ListCenter" @OperationTrigger="OperationTrigger"></list-center>

        <!-- 右侧邮件详情 -->
        <detail-right v-loading="loading" :DetailDataList="DetailDataList" :content="content" ref="detail-right" @LastListCenter="LastListCenter" @OperationTrigger="OperationTrigger"></detail-right>
        <!-- <puablic-action ref="puablicAction" @LastListCenter="LastListCenter"></puablic-action> -->
    </div>
</template>

<script>
/**
 * 描述：邮件部分
 * 作者：向士健(CSS)/ ***(API)
 * 时间：2017/11/11
 */
// import { escape2Html } from '@/libs/utils.js'
import ListCenter from './ListCenter/index.vue'
import DetailRight from './DetailRight/index.vue'
import puablicAction from './vue/puablicAction'
import { mapGetters } from 'vuex'
export default {
    name: 'Home',
    props: [],
    data() {
        return {
            DetailDataList: {},
            BoxId: '0',
            content: '',
            // attachmentList: [],
            previousRequest: '',
            loading: false,
            loaded: false
        }
    },
    computed: {
        ...mapGetters([
            'company'
        ]),
        ...mapGetters('mail', [
            'subordinateCtid'
        ])
    },
    created() {
        ep.tail('tellFather', function (data) {
            // this.reLoadMailList()// 刷新列表
            this.$refs.ListCenter.filterGetMail('', '', '', '', '')
        })
    },
    methods: {
        // 操作
        OperationTrigger(key, key2, key3, key4) {
            // this.$refs.puablicAction.OperationTrigger(key, key2, key3, key4)
            this.$emit('OperationTrigger', key, key2, key3, key4)
        },
        LastListCenter(mIds, actionName) {
            this.$refs.ListCenter.LastListCenter(mIds, actionName)
        },
        // 桥梁 ListCenter传一个对象至--》DetailRight
        ShowDetail(mId, BoxId) {
            if (mId != undefined) {
                this.getMailCurrent(mId)
            } else {
                this.loading = false
                this.loaded = true
                this.DetailDataList = {}
                this.content = ''
                // this.$message.error(this.$t('mxpcweb.mail.1544432877575'))
            }
            this.BoxId = BoxId
        },
        getMailCurrent(mId) {
            this.loaded = false
            let data = { mId: mId, type: 'details' }
            if (this.subordinateCtid != this.company.ctId && this.subordinateCtid != 0) {
                data.ctid = this.subordinateCtid
            } else {
                delete data.ctid
            }

            let paramsData = {
                params: data,
                before(request) {
                    if (this.previousRequest) {
                        this.previousRequest.abort()
                    }
                    this.previousRequest = request
                }
            }
            let _this = this
            let timeOut = setTimeout(function () {
                if (!_this.loaded) {
                    _this.loading = true
                }
            }, 500)
            this.$http.get(this.Global.baseURL + this.Global.api.Mail.getMailCurrent, paramsData).then(function (res) {
                clearTimeout(timeOut)
                _this.loading = false
                _this.loaded = true
                if (res.body.code.toString() == this.Global.RES_OK) {
                    let detailObject = res.body.data
                    if (res.body.deliveryList) {
                        let obj = this.deliveryListRewrite(res.body.deliveryList, detailObject.type)
                        detailObject.singleMailDeliveryStatuses = obj.List
                        if (obj.List.length == obj.sourseCount) {
                            detailObject.deliveryStatus = 1
                        }
                    }
                    detailObject.status = 1
                    this.DetailDataList = detailObject
                    if (detailObject.htmlContent) {
                        this.content = detailObject.htmlContent
                    } else {
                        this.content = detailObject.content
                    }
                    // this.content = escape2Html(this.content) // 转义解析成html
                } else {
                    this.$message.error(this.msg(res.body))
                    this.loading = false
                    this.DetailDataList = {}
                    this.content = ''
                }
            }, function (res) {
                clearTimeout(timeOut)
                this.loading = false
                this.DetailDataList = {}
                _this.loaded = true
                // this.attachmentList = []
                this.content = ''
                if (res.status != 0) {
                    this.$message.error(res.body.msg)
                }
            })
        },
        deliveryListRewrite(deliveryList, type) {
            let List = []
            let dataArry = []
            let sourseCount = 0
            if (deliveryList.singleMailDeliveryStatuses) {
                dataArry = deliveryList.singleMailDeliveryStatuses
            }
            let Consignee = ''
            if (type == 0) { // 普通
                List.push({
                    createTime: dataArry[0].createTime,
                    mailAccount: '',
                    code: dataArry[0].code,
                    state: dataArry[0].code == '250' ? this.$t('mxpcweb.mail.1528782772184') : dataArry[0].msg
                })
                sourseCount = dataArry[0].code == '250' ? 1 : 0
            } else { // 一对一
                if (dataArry.length == 0) {
                    List.push({
                        createTime: '',
                        mailAccount: '',
                        state: deliveryList.msg
                    })
                } else {
                    for (let i = 0; i < dataArry.length; i++) {
                        if (dataArry[i].targetAddresses) {
                            if (dataArry[i].targetAddresses.indexOf('<') != -1) {
                                let temArry = dataArry[i].targetAddresses.split('<')
                                Consignee = temArry.length > 1 ? temArry[1].split('>')[0] : ''
                            } else {
                                Consignee = dataArry[i].targetAddresses
                            }
                        } else {
                            Consignee = ''
                        }
                        if (dataArry[i].code == '250') {
                            sourseCount++
                        }
                        List.push({
                            createTime: dataArry[i].createTime,
                            mailAccount: Consignee,
                            code: dataArry[i].code,
                            state: dataArry[i].code == '250' ? this.$t('mxpcweb.mail.1528782772184') : dataArry[i].msg
                        })
                    }
                }
            }
            return { List: List, sourseCount: sourseCount }
        }

    },
    components: {
        'list-center': ListCenter,
        'detail-right': DetailRight,
        'puablic-action': puablicAction
    }
}
</script>

<style lang="less" rel="stylesheet/less">
@import "./zh-cn.less";
@import "./en.less";
</style>
