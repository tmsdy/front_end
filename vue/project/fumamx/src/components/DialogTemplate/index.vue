<template>
    <!-- 插入开发信 -->
    <el-dialog v-dialogDrag :title="$t('mxpcweb.mail.1542798612467')" :visible.sync="dialogLook" :closeOnClickModal="false" custom-class="width920" :modal-append-to-body="false" v-loading="loading">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <!-- 基本样式 -->
            <el-tab-pane :label="$t('mxpcweb.am.1531896657391')" name="first"></el-tab-pane>
            <!-- 模板市场 -->
            <!-- <el-tab-pane :label="$t('mxpcweb.am.1531905866938')" name="second"></el-tab-pane> -->
        </el-tabs>
        <div class="list">
            <template v-if="activeName=='first'">
                <div class="paddingStyle">
                    <div class="modelBox" v-for="(item,index) in modelSelect" :key="index">
                        <div class="modelList">
                            <div class="modelContext" :style="{background:item.img}"></div>
                            <div class="mask">
                                <!-- 选择 -->
                                <el-button size="small" style="width:60px;" @click="toAddTemplateDrag(item.id)">{{$t('mxpcweb.am.1531896677609')}}</el-button>
                            </div>
                        </div>
                        <div class="modelName">{{item.name}}</div>
                    </div>

                </div>
            </template>
            <template v-if="activeName=='second'">
                <div class="paddingStyle">
                    1
                </div>
            </template>
        </div>

    </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
// import { isArray } from '@/libs/utils.js'
export default {
    name: 'DialogTemplate',
    props: {
    },
    data() {
        return {
            activeName: 'first',
            dialogLook: false,
            loading: false,
            selectValue: '',
            modelSelect: [
                // {
                //     id: '0',
                //     img: 'white',
                //     name: '空白'
                // },
                {
                    id: '1',
                    img: 'url(/static/images/amTemplateImg/1.png)',
                    // 一列
                    name: this.$t('mxpcweb.am.1531896698379')
                }, {
                    id: '2',
                    img: 'url(/static/images/amTemplateImg/2.png)',
                    // 两列
                    name: this.$t('mxpcweb.am.1531896710823')
                }, {
                    id: '3',
                    img: 'url(/static/images/amTemplateImg/3.png)',
                    // 两列与图片1
                    name: this.$t('mxpcweb.am.1531896729408')
                }, {
                    id: '4',
                    img: 'url(/static/images/amTemplateImg/4.png)',
                    // 两列与图片2
                    name: this.$t('mxpcweb.am.1531896742140')
                }, {
                    id: '5',
                    img: 'url(/static/images/amTemplateImg/5.png)',
                    // 三列
                    name: this.$t('mxpcweb.am.1531896757719')
                }]

        }
    },
    computed: {
        ...mapGetters(['company'])
    },
    methods: {
        handleClick(tab, event) {
            console.log(tab)
            console.log(event)
        },
        openShow() {
            this.dialogLook = true
        },
        toAddTemplateDrag(id) {
            this.$emit('toAddTemplateDrag', id)
            this.dialogLook = false
        }

    },
    watch: {
    },
    components: {
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
.list {
    padding: 30px 30px 10px 30px;
    display: inline-block;
    width: 100%;
    .listBox {
        padding: 10px 0;
        .listName {
            display: inline-block;
            width: 106px;
            font-size: 14px;
            color: RGBA(96, 98, 102, 1);
        }
    }
    .paddingStyle {
        .modelBox {
            //   border: 1px red solid;
            float: left;
            width: 200px;
            height: 280px;
            font-size: 12px;
            word-wrap: break-word;
            margin-right: 50px;
            .modelList {
                height: 240px;
                padding: 10px;
                border: 1px solid rgba(228, 228, 228, 1);
                position: relative;
                .modelContext {
                    width: 100%;
                    height: 100%;
                }
                .mask {
                    display: none;
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    text-align: center;
                    background-color: rgba(208, 2, 27, 0.1);
                    line-height: 240px;
                }
            }
            &:hover {
                .mask {
                    display: inline;
                }
            }
            .modelName {
                height: 36px;
                line-height: 36px;
                text-align: center;
            }
        }
    }
}
</style>
