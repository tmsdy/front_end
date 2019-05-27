<template>
<!-- 选择商品 -->
    <el-dialog v-dialogDrag :title="$t('mxpcweb.sale.components.1557565300496')" :visible.sync="isOpen" custom-class="width920" @close="resetForm()">
      <div class="goodsBox" style="height:630px;">
        <div class="tabsBox">
          <div class="tabs">
            <!-- 待选商品 -->
            <div class="tabsItem tabsItem1" :class="tab == '1'?'tabsItemCheck':''" @click="checkTab('1')">{{$t('mxpcweb.sale.components.1557711237779')}}</div>
            <div class="tabsItem tabsItem2" :class="tab == '2'?'tabsItemCheck':''" @click="checkTab('2')">
              <!-- 已选商品 -->
              {{$t('mxpcweb.sale.components.1557711256184')}}
              <span class="tabsItemNum">{{checkLists.length}}</span>
            </div>
          </div>
        </div>
        <div v-show="tab == '1'">
          <div class="text-center seachBox" style="margin:0 10px 12px;">
              <span class="className ellipsis">{{catgName}}</span>
              <!-- 请输入商品编号/商品名/商品条码 -->
              <el-input :placeholder="$t('mxpcweb.sale.components.1557565264875')" v-model="keywords" @keyup.enter.native="handleIconClick" :on-icon-click="handleIconClick" style="width:320px;">
              </el-input>
              <!-- 搜索 -->
              <span class="seach" @click="getList()">{{$t('mxpcweb.sale.components.1557565265083')}}</span>
          </div>
          <div class="title" v-if="categoryList.length > 0">
            <!-- 不限 -->
              <span class="lable text-hover ellipsis" :class="checkList == ''?'lable1':'lable2'" @click="insideUpdata()">{{$t('mxpcweb.sale.components.1557711304555')}}</span>
              <span class="lable text-hover ellipsis" :class="checkList == item.catgId?'lable1':'lable2'"
                  v-for="item in categoryList.slice(categoryList.length - 3 > 0 ? categoryList.length - 3 : 0, categoryList.length)"
                  :key="item.catgId" @click="insideUpdata(item)">
                  {{item.catgName}}
              </span>
          </div>
          <div v-loading="isLoading" style="height:400px;position:relative;">
            <span class="allCheck" v-show="tableData3.length > 0">
              <el-checkbox size="small"  :indeterminate="controlData.isIndeterminate" v-model="controlData.checkAll" @change="handleCheckAllChange"></el-checkbox>
            </span>
            <el-checkbox-group v-if="tableData3.length > 0" v-model="controlData.checkedCities" @change="handleCheckedCitiesChange" >
                <el-table :data="tableData3" height="400" class="goodsList widthFull" v-loading="isLoading">
                    <el-table-column width="50">
                        <template slot-scope="scope">
                          <span @click="checkClick(scope.row)">
                            <el-checkbox :label="scope.row.spuId  + ''" size="small">&nbsp;</el-checkbox>
                          </span>
                        </template>
                    </el-table-column>
                    <!-- 商品名 -->
                    <el-table-column :label="$t('mxpcweb.sale.components.1557711333848')" width="120">
                      <template slot-scope="scope">
                        <img class="pic" :src="checkPic(scope.row)" />
                      </template>
                    </el-table-column>
                    <el-table-column label="" width="180">
                      <template slot-scope="scope">
                        <div>{{scope.row.spuCode}}</div>
                        <div>{{scope.row.spuName}}</div>
                        <div class="displayDesc" :title="scope.row.displayDesc">{{scope.row.displayDesc}}</div>
                        <div class="otherField">
                          <el-popover ref="popover1" placement="bottom-start" width="200" trigger="hover">
                            <ul>
                              <!-- 单箱毛重： -->
                              <!-- 无 -->
                              <li>{{$t('mxpcweb.PP001.PP001List.1540347670939')}}{{scope.row.unitGW&&scope.row.unitGW!=''?parseFloat(scope.row.unitGW).toFixed(2) + 'kg':$t('mxpcweb.sale.components.1557711430122')}}</li>
                              <!-- 单箱体积： -->
                              <!-- 无 -->
                              <li>{{$t('mxpcweb.sale.components.1557711374257')}}{{scope.row.unitVol&&scope.row.unitVol!=''?parseFloat(scope.row.unitVol).toFixed(2) + 'm³':$t('mxpcweb.sale.components.1557711430122')}}</li>
                              <!-- 单箱数量： -->
                              <!-- 件 -->
                              <!-- 无 -->
                              <li>{{$t('mxpcweb.sale.components.1557711391537')}}{{scope.row.unitQty&&scope.row.unitQty!=''?parseInt(scope.row.unitQty) + $t('mxpcweb.sale.components.1557711498244'):$t('mxpcweb.sale.components.1557711430122')}}</li>
                              <!-- 40尺高柜数量： -->
                              <!-- 个 -->
                              <!-- 无 -->
                              <li>{{$t('mxpcweb.sale.components.1557711411893')}}{{scope.row.cont40LR&&scope.row.cont40LR!=''?parseInt(scope.row.cont40LR) + $t('mxpcweb.sale.components.1557711514980'):$t('mxpcweb.sale.components.1557711430122')}}</li>
                            </ul>
                          </el-popover>
                          <i class="iconfont icon-goods text-hover" style="font-size:16px;" v-popover:popover1></i>
                        </div>
                      </template>
                    </el-table-column>
                    <!-- 标准售价 -->
                    <el-table-column :label="$t('mxpcweb.PP001.PP001List.1540347651264')" width="130" align="center">
                      <template slot-scope="scope">
                        <span v-if="scope.row.salePrice && scope.row.salePrice != ''">
                            <component v-bind:is="'controlCurrency'" ref="control" :value="{value:scope.row.saleCur}"></component>
                            {{parseFloat(scope.row.salePrice)}}
                        </span>
                        <span v-else>-</span>
                      </template>
                    </el-table-column>
                    <!-- 计量单位 -->
                    <el-table-column :label="$t('mxpcweb.sale.components.1557565035776')" width="130" align="center">
                      <template slot-scope="scope">
                        <component v-bind:is="'control55'" ref="control" :value="{value:scope.row.unit}"></component>
                      </template>
                    </el-table-column>
                    <!-- 数量 -->
                    <el-table-column :label="$t('mxpcweb.sale.components.1557565035577')" width="130" align="center">
                      <template slot-scope="scope">
                        <div class="saleQty text-hover" @click="$refs.saleQtyBox.open(scope.row)" v-if="scope.row.strucId_2 && scope.row.strucId_2.length > 0">
                          {{scope.row.saleQty}}
                        </div>
                        <!-- 请输入 -->
                        <input
                        v-else
                        @click.stop type="number"
                        min="0"
                        :placeholder="$t('mxpcweb.sale.components.1557565182681')"
                        onkeyup="this.value=this.value.replace(/\D/g,'')"
                        onafterpaste="this.value=this.value.replace(/\D/g,'')"
                        v-model="scope.row.saleQty"/>
                      </template>
                    </el-table-column>
                    <!-- 创建时间 -->
                    <el-table-column :label="$t('mxpcweb.sale.components.1557711591938')" align="center">
                      <template slot-scope="scope">
                        {{timeShow_custom(scope.row.createDate, 'YYYY-MM-DD')}}
                      </template>
                    </el-table-column>
                </el-table>
            </el-checkbox-group>
            <no-data v-else></no-data>
          </div>
          <div class="text-center" style="margin-top:10px;">
              <el-pagination @size-change="eachNumChange" @current-change="currentPageChange" :current-page="paging.currentPage" :page-sizes="paging.arrEachNum" :page-size="paging.eachNum" layout="total, sizes, prev, pager, next, jumper" :total="paging.total">
              </el-pagination>
          </div>
        </div>
        <div v-if="tab == '2'" style=" height:530px;">
          <el-table v-if="checkLists.length > 0" :data="checkLists" height="530" class="goodsList widthFull">
            <!-- 商品名 -->
            <el-table-column :label="$t('mxpcweb.sale.components.1557711333848')" width="120">
              <template slot-scope="scope">
                <img class="pic" :src="checkPic(scope.row)" />
              </template>
            </el-table-column>
            <el-table-column label="" width="180">
              <template slot-scope="scope">
                <div>{{scope.row.spuCode}}</div>
                <div>{{scope.row.spuName}}</div>
                <div class="displayDesc" :title="scope.row.displayDesc">{{scope.row.displayDesc}}</div>
                <div class="otherField">
                  <el-popover ref="popover1" placement="bottom-start" width="200" trigger="hover">
                    <ul>
                      <!-- 单箱毛重： -->
                      <!-- 无 -->
                      <li>{{$t('mxpcweb.PP001.PP001List.1540347670939')}}{{scope.row.unitGW&&scope.row.unitGW!=''?parseFloat(scope.row.unitGW).toFixed(2) + 'kg':$t('mxpcweb.sale.components.1557711430122')}}</li>
                      <!-- 单箱体积： -->
                      <!-- 无 -->
                      <li>{{$t('mxpcweb.sale.components.1557711374257')}}{{scope.row.unitVol&&scope.row.unitVol!=''?parseFloat(scope.row.unitVol).toFixed(2) + 'm³':$t('mxpcweb.sale.components.1557711430122')}}</li>
                      <!-- 单箱数量： -->
                      <!-- 件 -->
                      <!-- 无 -->
                      <li>{{$t('mxpcweb.sale.components.1557711391537')}}{{scope.row.unitQty&&scope.row.unitQty!=''?parseInt(scope.row.unitQty) + $t('mxpcweb.sale.components.1557711498244'):$t('mxpcweb.sale.components.1557711430122')}}</li>
                      <!-- 40尺高柜数量： -->
                      <!-- 个 -->
                      <!-- 无 -->
                      <li>{{$t('mxpcweb.sale.components.1557711411893')}}{{scope.row.cont40LR&&scope.row.cont40LR!=''?parseInt(scope.row.cont40LR) + $t('mxpcweb.sale.components.1557711514980'):$t('mxpcweb.sale.components.1557711430122')}}</li>
                    </ul>
                  </el-popover>
                  <i class="iconfont icon-goods text-hover" style="font-size:16px;" v-popover:popover1></i>
                </div>
              </template>
            </el-table-column>
            <!-- 标准售价 -->
            <el-table-column :label="$t('mxpcweb.PP001.PP001List.1540347651264')" width="130" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.salePrice && scope.row.salePrice != ''">
                    <component v-bind:is="'controlCurrency'" ref="control" :value="{value:scope.row.saleCur}"></component>
                    {{parseFloat(scope.row.salePrice)}}
                </span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <!-- 计量单位 -->
            <el-table-column :label="$t('mxpcweb.sale.components.1557565035776')" width="130" align="center">
              <template slot-scope="scope">
                <component v-bind:is="'control55'" ref="control" :value="{value:scope.row.unit}"></component>
              </template>
            </el-table-column>
            <!-- 数量 -->
            <el-table-column :label="$t('mxpcweb.sale.components.1557565035577')" width="130" align="center">
              <template slot-scope="scope">
                <div class="saleQty text-hover" @click="$refs.saleQtyBox.open(scope.row)" v-if="scope.row.quotationMethod == '1' && scope.row.strucId_2 && scope.row.strucId_2.length > 0">
                  {{scope.row.saleQty}}
                </div>
                <!-- 请输入 -->
                <input
                v-else
                @click.stop type="number"
                min="0"
                :placeholder="$t('mxpcweb.sale.components.1557565182681')"
                onkeyup="this.value=this.value.replace(/\D/g,'')"
                onafterpaste="this.value=this.value.replace(/\D/g,'')"
                v-model="scope.row.saleQty"/>
              </template>
            </el-table-column>
            <!-- 创建时间 -->
            <el-table-column :label="$t('mxpcweb.sale.components.1557711591938')" align="center">
              <template slot-scope="scope">
                {{timeShow_custom(scope.row.createDate, 'YYYY-MM-DD HH:MM')}}
              </template>
            </el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="deleteRow(scope.$index, checkLists)"
                  type="text"
                  size="small">
                  <!-- 移除 -->
                  {{$t('mxpcweb.systemset.bizfield.1530335441748')}}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <no-data v-else></no-data>
        </div>
        <div style="text-align:center;margin-top:20px;">
          <!-- 确 定 -->
          <el-button type="primary" @click="submit()" :loading="submitLoading">{{$t('mxpcweb.sale.components.1557564964547')}}</el-button>
          <!-- 取 消 -->
          <el-button @click="isOpen = false">{{$t('mxpcweb.sale.components.1557564617043')}}</el-button>
        </div>
        <sale-qty-box ref="saleQtyBox" @updateItem="updateItem"></sale-qty-box>
      </div>
    </el-dialog>
