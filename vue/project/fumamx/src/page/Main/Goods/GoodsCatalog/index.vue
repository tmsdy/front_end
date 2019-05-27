<template>
  <div class="GoodsCatalog MXscroll" ref="loginLog">
    <page-title title="商品目录" iconfont="icon-goods-catalog"></page-title>

    <div class="text-right" style="margin-bottom:8px;">
        <el-button type="primary" size="small" @click="goUrl">预览</el-button>
        <el-button type="primary" size="small" @click="$refs.dialogAddCatalog.open()">添加目录</el-button>
    </div>

    <table class="fm-table">
      <thead>
        <tr>
          <th width="200">目录名称</th>
          <th>移动</th>
          <th>状态</th>
          <th>创建时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody v-for="(item, index) in tableList" :key="item.groupCode">
        <tr>
          <td class="name">
            <span v-if="item.groupList && item.groupList.length > 0" @click="item.sliderShow = !item.sliderShow">
              <i class="iconfont" :class="[item.sliderShow ? 'icon-minus-thin' : 'icon-plus-file']"></i>
            </span>
            <div :title="item.display">{{item.display}}</div>
          </td>
          <td class="move">
            <i class="iconfont icon-move-up" @click="moveItem(tableList, index, true)" :class="[index === 0 ? 'text-no' : 'text-hover']"></i>
            <i class="iconfont icon-move-down" @click="moveItem(tableList, index, false)" :class="[index+1 === tableList.length ? 'text-no' : 'text-hover']"></i>
          </td>
          <td><el-switch  v-model="item.isUse"  on-text=""  off-text="" @change="useChange(item)"></el-switch></td>
          <td>{{timeShow_custom(item.createDate, 'YYYY-MM-DD HH:mm')}}</td>
          <td>
            <el-button type="text" @click="$refs.goodsView.open(item)">查看商品</el-button>
            <el-button type="text" @click="$refs.goodsAdd.open(item)">添加商品</el-button>
            <el-button type="text" @click="delItem(item)">删除</el-button>
            <el-button type="text" @click="$refs.dialogEditCatalog.open(item)">修改</el-button>
            <el-button type="text" @click="$refs.dialogAddCatalog.open(item)">添加子目录</el-button>
          </td>
        </tr>

          <template v-for="(item2, index2) in item.groupList">
            <tr :key="item2.groupCode" class="subTr" :class="[item.sliderShow ? '' : 'hidden']">
              <td class="name"><div :title="item2.display">{{item2.display}}</div></td>
              <td class="move">
                <i class="iconfont icon-move-up" @click="moveItem(item.groupList, index2, true)" :class="[index2 === 0 ? 'text-no' : 'text-hover']"></i>
                <i class="iconfont icon-move-down" @click="moveItem(item.groupList, index2, false)" :class="[index2+1 === item.groupList.length ? 'text-no' : 'text-hover']"></i>
              </td>
              <td><el-switch  v-model="item2.isUse"  on-text=""  off-text="" @change="useChange(item2)"></el-switch></td>
              <td>{{timeShow_custom(item2.createDate, 'YYYY-MM-DD HH:mm')}}</td>
              <td>
                <el-button type="text" @click="$refs.goodsView.open(item2)">查看商品</el-button>
                <el-button type="text" @click="$refs.goodsAdd.open(item2)">添加商品</el-button>
                <el-button type="text" @click="delItem(item2)">删除</el-button>
                <el-button type="text" @click="$refs.dialogEditCatalog.open(item2)">修改</el-button>
              </td>
            </tr>
          </template>
      </tbody>
    </table>
    <no-data v-if="tableList.length === 0" title="没有查到数据" />

    <!-- 添加目录 -->
    <dialog-add-catalog ref="dialogAddCatalog" @success="getData()" />

    <!-- 修改目录 -->
    <dialog-edit-catalog ref="dialogEditCatalog" @success="operationItem"/>

    <!-- 查看商品 -->
    <goods-view ref="goodsView" />

    <!-- 添加商品 -->
    <goods-add ref="goodsAdd" />
  </div>
