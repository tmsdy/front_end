<template>
    <div class="GoodsAttribute">
        <page-title title="商品类目" iconfont="icon-goods-attribute"></page-title>

        <!-- 临时要求改成多级的，也是醉了 -->
        <div class="treeMenu MXscroll" v-loading="loadingMenu">
          <div class="addGoods">
            <span class="text-hover" @click="$refs.classType.openWindow()">+ 添加商品类目</span>
          </div>
          <ul class="treeRoot" v-for="(item,index) in rootData" :key="index">
            <goods-tree :treeData="item" :menuItem="menuItem" @click="treeItemClick" @getData="getTreeData" ></goods-tree>
          </ul>
        </div>

        <div class="navWindow">
            <!-- 新增字段 (只在最后一级菜单，才能新增) -->
            <h2 class="navWindowTitle text-right" v-if="menuItem.categoryList">
                <el-button type="primary" size="small" @click="$refs.dialogAddField.addField()" :disabled="menuItem.catgLevel == 1">{{$t('mxpcweb.systemset.bizfield.1530328248412')}}</el-button>
            </h2>

            <div class="dragList dragHeader" ref="dragHeader">
                <div v-if="menuItem.catgLevel == 1">
                    <!-- 排序 -->
                    <span>
                      <!-- {{$t('mxpcweb.systemset.bizfield.1530328282582')}} -->
                      </span>
                    <!-- 字段名称 -->
                    <span>名称</span>
                    <!-- 英文名称 -->
                    <span>{{$t('mxpcweb.systemset.bizfield.1530328407834')}}</span>
                    <!-- 类型 -->
                    <span>{{$t('mxpcweb.systemset.bizfield.1530328447594')}}</span>
                    <!-- 启用 -->
                    <span>{{$t('mxpcweb.systemset.bizfield.1530328459139')}}</span>
                    <!-- 必填 -->
                    <span>{{$t('mxpcweb.systemset.bizfield.1530328470247')}}</span>
                    <!-- 说明 -->
                    <span>{{$t('mxpcweb.systemset.bizfield.1530328481883')}}</span>
                </div>
                <div v-else>
                    <!-- 排序 -->
                    <span>
                      <!-- {{$t('mxpcweb.systemset.bizfield.1530328282582')}} -->
                      </span>
                    <!-- 字段名称 -->
                    <span>{{$t('mxpcweb.systemset.bizfield.1530328379660')}}</span>
                    <!-- 英文名称 -->
                    <span>{{$t('mxpcweb.systemset.bizfield.1530328407834')}}</span>
                    <!-- 类型 -->
                    <span>{{$t('mxpcweb.systemset.bizfield.1530328447594')}}</span>
                    <!-- 启用 -->
                    <span>{{$t('mxpcweb.systemset.bizfield.1530328459139')}}</span>
                    <!-- 必填 -->
                    <span>{{$t('mxpcweb.systemset.bizfield.1530328470247')}}</span>
                    <!-- 说明 -->
                    <span>{{$t('mxpcweb.systemset.bizfield.1530328481883')}}</span>
                </div>
            </div>

            <div class="dragBody MXscroll" v-loading="isLoading">
                <!-- 没有查到相关数据 -->
                <no-data v-if='itemArray.length === 0' :title="$t('mxpcweb.systemset.bizfield.1530329061803')" class="marginTop15"></no-data>

                <drag-wrap v-if="itemArray != ''" v-model="itemArray" :options="{group:'group01', handle:'.handle'}" @end="moveEnd">
                    <transition-group class="dragList" v-if="menuItem.catgLevel == 1">
                        <template v-for="(item,index) in itemArray">
                          <!-- 非组时 -->
                            <template v-if="!item.fieldGroup">
                              <!-- 标题 -->
                                <div :key="index" v-if="item.fieldCategory==4 " style="background-color:#f7f8f9;color:#909399;font-size:14px;">
                                    <span>
                                        <span class="editBtn">
                                            {{item.attrCaption}}
                                            <em v-if="item.fieldCategory!=1" @click="$refs.dialogAddField.modifyField(item)">
                                                <i class="iconfont icon-edit-round"></i>
                                            </em>
                                        </span>
                                    </span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                                <div :key="index" v-else>
                                    <span>
                                        <span :class="itemArray.length>1 ? 'handle' : 'handleDisabled'">
                                            <i class="iconfont icon-drag"></i>
                                        </span>
                                    </span>
                                    <span>
                                        <span class="editBtn">
                                            {{item.cnFieldCaption}}
                                            <em v-if="item.useType!=0" @click="$refs.dialogAddField.modifyField(item)">
                                                <i class="iconfont icon-edit-round"></i>
                                            </em>
                                        </span>
                                    </span>
                                    <span>{{item.enFieldCaption}}</span>
                                    <span>{{item.controlType.cnName}}</span>
                                    <span>
                                        <el-checkbox v-model="item.isUse" @change="isEnableItem(item)" :disabled="item.useType==0" style="margin-left:8px;"></el-checkbox>
                                    </span>
                                    <span>
                                        <el-checkbox v-model="item.isNotNull" @change="isNotNullItem(item)" :disabled="item.useType==0" style="margin-left:10px;"></el-checkbox>
                                    </span>
                                    <span>
                                        <!-- 系统字段不许更改 -->
                                        <span v-if="item.useType==0" style="margin-left:6px;">{{$t('mxpcweb.systemset.bizfield.1530329093515')}}</span>
                                    </span>
                                </div>
                            </template>

                            <template v-else>
                                <div :key="index">
                                    <span :style="dragGroupHeight(item.group.length)">
                                        <table class="dragGroup">
                                            <tr v-for="(item2,index2) in item.group" :key="index2">
                                                <td>
                                                    <span class="handle" v-if="index2 == 0">
                                                        <i class="iconfont icon-drag"></i>
                                                    </span>
                                                </td>
                                                <td>
                                                    <span class="editBtn">
                                                        {{item2.attrCaption}}
                                                        <em v-if="item.useType!=0" @click="$refs.dialogAddField.modifyField(item2)">
                                                            <i class="iconfont icon-edit-round"></i>
                                                        </em>
                                                    </span>
                                                </td>
                                                <td>{{item2.enAttrCaption}}</td>
                                                <td>{{item2.controlType.cnName}}</td>
                                                <td>
                                                    <el-checkbox v-model="item2.isUse" @change="isEnableItem(item2)" :disabled="setDisabledGroup(item2, index2, item.group)" style="margin-left:8px;"></el-checkbox>
                                                </td>
                                                <td>
                                                    <el-checkbox v-model="item2.isNotNull" @change="isNotNullItem(item2)" :disabled="item2.useType==0" style="margin-left:10px;"></el-checkbox>
                                                </td>
                                                <td>
                                                    <!-- 系统字段不许更改 -->
                                                    <span v-if="item2.useType==0" style="margin-left:6px;">{{$t('mxpcweb.systemset.bizfield.1530329093515')}}</span>
                                                </td>
                                            </tr>
                                        </table>
                                    </span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </template>
                        </template>
                    </transition-group>
                    <transition-group class="dragList" v-else>
                        <template v-for="(item,index) in itemArray">
                          <!-- 非组时 -->
                            <template v-if="!item.fieldGroup">
                              <!-- 标题 -->
                                <div :key="index" v-if="item.fieldCategory==4 " style="background-color:#f7f8f9;color:#909399;font-size:14px;">
                                    <span>
                                        <span class="editBtn">
                                            {{item.attrCaption}}
                                            <em v-if="item.fieldCategory!=1" @click="$refs.dialogAddField.modifyField(item)">
                                                <i class="iconfont icon-edit-round"></i>
                                            </em>
                                        </span>
                                    </span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                                <div :key="index" v-else>
                                    <span>
                                        <span :class="itemArray.length>1 ? 'handle' : 'handleDisabled'">
                                            <i class="iconfont icon-drag"></i>
                                        </span>
                                    </span>
                                    <span>
                                        <span class="editBtn">
                                            {{item.attrCaption}}
                                            <em v-if="item.useType!=0" @click="$refs.dialogAddField.modifyField(item)">
                                                <i class="iconfont icon-edit-round"></i>
                                            </em>
                                        </span>
                                    </span>
                                    <span>{{item.enAttrCaption}}</span>
                                    <span>{{item.controlType.cnName}}</span>
                                    <span>
                                        <el-checkbox v-model="item.isUse" @change="isEnableItem(item)" :disabled="item.useType==0" style="margin-left:8px;"></el-checkbox>
                                    </span>
                                    <span>
                                        <el-checkbox v-model="item.isNotNull" @change="isNotNullItem(item)" :disabled="item.useType==0" style="margin-left:10px;"></el-checkbox>
                                    </span>
                                    <span>
                                        <!-- 系统字段不许更改 -->
                                        <span v-if="item.useType==0" style="margin-left:6px;">{{$t('mxpcweb.systemset.bizfield.1530329093515')}}</span>
                                    </span>
                                </div>
                            </template>

                            <template v-else>
                                <div :key="index">
                                    <span :style="dragGroupHeight(item.group.length)">
                                        <table class="dragGroup">
                                            <tr v-for="(item2,index2) in item.group" :key="index2">
                                                <td>
                                                    <span class="handle" v-if="index2 == 0">
                                                        <i class="iconfont icon-drag"></i>
                                                    </span>
                                                </td>
                                                <td>
                                                    <span class="editBtn">
                                                        {{item2.attrCaption}}
                                                        <em v-if="item.useType!=0" @click="$refs.dialogAddField.modifyField(item2)">
                                                            <i class="iconfont icon-edit-round"></i>
                                                        </em>
                                                    </span>
                                                </td>
                                                <td>{{item2.enAttrCaption}}</td>
                                                <td>{{item2.controlType.cnName}}</td>
                                                <td>
                                                    <el-checkbox v-model="item2.isUse" @change="isEnableItem(item2)" :disabled="setDisabledGroup(item2, index2, item.group)" style="margin-left:8px;"></el-checkbox>
                                                </td>
                                                <td>
                                                    <el-checkbox v-model="item2.isNotNull" @change="isNotNullItem(item2)" :disabled="item2.useType==0" style="margin-left:10px;"></el-checkbox>
                                                </td>
                                                <td>
                                                    <!-- 系统字段不许更改 -->
                                                    <span v-if="item2.useType==0" style="margin-left:6px;">{{$t('mxpcweb.systemset.bizfield.1530329093515')}}</span>
                                                </td>
                                            </tr>
                                        </table>
                                    </span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </template>
                        </template>
                    </transition-group>
                </drag-wrap>
            </div>
        </div>

        <dialog-add-field ref="dialogAddField" :menuItem="menuItem" @success="getTreeData"></dialog-add-field>

        <!-- 添加一级分类 -->
        <dialog-add-classify ref="dialogAddClassify" @success="getTreeData()"></dialog-add-classify>

        <!-- 选择大类弹窗 -->
        <class-type ref="classType" @selectType="selectType" :classTypeList="rootDataConfigs"></class-type>
    </div>
