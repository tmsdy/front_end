<template>
<!-- 图片设置 -->
<el-dialog class="ImgSet" v-dialogDrag :title="$t('mxpcweb.sale.components.1557565182887')" :visible.sync="dialogVisible" custom-class="width1020" @close="resetForm()">
  <div class="ImgSetBox">
      <div class="largeImg">
          <div>
              <img :src="checkPic(largeImg.url, '400x400')" :nerror="defaultImg" alt="">
          </div>
      </div>
      <div class="smallImg">
          <div class="haveImg">
              <!-- 已选图片 -->
              <div class="title">{{$t('mxpcweb.sale.components.1557564964929')}}</div>
              <div class="listBox">
                    <div v-if="haveList.length == 0" class="list">
                        <img style="width:80px;height:80px;" :src="checkPic('', '80x80')" :onerror="defaultImg" alt="">
                    </div>
                    <template v-else>
                        <div class="list" v-for="(item, index) in haveList" :class="largeImg.url == item && largeImg.type == 'use' ? 'listCheck' :  ''" :key="index" @click="largeImg = {
                            type: 'use',
                            url: item
                        }">
                            <img style="width:80px;height:80px;" :src="checkPic(item, '80x80')" :onerror="defaultImg" alt="">
                            <span class="delete hover" @click.stop="haveDeleteItem(index)">
                                <i class="iconfont icon-close-bold-mini"></i>
                            </span>
                            <div class="cover" v-if="index == 0">
                                <!-- 封面 -->
                                <span class="coverName">{{$t('mxpcweb.sale.components.1557564965118')}}</span>
                            </div>
                            <div class="optBut" @click.stop v-if="goodsList.length > 1">
                                <i class="iconfont icon-page-left-mini" v-if="index == 0"></i>
                                <i class="iconfont icon-page-left-mini text-hover" v-else @click="haveList = swapArr(haveList, index-1, index)"></i>
                                <!-- 设为封面 -->
                                <span class="text-hover" v-if="index != 0" @click="haveMainImg(index)">{{$t('mxpcweb.sale.components.1557565183081')}}</span>
                                <i class="iconfont icon-page-right-mini" v-if="index == (haveList.length - 1)"></i>
                                <i class="iconfont icon-page-right-mini text-hover" v-else @click="haveList = swapArr(haveList, index+1, index)"></i>
                            </div>
                        </div>
                    </template>
              </div>
          </div>
          <div class="goodsImg">
              <!-- 商品图片 -->
                <div class="title">{{$t('mxpcweb.sale.components.1557565183271')}}</div>
                <div class="listBox">
                    <div v-if="goodsList.length == 0" class="list">
                        <img style="width:80px;height:80px;" :src="checkPic('', '80x80')" :onerror="defaultImg" alt="">
                    </div>
                    <template v-else>
                        <div class="list" v-for="(item, index) in goodsList" :key="index" :class="largeImg.url == item && largeImg.type == 'goods' ? 'listCheck' :  ''" @click.stop="checkItem(item)">
                            <img :src="checkPic(item, '80x80')" :onerror="defaultImg" alt="">
                            <span class="delete hover" @click.stop="goodsDeleteItem(index)">
                                <i class="iconfont icon-close-bold-mini"></i>
                            </span>
                            <div class="cover" v-if="index == 0">
                                <!-- 封面 -->
                                <span class="coverName">{{$t('mxpcweb.sale.components.1557564965118')}}</span>
                            </div>
                            <div class="optBut" @click.stop v-if="goodsList.length > 1">
                                <i class="iconfont icon-page-left-mini" v-if="index == 0"></i>
                                <i class="iconfont icon-page-left-mini text-hover" v-else @click="goodsList = swapArr(goodsList, index-1, index)"></i>
                                <!-- 设为封面 -->
                                <span class="text-hover" v-if="index != 0" @click="goodsMainImg(index)">{{$t('mxpcweb.sale.components.1557565183081')}}</span>
                                <i class="iconfont icon-page-right-mini" v-if="index == (goodsList.length - 1)"></i>
                                <i class="iconfont icon-page-right-mini text-hover" v-else @click="goodsList = swapArr(goodsList, index+1, index)"></i>
                            </div>
                        </div>
                    </template>
                    <label class="imgBoxNo text-hover" @change="onChange" v-show="goodsList.length < 9">
                        <input type="file" style="display: none;" :multiple="true" />
                        <div>
                            <i style="font-size:24px;" class="iconfont icon-plus-file"></i>
                        </div>
                        <!-- 上传图片 -->
                        <div>{{$t('mxpcweb.sale.components.1557565183481')}}</div>
                    </label>
                </div>
          </div>
      </div>
    <fileupload-dialog :url="Global.uploadUrl" ref="fileuploadDialog" method="put" :fileUploadSuccess="fileUploadSuccess" :multiple="false"></fileupload-dialog>
  </div>
  <span slot="footer" class="dialog-footer">
      <div style="text-align:center">
        <!-- 确 定 -->
        <el-button type="primary" @click="submit()" :loading="submitLoading">{{$t('mxpcweb.sale.components.1557564964547')}}</el-button>
        <!-- 取 消 -->
        <el-button @click="dialogVisible = false">{{$t('mxpcweb.sale.components.1557564617043')}}</el-button>
      </div>
  </span>
