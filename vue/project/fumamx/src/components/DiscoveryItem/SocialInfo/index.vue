<template>
    <div class="SocialInfo">
        <el-dialog v-dialogDrag title="公司简介" :visible.sync="show" size="small" :before-close="handleClose">
            <div class="box">
                <transition name="el-fade-in-linear">
                    <table v-if="!isLoading&&Object.keys(data).length>0" class="table">
                        <tbody>
                            <tr>
                                <td style="vertical-align:middle;">公司头像</td>
                                <td>
                                    <img class="companyImg" v-imgsrc="data.picture">
                                </td>
                            </tr>
                            <tr>
                                <td>公司名称</td>
                                <td>
                                    <p>
                                        <i v-if="type=='fb-pages'" class="iconfont icon-facebook facebookIcon"></i>
                                        <i v-if="type=='linkedin'" class="iconfont icon-linkedin linkedinIcon"></i>
                                        <i v-if="type=='twitter'" class="iconfont icon-twitter twitterIcon"></i>
                                        <strong><a class="link" :href="data.link" target="_Blank">{{data.company}}</a></strong>
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td style="width:120px;">联系邮箱</td>
                                <td>
                                    <a class="text-red" href="javascript:void(0);">{{data.email}}<span></span></a>
                                </td>
                            </tr>
                            <tr>
                                <td>联系地址</td>
                                <td>{{data.country}}</td>
                            </tr>
                            <tr>
                                <td>联系电话</td>
                                <td>{{data.phone}}</td>
                            </tr>
                            <tr>
                                <td>公司网站</td>
                                <td><a class="link" :href="data.domain" target="_blank">{{data.domain}}</a></td>
                            </tr>
                            <tr>
                                <td>简要描述</td>
                                <td>{{data.title}}</td>
                            </tr>
                            <tr>
                                <td style="vertical-align:middle;">详细说明</td>
                                <td>{{data.description}}</td>
                            </tr>
                        </tbody>
                    </table>
                </transition>
                <transition name="el-fade-in-linear">
                    <loading v-show="isLoading" class="atCenter"></loading>
                </transition>
                <!-- 没有记录 -->
                <transition name="el-fade-in-linear">
                    <no-data v-show="Object.keys(data).length<=0&&!isLoading" class="noDataBox atCenter"></no-data>
                </transition>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import NoData from '@/basecomponents/NoData/index'
import Loading from '@/basecomponents/Loading/index'
export default {
    name: 'SocialInfo',
    props: {
        type: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            show: false,
            isLoading: false,
            previousRequest: null,
            data: {},
            id: ''
        }
    },
    methods: {
        handleClose(done) {
            this.data = {}
            done()
        },
        open(id) {
            this.data = {}
            this.id = id
            this.show = true
            this.getInfo()
        },
        getInfo() {
            let url = this.Global.baseURL + this.Global.api.v2.find_socialInfo
            let data = {
                params: {
                    id: this.id
                },
                before(request) {
                    if (this.previousRequest) {
                        this.previousRequest.abort()
                    }
                    this.previousRequest = request
                }
            }
            this.isLoading = true
            this.$http.get(url, data)
                .then(res => {
                    if (res.body.code.toString() === this.Global.RES_OK) {
                        this.data = res.body.data
                    } else {
                        console.log('发现模块获取社交信息:' + res.body.msg)

                        //  this.$message.error(this.msg(res.body))
                    }
                    this.isLoading = false
                })
                .catch(err => {
                    if (err.status != 0) {
                        this.isLoading = false
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                })
        }
    },
    components: {
        'no-data': NoData,
        'loading': Loading
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
