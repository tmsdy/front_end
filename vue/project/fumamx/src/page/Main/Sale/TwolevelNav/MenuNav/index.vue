<template>
    <div class="TwolevelNavs MXscroll">
        <loading v-if="!list.length"></loading>
        <div class="MenuNav">
            <ul class="menuBox" v-for="(item,index) in list" :key="index">
                <template v-if="item.display">
                    <template v-if="item.moduleCode == 'SC001' || item.moduleCode == 'SC002'">
                        <item :item="item"></item>
                    </template>
                    <router-link v-else tag="li" :to="item.uRI" :data-href="item.uRI" class="menuItem">
                        <div class="itemTitle">
                            <i class="iconfont" v-bind:class="item.iconURI"></i>
                            <span class="text" :title="item.display">{{item.display}}</span>
                        </div>
                    </router-link>
                </template>
            </ul>
        </div>
    </div>
</template>

<script>
import Loading from '@/basecomponents/Loading/index'
import Item from './Item/index'
export default {
  name: 'MenuNav',
  props: {
    list: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
        loadingMenu: true
    }
  },
  created () {
  },
  methods: {
  },
  components: {
    'loading': Loading,
    'item': Item
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>

.TwolevelNavs {
    width: 100%;
    padding: 12px 0;
    background-color: #fff;
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    bottom: 60px;
    overflow-y: auto;
    border-radius: 8px 0 0 0;
    box-shadow:4px 0px 5px 0px rgba(0,0,0,0.05);
    .MenuNav {
        // border: 1px solid red;
        position: relative;
        margin-top: 8px;
        ul.menuBox {
            width: 100%;
            position: relative;
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
                    .iconfont:nth-child(1) {
                        float: left;
                        width: 30px;
                        text-align: center;
                        margin: 0 9px 0 12px;
                        font-size: 16px;
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
                .itemTitle:hover,
                &.router-link-active .itemTitle {
                    background: rgba(208, 2, 27, 0.05);
                    border-left-color: #D0021B;
                    cursor: pointer;
                    .iconfont,
                    .text {
                        color: #D0021B;
                    }
                }
            }
        }
    }
}
</style>
