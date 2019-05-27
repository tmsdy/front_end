<template>
    <div class="dialogAddField">
        <!-- 弹窗 / 添加 -->
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
                    {{fieldType}}
                    <!--{{dialog.controlTypeId}}-->
                </el-form-item>

                <!-- 显示名称 -->
                <el-form-item :label="$t('mxpcweb.systemset.bizfield.1530336122308')" prop="cnFieldCaption">
                    <!-- 请填写显示名称，最长12个字符 -->
                    <el-input v-model="dialog.cnFieldCaption" :placeholder="$t('mxpcweb.systemset.bizfield.1530336340175')"></el-input>
                </el-form-item>
                <!-- 英文名称 -->
                <el-form-item :label="$t('mxpcweb.systemset.bizfield.1530328407834')" prop="enFieldCaption">
                    <!-- 请填写英文名称，最长24个字符 -->
                    <el-input v-model="dialog.enFieldCaption" :placeholder="$t('mxpcweb.systemset.bizfield.1530336403647')"></el-input>
                </el-form-item>
                <!-- 输入提示 -->
                <el-form-item :label="$t('mxpcweb.systemset.bizfield.1530336437172')" prop="cnFieldHint">
                    <!-- 请填写显示名称，最长12个字符 -->
                    <el-input v-model="dialog.cnFieldHint" :placeholder="$t('mxpcweb.systemset.bizfield.1530336340175')"></el-input>
                </el-form-item>
                <!-- 英文输入提示 -->
                <el-form-item :label="$t('mxpcweb.systemset.bizfield.1530336546680')" prop="enFieldHint">
                    <!-- 请填写显示名称，最长12个字符 -->
                    <el-input v-model="dialog.enFieldHint" :placeholder="$t('mxpcweb.systemset.bizfield.1530336340175')"></el-input>
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
        cnFieldCaption: '',
        enFieldCaption: '',
        cnFieldHint: '',
        enFieldHint: '',
        opType: 'add',
        // itemName: ['下拉值1', '下拉值2'],
        itemName: [],
        prefix: '',
        dateFormat: '',
        postfix: '001'
        // goodsType: '1' // 新增商品类型(1：商品属性；2：规格属性)
      },
      dialogRules: {
        controlTypeId: [
          /*  请选择字段类型 */
          { required: true, message: this.$t('mxpcweb.systemset.bizfield.1530337225775'), trigger: 'change' }
        ],
        cnFieldCaption: [
          /* 请输入显示名称 */
          { required: true, message: this.$t('mxpcweb.systemset.bizfield.1530337281694'), trigger: 'blur' },
          /* 长度在 1 到 12 个字符 */
          { min: 1, max: 12, message: this.$t('mxpcweb.systemset.bizfield.1530337851943'), trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    typeAutoNumReturn () {
      let prefix = this.dialog.prefix
      let dateFormatShow

      if (this.dialog.dateFormat == '' || this.dialog.dateFormat == '无日期') {
        dateFormatShow = ''
      } else {
        dateFormatShow = this.$moment(new Date()).format(this.dialog.dateFormat)
      }
      let postfix = this.dialog.postfix
      return prefix + dateFormatShow + postfix
    }
  },
  methods: {
    // 父组件调用，修改，传值
    // modifyField (id, controlTypeId, cnFieldCaption, enFieldCaption, cnFieldHint, enFieldHint, autoIdFormat, fieldType) {
      // item2.fieldId,item2.controlTypeId,item2.cnFieldCaption,item2.enFieldCaption,item2.cnFieldHint,item.enFieldHint,item2.autoIdFormat,item2.fieldType
    modifyField (item) {
      console.log(item)
      this.isOpen = true
      this.titleType = 'modify'
      this.dialog = JSON.parse(JSON.stringify(item))
      this.dialog.type = '1' // ****************************************************************************
      // let _this = this
      // this.dialog.fieldId = id // 字段的ID
      // this.dialog.controlTypeId = controlTypeId + ''// 这条字段类型的ID
      // this.isLoading = true
      // // console.log(id);
      // // console.log(controlTypeId);
      // // 类型为下拉时，下拉值要单独 获取
      // if (controlTypeId == 3 || controlTypeId == 37) {
      //   let data = {
      //     type: 'spinnerValue', // spinnerValues 去了 S 为获取单个
      //     moduleCode: _this.moduleCode,
      //     strucId: _this.strucId,
      //     fieldId: id
      //   }
      //   // console.log(data);
      //   _this.$http.get(this.Global.baseURL + this.Global.api.SystemSet.bizfield.bizFieldQuery, { params: data }).then(function (res) {
      //     if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
      //       this.isLoading = false
      //       // 接口什么时候改返回类型了？服务了我的接口
      //       let resData = res.body.data
      //       if (resData.length === 0) { return }
      //       // let newItem = [];
      //       // resData.forEach(function(item) {
      //       //     newItem.push(item.itemName);
      //       // });
      //       // _this.dialog.itemName = newItem;
      //       // console.log(resData);
      //       _this.downValues = resData
      //     } else {
      //       _this.$message.error(_this.msg(res.body))
      //     }
      //   }, function (res) {
      //     _this.$message.error(_this.$t(_this.Global.errorTitle))
      //   })
      // }

      // // 自动编号也是要处理，醉了
      // if (autoIdFormat != '') {
      //   let autoIdFormatArr = autoIdFormat.split(',')
      //   this.dialog.prefix = autoIdFormatArr[0]
      //   this.dialog.dateFormat = autoIdFormatArr[1]
      //   this.dialog.postfix = autoIdFormatArr[2]
      // }

      // this.dialog.cnFieldCaption = cnFieldCaption
      // this.dialog.enFieldCaption = enFieldCaption
      // this.dialog.cnFieldHint = cnFieldHint
      // this.dialog.enFieldHint = enFieldHint

      // this.fieldType = fieldType
      // this.getDateFormatData()// 获取日期下拉
    },
    // 提交修改
    submitModify (formName) {
      let _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            type: 'edit',
            catgId: _this.menuItem.catgId,
            fieldId: _this.dialog.catgFieldId,
            cnFieldCaption: _this.dialog.cnFieldCaption,
            enFieldCaption: _this.dialog.enFieldCaption,
            cnFieldHint: _this.dialog.cnFieldHint,
            enFieldHint: _this.dialog.enFieldHint
          }
          console.log(data)
          _this.$http.put(_this.Global.baseURL + _this.Global.api.v2.document_product_fieldList_put, data).then(function (res) {
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
          //   cnFieldCaption: _this.dialog.cnFieldCaption,
          //   enFieldCaption: _this.dialog.enFieldCaption || '',
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
            cnFieldCaption: _this.dialog.cnFieldCaption,
            enFieldCaption: _this.dialog.enFieldCaption,
            cnFieldHint: _this.dialog.cnFieldHint,
            enFieldHint: _this.dialog.enFieldHint,
            controlTypeId: _this.dialog.controlTypeId
            // type: _this.dialog.goodsType
          }
          // console.log(data)
          _this.$http.post(_this.Global.baseURL + _this.Global.api.v2.document_product_fieldList_add, data).then(function (res) {
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
        type: 'controlType',
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
    // 获取自动编号，日期下拉
    // getDateFormatData () {
    //   let _this = this
    //   _this.$http.get(this.Global.baseURL + this.Global.api.UniversalInterface.dictionaryInf, { params: { id: 'autodateformat' } }).then(function (res) {
    //     if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
    //       // console.log(res.body.data);
    //       _this.typeAutoNum.date = res.body.data
    //     } else {
    //       _this.$message.error(_this.msg(res.body))
    //     }
    //   }, function (res) {
    //     _this.$message.error(_this.$t(_this.Global.errorTitle))
    //   })
    // },
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
        cnFieldCaption: '',
        enFieldCaption: '',
        cnFieldHint: '',
        enFieldHint: '',
        opType: 'add',
        itemName: [],
        prefix: '',
        dateFormat: '',
        postfix: '001'
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
