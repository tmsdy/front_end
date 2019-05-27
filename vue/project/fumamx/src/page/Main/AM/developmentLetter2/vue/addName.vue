<template>
    <div class="addName MXscroll">
        <!-- 开发信 -->
        <!-- 新建开发信 -->
        <page-detail :title="$t('mxpcweb.am.1531893092789')" iconfont="icon-edit-single" :detailTitle="$t('mxpcweb.am.1531892988479')" @toList="$emit('tabDataCheck','1')"></page-detail>
        <template v-if="tabList=='0'">
            <div class="list">
                <div class="listBox">
                    <!-- 模板名称 -->
                    <span class="listName">{{$t('mxpcweb.am.1531893007933')}}</span>
                    <!-- 请输入模板名称 -->
                    <el-input style="width:468px;" :placeholder="$t('mxpcweb.systemset.mailset.templatemanage.1528977724788')" :maxlength="20" v-model="name">
                    </el-input>
                </div>
                <div class="listBox">
                    <!-- 所属模块 -->
                    <span class="listName">{{$t('mxpcweb.am.1541590431848')}}</span>
                    <el-select style="width:468px;" v-model="moduleCode" :placeholder="$t('mxpcweb.am.1531896590584')">
                        <!-- 批量 -->
                        <el-option v-for="(item,index) in moduleCodeList" :key="index" :label="item.showName" :value="item.moduleCode"></el-option>
                        <!-- 触发 -->
                        <!-- <el-option :label="$t('mxpcweb.am.1531893043662')" value="0"></el-option> -->
                    </el-select>
                </div>
                <div class="listBox">
                    <!-- 使用人员 -->
                    <span class="listName">{{$t('mxpcweb.am.1531904286368')}}</span>
                    <el-select style="width:468px;" v-model="IsPublic" :placeholder="$t('mxpcweb.am.1531896590584')">
                        <!-- 仅自己 -->
                        <el-option :label="$t('mxpcweb.am.1540284818773')" value="0"></el-option>
                        <!-- 全体人员 -->
                        <el-option :label="$t('mxpcweb.am.1540284862709')" value="1"></el-option>
                    </el-select>
                </div>
                <div class="listBox">
                    <span class="listName"></span>
                    <!-- 下一步 -->
                    <el-button type="primary" @click="addName()" size="small">{{$t('mxpcweb.am.1531896641080')}}</el-button>
                </div>
            </div>
            <!-- 模板市场，这里汇聚了活动促销模板、节日模板、邀请函模板以及数据分析等等众多模板 -->
            <!-- <div class="list listMarket">
                <div class="tipMarket">
                    模板市场，这里汇聚了活动促销模板、节日模板、邀请函模板以及数据分析等等众多模板
                </div>
                <div class="paddingStyle">
                    <el-button type="success" @click="toMarket()" size="small" style="width:120px;height:35px;">开始试用</el-button>
                </div>
            </div> -->
        </template>
        <template v-if="tabList=='1'">
            <div class="tabBox">
                <!-- 插入HTML代码/纯文本 -->
                <el-button class="pull-right" type="text" @click="$emit('toAddTemplateCode',{name: name,type:mailType, moduleCode:moduleCode, IsPublic: IsPublic})">{{$t('mxpcweb.am.1532747260938')}}</el-button>
                <el-tabs v-model="tabData">
                    <!-- 基本样式 -->
                    <el-tab-pane :label="$t('mxpcweb.am.1531896657391')" name="0">
                        <div class="list">
                            <div class="paddingStyle">
                                <div class="modelBox" v-for="(item,index) in modelSelect" :key="index">
                                    <div class="modelList">
                                        <div class="modelContext" :style="{background:item.img}"></div>
                                        <div class="mask">
                                            <!-- 选择 -->
                                            <el-button size="small" style="width:60px;" @click="$emit('toAddTemplateDrag',{name: name,type:mailType, moduleCode:moduleCode,id: item.id, IsPublic: IsPublic})">{{$t('mxpcweb.am.1531896677609')}}</el-button>
                                        </div>
                                    </div>
                                    <div class="modelName">{{item.name}}</div>
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="模板市场" name="1">
                        <template-list @change="pickTemplate" height="auto"></template-list>
                    </el-tab-pane>
                </el-tabs>
            </div>

        </template>
        <!--<template v-if="tabList=='2'">
            编辑器
        </template>-->
    </div>
</template>

