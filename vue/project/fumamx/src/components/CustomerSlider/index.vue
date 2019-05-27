<template>
    <div class="CustomerSlider">
        <transition name="fade">
            <div class="sliderBg" v-if="isOpen" @click="isOpen=false"></div>
        </transition>
        <transition name="slider-customer">
            <div class="sliderBody" v-if="isOpen">
                <!-- 标题 -->
                <div class="title">
                    {{getObject.mail||getObject.title}}
                    <span class="pull-right text-hover">
                        <i class="iconfont icon-close" @click="isOpen=false"></i>
                    </span>
                </div>
                <div class="custMain MXscroll">
                    <client-detail v-if="getObject.constId !== undefined && getObject.constId+'' !== ''" :windowMode="true" :windowModeId="getObject.constId+''" @close="isOpen=false" :iscustTable=false></client-detail>
                    <template v-else>
                        <div class="text-center" style="margin:70px 0 15px; line-height:26px;">
                            <div class="iconNotice">
                                <i class="iconfont icon-warning"></i>
                            </div>
                            <div class="text-blue">{{getObject.mail}}<i @click="writeMailChange()" class="iconfont icon-mail" style="margin-left: 10px;"></i></div>
                            <!--是一个陌生客户，抓住机会。<br> 立即 【新增客户】或 【新增联系人】-->
                            <div v-html="$t('mxpcweb.components.1530774608521')"></div>
                        </div>
                        <to-customer :mail="getObject.mail" @tellFather="tellFather"></to-customer>
                        <!-- 详情 -->
                        <customer-details-slider :mailAddress="getObject.mail"></customer-details-slider>
                    </template>

                </div>
            </div>
        </transition>
    </div>
</template>

<script>
/**
 * 描述：客户滑动抽屉
 * 作者：向士健
 * 时间：2018/03/07
 */
import ClientDetail from '@/page/Main/Client/Layout/standard/ClientDetail/index.vue'
import ToCustomer from './ToCustomer/index.vue'
import CustomerDetailsSlider from './CustomerDetailsSlider/index'
export default {
    name: 'CustomerSlider',
    props: [],
    data() {
        return {
            isOpen: false,
            getObject: {}
        }
    },
    created() {
        /** 相当于这里做个标记，将要干嘛，规范格式如下：
         * ep.emit('custSliderOpen', {
              mail: item.email,
              constId: item.custId,
              fn() {
                  // this.$emit('UpdataListCenterData', this.DetailData, 1) // 更新列表中的某一条数据
              }
          })
             * */
        ep.tail('custSliderOpen', (obj) => {
            this.isOpen = true
            this.getObject = obj
        })
        ep.tail('custSliderClose', () => {
            this.isOpen = false
        })
    },
    methods: {
        // 写邮件
        writeMailChange() {
            let _this = this
            // 写邮件
            ep.emit('openNewMail', { 'title': _this.$t('mxpcweb.client.1529053914531'), 'type': 'W' })
            let obj = { recipientsPicking: [{ mail: _this.getObject.mail, name: _this.getObject.mail.split('@')[0] }] }
            setTimeout(function () {
                let { id } = _this.$route.params
                let ids = id.split('_')
                ep.emit('CustmerWriteMail' + ids[2], obj)
            }, 50)
            this.isOpen = false
        },
        tellFather() {
            this.isOpen = false
            try {
                this.getObject.fn()// 通知刷新一下
            } catch (e) {
                console.log('this.getObject.fn no find in this tellFather')
            }
            this.$emit('tellFather')
        }
    },
    components: {
        'client-detail': ClientDetail,
        'to-customer': ToCustomer,
        'customer-details-slider': CustomerDetailsSlider
    }
}
</script>

<style lang="less" rel="stylesheet/less">
@import "./zh-cn.less";
@import "./en.less";
</style>
