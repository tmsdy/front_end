<template>
  <div class="DialogBlackList">
    <el-dialog v-dialogDrag :title="title" :visible.sync="isOpen" custom-class="width620" @close="resetForm('dialogUserForm')">
      <el-form ref="dialogUserForm" label-width="150px">
        <!-- 邮箱帐号 -->
        <el-form-item :label="$t('mxpcweb.systemset.mailset.setindex.1528979068925')" v-if="bOrW==1">
          <el-select v-model="svalue">
            <el-option v-for="(item,index) in optionList" :key="index" :label="item.mailAddress" :value="item.mailAddress"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="title" label-width="150px">
          <el-input v-model="keyword" size="small" style="width:215px;"></el-input>
        </el-form-item>

        <div class="text-center">
          <!-- 取消 -->
          <el-button @click="cancelClick()">{{$t('mxpcweb.mail.1528942364802')}}</el-button>
          <!-- 确定 -->
          <el-button @click="Addclick()" type="primary">{{$t('mxpcweb.mail.1528942374762')}}</el-button>
        </div>

      </el-form>

    </el-dialog>

  </div>
</template>
<script>
/**
 * 描述：邮件部分
 * 作者：向士健(CSS) / ***(API)
 * 时间：2017/12/11
 */
export default {
  name: 'DialogBlackList',
  props: {
    optionList: {
      type: Array,
      default: function () {
        return []
      }
    }

  },
  data() {
    let _this = this
    return {
      isOpen: false, // 弹窗开关
      svalue: '',
      keyword: '',
      bOrW: 1,
      title: _this.$t('mxpcweb.systemset.mailset.setindex.1528978194113')// '黑名单'
    }
  },
  components: {

  },
  methods: {
    Addclick() {
      if (this.bOrW == 1) {
        this.BlackListAdd()
      } else {
        this.while()
      }
    },
    cancelClick() {
      this.isOpen = false
      this.keyword = ''
    },
    // 添加白名单
    while() {
      let data = {}
      if (this.keyword != '') {
        data.mailAddress = this.keyword
      } else {
        this.$message.error(this.$t('mxpcweb.systemset.mailset.setindex.1531101135267'))// 白名单不能为空
        return
      }
      this.$http.post(this.Global.baseURL + this.Global.api.Mail.whitelistAdd, data).then(function (res) {
        if (res.body.code.toString() == this.Global.RES_OK) {
          this.isOpen = false
          this.$message.success(this.$t('mxpcweb.systemset.mailset.setindex.1528981265711'))// 添加成功！
          this.keyword = ''
          this.$emit('searchWhiteList')
        } else {
          this.$message.error(this.msg(res.body))
        }
      },
        function (res) {
          this.$message.error(this.$t(this.Global.errorTitle))
        })
    },
    // 添加黑名单
    BlackListAdd() {
      let data = {}
      if (this.svalue != '') {
        data.mailAccount = this.svalue
      } else {
        this.$message.error($t('mxpcweb.systemset.mailset.setindex.1531101287185'))// 添加账号不能为空
        return
      }
      if (this.keyword != '') {
        data.mailAddress = this.keyword
      } else {
        this.$message.error($t('mxpcweb.systemset.mailset.setindex.1531101170998'))// 黑名单不能为空
        return
      }
      this.$http.post(this.Global.baseURL + this.Global.api.Mail.BlackListPost, data).then(function (res) {
        if (res.body.code.toString() == this.Global.RES_OK) {
          this.isOpen = false
          this.$message.success($t('mxpcweb.systemset.mailset.setindex.1528981265711'))
          this.keyword = ''
          this.$emit('searchBlackList')
        } else {
          this.$message.error(this.msg(res.body))
        }
      },
        function (res) {
          this.$message.error(this.$t(this.Global.errorTitle))
        })
    },
    // 清空表单
    resetForm(formName) {
      if (this.isOpen) {
        this.$refs[formName].resetFields()
      }
    },
    // type  1黑名单 2白名单
    isDialog(to, type) {
      if (to == 'open') {
        this.bOrW = type
        this.title = type == 1 ? this.$t('mxpcweb.systemset.mailset.setindex.1528978194113') : this.$t('mxpcweb.systemset.mailset.setindex.1528978193914') // '黑名单' : '白名单'
        this.isOpen = true
        this.svalue = this.optionList.length > 1 ? this.optionList[1].mailAddress : ''
      } else {
        this.isOpen = false
      }
    }

  }

}
</script>
