<template>
<li tag="li" class="menuItem">
    <div class="itemTitle" @click="show = !show">
        <i class="iconfont" v-bind:class="item.iconURI"></i>
        <span class="text" :title="item.display">
            {{item.display}}
        </span>
        <span class="iconOpt">
            <!-- <i class="iconfont" :class="show ? 'icon-arrow-up' : 'icon-arrow-down'" style="font-size:12px;" @click.stop="show = !show"></i> -->
            <!-- <i class="iconfont icon-arrow-up" style="font-size:12px;" @click.stop="show = true"></i> -->
        </span>
    </div>
    <div v-show="show" class="mySearchBox">
        <div v-for="(items, index) in list" :key="index" class="text-hover ellipsis" :class="$route.path.indexOf(item.uRI) != -1 && seachCheck == index ? 'seachCheck' : 'seachList'" @click="seachCheckClick(items, index)">
            <span :title="items.searchFilterName">{{items.searchFilterName}}</span>
            <div class="iconfontBox text-right" v-if="items.sysOrderNum == 100">
                <!-- <i class="iconfont icon-move-up" title="上移" style="font-size:12px;" @click.stop></i> -->
                <!-- <i class="iconfont icon-move-down" title="下移" style="font-size:12px;" @click.stop></i> -->
                <!-- <i class="iconfont icon-edit" title="修改" style="font-size:12px;" @click.stop="editItems(items)"></i> -->
                <i class="iconfont icon-del" title="删除" style="font-size:12px;" @click.stop="deleteItems(items)"></i>
            </div>
        </div>
        <div class="addSeach ellipsis text-hover" @click="addSearch()">
            新建快速查询
            <span class="add">+</span>
        </div>
    </div>
</li>
</template>

