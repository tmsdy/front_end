/*
 * Discription:企业概况
 * -----
 * Created Date: Monday, 25th March 2019 4:20:11 pm
 * Author: 郭兵 (guobing93@163.com)
 * -----
 * Last Modified: Monday, 25th March 2019 4:20:53 pm
 * Modified By: name (email)
 */

<template>
    <div class="CompanyProfile">
        <div class="navTitle clearfix">
            企业概况
            <div v-if="companyInfo.searchId||detailItem.id" class="pull-right">
                <span class="hintText">数据更新:{{detailItem.deepdate}}</span>
                <el-button @click="handleUpdate()" :disabled="!canUpdate" :loading="isUpdate" type="primary" class="btnItem">更新</el-button>
            </div>
        </div>
        <div class="infoBox">
            <div class="imgBox">
                <a target="_blank" @click.prevent="openNewWindowTab(detailItem.link)" :href="detailItem.link">
                    <img v-imgsrc="detailItem.picture" data-initsrc="/static/images/initImg.png" alt="" />
                </a>
            </div>
            <ul class="infoList clearfix">
                <li>
                    <span class="label">所在国家</span>
                    <p class="ellipsis text">{{companyInfo.countryEn||detailItem.country||"-"}}</p>
                </li>
                <li>
                    <span class="label">地理位置</span>
                    <p class="ellipsis text">{{"-"}}</p>
                </li>
                <li>
                    <span class="label">交易额</span>
                    <p class="ellipsis text">{{Money}}</p>
                </li>
                <li>
                    <span class="label">交易笔数</span>
                    <p class="ellipsis text">{{companyInfo.count||0}}</p>
                </li>
                <li>
                    <span class="label">联系电话</span>
                    <p class="ellipsis text">{{detailItem.phone||'-'}}</p>
                </li>
                <li>
                    <span class="label">联系邮箱</span>
                    <p class="ellipsis text">{{detailItem.email||'-'}}</p>
                </li>
                <li>
                    <span class="label">公司网站</span>
                    <p class="ellipsis text">
                        <a class="link" target="_blank" @click.prevent="openNewWindowTab(detailItem.link)">{{detailItem.link||'-'}}</a>
                    </p>
                </li>
                <li>
                    <span class="label">员工人数</span>
                    <p class="ellipsis text">-</p>
                </li>
                <li class="detailDes">
                    <span class="label">详细说明</span>
                    <p class="desContext">{{detailItem.description||'暂无'}}</p>
                </li>
            </ul>
        </div>
        <ul v-if="showPanel" class="dataBox clearfix">
            <li class="socialBox">
                <img class="bgImg" src="/static/images/find/social.png" alt="">
                <p class="number">{{socialLen}}</p>
                <span class="label">社交媒体</span>
            </li>
            <li class="contactBox">
                <img class="bgImg" src="/static/images/find/contacts.png" alt="">
                <p class="number">{{detailItem.workerNumber||0}}</p>
                <span class="label">联系人</span>
            </li>
            <li class="recordBox">
                <img class="bgImg" src="/static/images/find/customs.png" alt="">
                <p class="number">{{companyInfo.count||0}}</p>
                <span class="label">海关记录</span>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    name: 'CompanyProfile',
    props: {
        companyInfo: {
            type: Object,
            default: () => ({})
        },
        detailItem: {
            type: Object,
            default: () => ({})
        },
        showPanel: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isUpdate: false,
            previousRequest: null
        }
    },
    computed: {
        canUpdate() {
            let now = this.$moment(new Date(), 'YYYY/MM/DD').format('YYYY-MM-DD')
            let deeptime
            if (this.detailItem.deepdate) {
                deeptime = this.$moment(this.detailItem.deepdate.replace(/-/g, '/'), 'YYYY/MM/DD').format('YYYY-MM-DD')
            } else {
                return false
            }
            return now !== deeptime
        },
        Money() {
            let { money: m } = this.companyInfo
            if (m) {
                return `$${(m / 1000000).toFixed(2)}M`
            } else {
                return '-'
            }
        },
        socialLen() {
            let t = this.detailItem.social_info || '{}'
            let map = JSON.parse(t)
            return Object.keys(map).length
        },
        workersLen() {
            let start = (this.page.now - 1) * this.page.size
            let end = this.page.now * this.page.size - 1
            let arr = []
            for (let index = start; index < end; index++) {
                if (this.allWorkers[index]) arr.push(this.allWorkers[index])
            }
            return arr.length
        }
    },
    methods: {
        async handleUpdate() {
            if (this.isUpdate) return
            let flag = await this._deepUpdate()
            if (flag) {
                this.$emit('updated')
            }
        },
        async _deepUpdate() {
            this.isUpdate = true
            let returnFlag = false
            try {
                let url = this.Global.baseURL + this.Global.api.v2.find_detailed
                let data = {
                    params: {
                        id: this.companyInfo.searchId || this.detailItem.id,
                        source: '1'
                    },
                    before(request) {
                        if (this.previousRequest) {
                            this.previousRequest.abort()
                        }
                        this.previousRequest = request
                    }
                }
                let res = await this.$http.get(url, data)

                if (res.body.code.toString() == this.Global.RES_OK) {
                    returnFlag = true
                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                if (error.status == 0) {
                    return false
                }

                this.$message.error(this.$t(this.Global.errorTitle))
            }
            this.isUpdate = false
            return returnFlag
        }

    },
    watch: {
    },
    components: {

    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "../common.less";
@import "./zh-cn.less";
@import "./en.less";
</style>
