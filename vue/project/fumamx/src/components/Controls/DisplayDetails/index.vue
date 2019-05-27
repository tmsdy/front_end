<template>
  <div class="Controls-editor-template" ref="controlsEditorTemplate" :style="{'height':height}">
    <!-- 编辑器 -->
    <template-editor :visible.sync="isOpenDrag" ref="templateEditorDrag" style="transform-origin: 0 0 0;width:1151px;" :showHeader="false"></template-editor>
  </div>
</template>

<script>
import editorTemplate from '@/components/editorTemplate/index'
import { mapGetters } from 'vuex'
export default {
  name: 'Controls-editor-template',
  props: {
    height: {
      type: String,
      default: '666px'
    },
    templateData: {
      type: Object,
      default: function() {
        return {
          name: 'name',
          type: '1',
          id: '0' // 默认模板布局
        }
      }
    },
    type: {
        type: String,
        default: ''
    }
  },
  data() {
    return {
      isOpenDrag: true,
      content: ''
    }
  },
  mounted() {
    this.$refs.templateEditorDrag.addOneTemp(this.templateData)
    this.resize()
  },
  computed: {
      ...mapGetters([
          'screenWidth'
      ])
  },
  methods: {
    resize() {
      if (!this.$refs.controlsEditorTemplate) {
        return
      }
      let clientWidth = this.$refs.controlsEditorTemplate.clientWidth
      if (!clientWidth) {
        return
      }
      if (clientWidth > 1151) {
        clientWidth = 1151
      }
      if (clientWidth < 900) {
        clientWidth = 900
      }
      if (clientWidth) {
        this.$refs.templateEditorDrag.$el.style.transform = 'scale(' + clientWidth / 1151 + ')'
        this.$refs.templateEditorDrag.$el.style['-webkit-transform'] = 'scale(' + clientWidth / 1151 + ')'
        this.$refs.templateEditorDrag.$el.style['-moz-transform'] = 'scale(' + clientWidth / 1151 + ')'
        this.$refs.templateEditorDrag.$el.style['-o-transform'] = 'scale(' + clientWidth / 1151 + ')'
      }
    },
    getVal() {
      let newValue = this.$refs.templateEditorDrag.getEditHtml()
      if (newValue == '<style>.templateWrap ul,.templateWrap li{list-style:none;margin:0;padding:0}.templateWrap{font-family:-apple-system,"Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","WenQuanYi Micro Hei",Arial,sans-serif;-webkit-font-smoothing:antialiased;padding:12px 0;color:#666}.templateWrap a{text-decoration:none}.templateWrap hr{border:0;height:1px;background-color:#ddd}.templateWrap .template{background-color:#fff;max-width:600px;margin:0 auto}.templateWrap .template .moduleList{min-width:120px;position:relative}.templateWrap table{border-collapse:collapse;border-spacing:0;table-layout:fixed;width:100%}.templateWrap table.col3 td{width:33.33333%}.templateWrap table.col2 td{width:50%}.templateWrap .template .moduleItem{position:relative;padding:5px 0}.templateWrap .template .moduleItem>div{padding:5px 15px}.templateWrap .template .moduleItem .imageBox .imageObj img{width:100%}.templateWrap .template .moduleItem .imageBox .imageObj .btnPic{display:none}.templateWrap .M_scrawl{border:0;border-radius:3px;background:#008cee;color:#fff;font-size:12px;margin-right:3px}@media only screen and (max-width:640px){.templateWrap{padding:0!important}.templateWrap table td{display:block!important;width:100%!important}}.moduleGoods td{width:50%}.goodsListCard .goodsItem{display:inline-block;width:278px;margin-bottom:15px;font-size:14px;vertical-align:top}.goodsListCard .goodsItem:nth-child(2n-1){margin-right:9px}.goodsListCard .goodsItem .goodsPic{width:278px;height:278px;background-color:#eee;overflow:hidden}.goodsListCard .goodsItem .goodsName{margin:8px 0 2px;color:#303133}.goodsListCard .goodsItem .goodsDescr{color:#909399}.goodsListCard .goodsItem .goodsPrice{color:red}.goodsListLine .goodsItem{clear:both;margin-bottom:15px;font-size:15px}.goodsListLine .goodsItem .goodsPic{width:200px;height:200px;margin-right:15px;float:left}.goodsListLine .goodsItem .goodsName{margin:8px 0 2px;color:#303133}.goodsListLine .goodsItem .goodsDescr{color:#909399}.goodsListLine .goodsItem .goodsPrice{color:red}</style><div class="templateWrap"><div class="template"><ul class="moduleList" id="moduleList1"><div id="demoPlaceholder" style="text-align: center;padding-top:8px;color:#999">空白模板，可以在右侧工具栏添加模块</div></ul><ul class="moduleList" id="moduleList2"></ul><ul class="moduleList" id="moduleList3"></ul><ul class="moduleList" id="moduleList4"></ul><ul class="moduleList" id="moduleList5"></ul></div></div>') {
        newValue = ''
      }
      if (this.type == 'edit' && newValue == this.content) {
        return false
      } else {
        return newValue // 获取编辑的html
      }
    },
    clearData() {
        if (this.$refs.templateEditorDrag && this.$refs.templateEditorDrag.clearData) {
          this.$refs.templateEditorDrag.clearData()
          this.$refs.templateEditorDrag.addOneTemp(this.templateData)
        }
    },
    editVal(val) {
      let _this = this
      let times = setInterval(function() {
        if (_this.$refs.templateEditorDrag && _this.$refs.templateEditorDrag.doEditHtml) {
          clearInterval(times)
          let __this = _this
          setTimeout(function() {
            __this.$refs.templateEditorDrag.doEditHtml(val) // 传值进去编辑
          }, 500)
        }
      }, 100)
    },
    updata(url) {
      if (url && url != '') {
        let _this = this
        _this.$http.get(_this.Global.baseURL + _this.Global.api.Files.all_readContent, { params: {
          src: url
        } }).then(function (res) {
          if (res.body.content && res.body.content != '') {
            _this.content = res.body.content
            _this.editVal(res.body.content)
          }
        }, function (res) {
          _this.$message.error(_this.$t(_this.Global.errorTitle))
        })
      }
    }
  },
  components: {
    'template-editor': editorTemplate
  },
  beforeDestroy: function () {
    this.updata = null
    this.editVal = null
  },
  watch: {
    screenWidth(val) { // 监听屏幕宽度变化
      this.resize()
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.Controls-editor-template {
  // border: 1px solid red;
  position: relative;
}
</style>
