<template>
    <div class="AddWorkOrder">
        <!-- 创建工单 -->
        <el-dialog :title="$t('mxpcweb.client.1529132261395')" v-dialogDrag :visible.sync="addRemindDialogVisible" v-show="addRemindDialog" custom-class="width520" :closeOnClickModal="false" :before-close="closeAddRemindDialog" class="addRemindDialog" :modal-append-to-body="false">
            <el-form :model="addRemindForm" onsubmit="return false" class="FeedbackForm" :rules="addRemindFormRules" ref="addRemindForm" label-width="100px" label-position="left">
                <!-- 工单分类 -->
                <el-form-item :label="$t('mxpcweb.client.1529132331030')" prop="category">
                    <div>
                        <!-- 请选择工单分类 -->
                        <el-select  clearable v-model="addRemindForm.category" :placeholder="$t('mxpcweb.client.1529134596845')" style="width:300px" size="small">
                            <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </el-form-item>
                <!-- 工单标题 -->
                <el-form-item  :label="$t('mxpcweb.client.1529134610854')" prop="caption">
                    <div>
                        <!-- 请输入工单标题 -->
                        <el-input type="textarea" :rows="1" :placeholder="$t('mxpcweb.client.1529134624799')" v-model="addRemindForm.caption"  size="small"></el-input>
                    </div>
                </el-form-item>
                <!-- 问题描述 -->
                <el-form-item  :label="$t('mxpcweb.client.1529132388732')" prop="content">
                    <div>
                        <!-- 请添加问题描述 -->
                        <el-input type="textarea" :placeholder="$t('mxpcweb.client.1529134651846')" :rows="4" v-model="addRemindForm.content"  size="small"></el-input>
                    </div>
                </el-form-item>
                <el-form-item v-if="addRemindDialogVisible">
                    <!-- 上传附件 -->
                    <label for="importScollBox_excels4" class="text-hover" style="color:rgb(0, 140, 238)"><i class="iconfont icon-attachment"></i>{{$t('mxpcweb.client.1529056859354')}}</label>
                    <file-upload :file-list="files"  ref="fileUpload1" @submitData="submitData1" :limitSize="10">
                        <!-- 选择文件 -->
                        <el-button id="importScollBox_excels4" slot="trigger" size="small" type="primary"   v-show="false">{{$t('mxpcweb.client.1529048918632')}}</el-button>
                    </file-upload>
                </el-form-item>
                <!-- 工单优先级 -->
                <el-form-item :label="$t('mxpcweb.client.1529133479897')" prop="priority">
                    <div>
                        <!-- 请选择工单优先级 -->
                        <el-select clearable v-model="addRemindForm.priority" :placeholder="$t('mxpcweb.client.1529134706603')" style="width:300px" size="small">
                            <el-option v-for="item in priorityOptions" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </el-form-item>
                <!-- 工单受理人 -->
                <el-form-item :label="$t('mxpcweb.client.1529133549272')" prop="acceptCtId">
                    <div>
                        <!-- 请选择工单受理人 -->
                        <el-select clearable  filterable v-model="addRemindForm.acceptCtId" :placeholder="$t('mxpcweb.client.1529134731578')" style="width:300px" size="small">
                            <el-option v-for="item in personnelTable" :key="item.ctId" :label="item.realName" :value="item.ctId+''">
                            </el-option>
                        </el-select>
                    </div>
                </el-form-item>
                <!-- 客户 -->
                <el-form-item :label="$t('mxpcweb.client.1529049476377')" prop="custId">
                    <div>
                        <customer  labelWidth="0" :showLabel="false" rightWidth="300px" ref="customer"  :itemData="itemData1" :controlData.sync="itemData1.controlData"></customer>
                    </div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialogFooter">
                <!-- 提交 -->
                <el-button class="footerButton" type="primary" @click="submitForm()" :loading="loading">{{$t('mxpcweb.systemset.feedback.1529066566743')}}</el-button>
                <!-- 取消 -->
                <el-button class="footerButton" @click="addRemindDialogVisible = false" >{{$t('mxpcweb.client.1529047588840')}}</el-button>
            </div>
        </el-dialog>
        <!-- 处理工单 -->
        <el-dialog :title="$t('mxpcweb.client.1529134790350')" :visible.sync="addRemindDialogVisible1" custom-class="width520" :closeOnClickModal="false" :before-close="closeAddRemindDialog" class="addRemindDialog" :modal-append-to-body="false">

            <div class="workResult" v-if="addRemindDialogVisible1">
                <!-- 请填写工单处理结果，保存后工单将自动关闭。 -->
                {{$t('mxpcweb.client.1529134836733')}}<br><br>
                <el-input type="textarea" :rows="4" v-model="content"  size="small"></el-input><br><br>
                <!-- 上传附件 -->
                <label for="importScollBox_excels5" class="attachment text-hover" style="color:rgb(0, 140, 238)"><i class="iconfont icon-attachment"></i>{{$t('mxpcweb.client.1529056859354')}}</label>
                <file-upload :file-list="files1" ref="fileUpload2" @submitData="submitData2" :limitSize="10">
                    <!-- 选择文件 -->
                    <el-button id="importScollBox_excels5" slot="trigger" size="small" type="primary"   v-show="false">{{$t('mxpcweb.client.1529048918632')}}</el-button>
                </file-upload>
            </div>
            <div slot="footer" class="dialogFooter">
                <!-- 保存 -->
                <el-button type="primary" @click="submitForm('1')" :loading="loading1">{{$t('mxpcweb.client.1529042806774')}}</el-button>
                <!-- 跳过 -->
                <el-button @click="submitForm('2')"  :loading="loading">{{$t('mxpcweb.client.1529134891683')}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Customer from '@/components/Controls/Customer/index'
import FileUpload from '@/components/orderFileUpload/index' // 文件上传
export default {
  name: 'AddWorkOrder',
  props: {

  },
  data () {
    let _this = this
    return {
      itemData1: {
        // 客户
        cnFieldCaption: this.$t('mxpcweb.components.1530947739505'),
        controlData: '',
        isNotNull: 1
      },
      personnelTable: [],
      addRemindDialogVisible: false,
      addRemindDialog: true,
      addRemindDialogVisible1: false,
      addRemindDialog1: true,
      content: '',
      addRemindForm: {
        priority: '0',
        category: '0', // 工单分类
        caption: '', // 标题
        content: '', // 内容
        sourceId: 'pc',
        moduleCode: 'WO001', // 模块好
        custId: '0', // 客户id
        acceptCtId: ''// 受理人id
      },
      loading: false,
      loading1: false,
      addRemindFormRules: {
        priority: [{
          type: 'string',
          required: true,
          // 请选择工单优先级
          message: _this.$t('mxpcweb.client.1529134706603'),
          trigger: 'change'
        }],
        category: [{
          type: 'string',
          required: true,
          // 请选择工单分类
          message: this.$t('mxpcweb.client.1529134596845'),
          trigger: 'change'
        }],
        caption: [{
          type: 'string',
          required: true,
          // 请填写工单标题
          message: _this.$t('mxpcweb.client.1529135419825'),
          trigger: 'blur'
        }],
        content: [{
          type: 'string',
          required: true,
          // 请添加问题描述
          message: _this.$t('mxpcweb.client.1529134651846'),
          trigger: 'blur'
        }],
        acceptCtId: [
          {required: true, trigger: 'blur' }
        ],
        custId: [
          {required: true, trigger: 'blur' }
        ]
      },

      priorityOptions: [{// 优先级(0:一般；1：重要；)'
        value: '0',
        // 一般
        label: _this.$t('mxpcweb.client.1529132447938')
      }, {
        value: '1',
        // 重要
        label: this.$t('mxpcweb.client.1529132464554')
      }],
      categoryOptions: [{
        value: '0',
        // 账号开通
        label: _this.$t('mxpcweb.client.1529132477169')
      }, {
        value: '1',
        // 系统功能
        label: _this.$t('mxpcweb.client.1529132490770')
      }, {
        value: '2',
        // 组件使用
        label: _this.$t('mxpcweb.client.1529132503845')
      }, {
        value: '3',
        // 网站运营
        label: _this.$t('mxpcweb.client.1529132517171')
      }],
      firstInto: false,
      files: [],
      files1: []
    }
  },
  created () {
    let _this = this
    this.getTabData()
    ep.tail('AddWorkOrder', function (obj) {
      _this.openWindow()
    })
  },
  mounted () {
  },
  computed: {
    ...mapGetters([
      'personalInfo',
      'company'
    ])
  },
  methods: {
    // 获取受理人员
    getTabData () {
      let _this = this
      let contactData = {
        dataType: 'contact',
        funType: 'all'
      }
      _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.accountDropList_get, { params: contactData }).then(function (res) {
        if (res.body.code.toString() === _this.Global.RES_OK) {
          _this.personnelTable = res.body.data
          if (_this.personnelTable.length != 0) {
            _this.addRemindForm.acceptCtId = _this.personnelTable[0].ctId + ''
          };
        } else {
          _this.$message.error(_this.msg(res.body))
        }
      }, function (res) {
        _this.$message.error(_this.$t(_this.Global.errorTitle))
      })
    },

    // 提交表单
    submitForm (type) {
      let _this = this
      let isPass = true
      this.$refs['addRemindForm'].validate((valid) => {
        if (valid) {
          return true
        } else {
          isPass = false
        }
      })
      if (!this.$refs['customer'].submitForm()) {
        return false
      };
      if (!isPass) {
        return false
      };
      _this.addRemindForm.custId = this.itemData1.controlData
      _this.addRemindForm.mobile = _this.personalInfo.mobile
      _this.addRemindForm.eMail = _this.personalInfo.email
      if (_this.addRemindForm.acceptCtId === _this.company.ctId + '' && !type) {
        _this.addRemindDialog = false
        _this.addRemindDialogVisible1 = true
        _this.addRemindDialog1 = true
        return false
      };
      if (type === '1') {
        if (_this.content != '') {
          _this.addRemindForm.handleResult = _this.content
          _this.addRemindForm.workState = '4'
        } else {
          // 请输入处理结果后保存
          _this.$message.error(_this.$t('mxpcweb.client.1529134928299'))
          return false
        }
        _this.loading1 = true
      } else {
        _this.loading = true
      }
      let data = {
        // url: _this.Global.api.v2.folders_inFileSys,
        url: _this.Global.api.v2.folders_files, // api（必传）
        fileSource: 3,
        remarks: '',
        moduleCode: 'WO001',
        fn (res) {
          // _this.$emit('getListData',true);
        }
      }
      if (_this.files.length != 0) {
        _this.$refs.fileUpload1.submit(data, type)
      } else if (_this.files1.length != 0 && type === '1') {
        _this.$refs.fileUpload2.submit(data)
      } else {
        _this.submitData2()
      }
    },
    submitData1 (data, type) {
      let _this = this
      if (data) {
        _this.addRemindForm.fileIds = data
      };
      if (_this.files1.length != 0 && type === '1') {
        let datas = {
          // url: _this.Global.api.v2.folders_inFileSys,
          url: _this.Global.api.v2.folders_files, // api（必传）
          fileSource: 3,
          remarks: '',
          moduleCode: 'WO001',
          fn (res) {
            // _this.$emit('getListData',true);
          }
        }
        _this.$refs.fileUpload2.submit(datas)
      } else {
        _this.submitData2()
      }
    },
    submitData2 (data) {
      let _this = this
      if (data) {
        _this.addRemindForm.workFiles = data
      };
      _this.$http.post(_this.Global.baseURL + _this.Global.api.v2.workOrder_add, _this.addRemindForm).then(function (res) {
        if (res.body.code.toString() === _this.Global.RES_OK) {
          _this.$message.success(_this.msg(res.body))
          _this.addRemindDialogVisible = false
          _this.addRemindDialog = false
          _this.addRemindDialogVisible1 = false
          _this.addRemindDialog1 = false
          _this.loading1 = false
          _this.loading = false
          ep.emit('upDateWorkOrderList')
        } else {
          _this.loading = false
          _this.loading1 = false
          _this.$message.error(_this.msg(res.body))
        }
      }, function (res) {
        _this.$message.error(_this.$t(_this.Global.errorTitle))
      })
    },
    openWindow () {
      let _this = this
      _this.firstInto = true
      _this.files = []
      _this.files1 = []
      _this.addRemindForm = {
        priority: '0',
        category: '0', // 工单分类
        caption: '', // 标题
        content: '', // 内容
        sourceId: 'pc',
        moduleCode: 'WO001', // 模块好
        custId: '0', // 客户id
        acceptCtId: ''// 受理人id
      }
      _this.content = ''
      _this.itemData1.controlData = ''
      if (_this.$refs['customer']) {
        _this.$refs['customer'].clearData()
      }
      _this.addRemindDialogVisible = true
      _this.addRemindDialogVisible1 = false
      _this.addRemindDialog = true
      _this.addRemindDialog1 = true
    },
    // 关闭添加消对话框
    closeAddRemindDialog () {
      this.resetForm('addRemindForm')
      this.addRemindDialogVisible = false
      this.addRemindDialogVisible1 = false
      this.addRemindDialog1 = false
    },
    // 重置表单
    resetForm () {
    },
    attachmentClick () {
      $('#attachment').click()
    }

  },
  components: {
    'customer': Customer,
    'file-upload': FileUpload
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
.more{
    text-align:center;
    color:grey;
    margin-bottom:10px;
}
</style>
