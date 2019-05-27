<template>
    <div class="addGoods">
      <!-- 商品 -->
      <!-- 新建商品 -->
        <page-detail  :title="$t('mxpcweb.PP001.PP001List.1540347621354')" :detailTitle="$t('mxpcweb.PP001.PP001List.1540347574642')" @toList="toList"></page-detail>
        <class-type ref="classType" @selectType="selectType" :type="true" :classTypeList="classTypeList" :classTypeInUseList="classTypeInUseList"></class-type>
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
                            <div v-show="item.fieldId != 986 || (colorList.length > 0 || sizeList.length > 0)" :key="index" v-if="item.fieldName != 'displayDetails'"  :class="[item.fieldCategory == 4||item.controlTypeId == 4||item.fieldGroup==1||item.controlTypeId == 15||item.controlTypeId == 46||item.controlTypeId == 52||item.controlTypeId == 51||item.controlTypeId == 58||item.controlTypeId == 59||item.fieldId == 986 ? 'listBox1' : 'listBox2']">
                                <div v-if="item.fieldGroup == 0">
                                    <template v-if="item.fieldCategory == 4">
                                        <div v-if="item.fieldId != 926 && item.fieldId != 989" class="contentTitle" :ref="'content'+item.fieldId">
                                            <span class="line"></span>
                                            {{item.cnFieldCaption}}
                                        </div>
                                    </template>
                                    <div v-else-if="item.controlTypeId == 4||item.controlTypeId == 15||item.controlTypeId == 46||item.controlTypeId == 51||item.controlTypeId == 58" style="margin-left:30px;">
                                        <component :catgId="catgId + ''" @selectType="selectType" :showButton="true" @changeUpdata="changeUpdata" :nameId="item.fieldName" :optCode="optCode" :moduleCode="moduleCode" :dataId="'control'+index" @relyOn="relyOn" class="component" labelWidth="100px" v-bind:is="'control'+item.controlTypeId" ref="control" :itemData="item" rightWidth="100%" style="max-width:997px;"  :controlData.sync="item.controlData" labelPosition="left" @returnFieldList="returnFieldList"></component>
                                    </div>
                                    <div v-else-if="item.controlTypeId == 59">
                                        <component :catgId="catgId + ''" :showButton="true" :nameId="item.fieldName" :optCode="optCode" :moduleCode="moduleCode" :dataId="'control'+index" @relyOn="relyOn" class="component" labelWidth="100px" v-bind:is="'control'+item.controlTypeId" ref="control" :itemData="item" rightWidth="320px" :controlData.sync="item.controlData" labelPosition="left" @returnFieldList="returnFieldList"></component>
                                    </div>
                                    <component v-else @changeRadio="changeRadio" :showButton="true" @changeUpdata="changeUpdata" @selectStruId4="selectStruId4" :classTypeList="classTypeList" @otNew="otNew" @selectType="selectType" :nameId="item.fieldName" :optCode="optCode" :moduleCode="moduleCode" :dataId="'control'+index"  @relyOn="relyOn" style="margin-left:30px;" labelWidth="100px" class="component" v-bind:is="'control'+item.controlTypeId" ref="control" :itemData="item" rightWidth="320px"  :controlData.sync="item.controlData" labelPosition="left" @returnFieldList="returnFieldList"></component>
                                </div>
                                <div v-else>
                                    <component :nameId="item.fieldGroup" @changeUpdata="changeUpdata" @relyOn="relyOn" @returnFieldList="returnFieldList" :optCode="optCode" :moduleCode="moduleCode" :dataId="'control'+index" v-if="item.fieldGroup==1" labelWidth="100px" style="margin-left:30px;max-width:997px;" class="component" v-bind:is="'group'+item.fieldGroup"  ref="control" :itemData="item"  rightWidth="100%" rightWidth1="152px" labelPosition="left"></component>
                                    <component :nameId="item.fieldGroup" :optCode="optCode" @changeUpdata="changeUpdata" @selectStruId4="selectStruId4" @returnFieldList="returnFieldList" :moduleCode="moduleCode" @relyOn="relyOn" :dataId="'control'+index" v-else class="component" labelWidth="100px" style="margin-left:30px;" v-bind:is="'group'+item.fieldGroup"  ref="control" :itemData="item"   rightWidth="320px" rightWidth1="158px" labelPosition="left"></component>
                                </div>
                                <div v-if="item.fieldId == 989" style="padding-left:30px;">
                                    <div v-for="(element, elementIndex) in standardList" :key="elementIndex">
                                      <goods-color :itemData="element" :nameId="element.fieldName" ref="custom" v-if="element.fieldName == 'spec1'" @colorChange="colorChange"></goods-color>
                                      <goods-size :itemData="element" :nameId="element.fieldName" ref="custom" v-else @sizeChange="sizeChange"></goods-size>
                                    </div>
                                </div>
                            </div>
                          </template>
                        </template>
                        <div v-if="items.strucId == '2'" style="padding-left:30px;">
                          <div class="strucList" v-show="radio == '2'">
                            <StruId2 ref="struId2" :items="items"  :optCode="optCode" :moduleCode="moduleCode"></StruId2>
                          </div>
                        </div>
                        <div v-if="items.strucId == '4'" style="padding-left:30px;">
                          <div class="strucList" v-show="radio == '1'">
                            <StruId4 ref="struId4" :items="items"></StruId4>
                            <StruId24 ref="struId24" :items="editSet[1]"  :optCode="optCode" :moduleCode="moduleCode"></StruId24>
                          </div>
                        </div>
                    </div>
                    <div>
                      <div class="contentTitle"  ref="content979">
                          <span class="line"></span>
                          <!-- 商品详情 -->
                          {{$t('mxpcweb.PP001.PP001List.1540347897401')}}
                      </div>
                      <div>
                        <component  v-bind:is="'control'+53" ref="displayDetails" v-if="pageTab == '1'"></component>
                      </div>
                    </div>
                </div>
                <div class="footer">
                  <!-- 保存 -->
                    <el-button type="primary"  @click="submitAddFrom({offFlag: 0})" :loading="submitLoading">{{$t('mxpcweb.PP001.PP001List.1540347906920')}}</el-button>
                    <!-- 保存后继续新增 -->
                    <el-button type="primary"  @click="submitAddFrom({offFlag: 0}, true)" :loading="submitLoading">{{$t('mxpcweb.PP001.PP001List.1543301562668')}}</el-button>
                    <!-- 保存草稿 -->
                    <el-button    @click="submitAddFrom({auditstate:1})" :loading="submitLoading">{{$t('mxpcweb.PP001.PP001List.1540347977713')}}</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import classType from './classType/index'
