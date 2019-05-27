<template>
    <div class="ItemProcedure">
        <div v-for="(item,index) in dataList" :key="index">
            <div class="header clearfix">
                <span class="itemTitle">{{item.templateName}}</span>
                <span @click.prevent="switchChange(item)">
                    <el-switch v-model="item.queueFlag" on-color="#D0021B" off-color="#D0021B" on-text="并行" off-text='顺行' class="switch">
                    </el-switch>
                </span>

                <el-tooltip class="item" effect="dark" content="一旦开启了顺序执行，则得等待上一个任务被完成后才能开始执行下一个任务" placement="top">
                    <span class="tips"><i class="iconfont icon-ask-mark"></i></span>
                </el-tooltip>
                <span class="stop"><i class="iconfont" @click="stopTemplate(item)" :class="item.isUse?'icon-play1': 'icon-pause '"></i></span>
                <span class="edit"><i class="iconfont icon-edit-single" @click="editItem(item)"></i></span>
                <span class="edit" style="right:30px;"><i class="iconfont icon-del" @click="deleteList(item.templateId)"></i></span>
            </div>
            <div class="optBox">
                <div class="optLine"></div>
                <div class="optListBox">
                    <template v-for="(ele,indexs) in item.templateInfo">
                        <div class="optItemBox" :key="indexs" :class="(item.templateInfo.length>1&&indexs==item.templateInfo.length-1)?'optItemBoxOver':''" :style="{width: 99/(item.templateInfo.length -1)+ '%'}">
                            <span class="optItemColorBox">
                                <span class="optItemColor"></span>
                            </span>
                            <div class="optItemContentBox">
                                <div class="contentTit">{{ele.nodeName}}</div>
                                <div style="color:#008CEE">{{ele.chargeCtId?contactList[ele.chargeCtId]:'未指派'}}</div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'ItemProcedure',
    props: {
        dataList: {
            type: Array,
            default: function () {
                return []
            }
        }
    },
    data() {
        return {
            value: '',
            controlStart: false
        }
    },
    created() {
    },
    computed: {
        ...mapGetters([
            'contactList'
        ])
    },
    methods: {
        editOrderTemplate(data) {
            let that = this
            this.$http.put(this.Global.baseURL + this.Global.api.v2.orderTemplate, data)
                .then(res => {
                    // that.dialog = false
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        that.$emit('getListData')
                        that.$emit('changeOpenDialog')
                    } else {
                        that.$message.error(that.msg(res.body))
                    }
                }
                ).catch(
                    res => {
                        that.$message.error(that.$t(that.Global.errorTitle))
                    }
                )
        },
        stopTemplate(n) {
            let params = {
                templateId: n.templateId,
                isUse: n.isUse ? 0 : 1 // 取反
            }
            this.editOrderTemplate(params)
        },
        switchChange(n) {
            let params = {
                templateId: n.templateId,
                queueFlag: n.queueFlag ? 0 : 1 // 取反
            }
            this.editOrderTemplate(params)
        },
        editItem(n) {
            this.$emit('editItem', n)
        },
        deleteList(n) {
            this.$confirm('此操作将删除该跟单流程, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.delete(this.Global.baseURL + this.Global.api.v2.orderTemplate, { params: { templateId: n } })
                    .then(res => {
                        if (res.body.code.toString() == this.Global.RES_OK) {
                            // this.$message.success(this.msg(res.body))
                            this.$emit('getListData') // 刷新报表列表
                        } else {
                            this.$message.error(this.msg(res.body))
                        }
                    },
                        res => {
                            this.$message.error(this.$t(this.Global.errorTitle))
                        }
                    )
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        }
    },
    watch: {
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