</template>

<script>
/**
 * 描述：商品=>商品大类属性
 * 作者：向士健
 * 时间：2018/09/15
 */
import { isArray } from '@/libs/utils.js'
import PageTitle from '@/components/PageTitle/index' // 大标题
import draggable from 'vuedraggable'
import Loading from '@/basecomponents/Loading/index'
import NoData from '@/basecomponents/NoData/index'
import dialogAddField from './dialogAddField/index'// 加字段弹窗
import dialogAddClassify from './dialogAddClassify/index'// 加大类弹窗
import goodsTree from './goodsTree'
import classType from '@/page/Main/Goods/addGoods/classType/index'
export default {
  name: 'GoodsAttribute',
  props: {

  },
  data () {
    return {
      // isNoData: false,
      loadingMenu: false,
      isLoading: false,
      menuItem: {}, // 当前选中项

      tabIndex: 0, // tab,以0开始
      rootData: [], // 大类可用列表
      rootDataConfigs: [], // 大类配置列表
      itemArray: [] // 右侧拖拽列表
    }
  },
  created () {
    this.getTreeData()// 获取页面数据
    setTimeout(() => {
      this.dragGroupWidth()
    }, 200)
    $(window).resize(() => {
      this.dragGroupWidth()
    })
  },
  methods: {
    // 菜单树点击时
    treeItemClick(item) {
      // console.log(item)
      this.menuItem = item
      this.itemArray = ''// 清空并加loading...效果
      // this.getField()// 获字段数据
      // $('.treeRoot').find('.active').removeClass()
    },
    // 针对组做规则，比如国家地址
    setDisabledGroup (item, index, group) {
      // 系统字段首先禁用
      if (item.useType != 0) {
        // 取得 group 里 为 false 的 length
        let arr = []
        group.forEach(function (item) {
          if (item.isUse == false) {
            arr.push('flag')
          }
        })
        // 为最后2项特殊设置:
        if (item.isUse == true && index == group.length - (arr.length + 1)) {
          return false // 开启
        } else if (item.isUse == false && index == group.length - (arr.length)) {
          return false // 开启
        } else {
          return true // 禁用
        }
      } else {
        return true // 禁用
      }
    },
    // 拖拽组的高度，计算一下
    dragGroupHeight (num) {
      return 'height:' + (36 * num + 5) + 'px'
    },
    dragGroupWidth () {
      let dragHeaderH = this.$refs.dragHeader.offsetWidth
      setTimeout(function () {
        $('.dragGroup').css('width', dragHeaderH - 5 + 'px')
      }, 20)
    },
    // 右侧字段
    getField() {
      let _this = this
      this.isLoading = true
      let data = {
        type: 'list',
        catgId: this.menuItem.catgId
      }
      let api = ''
      if (this.menuItem.catgLevel == 1) {
        api = this.Global.baseURL + this.Global.api.v2.document_product_fieldList_get // 一级菜单时
      } else {
        api = this.Global.baseURL + this.Global.api.v2.product_catgAttrSet
      }
      this.$http.get(api, { params: data }).then(res => {
          if (res.body.code.toString() == this.Global.RES_OK && isArray(res.body.data)) {
            this.isLoading = false
            // console.log('********************')
            let arrRoot = res.body.data
            // console.log(arrRoot)

            arrRoot.forEach(function (item) {
              item.isUse = !!Number(item.isUse)
              item.isNotNull = !!Number(item.isNotNull)
            })
            _this.itemArray = arrRoot
            _this.dragGroupWidth()// 再算下拖拽组的宽
          } else {
            this.$message.error(this.msg(res.body))
          }
        }, res => {
          this.$message.error(this.$t(this.Global.errorTitle))
        })
    },
    // 获取页面数据
    getTreeData () {
      let _this = this
      // 先取左大类菜单
      this.loadingMenu = true
       _this.$http.get(this.Global.baseURL + this.Global.api.v2.document_product_category, { params: {type: 'inUse'} }).then(function (res) {
      this.loadingMenu = false
          if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data.list)) {
            _this.rootData = res.body.data.list
            // _this.rootData = _this.transData(res.body.data.list)
            if (_this.rootData.length > 0) {
              // console.log(this.rootData)
              _this.checkParams() // 传参数判断
              _this.getField() // 取右侧字段
            }
          } else {
            _this.$message.error(_this.msg(res.body))
          }
        }, function (res) {
          _this.$message.error(_this.$t(_this.Global.errorTitle))
        })

        _this.$http.get(this.Global.baseURL + this.Global.api.v2.document_product_category, { params: {type: 'configList'} }).then(function (res) {
          if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data.list)) {
            _this.rootDataConfigs = res.body.data.list
          } else {
            _this.$message.error(_this.msg(res.body))
          }
        }, function (res) {
          _this.$message.error(_this.$t(_this.Global.errorTitle))
        })
    },
    selectType (value, next) { // 启用选中
      let _this = this
      _this.$http.post(this.Global.baseURL + this.Global.api.v2.document_product_companyCategory, {
        targets: value
      }).then(function (res) {
        if (res.body.code.toString() == _this.Global.RES_OK) {
          next()
          _this.$message.success(_this.msg(res.body))
          _this.getTreeData()
        } else {
          next()
          _this.$message.error(_this.msg(res.body))
        }
      }, function (res) {
        next()
        _this.$message.error(_this.$t(_this.Global.errorTitle))
      })
    },
    // 启用，是否
    isEnableItem (item) {
      // console.log(item)
      let _this = this
      let isTrue = event.target.checked
      let data = {
        type: 'edit',
        catgId: item.catgId,
        attrId: item.attrId,
        isuse: isTrue ? '1' : '0'
      }
      // console.log(data)
      // return
      _this.$http.put(_this.Global.baseURL + _this.Global.api.v2.product_catgAttrSet, data).then(function (res) {
        if (res.body.code.toString() == _this.Global.RES_OK) {
          /* '已启用' : '已禁用' */
          _this.$message.success(isTrue == true ? this.$t('mxpcweb.systemset.bizfield.1530329410107') : this.$t('mxpcweb.systemset.bizfield.1530329437805'))
        } else {
          _this.$message.error(_this.msg(res.body))
        }
      }, function (res) {
        _this.$message.error(_this.$t(_this.Global.errorTitle))
      })
    },
    // 必填，是否
    isNotNullItem (item) {
      let _this = this
      let isTrue = event.target.checked
      let data = {
        type: 'edit',
        catgId: item.catgId,
        attrId: item.attrId,
        isNotNull: isTrue ? '1' : '0'
      }
      // console.log(data)
      _this.$http.put(_this.Global.baseURL + _this.Global.api.v2.product_catgAttrSet, data).then(function (res) {
        if (res.body.code.toString() == _this.Global.RES_OK) {
          /*  '已修改为必填' : '已修改为非必填' */
          _this.$message.success(isTrue == true ? this.$t('mxpcweb.systemset.bizfield.1530329462538') : this.$t('mxpcweb.systemset.bizfield.1530329497124'))
        } else {
          _this.$message.error(_this.msg(res.body))
        }
      }, function (res) {
        _this.$message.error(_this.$t(_this.Global.errorTitle))
      })
    },
    // 拖拽结束时
    moveEnd (evt) {
      let _this = this
      let data = {
        type: 'isNotNull',
        catgId: this.itemArray[evt.newIndex].catgId,
        attrId: this.itemArray[evt.newIndex].attrId,
        type: 'sort',
        upAttrId: (evt.newIndex == 0) ? '0' : this.itemArray[evt.newIndex - 1].attrId
      }
      _this.$http.put(_this.Global.baseURL + _this.Global.api.v2.product_catgAttrSet, data).then(function (res) {
        if (res.body.code.toString() == _this.Global.RES_OK) {
          /* 排序成功 */
          _this.$message.success(this.$t('mxpcweb.systemset.bizfield.1530329573802'))
          _this.getTreeData()// 获取页面数据
        } else {
          _this.$message.error(_this.msg(res.body))
        }
      }, function (res) {
        _this.$message.error(_this.$t(_this.Global.errorTitle))
      })
    },
    checkParams() {
      // 传参数判断
      let routerId = this.$route.params.id
      if (routerId && routerId !== '') {
        this.menuItem = {
          catgId: routerId,
          categoryList: []
        }
      } else {
        if (Object.keys(this.menuItem).length === 0) {
          this.menuItem = this.rootData[0] // 首次，即空对象时，默认第一个高亮数据
        }
      }
    }
  },
  components: {
    'page-title': PageTitle,
    'goods-tree': goodsTree,
    'drag-wrap': draggable,
    'no-data': NoData,
    'loading': Loading,
    'dialog-add-field': dialogAddField,
    'dialog-add-classify': dialogAddClassify,
    'class-type': classType
  },
  watch: {
    $route() {
      let routerId = this.$route.params.id
      if (routerId) {
        console.log(routerId)
        $('.treeRoot').find('.active').removeClass()
        this.checkParams() // 传参数判断
        this.getField() // 取右侧字段
      }
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less">
@import "./zh-cn.less";
@import "./en.less";
</style>
