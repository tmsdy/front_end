<template>
    <div class="AutoStrategy">

        <list ref="list" v-show="!showList" @lookDetail="lookDetail" @create="handleCreate()"></list>
        <new-build v-if="showList" @pageBack="pageBack"></new-build>
    </div>
</template>
<script>
import NewBuild from './NewBuild/index'
import List from './List'
export default {
    name: 'AutoStrategy',
    data() {
        return {
            showList: false
        }
    },
    methods: {
        handleCreate() {
            this.showList = true
        },
        pageBack() {
            this.showList = false
            this.$refs.list.getList()
        },
        lookDetail(strategyId) {
            let url = this.Global.baseURL + this.Global.api.v2.autoStrategy_strategy
            let params = {
                strategyId,
                type: 'edit_detail'
            }

            this.$http.get(url, { params })
                .then(res => {
                    if (res.body.code.toString() === this.Global.RES_OK) {
                        console.log(res.body.data)
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                })
                .catch(err => {
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        }
    },
    components: {
        'list': List,
        'new-build': NewBuild
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
