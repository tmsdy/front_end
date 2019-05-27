<template>
    <span class="EditTextComponent">
        <span v-show="!isEdit" @mouseover="isEditTextIcon = true" @mouseout="isEditTextIcon = false">
            <span ref="defaultText" :style="textStyle">{{editText}}</span>
            <i class="iconfont editText-icon" :class="[defaultIcon]" :style="{visibility: isEditTextIcon ? 'visible':'hidden' }" @click="startEdit()"></i>
        </span>
        <span v-show="isEdit">
            <input v-model="editText" class="editTextInput" ref="editTextInput">
            <i class="iconfont editText-icon" :class="[finishIcon]" @click="endEdit()"></i>
        </span>
    </span>
</template>

<script>
export default {
  name: 'EditTextComponent',
  props: {
    text: {
      type: [String, Number],
      default: ''
    },
    defaultIcon: {
      type: String,
      default: 'icon-edit'
    },
    finishIcon: {
      type: String,
      default: 'icon-correct'
    },
    textStyle: {
      type: Object,
      default: function () {
        return {}
      }
    },
    noDataTitle: {
      type: String,
      default: '暂无数据'
    }
  },
  data () {
    return {
      isEdit: false,
      // editText: this.text,
      isEditTextIcon: false
    }
  },
  created () {
    if (this.text === '') {
      this.editText = this.noDataTitle
    } else {
      this.editText = this.text
    }
  },
  mounted () {

  },
  methods: {
    startEdit () {
      this.isEdit = true
      let editTextInput = this.$refs['editTextInput']
      let defaultTextWidth = this.$refs['defaultText'].offsetWidth
      if (defaultTextWidth < 50) {
        defaultTextWidth = 50
      }
      editTextInput.style.width = defaultTextWidth + 'px'
      setTimeout(() => {
        editTextInput.focus()
      }, 20)
      this.$emit('startEdit', this.editText)
    },
    endEdit () {
      this.isEdit = false
      this.$emit('endEdit', this.editText)
    }
  },
  watch: {
    // 实现子父组件，双向数据同步。首先父组件需要sync修饰。子组件需要update:父组件属性
    editText (val) {
      this.$emit('update:text', val)
      this.$emit('change', val)
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
.EditTextComponent {
    display: inline-block;
    .editText-icon {
        cursor: pointer;
    }
    .editTextInput {
        width: 100px;
        outline: none;
        border: 1px #cccccc solid;
    }
}
</style>
