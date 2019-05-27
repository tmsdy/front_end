<template>
    <div class="editGoods">
      <!-- 商品 -->
      <!-- 编辑商品 -->
        <page-detail  :title="$t('mxpcweb.PP001.PP001List.1540347621354')" :detailTitle="$t('mxpcweb.PP001.PP001List.1540347882752')" @toList="toList"></page-detail>
        <div class="controlBox" v-loading="loading">
            <div class="controlTitle">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane v-for="(item, index) in tabs" :key="index" :label="item.cnFieldCaption" :name="item.fieldId+''"></el-tab-pane>
                </el-tabs>
            </div>
            <div class="contentBox MXscroll" @scroll="paperScroll">
                <div class="listBox" style="min-height:400px;">
                    <div v-for="(items,indexs) in editSet" :key="indexs">
                      <template v-if="items.strucId == '1'">
                        <template v-for="(item,index) in items.fieldList">
                          <div v-if="item.fieldName!='displayDetails'" v-show="item.fieldId != 986 || (colorList.length > 0 || sizeList.length > 0)" :key="index" :class="[item.fieldCategory == 4||item.controlTypeId == 4||item.fieldGroup==1||item.controlTypeId == 15||item.controlTypeId == 46||item.controlTypeId == 52||item.controlTypeId == 58||item.controlTypeId == 51||item.controlTypeId == 59||item.fieldId == 986 ? 'listBox1' : 'listBox2']">
                              <div v-if="item.fieldGroup == 0">
                                  <template v-if="item.fieldCategory == 4">
                                      <div v-if="item.fieldId != 926 && item.fieldId != 989" class="contentTitle" :ref="'content'+item.fieldId">
                                          <span class="line"></span>
                                          {{item.cnFieldCaption}}
                                      </div>
                                  </template>
                                  <div v-else-if="item.controlTypeId == 4||item.controlTypeId == 15||item.controlTypeId == 46||item.controlTypeId == 51||item.controlTypeId == 58" style="margin-left:30px;">
                                      <component :catgId="catgId+''" :nameId="item.fieldName" :optCode="optCode" :moduleCode="moduleCode" :dataId="'control'+index" @relyOn="relyOn" class="component" labelWidth="100px" v-bind:is="'control'+item.controlTypeId" ref="control" :itemData="item" rightWidth="100%" style="max-width:997px;" :controlData.sync="item.controlData" labelPosition="left" @returnFieldList="returnFieldList"></component>
                                  </div>
                                  <div v-else-if="item.controlTypeId == 59">
                                    <component :catgId="catgId + ''" :showButton="true" :nameId="item.fieldName" :optCode="optCode" :moduleCode="moduleCode" :dataId="'control'+index" @relyOn="relyOn" class="component" labelWidth="100px" v-bind:is="'control'+item.controlTypeId" ref="control" :itemData="item" rightWidth="320px" :controlData.sync="item.controlData" labelPosition="left" @returnFieldList="returnFieldList"></component>
                                  </div>
                                  <component v-else @changeRadio="changeRadio" @selectStruId4="selectStruId4" :classTypeList="classTypeList" :nameId="item.fieldName" :optCode="optCode" :moduleCode="moduleCode" :dataId="'control'+index"  @relyOn="relyOn" style="margin-left:30px;" labelWidth="100px" class="component" v-bind:is="'control'+item.controlTypeId" ref="control" :itemData="item" rightWidth="320px"  :controlData.sync="item.controlData" labelPosition="left" @returnFieldList="returnFieldList"></component>
                              </div>
                              <div v-else>
                                  <component :nameId="item.fieldName" @relyOn="relyOn" @returnFieldList="returnFieldList" :optCode="optCode" :moduleCode="moduleCode" :dataId="'control'+index" v-if="item.fieldGroup==1" labelWidth="100px" style="margin-left:30px;max-width:997px;" class="component" v-bind:is="'group'+item.fieldGroup"  ref="control" :itemData="item" rightWidth="100%" rightWidth1="152px" labelPosition="left"></component>
                                  <component :optCode="optCode" @selectStruId4="selectStruId4" @returnFieldList="returnFieldList" :moduleCode="moduleCode" :nameId="item.fieldName" @relyOn="relyOn" :dataId="'control'+index" v-else class="component" labelWidth="100px" style="margin-left:30px;" v-bind:is="'group'+item.fieldGroup"  ref="control" :itemData="item"   rightWidth="320px" rightWidth1="158px" labelPosition="left"></component>
                              </div>
                              <div v-if="item.fieldId == 989" style="padding-left:30px;">
                                  <div v-for="(element, elementIndex) in standardList" :key="elementIndex">
                                    <goods-color ref="custom" type="edit" :itemData="element" v-if="element.fieldName == 'spec1'" @colorChange="colorChange" :items="itemData"></goods-color>
                                    <goods-size ref="custom" type="edit" :itemData="element" v-else-if="element.fieldName == 'spec2'" @sizeChange="sizeChange" :items="itemData"></goods-size>
                                  </div>
                              </div>
                          </div>
                        </template>
                      </template>
                        <div v-if="items.strucId == '2'" style="padding-left:30px;">
                          <div class="strucList" v-show="radio == '2'">
                            <StruId2 ref="struId2" type="edit" :items="items"  :optCode="optCode" :moduleCode="moduleCode"></StruId2>
                          </div>
                        </div>
                        <div v-if="items.strucId == '4'" style="padding-left:30px;">
                          <div class="strucList" v-show="radio == '1'">
                            <StruId4 ref="struId4" type="edit" :items="items"></StruId4>
                            <StruId24 ref="struId24" type="edit" :items="editSet[1]"  :optCode="optCode" :moduleCode="moduleCode"></StruId24>
                          </div>
                        </div>
                    </div>
                    <div>
                      <div class="contentTitle"  ref="content979">
                          <span class="line"></span>
                          {{$t('mxpcweb.PP001.PP001List.1540347897401')}}
                          <!-- 商品详情 -->
                      </div>
                      <div style="padding-left:30px;">
                        <component type="edit" v-bind:is="'control'+53" ref="displayDetails" v-if="pageTab == '2'"></component>
                      </div>
                    </div>
                </div>
                <div class="footer">
                  <!-- 取消 -->
                    <el-button @click="toList()" style="width:140px;">{{$t('mxpcweb.PP001.PP001List.1540347902374')}}</el-button>
                    <!-- 保存 -->
                    <el-button type="primary"  @click="submitAddFrom()" :loading="submitLoading" style="width:140px;">{{$t('mxpcweb.PP001.PP001List.1540347906920')}}</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import StruId2 from '../addGoods/StruId2/index'