</template>

<script>
import NoData from '@/basecomponents/NoData/index'
import ListShow from '@/components/ListShowControls/index'
import saleQtyBox from './saleQtyBox/index'
export default {
  name: 'goosView',
  props: {
    goodsType: {
      type: String,
      default: ''
    },
    categoryList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      catgName: '',
      isLoading: false,
      isOpen: false,
      keywords: '',
      tab: '1',
      submitLoading: false,
      checkList: '',
      tableData3: [],
      // 底部操作
      controlData: {
          checkedCities: [],
          checkAll: false, // 列表全选状态弹框
          isIndeterminate: false//
      },
      checkLists: [],
      paging: {
        from: 0, // 第几条开始
        total: 0, // 总条数
        currentPage: 1, // 默认当前第几页
        eachNum: 5, // 每页条数
        arrEachNum: [5, 50, 100, 150] // 可选的每页条数
      }
    }
  },
  created() {},
  methods: {
    checkClick(item) {
      if (item.qtyList) {
        return
      }
      if (item.quotationMethod == '1' && item.strucId_2 && item.strucId_2.length > 0) {
        let isHave = false
        setTimeout(() => {
          this.$nextTick(() => {
            this.controlData.checkedCities.forEach(items => {
              if (items == item.spuId + '') {
                isHave = true
              }
            })
            if (isHave) {
              this.$refs.saleQtyBox.open(item)
            }
          })
        }, 50)
      }
    },
    updateItem(obj) {
      this.tableData3.forEach(item => {
        if (obj.spuId == item.spuId) {
          item.qtyList = obj.qtyList
          item.saleQty = obj.saleQty
        }
      })
      let isHave = false
      this.checkLists.forEach(item => {
        if (obj.spuId == item.spuId) {
          item.qtyList = obj.qtyList
          item.saleQty = obj.saleQty
          isHave = true
        }
      })
      if (!isHave) {
        this.controlData.checkedCities.push(obj.spuId + '')
        this.handleCheckedCitiesChange(this.controlData.checkedCities)
      }
    },
    submit() {
      this.submitLoading = true
      let checkLists = []
      this.checkLists.forEach(item => {
        if (item.qtyList && item.qtyList.length > 0) {
          item.saleQty = '0'
          if (item.spec1 && item.spec2) {
            let spec1List = JSON.parse(JSON.stringify(item.spec1))
            let spec2List = JSON.parse(JSON.stringify(item.spec2))
            item.spec1 = {}
            item.spec2 = {}
            let isHave = true
            item.qtyList.forEach(items => {
              let itemObj = JSON.parse(JSON.stringify(item))
              spec1List.forEach(element => {
                if (element.dictItemCode == items.spec1) {
                  itemObj.spec1 = element
                }
              })
              spec2List.forEach(element => {
                if (element.dictItemCode == items.spec2) {
                  itemObj.spec2 = element
                }
              })
              itemObj.saleQty = items.saleQty
              if (itemObj.saleQty && parseFloat(itemObj.saleQty) > 0) {
                checkLists.push(itemObj)
                isHave = false
              }
            })
            if (isHave) {
              let itemObj1 = JSON.parse(JSON.stringify(item))
              if (itemObj1.spec1) {
                itemObj1.spec1 = {}
              }
              if (itemObj1.spec2) {
                itemObj1.spec2 = {}
              }
              checkLists.push(itemObj1)
            }
          } else if (item.spec1) {
            let spec1List = JSON.parse(JSON.stringify(item.spec1))
            item.spec1 = {}
            let isHave = true
            item.qtyList.forEach(items => {
              let itemObj = JSON.parse(JSON.stringify(item))
              spec1List.forEach(element => {
                if (element.dictItemCode == items.spec1) {
                  itemObj.spec1 = element
                }
              })
              itemObj.saleQty = items.saleQty
              if (itemObj.saleQty && parseFloat(itemObj.saleQty) > 0) {
                checkLists.push(itemObj)
                isHave = false
              }
            })
            if (isHave) {
              let itemObj1 = JSON.parse(JSON.stringify(item))
              if (itemObj1.spec1) {
                itemObj1.spec1 = {}
              }
              checkLists.push(itemObj1)
            }
          } else if (item.spec2) {
            let spec2List = JSON.parse(JSON.stringify(item.spec2))
            item.spec2 = {}
            let isHave = true
            item.qtyList.forEach(items => {
              let itemObj = JSON.parse(JSON.stringify(item))
              spec2List.forEach(element => {
                if (element.dictItemCode == items.spec2) {
                  itemObj.spec2 = element
                }
              })
              itemObj.saleQty = items.saleQty
              if (itemObj.saleQty && parseFloat(itemObj.saleQty) > 0) {
                checkLists.push(itemObj)
                isHave = false
              }
            })
            if (isHave) {
              let itemObj1 = JSON.parse(JSON.stringify(item))
              if (itemObj1.spec1) {
                itemObj1.spec1 = {}
              }
              if (itemObj1.spec2) {
                itemObj1.spec2 = {}
              }
              checkLists.push(itemObj1)
            }
          }
        } else {
          let itemObj = JSON.parse(JSON.stringify(item))
          if (itemObj.spec1) {
            itemObj.spec1 = {}
          }
          if (itemObj.spec2) {
            itemObj.spec2 = {}
          }
          checkLists.push(itemObj)
        }
      })
      this.$emit('checkGoodsList', checkLists)
      this.submitLoading = false
      this.isOpen = false
    },
    checkTab(type) {
      this.tab = type
      this.clearSelect()
    },
    deleteRow(index, rows) { // 从购物车移除
      rows.splice(index, 1)
    },
    // 加入购物车
    upHaveList() {
      this.controlData.checkedCities.forEach(items => {
        let isHave = false
        this.checkLists.forEach(item => {
          if (item.spuId + '' == items) {
            isHave = true
          }
        })
        if (!isHave) {
          this.tableData3.forEach(item => {
            if (item.spuId + '' == items) {
              this.checkLists.push(item)
            }
          })
        }
      })
    },
    // 返回全选列表
    returnLists() {
        let num = []
        this.tableData3.forEach(item => {
            num.push(item.spuId + '')
        })
        return num
    },
    checkSelect() {
      this.tableData3.forEach(item => {
        let isHave = false
        this.checkLists.forEach(items => {
          if (item.spuId + '' == items.spuId + '') {
            isHave = true
          }
        })
        if (isHave) {
          this.controlData.checkedCities.push(item.spuId + '')
        }
      })
      this.handleCheckedCitiesChange(this.controlData.checkedCities)
    },
    clearSelect() {
        this.controlData.checkedCities = []
        this.controlData.isIndeterminate = false
        this.controlData.checkAll = false
    },
    // 底部菜单栏操作
    // 全选、反选
    handleCheckAllChange(event) {
        this.controlData.checkedCities = event.target.checked ? this.returnLists() : []
        this.controlData.isIndeterminate = false
        this.upHaveList()
    },
    handleCheckedCitiesChange(value) {
        let checkedCount = value.length
        this.controlData.checkAll = checkedCount === this.tableData3.length// 选中的个数是否等于总个数
        this.controlData.isIndeterminate = checkedCount > 0 && checkedCount < this.tableData3.length
        this.upHaveList()
    },
    returnCatgIdName(catgId) {
      // 不限
      let name = this.$t('mxpcweb.sale.components.1557711304555')
        this.categoryList.forEach(item => {
          if (item.catgId == catgId) {
            name = item.catgName
          }
        })
        return name
    },
    insideUpdata(item) {
        if (item) {
          this.checkList = item.catgId
          this.catgName = item.catgName
        } else {
          this.checkList = ''
          this.catgName = '不限'
        }
        this.getList()
    },
    checkPic(item) {
      let imgId
      if (!item.imagesId || item.imagesId.length === 0) {
          return '/static/images/goods/noImg.jpg'
      } else {
          imgId = item.imagesId[0] // 取第一个数组项为默认头像
          return this.getGlobalImgSrc(imgId, '55x55')
      }
    },
    // 每页条数
    eachNumChange(val) {
      this.paging.eachNum = val
      this.getList()
    },
    // 当前第几页
    currentPageChange(val) {
      this.paging.currentPage = val
      this.paging.from = this.paging.eachNum * (val - 1)
      this.getList()
    },
    handleIconClick(ev) {
      this.getList()
    },
    // 重置表单
    resetForm() {
      this.keywords = ''
      this.tableData3 = []
      this.checkLists = []
      this.checkList = ''
      this.clearSelect()
      this.paging.from = 0
      this.paging.currentPage = 1
      this.checkList = ''
      this.catgName = '不限'
    },
    open(item) {
      this.resetForm()
      this.isOpen = true
      this.getList()
    },
    getList() {
      let data = {
        moduleCode: 'PP001',
        searchType: 'list',
        from: this.paging.from,
        size: this.paging.eachNum,
        sort: 'createDate'
        // offFlag: '0'
      }
      if (this.goodsType == '') {
        this.tableData3 = []
        return
      }
      if (this.checkList == '') {
        data.category = this.goodsType
      } else {
        data.category = this.checkList
      }
      if (this.keywords != '') {
          data.keywords = this.keywords
      }
      this.isLoading = true
      this.$http.get(this.Global.baseURL + this.Global.api.v2.document_product, { params: data }).then(res => {
        if (res.body.code.toString() == this.Global.RES_OK) {
          this.isLoading = false
          let itemList = res.body.data.list || []
          let list = []
          itemList.forEach(item => {
            let obj = item
            obj.saleQty = '0'
            list.push(obj)
          })
          this.tableData3 = list
          this.paging.total = res.body.data.totalNum
          this.clearSelect()
          this.checkSelect()
        } else {
          this.$message.error(this.msg(res.body))
        }
      }, res => {
        this.$message.error(this.$t(this.Global.errorTitle))
      })
    },
    removeThis(item) {
      let data = {
        optCode: 'outGroup',
        group: this.itemData.groupId,
        optModuleCode: 'PP001',
        targets: item.spuId + ''
      }
      this.$http.put(this.Global.baseURL + this.Global.api.v2.document_operate_listOpt_put, data).then(res => {
        if (res.body.code.toString() == this.Global.RES_OK) {
          this.$message.success(this.$t('mxpcweb.g.1539654736016')) // 移除成功
          // this.isOpen = false
          this.getList()
        } else {
          this.$message.error(this.msg(res.body))
        }
      }, res => {
        this.$message.error(this.$t(this.Global.errorTitle))
      })
    }
  },
  components: Object.assign({
    'no-data': NoData,
    'sale-qty-box': saleQtyBox
  }, ListShow),
  watch: {
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
