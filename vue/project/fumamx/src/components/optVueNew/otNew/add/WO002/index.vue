<template>
    <div class="AddFeedback">
        <!-- 提交反馈 -->
        <el-dialog :title="$t('mxpcweb.systemset.feedback.1529065305866')" v-dialogDrag :visible.sync="addRemindDialogVisible" custom-class="width520" :closeOnClickModal="false" :before-close="closeAddRemindDialog" class="addRemindDialog" :modal-append-to-body="false">
            <el-form :model="addRemindForm" onsubmit="return false" class="FeedbackForm" :rules="addRemindFormRules" ref="addRemindForm" label-width="100px" label-position="left">
                <!-- 问题分类 -->
                <el-form-item :label="$t('mxpcweb.systemset.feedback.1529065367148')" prop="category">
                    <div>
                        <!-- 请输入内容 -->
                        <el-select v-model="addRemindForm.category" clearable :placeholder="$t('mxpcweb.systemset.feedback.1529067191488')" style="width:300px" size="small">
                            <el-option v-for="item in getDataOptions('25')" :key="item.dictItemCode"  :label="item.itemName" :value="item.dictItemCode+''">
                            </el-option>
                        </el-select>
                    </div>
                </el-form-item>
                <!-- 问题标题 -->
                <el-form-item :label="$t('mxpcweb.systemset.feedback.1529066239831')" prop="caption">
                    <div>
                        <el-input type="textarea" :rows="1" v-model="addRemindForm.caption" size="small"></el-input>
                    </div>
                </el-form-item>
                <!-- 问题内容 -->
                <el-form-item :label="$t('mxpcweb.systemset.feedback.1529067220461')" prop="content">
                    <div>
                        <el-input type="textarea" :rows="4" v-model="addRemindForm.content" size="small"></el-input>
                    </div>
                </el-form-item>
                <el-form-item v-if="addRemindDialogVisible">
                    <label for="importScollBox_excels3" class="attachment">
                        <!-- 上传附件 -->
                        <i class="iconfont icon-attachment"></i>{{$t('mxpcweb.client.1529056859354')}}</label>
                    <file-upload ref="fileUpload" :file-list.sync="addRemindForm.attachfile" :limitSize="10">
                        <!-- 选择文件 -->
                        <el-button id="importScollBox_excels3" slot="trigger" size="small" type="primary" v-show="false">{{$t('mxpcweb.client.1529048918632')}}</el-button>
                    </file-upload>
                </el-form-item>
                <!-- 优先级 -->
                <el-form-item :label="$t('mxpcweb.systemset.feedback.1529065441662')" prop="priority">
                    <div>
                        <!-- 请输入内容 -->
                        <el-select clearable v-model="addRemindForm.priority" :placeholder="$t('mxpcweb.systemset.feedback.1529067220461')" style="width:300px" size="small">
                            <el-option v-for="item in getDataOptions('22')" :key="item.dictItemCode" :label="item.itemName" :value="item.dictItemCode+''">
                            </el-option>
                        </el-select>
                    </div>
                </el-form-item>
                <!-- 手机号 -->
                <el-form-item :label="$t('mxpcweb.systemset.feedback.1529067272887')" prop="mobile">
                    <div>
                        <!-- 请输入手机号 -->
                        <el-input v-model="addRemindForm.mobile" :placeholder="$t('mxpcweb.systemset.feedback.1529067283183')" size="small"></el-input>
                    </div>
                </el-form-item>
                <!-- 邮箱 -->
                <el-form-item :label="$t('mxpcweb.client.1529056101685')" prop="mailAddress">
                    <div>
                        <!-- 请输入邮箱 -->
                        <el-input v-model="addRemindForm.mailAddress1" :placeholder="$t('mxpcweb.systemset.feedback.1529067324318')" size="small"></el-input>
                    </div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialogFooter" >
                <!-- 提交 -->
                <el-button class="footerButton" type="primary" @click="submitForm()" :loading="loading">{{$t('mxpcweb.systemset.feedback.1529066566743')}}</el-button>
                <!-- 取消 -->
                <el-button class="footerButton" @click="addRemindDialogVisible = false">{{$t('mxpcweb.client.1529047588840')}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import FileUpload from '@/components/orderFileUpload/index' // 文件上传
export default {
  name: 'AddFeedback',
  props: {

  },
  data () {
    let checkPhone = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else {
        let myreg = /^[1][3,4,5,7,8][0-9]{9}$/
        if (!myreg.test(value)) {
          // 请输入正确的手机号
          callback(new Error(this.$t('mxpcweb.systemset.feedback.1529067376151')))
        } else {
          callback()
        }
      };
    }
    let checkMail = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else {
        let myreg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
        if (!myreg.test(value)) {
          // 请输入正确的手机号
          callback(new Error(this.$t('mxpcweb.systemset.feedback.1529067376151')))
        } else {
          callback()
        }
      }
    }
    return {
      addRemindDialogVisible: false,
      addRemindForm: {
        priority: '0',
        category: '1',
        caption: '',
        content: '',
        mobile: '',
        mailAddress: '',
        attachfile: [],
        product: ''
      },
      loading: false,
      addRemindFormRules: {
        priority: [{
          type: 'string',
          required: true,
          // 请选择优先级
          message: this.$t('mxpcweb.client.1529135232587'),
          trigger: 'change'
        }],
        category: [{
          type: 'string',
          required: true,
          // 请选择问题分类
          message: this.$t('mxpcweb.client.1529135276165'),
          trigger: 'change'
        }],
        caption: [{
          type: 'string',
          required: true,
          // 请填写问题标题
          message: this.$t('mxpcweb.client.1529135289550'),
          trigger: 'blur'
        }],
        content: [{
          type: 'string',
          required: true,
          // 请输入问题内容
          message: this.$t('mxpcweb.client.1529135305859'),
          trigger: 'blur'
        }],
        mobile: [
          { validator: checkPhone, required: true, trigger: 'blur' }
        ],
        mailAddress1: [
          { validator: checkMail, required: true, trigger: 'blur' }
        ]
      },
      firstInto: false,
      callBack: function() {}
    }
  },
  created () {
  },
  mounted () {
  },
  computed: {
    ...mapGetters([
      'sysBoxValue', 'personalInfo'
    ])
  },
  methods: {
    getDataOptions (dictCode) {
      let options = []
      if (this.sysBoxValue instanceof Array) {
        this.sysBoxValue.forEach(element => {
          if (element.dictCode == dictCode) {
            options = element.dictItems
          }
        })
      }
      return options
    },
    openWindow (obj) {
      let _this = this
      _this.firstInto = true
      _this.addRemindForm = {
        priority: '0',
        category: '1',
        caption: '',
        content: '',
        custId: '0', // 写0
        mobile: _this.personalInfo.mobile,
        mailAddress1: _this.personalInfo.email,
        attachfile: [],
        product: ''
      }
      if (obj.next) {
          _this.callback = obj.next
      } else {
          _this.callback = function() {}
      }
      _this.addRemindDialogVisible = true
    },
    // 关闭添加消对话框
    closeAddRemindDialog () {
      this.resetForm('addRemindForm')
      this.addRemindDialogVisible = false
    },
    // 提交表单
    submitForm () {
      let _this = this
      let isPass = true
      this.$refs['addRemindForm'].validate((valid) => {
        if (valid) {
          return true
        } else {
          isPass = false
        }
      })
      if (!isPass) {
        return false
      }
      _this.submitData()
    },
    submitData (data) {
      let _this = this
      if (data) {
        _this.addRemindForm.fileIds = data
      }
      _this.addRemindForm.mailAddress = []
      _this.addRemindForm.mailAddress.push(_this.addRemindForm.mailAddress1)
      this.loading = true
      _this.$http.post(_this.Global.baseURL + _this.Global.api.v2.document_feedback, _this.addRemindForm).then((res) => {
        if (res.body.code.toString() == _this.Global.RES_OK) {
          _this.$message.success(_this.msg(res.body))
          _this.addRemindDialogVisible = false
          _this.callback()
          _this.loading = false
        } else {
          _this.$message.error(_this.msg(res.body))
          _this.loading = false
        }
      }, (res) => {
        _this.$message.error(_this.$t(_this.Global.errorTitle))
        _this.loading = false
      })
    },
    // 重置表单
    resetForm () {
    },
    attachmentClick () {
      $('#attachment').click()
    }

  },
  beforeDestroy: function () {
    this.getDataOptions = null
  },
  components: {
    'file-upload': FileUpload
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
.more {
  text-align: center;
  color: grey;
  margin-bottom: 10px;
}
</style>
