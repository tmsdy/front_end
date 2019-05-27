<template>
    <div class="ShowNameClass">
        <i class="iconfont iconfont icon-reply"></i>
        <span>{{showDetail.address}}</span>
        <em class="strange" v-if="showDetail.category==undefined&&isShow" @click="custSliderOpen(showDetail.address, id)">陌</em>
        <em class="customer" v-if="showDetail.category==1&&isShow" @click="custSliderOpen(showDetail.address, id)">客</em>
        <em class="customer" v-if="showDetail.category==2&&isShow">供</em>
        <em class="customer" v-if="showDetail.category==3&&isShow">内</em>
        <em class="customer" v-if="showDetail.category==4&&isShow">{{getType(showDetail.mark)}}</em>
    </div>
</template>
<script>
/**
 * 描述：邮件部分
 * 作者：向士健(CSS) / ***(API)
 * 时间：2017/12/11
 */
// import { isArray, tagsBgColor } from '@/libs/utils.js'
// import { mapGetters, mapMutations } from 'vuex'
export default {
    name: 'ShowName',
    props: {
        showDetail: {
            type: Object,
            default: function () {
                return {}
            }
        },
        isShow: {
            type: Boolean,
            default: function () {
                return true
            }
        }
    },
    data() {
        return {
            showOption: {
                id: '',
                name: ''

            }
        }
    },
    computed: {
        id() {
            if (this.showDetail.category == undefined) {
                return ''
            }
            if (this.showDetail.category == 1) { // 客户联系人 1
                return this.showDetail.custId
            }
            if (this.showDetail.category == 2) { // 供应商：2
                return ''
            }
            if (this.showDetail.category == 3) { // 内部联系人：3
                return this.showDetail.accountId
            }
            if (this.showDetail.category == 4) {
                return ''
            }
        }
    },
    created() {

    },
    methods: {
        custSliderOpen(address, custId) {
            let _this = this
            ep.emit('custSliderOpen', {
                mail: address,
                constId: custId,
                fn() {
                    _this.$emit('filterGetMail', '', '', '', '', '')// 刷新
                    // _this.filterGetMail('', '', '', '', '') // 刷新
                }
            })
        },
        getType(type) {
            let str = ''
            switch (type) {
                case 'enquiry':
                    str = '询'
                    break
                case 'notification':
                    str = '通'
                    break
                case 'recruit':
                    str = '招'
                    break
            }
            return str
        }

    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
.ShowNameClass {
    background: RGBA(223, 226, 228, 1);
    border-radius: 4px;
    span {
        text-decoration: underline;

        color: #222222;
    }
    > i {
        color: rgba(48, 49, 51, 1);
        margin-left: 5px;
    }
    > em {
        display: inline-block;
        font-size: 10px;
        font-style: normal;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        border-radius: 50%;
        margin-left: 1px;
        background-color: #f60;
        color: #fff;
        &:hover {
            cursor: pointer;
        }
    }

    .customer {
        background: linear-gradient(
            135deg,
            rgba(255, 105, 124, 1),
            rgba(208, 2, 27, 1)
        );
    }
    .strange {
        background: linear-gradient(
            135deg,
            rgba(153, 153, 153, 1),
            rgba(102, 102, 102, 1)
        );
    }
    &:hover {
        // color: #E6001F;
        cursor: default;
        font {
            color: #e6001f;
        }
    }
}
</style>
