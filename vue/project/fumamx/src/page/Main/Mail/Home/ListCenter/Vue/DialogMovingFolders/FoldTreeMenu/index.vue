<template>
    <li class="MenuLi">
        <h3 @click="treeItemClick(treeData.boxId)" style="cursor:pointer">
            <i v-if="isFolder" @click="toggle" class="iconfont" :class="[open ? 'icon-arrow-down': 'icon-arrow-right']"></i>
            <span class="label">
                <span class="labelColor">{{treeData.boxName}}</span>
            </span>
            <span class="T_set" v-if="possibleChoose(Types,treeData.boxId,currentId,treeData.boxPath)">
                <i class="iconfont icon-hook"></i>
            </span>

        </h3>
        <ul class="T_down" v-show="open||isOpen" v-if="isFolder">
            <fold-tree-menu v-for="(item,index) in treeData.child" :key="index" :treeData="item" :Types="Types" :currentId="currentId"></fold-tree-menu>
        </ul>
    </li>
</template>
<script>
/**
 * 描述：邮件部分
 * 作者：向士健(CSS) / ***(API)
 * 时间：2017/11/11
 */
// import $ from 'jquery'
import { mapGetters, mapMutations } from 'vuex'
export default {
    name: 'FoldTreeMenu',
    props: ['treeData', 'Types', 'currentId', 'isOpen'],
    data() {
        return {
            open: false,
            text: '',
            blg: true
        }
    },
    mounted() {
    },
    computed: {
        isFolder() {
            return this.treeData.child && this.treeData.child.length
        },
        ...mapGetters('mail', [
            'typeMoving'
        ])
    },
    methods: {
        // 点击文件夹项item高亮
        treeItemClick(boxId) {
            if (this.blg) {
                this.set_checkedBoxid(boxId)
            } else {
                this.set_checkedBoxid(-100)
            }
            let $this = $(event.target)
            $this.parents('.dialogBody').find('.active').removeClass('active')
            let tag = event.target.tagName
            if (tag === 'H3') {
                $this.addClass('active')
            } else {
                $this.parents('h3').addClass('active')
            }

            // console.log($('H3').find('.active'))
            // $('H3').find('.active').removeClass('active')
            // console.log($('H3').find('.active'))
        },
        removeClass() {
            // let $this = $(event.target)
            $('H3').find('.active').removeClass('active')
        },
        // 展开子菜单
        toggle: function () {
            if (this.isFolder) {
                this.open = !this.open
            }
        },
        ...mapMutations('mail', {
            set_checkedBoxid: 'SET_CHECKEDBOXID'
        }),
        // 是否可以选择
        possibleChoose(type, boxid, crtId, boxPath) {
            if (type == '1') { // 文件夹  文件夹不可以移动 0\3\4\5\6 \(本身以及本文件夹的子文件夹)
                if (boxid == 0 || boxid == 3 || boxid == 4 || boxid == 5 || boxid == 6 || boxid == parseInt(crtId)) {
                    this.blg = false
                } else {
                    let arrys = boxPath.toString().split('/')
                    for (let i = 0; i < arrys.length; i++) {
                        if (arrys[i] == parseInt(crtId)) {
                            this.blg = false
                            break
                        }
                    }
                }
            } else { // 邮件 邮件不可以移动到  3\5 (我的邮件下面)
                if (boxid == 3 || boxid == 5 || boxid == -1) {
                    this.blg = false
                }
            }
            return this.blg
        }

    }
}
</script>

<style lang="less" rel="stylesheet/less">
li.MenuLi {
  padding-left: 15px;
  > h3 {
    //此 h3 为新增的效果
    .T_set {
      .icon-hook {
        color: RGBA(208, 2, 27, 1);
        font-weight: bold;
      }
    }
    &.active {
      .T_set {
        display: block;
      }
    }
  }
  //以下为复制左菜单的
  > h3 {
    border-top: 1px solid #fff;
    font-weight: normal;
    font-size: 14px;
    padding-left: 17px;
    white-space: nowrap;
    cursor: default;
    position: relative;
    > i.iconfont {
      display: block;
      width: 23px;
      height: 100%;
      text-align: center;
      font-size: 12px;
      color: #666;
      position: absolute;
      left: 0;
      top: 0;
      &:hover {
        color: #008cee;
        cursor: pointer;
      }
    }
    > span.label {
      position: relative;
      z-index: 1;
      > em {
        font-size: 12px;
        font-style: normal;
        color: #888;
        margin-left: -2px;
      }
      .labelColor {
        border-radius: 3px;
        padding: 1px 3px;
      }
    }
    span.T_set {
      display: none;
      height: 35px;
      line-height: 35px;
      position: absolute;
      top: 50%;
      margin-top: -17px;
      right: 10px;
      z-index: 2;
      > i.iconfont {
        display: inline-block;
        padding: 0 2px;
        font-size: 13px;
        &:hover {
          color: #008cee;
          cursor: pointer;
        }
      }
      .el-dropdown {
        i.iconfont {
          font-size: 13px;
          font-weight: bold;
        }
      }
    }
    &.active {
      // border:1px solid red;
      &::before {
        content: "";
      }
    }
    &:hover {
      background-color: #ddd;
      // border: 1px green solid;
      &::before {
        content: "";
      }
      span.T_set {
        display: block;
      }
    }
    &::before {
      content: none;
      // background-color: #f60;
      background: rgba(252, 242, 243, 1);
      position: absolute;
      left: 0;
      margin-left: -100px;
      top: 0;
      right: 0;
      bottom: 0;
    }
  }
}
</style>
