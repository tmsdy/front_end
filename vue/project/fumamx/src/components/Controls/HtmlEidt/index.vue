<template>
  <div class="Controls-editor-template" :style="{'height':height}">
    <!-- 编辑器 -->
    <template-editor :visible.sync="isOpenDrag" ref="templateEditorDrag" :showHeader="false"></template-editor>
  </div>
</template>

<script>
import editorTemplate from '@/components/editorTemplate/index'
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
          id: '1' // 默认模板布局
        }
      }
    }
  },
  data() {
    return {
      isOpenDrag: true
    }
  },
  mounted() {
    this.$refs.templateEditorDrag.addOneTemp(this.templateData)
  },
  methods: {
    getVal() {
      return this.$refs.templateEditorDrag.getEditHtml() // 获取编辑的html
    },
    editVal(val) {
      this.$refs.templateEditorDrag.doEditHtml(val) // 传值进去编辑
    }
  },
  components: {
    'template-editor': editorTemplate
  },
  beforeDestroy: function () {
      this.editVal = null
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.Controls-editor-template {
  // border: 1px solid red;
  position: relative;
}
</style>
