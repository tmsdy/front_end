<template>
    <div class="CommentsShow" v-if="dataList.length>0">
        <div class="msg" v-for="(item,index) in reverseSum" :key="index">
            <i class="iconfont icon-dot" :style="setCommentsColor(item.commentFlag)"></i>
            <span class="commDate">{{converDate(item.deliveryTime)}}</span>
            <span class="commContent">{{item.content}}</span>
            <div class="btn" @click="delThisComment(item,index)" :title="$t('mxpcweb.PP001.PP001List.1543302803587')">
                <i class="iconfont icon-del"></i>
            </div>
        </div>
    </div>
</template>

<script>
/**
 * 批注展示，如下页面用到：单据详情主档......
*/
import { commentsColor } from '@/libs/utils.js'

export default {
  name: 'CommentsShow',
  props: {
    dataList: {
      type: Array,
      default: function () {
        return []
      }
    },
    moduleCode: 0,
    pageId: 0
  },
  data () {
    return {

    }
  },
  computed: {
    reverseSum() {
      return this.dataList.concat().reverse()
    }
  },
  methods: {
    // 批注色彩
    setCommentsColor (flag) {
      return commentsColor(flag)
    },
    delThisComment (item, index) {
      // console.log(item)
      let _this = this
      this.$confirm('确定删除这条批注?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {
          'identFieldValue': this.pageId,
          'moduleCode': this.moduleCode,
          'commentId': item.commentId
        }
        _this.$http.put(_this.Global.baseURL + _this.Global.api.v2.billComment_update, data).then(function (res) {
          if (res.body.code.toString() === _this.Global.RES_OK) {
            _this.$message.success(_this.msg(res.body))
            setTimeout(function () {
              _this.dataList.splice(index, 1)
            }, 1000)
          } else {
            _this.$message.error(_this.msg(res.body))
          }
        }, function (res) {
          _this.$message.error(_this.$t(_this.Global.errorTitle))
        }
        )
      }).catch(() => { })
    },
    //
    converDate (val) {
      return this.$m_formulateTime(val)
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
.CommentsShow {
    margin-top:5px;
    border-top:1px solid transparent;
    .msg {
        // border:1px solid red;
        padding: 0 6px 0 3px;
        line-height: 20px;
        font-size: 12px;
        background-color: #fdfdfd;
        margin: 5px 0;
        border-radius: 3px;
        position: relative;
        .commDate {
            color: #909399;
            float: left;
        }
        .commContent {
            color: #606266;
            margin-left: 3px;
            white-space:pre-wrap;
        }
        .btn {
            display: none;
            background-color: #888;
            width: 18px;
            height: 18px;
            line-height: 18px;
            text-align: center;
            border-radius: 50%;
            position: absolute;
            top: 50%;
            margin-top: -9px;
            right: 10px;
            i {
                color: #fff;
                font-size: 10px;
            }
            &:hover {
                background-color: #555;
                cursor: pointer;
            }
        }
        >.iconfont {
          float: left;
            font-size: 13px;
            margin-right: 2px;
            font-weight: bold;
        }
        >.icon-dot {
            font-size: 14px;
        }
        &:hover {
            background-color: #f9f9f9;
            .btn {
                display: inline-block;
            }
        }
    }
}
</style>
