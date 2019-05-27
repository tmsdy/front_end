<template>
    <el-form label-width="80px" label-position="left">
        <!-- 边框颜色 -->
        <el-form-item :label="$t('fumamx-web-templateeditor.1531895082115')">
            <el-color-picker v-model="form.border_color" @change="changeStyle"></el-color-picker>
        </el-form-item>
        <el-form-item label="边框宽">
            <div class="paddingBox">
                <span class="name">上</span>
                <el-input-number size="small" v-model="form.border_width.top" @change="changeStyle" :min="0" :max="100"></el-input-number>
                <span class="name marginLeft">左</span>
                 <el-input-number size="small" v-model="form.border_width.left" @change="changeStyle" :min="0" :max="100"></el-input-number>
            </div>
            <div class="paddingBox">
                <span class="name">下</span>
                <el-input-number size="small" v-model="form.border_width.bottom" @change="changeStyle" :min="0" :max="100"></el-input-number>
                <span class="name marginLeft">右</span>
                <el-input-number size="small" v-model="form.border_width.right" @change="changeStyle" :min="0" :max="100"></el-input-number>
            </div>
        </el-form-item>
        <!-- 边框圆角 -->
        <el-form-item :label="$t('fumamx-web-templateeditor.1531896409944')">
            <el-input-number size="small" v-model="form.border_radius" @change="changeStyle" :min="0" :max="100"></el-input-number>
        </el-form-item>
    </el-form>
</template>

<script>
import { styleToObj } from '@/libs/utils.js'

export default {
  name: 'moduleStyle',
  props: {
      editingDomArr: {
        type: Object,
        default: function() {
            return {}
        }
    }
  },
  data () {
    return {
        form: {
            border_radius: '0',
            border_color: '#000',
            border_width: {
                top: '0',
                left: '0',
                right: '0',
                bottom: '0'
            }
        }
    }
  },
  created () {},
  methods: {
      changeStyle() {
        //   console.log(this.form)
          this.$emit('change', this.form)
      },
      reset() {
        this.form = {
            border_radius: '0',
            border_color: '#000',
            border_width: {
                top: '0',
                left: '0',
                right: '0',
                bottom: '0'
            }
        }
      },
      // 传来的样式，匹配到数据上
      showData(styleObj) {
        // padding
        if (!styleObj) { return }
        if (styleObj['border-radius']) {
            let noPX = styleObj['border-radius'].replace(/px/g, '')
            this.form.border_radius = noPX || '0'
        }
        if (styleObj['border-color']) {
            this.form.border_color = styleObj['border-color'] || '#000'
        }
        if (styleObj['border-width']) {
            let borderStr = styleObj['border-width'].replace(/px/g, '')
            let borderArr = borderStr.split(' ')
            this.form.border_width.top = borderArr[0] || '0'
            this.form.border_width.right = borderArr[1] || '0'
            this.form.border_width.bottom = borderArr[2] || '0'
            this.form.border_width.left = borderArr[3] || '0'
        }
        // console.log(this.form)
      }
  },
  watch: {
      editingDomArr: {
        handler(newName, oldName) {
            this.reset() // 清零先
            let rootStyleStr = $(newName[0]).parent().attr('style')
            let styleObj = styleToObj(rootStyleStr)
            // console.log(styleObj)
            this.showData(styleObj) // 传来的样式，匹配到数据上
        },
        immediate: true,
        deep: true
      }
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
.paddingBox {
    &:first-child{
        margin-bottom: 5px;
    }
    .el-input-number {
        width: 110px;
    }
    .name{
        margin-right: 5px;
    }
    .marginLeft {
        margin-left: 33px;
    }
}
</style>
