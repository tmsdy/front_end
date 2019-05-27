<template>
    <div class="ListVue">
        <div class="ListVueBox ellipsis">
            <span :title="SC003_3.followDesc + ' (' + timeShow_custom(SC003_3.followDate, 'MM-DD HH:mm') + ')'">
                <span class="people">{{returnRealName(SC003_3.createCtId)}}</span>
                <span class="content">{{SC003_3.followDesc}} ({{timeShow_custom(SC003_3.followDate, 'MM-DD HH:mm')}})</span>
            </span>
            <span class="iconOpt">
                <i class="iconfont text-hover" :class="show ? 'icon-arrow-up' : 'icon-arrow-down'" style="font-size:12px;" @click.stop="show = !show;getData()"></i>
            </span>
        </div>
        <div class="listBox" v-show="show">
            <div v-loading="loading" style="height:100%;">
                <template v-if="!loading">
                    <no-data v-if="list.length == 0" style="padding-top:10px;"></no-data>
                    <opt-list v-else :list="list"></opt-list>
                </template>
            </div>
            <span class="iconOpt">
                <i class="iconfont text-hover" :class="show ? 'icon-arrow-down' : 'icon-arrow-up'" style="font-size:12px;" @click.stop="show = !show;"></i>
            </span>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import OptList from './Vue/OptList'
import NoData from '@/basecomponents/NoData/index'
export default {
    name: 'ListVue',
    props: {
        SC003_3: {
            type: Object,
            default: () => {
                return {}
            }
        },
        useType: {
            type: String,
            default: '1'
        }
    },
    data() {
        return {
            show: false,
            list: [],
            loading: true
        }
    },
    created() {
    },
    mounted() {
    },
    computed: {
        ...mapGetters([
            'contactList'
        ])
    },
    methods: {
        getData() {
            if (this.SC003_3 && this.SC003_3.doctryId) {
                this.$http.get(this.Global.baseURL + this.Global.api.v2.document_documentaryNode_allList, {
                    params: {
                        moduleCode: 'SC003',
                        strucId: '2',
                        doctryId: this.SC003_3.doctryId
                    }
                }).then((res) => {
                    this.loading = false
                    if (res.body.code.toString() === this.Global.RES_OK && res.body.data) {
                        this.list = res.body.data.list || []
                    } else {
                        this.$message.error(this.msg(res.body))
                        this.list = []
                    }
                }, (res) => {
                    this.loading = false
                    this.list = []
                    this.$message.error(this.msg(res.body))
                })
            }
        },
        returnRealName(val) {
            if (val && val != '') {
                return this.contactList[val]
            }
            return ''
        }
    },
    components: {
        'opt-list': OptList,
        'no-data': NoData
    },
    beforeDestroy: () => {
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.ListVue{
    width:300px;
    height:24px;
    line-height: 24px;
    display: inline-block;
    margin-right: 20px;
    position: relative;
    padding-right: 30px;
    .ListVueBox{
        padding-left: 30px;
        .people{
            color: #222222;
            margin-right: 6px;
        }
        .content{
            color: #606266;
        }
        .iconOpt{
            display: none;
            position: absolute;
            right: 10px;
            color: #606266;
        }
    }
    &:hover{
        .iconOpt{
            display: inline;
        }
    }
    .listBox{
        position: absolute;
        top: 0px;
        width:300px;
        height:200px;
        background:white;
        box-shadow:0px 2px 5px 0px rgba(0,0,0,0.1);
        border-radius:2px;
        z-index: 2;
        padding: 4px 0px 4px;
        .iconOpt{
            position: absolute;
            top: 0px;
            right: 10px;
            color: #606266;
            z-index: 9999;
        }
    }
}
</style>
