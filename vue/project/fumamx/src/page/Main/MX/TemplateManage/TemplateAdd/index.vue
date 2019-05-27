<template>
  <div class="TemplateAdd">
    <el-button @click="$emit('toShowList')">返回</el-button>
    <ul class="editBody MXscroll">
      <li>
        <div class="label">名称</div>
        <el-input v-model="form.name" placeholder="请输入模板名称"></el-input>
      </li>
      <li>
        <div class="label">所属模块</div>
        <el-select v-model="form.module" class="widthFull" placeholder="请选择活动区域">
          <el-option v-for="(item,index) in moduleCodeList" :key="index" :label="item.showName" :value="item.moduleCode"></el-option>
        </el-select>
      </li>
      <li>
        <!-- <div class="label">标签</div> -->
        <!-- 标签展示 -->
        <tag-show :dataList="tagsList" @tagEditShow="tagEditShow" labelWidth="35px"></tag-show>
      </li>
      <li>
        <div class="label">样图 <small>(图片尺寸为150px*200px)</small></div>
        <div class="pickImg">
          <img v-if="pickImgUrl !== ''" :src="pickImgUrl">
          <file-upload :showList="false" :limitSize="2" @change="pickPicChange" :multiple="false" accept="image/jpeg,image/jpg,image/png,image/gif">
            <div slot="trigger" class="pickBtn">
              <i class="iconfont icon-plus-file"></i>
            </div>
          </file-upload>
        </div>

      </li>
      <li>
        <div class="label">售价</div>
        <el-input v-model="form.price" placeholder="请输入售价 ( 单位：元，填0为免费 )"></el-input>
      </li>
      <li>
        <div class="label">设计</div>
      </li>
      <template-editor ref="templateEditor"></template-editor>
      <div style="margin-top:15px;">
        <el-button type="primary" @click="sure()" :loading="submiting" v-if="itemObj.templateId">确定</el-button>
        <el-button type="primary" @click="submit()" :loading="submiting" v-else>保存</el-button>
        <el-button @click="$emit('subPreview', $refs.templateEditor.getVal())">预览</el-button>
      </div>
    </ul>

    <!-- 标签 -->
    <DialogSetTags ref="dialogSetTags" @UpdataTagsData="tagPickSubmit"></DialogSetTags>
  </div>
</template>
<script>
import FileUpload from '@/components/FileUpload/index' // 文件上传
import templateEditor from '@/components/Controls/HtmlEidt/index'
import TagShow from '@/basecomponents/TagShow/index' // 标签展示
import DialogSetTags from '@/components/DialogSetTags/index.vue'
export default {
  name: 'TemplateAdd',
  props: {
    Mcode: {
      default: ''
    }
  },
  data() {
    return {
      submiting: false, // 提交中
      moduleCodeList: [], // 模板下拉
      form: {
        name: '',
        module: 'allModule',
        pictureId: '',
        price: '0',
        labelIds: ''
      },
      itemObj: {}, // 当前编辑对象
      tagsList: [] // 选择的展示标签
    }
  },
  created() {
    this.getModule()
  },
  mounted() {},
  computed: {
    pickImgUrl() {
      if (this.form.pictureId !== '') {
        return this.getGlobalImgSrc(this.form.pictureId, '300x400')
      } else {
        return ''
      }
    }
  },
  methods: {
    tagPickSubmit(res1, res2, res3) {
      this.tagsList = res3
      let idArr = res3.concat().map(item => {
        return item.labelId
      })
      this.form.labelIds = idArr.toString()
    },
    tagEditShow() {
      this.$refs.dialogSetTags.DialogSetTagShow('', [], this.Mcode, {}, this.tagsList)
    },
    pickPicChange(val) {
      if (val.length > 0) {
        this.form.pictureId = val[0].url
      }
    },
    // 模块选择下拉
    getModule() {
      let _this = this
      _this.$http
        .get(
          _this.Global.baseURL + _this.Global.api.v2.autoStrategy_controlTypeV2,
          {
            params: {
              actionId: 1,
              dataType: 'modules',
              placeHolderFlag: 0
            }
          }
        )
        .then(
          res => {
            if (res.body.code.toString() === _this.Global.RES_OK) {
              _this.moduleCodeList = res.body.data.list
            } else {
              _this.$message.error(_this.msg(res.body))
            }
          },
          function(res) {
            _this.$message.error(this.$t(this.Global.errorTitle))
          }
        )
    },
    edit(item, itemLabelArr) {
      // console.log(' uuu ')
      // console.log(item)
      this.itemObj = item // 当前编辑对象
      this.tagsList = itemLabelArr

      this.form.name = item.templateName
      this.form.module = item.moduleCode
      this.form.pictureId = item.exampleId
      this.form.price = item.cost
      this.form.labelIds = item.labelId

      setTimeout(() => {
        this.$refs.templateEditor.editVal(item.templateUrl)
      }, 3000)
    },
    // 表单验证
    checkForm() {
      if (this.form.name == '') {
        this.$message('请输入模板名称')
        return false
      }
      if (this.form.name.length >= 40) {
        this.$message('模板名称不可多于40个字符')
        return false
      }
      if (this.form.labelIds == '') {
        this.$message('请选择标签')
        return false
      }
      if (this.form.pictureId == '') {
        this.$message('请上传图片')
        return false
      }
      if (this.form.price === '') {
        this.$message('请输入售价 ( 单位：元，填0为免费 )')
        return false
      }
      return true
    },
    // 确定修改
    sure() {
      if (!this.checkForm()) { return }
      // console.log(this.itemObj)
      let data = {
        type: 'edit',
        templateId: this.itemObj.templateId,
        name: this.form.name,
        moduleCode: this.form.module,
        exampleId: this.form.pictureId,
        cost: this.form.price,
        labelIds: this.form.labelIds,
        detail: {text: this.$refs.templateEditor.getVal()}
      }
      // console.log(data)
      this.submiting = true
      this.$http
        .put(this.Global.baseURL + this.Global.api.v2.templateMarket, data).then(res => {
          this.submiting = false
            if (res.body.code.toString() == this.Global.RES_OK) {
                this.$message.success(res.body.msg)
                setTimeout(() => {
                  this.$emit('toShowList') // 返回
                }, 1000)
            } else {
              this.$message.error(res.body.msg)
            }
          },
          res => {
            this.$message.error(this.$t(this.Global.errorTitle))
          }
        )
    },
    submit() {
      if (!this.checkForm()) { return }
      let data = {
        caption: this.form.name,
        moduleCode: this.form.module,
        detail: {text: this.$refs.templateEditor.getVal()},
        cost: this.form.price,
        labelIds: this.form.labelIds,
        exampleId: this.form.pictureId
        // exampleId: 0
      }
      // console.log(data)
      this.submiting = true
      this.$http
        .post(this.Global.baseURL + this.Global.api.v2.templateMarket, data)
        .then(
          res => {
            this.submiting = false
            if (res.body.code.toString() == this.Global.RES_OK) {
              this.$message.success(res.body.msg)
              setTimeout(() => {
                this.$emit('toShowList') // 返回
              }, 1000)
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
    'template-editor': templateEditor,
    'DialogSetTags': DialogSetTags,
    'tag-show': TagShow,
    'file-upload': FileUpload
  }
}
</script>

<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
