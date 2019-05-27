<template>
    <div style="width:100%; height: 100%;">
        <detail-right v-loading="loading" style="margin-left:0;" :DetailDataList="DetailDataList" :content="content" @LastListCenter="LastListCenter" @OperationTrigger="OperationTrigger" ref="detail-right" :fullShow="false">
        </detail-right>
        <!-- <puablic-action ref="puablicAction" @LastListCenter="LastListCenter"></puablic-action> -->
    </div>

</template>

<script>
/**
 * 描述：邮件部分
 * 作者：向士健(CSS) / ***(API)
 * 时间：2017/11/11
 */
import DetailRight from '../Home/DetailRight/index.vue'
import { mapGetters, mapMutations } from 'vuex'
import puablicAction from '../Home/vue/puablicAction'
export default {
    name: 'Detail',
    props: [],
    data() {
        return {
            DetailDataList: {},
            BoxId: '0',
            content: '',
            // attachmentList: [],
            mId: 0,
            Own: 0,
            loading: false,
            loaded: true,
            cachRead: false
        }
    },
    created() {
        let { id } = this.$route.params
        let ids = id.split('_')
        if (ids[0] == 'index') {
            this.cachRead = true
            return
        } else {
            this.cachRead = false
        }
        this.mId = ids[1]
        this.BoxId = ids[2]
        // this.Own = ids[3]
        // if (this.mId == '' || ids.length < 4) {
        //     console.log('链接有问题')
        // }
        this.getMailCurrent(this.mId)
    },
    computed: {
        ...mapGetters([
            'company'
        ]),
        ...mapGetters('mail', [
            'subordinateCtid'
        ])
    },
    methods: {
        openShow() {
            if (this.cachRead) { // 需要缓存中读取
                let { id } = this.$route.params
                let ids = id.split('_')
                this.cachRead = false
                this.mId = ids[1]
                this.BoxId = ids[2]
                // this.Own = ids[3]
                // if (this.mId == '' || ids.length < 4) {
                //     console.log('链接有问题')
                // }
                this.getMailCurrent(this.mId)
            }
        },
        // 操作
        OperationTrigger(key, key2, key3, key4) {
            // this.$refs.puablicAction.OperationTrigger(key, key2, key3, key4)
            this.$emit('OperationTrigger', key, key2, key3, key4)
        },
        LastListCenter() {
            this.getMailCurrent(this.mId)
            // this.$emit('tellFather')
            ep.emit('MailDelayStateGet')
        },
        // 根据ID获取邮件
        getMailCurrent(mId) {
            this.loaded = false
            let data = { mId: mId, type: 'details' }
            if (this.subordinateCtid != this.company.ctId && this.subordinateCtid != 0) {
                data.ctid = this.subordinateCtid
            } else {
                delete data.ctid
            }
            let _this = this
            let timeOut = setTimeout(function () {
                if (!_this.loaded) {
                    _this.loading = true
                }
            }, 500)
            this.$http.get(this.Global.baseURL + this.Global.api.Mail.getMailCurrent, { params: data }).then(function (res) {
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
                    if (detailObject.status != 1 && (this.subordinateCtid == this.company.ctId || this.subordinateCtid == 0)) {
                        detailObject.status = 1
                        this.SetingRead(detailObject)
                    }
                    let name = 'detail_' + detailObject.mId + '_' + detailObject.folder + '_0'
                    ep.emit('editMailTabTitle', { title: detailObject.subject, name: name })

                    this.DetailDataList = detailObject
                    this.content = detailObject.htmlContent == '' ? detailObject.content : detailObject.htmlContent
                } else {
                    this.$message.error(this.msg(res.body))
                    this.loading = false
                    this.DetailDataList = {}
                    this.content = ''
                }
            }, function (res) {
                this.loading = false
                this.DetailDataList = {}
                // this.attachmentList = []
                this.content = ''
                if (res.status != 0) {
                    this.$message.error(this.$t(this.Global.errorTitle) + res)
                }
            })
        },
        // 设置已读状态
        SetingRead(item) {
            let data = {
                mIds: [item.mId],
                status: '1',
                type: 'status',
                ctid: this.company.ctId
            }
            this.clickOperation = true
            this.$http.post(this.Global.baseURL + this.Global.api.Mail.ManyMaillistPut, data).then(function (res) {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    this.set_boxCount(1)
                } else {
                    this.$message.error(this.msg(res.body))
                }
            }, function (res) {
                this.$message.error(res)
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
        },
        ...mapMutations('mail', {
            set_boxCount: 'SET_BOXCOUNT'
        })

    },
    components: {
        'detail-right': DetailRight,
        'puablic-action': puablicAction
    },
    watch: {

    }
}
</script>
