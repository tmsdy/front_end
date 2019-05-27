<template>
    <div class="noDataProps">
        <div class="ico">
            <img v-if="img != ''" :src="getSrc()">
            <i v-else class="iconfont" :class="icon"></i>
        </div>
        <div class="text">{{title}}</div>
        <template v-for="(item, index) in fastOpt">
            <el-button :key="index" v-if="btnText != ''&&item.optCode=='otNew'" class="btnAdd" size="small" type="primary" @click="noDataClick(item)">{{btnText}}</el-button>
        </template>
    </div>
</template>
<script>
// 此组件使用方法如：<noDataProps v-if="noDataShow" v-on:noDataClick='roleMemberAddClick' :icon="noData.icon" :title="noData.title" :btnText="noData.btnText"></noDataProps>
    export default {
        name: 'NoData',
        props: {
            img: {
                type: String,
                default: 'noData'
            },
            icon: {
                type: String,
                default: 'icon-nodata'
            },
            title: {
                type: String,
                // 暂无数据
                default: ''
            },
            btnText: {
                type: String,
                default: ''
            },
            fastOpt: {// 获取空间操作按钮列表
                type: Array,
                default: function() {
                    return []
                }
            }
        },
        methods: {
            getSrc() {
                return '/static/images/noData/' + this.img + '.png'
            },
            noDataClick(item) {
                let obj = {
                    optData: item,
                    next: () => {
                        this.$emit('getListData')
                    }
                }
                ep.emit('clickAddpeople', obj)
            }
        }
    }
</script>
<style lang="less" rel="stylesheet/less" scoped>
    .noDataProps {
        border-radius: 4px;
        padding: 30px 0 15px;
        color: #aaa;
        text-align: center;
        .ico{
            text-align: center;
            img{
                width:200px;
            }
        }
        .iconfont {
            font-size: 45px;
        }
        .text {
            margin: 7px 0 10px 10px;
            letter-spacing:10px;
            font-size: 16px;
            color:RGBA(144, 147, 153, 1);
        }
        .btnAdd {
            margin:30px 0 20px;
        }
    }
</style>
