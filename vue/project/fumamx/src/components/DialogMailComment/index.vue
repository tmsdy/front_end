<template>
    <div class="DialogMailComment">
        <template v-if="isOpen">
            <!-- 批注 -->
            <el-dialog :title="$t('mxpcweb.client.1529056877668')" v-dialogDrag :visible.sync="isOpen" custom-class="width720" @close="resetForm('dialogForm')" :modal-append-to-body="false">
                <el-form :model="dialog" :rules="dialogRules" ref="dialogForm" label-width="80px">

                    <el-form-item :label="typeName" prop="" style="margin:-10px 0 0">
                        {{itemTitle}}
                    </el-form-item>
                    <!-- 标记 -->
                    <el-form-item :label="$t('mxpcweb.client.1529993567308')" prop="">
                        <ul class="mailSign">
                            <li v-for="(item,index) in arrMailSign" :key="index" :class="[{active:item==dialog.commentFlag}]" :style="setCommentsColor(item)" @click="dialog.commentFlag = item">
                                <i class="iconfont icon-dot"></i>
                            </li>
                        </ul>
                    </el-form-item>
                    <el-form-item label="" prop="content" class="marginTop-10">
                        <!-- 请填写批注内容 -->
                        <el-input v-model="dialog.content" type="textarea" :rows="3" :minlength="1" :maxlength="300" :placeholder="$t('mxpcweb.client.1529993590087')"></el-input>
                    </el-form-item>
                    <!-- 提醒 -->
                    <el-form-item :label="$t('mxpcweb.client.1529056941188')+'@'">
                        <!-- 请选择时间 -->
                        <el-date-picker v-model="datetime" align="center" type="datetime" @change="change" format="yyyy-MM-dd HH:mm" :placeholder="$t('mxpcweb.client.1529993635269')" :picker-options="pickerOptions" class="widthFull"> </el-date-picker>
                    </el-form-item>
                    <el-form-item label="" prop="targets" class="marginTop-10">
                        <el-checkbox-group v-model="targets">
                            <!-- 提醒我自己 -->
                            <el-checkbox :label="myCtId">{{$t('mxpcweb.client.1529993655316')}}</el-checkbox><br>
                        </el-checkbox-group>
                        <!-- 提醒拥有人 -->
                        <el-checkbox v-model="noticeOwner" v-if="ownerCtId!=''" :label="$t('mxpcweb.client.1529993670837')+'（'+returnOwnerCtId(ownerCtId)+'）'"></el-checkbox><br>
                        <el-dropdown trigger="click" @command="sortListClick">
                            <span class="el-dropdown-link">
                                <el-button size="small">
                                    <i class="el-icon-plus"></i>
                                    <!-- 其他提醒人员 -->
                                    {{$t('mxpcweb.client.1529993689388')}}
                                </el-button>
                            </span>
                            <el-dropdown-menu slot="dropdown" class="MXscroll" style="max-height:400px;overflow:auto;">
                                <div style="font-size: 12px;text-align:center" v-if="personnelTable.length==0">
                                    <!-- 暂无其他人员 -->
                                    {{$t('mxpcweb.client.1529993704287')}}
                                </div>
                                <el-dropdown-item v-for="(item,index) in personnelTable" :key="index" :command="{ctId:item.ctId,realName:item.realName}">
                                    <div>
                                        <span v-if="item.selected">
                                            <i class="iconfont icon-correct text-blue"></i>
                                        </span>
                                        <span style="display: inline-block;width: 21px;line-height: 20px;" v-else></span>
                                        {{item.realName}}
                                    </div>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-form-item>

                    <div class="text-center">
                          <el-button class="footerButton" @click="isOpen = false">{{$t('mxpcweb.mail.1528942364802')}}</el-button>
                        <!-- 保存 -->
                        <el-button type="primary" :loading="submitLoading" @click="submit('dialogForm')" >{{$t('mxpcweb.systemset.groupstructure.1529408437503')}}</el-button>
                    </div>
                </el-form>
            </el-dialog>
        </template>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { commentsColor } from '@/libs/utils.js'

/**
 * 描述：邮件部分
 * 作者：向士健(CSS) / ***(API)
 * 时间：2017/11/11
 */
