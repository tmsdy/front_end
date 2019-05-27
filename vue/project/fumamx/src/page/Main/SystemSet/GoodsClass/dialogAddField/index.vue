<template>
    <div class="dialogAddField">
        <!-- '新增字段':'修改字段' -->
        <el-dialog v-dialogDrag :title="titleType=='add'?$t('mxpcweb.systemset.bizfield.1530328248412'):$t('mxpcweb.systemset.bizfield.1530335090644')" :visible.sync="isOpen" custom-class="width420" @close="resetForm('dialogForm')">
            <el-form :model="dialog" :rules="dialogRules" ref="dialogForm" label-width="108px">
                <!-- 商品类型 -->
                <!-- <el-form-item label="商品类型" prop="goodsType">
                    <el-select v-model="dialog.goodsType" placeholder="" class="widthFull" v-if="titleType=='add'">
                        <el-option label="商品属性" value="1"></el-option>
                        <el-option label="规格属性" value="2"></el-option>
                    </el-select>
                    <div v-else>
                      <template v-if="dialog.catgFieldId < 100">商品属性</template>
                      <template v-else>规格属性</template>
                    </div>
                </el-form-item> -->

                <!-- 字段类型 -->
                <el-form-item :label="$t('mxpcweb.systemset.bizfield.1530335128925')" prop="controlTypeId" v-if="titleType=='add'">
                    <!-- 请选择 -->
                    <el-select v-model="dialog.controlTypeId" :placeholder="$t('mxpcweb.systemset.bizfield.1530335170460')" class="widthFull" @change="selectChange()">
                        <el-option v-for="(item,index) in typeArr" :key="index" :label="item.cnName" :value="item.controlTypeId + ''"></el-option>
                    </el-select>
                </el-form-item>

                <!-- 字段类型 -->
                <el-form-item :label="$t('mxpcweb.systemset.bizfield.1530335128925')" prop="" v-else style="margin:-5px 0 15px;">
                    <!-- {{fieldType}} -->
                    {{dialog.controlType.cnName}}
                    <!--{{dialog.controlTypeId}}-->
                </el-form-item>

                <!-- 自定义下拉 -->
                <div class="typeDropDown" v-if="dialog.controlTypeId==60 || dialog.controlTypeId==61" v-loading="isLoading">
                    <dl>
                        <!-- 下拉值 -->
                        <dt>{{$t('mxpcweb.systemset.bizfield.1530335248503')}}</dt>
                        <!-- 注：仅限禁用和新增，不可再启用、不可删除 -->
                        <dt style="color:#999;font-size:12px;">{{$t('mxpcweb.systemset.bizfield.1530335286654')}}</dt>
                        <div class="ddWrap MXscroll">
                            <template v-if="titleType == 'modify'">
                                <dd v-for="(item,index) in downValues" :key="index">
                                    <div class="textVal">
                                        {{item.itemName}}
                                        <!-- 已禁用 -->
                                        <span v-show="item.inUse == 0" class="pull-right text-red" style="font-size:12px;">{{$t('mxpcweb.systemset.bizfield.1530329437805')}}</span>
                                        <!-- 禁用 -->
                                        <el-button :plain="true" type="danger" size="mini" v-show="item.inUse != 0" class="pull-right" @click="disabledDown(item)">{{$t('mxpcweb.systemset.bizfield.1530335350572')}}</el-button>
                                    </div>
                                </dd>
                            </template>
                            <dd v-for="(item,index) in dialog.itemName" :key="'a'+index">
                                <!-- 请输入下拉值 -->
                                <el-input v-model="dialog.itemName[index]" size="small" :placeholder="$t('mxpcweb.systemset.bizfield.1530335419348')" style="width:200px"></el-input>
                                <!-- 移除 -->
                                <el-button :plain="true" type="danger" size="small" @click="typeDropDownDel(index)" class="pull-right">{{$t('mxpcweb.systemset.bizfield.1530335441748')}}</el-button>
                            </dd>
                        </div>
                        <dt>
                            <el-button type="text" size="mini" @click="typeDropDownAdd" style="margin:5px 0 0 10px;">
                                <i class="iconfont icon-plus-file"></i>{{$t('mxpcweb.systemset.bizfield.1530335471413')}}
                                <!-- 增加选项 -->
                            </el-button>
                        </dt>
                    </dl>
                    <!-- 单选效果预览 -->
                    <!-- <el-form-item :label="$t('mxpcweb.systemset.bizfield.1530335521972')">
                        <el-select v-model="typeDropDown.noValue" :placeholder="$t('mxpcweb.systemset.bizfield.1530335564676')" size="small">
                            <el-option v-for="(item,index) in cumputerView()" :key="index" :label="item.itemName" :value="index" :disabled="item.inUse == 0"> </el-option>
                        </el-select>
                    </el-form-item> -->
                </div>

                <el-form-item label="属性中文名" prop="attrCaption">
                    <el-input v-model="dialog.attrCaption" placeholder="属性中文名"></el-input>
                </el-form-item>
                <el-form-item label="属性英文名" prop="enAttrCaption">
                    <el-input v-model="dialog.enAttrCaption" placeholder="属性英文名"></el-input>
                </el-form-item>
                <el-form-item label="字段中文名" prop="cnFieldHint">
                    <el-input v-model="dialog.cnFieldHint" placeholder="字段中文名"></el-input>
                </el-form-item>
                <el-form-item label="字段英文名" prop="enFieldHint">
                    <el-input v-model="dialog.enFieldHint" placeholder="字段英文名"></el-input>
                </el-form-item>

                <div class="text-center">
                    <!-- 确定新增 -->
                    <el-button type="primary" v-show="titleType == 'add'" @click="submitAdd('dialogForm')" style="width:165px;">{{$t('mxpcweb.systemset.bizfield.1530336681212')}}</el-button>
                    <!-- 确定修改 -->
                    <el-button type="primary" v-show="titleType == 'modify'" @click="submitModify('dialogForm')" style="width:165px;">{{$t('mxpcweb.systemset.bizfield.1530336724854')}}</el-button>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
