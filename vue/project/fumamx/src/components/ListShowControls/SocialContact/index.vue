<template>
    <span class="icoSociety" v-if="value.value !== undefined">
        <span v-for="(item3,index3) in returnList(value.value)" :key="index3" :title="item3.value" @click="socialUrl(item3,item3.value)">
            <i class="iconfont" :class="item3.iconUri"></i>
        </span>
    </span>
</template>

<script>
import { mapGetters } from 'vuex'
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
  computed: {
    ...mapGetters([
      'socialTypeList'
    ])
  },
  methods: {
    // 社交账号点击跳转
    socialUrl (obj, value) {
      if (obj.uri) {
        let uri = obj.uri.replace('{accountNo}', value)
        // window.open(uri, uri.substring(0, 4) == 'http' ? '' : '_self')
        this.openNewWindowTab(uri)
      }
    },
    returnList (list) {
      let _this = this
      let socialArray = []
      if (list) {
        Object.keys(list).forEach(function (item1) {
          if (list[item1] != '') {
            _this.socialTypeList.forEach(function (item2) {
              if (item1 == item2.socialId) {
                socialArray.push({
                  iconUri: item2.iconUri,
                  socialId: item2.socialId,
                  socialName: item2.socialName,
                  typeFlag: item2.typeFlag,
                  uri: item2.uri,
                  value: list[item1]
                })
              }
            })
          }
        })
      }
      return socialArray
    }
  },
  beforeDestroy: function () {
    this.returnList = null
    this.socialUrl = null
  }
}
</script>

<style  lang="less" rel="stylesheet/less" scoped>
    .icoSociety {
        >span {
            background-color: RGBA(144, 147, 153, 1);
            color: #fff;
            display: inline-block;
            width: 20px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            border-radius: 3px;
            margin-right: 5px;
            >i {
                font-size: 17px;
            }
            &:hover {
                background-color: #333;
                cursor: pointer;
            }
        }
    }
</style>
