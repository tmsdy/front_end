<template>
    <div class="ShortcutMenu">

        <div class="icoFlower transition_all" @click="showMenuBody"  :class="isActive ? 'iconActive' : ''">
            <i class="iconfont icon-plus-file"></i>
        </div>

        <transition name="slide-fade">
            <div class="menuBody" v-show="isActive">
                <span v-if="isContact" class="text-hover shortSet" :title="$t('mxpcweb.workbench.1530670791669')" @click="clickLi('setShort')">
                    <i class="iconfont icon-setting"></i>
                </span>
                <h4>
                  <!--快捷操作-->
                  {{$t('mxpcweb.components.1530841431334')}}
                </h4>
                <ul>
                    <li v-for="(item,index) in list" :key="index" v-if="item.showFlag" @click="clickLi(item)">
                        <i class="iconfont icon-plus-file"></i>
                        <span>{{item.caption}}</span>
                    </li>
                </ul>
            </div>
        </transition>

    </div>
</template>

<script>

/**
 * 描述：通用=>顶部快捷菜单
 * 作者：向士健
 * 时间：2017/7/1
 */
export default {
  name: 'ShortcutMenu',
  props: {

  },
  data () {
    return {
      isActive: false,
      list: [],
      isContact: false
    }
  },
  created () {
    this.getShortcutMenu()
    this.contactCheck()
  },
  methods: {

    // 点击控制弹窗呈现
    showMenuBody: function () {
      this.isActive = !this.isActive
      this.getShortcutMenu()
      // 点击其他隐藏
      document.addEventListener('click', (e) => {
        if (!this.$el.contains(e.target)) this.isActive = false
      })

      // 以下两行测试用，方便取token请暂不要删除
      console.log('individualAccessToken: ' + this.getToken()[this.Global.individualAccessToken])
      console.log('accessToken: ' + this.getToken()[this.Global.accessToken])
    },
    contactCheck () {
      let _this = this
      _this.$http.get(this.Global.baseURL + this.Global.api.v2.contact_do, {
        params: {
          type: 'isAdmin'
        }
      }).then(function (res) {
        if (res.body.code.toString() == _this.Global.RES_OK) {
          if (res.body.data.isAdmin) {
            _this.isContact = true
          } else {
            _this.isContact = false
          }
        } else {
          _this.$message.error(_this.msg(res.body))
        }
      }, function (res) {
        // _this.loading = false;
        _this.$message.error(_this.$t(_this.Global.errorTitle))
      })
    },
    // 获取快捷导航API数据
    getShortcutMenu () {
      let _this = this
      let url = this.Global.baseURL + this.Global.api.v2.homeQuickOptSet_do
      this.$http.get(url, { params: {} }).then(function (res) {
        if (res.body.code.toString() == _this.Global.RES_OK && res.body.data) {
          _this.list = res.body.data
        } else {
          _this.list = []
        }
      }, function (res) {
        _this.$message.error(_this.$t(_this.Global.errorTitle))
      })
    },
    // 点击不是url导航的链接
    clickLi (str) {
      let _this = this
      _this.isActive = false
      try {
        _this.$emit('clickMenu', str)
      } catch (e) {
        console.log(" this.emit('clickMenu',str);  error!")
      }
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
