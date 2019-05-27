<template>
    <div class="Receivables">
        <template>
            <!-- 收款提醒 -->
            <p class="contactTitle">{{$t('mxpcweb.sale.components.1557565475941')}}
                <el-button class="miniButton" size="mini" @click="addMsg()">
                    <!-- 添加提醒 -->
                    {{$t('mxpcweb.sale.components.1557565476143')}}
                </el-button>
            </p>
            <div class="ReceivablesBox">
                <div class="list" v-for="(item, index) in list" :key="index">
                    <!-- 已关闭 -->
                    <div class="type" v-if="item.status == '-2'" style="color:#D0021B">{{$t('mxpcweb.sale.components.1557565476325')}}</div>
                    <!-- 未提醒 -->
                    <div class="type" v-if="item.status == '-1'" style="color:#D0021B">{{$t('mxpcweb.sale.components.1557565500267')}}</div>
                    <!-- 已提醒 -->
                    <div class="type" v-if="item.status == '0'" style="color:#00C2B3">{{$t('mxpcweb.sale.components.1557565500423')}}</div>
                    <el-row>
                        <el-col :span="6">
                            <div>
                                {{item.msgbody}}&nbsp;
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div>
                                <span class="name">
                                <!-- 提醒日期： -->
                                {{$t('mxpcweb.sale.components.1557565500635')}}
                                </span>
                                <span>{{item.deliverytime.substring(0, 10)}}</span>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div>
                                <span class="name">
                                <!-- 提醒人员： -->
                                {{$t('mxpcweb.sale.components.1557565500827')}}
                                </span>
                                <span>{{contactList[item.receiveCtId] || ''}}</span>
                            </div>
                        </el-col>
                        <el-col :span="4">
                            <div>
                                <span class="name">
                                <!-- 收款金额： -->
                                {{$t('mxpcweb.sale.components.1557564649801')}}
                                </span>
                                <span>{{item.proceeds}}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <div class="optBox">
                        <span class="iBox" @click="delItem(item)">
                            <i class="iconfont icon-del"></i>
                        </span>
                    </div>
                </div>
            </div>
            <add-msg ref="addMsg" @getData="getDatas"></add-msg>
        </template>
    </div>
</template>
<script>
import addMsg from '../../components/AddMsg/index'
import { mapGetters } from 'vuex'
export default {
    name: 'Receivables',
    props: {
        filesEditSet: {
            type: Object,
            default: () => {
                return {}
            }
        },
        domId: {
            type: String,
            default: 'file1'
        },
        itemData: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data() {
        return {
            list: []
        }
    },
    created() {
    },
    mounted() {
        this.getData()
    },
    computed: {
        ...mapGetters([
            'contactList'
        ])
    },
    methods: {
        addMsg() {
            if (this.itemData.SC003) {
                let data = null
                if (this.itemData.SC003.strucId_3 && this.itemData.SC003.strucId_3.length > 0) {
                    this.itemData.SC003.strucId_3.forEach(element => {
                        if (element.nodeStatus == '1') {
                            data = element
                        }
                    })
                }
                if (data) {
                    this.$refs.addMsg.showDialog(data)
                } else {
                    // 此单据不存在金额环节！
                    this.$message(this.$t('mxpcweb.sale.components.1557565501031'))
                }
            } else {
                this.$refs.addMsg.showDialog()
            }
        },
        getDatas() {
            this.$emit('tellFather')
            this.getData()
        },
        delItem(item) {
            this.$http.post(this.Global.baseURL + this.Global.api.SystemSet.scheduleremind.messengerDelete, {
                jobName: item.jobName
            }).then((res) => {
                if (res.body.code.toString() === this.Global.RES_OK) {
                    this.$message.success(this.msg(res.body))
                    this.getData()
                } else {
                    this.$message.error(this.msg(res.body))
                }
            }, (res) => {
                this.$message.error(this.msg(res.body))
            })
        },
        getData() {
            if (this.itemData.orderId && this.itemData.orderId != '') {
                this.$http.get(this.Global.baseURL + this.Global.api.v2.document_documentaryTiming_get, {
                    params: {
                        moduleCode: 'SC002',
                        identFieldValue: this.itemData.orderId,
                        msgSubType: '0',
                        strucId: '1'
                    }
                }).then((res) => {
                    if (res.body.code.toString() === this.Global.RES_OK && res.body.data) {
                        this.list = res.body.data.list || []
                    } else {
                        this.$message.error(this.msg(res.body))
                        this.list = []
                    }
                }, (res) => {
                    this.list = []
                    this.$message.error(this.msg(res.body))
                })
            }
        },
        updata() {
        },
        submit() {
        },
        clearData() {
        }
    },
    components: {
        'add-msg': addMsg
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