import StruId2 from './StruId2/index'
import StruId24 from './StruId24/index'
import StruId3 from './StruId3/index'
import StruId4 from './StruId4/index'
import GoodsColor from './GoodsColor/index'
import GoodsSize from './GoodsSize/index'
import PageDetail from '@/components/PageDetail/index' // 大标题
import Controls from '@/components/Controls/index.js'
import GroupControls from '@/components/GroupControls/index.js'
export default {
  name: 'addGoods',
  props: {
    classTypeList: {
        type: Array,
        default: function () {
            return []
        }
    },
    classTypeInUseList: {
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
      default: 'otNew'
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
  },
  methods: {
    open (item) {
        this.itemData = item
        this.catgId = item.category
        this.selectType(this.catgId)
        this.radio = item.quotationMethod
        this.getOther(true)
    },
    changeUpdata(list) {
      list.forEach(elemennt => {
        this.updata(elemennt.fieldName, elemennt.value)
      })
    },
    colorChange(list) {
      this.colorList = list
      let _this = this
      // this.allChage()
      if (_this.$refs.struId2) {
        _this.$refs.struId2[0].colorChange(list)
      } else {
        setTimeout(function () {
          _this.$refs.struId2[0].colorChange(list)
        }, 200)
      }
      if (_this.$refs.struId24) {
        _this.$refs.struId24[0].colorChange(list)
      } else {
        setTimeout(function () {
          _this.$refs.struId24[0].colorChange(list)
        }, 200)
      }
    },
    sizeChange(list) {
      this.sizeList = list
      let _this = this
      if (_this.$refs.struId2) {
        _this.$refs.struId2[0].sizeChange(list)
      } else {
        setTimeout(function () {
          _this.$refs.struId2[0].sizeChange(list)
        }, 200)
      }
      if (_this.$refs.struId24) {
        _this.$refs.struId24[0].sizeChange(list)
      } else {
        setTimeout(function () {
          _this.$refs.struId24[0].sizeChange(list)
        }, 200)
      }
    },
    allChage() {
      if (this.colorList.length > 0 || this.sizeList.length > 0) {
        this.radio = '2'
      } else {
        this.radio = '1'
      }
      this.updata('quotationMethod', this.radio)
    },
    toList() {
      this.$emit('pageClick', '0')
    },
    changeRadio(value) {
      this.radio = value
    },
    selectType(catgId, type) {
      if (catgId && type == 'classType') {
        this.$refs.classType.updata(catgId)
        this.catgId = catgId + ''
        this.getOther()
      } else if (catgId) {
        this.catgId = catgId + ''
        this.updata('category', catgId)
        this.getOther()
      }
      if (!catgId && !type) {
        this.$refs.classType.openWindow()
      }
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
    clearData() {
      let _this = this
      if (_this.$refs['control']) {
        _this.$refs['control'].forEach(item => {
          if (item.clearData) {
            item.clearData()
          }
        })
      }
      _this.catgId = ''
      _this.editSetOther = []
      _this.standardList = []
      _this.radio = '1'
      _this.colorChange([])
      _this.sizeChange([])
      _this.$refs.struId4[0].clearData()
      _this.$refs.struId2[0].clearData()
      _this.$refs.struId24[0].clearData()
      // _this.$refs.displayDetails.clearData()
      setTimeout(function () {
        $('.contentBox').scrollTop(0)
      }, 20)
    },
    upList(fieldName) {
      let _this = this
      _this.$refs['control'].forEach(item => {
        if (item.$attrs.nameId == fieldName) {
          item.upList()
        }
      })
    },
    otNew(moduleCode) {},
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
                type: 'addEditSet'
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
        // if (_this.classTypeList.length > 0) {
          // setTimeout(function() {
          //   _this.selectType(_this.classTypeList[0].catgId)
          //   _this.$refs.classType.getListData()
          // }, 20)
        // }
      })
    },
    getOther(updata) {
      let _this = this
      if (this.catgId != '') {
        _this.editSet = _this.editSetBase
        _this.$http
          .get(
            this.Global.baseURL + this.Global.api.v2.document_product_fieldShow,
            {
              params: {
                moduleCode: _this.moduleCode,
                fieldType: 'special',
                catgId: this.catgId,
                type: 'addEditSet'
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
                setTimeout(function() {
                  if (_this.$refs.struId2) {
                    _this.$refs.struId2[0].fieldChange()
                  }
                  if (_this.$refs.struId24) {
                    _this.$refs.struId24[0].fieldChange()
                  }
                  if (updata) {
                    _this.updatas()
                  }
                }, 100)
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
        _this.editSet = _this.editSetBase
        _this.editSetOther = []
      }
    },
    updatas() {
      let _this = this
      setTimeout(function () {
        _this.$refs['control'].forEach((item, index) => {
          if (_this.itemData[item.$attrs.nameId] &&
            item.$attrs.nameId != 'spuCode' &&
            item.$attrs.nameId != 'category' &&
            item.$attrs.nameId != 'devDate'
          ) {
            item.updatas(_this.itemData[item.$attrs.nameId])
          }
        })
        if (_this.$refs['controlGroup']) {
          _this.$refs['controlGroup'].forEach((item, index) => {
            if (item.$attrs.nameId != '3') {
              item.updatas(_this.itemData)
            }
          })
        }
        if (_this.$refs['custom']) {
          _this.$refs['custom'].forEach((item, index) => {
            if (_this.itemData[item.$attrs.nameId]) {
              item.updatas(_this.itemData[item.$attrs.nameId])
            }
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
    submitAddFrom(argument, add) {
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
            if (element.controlData != '' && element.controlData != []) {
              _this.addPeopleFrom[element.fieldName] = element.controlData
            } else if (_this.addPeopleFrom[element.fieldName]) {
              delete _this.addPeopleFrom[element.fieldName]
            }
          } else {
            element.group.forEach(function(item) {
              if (item.controlData != '' && item.controlData != []) {
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
          content: _this.$refs.displayDetails.getVal()
        }
      }
      // _this.addPeopleFrom.displayDetails = '154545454'
      _this.addPeopleFrom['moduleCode'] = _this.moduleCode
      if (_this.radio == '1') {
        Object.assign(_this.addPeopleFrom, _this.$refs.struId4[0].submitForm())
        Object.assign(_this.addPeopleFrom, _this.$refs.struId24[0].submitForm())
      }
      if (_this.radio == '2') {
        Object.assign(_this.addPeopleFrom, _this.$refs.struId2[0].submitForm())
      }
      if (argument) {
        Object.assign(_this.addPeopleFrom, argument)
      }
      if (_this.$refs.custom) {
        _this.$refs.custom.forEach(item => {
          Object.assign(_this.addPeopleFrom, item.submitForm())
        })
      }
      _this.submitLoading = true
      _this.$http.post(_this.Global.baseURL + _this.Global.api.v2.document_product, _this.addPeopleFrom).then((res) => {
          if (res.body.code.toString() == _this.Global.RES_OK) {
              _this.submitLoading = false
              _this.$message.success(_this.msg(res.body))
              if (add) {
                _this.clearData()
              } else {
                _this.$emit('pageClick', '0')
              }
          } else {
              _this.submitLoading = false
              _this.$message.error(_this.msg(res.body))
          }
      }, (res) => {
          _this.submitLoading = false
          _this.$message.error(_this.$t(_this.Global.errorTitle))
      })
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
      'class-type': classType,
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