</el-dialog>
</template>

<script>
import FileuploadDialog from '@/basecomponents/FileuploadDialog/index'
export default {
    name: 'ImgSet',
    props: {
    },
    data() {
        return {
            dialogVisible: false,
            defaultImg: 'this.src="/static/images/goods/error.jpg"',
            haveList: [],
            largeImg: {
                type: '',
                url: ''
            },
            indexId: 0,
            goodsList: [],
            imagesId: [],
            itemData: {},
            submitLoading: false
        }
    },
    methods: {
        onChange(e) {
            let inputElement = e.target
            let files = []
            if (Array.isArray(inputElement)) { // [file] 直接是文件数组
                inputElement.forEach(function (element) {
                    // 解决图片name丢失问题
                    files.push(dataURLtoBlob(element))
                }, this)
            } else { // 是input type="file"
                if (Array.isArray(inputElement.files)) {
                    files = inputElement.files
                } else {
                    Object.keys(inputElement.files).forEach(function (key) {
                        files.push(inputElement.files[key])
                    })
                }
            }
            if (files.length + this.goodsList.length > 9) {
                // 图片总数超过最大限制，请重新选择！
                this.$confirm(this.$t('mxpcweb.PP001.PP001List.1543302028817'), this.$t('mxpcweb.client.1529047715824'), {
                    confirmButtonText: this.$t('mxpcweb.client.1529047741736'),
                    cancelButtonText: this.$t('mxpcweb.client.1529047588840'),
                    type: 'warning'
                }).then(() => {
                }).catch(() => {
                })
            } else {
                this.$refs['fileuploadDialog'].upload(inputElement)
            }
        },
        // 图片更新成功的返回
        fileUploadSuccess(res) {
            this.goodsList.push(res.data)
        },
        submit() {
            let isSame = true
            if (this.imagesId.length != this.goodsList.length) {
                isSame = false
            } else {
                this.imagesId.forEach((item, index) => {
                    if (item != this.goodsList[index]) {
                        isSame = false
                    }
                })
            }
            if (!isSame) {
                let data = {
                    moduleCode: 'PP001',
                    identFieldValue: this.itemData.spuId,
                    imagesId: this.goodsList
                }
                this.submitLoading = true
                this.$http.put(this.Global.baseURL + this.Global.api.v2.document_product, data).then((res) => {
                    this.submitLoading = false
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.$emit('updateImg', this.haveList, this.indexId)
                        this.dialogVisible = false
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                }, (res) => {
                    this.submitLoading = false
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
            } else {
                this.$emit('updateImg', this.haveList, this.indexId)
                this.dialogVisible = false
            }
        },
        checkItem(item) {
            this.largeImg = {
                type: 'goods',
                url: item
            }
            let isHave = false
            this.haveList.forEach(element => {
                if (element == item) {
                    isHave = true
                }
            })
            if (!isHave) {
                this.haveList.push(item)
            }
        },
        haveMainImg(index) {
            this.haveList = this.swapArr(this.haveList, 0, index)
        },
        goodsMainImg(index) {
            this.goodsList = this.swapArr(this.goodsList, 0, index)
        },
        swapArr(arr, index1, index2) {
            arr[index1] = arr.splice(index2, 1, arr[index1])[0]
            return arr
        },
        haveDeleteItem(index) {
            this.haveList.splice(index, 1)
        },
        goodsDeleteItem(index) {
            this.goodsList.splice(index, 1)
        },
        checkPic(imgId, type) {
            if (!imgId || imgId == '') {
                return '/static/images/goods/noImg.jpg'
            }
            return this.getGlobalImgSrc(imgId, type)
        },
        open(item, index) {
            this.haveList = []
            this.largeImg = {
                type: '',
                url: ''
            }
            this.goodsList = []
            this.imagesId = []
            this.itemData = {}
            this.itemData = item
            this.indexId = index
            if (item.imagesId) {
                item.imagesId.forEach(item => {
                    this.haveList.push(item)
                })
            }
            this.getImgList()
            this.dialogVisible = true
        },
        getImgList() {
            this.$http.get(this.Global.baseURL + this.Global.api.v2.document_product, {
                params: {
                    searchType: 'detail',
                    identFieldValue: this.itemData.spuId,
                    moduleCode: 'PP001'
                }
            }).then((res) => {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    let list = res.body.data.imagesId || []
                    list.forEach(item => {
                        this.goodsList.push(item)
                        this.imagesId.push(item)
                    })
                    if (this.goodsList[0]) {
                        this.largeImg = {
                            type: 'goods',
                            url: this.goodsList[0]
                        }
                    } else {
                        this.largeImg = {
                            type: 'goods',
                            url: ''
                        }
                    }
                } else {
                    this.$message.error(this.msg(res.body))
                }
            }, (res) => {
                this.submitLoading = false
                this.$message.error(this.$t(this.Global.errorTitle))
            })
        },
        resetForm() {}
    },
    components: {
        'fileupload-dialog': FileuploadDialog
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
