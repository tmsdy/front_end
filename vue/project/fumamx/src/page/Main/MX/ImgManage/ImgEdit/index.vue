<template>
  <div class="ImgEdit">
    <el-button @click="$emit('toShowList')">返回</el-button>
    <ul class="editBody MXscroll">
      <li>
        <div class="label">编号 <small>请输入大于0的编号，用来排序</small></div>
        <el-input-number v-model="form.NO" :min="0" :max="9999"></el-input-number>
      </li>
      <li>
        <div class="label">标题</div>
        <el-input v-model="form.title" placeholder="请输入图片标题"></el-input>
      </li>
      <li>
        <!-- <div class="label">图片 <small>(图片尺寸为150px*200px)</small></div> -->
        <div class="label">图片 <small></small></div>
        <div class="pickImg" v-if="form.pictureId !== ''">
          <a :href="getGlobalImgSrc(form.pictureId)" data-lightbox="FumaMX" data-title="FumaMX"><img :src="getGlobalImgSrc(form.pictureId, '300x300')"></a>
        </div>
        <div class="pickImg">
          <file-upload :showList="false" :limitSize="2" @change="pickPicChange" :multiple="false" accept="image/jpeg,image/jpg,image/png,image/gif">
            <div slot="trigger" class="pickBtn">
              <i class="iconfont icon-plus-file"></i>
            </div>
          </file-upload>
        </div>
      </li>
      <li>
        <div class="label">展示位置</div>
        <el-select v-model="form.category" class="widthFull" placeholder="请选择活动区域">
          <el-option v-for="(item,index) in showList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </li>
      <li>
        <div class="label">链接</div>
        <el-input v-model="form.link" placeholder="请输入跳转链接，如: http://www.fumasoft.com"></el-input>
      </li>
      <div style="margin-top:15px;">
        <!-- 编辑时 -->
        <el-button type="primary" size="large" @click="formEdit()" :loading="submiting" v-if="isEditingId">保存</el-button>
        <!-- 新增时 -->
        <el-button type="primary" size="large" @click="formPost()" :loading="submiting" v-else>确定</el-button>

        <el-button type="" size="large" @click="$emit('toShowList')">取消</el-button>
      </div>
    </ul>

  </div>
</template>
<script>
import FileUpload from '@/components/FileUpload/index' // 文件上传
export default {
  name: 'ImgEdit',
  props: {
  },
  data() {
    return {
      submiting: false, // 提交中
      showList: [
        {
          id: 2,
          name: '注册登录'
        }
      ], // 模板下拉
      form: {
        NO: 0,
        title: '',
        pictureId: '',
        category: 2,
        link: ''
      },
      isEditingId: null // 当前编辑ID
    }
  },
  created() {},
  mounted() {},
  methods: {
    pickPicChange(val) {
      // console.log(val)
      if (val.length > 0) {
        this.form.pictureId = val[val.length - 1].url
      }
    },
    editItem(item) {
      console.log(item)
      this.isEditingId = item.pictureId + ''
      this.form = {
        NO: item.pictureId + '',
        title: item.caption,
        pictureId: item.pictureCode,
        category: item.showPosition,
        link: item.url
      }
    },
    // 表单验证
    checkForm() {
      if (this.form.NO == '') {
        this.$message('请输入大于0的编号，用来排序')
        return false
      }
      if (this.form.title == '') {
        this.$message('请输入图片标题')
        return false
      }
      if (this.form.pictureId == '') {
        this.$message('请上传图片')
        return false
      }
      // if (this.form.link === '') {
      //   this.$message('请输入链接')
      //   return false
      // }
      return true
    },
    // 确定修改
    formEdit() {
      if (!this.checkForm()) { return }
      let data = {
        type: 'edit',
        pictureId: this.isEditingId,
        // newPictureId: this.form.NO + '',
        caption: this.form.title,
        pictureCode: this.form.pictureId,
        showPosition: this.form.category,
        url: this.form.link
      }
      if (this.form.NO != this.isEditingId) {
        data.newPictureId = this.form.NO + ''
      }
      this.submiting = true
      this.$http
        .put(this.Global.baseURL + this.Global.api.v2.imgManage, data).then(res => {
          this.submiting = false
            if (res.body.code.toString() == this.Global.RES_OK) {
                this.$message.success(res.body.msg)
                this.$emit('toShowList') // 返回
            } else {
              this.$message.error(res.body.msg)
            }
          },
          res => {
            this.$message.error(this.$t(this.Global.errorTitle))
          }
        )
    },
    // 新增
    formPost() {
      if (!this.checkForm()) { return }
      let data = {
        pictureId: this.form.NO + '', // 图片编号
        caption: this.form.title,
        pictureCode: this.form.pictureId,
        shwoPosition: this.form.category,
        url: this.form.link
      }
      this.submiting = true
      this.$http
        .post(this.Global.baseURL + this.Global.api.v2.imgManage, data)
        .then(
          res => {
            this.submiting = false
            if (res.body.code.toString() == this.Global.RES_OK) {
              this.$message.success(res.body.msg)
              this.$emit('toShowList') // 返回
            } else {
              this.$message.error(res.body.msg)
            }
          },
          res => {
            this.$message.error(this.$t(this.Global.errorTitle))
          }
        )
    }
  },
  components: {
    'file-upload': FileUpload
  }
}
</script>

<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