</template>

<script>
/**
 * 描述：商品=>商品目录
 * 作者：向士健
 * 时间：2018/09/17
 */
import { mapGetters } from 'vuex'
import { isArray } from '@/libs/utils.js'
import NoData from '@/basecomponents/NoData/index'
import PageTitle from '@/components/PageTitle/index' // 大标题
import dialogAddCatalog from './dialogAddCatalog/index.vue' // 添加目录
import dialogEditCatalog from './dialogEditCatalog/index.vue' // 修改目录
import goodsView from './goodsView/index.vue' // 查看商品
import goodsAdd from '@/components/goodsAdd' // 添加商品

export default {
  name: 'GoodsCatalog',
  props: {},
  data () {
    return {
      tableList: []
    }
  },
  created () {
    this.getData()
  },
  computed: {
      ...mapGetters([ 'company' ])
  },
  methods: {
    // 删除这条
    delItem(item) {
      // console.log(item)
       this.$confirm('此操作不可恢复, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete(this.Global.baseURL + this.Global.api.v2.document_product_group, { params: {groupId: item.groupId} }).then(res => {
            if (res.body.code.toString() == this.Global.RES_OK) {
              // console.log('********************')
              // console.log(res.body.data)
              // console.log('********************')
              this.$message.success('删除成功')
              this.getData()
            } else {
              this.$message.error(this.msg(res.body))
            }
          }, res => {
            this.$message.error(this.$t(this.Global.errorTitle))
          })
        }).catch(() => {})
    },
    // 状态开关
    useChange(item) {
      let isTrue = event.target.checked
      let data = {
        operate: isTrue ? 'use' : 'unUse',
        groupId: item.groupId
      }
      this.operationItem(data)
    },
    // 上下移动（子目录）
    moveItem(arr, index, isMoveUp) {
      // 上下到不能移时，跳出
      if (isMoveUp && index === 0) { return }
      if (!isMoveUp && arr.length === index + 1) { return }
      let data = {
        operate: 'sort',
        groupId: arr[index].groupId,
        upperGroupId: isMoveUp ? (index === 1 ? 0 : arr[index - 2].groupId) : arr[index + 1].groupId // 上移到 index 为1 时，父级ID改0
      }
      this.operationItem(data)
    },
    // 编辑操作
    operationItem(data) {
      this.$http.put(this.Global.baseURL + this.Global.api.v2.document_product_group, data).then(res => {
        if (res.body.code.toString() == this.Global.RES_OK) {
          this.$message.success(res.body.msg)
        } else {
          this.$message.error(this.msg(res.body))
        }
        this.getData() // 重载数据
      }, res => {
        this.$message.error(this.$t(this.Global.errorTitle))
      })
    },
    //
    getData() {
      this.$http.get(this.Global.baseURL + this.Global.api.v2.document_product_group, { params: {type: 'configList'} }).then(res => {
        if (res.body.code.toString() == this.Global.RES_OK && isArray(res.body.data.list)) {
          // console.log(res.body.data)
          let list = res.body.data.list
          list.forEach(item => {
            item.isUse = !!Number(item.isUse) // 给开关做 true false
            item.sliderShow = true // 子目录默认不隐藏
            if (item.groupList.length > 0) {
              item.groupList.forEach(item2 => {
                item2.isUse = !!Number(item2.isUse) // 给开关做 true false
              })
            }
          })
          this.tableList = list
        } else {
          this.$message.error(this.msg(res.body))
        }
      }, res => {
        this.$message.error(this.$t(this.Global.errorTitle))
      })
    },
    goUrl() {
      // console.log(this.getGoodsCatalogLink())
      window.open(this.getGoodsCatalogLink())
    }
  },
  components: {
    'page-title': PageTitle,
    'dialog-add-catalog': dialogAddCatalog,
    'dialog-edit-catalog': dialogEditCatalog,
    'goods-view': goodsView,
    'goods-add': goodsAdd,
    'no-data': NoData
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
