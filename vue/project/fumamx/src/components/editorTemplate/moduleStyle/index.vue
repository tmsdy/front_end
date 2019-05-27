<template>
    <el-form label-width="80px" label-position="left">
        <!-- 文字 -->
        <el-form-item :label="$t('fumamx-web-templateeditor.1531895444030')">
            <el-color-picker v-model="form.color" @change="changeStyle"></el-color-picker>
        </el-form-item>
        <!-- 背景 -->
        <el-form-item :label="$t('fumamx-web-templateeditor.1531895470257')">
            <el-color-picker v-model="form.background_color" @change="changeStyle"></el-color-picker>
        </el-form-item>
        <!-- 对齐方式 -->
        <el-form-item :label="$t('fumamx-web-templateeditor.1531895557241')">
            <el-radio-group v-model="form.text_align" size="small" @change="changeStyle">
                <!-- 左对齐 -->
                <el-radio-button label="left">{{$t('fumamx-web-templateeditor.1531901607013')}}</el-radio-button>
                <!-- 居中 -->
                <el-radio-button label="center">{{$t('fumamx-web-templateeditor.1531901646949')}}</el-radio-button>
                <!-- 右对齐 -->
                <el-radio-button label="right">{{$t('fumamx-web-templateeditor.1531901578485')}}</el-radio-button>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="内填充">
            <div class="paddingBox">
                <span class="name">上</span>
                <el-input-number size="small" v-model="form.padding.top" @change="changeStyle" :min="0" :max="100"></el-input-number>
                <span class="name marginLeft">左</span>
                 <el-input-number size="small" v-model="form.padding.left" @change="changeStyle" :min="0" :max="100"></el-input-number>
            </div>
            <div class="paddingBox">
                <span class="name">下</span>
                <el-input-number size="small" v-model="form.padding.bottom" @change="changeStyle" :min="0" :max="100"></el-input-number>
                <span class="name marginLeft">右</span>
                <el-input-number size="small" v-model="form.padding.right" @change="changeStyle" :min="0" :max="100"></el-input-number>
            </div>
        </el-form-item>
        <el-form-item label="外间距">
            <div class="paddingBox">
                <span class="name">上</span>
                <el-input-number size="small" v-model="form.margin.top" @change="changeStyle" :min="-100" :max="100"></el-input-number>
                <span class="name marginLeft">左</span>
                 <el-input-number size="small" v-model="form.margin.left" @change="changeStyle" :min="-100" :max="100"></el-input-number>
            </div>
            <div class="paddingBox">
                <span class="name">下</span>
                <el-input-number size="small" v-model="form.margin.bottom" @change="changeStyle" :min="-100" :max="100"></el-input-number>
                <span class="name marginLeft">右</span>
                <el-input-number size="small" v-model="form.margin.right" @change="changeStyle" :min="-100" :max="100"></el-input-number>
            </div>
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
            color: '',
            background_color: '',
            text_align: 'left',
            padding: {
                top: '0',
                left: '0',
                right: '0',
                bottom: '0'
            },
            margin: {
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
          this.$emit('change', this.form)
      },
      reset() {
        this.form = {
            color: '',
            background_color: '',
            text_align: 'left',
            padding: {
                top: '0',
                left: '0',
                right: '0',
                bottom: '0'
            },
            margin: {
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
        if (styleObj.padding) {
            let paddingStr = styleObj.padding.replace(/px/g, '')
            let paddingArr = paddingStr.split(' ')
            this.form.padding.top = paddingArr[0] || '0'
            this.form.padding.right = paddingArr[1] || '0'
            this.form.padding.bottom = paddingArr[2] || '0'
            this.form.padding.left = paddingArr[3] || '0'
        }
        // margin
        if (styleObj.margin) {
            let marginStr = styleObj.margin.replace(/px/g, '')
            let marginArr = marginStr.split(' ')
            this.form.margin.top = marginArr[0] || '0'
            this.form.margin.right = marginArr[1] || '0'
            this.form.margin.bottom = marginArr[2] || '0'
            this.form.margin.left = marginArr[3] || '0'
        }
        if (styleObj.color) {
            this.form.color = styleObj.color || ''
        }
        if (styleObj['background-color']) {
            this.form.background_color = styleObj['background-color'] || ''
        }
        if (styleObj['text-align']) {
            this.form.text_align = styleObj['text-align'] || 'left'
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
