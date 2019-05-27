<template>
  <span>
      <template v-if="value.value&&value.value.length!= '0'">
            <el-popover trigger="hover" placement="top" :open-delay="500">
            <ul class="contactInfo ellipsis">
                <li v-for="(item3,index3) in value.value" :key="index3" style="height:20px;">
                    <span style="color:RGBA(34, 34, 34, 1);font-size:12px;">{{item3}}</span>
                </li>
            </ul>
            <div slot="reference" style="display:inline-block;">
                <span  style="color:RGBA(34, 34, 34, 1);font-size:12px;">{{value.value[0]}}</span>
            </div>
        </el-popover>
    </template>
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

    }
  },
  created () {
  },
  mounted () {
  },
  computed: {
  },
  methods: {
  }
}
</script>
