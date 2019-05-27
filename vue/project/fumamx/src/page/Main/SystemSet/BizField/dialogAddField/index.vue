<template>
    <div class="dialogAddField">

        <!-- 弹窗 / 添加 -->
        <!-- '新增字段':'修改字段' -->
        <el-dialog v-dialogDrag :title="titleType=='add'?$t('mxpcweb.systemset.bizfield.1530328248412'):$t('mxpcweb.systemset.bizfield.1530335090644')" :visible.sync="isOpen" custom-class="width420" @close="resetForm('dialogForm')">
            <el-form :model="dialog" :rules="dialogRules" ref="dialogForm" label-width="108px">
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

                <!-- 自定义下拉 -->
                <div class="typeDropDown" v-if="dialog.controlTypeId==3" v-loading="isLoading">
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
                    <el-form-item :label="$t('mxpcweb.systemset.bizfield.1530335521972')">
                        <!-- 效果预览 -->
                        <el-select v-model="typeDropDown.noValue" :placeholder="$t('mxpcweb.systemset.bizfield.1530335564676')" size="small">
                            <el-option v-for="(item,index) in cumputerView()" :key="index" :label="item.itemName" :value="index" :disabled="item.inUse == 0"> </el-option>
                        </el-select>
                    </el-form-item>
                </div>

                <!-- 自定义多选下拉 -->
                <div class="typeDropDown" v-if="dialog.controlTypeId==37" v-loading="isLoading">
                    <dl>
                        <!--下拉值 -->
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
                            <dd v-for="(item,index) in dialog.itemName" :key="'b'+index">
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
                    <!-- 多选效果预览 -->
                    <el-form-item :label="$t('mxpcweb.systemset.bizfield.1530335913741')">
                        <!-- 效果预览 -->
                        <el-select v-model="typeDropDown.noValue2" multiple :placeholder="$t('mxpcweb.systemset.bizfield.1530335564676')" size="small">
                            <el-option v-for="(item,index) in cumputerView()" :key="index" :label="item.itemName" :value="index" :disabled="item.inUse == 0"> </el-option>
                        </el-select>
                    </el-form-item>
                </div>

                <!-- 自动编号 -->
                <div class="typeAutoNum" v-if="dialog.controlTypeId==11">
                    <table>
                        <tr>
                            <!-- 前缀 -->
                            <td>{{$t('mxpcweb.systemset.bizfield.1530336006638')}}</td>
                            <!-- 日期 -->
                            <td>{{$t('mxpcweb.systemset.bizfield.1530336085190')}}</td>
                            <!--起始编号  -->
                            <td>{{$t('mxpcweb.systemset.bizfield.1530336098550')}}</td>
                        </tr>
                        <tr>
                            <td>
                                <!-- 前缀 -->
                                <el-input v-model="dialog.prefix" size="small" :placeholder="$t('mxpcweb.systemset.bizfield.1530336006638')" @change="prefixChange"></el-input>
                            </td>
                            <td>
                                <!-- 日期 -->
                                <el-select v-model="dialog.dateFormat" size="small" :placeholder="$t('mxpcweb.systemset.bizfield.1530336085190')">
                                    <el-option v-for="(item,index) in typeAutoNum.date" :key="index" :label="item.itemName" :value="item.itemName"> </el-option>
                                </el-select>
                            </td>
                            <td>
                                <!-- 起始编号 -->
                                <el-input v-model="dialog.postfix" size="small" placeholder="$t('mxpcweb.systemset.bizfield.1530336098550')" @change="numPostfixChange" @blur="numPostfixBlur"></el-input>
                            </td>
                        </tr>
                    </table>
                    <!-- 效果预览 -->
                    <el-form-item :label="$t('mxpcweb.systemset.bizfield.1530335564676')" prop="type">{{typeAutoNumReturn}}</el-form-item>
                </div>
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
  created () { },
  methods: {
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
          type: 'name',
          opType: 'forbidden',
          moduleCode: _this.moduleCode,
          strucId: _this.strucId,
          fieldId: _this.dialog.fieldId,
          dictItemCodes: [item.dictItemCode + ''],
          enFieldCaption: _this.dialog.enFieldCaption || '',
          enFieldHint: _this.dialog.enFieldHint || '',
          cnFieldCaption: _this.dialog.cnFieldCaption// 接口要求必传
        }
        // console.log(data);
        // _this.$http.put(_this.Global.baseURL + _this.Global.api.SystemSet.bizfield.bizFieldUpdate, data).then(function (res) {
        _this.$http.put(_this.Global.baseURL + _this.Global.api.v2.bizField_update, data).then(function (res) {
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
    // 父组件调用，修改，传值
    modifyField (id, controlTypeId, cnFieldCaption, enFieldCaption, cnFieldHint, enFieldHint, autoIdFormat, fieldType) {
      let _this = this
      this.dialog.fieldId = id // 字段的ID
      this.dialog.controlTypeId = controlTypeId + ''// 这条字段类型的ID
      this.isLoading = true
      // console.log(id);
      // console.log(controlTypeId);
      // 类型为下拉时，下拉值要单独 获取
      if (controlTypeId == 3 || controlTypeId == 37) {
        let data = {
          type: 'spinnerValue', // spinnerValues 去了 S 为获取单个
          moduleCode: _this.moduleCode,
          strucId: _this.strucId,
          fieldId: id
        }
        // console.log(data);
        _this.$http.get(this.Global.baseURL + this.Global.api.SystemSet.bizfield.bizFieldQuery, { params: data }).then(function (res) {
          if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
            this.isLoading = false
            // 接口什么时候改返回类型了？服务了我的接口
            let resData = res.body.data
            if (resData.length === 0) { return }
            // let newItem = [];
            // resData.forEach(function(item) {
            //     newItem.push(item.itemName);
            // });
            // _this.dialog.itemName = newItem;
            // console.log(resData);
            _this.downValues = resData
          } else {
            _this.$message.error(_this.msg(res.body))
          }
        }, function (res) {
          _this.$message.error(_this.$t(_this.Global.errorTitle))
        })
      }

      // 自动编号也是要处理，醉了
      if (autoIdFormat != '') {
        let autoIdFormatArr = autoIdFormat.split(',')
        this.dialog.prefix = autoIdFormatArr[0]
        this.dialog.dateFormat = autoIdFormatArr[1]
        this.dialog.postfix = autoIdFormatArr[2]
      }

      this.dialog.cnFieldCaption = cnFieldCaption
      this.dialog.enFieldCaption = enFieldCaption
      this.dialog.cnFieldHint = cnFieldHint
      this.dialog.enFieldHint = enFieldHint

      this.isOpen = true
      this.titleType = 'modify'
      this.fieldType = fieldType
      this.getDateFormatData()// 获取日期下拉
    },
    // 提交修改
    submitModify (formName) {
      let _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            moduleCode: _this.moduleCode,
            strucId: _this.strucId,
            fieldId: _this.dialog.fieldId,
            cnFieldCaption: _this.dialog.cnFieldCaption,
            enFieldCaption: _this.dialog.enFieldCaption || '',
            cnFieldHint: _this.dialog.cnFieldHint,
            enFieldHint: _this.dialog.enFieldHint || '',
            itemName: _this.dialog.itemName,
            prefix: _this.dialog.prefix,
            dateFormat: _this.dialog.dateFormat,
            postfix: _this.dialog.postfix
          }
          // 按类型，还要给不同的参数~~~ 这接口 已醉晕~
          switch (_this.dialog.controlTypeId) {
            // case "2":
            case '3':
            case '37':
              data.type = 'name'
              data.opType = 'add'
              break
            case '11':
              data.type = 'autoidformat'
              break
            default:
              data.type = 'name'
              data.itemName = []
              data.prefix = ''
              data.dateFormat = ''
              data.postfix = ''
          }
          // console.log(data);
          _this.$http.put(_this.Global.baseURL + _this.Global.api.v2.bizField_update, data).then(function (res) {
            if (res.body.code.toString() == _this.Global.RES_OK) {
              /* 修改成功 */
              _this.$message.success(this.$t('mxpcweb.systemset.bizfield.1530338949629'))
              _this.isOpen = false
              _this.$emit('reGetData')// 刷新父组件列表

              ep.emit('storeInit')// 更新 store 数据
              _this.updateEditSetList(_this.moduleCode) // 更新客户模块字段
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
    // 前缀禁中文
    prefixChange (val) {
      let _this = this
      setTimeout(function () {
        _this.dialog.prefix = val.replace(/[\u4e00-\u9fa5]|\s/g, '')
      }, 20)
    },
    // 起始编号输入限制
    numPostfixChange (val) {
      let _this = this
      setTimeout(function () {
        _this.dialog.postfix = val.replace(/\D/g, '').substr(0, 3)
      }, 20)
    },
    // 起始编号输入限制
    numPostfixBlur () {
      switch (this.dialog.postfix) {
        case '000':
          this.dialog.postfix = '001'
          break
        case '00':
          this.dialog.postfix = '01'
          break
        case '0':
          this.dialog.postfix = '1'
          break
      }
    },
    // 新增
    submitAdd (formName) {
      let _this = this
      // 非空验证
      if (_this.dialog.controlTypeId == '11') {
        if (_this.dialog.prefix == '') {
          /* 自动编号前缀不能为空  */
          _this.$message.error(this.$t('mxpcweb.systemset.bizfield.1530339028549'))
          return
        }
        if (_this.dialog.dateFormat == '') {
          /* 自动编号日期不能为空 */
          _this.$message.error(this.$t('mxpcweb.systemset.bizfield.1530339016278'))
          return
        }
      }
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialog.moduleCode = this.moduleCode
          this.dialog.strucId = this.strucId + ''
          // console.log(_this.dialog);
          _this.$http.post(_this.Global.baseURL + _this.Global.api.SystemSet.bizfield.bizFieldAdd, _this.dialog).then(function (res) {
            if (res.body.code.toString() == _this.Global.RES_OK) {
              /* 添加成功 */
              _this.$message.success(this.$t('mxpcweb.systemset.bizdict.1530328077452'))
              _this.isOpen = false
              _this.$emit('reGetData')// 刷新父组件列表

              ep.emit('storeInit')// 更新 store 数据
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
    getDateFormatData () {
      let _this = this
      _this.$http.get(this.Global.baseURL + this.Global.api.UniversalInterface.dictionaryInf, { params: { id: 'autodateformat' } }).then(function (res) {
        if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
          // console.log(res.body.data);
          _this.typeAutoNum.date = res.body.data
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
      this.getTypeData()// 获取类型下拉
      this.getDateFormatData()// 获取日期下拉
    },
    // 下拉类型项，点删除
    typeDropDownDel (index) {
      let arr = this.dialog.itemName
      // if (arr.length < 2) {
      //     this.$message.info("下拉值请留一个吧");
      // } else {
      //     arr.splice(index, 1);
      //     this.typeDropDown.noValue = "";//清空一下
      //     this.typeDropDown.noValue2 = [];//清空一下
      // }
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
