<template>
  <div class="DialogWhite">
    <el-dialog v-dialogDrag :title="title" :visible.sync="isOpen" custom-class="width620" @close="resetForm('dialogUserForm')" :modal-append-to-body="false">
      <el-form ref="dialogUserForm" label-width="150px">
        <!-- 域名 -->
        <el-form-item :label="$t('mxpcweb.systemset.systemparameter.1535513510532')">

          <el-input v-model="domain" size="small" style="width:215px;" placeholder="*@fumasoft.com"></el-input>
        </el-form-item>
        <!-- 描述 -->
        <el-form-item :label="$t('mxpcweb.systemset.systemparameter.1535513528343')">

          <el-input v-model="description" size="small" style="width:215px;"></el-input>
        </el-form-item>

        <!-- <el-form-item :label="title" label-width="150px">
          <el-input v-model="keyword" size="small" style="width:215px;"></el-input>
        </el-form-item> -->

        <div class="text-center">
          <!-- 取消 -->
          <el-button @click="cancelClick()">{{$t('mxpcweb.mail.1528942364802')}}</el-button>
          <!-- 确定 -->
          <el-button @click="whileAdd()" type="primary">{{$t('mxpcweb.mail.1528942374762')}}</el-button>
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
  name: 'DialogWhite',
  props: {
    // optionList: {
    //   type: Array,
    //   default: function () {
    //     return []
    //   }
    // }

  },
  data() {
    let _this = this
    return {
      isOpen: false, // 弹窗开关
      domain: '',
      description: '',
      keyword: '',
      // bOrW: 1,
      title: _this.$t('mxpcweb.systemset.mailset.setindex.1528978193914')// '黑名单'
    }
  },
  components: {

  },
  methods: {

    cancelClick() {
      this.isOpen = false
      this.keyword = ''
    },
    // 添加白名单
    whileAdd() {
      let data = {}
      if (this.domain != '') {
        data.domain = this.domain
      } else {
        this.$message.error(this.$t('mxpcweb.systemset.systemparameter.1535523166479'))// 白名单不能为空
        return
      }
      if (this.description != '') {
        data.description = this.description
      } else {
        this.$message.error(this.$t('mxpcweb.systemset.systemparameter.1535523182567'))// 白名单不能为空
        return
      }
      this.$http.post(this.Global.baseURL + this.Global.api.v2.internalMailDomain, data).then(function (res) {
        if (res.body.code.toString() == this.Global.RES_OK) {
          this.isOpen = false
          this.$message.success(this.$t('mxpcweb.systemset.mailset.setindex.1528981265711'))// 添加成功！
          this.keyword = ''
          this.domain = ''
          this.$emit('searchWhiteList')
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
        // this.bOrW = type
        // this.title = type == 1 ? this.$t('mxpcweb.systemset.mailset.setindex.1528978194113') : this.$t('mxpcweb.systemset.mailset.setindex.1528978193914') // '黑名单' : '白名单'
        this.isOpen = true
        // this.domain = this.optionList.length > 1 ? this.optionList[1].mailAddress : ''
      } else {
        this.isOpen = false
      }
    }

  }

}
</script>
