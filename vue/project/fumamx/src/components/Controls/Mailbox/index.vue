<template>
    <el-form class="Controls-Mailbox" onsubmit="return false" :model="dynamicValidateForm" ref="dynamicValidateForm" :label-width="labelWidth" :label-position="labelPosition">

        <el-form-item :class="[itemData.isNotNull == 1 ? 'is-required' : '']" v-for="(item, index) in dynamicValidateForm.mailVals" :label="index==0 && showLabel ? itemData.cnFieldCaption : ''" :key="item.key" :prop="'mailVals.' + index + '.value'" :rules="rulesMailVal" :style="{'margin-bottom':isProp?0:''}">
            <el-input :disabled="itemData.disabled||itemData.disable" v-model="item.value" :size="size" :placeholder="itemData.cnFieldHint" @change="change" :style="{width: rightWidth}" ></el-input>
            <!-- 新增 -->
            <el-button :disabled="itemData.disabled" @click.prevent="addMail" :size="size" v-show="index === 0"><span style="color:RGBA(96, 98, 102, 1)">{{$t('mxpcweb.client.1529043854407')}}</span></el-button>
            <i></i>
            <!-- 删除 -->
            <el-button :disabled="itemData.disabled" @click.prevent="removeMail(item)" :size="size" v-show="index !== 0" :plain="true"><span style="color:RGBA(96, 98, 102, 1)">{{$t('mxpcweb.client.1529043913614')}}</span></el-button>

        </el-form-item>

        <!--<el-form-item>
                    <el-button type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button>
                    <el-button @click="addMail">新增域名</el-button>
                    <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>
                </el-form-item>-->

    </el-form>
</template>
<script>
import {isArray} from '@/libs/utils.js'
export default {
  name: 'Controls-Mailbox',
  props: {
    isProp: {
      type: Boolean,
      default: false
    },
    labelPosition: {
      type: String,
      default: 'right'
    },
    labelWidth: {
      type: String,
      default: '100px'
    },
    rightWidth: {
      type: String,
      default: '220px'
    },
    size: {
      type: String,
      default: 'small'
    },
    itemData: {
      type: Object,
      default: function () {
        return {}
      }
    },
    showLabel: {
      type: Boolean,
      default: true
    }
  },
  data () {
    let _this = this
    var checkMail = (rule, value, callback) => {
      if (value === '') {
        if (this.itemData.isNotNull == 1) {
          // 请输入
          callback(new Error(this.$t('mxpcweb.client.1529044011191') + _this.itemData.cnFieldCaption))
        } else {
          callback()
        }
      } else {
        // callback(new Error('表单验证中...'));
        callback()
        // let data = {
        //     fieldName: _this.itemData.fieldName,
        //     fieldValue: value,
        //     moduleCode:'BF003',
        //     searchType:'checkUnique'
        // };
        // //为编辑时，带上 contId
        // if(_this.itemData.contId !== undefined){
        //     data.identFieldValue = _this.itemData.contId;
        // }
        // _this.$http.get(this.Global.baseURL + this.Global.api.Client.clientmanag.documentConfigGet, { params: data }).then(function(res) {
        //     if (res.body.code.toString() == _this.Global.RES_OK) {
        //         if(res.body.data.isRepeat == 1){
        //             callback(new Error('系统中已经存在该'+_this.itemData.cnFieldCaption));
        //         }else{
        //             callback();
        //         }
        //     } else {
        //         _this.$message.error(_this.msg(res.body));
        //     }
        // }, function(res) {
        //     _this.$message.error(_this.$t(_this.Global.errorTitle));
        // });
      }
    }
    return {
      dynamicValidateForm: {
        mailVals: [{
          value: ''
        }]
      },
      rulesMailVal: [
        // 请输入正确的
        { type: 'email', message: this.$t('mxpcweb.client.1529044037487') + this.itemData.cnFieldCaption, trigger: 'blur,change' },
        { validator: checkMail, trigger: 'blur' }
      ],
      disable: true
    }
  },
  mounted () {

  },
  methods: {
    // 个别控件需要赋值时调用
    updatas (value, disable) {
      if (isArray(value)) {
        this.updata(value)
      } else {
        this.dynamicValidateForm.mailVals = [{
          value: value
        }]
      }
      if (disable) {
        this.dynamicValidateForm.mailVals[0].disable = disable
      }
    },
    // 修改数据时调用，用于更新传入的数据
    updata (items) {
      let _this = this
      if (items && isArray(items) && items.length > 0) {
        _this.dynamicValidateForm.mailVals = []
        items.forEach(function (item) {
          _this.dynamicValidateForm.mailVals.push({
            value: item
          })
        })
      } else if (_this.itemData.fieldValue && isArray(_this.itemData.fieldValue) && _this.itemData.fieldValue.length > 0) {
        // 先清空，再重新追加
        _this.dynamicValidateForm.mailVals = []
        _this.itemData.fieldValue.forEach(function (item) {
          _this.dynamicValidateForm.mailVals.push({
            value: item
          })
        })
      } else {
        _this.clearData()
      }
      // this.submitForm();//先对原有值验证一下
    },
    clearData () {
      this.dynamicValidateForm.mailVals = [{
        value: ''
      }]
    },
    submitForm () {
      let _this = this
      let isPass = true
      this.$refs['dynamicValidateForm'].validate((valid) => {
        if (valid) {
          // console.log(" 邮件控件： ");
          // console.log(_this.dynamicValidateForm.mailVals);
          _this.change()
        } else {
          isPass = false
          return false
        }
      })
      return isPass
    },
    change () {
      let _this = this
      let arr = []
      _this.dynamicValidateForm.mailVals.forEach(function (item) {
        if (arr.indexOf(item.value) == -1) {
          arr.push(item.value)
        }
      })
      _this.$emit('update:controlData', arr)
      // console.log(arr);
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    removeMail (item) {
      var index = this.dynamicValidateForm.mailVals.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateForm.mailVals.splice(index, 1)
      }
    },
    addMail () {
      this.dynamicValidateForm.mailVals.push({
        value: '',
        key: Date.now()
      })
    }
  },
  beforeDestroy: function () {
      this.removeMail = null
      this.resetForm = null
      this.updata = null
      this.updatas = null
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
</style>
