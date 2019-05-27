<template>
    <div class="ShowNameClass">
        <span>{{name}}</span>
        <font>&lt;{{showDetail.address}}&gt;</font>
        <!-- <em @click="custSliderOpen(item2.address,item2.custId)">{{item2.custId==undefined?'陌':'客'}}</em> -->
        <em class="strange" v-if="!this.showDetail.category&&isShow" @click="custSliderOpen(showDetail.address, id)">陌</em>
        <em class="customer" v-if="this.showDetail.category==1&&isShow" @click="custSliderOpen(showDetail.address, id)">客</em>
        <em class="customer" v-if="this.showDetail.category==2&&isShow">供</em>
        <em class="customer" v-if="this.showDetail.category==3&&isShow">内</em>
        <em class="customer" v-if="this.showDetail.category==4&&isShow">{{getType(this.showDetail.mark)}}</em>
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
        },
        name() {
            if (this.showDetail.category == undefined) {
                return this.getName(this.showDetail, 0)
            }
            if (this.showDetail.category == 1) { // 客户联系人 1
                return this.getName(this.showDetail, 1)
            }
            if (this.showDetail.category == 2) { // 供应商：2
                return this.getName(this.showDetail, 0)
            }
            if (this.showDetail.category == 3) { // 内部联系人：3
                return this.getName(this.showDetail, 3)
            }
            if (this.showDetail.category == 4) {
                return this.getName(this.showDetail, 4)
            }
        }

    },
    created() {

    },
    methods: {
        getName(item, type) {
            let name = ''
            switch (type) {
                case 1:// undefined 和 1
                    name = item.contName == undefined ? this.substringName(item.address) : item.contName
                    break
                case 2:
                    name = item.personal == undefined ? substringName(item.address) : item.personal
                    break
                case 3:
                    name = item.ownerName == undefined ? this.substringName(item.address) : item.ownerName
                    break
                case 4:
                    name = item.personal == undefined ? this.substringName(item.address) : item.personal
                    break
                default:
                    name = item.personal == undefined ? this.substringName(item.address) : item.personal
                    break
            }
            return name
        },
        // 名称截取
        substringName(adderss) {
            let str = adderss.split('@')
            return str[0]
        },
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
    span {
        text-decoration: underline;

        color: #222222;
    }
    font {
        color: #222222;
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
