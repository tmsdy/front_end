<template>
    <div class="PrivateLetter">
        <page-title :showTitle="false"></page-title>
        <div class="main">
            <div class="msgBox">
                <div class="leftBox pull-left">
                    <p class="title">即时消息联系人</p>
                    <div class="contactsBox MXscroll">
                        <ul class="contactsList">
                            <li v-for="(item,index) in msgList" @click="lookItem(index)" :class="{'active':nowIndex==index}" :key="index" class="item ellipsis">
                                {{fullname}}
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="rightBox">
                    <p class="title">The Sender <span class="account">TO:Facebook page name</span></p>
                    <div class="listBox MXscroll">
                        <ul class="contentList">
                            <li v-for="(item,index) in contentList" :key="index" class="item clearfix">

                                <div v-if="item.sender_id==msgList[nowIndex].sender_id" class="pull-left">
                                    <p class="clearfix">
                                        <span class="name pull-left">{{item.fullname}}</span>
                                        <span class="time pull-left">{{item.createdate}}</span>
                                    </p>
                                    <div class="content pull-left">
                                        {{item.message_content}}
                                    </div>
                                </div>
                                <div v-else class="pull-right">
                                    <p class="clearfix">
                                        <span class="name pull-right">{{item.fullname}}</span>
                                        <span class="time pull-right">{{item.createdate}}</span>
                                    </p>
                                    <div class="content pull-right">
                                        {{item.message_content}}
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="btmBox">
                        <div class="inputBox">
                            <textarea v-model="text" class="text MXscroll"></textarea>
                            <div @click="replyMsg()" class="button">Send</div>
                        </div>
                        <div class="replyAccount clearfix">
                            <div class="pull-right">
                                <span>回复账号:</span>
                                <span>Facebook page name</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import PageTitle from '@/components/PageTitle/index'
export default {
    name: 'PrivateLetter',
    data() {
        return {
            msgList: [],
            nowIndex: 0,
            text: '',
            contentList: []
        }
    },
    created() {
        this.getMsgList()
    },
    methods: {
        isMyself(i) {
            return i % 2 == 0
        },
        lookItem(index) {
            this.nowIndex = index
        },
        getMsgList() {
            let url = this.Global.baseURL + this.Global.api.v2.find_socialPrivateLetter
            this.$http.get(url)
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        // this.msgList = res.body.data
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                })
                .catch(err => {
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        },
        getMsgContent() {
            let url = this.Global.baseURL + this.Global.api.v2.find_socialPrivateLetter
            let data = {
                senderId: this.msgList[this.nowIndex].senderId
            }
            this.$http.post(url, data)
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.contentList = res.body.data
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                })
                .catch(err => {
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        },
        replyMsg() {
            if (!this.this.msgList[this.nowIndex]) {
                return
            }
            let url = this.Global.baseURL + this.Global.api.v2.find_socialReleaseList
            let data = {
                type: 'replyMessageText',
                eventId: this.msgList[this.nowIndex].sender_id,
                messageContent: this.text
            }
            this.$http.get(url, data)
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {

                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                })
                .catch(err => {
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        }
    },
    components: {
        'page-title': PageTitle
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
