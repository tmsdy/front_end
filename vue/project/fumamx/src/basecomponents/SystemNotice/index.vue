<template>
    <div class="SystemNotice">
        <!-- <el-dialog title="abc" :visible.sync="isOpen" custom-class="width520" :modal="false" v-dialogDrag> -->
        <el-dialog :visible.sync="isOpen" custom-class="width520" :close-on-click-modal="false" :modal="false" :close-on-press-escape="false" v-dialogDrag>
            <div class="noticeTitle">
                <i class="iconfont icon-rocket-empty"></i>{{backData.noticeCaption}}</div>
            <div class="noticeBody">
                <div class="header">
                    <span>{{formatDate(backData.releaseDate)}}</span>
                    <span>{{backData.author}}</span>
                </div>
                <div class="content MXscroll" v-html="backData.noticeAbstract"></div>

            </div>
            <div class="text-center">
                <!-- 了解更多 -->
                <el-button type="primary" size="large" @click="goUrl()" style="width:148px;">{{$t('mxpcweb.components.1533784015446')}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { isObject } from '@/libs/utils.js'
export default {
    name: 'SystemNotice',
    data() {
        return {
            backData: {
                // noticeCaption: '我们都有一个家',
                // releaseDate: '2018-08-23 00:00:00',
                // noticeAbstract: '弹窗开关弹窗开关'
            }, // 接口返回
            isOpen: false // 弹窗开关
            // isOpen: true // 弹窗开关
        }
    },
    props: {

    },
    created() {
        ep.tail('systemNotice', (data) => {
            this.getData(data)
        })
    },
    methods: {
        formatDate(val) {
            return this.timeShow_custom(val, 'YYYY-MM-DD')
        },
        goUrl() {
            // console.log(this.backData)
            // return
            this.isOpen = false
            let id = this.backData.noticeId
            let url = '/main/systemset/systembulletin?noticeId=' + id
            this.$router.push(url)
        },
        getData(data) {
            // console.log(data)
            // return
            let _this = this
            let dataPar = {
                type: 'detail',
                noticeId: data.billId,
                moduleCode: data.moduleCode
            }
            this.$http.get(this.Global.baseURL + this.Global.api.v2.sysNotice_get, { params: dataPar }).then((res) => {
                if (res.body && res.body.code.toString() === _this.Global.RES_OK && isObject(res.body.data)) {
                    this.isOpen = true
                    // console.log('+++++++++++')
                    // console.log(res.body.data)
                    this.backData = res.body.data.detail
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, (res) => {
                _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
            })
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.SystemNotice {
  // border:2px solid red;
  .noticeTitle {
    // border:1px solid red;
    position: absolute;
    left: 15px;
    top: 16px;
    font-size: 18px;
    // color: #303133;
    > i {
      font-size: 16px;
      margin-right: 2px;
    }
  }
  .noticeBody {
    // border: 1px solid blue;
    margin-top: -15px;
    padding: 0 20px;
    .header {
      // border: 1px solid blue;
      padding: 5px 0 12px;
      font-size: 12px;
      border-bottom: 1px dashed #e5e5e5;
      > span {
        margin-right: 10px;
        color: #909399;
      }
    }
    .content {
      // border: 1px solid blue;
      padding: 10px 0 20px;
      max-height: 400px;
      overflow: auto;
      color: #303133;
    }
    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      height: 5px;
      background: #d0021b;
      border-radius: 5px 5px 0 0;
    }
  }
}
</style>
