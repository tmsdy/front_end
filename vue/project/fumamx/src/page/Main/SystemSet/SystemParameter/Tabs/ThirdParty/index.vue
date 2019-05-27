<template>
    <div class="ThirdParty">
        <div class="input_title">
            {{$t('mxpcweb.systemset.systemparameter.1535015603356')}}
        </div>
        <template v-if="isAdmin">
            <!-- 未绑定操作 -->
            <div v-if="!isBindDingDing" class="bindstep">
                <div class="stepaxis" style="height: 240px;">
                    <div class="axis">
                        <div class="serialNumber">1</div>
                        <div class="tree"></div>
                    </div>
                    <p class="title">管理员打开钉钉扫码</p>
                    <img :src="getQRCode()" style="width:100%;">
                </div>
                <div class="stepaxis" style="height: 100px;">
                    <div class="axis">
                        <div class="serialNumber">2</div>
                        <div class="tree"></div>
                    </div>
                    <p class="title">输入以下许可号</p>
                    <div class="licenseNumber">{{ code }}</div>
                </div>
                <div class="stepaxis" style="height: 30px;">
                    <div class="axis">
                        <div class="serialNumber">3</div>
                        <div class="tree"></div>
                    </div>
                    <p class="title">完成</p>
                </div>
            </div>
            <!-- 已绑定操作 -->
            <div v-if="isBindDingDing">{{ $t('mxpcweb.systemset.systemparameter.1535091103603') }} &nbsp;&nbsp; corpId: {{ corpId }}</div>
        </template>
        <template v-else>
            <div>{{$t('mxpcweb.systemset.systemparameter.1535091166355')}}</div>
        </template>
        <br />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'ThirdParty',
    props: {
    },
    data() {
        return {
            isAdmin: true, // 当前用户是否管理员
            isBindDingDing: true,
            code: '',
            corpId: ''
        }
    },
    computed: {
        ...mapGetters([
            'company'
        ])
    },
    created() {
        this.isBind()
    },
    methods: {
        // 根据环境不同设置不同二维码
        getQRCode() {
            if (window.runtime === 'prod') {
                return 'https://file.fumamx.com/mx_logo_dingtalk.png'
            } else {
                return 'https://files.laifuyun.com/dingtalkMX_alpha.png'
            }
        },
        // 检查企业是否与钉钉有绑定关系
        isBind() {
            let _this = this
            let { cId } = this.company
            _this.$http.post(this.Global.baseURL + this.Global.api.v2.dingtalk_relationship_check, { cId }).then((res) => {
                if (res.body.code.toString() == _this.Global.RES_OK && res.body.data && res.body.data.corpId) {
                    _this.corpId = res.body.data.corpId
                    // 已绑定
                    _this.isBindDingDing = true
                } else {
                    // 为绑定,去绑定
                    _this.isBindDingDing = false
                    // 检查当前用户是否是管理员
                    _this.$http.get(this.Global.baseURL + this.Global.api.v2.contact_do, { params: { type: 'isAdmin' } }).then((res) => {
                        if (res.body.code.toString() == _this.Global.RES_OK) {
                            let { isAdmin } = res.body.data
                            // 当前系统登陆用户是管理员，可以立刻绑定
                            if (isAdmin) {
                                _this.isAdmin = true
                                _this.toBind()
                            } else {
                                // 登陆用户不是管理员
                                // 显示提醒联系管理员绑定
                                _this.isAdmin = false
                            }
                        }
                    })
                }
            }, (res) => {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        toBind() {
            let _this = this
            let { cId } = this.company
            _this.$http.post(this.Global.baseURL + this.Global.api.v2.dingtalk_licenseCode_add, { cId }).then((res) => {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.code = res.body.data.code
                } else {
                    _this.$message.error(_this.$t('mxpcweb.systemset.systemparameter.1535090826019'))
                }
            }, (res) => {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
