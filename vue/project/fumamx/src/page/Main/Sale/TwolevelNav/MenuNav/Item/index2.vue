<template>
<li class="menuItem">
    <div class="itemTitle" @click="$router.push(item.uRI)">
        <i class="iconfont" v-bind:class="item.iconURI"></i>
        <span class="text" :title="item.display">
            {{item.display}}
        </span>
        <!-- <span class="iconOpt"> -->
            <!-- <i class="iconfont" :class="show ? 'icon-arrow-up' : 'icon-arrow-down'" style="font-size:12px;" @click.stop="show = !show"></i> -->
            <!-- <i class="iconfont icon-arrow-up" style="font-size:12px;" @click.stop="show = true"></i> -->
        <!-- </span> -->
    </div>
    <div v-show="show" class="mySearchBox">
        <li tag="li" class="menuItem">
            <div class="itemTitle padding-left40">
                <span class="text" :title="'所有' + title">
                   所有{{title}}
                </span>
            </div>
        </li>
        <li class="menuItem">
            <div class="itemTitle padding-left40">
                <span class="text" title="星标置顶">
                   星标置顶
                </span>
            </div>
        </li>
        <li class="menuItem">
            <div class="itemTitle padding-left40">
                <span class="text" :title="'我的' + title">
                   我的{{title}}
                </span>
            </div>
        </li>
        <li class="menuItem">
            <div class="itemTitle padding-left40">
                <span class="text" title="快速查询1">
                   快速查询1
                </span>
            </div>
        </li>
        <div class="addSeach text-hover" @click="addSearch()">
            新建快速查询
            <span class="add">+</span>
        </div>
        <!-- <div class="text-hover" :class="seachCheck == '1' ? 'seachCheck' : 'seachList'" @click="seachCheck = '1'">所有{{title}}</div>
        <div class="text-hover" :class="seachCheck == '2' ? 'seachCheck' : 'seachList'" @click="seachCheck = '2'">星标置顶</div>
        <div class="text-hover" :class="seachCheck == '3' ? 'seachCheck' : 'seachList'" @click="seachCheck = '3'">我的{{title}}</div>
        <div class="text-hover" :class="seachCheck == '4' ? 'seachCheck' : 'seachList'" @click="seachCheck = '4'">快速查询1</div>
        <div class="addSeach text-hover" @click="addSearch()">
            新建快速查询
            <span class="add">+</span>
        </div> -->
    </div>
</li>
</template>

<script>
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
            title: '',
            show: true,
            seachCheck: ''
        }
    },
    created () {
    },
    mounted () {
        this.getTitle(this.item)
    },
    methods: {
        getTitle(val) {
            this.title = ''
            if (val) {
                if (val.moduleCode == 'SC001') {
                    this.title = '报价'
                } else if (val.moduleCode == 'SC002') {
                    this.title = '订单'
                }
            }
        },
        addSearch() {
            ep.emit('optClick', {
                optData: {
                    optModuleCode: this.item.moduleCode,
                    optCode: 'customSearch'
                }
            })
        }
    },
    components: {
    },
    watch: {
            item(val) {
            this.getTitle(val)
            }
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
    li.menuItem {
        position: relative;
        >.itemTitle {
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
            .iconfont:nth-child(1) {
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
            >.pull-right {
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
        .padding-left40{
            padding-left: 56px;
        }
        .mySearchBox>.seachList:hover, .itemTitle:hover,
        &.router-link-active .itemTitle {
            background: rgba(208, 2, 27, 0.05);
            border-left-color: #D0021B;
            cursor: pointer;
            .iconfont,
            .text {
                color: #D0021B;
            }
        }
        .mySearchBox{
            .seachList, .seachCheck, .addSeach{
                height: 32px;
                line-height: 32px;
                padding-left: 62px;
            }
            .seachCheck{
                background: rgba(208, 2, 27, 0.05);
                color: #D0021B;
            }
            .addSeach{
                position: relative;
                color: #008CEE;
                padding-left: 59px;
                .add{
                    position: absolute;
                    left: 49px;
                }
            }
        }
    }
</style>