export default {
  name: 'DialogMailComment',
  props: {

  },
  data () {
    return {
      typeName: '', //
      itemTitle: '', //
      isOpen: false, // 弹窗开关
      personnelTable: [], // 企业下所有未禁用人员信息,
      arrMailSign: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], // 标记组
      noticeOwner: false,
      myCtId: '', // 我的id;
      datetime: '',
      ownerCtId: '',
      targets: [], // 提醒人ctid，用“，”隔开
      dialog: {
        moduleCode: 'BF001',
        commentFlag: '1', // 标记
        content: '',
        deliveryTime: '',
        targets: [], // 提醒人ctid，用“，”隔开
        noticeOwner: '', // 是否提醒拥有人
        sourceId: 'pc',
        identFieldValue: ''
      },
      dialogRules: {
        content: [
          // 请输入提醒内容
          { required: true, message: this.$t('mxpcweb.client.1529993750180'), trigger: 'blur' },
          // 长度在 1 到 300 个字符
          { min: 1, max: 300, message: this.$t('mxpcweb.client.1529993768835'), trigger: 'blur' }
        ]
      },
      pickerOptions: {
        shortcuts: [{
          // 今天
          text: this.$t('mxpcweb.client.1529056807699'),
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          // 明天
          text: this.$t('mxpcweb.client.1529056827883'),
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          // 一周后
          text: this.$t('mxpcweb.mail.1528955067857'),
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      SubmitIs: true,
      targetsName: [],
      submitLoading: false
    }
  },
  created () {
  },
  mounted () {
    this.myCtId = this.company.ctId
    this.datetime = new Date()
    this.getOwners()
  },
  methods: {
    // 批注色彩
    setCommentsColor (flag) {
      return commentsColor(flag)
    },
    // 父组件来调用
    isDialog (to, type, moduleCode, itemId, itemTitle, itemData) {
      this.getOwners()
      if (to == 'open') {
        this.isOpen = true
        this.typeName = type
        this.itemTitle = itemTitle
        this.targets = []
        this.targetsName = []
        this.datetime = new Date()
        this.noticeOwner = false
        this.dialog = {
          moduleCode: moduleCode,
          commentFlag: '1', // 标记
          content: '',
          deliveryTime: '',
          targets: [], // 提醒人ctid，用“，”隔开
          noticeOwner: '', // 是否提醒拥有人
          sourceId: 'pc',
          identFieldValue: itemId
        }
        if (itemData.ownerCtId) {
          this.ownerCtId = itemData.ownerCtId || ''
        }
        if (itemId == 0) {
          this.SubmitIs = false
        }
      } else {
        this.isOpen = false
      }
    },
    change (newValue) {
      this.dialog.deliveryTime = newValue
    },
    sortListClick (command) {
      let isHave = false
      this.targets.forEach(function (item) {
        if (item == command.ctId) {
          isHave = true
        }
      })
      if (isHave) {
        this.personnelTable.forEach(function (item) {
          if (item.ctId == command.ctId) {
            item.selected = false
            return false
          }
        })
      } else {
        this.personnelTable.forEach(function (item) {
          if (item.ctId == command.ctId) {
            item.selected = true
            return false
          }
        })
        this.targets.push(command.ctId)
        this.targetsName.push(command.realName)
      }
    },
    getOwners () { // 获取拥有人列表
      let _this = this
      let { ctId } = this.individualConfigInfo
      _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.accountDropList_get, { params: { dataType: 'contact', funType: 'customerAdd', ctId: ctId } }).then(function (res) {
        if (res.body.code.toString() == _this.Global.RES_OK) {
          _this.personnelTable = res.body.data
          let itemIndex = -1
          _this.personnelTable.forEach(function (item, index) {
            item.selected = false
            if (item.ctId == _this.myCtId) {
              itemIndex = index
            }
          })
          if (itemIndex != -1) {
            _this.personnelTable.splice(itemIndex, 1)
          }
        } else {
          _this.$message.error(_this.msg(res.body))
        }
      }, function (res) {
        _this.$message.error(_this.$t(_this.Global.errorTitle))
      })
    },
    returnOwnerCtId (ownerCtId) { // 返回拥有人名字
      let name = ''
      if (this.contactList instanceof Object) {
        name = this.contactList[ownerCtId] || ''
      }
      return name
    },
    // 提交
    submit (formName) {
      let _this = this
      let pass = true
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          pass = false
          return false
        }
      })
      if (!pass) {
        return false
      }

      this.dialog.deliveryTime = _this.$m_unifiedTime(this.datetime)
      let targets = []
      this.targets.forEach(function (item) {
        targets.push(item)
      })
      if (this.noticeOwner) {
        this.dialog.noticeOwner = '1'
        targets.push(this.ownerCtId)
      } else {
        this.dialog.noticeOwner = '0'
      }
      this.dialog.targets = targets.toString()
      if (!this.SubmitIs) { // 不提交（发送邮件处使用）
        let msg = this.TimeJudgment(this.dialog.deliveryTime)
        this.dialog.targetsName = this.targetsName
        if (msg == '') {
          _this.isOpen = false
          _this.$emit('getListData', this.dialog)
        } else {
          _this.$message.error(msg)
        }

        return
      }
      _this.submitLoading = true
      _this.$http.post(_this.Global.baseURL + _this.Global.api.v2.billComment_add, this.dialog).then(function (res) {
        if (res.body.code.toString() == _this.Global.RES_OK) {
          _this.$message.success(_this.msg(res.body))
          _this.submitLoading = false
          _this.isOpen = false
          _this.$emit('getListData') // 成功后，告诉父组件
        } else {
          _this.submitLoading = false
          _this.$message.error(_this.msg(res.body))
        }
      },
      function (res) {
        _this.submitLoading = false
        _this.$message.error(_this.$t(_this.Global.errorTitle))
      }
      )
    },
    // 清空表单
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 时间判断（不能小于2小时）
    TimeJudgment (timeData) {
      var startDate = new Date(timeData).getTime()// 提醒时间
      var DateNow = new Date()
      var endDate = DateNow.getTime() // 当前时间
      if (startDate < endDate) {
        //  提醒时间必须大于当前时间2小时以上
        return this.$t('mxpcweb.mail.1528955159919')
      }
      var date3 = startDate - endDate // 时间差的毫秒数
      var leave1 = date3 % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
      var hours = Math.floor(leave1 / (3600 * 1000))
      if (hours < 2) {
        //  提醒时间必须大于当前时间2小时以上！
        return this.$t('mxpcweb.mail.1528955159919')
      } else {
        return ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'individualConfigInfo',
      'company',
      'contactList'
    ])
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
