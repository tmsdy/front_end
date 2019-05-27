<template>
    <div class="ShowNameClass" v-if="showDetail">
        <span class="shortName"> {{name}}</span>
        <span :class="id==''?'name strange':'name customer'" v-if="custId==''">
            <em v-if="this.showDetail.category==undefined" @click="custSliderOpen(showDetail.address, id)">陌</em>
            <em v-if="this.showDetail.category==1" @click="custSliderOpen(showDetail.address, id)">客</em>
            <em v-if="this.showDetail.category==2">供</em>
            <em v-if="this.showDetail.category==3">内</em>
            <em v-if="this.showDetail.category==4">{{getType(this.showDetail.mark)}}</em>
        </span>
        <span class="pull-right">
            <i class="iconfont icon-attachment" v-if="containAttachment"></i>
            {{longSentDate}}
        </span>
        <span class="tagDivClass">
            <template v-for="(item3,index3) in tagObjects">
                <el-tag v-if="myMap[item3]!=undefined" :style="setBgColor(myMap[item3])" :key="index3">{{myMap[item3].labelName}}</el-tag>
            </template>
        </span>
    </div>
</template>
<script>
/**
 * 描述：邮件部分
 * 作者：向士健(CSS) / ***(API)
 * 时间：2017/12/11
 */
import { tagsBgColor } from '@/libs/utils.js'
// import { mapGetters, mapMutations } from 'vuex'
export default {
    name: 'ShowName',
    props:
    {
        showDetail: {
            type: Object,
            default: function () {
                return {}
            }
        },
        containAttachment: {
            type: Boolean,
            default: function () {
                return false
            }
        },
        longSentDate: {
            type: String,
            default: function () {
                return ''
            }
        },
        tagObjects: {
            type: Array,
            default: function () {
                return []
            }
        },
        myMap: {
            type: Object,
            default: function () {
                return {}
            }
        },
         custId: {
            type: String,
            default: function () {
                return ''
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
            // console.log(this.showDetail)
            if (this.showDetail.category == undefined) {
                return ''
            }
            if (this.showDetail.category == 1) { // 客户联系人 1
                return this.showDetail.custId
            }
            if (this.showDetail.category == 2) { // 供应商：2
                return this.showDetail.custId
            }
            if (this.showDetail.category == 3) { // 内部联系人：3
                return this.showDetail.accountId
            }
            if (this.showDetail.category == 4) {
                return this.showDetail.custId
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
                return this.getName(this.showDetail, 1)
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
        // 背景色
        setBgColor(data) {
            if (data == undefined || data.color == undefined) {
                return tagsBgColor(0)
            } else {
                return tagsBgColor(data.color)
            }
        },
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
    .shortName {
        // border: 1px blue solid;
        font-size: 14px;
        color: #222222;
        max-width: 40%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
    }
    .name {
        margin-left: 5px;
        > em {
            display: inline-block;
            font-size: 12px;
            font-style: normal;
            width: 20px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            border-radius: 50%;
            margin-left: 1px; // background-color: #f60;
            color: #fff;
            transform: scale(0.9);
            position: absolute;
            &:hover {
                cursor: pointer;
                -webkit-box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);
                -moz-box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);
                box-shadow: 0px 3px 10px 0px rgba(0, 0, 0, 0.1);
            }
        }
    }
    .customer {
        // color: #888;
        > em {
            // background-color: red;
            background: linear-gradient(
                135deg,
                rgba(255, 105, 124, 1),
                rgba(208, 2, 27, 1)
            );
        }
    }
    .strange {
        // color: #999;
        > em {
            background: linear-gradient(
                135deg,
                rgba(153, 153, 153, 1),
                rgba(102, 102, 102, 1)
            );
        }
    }
    .pull-right {
        i {
            font-size: 13px;
        }
    }
    .tagDivClass {
        position: absolute;
        margin-left: 25px;
        // display: inline-block;
    }
}
</style>
