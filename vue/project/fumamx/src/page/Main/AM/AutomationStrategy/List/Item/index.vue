<template>
    <div class="Item">
        <el-row class="listRow">
            <el-col class="listItem" :span="4">
                {{item.strategyName}}
            </el-col>
            <el-col class="listItem" :span="3">
                {{item.moduleName}}
            </el-col>
            <el-col class="listItem" :span="3">
                {{item.createDate}}
            </el-col>
            <el-col class="listItem" :span="3">
                {{item.description}}
            </el-col>
            <el-col class="listItem" :span="3">
                {{item.createRealName}}
            </el-col>
            <el-col class="listItem" :span="3">
                {{item.modifyDate}}
            </el-col>
            <el-col class="listItem" :span="2">
                <el-switch v-model="useFlag" on-text="" off-text="" @change="setUseFlag()">
                </el-switch>
            </el-col>
            <el-col class="listItem" :span="3">
                <div class="optBox">
                    <el-tooltip effect="dark" content="删除" placement="top">
                        <i @click="isRemoving?'':removeItem()" class="iconfont " :class="[isRemoving?'el-icon-loading':'icon-del']"></i>
                    </el-tooltip>
                    <el-tooltip effect="dark" content="查看" placement="top">
                        <i v-if="Global.isDev" @click="isRemoving?'':$emit('lookDetail')" class="iconfont icon-eye"></i>
                    </el-tooltip>
                </div>
                &nbsp;
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: 'Item',
    props: {
        item: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            useFlag: this.item.useFlag == 1,
            isRemoving: false
        }
    },
    methods: {
        setUseFlag() {
            let url = this.Global.baseURL + this.Global.api.v2.autoStrategy_validityCheck
            let useFlag = this.useFlag ? 1 : 0
            let params = {
                newPageId: 1,
                id: this.item.strategyId,
                useFlag
            }
            this.$http.get(url, { params })
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.item.useFlag = useFlag
                    } else {
                        this.useFlag = !this.useFlag
                        this.$message.error(this.msg(res.body))
                    }
                })
                .catch(err => {
                    this.useFlag = !this.useFlag
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        },
        async  removeItem() {
            let str = this.item.useFlag == 1
                ? '当前已生成的任务将一并删除'
                : '删除该策略？'
            await this.$confirm(str, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            this.isRemoving = true
            let url = this.Global.baseURL + this.Global.api.v2.autoStrategy_strategy
            let data = {
                body: {
                    type: 'userStrategy',
                    id: this.item.strategyId
                }
            }
            this.$http.delete(url, data)
                .then(res => {
                    if (res.body.code.toString() === this.Global.RES_OK) {
                        this.$emit('remove')
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                    this.isRemoving = false
                })
                .catch(err => {
                    this.isRemoving = false
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        }
    },
    watch: {

    },
    components: {

    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
