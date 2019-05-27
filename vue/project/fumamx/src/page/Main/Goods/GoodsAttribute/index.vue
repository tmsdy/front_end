<template>
    <div class="GoodsAttribute">
        <page-title title="商品大类属性" iconfont="icon-goods-attribute"></page-title>
        <!-- 临时要求改成多级的，也是醉了 -->
        <div class="treeMenu MXscroll" id="goodsTreeRoot" v-loading="loadingMenu">
          <div class="addGoods">
            <span class="text-hover" @click="$refs.classType.openWindow()">+ 添加商品分类</span>
          </div>
          <ul class="treeRoot" v-for="(item,index) in rootData" :key="index">
            <goods-tree :treeData="item" @click="treeItemClick" @getData="getData"></goods-tree>
          </ul>
        </div>

        <div class="navWindow">
            <!-- 新增字段 (只在最后一级菜单，才能新增) -->
            <h2 class="navWindowTitle text-right">
                <!-- <el-button type="primary" size="small" @click="$refs.dialogAddField.addField()">{{$t('mxpcweb.systemset.bizfield.1530328248412')}}</el-button> -->
            </h2>
            <!-- <h2 class="navWindowTitle text-right" v-if="menuItem.categoryList">
                <el-button type="primary" size="small" @click="$refs.dialogAddField.addField()" :disabled="menuItem.categoryList.length > 0">{{$t('mxpcweb.systemset.bizfield.1530328248412')}}</el-button>
            </h2> -->

            <div class="dragList dragHeader" ref="dragHeader">
                <div>
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
                    <span>商品类型</span>
                    <!-- 说明 -->
                    <span>{{$t('mxpcweb.systemset.bizfield.1530328481883')}}</span>
                </div>
            </div>
            <!-- <loading v-if="!rootData[tabIndex].moduleStrucs[actionIndex]"></loading> -->
            <!-- <loading v-if="!itemArray != ''"></loading> -->

            <div class="dragBody MXscroll" v-loading="isLoading">
                <!-- 没有查到相关数据 -->
                <no-data v-if='itemArray.length === 0' :title="$t('mxpcweb.systemset.bizfield.1530329061803')" class="marginTop15"></no-data>

                <drag-wrap v-if="itemArray != ''" v-model="itemArray" :options="{group:'group01', handle:'.handle'}" @end="moveEnd">
                    <transition-group class="dragList">
                        <template v-for="(item,index) in itemArray">
                          <!-- 非组时 -->
                            <template v-if="!item.fieldGroup">
                              <!-- 标题 -->
                                <div :key="index" v-if="item.fieldCategory==4 " style="background-color:#f7f8f9;color:#909399;font-size:14px;">
                                    <span>
                                        <span class="editBtn">
                                            {{item.cnFieldCaption}}
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
                                    <span></span>
                                </div>
                                <div :key="index" v-else>
                                    <span>
                                        <!-- <span :class="itemArray.length>1 ? 'handle' : 'handleDisabled'">
                                            <i class="iconfont icon-drag"></i>
                                        </span> -->
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
                                        <el-checkbox v-model="item.isUse" @change="isEnableItem(item.catgFieldId)" :disabled="item.useType==0" style="margin-left:8px;"></el-checkbox>
                                    </span>
                                    <span>
                                        <el-checkbox v-model="item.isNotNull" @change="isNotNullItem(item.catgFieldId)" :disabled="item.useType==0" style="margin-left:10px;"></el-checkbox>
                                    </span>
                                    <span>{{returnGoodsType(item.catgFieldId)}}</span>
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
                                                        {{item2.cnFieldCaption}}
                                                        <em v-if="item.useType!=0" @click="$refs.dialogAddField.modifyField(item2)">
                                                            <i class="iconfont icon-edit-round"></i>
                                                        </em>
                                                    </span>
                                                </td>
                                                <td>{{item2.enFieldCaption}}</td>
                                                <td>{{item2.controlType.cnName}}</td>
                                                <td>
                                                    <el-checkbox v-model="item2.isUse" @change="isEnableItem(item2.catgFieldId)" :disabled="setDisabledGroup(item2, index2, item.group)" style="margin-left:8px;"></el-checkbox>
                                                </td>
                                                <td>
                                                    <el-checkbox v-model="item2.isNotNull" @change="isNotNullItem(item2.catgFieldId)" :disabled="item2.useType==0" style="margin-left:10px;"></el-checkbox>
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
                                    <span></span>
                                </div>
                            </template>
                        </template>
                    </transition-group>
                </drag-wrap>
            </div>
        </div>

        <!-- <dialog-add-field ref="dialogAddField" @reGetData="getData" :moduleCode="rootData[tabIndex].moduleCode"
        :strucId="rootData[tabIndex].moduleStrucs[actionIndex].strucId"></dialog-add-field> -->
        <dialog-add-field ref="dialogAddField" :menuItem="menuItem" @success="getData"></dialog-add-field>

        <!-- 添加一级分类 -->
        <dialog-add-classify ref="dialogAddClassify" @success="getData()"></dialog-add-classify>

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
import classType from '../addGoods/classType/index'
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
      // actionIndex: 0, // 左菜单
      rootData: [], // 大类可用列表
      rootDataConfigs: [], // 大类配置列表
      itemArray: [], // 右侧拖拽列表
      itemArrayBak: [] // 右侧拖拽列表
    }
  },
  created () {
    this.getData()// 获取页面数据
    setTimeout(() => {
      this.dragGroupWidth()
    }, 200)
    $(window).resize(() => {
      this.dragGroupWidth()
    })
  },
  methods: {
    treeItemClick(item) {
      this.menuItem = item
      this.itemArray = ''// 清空并加loading...效果
      // this.actionIndex = index
      this.getField()// 获字段数据
    },
    returnGoodsType(id) {
      return Number(id) < 100 ? '商品属性' : '规格属性'
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
      this.$http.get(this.Global.baseURL + this.Global.api.v2.document_product_fieldList_get, { params: data }).then(res => {
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
            // if (_this.ControlsDataConvert(arrRoot).length === 0) {
            //   _this.isNoData = true
            // } else {
            //   _this.isNoData = false
            //   _this.itemArray = _this.ControlsDataConvert(arrRoot)
            //   _this.itemArray = _this.ControlsDataConvert(arrRoot)
            //   _this.itemArrayBak = Object.assign(_this.ControlsDataConvert(arrRoot))// 备件一份，用于排序，防乱序
            // }

            _this.dragGroupWidth()// 再算下拖拽组的宽
          } else {
            this.$message.error(this.msg(res.body))
          }
        }, res => {
          this.$message.error(this.$t(this.Global.errorTitle))
        })
    },
    // 获取页面数据
    getData () {
      let _this = this
      // 先取左大类菜单
      this.loadingMenu = true
       _this.$http.get(this.Global.baseURL + this.Global.api.v2.document_product_category, { params: {type: 'inUse'} }).then(function (res) {
      this.loadingMenu = false
          if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data.list)) {
            _this.rootData = _this.transData(res.body.data.list)
            if (_this.rootData.length > 0) {
              if (Object.keys(_this.menuItem).length === 0) {
                _this.menuItem = _this.rootData[0] // 首次，即空对象时，默认第一个高亮数据
              }
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

      // _this.isNoData = false
      // _this.$http.get(this.Global.baseURL + this.Global.api.SystemSet.bizfield.bizNavigatorGet).then(function (res) {
      //   if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
      //     // console.log(res.body.data)
      //     _this.rootData = res.body.data
      //     let data = {
      //       type: 'bizField',
      //       moduleCode: _this.rootData[_this.tabIndex].moduleCode,
      //       strucId: _this.rootData[_this.tabIndex].moduleStrucs[_this.actionIndex].strucId
      //     }
      //     // console.log(data);
      //     // 获取右侧列表数据
      //     _this.$http.get(this.Global.baseURL + this.Global.api.SystemSet.bizfield.bizFieldQuery, { params: data }).then(function (res) {
      //       if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
      //         // console.log(res.body.data);
      //         let arrRoot = res.body.data

      //         arrRoot.forEach(function (item) {
      //           item.isUse = item.isUse == 1
      //           item.isNotNull = item.isNotNull == 1
      //         })

      //         if (_this.ControlsDataConvert(arrRoot).length < 1) {
      //           _this.isNoData = true
      //         } else {
      //           _this.isNoData = false
      //           _this.itemArray = _this.ControlsDataConvert(arrRoot)
      //           _this.itemArrayBak = Object.assign(_this.ControlsDataConvert(arrRoot))// 备件一份，用于排序，防乱序
      //         }
      //         _this.dragGroupWidth()// 再算下拖拽组的宽
      //       } else {
      //         _this.$message.error(_this.msg(res.body))
      //       }
      //     }, function (res) {
      //       _this.$message.error(_this.$t(_this.Global.errorTitle))
      //     })
      //   } else {
      //     _this.$message.error(_this.msg(res.body))
      //   }
      // }, function (res) {
      //   _this.$message.error(_this.$t(_this.Global.errorTitle))
      // })
    },
    selectType (value, next) { // 启用选中
      let _this = this
      _this.$http.post(this.Global.baseURL + this.Global.api.v2.document_product_companyCategory, {
        targets: value
      }).then(function (res) {
        if (res.body.code.toString() == _this.Global.RES_OK) {
          next()
          _this.$message.success(_this.msg(res.body))
          _this.getData()
        } else {
          next()
          _this.$message.error(_this.msg(res.body))
        }
      }, function (res) {
        next()
        _this.$message.error(_this.$t(_this.Global.errorTitle))
      })
    },
    transData(dataList) { // 数据转换
      let list = []
      dataList.forEach(item1 => {
          if (item1.categoryList && item1.categoryList.length > 0) {
              item1.categoryList.forEach(item2 => {
                  if (item2.categoryList && item2.categoryList.length > 0) {
                      item2.categoryList.forEach(item3 => {
                          let obj = {
                              display: [],
                              catgId: ''
                          }
                          obj.display.push(item1.display)
                          obj.display.push(item2.display)
                          obj.display.push(item3.display)
                          obj.catgId = item3.catgId + ''
                          obj.display = obj.display.join('/')
                          list.push(obj)
                      })
                  } else {
                      let obj = {
                          display: [],
                          catgId: ''
                      }
                      obj.display.push(item1.display)
                      obj.display.push(item2.display)
                      obj.catgId = item2.catgId + ''
                      obj.display = obj.display.join('/')
                      list.push(obj)
                  }
              })
          } else {
              let obj = {
                  display: [],
                  catgId: ''
              }
              obj.display.push(item1.display)
              obj.catgId = item1.catgId + ''
              obj.display = obj.display.join('/')
              list.push(obj)
          }
      })
      return list
    },
    // 启用，是否
    isEnableItem (id) {
      let _this = this
      let isTrue = event.target.checked
      let data = {
        type: 'isUse',
        catgId: _this.menuItem.catgId,
        fieldId: id,
        isUse: isTrue ? '1' : '0'
      }
      // console.log(data)
      _this.$http.put(_this.Global.baseURL + _this.Global.api.v2.document_product_fieldList_put, data).then(function (res) {
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
    isNotNullItem (id) {
      let _this = this
      let isTrue = event.target.checked
      let data = {
        type: 'isNotNull',
        catgId: _this.menuItem.catgId,
        fieldId: id,
        isNotNull: isTrue ? '1' : '0'
      }
      // console.log(data)
      _this.$http.put(_this.Global.baseURL + _this.Global.api.v2.document_product_fieldList_put, data).then(function (res) {
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
    // 左菜单切换
    // menuClick (item, index) {
    //   this.menuItem = item
    //   this.itemArray = ''// 清空并加loading...效果
    //   // this.actionIndex = index
    //   this.getField()// 获字段数据
    // },
    // 拖拽结束时
    moveEnd (evt) {
      // let _this = this
      // _this.dragGroupWidth() // 执行一下动态表格组宽
      console.log(evt.oldIndex)
      console.log(evt.newIndex)
      console.log(this.itemArray[evt.oldIndex])
      console.log(this.itemArray[evt.newIndex])
      let _this = this
      let data = {
        type: 'isNotNull',
        fieldId: this.itemArray[evt.oldIndex].catgFieldId,
        catgId: this.itemArray[evt.oldIndex].catgId,
        type: 'sort',
        aboveFieldId: (evt.newIndex == 0) ? '0' : this.itemArray[evt.newIndex - 1].catgFieldId
      }
      console.log(data)
      _this.$http.put(_this.Global.baseURL + _this.Global.api.v2.document_product_fieldList_put, data).then(function (res) {
        if (res.body.code.toString() == _this.Global.RES_OK) {
          /* 排序成功 */
          _this.$message.success(this.$t('mxpcweb.systemset.bizfield.1530329573802'))
          _this.getData()// 获取页面数据
        } else {
          _this.$message.error(_this.msg(res.body))
        }
      }, function (res) {
        _this.$message.error(_this.$t(_this.Global.errorTitle))
      })

      // let data = {
      //   type: 'sort',
      //   strucId: _this.rootData[_this.tabIndex].moduleStrucs[_this.actionIndex].strucId,
      //   moduleCode: _this.rootData[_this.tabIndex].moduleCode,
      //   fieldId1: _this.itemArrayBak[evt.oldIndex].fieldId ? _this.itemArrayBak[evt.oldIndex].fieldId : _this.itemArrayBak[evt.oldIndex].group.pop().fieldId,
      //   fieldId2: _this.itemArrayBak[evt.newIndex].fieldId ? _this.itemArrayBak[evt.newIndex].fieldId : _this.itemArrayBak[evt.newIndex].group.pop().fieldId
      // }
      // // console.log(data);
      // _this.$http.post(_this.Global.baseURL + _this.Global.api.SystemSet.bizfield.bizFieldUpdate, data).then(function (res) {
      //   if (res.body.code.toString() == _this.Global.RES_OK) {
      //     /* 排序成功 */
      //     _this.$message.success(this.$t('mxpcweb.systemset.bizfield.1530329573802'))
      //     _this.getData()// 获取页面数据
      //   } else {
      //     _this.$message.error(_this.msg(res.body))
      //   }
      // }, function (res) {
      //   _this.$message.error(_this.$t(_this.Global.errorTitle))
      // })
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
  }
}
</script>

<style lang="less" rel="stylesheet/less">
@import "./zh-cn.less";
@import "./en.less";
</style>
