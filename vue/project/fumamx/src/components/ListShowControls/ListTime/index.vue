<template>
  <span style="margin:-2px;vertical-align: middle;"  :title="newTime">
    <!-- {{value.value}} -->
    {{newTime}}
  </span>
</template>

<script>
export default {
  name: 'Controls-Text',
  props: {
    value: {
      type: Object,
      default: function () {
        return {
          value: ''
        }
      }
    }
  },
  data () {
    return {
      newTime: ''
    }
  },
  created() {
    this.switch()
  },
  methods: {
    switch() {
      let value = this.value.value
      if (value && value !== undefined && value !== '') {
        this.newTime = this.timeShow_custom(value, 'HH:mm')
      } else {
        this.newTime = ''
      }
    }
  },
  watch: {
    'value.value': function () {
      this.switch()
    }
  },
  beforeDestroy: function () {
    this.switch = null
  }
}
</script>
