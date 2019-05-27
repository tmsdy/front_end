<template>
    <div class="TemplateMarketManage">
        <page-title :showTitle="false"> </page-title>
        <el-tabs v-model="activeName" @tab-click="handleClick" class="subTabs-pullRight">
            <!-- 开发信 -->
            <el-tab-pane label="开发信" name="first"> </el-tab-pane>
            <!-- 客户 -->
            <!-- <el-tab-pane :label="$t('mxpcweb.workbench.1530703521879')" name="BF001">

            </el-tab-pane> -->
            <!-- 订单 -->
            <!-- <el-tab-pane :label="$t('mxpcweb.client.1529056921708')" name="SC002">

            </el-tab-pane> -->
            <!-- 报价 -->
            <!-- <el-tab-pane :label="$t('mxpcweb.client.1529056897952')" name="SC001">

            </el-tab-pane> -->

        </el-tabs>

        <div class="actionManageBox MXscroll" v-if="isShowList&&activeName=='first'">
            <div class="toolBar clearfix">
                <el-button class="pull-right" type="primary" @click="isShowList = false;">创建模板</el-button>
                <div class="pull-right">
                    <el-input placeholder="请输入模板名称" icon="search" v-model="input2" :on-icon-click="getListData" @keyup.enter.native="getListData" style="width:320px;"></el-input>
                </div>
            </div>

            <el-table class="detailTable widthFull" :data="tableData3" :height="tableHeight" v-if="tableData3.length > 0" v-loading="isLoading">
                <el-table-column prop="templateName" label="模板名称"> </el-table-column>
                <el-table-column prop="createDate" label="创建时间" min-width="120"> </el-table-column>
                <el-table-column prop="cost" label="价格" align="center">
                    <template slot-scope="{ row }">
                        <span v-if="row.cost == 0">免费</span>
                        <span v-else>￥{{Number(row.cost).toFixed(2)}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="useCount" label="使用次数" align="center"> </el-table-column>

                <el-table-column prop="" label="" align="left">
                    <template slot-scope="{ row }">
                        <tag-show :dataList="getThisTag(row.labelId)" labelWidth="0" :showAdd="false"></tag-show>
                    </template>
                </el-table-column>

                <el-table-column prop="" label="状态" align="center">
                    <template slot-scope="{ row }">
                        <span v-if="row.status == 1" class="text-blue">已上架</span>
                        <span v-else>已下架</span>
                    </template>
                </el-table-column>

                <!-- 访问页面数 -->
                <el-table-column prop="" label="" width="200">
                    <template slot-scope="{ row }">
                        <div class="operation">
                            <span @click="doListData(row, 'isSale')" :title="row.status == 1 ? '下架' : '上架'"><i class="iconfont" :class="[row.status == 1 ? 'icon-shelves-off' : 'icon-shelves-on']"></i></span>
                            <span @click="setTagItem(row)"><i class="iconfont icon-tag"></i></span>
                            <span @click="doDetail(row, 'preview')"><i class="iconfont icon-eye"></i></span>
                            <span @click="doDetail(row, 'edit')"><i class="iconfont icon-edit"></i></span>
                            <span @click="delItem(row)"><i class="iconfont icon-del"></i></span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>

            <no-data v-if="tableData3.length === 0" style="background:rgba(255,255,255,0)"></no-data>

            <div class="paging">
                <el-pagination :current-page="page.now" @current-change="changePage" layout="total,prev, pager, next" :page-size="page.size" :total="page.total"></el-pagination>
            </div>

        </div>
        <!-- 模板编辑 -->
        <template-add ref="templateAdd" :Mcode="Mcode" v-else-if="!isShowList&&activeName=='first'" @toShowList="isShowList = true; input2=''; getListData()" @subPreview="subPreview"></template-add>

        <!-- <system-list v-if="activeName!='first'" ref="systemList" :activeName="activeName"></system-list> -->

        <!-- 预览 -->
        <editor-preview ref="preview"></editor-preview>

        <!-- 标签 -->
        <DialogSetTags ref="dialogSetTags" @UpdataTagsData="tagPickSubmit"></DialogSetTags>
    </div>
</template>
<script>
import NoData from '@/basecomponents/NoData/index'
import PageTitle from '@/components/PageTitle/index'
import TemplateAdd from './TemplateAdd' // 添加编辑模板
import editorPreview from '@/components/editorPreview/index' // 预览
import DialogSetTags from '@/components/DialogSetTags/index.vue'
import TagShow from '@/basecomponents/TagShow/index' // 标签展示
import systemList from './systemList/index'

export default {
    name: 'TemplateMarketManage',
    data() {
        return {
            activeName: 'first',
            isLoading: false,
            input2: '',
            page: {
                now: 1,
                size: 20,
                total: 0
            },
            tableData3: [''],

            tableHeight: '333',
            isShowList: true,
            Mcode: 'MO004',
            tagsAll: [], // 所有标签
            itemTags: [], // 暂存一下所选标签
            itemClickData: null // 暂存一下所选当前数据
        }
    },
    created() {
        this.getListData()
    },
    mounted() {
        setTimeout(() => {
            this.getWinHeight()
        }, 200)
        $(window).resize(() => {
            this.getWinHeight()
        })
    },
    computed: {},
    methods: {
        // 点右上角的tab切换
        handleClick(tab, event) {
            this.activeName = tab.name
        },
        // 设置固定高
        getWinHeight() {
            let winHeight = document.body.clientHeight
            this.tableHeight = winHeight - 230
        },
        getThisTag(strTag) {
            // tagsAll
            let Arr = []
            if (strTag && strTag != '') {
                // console.log(strTag.split(','))
                strTag.split(',').forEach(item => {
                    this.tagsAll.forEach(item2 => {
                        if (item == item2.labelId) {
                            Arr.push(item2)
                        }
                    })
                })
            }
            return Arr
        },
        // 获取用户标签列表
        maillabelsGet() {
            let _this = this
            _this.$http
                .get(_this.Global.baseURL + _this.Global.api.v2.label_get, {
                    params: { searchType: 'list', moduleCode: _this.Mcode }
                })
                .then(
                    function (res) {
                        if (res.body.code.toString() == _this.Global.RES_OK) {
                            _this.tagsAll = res.body.data
                        }
                    },
                    function (res) {
                        _this.$message.error(_this.$t(_this.Global.errorTitle))
                    }
                )
        },
        changePage(val) {
            this.page.now = val
            this.getListData()
        },
        // 标签选择后，确定
        tagPickSubmit(res1, res2, res3) {
            // console.log(res1)
            // console.log(res2)
            // console.log(res3)
            this.itemTags = res3
            this.doListData(this.itemClickData, 'tag') // 修改
        },
        // 标签设置
        setTagItem(item) {
            // console.log(item)
            // console.log(this.getThisTag(item.labelId))
            this.itemClickData = item // 暂存一下所选项
            this.$refs.dialogSetTags.DialogSetTagShow('', [], this.Mcode, {}, this.getThisTag(item.labelId))
        },
        subPreview(html) {
            this.$refs.preview.open(html)
        },
        doDetail(item, todo) {
            // console.log(item)
            let data = {
                type: 'detail',
                templateId: item.templateId
            }
            //   console.log(data)
            this.isLoading = true
            this.$http
                .get(this.Global.baseURL + this.Global.api.v2.templateMarket, {
                    params: data
                })
                .then(
                    res => {
                        this.isLoading = false
                        if (res.body.code.toString() == this.Global.RES_OK) {
                            // console.log(res.body.data)
                            let itemData = res.body.data
                            // console.log(itemData)
                            //   console.log(itemData.labelId)
                            //     console.log(this.getThisTag(itemData.labelId))
                            if (todo == 'preview') {
                                // 预览
                                this.$refs.preview.open(itemData.templateUrl)
                            }
                            if (todo == 'edit') {
                                // 编辑
                                this.isShowList = false
                                setTimeout(() => {
                                    this.$refs.templateAdd.edit(itemData, this.getThisTag(itemData.labelId)) // 传当前数据，
                                }, 50)
                            }
                        } else {
                            this.$message.error(res.body.msg)
                        }
                    },
                    res => {
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                )
        },
        // 几种操作状态，这里一起处理
        doListData(item, todo) {
            let data = {
                type: 'edit',
                templateId: item.templateId
            }
            if (todo == 'isSale') {
                data = Object.assign(data, {
                    status: item.status == 1 ? 0 : 1
                })
            }
            if (todo == 'del') {
                data = Object.assign(data, {
                    delState: 0
                })
            }
            if (todo == 'tag') {
                let pickLabels = this.itemTags.map(item => {
                    return item.labelId
                })
                data = Object.assign(data, {
                    labelIds: pickLabels.toString()
                })
            }
            //   console.log(item)
            //   console.log(todo)
            // console.log(data)
            //   return
            this.$http
                .put(this.Global.baseURL + this.Global.api.v2.templateMarket, data)
                .then(
                    res => {
                        if (res.body.code.toString() == this.Global.RES_OK) {
                            //   console.log(res.body.data)
                            if (todo == 'isSale') {
                                this.$message.success(
                                    item.status == 1 ? '下架成功！' : '上架成功！'
                                )
                            }
                            if (todo == 'del') {
                                this.$message.success('删除成功！')
                            }
                            this.getListData() // 刷新数据
                        } else {
                            this.$message.error(res.body.msg)
                        }
                    },
                    res => {
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                )
        },
        delItem(item) {
            let title = this.$t('fumamx-web-templateeditor.1531904183099') // 提示
            let msg = '确定删除这个模板吗？' // 确定删除这个模板吗？
            let sure = this.$t('fumamx-web-templateeditor.1531901211609') // 确定
            let cancel = this.$t('fumamx-web-templateeditor.1531901134034') // 取消
            this.$confirm(msg, title, {
                confirmButtonText: sure,
                cancelButtonText: cancel,
                type: 'warning'
            })
                .then(() => {
                    this.doListData(item, 'del')
                })
                .catch(() => { })
        },
        // 查列表数据
        getListData() {
            // console.log(' jjj >< ')
            // return
            //   this.isLoading = true
            let data = {
                pageN: this.page.now,
                pageSize: this.page.size,
                // sort: 'createDate',
                order: 'desc',
                name: this.input2,
                type: 'list'
            }
            //   console.log(data)
            this.$http
                .get(this.Global.baseURL + this.Global.api.v2.templateMarket, {
                    params: data
                })
                .then(
                    res => {
                        // this.isLoading = false
                        if (res.body.code.toString() == this.Global.RES_OK) {
                            //   console.log(' jjj d')
                            //   console.log(res.body.data)
                            this.tableData3 = res.body.data.data
                            this.page.total = res.body.data.totalNums
                        } else {
                            this.$message.error(res.body.msg)
                        }
                    },
                    res => {
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                )
            this.maillabelsGet() // 标签库
        }
    },
    components: {
        'template-add': TemplateAdd,
        'page-title': PageTitle,
        'editor-preview': editorPreview,
        DialogSetTags,
        'tag-show': TagShow,
        'no-data': NoData,
        'system-list': systemList
    },
    watch: {
        '$route': function () {
            this.isShowList = true // 切走，恢复显示列表
        }
    }
}
</script>

<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
