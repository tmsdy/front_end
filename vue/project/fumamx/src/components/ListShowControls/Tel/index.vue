<template>
  <span>
    <template v-if="value.value&&value.value.length!= '0'">
        <el-popover trigger="hover" placement="top" :open-delay="500">
        <ul class="contactInfo ellipsis">
            <li v-for="(item3,index3) in value.value.split(',')" :key="index3" style="height:20px;">
                <span style="color:RGBA(34, 34, 34, 1);font-size:12px;">{{item3}}</span>
            </li>
        </ul>
        <div slot="reference" style="display:inline-block;">
            <span  style="color:RGBA(34, 34, 34, 1);font-size:12px;">{{value.value.split(',')[0]}}</span>
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
    },
    itemData: {
      type: Object,
      default: function () {
        return {
          cnFieldCaption: '',
          cnFieldHint: '',
          controlTypeId: 41,
          dictCode: 0,
          fieldCategory: 2,
          fieldGroup: 2,
          fieldName: 'twitter',
          inDefaultValue: '',
          isNotNull: 0,
          strucId: 1
        }
      }
    }
  }
}
</script>
