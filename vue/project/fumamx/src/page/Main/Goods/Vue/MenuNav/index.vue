<template>
    <div class="TwolevelNav MXscroll">
        <loading v-if="!list.length"></loading>
        <div class="MenuNav">
            <ul class="menuBox" v-for="(item,index) in list" :key="index">
                <router-link tag="li" :to="item.uRI" :data-href="item.uRI" class="menuItem" v-if="item.display">
                    <div class="itemTitle" @click="allClick()">
                        <i class="iconfont" v-bind:class="item.iconURI"></i>
                        <span class="text" :title="item.display">{{item.display}}</span>
                    </div>
                    <div v-if="item.moduleCode == 'PP001'" id="goodsTreeRootList">
                        <loading v-if="loadingMenu" :title="$t('mxpcweb.PP001.PP001List.1550125408926')"></loading>
                        <ul v-else class="treeRoot" v-for="(item,index) in rootData" :key="index">
                            <goods-tree :treeData="item" @click="treeItemClick" :activeId="activeId"></goods-tree>
                        </ul>
                    </div>
                </router-link>
            </ul>
        </div>
    </div>
</template>

<script>
import Loading from '@/basecomponents/Loading/index'
import goodsTree from '../goodsTree'
export default {
  name: 'MenuNav',
  props: {
    activeId: {
        type: String,
        default: ''
    },
    list: {
      type: Array,
      default: function () {
        return []
      }
    },
    rootData: {
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
      this.getData()
  },
  methods: {
    allClick () {
        this.$emit('setactiveId', '')
    },
    treeItemClick(item) {
        let activeId = item.catgId + '' || ''
        this.$emit('setactiveId', activeId)
    },
      getData() {
          // 先取左大类菜单
        this.loadingMenu = true
        this.$http.get(this.Global.baseURL + this.Global.api.v2.document_product_category, { params: {type: 'inUse'} }).then((res) => {
            this.loadingMenu = false
            if (res.body.code.toString() == this.Global.RES_OK) {
                this.$emit('setRootData', res.body.data.list || [])
                // if (this.rootData.length > 0) {
                //     if (!this.activeId || this.activeId == '') {
                //         this.treeItemClick(this.rootData[0]) // 首次，即空对象时，默认第一个高亮数据
                //     }
                // }
            } else {
                this.$emit('setRootData', [])
                this.treeItemClick({})
                this.$message.error(this.msg(res.body))
            }
        }, (res) => {
            this.$emit('setRootData', [])
            this.treeItemClick({})
            this.$message.error(this.$t(this.Global.errorTitle))
        })
      }
  },
  components: {
    'goods-tree': goodsTree,
    'loading': Loading
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>

.TwolevelNav {
    width: 230px;
    height: 100%;
    padding: 12px 0;
    background-color: #fff;
    position: absolute;
    z-index: 2;
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
                    .iconfont {
                        color: #DFE2E4;
                    }
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