import StruId3 from '../addGoods/StruId3/index'
import StruId4 from '../addGoods/StruId4/index'
import StruId24 from '../addGoods/StruId24/index'
import GoodsColor from '../addGoods/GoodsColor/index'
import GoodsSize from '../addGoods/GoodsSize/index'
import PageDetail from '@/components/PageDetail/index' // 大标题
import Controls from '@/components/Controls/index.js'
import GroupControls from '@/components/GroupControls/index.js'
import { isNumber, isArray } from '@/libs/utils.js'
export default {
  name: 'editGoods',
  props: {
    classTypeList: {
        type: Array,
        default: function () {
            return []
        }
    },
    moduleCode: {
      type: String,
      default: 'PP001'
    },
    optCode: {
      type: String,
      default: 'otEdit'
    },
     pageTab: {
      type: String,
      default: ''
     }
  },
  data() {
    return {
      activeName: '',
      catgId: '',
      standardList: [], // 规格字段
      tabs: [],
      addPeopleFrom: {},
      loading: true,
      editSet: [],
      editSetBase: [],
      editSetOther: [],
      submitLoading: false,
      argument: true,
      errMsg: '',
      firstInto: true,
      boxHeight: 0,
      optName: this.$t('mxpcweb.client.1529043854407'),
      radio: '1',
      colorList: [],
      sizeList: [],
      itemData: {}
    }
  },
  created() {
    this.getEditSet()
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  methods: {
    colorChange(list) {
      this.colorList = list
      // this.allChage()
      this.$refs.struId2[0].colorChange(list)
      this.$refs.struId24[0].colorChange(list)
    },
    sizeChange(list) {
      this.sizeList = list
      // this.allChage()
      this.$refs.struId2[0].sizeChange(list)
      this.$refs.struId24[0].sizeChange(list)
    },
    allChage() {
      // if (this.colorList.length > 0 || this.sizeList.length > 0) {
      //   this.radio = 2
      // } else {
      //   this.radio = 1
      // }
    },
    toList() {
      this.$emit('pageClick', '0')
    },
    changeRadio(value) {
      this.radio = value
    },
    selectStruId4(data) {
      if (this.$refs.struId4) {
        this.$refs.struId4[0].selectStruId4(data)
      } else {
        console.log('区块4未加载！')
      }
    },
    handleClick() {
      let offsetTop = this.$refs['content' + this.activeName][0] ? this.$refs['content' + this.activeName][0].offsetTop : this.$refs['content' + this.activeName].offsetTop
      let topData = offsetTop - 40
      $('.contentBox').scrollTop(topData)
    },
    paperScroll(e) {
      this.tabs.forEach(element => {
        let offsetTop = this.$refs['content' + element.fieldId][0] ? this.$refs['content' + element.fieldId][0].offsetTop : this.$refs['content' + element.fieldId].offsetTop
        if (e.srcElement.scrollTop >= offsetTop - 60) {
          this.activeName = element.fieldId + ''
        }
      })
    },
    updata(fieldName, value) {
      let _this = this
      if (_this.$refs['control']) {
        _this.$refs['control'].forEach(item => {
            if (item.$attrs.nameId == fieldName) {
              item.updata(value)
            }
        })
      }
    },
    open (item) {
        this.clearData()
        this.$nextTick(() => {
          this.itemData = item
          this.catgId = item.category
          this.radio = item.quotationMethod
          this.getOther()
        })
    },
    clearData() {
      let _this = this
      if (_this.$refs['control']) {
        _this.$refs['control'].forEach(item => {
          if (item.clearData) {
            item.clearData()
          }
        })
      }
      this.catgId = ''
      _this.editSetOther = []
      _this.standardList = []
      _this.colorChange([])
      _this.sizeChange([])
      _this.$refs.struId4[0].clearData()
      _this.$refs.struId24[0].clearData()
      _this.$refs.struId2[0].clearData()
      // _this.$refs.displayDetails.clearData()
      setTimeout(function () {
        $('.contentBox').scrollTop(0)
      }, 20)
    },
    relyOn(value, name) {
      let _this = this
      _this.editSet.forEach(function(item) {
        if (item.parFilterField == name) {
          _this.$refs['control'].forEach(items => {
            if (items.$attrs.nameId == item.fieldName) {
              items.getData(value, true)
            }
          })
        }
      })
    },
    returnFieldList(data, field) {
      let _this = this
      let fieldList = field.split(';')
      fieldList.forEach(element => {
        if (element != '') {
          let elementList = element.split('=')
          _this.$refs['control'].forEach(items => {
            if (items.$attrs.nameId == elementList[0]) {
              items.updata(data[elementList[1]])
            }
          })
        }
      })
    },
    getEditSet() {
      // 获取数据
      let _this = this
      let moduleCode = _this.moduleCode
      let p1 = new Promise((resolve, reject) => {
        _this.$http
          .get(
            this.Global.baseURL + this.Global.api.v2.document_product_fieldShow,
            {
              params: {
                moduleCode: moduleCode,
                fieldType: 'common',
                type: 'modifyEditSet'
              }
            }
          )
          .then(
            (res) => {
              if (res.body.code.toString() == _this.Global.RES_OK) {
                let editSet = res.body.data
                resolve(this.swidchEditSet(editSet, true))
              } else {
                resolve([])
                _this.loading = false
                _this.$message.error(_this.msg(res.body))
              }
            },
            (res) => {
              resolve([])
              _this.loading = false
              _this.$message.error(_this.$t(_this.Global.errorTitle))
            }
          )
      })
      Promise.all([p1]).then(function(results) {
        _this.editSet = results[0]
        _this.editSetBase = results[0]
        _this.loading = false
      })
    },
    getOther() {
      let _this = this
      if (this.catgId != '') {
        _this.$http
          .get(
            this.Global.baseURL + this.Global.api.v2.document_product_fieldShow,
            {
              params: {
                moduleCode: _this.moduleCode,
                fieldType: 'special',
                catgId: this.catgId,
                type: 'modifyEditSet'
              }
            }
          )
          .then(
            (res) => {
              if (res.body.code.toString() == _this.Global.RES_OK) {
                let editSet = res.body.data
                _this.editSetOther = _this.swidchEditSet(editSet)
                let newList = []
                _this.editSetBase.forEach(function(item, index) {
                  let fieldList = []
                  let isHave = false
                  item.fieldList.forEach(element => {
                    fieldList.push(element)
                    if (element.fieldId == 926) {
                      isHave = true
                      _this.editSetOther[index].fieldList.forEach(otherField => {
                        fieldList.push(otherField)
                      })
                    }
                  })
                  if (!isHave) {
                    let reverseList = []
                    if (item.strucId == '2') {
                      _this.standardList = []
                    }
                    _this.editSetOther[index].fieldList.forEach(items => {
                      if (item.strucId == '1') {
                        reverseList.push(items)
                      } else {
                        reverseList.unshift(items)
                      }
                    })
                    reverseList.forEach(items => {
                      if (item.strucId == '1') {
                        fieldList.push(items)
                      } else {
                        fieldList.unshift(items)
                        if (item.strucId == '2') {
                          _this.standardList.unshift(items)
                        }
                      }
                    })
                  }
                  let list = {
                    strucName: item.strucName,
                    strucId: item.strucId,
                    fieldList: fieldList
                  }
                  newList.push(list)
                })
                _this.editSet = newList
                _this.swidchEdit(_this.itemData)
                _this.swidchEdit1(_this.itemData, _this.standardList)
                _this.updatas()
              } else {
                _this.editSetOther = []
                _this.editSet = _this.editSetBase
                _this.standardList = []
                _this.$message.error(_this.msg(res.body))
              }
            },
            (res) => {
              _this.editSetOther = []
              _this.standardList = []
              _this.$message.error(_this.$t(_this.Global.errorTitle))
            }
          )
      } else {
        _this.editSetOther = []
      }
    },
    updatas() {
      let _this = this
      setTimeout(function () {
        _this.$refs['control'].forEach((item, index) => {
            item.updata()
        })
        if (_this.$refs['custom']) {
          _this.$refs['custom'].forEach((item, index) => {
              item.updata()
          })
        }
        _this.updataStruIdField()
      }, 100)
      if (_this.itemData.displayDetails && _this.itemData.displayDetails != '') {
        let time = setInterval(function () {
          if (_this.$refs.displayDetails && _this.$refs.displayDetails.updata) {
            clearInterval(time)
            _this.$refs.displayDetails.updata(_this.itemData.displayDetails)
          }
        }, 200)
      }
    },
    updataStruIdField() {
      let _this = this
      setTimeout(function() {
        if (_this.$refs.struId2) {
          _this.$refs.struId2[0].fieldChange()
        }
        if (_this.$refs.struId24) {
          _this.$refs.struId24[0].fieldChange()
        }
        _this.updataStruIdValue()
      }, 100)
    },
    updataStruIdValue () {
      let _this = this
      setTimeout(function() {
        if (_this.radio == '2' && _this.itemData.strucId_2 && _this.itemData.strucId_2.length != 0) {
          _this.$refs.struId2[0].updata(_this.itemData.strucId_2)
        } else if (_this.radio == '1' && _this.itemData.strucId_4 && _this.itemData.strucId_4.length != 0) {
          _this.$refs.struId4[0].updata(_this.itemData.strucId_4)
          _this.$refs.struId24[0].updata(_this.itemData.strucId_2)
        }
      }, 100)
    },
    swidchEdit(list) {
        let _this = this
        _this.editSet[0].fieldList.forEach(function(item) {
          item.inDefaultValue = ''
          if (item.editState == '0' || item.editState == '3') {
              item.disabled = true
          }
          if (item.fieldGroup == 0) {
              if (list[item.fieldName]) {
                  item.fieldValue = isNumber(list[item.fieldName]) ? list[item.fieldName].toString() : list[item.fieldName]
              } else {
                  item.fieldValue = ''
              }
          } else {
              item.group.forEach(function(element) {
                  if (list[element.fieldName]) {
                      element.fieldValue = isNumber(list[element.fieldName]) ? list[element.fieldName].toString() : list[element.fieldName]
                  } else {
                      element.fieldValue = ''
                  }
              })
          }
        })
    },
    swidchEdit1(list, lists) {
      lists.forEach(function(item) {
        item.inDefaultValue = ''
        if (item.editState == '0' || item.editState == '3') {
            item.disabled = true
        }
        if (item.fieldGroup == 0) {
            if (list[item.fieldName]) {
                item.fieldValue = isNumber(list[item.fieldName]) ? list[item.fieldName].toString() : list[item.fieldName]
            } else {
                item.fieldValue = ''
            }
        } else {
            item.group.forEach(function(element) {
                if (list[element.fieldName]) {
                    element.fieldValue = isNumber(list[element.fieldName]) ? list[element.fieldName].toString() : list[element.fieldName]
                } else {
                    element.fieldValue = ''
                }
            })
        }
      })
    },
    swidchEditSet(list, tabsUse) {
      let _this = this
      let newLList = []
      let groupFirst = []
      let tabs = []
      list.forEach(elements => {
        let newLList1 = []
        elements.fieldList.forEach(element => {
            element.controlData = ''
            if (element.editState == '0' || element.editState == '2') {
                element.disabled = true
            }
            element.fieldValue = element.inDefaultValue
            if (element.fieldCategory == 4 && element.fieldId != 926 && element.fieldId != 989) {
                tabs.push(element)
            }
            if (element.fieldGroup !== 0) {
                // 判断是否是一个组
                let isHave = false
                let thisGroup = ''
                groupFirst.forEach(item => {
                // 判断这个组是否出现过，出现则在groupFirst里做个标记
                if (item == element.fieldGroup) {
                    isHave = true
                    thisGroup = item // 记住这个组id
                }
                })
                if (!isHave) {
                // 如果没有出现过新建一个对象放入newList里面
                let newObj = {
                    fieldGroup: element.fieldGroup,
                    cnFieldCaption: _this.returnGroupName(element.fieldGroup),
                    isTop: element.isTop,
                    group: []
                }
                newObj.group.push(element)
                newLList1.push(newObj)
                groupFirst.push(element.fieldGroup)
                } else {
                // 如果出现过就找之前创建的对象将自己放入到group数组中
                newLList1.forEach(function(them) {
                    if (them.fieldGroup == thisGroup) {
                    them.group.push(element)
                    }
                })
                }
            } else {
                newLList1.push(element)
            }
        })
        elements.fieldList = newLList1
        newLList.push(elements)
      })
      tabs.push({
        // 商品详情
        cnFieldCaption: this.$t('mxpcweb.PP001.PP001List.1540347897401'),
        fieldId: 979
      })
      if (tabsUse) {
        this.tabs = tabs
        if (this.tabs.length > 0) {
          this.activeName = this.tabs[0].fieldId + ''
        }
      }
      return newLList
    },
    submitAddFrom() {
      // 提交新增客户数据
      let _this = this
      let isPass = true
      let firstTo = true
      _this.$refs['control'].forEach(item => {
        if (!item.submitForm()) {
          isPass = false
          if (firstTo) {
            firstTo = false
            if (item.$attrs.dataId != '') {
              $('.contentBox').scrollTop(
                $('[dataId=' + item.$attrs.dataId + ']')[0].offsetTop - 60
              )
            }
          }
        }
      })
      // let custContact = {}
      if (!isPass) {
        return isPass
      }
      _this.addPeopleFrom = {}
      _this.editSet[0].fieldList.forEach(function(element) {
          if (element.fieldCategory != 4) {
              if (element.fieldGroup == 0) {
                if (isArray(element.controlData)) {
                  if (isArray(element.fieldValue)) {
                    let isSame = true
                    if (element.fieldValue.length != element.controlData.length) {
                      isSame = false
                    }
                    element.fieldValue.forEach((elements, indexs) => {
                      if (!element.controlData[indexs] || element.controlData[indexs] != elements) {
                        isSame = false
                      }
                    })
                    if (!isSame) {
                      _this.addPeopleFrom[element.fieldName] = element.controlData
                    } else if (_this.addPeopleFrom[element.fieldName]) {
                      delete _this.addPeopleFrom[element.fieldName]
                    }
                  } else {
                      _this.addPeopleFrom[element.fieldName] = element.controlData
                  }
                } else {
                  if (element.controlData != element.fieldValue && element.controlData != undefined && element.fieldName != 'displayDetails' && JSON.stringify(element.controlData) != '{}') {
                      _this.addPeopleFrom[element.fieldName] = element.controlData
                  } else if (_this.addPeopleFrom[element.fieldName]) {
                      delete _this.addPeopleFrom[element.fieldName]
                  }
                }
              } else {
                  element.group.forEach(function(item) {
                      if (item.controlData != item.fieldValue && item.controlData != undefined) {
                          _this.addPeopleFrom[item.fieldName] = item.controlData
                      } else if (_this.addPeopleFrom[item.fieldName]) {
                          delete _this.addPeopleFrom[item.fieldName]
                      }
                  })
              }
          }
      })
      let displayDetailsValue = _this.$refs.displayDetails.getVal()
      if (displayDetailsValue || displayDetailsValue === '') {
        _this.addPeopleFrom.displayDetails = {
          content: displayDetailsValue
        }
      }
      if (_this.radio == '1') {
        Object.assign(_this.addPeopleFrom, _this.$refs.struId4[0].submitForm())
        Object.assign(_this.addPeopleFrom, _this.$refs.struId24[0].submitForm())
      }
      if (_this.radio == '2') {
        Object.assign(_this.addPeopleFrom, _this.$refs.struId2[0].submitForm())
      }
      if (_this.$refs.custom) {
        _this.$refs.custom.forEach(item => {
          Object.assign(_this.addPeopleFrom, item.submitForm())
        })
      }
      if (_this.addPeopleFrom.spec1 && _this.itemData.spec1) {
        if (_this.addPeopleFrom.spec1.toString() == _this.itemData.spec1.toString()) {
          delete _this.addPeopleFrom.spec1
        }
      }
      if (_this.addPeopleFrom.spec2 && _this.itemData.spec2) {
        if (_this.addPeopleFrom.spec2.toString() == _this.itemData.spec2.toString()) {
          delete _this.addPeopleFrom.spec2
        }
      }
      if (_this.addPeopleFrom.strucId_2 && _this.itemData.strucId_2) {
        if (_this.addPeopleFrom.strucId_2.toString() == _this.itemData.strucId_2.toString()) {
          delete _this.addPeopleFrom.strucId_2
        }
      }
      if (_this.isEmptyObject(_this.addPeopleFrom)) {
          // 您未作任何修改，不能保存！
          _this.$message(_this.$t('mxpcweb.client.1529054287744'))
          return false
      }
      _this.addPeopleFrom['moduleCode'] = _this.moduleCode
      _this.addPeopleFrom.identFieldValue = _this.itemData.spuId
      _this.submitLoading = true
      _this.$http.put(_this.Global.baseURL + _this.Global.api.v2.document_product, _this.addPeopleFrom).then((res) => {
          if (res.body.code.toString() == _this.Global.RES_OK) {
              _this.submitLoading = false
              _this.$message.success(_this.msg(res.body))
              _this.toList()
          } else {
              _this.submitLoading = false
              _this.$message.error(_this.msg(res.body))
          }
      }, (res) => {
          _this.submitLoading = false
          _this.$message.error(_this.$t(_this.Global.errorTitle))
      })
    },
    isEmptyObject(obj) {
        for (let key in obj) {
            return false
        }
        return true
    },
    clearEditSet(argument) {
      this.editSet.forEach(elemennt => {
        if (elemennt.fieldGroup == 0) {
          elemennt.controlData = ''
        } else {
          elemennt.group.forEach(function(items) {
            items.controlData = ''
          })
        }
      })
      this.addPeopleFrom = {}
      if (!argument) {
        this.$refs['control'].forEach(item => {
          item.clearData()
        })
      }
    }
  },
  watch: {},
  components: Object.assign(
    {
      'page-detail': PageDetail,
      'goods-color': GoodsColor,
      'goods-size': GoodsSize,
      'StruId2': StruId2,
      'StruId24': StruId24,
      'StruId3': StruId3,
      'StruId4': StruId4
    },
    Controls,
    GroupControls
  )
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
