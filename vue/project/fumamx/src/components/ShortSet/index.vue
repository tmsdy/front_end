<template>
<!-- 设置快捷操作字段 -->
    <el-dialog v-dialogDrag :title="$t('mxpcweb.basecomponents.1531105559333')" :visible.sync="dialogSetScreen" :closeOnClickModal="false" custom-class="width420">
        <div class="setScreen">
            <div class="customerSelection">
                <el-row :gutter="20" class="list listTitle">
                    <el-col :span="4">
                        <div class="grid-content bg-purple">
                            <!-- 启用 -->
                            {{$t('mxpcweb.basecomponents.1531105627500')}}
                        </div>
                    </el-col>
                    <el-col :span="11">
                        <div class="grid-content bg-purple">
                            <!-- 字段 -->
                            {{$t('mxpcweb.basecomponents.1531105650493')}}
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="grid-content bg-purple">
                            <!-- 顺序 -->
                            {{$t('mxpcweb.client.1529026870537')}}
                        </div>
                    </el-col>
                </el-row>
                <br/>
                <loading v-if="firstGet"></loading>
                <div v-else class="listBox  MXscroll">
                    <drag-wrap  v-model="searchSetList" :options="{handle:'.icon-dragBox'}" :move="getdata" @update="datadragEnd">
                        <transition-group>
                            <div  v-for="(item,index) in searchSetList" :key="'a'+index">
                                <el-row :gutter="20" class="list">
                                    <el-col :span="4">
                                        <div class="grid-content bg-purple">
                                            <el-checkbox v-model="item.checkbox" @change="isUseFields(item.optId,index)"></el-checkbox>
                                        </div>
                                    </el-col>
                                    <el-col :span="12">
                                        <div class="grid-content bg-purple">
                                            {{item.caption}}
                                        </div>
                                    </el-col>
                                    <el-col :span="8">
                                        <div class="grid-content bg-purple">
                                            <span class="icon-dragBox" style="cursor: move;">
                                                <i class="iconfont icon-drag"></i>
                                            </span>
                                        </div>
                                    </el-col>
                                </el-row>
                            </div>
                        </transition-group>
                    </drag-wrap>
                </div>
            </div>
        </div>
    </el-dialog>
</template>
<script>
/**
 * 描述：客户管理-客户列表-设置查询字段
 * 作者：何俊峰
 * 时间：2017/11/10
 */
import draggable from 'vuedraggable'
import Loading from '@/basecomponents/Loading/index'
export default {
  name: 'setScreen',
  props: {
  },
  data () {
    return {
      multipleSelection: [],
      checked: false,
      searchSetList: [],
      firstGet: true,
      searchSetListBak: [],
      dialogSetScreen: false
    }
  },
  created () {
    this.getFieldData()
  },
  methods: {
    openWindow () {
      this.dialogSetScreen = true
    },
    // 拖拽
    getdata (evt) {
      // console.log(evt.draggedContext.element.id)
    },
    datadragEnd (evt) { // 排序
      let _this = this
      let oldoptId = _this.searchSetListBak[evt.oldIndex].optId
      let upperoptId
      if (evt.newIndex == 0) {
        upperoptId = 0
      } else {
        upperoptId = _this.searchSetListBak[evt.oldIndex > evt.newIndex ? evt.newIndex - 1 : evt.newIndex].optId
      };
      _this.$http.put(this.Global.baseURL + this.Global.api.v2.homeQuickOptSet_do, {
        moduleCode: _this.moduleCode,
        fieldType: 'searchSet',
        optId: oldoptId,
        operate: 'sort',
        upperOptId: upperoptId
      }).then(function (res) {
        if (res.body.code.toString() == _this.Global.RES_OK) {
          _this.$message.success(_this.msg(res.body))
          _this.getFieldData()
          _this.$emit('getSearchSet', false)
        } else {
          _this.$message.error(_this.msg(res.body))
        }
      }, function (res) {
        _this.$message.error(_this.$t(_this.Global.errorTitle))
      })
    },
    getFieldData () { // 获取字段数据
      let _this = this
      let url = this.Global.baseURL + this.Global.api.v2.homeQuickOptSet_do
      this.$http.get(url, { params: {} }).then(function (res) {
        if (res.body.code.toString() == _this.Global.RES_OK && res.body.data) {
          if (_this.firstGet) {
            _this.firstGet = false
          }
          let checkboxList = res.body.data
          checkboxList.forEach(element => {
            if (element.showFlag == 1) {
              element.checkbox = true
            } else {
              element.checkbox = false
            }
          })
          _this.searchSetList = checkboxList
          _this.searchSetListBak = checkboxList
        } else {
          _this.$message.error(_this.msg(res.body))
        }
      }, function (res) {
        _this.$message.error(_this.$t(_this.Global.errorTitle))
      })
    },
    isUseFields (optId, index) { // 是否启用字段
      let _this = this
      _this.$http.put(this.Global.baseURL + this.Global.api.v2.homeQuickOptSet_do, {
        optId: optId,
        operate: 'use'
      }).then(function (res) {
        if (res.body.code.toString() == _this.Global.RES_OK) {
          _this.$message.success(_this.msg(res.body))
          _this.getFieldData()
          _this.$emit('getSearchSet', false)
        } else {
          _this.$message.error(_this.msg(res.body))
        }
      }, function (res) {
        _this.$message.error(_this.$t(_this.Global.errorTitle))
      })
    }
  },
  watch: {
  },
  components: {
    'drag-wrap': draggable,
    'loading': Loading
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
