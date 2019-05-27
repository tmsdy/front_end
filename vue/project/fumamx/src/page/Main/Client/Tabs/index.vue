<template>
    <div class="fm-Tabs">
        <el-tabs v-model="editableTabsValue" closable @tab-remove="removeTab" @tab-click="handleClick">
            <el-tab-pane v-for="item in editableTabs" :key="item.name" :label="item.title" :name="item.name">
                <div slot="label" class="tab_widthBox">
                  <span :class="'tab_width'" :title="item.title"><i v-if="item.iconURI" class="iconfont" :class="item.iconURI"></i>{{item.title}}</span>
                  <span class="bottomBorder"></span>
                </div>
                <component v-bind:is="item.content" :tabName="item.name" @removeTab="removeTab"></component>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import List from '@/page/Main/Client/Layout/standard/ClientManagIndex/index.vue'
import QueryRepeat from '../View/QueryRepeat/index.vue'
import DynamicTab from './DynamicTab/index.vue'
import { mapMutations } from 'vuex'
export default {
  name: 'fm-Tabs',
  props: {},
  data() {
    return {
      editableTabsValue: '1',
      editableTabs: []
    }
  },
  async created() {
    // 创建左侧导航tab
    let { viewName, moduleCode, id } = this.$route.params
    if (viewName && moduleCode) {
      this.addRouteTab()
      if (viewName && moduleCode && id) {
        this.addDynamicTab()
      }
    }
    // 注册点击列表也，创建新tab的全局事件
    ep.tail('addTab', (obj) => {
        this.addListDynamicTab(obj)
    })
    // 注册消息列表打来详情页
    ep.tail('listaddTab', () => {
        this.addDynamicTab()
    })
  },
  methods: {
    // 点击导航菜单调用
    addRouteTab() {
      let { display, uRI, iconURI } = this.getRoute()
      let newTabName = new Date() * 1 + ''
      this.editableTabs.push({
        title: display,
        name: newTabName,
        content: this.$route.params.viewName,
        path: uRI,
        iconURI
      })
      this.editableTabsValue = newTabName
    },
    // f5刷新调用
    async addDynamicTab() {
      let { moduleCode, id } = this.$route.params
      // 只要有一个不存在就不能添加tab
      if (!moduleCode || !id) {
          return ''
      }
      // 决定详情页单据编号，路由中第二个参数。
      let moduleStruct = await this.$http.get(this.Global.baseURL + this.Global.api.v2.moduleStruct + moduleCode, { params: {}})
      let titleField = ''
      if (moduleStruct.body.code.toString() == this.Global.RES_OK && _.isObject(moduleStruct.body.data)) {
          titleField = moduleStruct.body.data.titleField
      }
      let getDetail = await this.$http.get(this.Global.baseURL + this.Global.api.v2.document_generalOperate_get, { params: {
          searchType: 'detail',
          moduleCode: moduleCode,
          identFieldValue: id
      }})
      let obj = {}
      if (getDetail.body.code.toString() == this.Global.RES_OK && _.isObject(getDetail.body.data)) {
          obj = getDetail.body.data
      }
      this.set_customerInfo(obj)// 存储数据到状态
      let newTabName = new Date() * 1 + ''
      for (let item of this.editableTabs) {
        if (item.path === this.$route.path) {
          this.editableTabsValue = item.name
          if (item.path == this.$route.path && moduleCode == 'WO001') {
                ep.emit(item.path + 'update')
          }
          return
        }
      }
      this.editableTabs.push({
        title: obj[titleField],
        name: newTabName,
        content: 'dynamic-tab',
        path: this.$route.path
      })
      this.editableTabsValue = newTabName
    },
    // 点击列表页调用
    async addListDynamicTab(obj) {
      let { moduleCode, billId } = obj
      if (!moduleCode || !billId) {
        return ''
      }
      // let { uRI } = this.getRoute()
      let path = '/main/client/tabs/list/' + moduleCode + '/' + billId
      // let path = `'/main/client/tabs/'${uRI}/${billId}`
      // 去重
      for (let item of this.editableTabs) {
        if (item.path === path) {
          this.editableTabsValue = item.name
          return
        }
      }
      this.set_customerInfo(obj)// 存储数据到状态
      this.$router.push(path)
      let newTabName = new Date() * 1 + ''
      this.editableTabs.push({
        title: obj.billName,
        name: newTabName,
        content: 'dynamic-tab',
        path: path
      })
      this.editableTabsValue = newTabName
    },
    removeTab(targetName) {
      let tabs = this.editableTabs
      let activeName = this.editableTabsValue
      let activePath = ''
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
              activePath = nextTab.path
            }
          }
        })
      }
      this.$router.push(activePath)
      this.editableTabsValue = activeName
      let editableTabs = tabs.filter(tab => tab.name !== targetName)
      this.editableTabs = []
      this.editableTabs = editableTabs
    },
    handleClick(tab, event) {
        let name = tab.name
        let tabs = this.editableTabs
        tabs.forEach((tab, index) => {
            if (tab.name === name) {
                this.$router.push(tab.path)
            }
        })
    },
    // 设置客户信息
    ...mapMutations('client', {
        set_customerInfo: 'SET_CUSTOMERINFO'
    })
  },
  components: {
      'list': List,
      'focus': List,
      'recycle': List,
      'seas': List,
      'dynamic-tab': DynamicTab,
      'queryrepeat': QueryRepeat
  },
  watch: {
    $route() {
      // 监听是左侧导航点击
      if (this.$route.path.indexOf('/main/client/tabs') !== -1 && this.$route.path.split('/').length <= 6) {
        let tabs = this.editableTabs
        let actionTab
        // 判断当前点击的路由是否已经打开
        tabs.forEach((tab, event) => {
          if (tab.path === this.$route.path) {
            actionTab = tab
          }
        })
        // 点击的路由页面不存在，创建页面
        if (actionTab) {
          this.editableTabsValue = actionTab.name
        } else {
            this.addRouteTab()
        }
      }
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less">
@import "./zh-cn.less";
@import "./en.less";
</style>