<script>
import PageDetail from '@/components/PageDetail/index' // 大标题
import TemplateList from '@/basecomponents/TemplateList'
export default {
    name: 'addName',
    props: {
        moduleCodeList: {
            type: Array,
            default: function () {
                return []
            }
        },
        templateMarketId: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            modelSelect: [
                {
                    id: '0',
                    img: 'white',
                    name: '空白'
                },
                {
                    id: '1',
                    img: 'url(/static/images/amTemplateImg/1.png)',
                    // 一列
                    name: this.$t('mxpcweb.am.1531896698379')
                }, {
                    id: '2',
                    img: 'url(/static/images/amTemplateImg/2.png)',
                    // 两列
                    name: this.$t('mxpcweb.am.1531896710823')
                }, {
                    id: '3',
                    img: 'url(/static/images/amTemplateImg/3.png)',
                    // 两列与图片1
                    name: this.$t('mxpcweb.am.1531896729408')
                }, {
                    id: '4',
                    img: 'url(/static/images/amTemplateImg/4.png)',
                    // 两列与图片2
                    name: this.$t('mxpcweb.am.1531896742140')
                }, {
                    id: '5',
                    img: 'url(/static/images/amTemplateImg/5.png)',
                    // 三列
                    name: this.$t('mxpcweb.am.1531896757719')
                }],
            tabData: 0,
            tabList: 0,
            name: '',
            mailType: 1,
            modelType: '1',
            IsPublic: '0',
            moduleCode: 'allModule'
        }
    },
    mounted() {

    },
    created() {
    },
    mounted() {
    },
    computed: {
    },
    methods: {
        pickTemplate(item) {
            // console.log(item)
            this.$emit('toAddTemplateDrag', {
                name: this.name,
                type: this.mailType,
                moduleCode: this.moduleCode,
                IsPublic: this.IsPublic,
                templateMarketId: item.templateId
            })
        },
        toMarket() {
            this.$router.push('/main/am/templateMarket')
        },
        addName() {
            let _this = this
            if (this.name.replace(/(^\s*)|(\s*$)/g, '') == '') {
                // 请输入模板名称
                _this.$message(this.$t('mxpcweb.systemset.mailset.templatemanage.1528977724788'))
                return false
            };
            if (this.moduleCode == '') {
                // 请选择邮件类型
                _this.$message(this.$t('mxpcweb.am.1541592215343'))
                return false
            };
            this.tabList = '1'

            // 检测来自模板市场
            if (this.templateMarketId != '') {
                this.$emit('toAddTemplateDrag', {
                    name: this.name,
                    type: this.mailType,
                    moduleCode: this.moduleCode,
                    IsPublic: this.IsPublic,
                    templateMarketId: this.templateMarketId
                })
            }
        }
    },
    components: {
        'page-detail': PageDetail,
        'template-list': TemplateList
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
.addName {
  height: 100%;
  background: white;
  .tabBox {
    // border:1px solid red;
    padding: 0 30px;
    .pull-right {
      position: relative;
      top: 5px;
      z-index: 1;
    }
  }
  .list {
    padding: 30px;
    .listBox {
      padding: 10px 0;
      .listName {
        display: inline-block;
        width: 106px;
        font-size: 14px;
        color: RGBA(96, 98, 102, 1);
      }
    }
    .paddingStyle {
      .modelBox {
        float: left;
        width: 200px;
        height: 280px;
        font-size: 12px;
        word-wrap: break-word;
        margin-right: 50px;
        .modelList {
          height: 240px;
          padding: 10px;
          border: 1px solid rgba(228, 228, 228, 1);
          position: relative;
          .modelContext {
            width: 100%;
            height: 100%;
          }
          .mask {
            display: none;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            text-align: center;
            background-color: rgba(208, 2, 27, 0.1);
            line-height: 240px;
          }
        }
        &:hover {
          .mask {
            display: inline;
          }
        }
        .modelName {
          height: 36px;
          line-height: 36px;
          text-align: center;
        }
      }
    }
  }
  .listMarket {
    margin-top: 50px;
    background: url(./../img/u13740.png);
    background-size: 100%;
    height: 300px;
    padding-top: 50px;
    .tipMarket {
      padding: 10px 0;
      font-size: 14px;
      width: 30%;
      color: #3d425e;
    }
  }

  .filedInput {
    height: 36px;
    line-height: 36px;
    width: 80px;
    border: 1px solid #bcbcbc;
    display: inline-block;
    text-align: center;
    position: relative;
    bottom: -1px;
  }
}
</style>
