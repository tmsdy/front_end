<template>
    <div class="MenuNav">
        <ul class="menuBox" v-for="(item,index) in list" :key="index">

            <router-link tag="li" :to="item.uRI" :data-href="item.uRI" class="menuItem" v-if="item.display">
                <div class="itemTitle">
                    <i class="iconfont" v-bind:class="item.iconURI"></i>
                    <span class="text" :title="item.display">{{item.display}}</span>
                </div>
            </router-link>

            <li class="menuItem" v-if="item.subNavis.length">
                <div class="itemTitle" data-isOpen="yes" @click="twoleveOpen($event,item.subNavis)">
                    <i class="iconfont icon-mail"></i>
                    <span class="text" :title="item.groupName">{{item.groupName}}</span>
                    <i class="iconfont icon-page-down pull-right"></i>
                </div>
                <div>
                    <router-link tag="li" :to="item.uRI" :data-href="item.uRI" class="menuItem" v-for="(item,index) in item.subNavis" :key="index">
                        <div class="itemTitle" style="padding-left:60px;">
                            <span class="text" :title="item.display">{{item.display}}</span>
                        </div>
                    </router-link>
                </div>
            </li>

        </ul>
    </div>
</template>

<script>
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
    }
  },
  created () {

  },
  methods: {
    twoleveOpen (event, list) {
      if (list.length === 0) {
        return
      }
      let $target = $(event.target)
      let isOpen = $target.attr('data-isOpen')
      if (isOpen === 'no') {
        $target.attr('data-isOpen', 'yes')
        $target.next().show()
        $target.find('.pull-right').removeClass('icon-page-right').addClass('icon-page-down')
        // this.$router.push(list[0].uRI);
      } else if (isOpen === 'yes') {
        $target.attr('data-isOpen', 'no')
        $target.next().hide()
        // $target.find(".icon-arrow-right").removeClass("arrow-right90");
        $target.find('.pull-right').removeClass('icon-page-down').addClass('icon-page-right')
      }
    }
  },
  components: {
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
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
                color: #606266;
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
</style>
