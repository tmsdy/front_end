<template>
    <div class="showList MXscroll" v-loading="loading">
        <no-data v-if="list.length == 0" style="padding-top:10px;"></no-data>
        <div v-else class="listBox">
            <div class="list" v-for="(item, index) in list" :key="index">
                <div class="time">{{timeShow_custom(item.deliverytime, 'YYYY-MM-DD HH:mm:ss')}}</div>
                <div class="content">
                    <span v-if="item.receiveCtId">
                        [{{contactList[item.receiveCtId] || ''}}]
                    </span>
                    {{item.msgbody}}
                </div>
                <span class="delBox text-hover" @click="delItem(item)">
                    <i class="iconfont icon-del"></i>
                </span>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import NoData from '@/basecomponents/NoData/index'
export default {
    name: 'optList',
    props: {
        itemData: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data() {
        return {
            loading: true,
            list: []
        }
    },
    created() {
    },
    computed: {
        ...mapGetters([
            'contactList'
        ])
    },
    methods: {
        delItem(item) {
            this.$confirm('是否删除此提醒？', this.$t('mxpcweb.client.1529047715824'), {
                confirmButtonText: this.$t('mxpcweb.client.1529047741736'),
                cancelButtonText: this.$t('mxpcweb.client.1529047588840'),
                type: 'warning'
            }).then(() => {
                this.$http.post(this.Global.baseURL + this.Global.api.SystemSet.scheduleremind.messengerDelete, {
                    jobName: item.jobName
                }).then((res) => {
                    if (res.body.code.toString() === this.Global.RES_OK) {
                        this.$message.success(this.msg(res.body))
                        this.getData()
                        this.$emit('getData')
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                }, (res) => {
                    this.$message.error(this.msg(res.body))
                })
            }).catch(() => {
            })
        },
        getData() {
            if (this.itemData && this.itemData.doctryId != '' && this.itemData.doctryNodeId && this.itemData.doctryNodeId != '') {
                let data = {
                    moduleCode: 'SC003',
                    strucId: '3',
                    identFieldValue: this.itemData.doctryNodeId
                }
                if (this.itemData.nodeStatus == '1') {
                    data.msgSubType = '20'
                } else if (this.itemData.nodeStatus == '2') {
                    data.msgSubType = '19'
                }
                this.$http.get(this.Global.baseURL + this.Global.api.v2.document_documentaryTiming_get, {
                    params: data
                }).then((res) => {
                    this.loading = false
                    if (res.body.code.toString() === this.Global.RES_OK && res.body.data) {
                        this.list = res.body.data.list || []
                    } else {
                        this.$message.error(this.msg(res.body))
                        this.list = []
                    }
                }, (res) => {
                    this.loading = false
                    this.list = []
                    this.$message.error(this.msg(res.body))
                })
            }
        }
    },
    components: {
        'no-data': NoData
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
    .showList{
        width:220px;
        height:206px;
        overflow: auto;
        // box-shadow:0px 2px 5px 0px rgba(0,0,0,0.1);
        border-radius:3px;
        background: white;
        .listBox{
            .list{
                min-height: 44px;
                position: relative;
                padding: 5px 10px;
                .time{
                    font-size: 12px;
                    color: #909399;
                }
                .content{
                    color: #606266;
                }
                .time, .content{
                    min-height: 17px;
                    line-height: 17px;
                }
                .delBox{
                    position: absolute;
                    top: 4px;
                    right: 10px;
                    display: none;
                }
                &:hover{
                    background: #FAFAFA;
                    .delBox{
                        display: inline-block;
                    }
                }
            }
        }
    }
</style>