<script>
import { getBillParameterList } from '@/page/Main/Client/mixins/index.js'
import { mapGetters, mapMutations } from 'vuex'
export default {
    name: 'MenuNav',
    props: {
        item: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data () {
        return {
            list: [],
            show: false,
            seachCheck: '0'
        }
    },
    created () {
    },
    mounted () {
        this.getTitle()
    },
    methods: {
        // 同步设置
        ...mapMutations('client', {
            set_billParameterList: 'SET_BILLPARAMETERLIST',
            set_billParameter: 'SET_BILLPARAMETER'
        }),
        getBillParameterList,
        seachCheckClick(item, index) {
            this.$router.push(this.item.uRI)
            if (item) {
                this.seachCheck = index
                let obj = JSON.parse(JSON.stringify(item))
                this.set_billParameter(obj)
            } else {
                if (this.list.length > 0) {
                    this.seachCheck = '0'
                } else {
                    this.seachCheck = ''
                }
                this.set_billParameter({})
            }
        },
        getTitle(upData) {
            this.title = ''
            if (this.item) {
                if (this.item.moduleCode == 'SC001') {
                    this.title = '报价'
                } else if (this.item.moduleCode == 'SC002') {
                    this.title = '订单'
                }
                this.getBillParameterList(this.item.moduleCode, (data) => {
                    this.list = data.list
                }, upData)
                if (this.item.moduleCode == this.$route.params.moduleCode) {
                    this.show = true
                }
            }
        },
        addSearch() {
            ep.emit('optClick', {
                optData: {
                    optModuleCode: this.item.moduleCode,
                    optCode: 'customSearch'
                },
                next: () => {
                    this.getTitle(true)
                }
            })
        },
        editItems(item) {
            ep.emit('optClick', {
                optData: {
                    optModuleCode: this.item.moduleCode,
                    optCode: 'customSearch'
                },
                next: () => {
                    this.getTitle(true)
                },
                itemData: item
            })
        },
        deleteItems(item) {
            this.$confirm('是否删除此快捷搜索--' + item.searchFilterName, this.$t('mxpcweb.client.1529047715824'), {
                confirmButtonText: this.$t('mxpcweb.client.1529047741736'),
                cancelButtonText: this.$t('mxpcweb.client.1529047588840'),
                type: 'warning'
            }).then(() => {
                ep.emit('setGlobalLoading', {
                    val: true,
                    // 操作进行中
                    text: this.$t('mxpcweb.client.list.1550126273298') + '...'
                })
                this.$http.delete(this.Global.baseURL + this.Global.api.v2.document_searchListFilter_delete, {
                    params: {
                        searchFilterId: item.searchFilterId,
                        moduleCode: item.moduleCode,
                        strucId: '1'
                    }
                }).then((res) => {
                    ep.emit('setGlobalLoading', {
                        val: false,
                        text: ''
                    })
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.$message.success(this.msg(res.body))
                        this.getBillParameterList(this.item.moduleCode, (data) => {
                            this.list = data.list
                        }, true)
                    } else {
                        this.getBillParameterList(this.item.moduleCode, (data) => {
                            this.list = data.list
                        }, true)
                        this.$message.error(this.msg(res.body))
                    }
                }, (res) => {
                    ep.emit('setGlobalLoading', {
                        val: false,
                        text: ''
                    })
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
            }).catch(() => {
            })
        }
    },
    computed: {
        ...mapGetters([
            'company'
        ]),
        ...mapGetters('client', [
            'billParameterList'
        ])
    },
    components: {
    },
    watch: {
        item(val) {
            this.getTitle()
        },
        $route() {
            if (this.item.moduleCode == this.$route.params.moduleCode) {
                this.show = true
            }
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
    li.menuItem {
        position: relative;
        .itemTitle {
            height: 32px;
            line-height: 32px;
            color: #626066;
            margin-bottom: 5px;
            border-left: 2px solid transparent;
            position: relative;
            z-index: 2;
            .text{
                // border: 1px solid red;
                display: inline-block;
                max-width: 150px;
                white-space:nowrap;
                text-overflow:ellipsis;
                overflow: hidden;
                position: relative;
                z-index: -1;
            }
            >.iconfont:nth-child(1) {
                float: left;
                width: 30px;
                text-align: center;
                margin: 0 6px 0 12px;
                font-size: 16px;
            }
            .iconOpt{
                display: inline-block;
                width: 12px;
                height: 32px;
                line-height: 32px;
                margin-left: 4px;
                position: relative;
                top: -11px;
            }
            .pull-right {
                width: 32px;
                height: 32px;
                line-height: 32px;
                text-align: center;
                margin-right: 8px;
                overflow: hidden;
                color: #909399;
            }
            // .arrow-right90 {
            //     transform: rotate(90deg);
            //     -ms-transform: rotate(90deg);
            //     -moz-transform: rotate(90deg);
            //     -webkit-transform: rotate(90deg);
            //     -o-transform: rotate(90deg);
            // }
        }
        .mySearchBox{
            transition: height 2s;
            -moz-transition: height 2s;
            -webkit-transition: height 2s;
            -o-transition: height 2s;
            .seachCheck{
                background: rgba(208, 2, 27, 0.05);
                border-left-color: #D0021B;
                cursor: pointer;
                color: #D0021B;
            }
            .seachList, .seachCheck, .addSeach{
                height: 32px;
                line-height: 32px;
                padding-left: 52px;
                padding-right: 60px;
                border-left: 2px solid white;
                margin-top: 4px;
                position: relative;
                .iconfontBox{
                    position: absolute;
                    right: 4px;
                    width: 60px;
                    display: none;
                }
                &:hover{
                    .iconfontBox{
                        display: inline;
                        padding-right: 10px;
                        >i{
                            color: #666;
                            &:hover{
                                color: #D0021B;
                            }
                        }
                    }
                }
            }
            .addSeach{
                position: relative;
                color: #008CEE;
                padding-left: 50px;
                padding-right: 6px;
                .add{
                    position: absolute;
                    left: 40px;
                }
            }
        }
        .mySearchBox>.seachList:hover, .itemTitle:hover,
        &.router-link-active .itemTitle, .mySearchBox>.seachCheck {
            background: rgba(208, 2, 27, 0.05);
            border-left-color: #D0021B;
            cursor: pointer;
            .iconfont,
            .text {
                color: #D0021B;
            }
        }
    }
</style>
