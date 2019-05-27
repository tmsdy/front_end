<template>
  <span :title="newTime">
    {{newTime}}
  </span>
</template>

<script>
export default {
  name: 'Controls-Time',
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
    switch () {
      let value = this.value.value
      if (value && value !== undefined && value !== '') {
        this.newTime = this.timeShow_custom(value)
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