/**
 * 描述：系统设置=>业务字段配置
 * 作者：向士健
 * 时间：2017/11/30
 */
import { isArray } from '@/libs/utils.js'
export default {
  name: 'dialogAddField',
  props: {
    menuItem: {
      type: Object,
      default: () => {
          return {}
      }
    },
    moduleCode: {
      type: String
    },
    strucId: {
      type: Number
    }
  },
  data () {
    return {
      downValues: [], // 展示用的下拉值数组
      isLoading: false,
      typeArr: [], // 字段类型下拉选择
      typeDropDown: {
        noValue: '', // 预览
        noValue2: [], // 预览
        newIndex: 1// 递增
      },
      typeAutoNum: {
        date: ['无日期', 'yyyymmdd', 'yyyymmdd']
      },
      isOpen: false, // 弹窗开关
      titleType: '', // 弹窗是修改还是新增
      fieldType: '文本么',
      dialog: {
        fieldId: '',
        controlTypeId: '',
        attrCaption: '',
        enAttrCaption: '',
        cnFieldHint: '',
        enFieldHint: '',
        opType: 'add',
        // itemName: ['下拉值1', '下拉值2'],
        itemName: [],
        prefix: '',
        dateFormat: '',
        postfix: '001',
        controlType: {
          cnName: ''
        }
      },

      dialogRules: {
        controlTypeId: [
          /*  请选择字段类型 */
          { required: true, message: this.$t('mxpcweb.systemset.bizfield.1530337225775'), trigger: 'change' }
        ],
        attrCaption: [
          /* 请输入显示名称 */
          { required: true, message: this.$t('mxpcweb.systemset.bizfield.1530337281694'), trigger: 'blur' },
          /* 长度在 1 到 12 个字符 */
          { min: 1, max: 12, message: this.$t('mxpcweb.systemset.bizfield.1530337851943'), trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 禁用这个下拉字段
    disabledDown (item) {
      let _this = this
      /* '禁用后将无法启用, 是否禁用【xxx】字段?', */
      let c = this.$t('mxpcweb.systemset.bizfield.1530338806311', [item.itemName])
      /* '提示' */
      let t = this.$t('mxpcweb.systemset.bizfield.1530338834118')
      /* 确定 */
      let s = this.$t('mxpcweb.systemset.bizfield.1530338863969')
      /* '取消' */
      let n = this.$t('mxpcweb.systemset.bizfield.1530338879661')
      this.$confirm(c, t, {
        confirmButtonText: s,
        cancelButtonText: n,
        type: 'warning'
      }).then(() => {
        // console.log(item)
        let data = {
          type: 'edit',
          dictCode: item.dictCode + '',
          dictItemCode: item.dictItemCode + '',
          inUse: 0
        }
        // console.log(data)
        // return
        _this.$http.put(_this.Global.baseURL + _this.Global.api.v2.product_attrDictItem, data).then(function (res) {
          if (res.body.code.toString() == _this.Global.RES_OK) {
            /* 已禁用 */
            _this.$message.success(this.$t('mxpcweb.systemset.bizfield.1530329437805'))
            _this.downValues.forEach(item2 => {
              if (item2.dictItemCode == item.dictItemCode) {
                item2.inUse = 0
              }
            })

            ep.emit('storeInit')// 更新 store 数据
            _this.updateEditSetList(_this.moduleCode) // 更新客户模块字段
          } else {
            _this.$message.error(_this.msg(res.body))
          }
        }, function (res) {
          _this.$message.error(_this.$t(_this.Global.errorTitle))
        })
      }).catch(() => { })
    },
    // 预览下拉值，合并
    cumputerView () {
      let arr = []
      this.dialog.itemName.forEach(item => {
        arr.push({
          itemName: item
        })
      })
      return this.downValues.concat(arr)
    },
    // 下拉类型项，点删除
    typeDropDownDel (index) {
      let arr = this.dialog.itemName
      arr.splice(index, 1)
      this.typeDropDown.noValue = ''// 清空一下
      this.typeDropDown.noValue2 = []// 清空一下
    },
    // 下拉类型项，点添加
    typeDropDownAdd () {
      /* 下拉值x */
      let text = this.$t('mxpcweb.systemset.bizfield.1530335248503') + this.typeDropDown.newIndex
      this.dialog.itemName.push(text)
      this.typeDropDown.newIndex++
    },
    // 父组件调用，修改，传值
    modifyField (item) {
      // console.log(item)
      this.isOpen = true
      this.titleType = 'modify'
      item.itemName = []
      this.dialog = JSON.parse(JSON.stringify(item))
      this.dialog.type = '1'
      this.isLoading = true
      let _this = this
      // 类型为下拉时，下拉值要单独 获取
      if (item.controlTypeId == 60 || item.controlTypeId == 61) {
        let data = {
          type: 'list',
          dictCodeStr: item.dictCode
        }
        _this.$http.get(this.Global.baseURL + this.Global.api.v2.product_attrDictItem, { params: data }).then(function (res) {
          if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
            this.isLoading = false
            let resData = res.body.data
        // console.log(resData)
            if (resData.length === 0) { return }
            _this.downValues = resData
          } else {
            _this.$message.error(_this.msg(res.body))
          }
        }, function (res) {
          _this.$message.error(_this.$t(_this.Global.errorTitle))
        })
      }
    },
    // 提交修改
    submitModify (formName) {
      let _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            type: 'edit',
            catgId: _this.menuItem.catgId,
            attrId: _this.dialog.attrId,
            attrCaption: _this.dialog.attrCaption,
            enAttrCaption: _this.dialog.enAttrCaption,
            cnFieldHint: _this.dialog.cnFieldHint,
            enFieldHint: _this.dialog.enFieldHint,
            itemValues: _this.dialog.itemName.join(',')
          }
          // console.log(data)
          // return
          _this.$http.put(_this.Global.baseURL + _this.Global.api.v2.product_catgAttrSet, data).then(function (res) {
            if (res.body.code.toString() == _this.Global.RES_OK) {
              /* 修改成功 */
              _this.$message.success(this.$t('mxpcweb.systemset.bizfield.1530338949629'))
              _this.isOpen = false
              _this.$emit('success')// 刷新父组件列表
            } else {
              _this.$message.error(_this.msg(res.body))
            }
          }, function (res) {
            _this.$message.error(_this.$t(_this.Global.errorTitle))
          })

          // let data = {
          //   moduleCode: _this.moduleCode,
          //   strucId: _this.strucId,
          //   fieldId: _this.dialog.fieldId,
          //   attrCaption: _this.dialog.attrCaption,
          //   enAttrCaption: _this.dialog.enAttrCaption || '',
          //   cnFieldHint: _this.dialog.cnFieldHint,
          //   enFieldHint: _this.dialog.enFieldHint || '',
          //   itemName: _this.dialog.itemName,
          //   prefix: _this.dialog.prefix,
          //   dateFormat: _this.dialog.dateFormat,
          //   postfix: _this.dialog.postfix
          // }
          // // 按类型，还要给不同的参数~~~ 这接口 已醉晕~
          // switch (_this.dialog.controlTypeId) {
          //   // case "2":
          //   case '3':
          //   case '37':
          //     data.type = 'name'
          //     data.opType = 'add'
          //     break
          //   case '11':
          //     data.type = 'autoidformat'
          //     break
          //   default:
          //     data.type = 'name'
          //     data.itemName = []
          //     data.prefix = ''
          //     data.dateFormat = ''
          //     data.postfix = ''
          // }
          // // console.log(data);
          // _this.$http.put(_this.Global.baseURL + _this.Global.api.v2.bizField_update, data).then(function (res) {
          //   if (res.body.code.toString() == _this.Global.RES_OK) {
          //     /* 修改成功 */
          //     _this.$message.success(this.$t('mxpcweb.systemset.bizfield.1530338949629'))
          //     _this.isOpen = false
          //     _this.$emit('reGetData')// 刷新父组件列表

          //     ep.emit('storeInit')// 更新 store 数据
          //   } else {
          //     _this.$message.error(_this.msg(res.body))
          //   }
          // }, function (res) {
          //   _this.$message.error(_this.$t(_this.Global.errorTitle))
          // })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 新增
    submitAdd (formName) {
      let _this = this
      // console.log(this.dialog)
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            catgId: _this.menuItem.catgId,
            controlTypeId: _this.dialog.controlTypeId,
            attrCaption: _this.dialog.attrCaption,
            enAttrCaption: _this.dialog.enAttrCaption,

            cnFieldHint: _this.dialog.cnFieldHint,
            enFieldHint: _this.dialog.enFieldHint,
            dictNames: _this.dialog.itemName.join(',')
          }
          // console.log(this.dialog)
          // console.log(data)
          // return
          // _this.$http.post(_this.Global.baseURL + _this.Global.api.v2.document_product_fieldList_add, data).then(function (res) {
          _this.$http.post(_this.Global.baseURL + _this.Global.api.v2.product_catgAttrSet, data).then(function (res) {
            if (res.body.code.toString() == _this.Global.RES_OK) {
              /* 添加成功 */
              _this.$message.success(this.$t('mxpcweb.systemset.bizdict.1530328077452'))
              _this.isOpen = false
              _this.$emit('success')// 刷新父组件列表
            } else {
              _this.$message.error(_this.msg(res.body))
            }
          }, function (res) {
            _this.$message.error(_this.$t(_this.Global.errorTitle))
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 获取字段类型,下拉
    getTypeData () {
      let _this = this
      let data = {
        type: 'product',
        moduleCode: _this.moduleCode,
        strucId: _this.strucId
      }
      _this.$http.get(this.Global.baseURL + this.Global.api.SystemSet.bizfield.bizFieldQuery, { params: data }).then(function (res) {
        if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
          // console.log(res.body.data);
          _this.typeArr = res.body.data
        } else {
          _this.$message.error(_this.msg(res.body))
        }
      }, function (res) {
        _this.$message.error(_this.$t(_this.Global.errorTitle))
      })
    },
    // 父组件调用新增，传值
    addField () {
      this.isOpen = true
      this.titleType = 'add'
      // this.dialog.goodsType = '1'
      this.getTypeData()// 获取类型下拉
      // this.getDateFormatData()// 获取日期下拉
    },
    // 清空表单
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.dialog = {
        fieldId: '',
        controlTypeId: '',
        attrCaption: '',
        enAttrCaption: '',
        cnFieldHint: '',
        enFieldHint: '',
        opType: 'add',
        // itemName: ['下拉值1', '下拉值2'],
        itemName: [],
        prefix: '',
        dateFormat: '',
        postfix: '001',
        controlType: {
          cnName: ''
        }
      }
      this.selectChange()
    },
    // 下拉改变时，清空测试下拉值
    selectChange () {
      this.downValues = []
      this.typeDropDown = {
        noValue: '', // 预览
        noValue2: [], // 预览
        newIndex: 1// 递增
      }
      this.dialog.itemName = []
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
