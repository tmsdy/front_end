<template>
    <file-upload :file-list="value.value" :limitSize="10">

    </file-upload>
</template>

<script>

import FileUpload from '@/components/FileUpload/index' // 文件上传
export default {
  name: 'Controls-Attachment',
  props: {
    value: {
      type: Object,
      default: function () {
        return {
          value: ''
        }
      }
    },
    itemData: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
    }
  },
  created () {

  },
  methods: {
  },
  watch: {
  },
  components: {
    'file-upload': FileUpload
  }
}
</script>
