<template>
    <div class="TreeMenu">
        <div class="one-level">
            <div class="one-level-title">
                <div class="titleLogo">
                    <i class="iconfont icon-company-set"></i>
                </div>
                <div class="title" :title="company.corpName">{{ company.corpName }}</div>
            </div>
            <div class="MXscroll" id="rootDom">
                <div class="two-level" v-for="(item,index) in list" :key="'a'+index">
                    <div class="two-on-off" @click="showData(item)">
                        <i class="iconfont icon-plus-file" @click.stop="showDown()"></i>
                        <span class="menuName">{{ item.deptName }}</span>
                    </div>
                    <div class="two-item-box">
                        <div class="two-level-item" v-for="(item,index) in item.accountList" :key="'b'+index" @click="action(item,$event)">
                            <div class="round"><img v-imgsrc="getGlobalImgSrc(item.avatar, '24x24')"></div>
                            <div class="name">{{ item.realName }}</div>
                        </div>
                        <div class="two-level" v-for="(item,index) in item.children" :key="'c'+index">
                            <div class="two-on-off" @click="showData(item)">
                                <i class="iconfont icon-plus-file" @click.stop="showDown()"></i>
                                <span class="menuName">{{ item.deptName }}</span>
                            </div>
                            <div class="two-item-box">
                                <div class="two-level-item" v-for="(item,index) in item.accountList" :key="'d'+index" @click="action(item,$event)">
                                    <div class="round"><img v-imgsrc="getGlobalImgSrc(item.avatar, '24x24')"></div>
                                    <div class="name">{{ item.realName }}</div>
                                </div>
                                <div class="two-level" v-for="(item,index) in item.children" :key="'e'+index">
                                    <div class="two-on-off" @click="showData(item)">
                                        <i class="iconfont icon-plus-file" @click.stop="showDown()"></i>
                                        <span class="menuName">{{ item.deptName }}</span>
                                    </div>
                                    <div class="two-item-box">
                                        <div class="two-level-item" v-for="(item,index) in item.accountList" :key="'f'+index" @click="action(item,$event)">
                                            <div class="round"><img v-imgsrc="getGlobalImgSrc(item.avatar, '24x24')"></div>
                                            <div class="name">{{ item.realName }}</div>
                                        </div>
                                        <div class="two-level" v-for="(item,index) in item.children" :key="'g'+index">
                                            <div class="two-on-off" @click="showData(item)">
                                                <i class="iconfont icon-plus-file" @click.stop="showDown()"></i>
                                                <span class="menuName">{{ item.deptName }}</span>
                                            </div>
                                            <div class="two-item-box">
                                                <div class="two-level-item" v-for="(item,index) in item.accountList" :key="'h'+index" @click="action(item,$event)">
                                                    <div class="round"><img v-imgsrc="getGlobalImgSrc(item.avatar, '24x24')"></div>
                                                    <div class="name">{{ item.realName }}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    name: 'TreeMenu',
    data() {
        return {
            list: []
        }
    },
    mounted() {
        this.accountQuery()
    },
    computed: {
        ...mapGetters(['company'])
    },
    methods: {
        accountQuery() {
            let _this = this
            let { moduleCode } = this.$route.params
            this.$http.get(_this.Global.baseURL + _this.Global.api.Subordinate.getTreeMenu, {
                params: {
                    type: 'subordinate',
                    moduleCode: moduleCode
                }
            }).then(function(res) {
                if (res.body.code.toString() === _this.Global.RES_OK && _.isArray(res.body.data)) {
                    let backList = res.body.data
                    _this.list = backList
                    if (backList.length === 0) { return }
                    // console.log(this.list)
                    this.$nextTick(() => {
                        // 默认打开的状态
                        $('#rootDom').children('.two-level:first-child').children('.two-item-box').show()
                        $('#rootDom').children('.two-level:first-child').find('.two-on-off >.iconfont').removeClass('icon-plus-file').addClass('icon-minus')
                        $('#rootDom').children('.two-level:first-child').children('.two-item-box').children('.two-level-item:first-child').click()
                        // $("#rootDom").children(".two-level:first-child").children(".two-item-box").children(".two-level-item:first-child").css("background", "blue");
                    })
                }
            }, function(res) {
                this.$message.error(this.msg(res.body))
            })
        },
        showDown() {
            let i = $(event.currentTarget)
            let nextDiv = $(event.currentTarget).parent().next('div')
            if (i.attr('class').indexOf('icon-minus') != -1) { // 打开状态
                i.removeClass('icon-minus').addClass('icon-plus-file')
                nextDiv.hide()
            } else { // 关闭状态
                i.removeClass('icon-plus-file').addClass('icon-minus')
                nextDiv.show()
            }
        },
        showData(item) {
            // $(event.currentTarget).hide();
            $(this.$el).find('.actionItem').removeClass('actionItem')
            $(event.currentTarget).addClass('actionItem')
            this.$emit('departaction', item)
        },
        action(item, event) {
            $(this.$el).find('.actionItem').removeClass('actionItem')
            $(event.currentTarget).addClass('actionItem')
            this.$emit('action', item)
        }
    },
    components: {

    },
    watch: {
        $route() {
            if (this.$route.path.indexOf('/main/subordinate') > -1) {
                this.accountQuery()
            }
        }
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
