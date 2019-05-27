<template>
    <div class="treeComponent">
        <menu-component :style="styleObject" @operation="operation" :showNode="showNode"></menu-component>
        <div class="companyTitle" ref="companyTitle" @click="companyTitle()">
            <span class="companyIcon">
                <i class="iconfont icon-company-set"></i>
            </span>
            <span class="text ellipsis" :title="companyBasicInfo.name">{{ companyBasicInfo.name }}</span>
            <i class="iconfont icon-more menu" data-nodeName="companyTitleOpenMenu" ></i>
        </div>
        <ul class="tree" ref="tree">
            <li v-for="(item,index) in list" :key="index">
                <div class="list One" data-isOff="on" @click="openOne($event,item)">
                    <!-- 有子元素 -->
                    <template v-if="item.children.length">
                        <span class="iconBackground">
                            <i class="iconfont icon-plus-file oneIcon"></i>
                        </span>
                        <span :title="item.deptName" class="text">{{ substr(item.deptName,10) }}</span>
                        <i class="iconfont icon-more menu" data-nodeName="openMenu" :data-dCode="item.dCode" :data-deptName="item.deptName" v-if="item.dCode != '-1' && item.dCode != '-2'"></i>
                    </template>
                    <!-- 没有子元素 -->
                    <template v-else-if="item.children.length == 0 && item.dCode != '-2'">
                        <span :title="item.deptName" style="margin-left: 54px;" class="text">{{ substr(item.deptName,10) }}</span>
                        <i class="iconfont icon-more menu" data-nodeName="openMenu" :data-dCode="item.dCode" :data-deptName="item.deptName" v-if="item.dCode != '-1' && item.dCode != '-2'"></i>
                    </template>
                    <!-- 禁用 -->
                    <template v-else-if="item.dCode == '-2'">
                        <i class="iconfont icon-disabled disabled"></i>
                        <span :title="item.deptName" class="text">{{ substr(item.deptName,10) }}</span>
                        <i class="iconfont icon-more menu" data-nodeName="openMenu" :data-dCode="item.dCode" :data-deptName="item.deptName" v-if="item.dCode != '-1' && item.dCode != '-2'"></i>
                    </template>
                </div>
                <ul v-if="item.children.length != 0">
                    <li v-for="(item,index) in item.children" :key="index">
                        <div class="list Two" data-isOff="on" @click="open($event,item)">
                            <template v-if="item.children.length">
                                <i class="iconfont icon-page-right Arrow" style="margin-left: 47px;"></i>
                                <span :title="item.deptName">{{ substr(item.deptName,8) }}</span>
                                <i class="iconfont icon-more menu" data-nodeName="openMenu" :data-dCode="item.dCode" :data-deptName="item.deptName"></i>
                            </template>
                            <template v-else>
                                <span :title="item.deptName" style="margin-left: 67px;">{{ substr(item.deptName,8) }}</span>
                                <i class="iconfont icon-more menu" data-nodeName="openMenu" :data-dCode="item.dCode" :data-deptName="item.deptName"></i>
                            </template>
                        </div>
                        <ul v-if="item.children.length != 0">
                            <li v-for="(item,index) in item.children" :key="index">
                                <div class="list Three" data-isOff="on" @click="open($event,item)">
                                    <template v-if="item.children.length">
                                        <i class="iconfont icon-page-right Arrow" style="margin-left: 60px;"></i>
                                        <span :title="item.deptName">{{ substr(item.deptName,7) }}</span>
                                        <i class="iconfont icon-more menu" data-nodeName="openMenu" :data-dCode="item.dCode" :data-deptName="item.deptName"></i>
                                    </template>
                                    <template v-else>
                                        <span :title="item.deptName" style="margin-left: 80px;">{{ substr(item.deptName,7) }}</span>
                                        <i class="iconfont icon-more menu" data-nodeName="openMenu" :data-dCode="item.dCode" :data-deptName="item.deptName"></i>
                                    </template>
                                </div>
                                <ul v-if="item.children.length != 0">
                                    <li v-for="(item,index) in item.children" :key="index">
                                        <div class="list Four" data-isOff="on" @click="open($event,item)">
                                            <template v-if="item.children.length">
                                                <i class="iconfont icon-page-right Arrow" style="margin-left: 73px;"></i>
                                                <span :title="item.deptName">{{ substr(item.deptName,6) }}</span>
                                                <i class="iconfont icon-more menu" data-nodeName="openMenu" :data-dCode="item.dCode" :data-deptName="item.deptName"></i>
                                            </template>
                                            <template v-else>
                                                <span :title="item.deptName" style="margin-left: 93px;">{{ substr(item.deptName,6) }}</span>
                                                <i class="iconfont icon-more menu" data-nodeName="openMenu" :data-dCode="item.dCode" :data-deptName="item.deptName"></i>
                                            </template>
                                        </div>
                                        <ul v-if="item.children.length != 0">
                                            <li v-for="(item,index) in item.children" :key="index">
                                                <div class="list Five" data-isOff="on" @click="open($event,item)">
                                                    <span :title="item.deptName" style="margin-left: 107px;">{{ substr(item.deptName,6) }}</span>
                                                    <i class="iconfont icon-more menu" data-nodeName="openMenu" :data-dCode="item.dCode" :data-deptName="item.deptName"></i>
                                                </div>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>
