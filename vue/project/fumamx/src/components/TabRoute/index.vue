<template>
    <div class="TabRoute" ref="TabRoute">
        <router-link tag="div" :to="fixedUrl" class="clientRouter text-center">
            <i class="iconfont titleIcon" :class="fixedIcon"></i>
            <div class="text">{{fixedTitle}}</div>
        </router-link>

        <router-link tag="div" :to="item.openUrl" class="clientRouter" v-for="(item,index) in navTabs" :key="index">
            <i class="iconfont icon-close" @click.prevent.self="close(item.openUrl,index)"></i>
            <div class="text">
                {{ item.title }}
            </div>
        </router-link>

        <div class="More" ref="More" v-show="isMore">
            <div class="text-center" @click="showMoreTab()">
                <i :class="[isShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down']"></i>
            </div>
            <transition name="slide-fade">
                <ul class="downList MXscroll" v-show="isShow">
                    <li v-for="(item,index) in moreList" :key="index" @click="exchangePosition(index)">
                        {{ item.title }}
                    </li>
                </ul>
            </transition>
        </div>
    </div>
</template>

<script>

export default {
  name: 'TabRoute',
  props: {
    // 固定导航的URL
    fixedUrl: {
      type: String,
      default: '/main/client/clientmanag/clientmanagindex'
    },
    // 固定导航icon，传空为不设置图标
    fixedIcon: {
      type: String,
      default: 'icon-notice'
    },
    // 固定导航文本
    fixedTitle: {
      type: String,
      default: '客户管理'
    }
  },
  data () {
    return {
      navTabs: [],
      moreList: [],
      isShow: false,
      isMore: false,
      tabLength: 0,
      actionId: -1, // 高亮tab id
      openTabIndex: 0
    }
  },
  created () {

  },
  mounted () {
    let _this = this
    _this.getTabLength()
    $(window).resize(function () {
      _this.getTabLength()
    })
    // 点击其他隐藏
    $(document).on('click', (e) => {
      if (!_this.$refs['More'].contains(e.target)) _this.isShow = false
    })
  },
  methods: {
    showMoreTab () {
      let _this = this
      _this.isShow = !_this.isShow
    },
    // 判断导航能显示几个tab
    getTabLength () {
      this.tabLength = parseInt(($(this.$refs['TabRoute']).width() - 35) / 180) - 1
    },
    appendTab (obj) {
      let _this = this
      // 判断打开地址在不在导航内
      let isNavTabs = true// 不在导航内
      _this.navTabs.forEach((element) => {
        if (element.openUrl == obj.openUrl) {
          isNavTabs = false
        }
      })
      // 判断打开的地址在不在更多内，
      let isMore = true
      let inMoreIndex = -1
      _this.moreList.forEach((element, index) => {
        if (element.openUrl == obj.openUrl) {
          isMore = false
          inMoreIndex = index
        }
      })

      // 导航列表和更多列表没有时，才添加新的
      if (isNavTabs && isMore) {
        // 当导航内的个数小于能放入的个数
        if (_this.navTabs.length < this.tabLength) {
          // 直接添加到导航内
          _this.navTabs.push(obj)
          // 当导航内的个数大于能放入的个数，只能放入更多利润表内
        } else {
          // 把导航最后一个放到更多列表里
          _this.moreList.push(_this.navTabs[_this.navTabs.length - 1])
          // 在删除导航最后一个
          _this.navTabs.splice(_this.navTabs.length - 1, 1)
          // 把新添加的放入导航内
          _this.navTabs.push(obj)
        }
      }

      // 当添加的在导航内，不做处理，直接打开
      // 当添加的在更多内，找到添加的索引值，调用exchangePosition方法,交行位置，
      if (!isMore) {
        _this.exchangePosition(inMoreIndex)
        return
      }
      _this.$router.push(obj.openUrl)
    },
    close (openUrl, index) {
      this.navTabs.splice(index, 1)// 删除一个tab
      // 删除完了，跳转到固定页面
      if (this.navTabs.length == 0) {
        this.$router.push(this.fixedUrl)
        return
      }
      // 更多内有
      if (this.moreList.length > 0) {
        this.navTabs.splice(this.navTabs.length - 1, 0, this.moreList[this.moreList.length - 1])
        this.moreList.splice(this.moreList.length - 1, 1)
      }
      // 关闭的是不是当前打开的
      if (this.$route.path == openUrl) {
        // 判断后面有没有
        if (index == this.navTabs.length) {
          // console.log("没有了");
          this.$router.push(this.navTabs[index - 1].openUrl)
        } else {
          // console.log("有");
          this.$router.push(this.navTabs[index].openUrl)
        }
      }
    },
    // 关闭当前打开的Tab
    closeOpenTab () {
      this.close(this.$route.path, this.openTabIndex)
    },
    setTab () {
      let _this = this
      // 当导航内的tab个数大于能方法的个数时
      if (this.navTabs.length > this.tabLength) {
        // 计算出多余的个数
        let surplus = this.navTabs.length - this.tabLength
        // 导航从指定位数向后删除多余的部分,返回删除后的数组
        let deleteArr = this.navTabs.splice(this.navTabs.length - surplus - 1, surplus)
        deleteArr.forEach((element) => {
          this.moreList.push(element)
        }, this)
        // 如果删除的的部分有当前打开的页面，就要交换位置，显示出当前打开的
        this.moreList.forEach((element, index) => {
          if (element.openUrl == this.$route.path) {
            _this.exchangePosition(index)
          }
        }, this)
      } else { // tab个数小于能放的个数,就从更多内取出
        let surplus = this.tabLength - this.navTabs.length// 多余的个数
        // console.log("还能在放两个" + surplus);
        let deleteArr = this.moreList.splice(this.moreList.length - surplus, surplus)
        this.navTabs.splice(this.navTabs.length - 1, 0, ...deleteArr)
      }
    },
    // 交换位置
    exchangePosition (index) {
      // 删除点击的元素
      let deleteArry = this.moreList.splice(index, 1)
      // 在删除tab最后一个元素
      let deleteTabArray = this.navTabs.splice(this.navTabs.length - 1, 1)
      // 把更多内的数组push到tab数组内
      this.navTabs.push(deleteArry[0])
      // 把删除的tab数组，push到更多内实现数组交换位置
      this.moreList.push(deleteTabArray[0])
      // 让数组最后一个元素被打开
      this.$router.push(this.navTabs[this.navTabs.length - 1].openUrl)
    }
  },
  watch: {
    tabLength (val) {
      this.setTab()
    },
    moreList (val) {
      if (val.length > 0) {
        this.isMore = true
      } else {
        this.isMore = false
      }
    },
    $route (val) {
      let _this = this
      _this.openTabIndex = -1
      let openTab = null
      // 获取当前打开tab的索引值
      this.navTabs.forEach((item, index) => {
        if (item.openUrl == val.path) {
          _this.openTabIndex = index
          openTab = item
        }
      })
      let all = this.navTabs.concat(this.moreList)
      _this.$emit('navChange', all, openTab)
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
