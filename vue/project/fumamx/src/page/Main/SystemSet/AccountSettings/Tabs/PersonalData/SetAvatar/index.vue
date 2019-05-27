<template>
  <div class="SetAvatar">
    <fileupload-dialog ref="fileuploadDialog" :url="updateUrl" method="put" :closeMethod="close" :fileUploadSuccess="fileUploadSuccess"></fileupload-dialog>
    <image-cut ref="imagesCut" v-on:listenImgUrl="listenImgUrl"></image-cut>
    <div class="input_title">
      <!-- 设置头像 -->{{ $t('mxpcweb.systemset.personaldata.1530594604207') }}
    </div>
    <ul class="set_pic clearfix">
      <li>
        <div class="set_pic_upload">
          <div class="set_select_file transition_all">
            <i class="iconfont icon-plus-file transition_all"></i>
            <img v-if="avatar" :src="avatar">
            <input type="file" name="firstname" ref="inputFile" accept="image/png,image/jpeg,image/gif" @change="fileChange">
          </div>
          <div class="descript">
            <!-- 大小 -->
            {{$t('mxpcweb.systemset.logaction.1530348300253')}}：180 x 180px
            <em class="recomm">
              <!-- 推荐 -->{{$t('mxpcweb.systemset.logaction.1530348335556')}}
            </em><br>
            <!-- 仅支持PNG、JPG、GIF图片格式 -->{{ $t('mxpcweb.systemset.personaldata.1530594631613') }}
          </div>
        </div>
      </li>
      <li>
        <!-- 仅支持PNG、JPG、GIF图片格式 -->
        <!--<div class="avatarType">{{ $t('mxpcweb.systemset.personaldata.1530594631613') }}</div>-->
        <div class="avatarShowSize">
          <div>
            <div class="avatarRound">
              <img v-if="avatar" :src="avatar">
              <span class="defaultBg" v-if="!avatar">
                <!-- 王某人 -->{{ $t('mxpcweb.systemset.personaldata.1530594659773') }}</span>
            </div>
            <span>96X96</span>
          </div>
          <div>
            <div class="avatarRound">
              <img v-if="avatar" :src="avatar">
              <span class="defaultBg" v-if="!avatar">
                <!-- 王某人 -->{{ $t('mxpcweb.systemset.personaldata.1530594659773') }}</span>
            </div>
            <span>48X48</span>
          </div>
          <div>
            <div class="avatarRound">
              <img v-if="avatar" :src="avatar">
              <span class="defaultBg" v-if="!avatar">
                <!-- 某人 -->{{ $t('mxpcweb.systemset.personaldata.1530594686271') }}</span>
            </div>
            <span>32X32</span>
          </div>
        </div>
      </li>
    </ul>
    <hr class="avatarLine">
  </div>
</template>

<script>
import FileuploadDialog from '@/basecomponents/FileuploadDialog/index' // 图片上传及进度条插件
import ImageCut from '@/basecomponents/ImageCut/index' // 图片裁剪
import { mapMutations } from 'vuex'

export default {
  name: 'SetAvatar',
  props: {
  },
  data() {
    return {
      updateUrl: this.Global.uploadUrl, // 图片服务器URL
      // avatar: 'https://dn-coding-net-production-avatar.qbox.me/Fruit-3.png?imageMogr2/thumbnail/80',  //头像
      avatar: '', // 头像URl
      flags: ''
    }
  },
  created() {
  },
  mounted() {
    this.getPersonalData()
  },
  methods: {
    // 获取图片URL
    getPersonalData() {
      let _this = this
      let url = this.Global.baseURL + this.Global.api.SystemSet.personaldata.accountIndividualInf
      this.$http.get(url, { params: {} }).then(function (res) {
        if (res.body.code.toString() == _this.Global.RES_OK) {
          let data = res.body.data
          if (data.avatar != '') {
            _this.avatar = this.getGlobalImgSrc(data.avatar, '180x180')
          }
          _this.flags = data.flags
        } else {
          _this.avatar = ''
          _this.$message.error(res.data.msg)
        }
      }, function (res) {
        _this.$message.error(_this.$t(_this.Global.errorTitle))
      })
    },
    fileChange(event) {
      let _this = this
      let files = event.currentTarget.files
      if (files.length === 0) { return }
      let fileSize = files[0].size
      let fileSize_M = (fileSize / 1048576).toFixed(2) // 转成M，并保存2位小数
      let picLimitSize = 2
      // 限制上传大小
      if (fileSize_M < picLimitSize) {
        // 因为是图片裁剪使用到canvas，图片预览不能跨域，因此在node服务端做临时图片接口，配合处理业务
        _this.Global.fileUpload({
          url: _this.Global.baseURL + _this.Global.api.UniversalInterface.uploadCutPicture,
          FileList: files,
          method: 'post',
          formName: 'uploadCutPicture',
          onload: function (res) {
            if (res.code.toString() == _this.Global.RES_OK) {
              _this.$refs.imagesCut.show(res.data.url)
            }
          }
        })
      } else {
        /* 超过 */
        /* M的图片不能上传 */
        this.$message.warning(this.$t('mxpcweb.systemset.personaldata.1530594722764', [picLimitSize]))
        event.currentTarget.value = '' // 清空
      }
    },
    // 监听图片裁剪完成
    listenImgUrl: function (data) {
      this.avatar = data
      // 执行上传
      let fileuploadDialog = this.$refs.fileuploadDialog
      fileuploadDialog.upload([this.avatar])
    },
    // 点击上传过程
    close() {
      // console.log("关闭上传对话框");
    },
    fileUploadSuccess(respose) {
      if (respose.code == 0) {
        let _this = this
        let urlApi = this.Global.baseURL + this.Global.api.SystemSet.personaldata.accountPut
        this.avatar = this.getGlobalImgSrc(respose.data, '180x180') // 成功后，换上新的url
        let avatarJson = {
          'avatar': respose.data,
          'flags': this.flags
        }
        this.$http.post(urlApi, avatarJson).then(function (res) {
          if (res.body.code.toString() == _this.Global.RES_OK) {
            _this.setPersonalInfo(res.body.data)
            ep.emit('storeInit')// 更新 store 数据
            /* 上传成功 */
            _this.$message.success(_this.$t('mxpcweb.systemset.personaldata.1530594776885'))
          } else {
            _this.$message.error(_this.msg(res.body))
          }
        }, function (res) {
          _this.$message.error(_this.$t(_this.Global.errorTitle))
        })
      } else {
        this.$message.error(res.msg)
      }
    },
    // 做Mutations对象映射。在其他方法中可直接调用mutations.js内的方法
    ...mapMutations({
      setPersonalInfo: 'SET_PERSONALINFO'// this.$store.commit('SET_PERSONALINFO')
    })
  },
  components: {
    'fileupload-dialog': FileuploadDialog,
    'image-cut': ImageCut
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
