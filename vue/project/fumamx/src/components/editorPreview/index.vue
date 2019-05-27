<template>
    <!-- 模板预览 -->
    <el-dialog :title="$t('fumamx-web-templateeditor.1531901792515')" :visible.sync="visible" top="5%" size="full" custom-class="previewBox" @close="onClose" :modal-append-to-body="false">
        <el-button type="danger" class="closeBtn" @click="onClose">{{$t('mxpcweb.document.global.1529991093152')}}</el-button>
        <!-- <div class="Preview" v-html="content">aaabbb</div> -->
        <div class="Preview">
            <div class="left MXscroll">
                <iframe ref="iframePC" src="/static/mail/view.html" @load="loadedContent" class="MXscroll" scrolling="auto" frameborder="0" marginheight="0" marginwidth="0" width="100%" height="100%"></iframe>
            </div>
            <div class="right">
              <div class="phone">
                <iframe ref="iframePhone" src="/static/mail/view.html" @load="loadedContent" class="MXscroll" scrolling="auto" frameborder="0" marginheight="0" marginwidth="0" width="100%" height="100%"></iframe>
              </div>
            </div>
        </div>
    </el-dialog>
</template>

<script>
export default {
  name: 'Preview',
  data() {
    return {
      visible: false,
      // visible: true,
      content: '',
      iframeShow: false
    }
  },
  methods: {
    loadedContent() {
      this.iframeShow = true
      this.$refs.iframePC.contentWindow.initHtml(this.content) // PC
      try {
        this.$refs.iframePhone.contentWindow.initHtml(this.content) // PHONE
      } catch (e) {
        console.log('this.$refs.iframePhone.contentWindow.initHtml')
      }
    },
    isShowEditor(html) {
      //   console.log(html);
      this.visible = true
      this.content = html
      if (this.iframeShow) {
        this.loadedContent()
      }
    },
    // 外部传 html 来预览
    open(html) {
      // console.log(html)
      this.visible = true
      this.content = html
      if (this.iframeShow) {
        this.loadedContent()
      }
    },
    isShowTemplate(TemplateID) {
      let _this = this
      this.visible = true
      _this.$http.get(this.Global.baseURL + this.Global.api.v2.template_one, {
          params: { invokeName: TemplateID }
        })
        .then(
          function(res) {
            if (res.body.code.toString() == _this.Global.RES_OK) {
              let backData = res.body.data
              // console.log(backData)
              // console.log(backData)
              this.content = backData.html
              if (this.iframeShow) {
                this.loadedContent()
              }
            } else {
              _this.$message.error(_this.msg(res.body))
            }
          },
          function(res) {
            _this.$message.error(_this.$t(_this.Global.errorTitle))
          }
        )
    },
    onClose() {
      this.visible = false
      this.content = ''
      this.$refs.iframePC.contentWindow.initHtml()
      this.$refs.iframePhone.contentWindow.initHtml()
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.previewBox {
  .closeBtn {
      position: absolute;
      right: 15px;
      top: 11px;
  }
  .Preview {
    // border:1px solid red;
    border-top: 1px solid #eee;
    position: fixed;
    left: 0;
    top: 52px;
    right: 0;
    bottom: 0;
    z-index: 9;
    overflow: hidden;
    .left {
      // border:1px solid blue;
      border-right: 1px solid #eee;
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 555px;
      background-color: #f7f8f9;
      overflow: hidden;
    }
    .right {
      // border:1px solid red;
      width: 555px;
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      .phone {
        // border:1px solid red;
        width: 365px;
        height: 100%;
        background: url("/static/mail/dragEdit/phone.png") center top no-repeat;
        background-size: 100%;
        margin: 30px auto 0;
        position: relative;
        iframe {
          // border: 1px solid #999;
          width: 308px;
          height: 649px;
          margin-top: 46px;
          margin-left: 27px;
          border-radius: 3px 5px 32px 32px;
          opacity: 0.95;
        }
      }
    }
  }
}

</style>