<script>
import menuComponent from './menuComponent.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'tree',
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
      styleObject: {
        top: 40 + 'px',
        left: 0 + 'px',
        display: 'none'
      },
      operationData: {
        title: '',
        dCode: ''
      },
      currentTarget: '',
      showNode: {}
    }
  },
  computed: {
    ...mapGetters([
      'companyBasicInfo'
    ])
  },
  mounted () {
    let _this = this
    setTimeout(() => {
      $('body').on('click', function () {
        _this.scrollTop = $(this.$el).parents('.navBox').scrollTop()// 消除显示菜单误差
        // 点击的是菜单
        if ($(event.target || event.srcElement).attr('data-nodeName') == 'openMenu') {
          _this.showNode = {
            add: true,
            edit: true,
            delete: true
          }
          _this.showMenu(event)
          // 点击的是公司名称树菜单
        } else if ($(event.target || event.srcElement).attr('data-nodeName') == 'companyTitleOpenMenu') {
          _this.showNode = {
            add: true,
            edit: false,
            delete: false
          }
          _this.showMenu(event)
          // 不是菜单
        } else {
          _this.hideMenu(event)
        }
      })
      _this.init()
    }, 20)
  },
  methods: {
    init () {
      var _this = this
      // 给公司添加默认高亮样式
      $(this.$refs.companyTitle).addClass('action')
      this.$emit('treeOpen', {
        'createDate': 1502899200000,
        'ctid': '0',
        'dCode': '0',
        'deptName': _this.companyBasicInfo.name,
        'modifyDate': 1502899200000,
        'sortorder': '0'
      })
      // 标题为公司名称
      this.operationData.title = _this.companyBasicInfo.name
      // dCode默认为"0"
      this.operationData.dCode = '0'
    },
    companyTitle () {
      var _this = this
      $(this.$refs.companyTitle).addClass('action')
      $(this.$el).find('.list').removeClass('action')
      this.$emit('treeOpen', {
        'createDate': 1502899200000,
        'ctid': '0',
        'dCode': '0',
        'deptName': _this.companyBasicInfo.name,
        'modifyDate': 1502899200000,
        'sortorder': '0'
      })
      this.operationData.title = _this.companyBasicInfo.name
      this.operationData.dCode = '0'
    },
    // 移除高亮样式
    removeAction () {
      if (this.currentTarget != '') {
        this.currentTarget.removeClass('action')
      }
    },
    openOne (event, item) {
      this.$emit('treeOpen', item)
      // 移除公司高亮样式
      $(this.$refs.companyTitle).removeClass('action')
      // 给当前点击元素高亮
      $(this.$el).find('.list').removeClass('action')
      this.currentTarget = $(event.currentTarget).addClass('action')
      // 切换
      if (this.currentTarget.attr('data-isoff') === 'on') {
        this.currentTarget.attr('data-isoff', 'yes')
        this.currentTarget.find('.oneIcon').removeClass('icon-plus-file').addClass('icon-minus')
        this.currentTarget.next().show()
      } else {
        this.currentTarget.attr('data-isoff', 'on')
        this.currentTarget.find('.oneIcon').removeClass('icon-minus').addClass('icon-plus-file')
        this.currentTarget.next().hide()
      }
    },
    open (event, item) {
      this.$emit('treeOpen', item)
      // 移除公司高亮样式
      $(this.$refs.companyTitle).removeClass('action')
      // 给当前点击元素高亮
      $(this.$el).find('.list').removeClass('action')
      this.currentTarget = $(event.currentTarget).addClass('action')
      if (this.currentTarget.children('i').length > 1 && event.target.className.indexOf('menu') == -1) { // 有子元素，并且不是-1
        if (this.currentTarget.attr('data-isOff') == 'on') { // 默认状态关闭
          this.currentTarget.attr('data-isOff', 'off')// 点击展开
          this.currentTarget.children('i').eq(0).removeClass('icon-page-right').addClass('icon-page-down')
          this.currentTarget.next().show()
        } else {
          this.currentTarget.attr('data-isOff', 'on')// 合并
          this.currentTarget.children('i').eq(0).removeClass('icon-page-down').addClass('icon-page-right')
          this.currentTarget.next().hide()
        }
      }
    },
    // 显示菜单
    showMenu (event) {
      var title = $(event.target || event.srcElement).attr('data-deptName')
      var dCode = $(event.target || event.srcElement).attr('data-dCode')
      if (title && dCode) {
        this.operationData.title = title
        this.operationData.dCode = dCode
      }
      this.styleObject = {
        top: event.clientY - 105 + 'px',
        left: '115px',
        display: 'block'
      }
    },
    // 隐藏菜单
    hideMenu (event) {
      this.styleObject = {
        display: 'none'
      }
    },
    // 添加部门
    operation (action) {
      Object.assign(this.operationData, {'action': action})
      // console.log(this.operationData);
      this.$emit('operation', this.operationData)
    },
    substr (str, len = 1) {
      return str.length > len ? str.substr(0, len - 1) + '...' : str
    }
  },
  components: {
    'menu-component': menuComponent
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.treeComponent {
    margin-top: 11px;
    margin-bottom: 11px;
    position: relative;
    //字体图标
    .menu{
        display: none;
        float: right;
        font-size: 12px;
        margin-right: 10px;
    }
    .text{
        max-width: 105px;
        display: inline-block;
        overflow: hidden;
        vertical-align:top;
        font-weight: bold;
    }
    .companyTitle{
        height: 32px;
        line-height: 32px;
        font-size: 15px;
        padding-left: 22px;
        // border-left: 2px transparent solid;
        cursor: pointer;
        .companyIcon {
            display: inline-block;
            width: 16px;
            height: 16px;
            line-height: 16px;
            margin-right: 10px;
            text-align: center;
            background:linear-gradient(135deg,rgba(255,105,124,1),rgba(208,2,27,1));
            border-radius: 50%;
            i{
                font-size: 12px;
                color: #ffffff;
                display: block;
                transform:scale(0.8) translateY(0px);
            }
        }
    }
    .companyTitle:hover{
        background-color: #fafafa;
    }
    .action{
        background-color: #fafafa;
        // border-left-color: #D83044;
        color:rgba(208,2,27,1);
    }
    .tree {
        width: 100%;
        position: relative;
        >li{
            margin-top: 1px;
        }
        .Arrow {
            font-size: 12px;
            margin-right: 3px;
        }
        .open {
            width: 150px;
            height: 200px;
            background-color: red;
            position: absolute;
            left: 0px;
            top: 0px;
        }
        ul {
            display: none;
        }
        .list {
            height: 32px;
            line-height: 32px;
            border-left: 2px solid transparent;
            position: relative;
            cursor: pointer;
            span {
                font-size: 14px;
            }
            .iconBackground {
                display: inline-block;
                width: 16px;
                height: 16px;
                line-height: 15px;
                margin-left: 22px;
                margin-right: 10px;
                text-align: center;
                background:linear-gradient(135deg,rgba(255,105,124,1),rgba(208,2,27,1));
                border-radius: 50%;
                i{
                    font-size: 12px;
                    color: #ffffff;
                }
            }
            .disabled {
                color: red;
                margin-left: 25px;
                margin-right: 11px;
                font-weight: bold;
                font-size: 15px;
            }
        }
        .list:hover {
            background-color: #fafafa;
            .menu{
                display: block;
            }
        }
        .action{
            background-color: #FCF2F3;
            border-left-color: #D83044;
            color:rgba(208,2,27,1);
            .menu{
                display: block;
            }
        }
        .One{
            .text{
                font-weight: bold;
            }
        }
    }
}
</style>
