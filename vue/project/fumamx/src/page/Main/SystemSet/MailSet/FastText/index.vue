<template>
    <div class="mainWrap FastText" ref="FastText">
        <!--大标题-->
        <!-- 快速文本 -->
        <page-title :title="$t('mxpcweb.systemset.mailset.fasttext.1528975813285')" iconfont="icon-mail"></page-title>

        <div class="mainBody" style="padding:0;">

        <!--<div class="Window" ref="Window">-->
            <div class="menu MXscroll">
                <div class="text-center">
                  <!-- 新建分组  添加分组 -->
                   <el-button type="primary" size="small" @click="showGroupWindow($t('mxpcweb.systemset.mailset.fasttext.1528975851270'))">
                     <span class="button-font">{{$t('mxpcweb.systemset.mailset.fasttext.1528975863782')}}</span>
                    </el-button>
                      <!-- 新建文本 -->
                   <el-button type="primary" size="small"   @click="createNewFastText" > <span class="button-font">
                     {{$t('mxpcweb.systemset.mailset.fasttext.1528975939439')}}</span></el-button>
                </div>
                <!-- 左菜单树 -->
                <el-tree :data="treeList" :expand-on-click-node="false"  :render-content="renderContent" :props="defaultTree"
                      :indent="20" :highlight-current="true" :default-expand-all="true" @node-click="treeClick"></el-tree>
            </div>
            <div class="navWindow MXscroll">
                <div style="height:10px;"></div>
                <el-form :model="fastTextForm" label-width="100px" label-position="left">
                  <!-- 快速文本名称 -->
                    <el-form-item :label="$t('mxpcweb.systemset.mailset.fasttext.1528975966838')">
                      <!-- 请输入快速文本名称 -->
                        <el-input v-model="fastTextForm.name" :placeholder="$t('mxpcweb.systemset.mailset.fasttext.1528975989612')" style="width:300px;"></el-input>
                    </el-form-item>
                    <div>
                      <ueditor ref="ueditor"  @ready="editorReady" :config="config"  :converContent="fastTextForm.content"></ueditor>
                    </div>
                    <br>
                    <!-- 保存 -->
                    <div class="text-center">
                    <el-button type="primary" @click="onSubmit" style="width:80px;">{{$t('mxpcweb.systemset.mailset.fasttext.1528976023507')}}                    </el-button>
                    </div>
                </el-form>
            </div>
        </div>

        <!-- 添加分组弹窗 -->
        <el-dialog :title="addGroup.title" :visible.sync="addGroup.popupShow" @close="resetForm('addGroup')" custom-class="width420">
            <el-form :model="addGroup" :rules="addGroupRules" ref="addGroup" :inline="true" label-width="90px">
              <!-- 分组名称 -->
                <el-form-item :label="$t('mxpcweb.systemset.mailset.fasttext.1528976050395')" prop="name">
                  <!-- 请输入分组名称 -->
                    <el-input v-model="addGroup.name" auto-complete="off" :placeholder="$t('mxpcweb.systemset.mailset.fasttext.1528976077900')" style="width:220px;"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="text-center">
                <!-- 取 消 -->
                <el-button @click="addGroup.popupShow = false">{{$t('mxpcweb.systemset.mailset.fasttext.1528976107251')}}</el-button>
                <!-- 确 定 -->
                <el-button type="primary" @click="addGroupSubmit('addGroup')">{{$t('mxpcweb.systemset.mailset.fasttext.1528976128387')}}</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
/**
 * 角色管理
 * 作者：汤坚生
 * 时间：2017/10/11
 * */
import PageTitle from '@/components/PageTitle/index.vue'
import UEditor from '@/components/UEditor/component.vue' // 编辑器
import { isArray, isObject } from '@/libs/utils.js'

export default {
  name: 'FastText',
  props: {},
  data() {
    var _this = this
    return {
      value: '',
      defaultTree: {
        children: 'children',
        label: 'label',
        groupId: 'groupId'
      },
      treeList: [],
      currentNode: [],
      // 表单
      fastTextForm: {
        name: '',
        content: '',
        fastTextId: '',
        groupId: ''
      },
      // 弹窗
      addGroup: {
        popupShow: false,
        name: '',
        title: '',
        groupId: ''
      },
      // 编辑器配置
      config: {
        // 请输入快速文本内容
        initialContent: _this.$t(
          'mxpcweb.systemset.mailset.fasttext.1528976237009'
        ), // 初始化编辑器的内容
        initialFrameHeight: 422, // 内容初始高度
        toolbars: [
          [
            'source',
            '|',
            'fontfamily',
            'fontsize',
            'forecolor',
            'backcolor',
            '|',
            'bold',
            'italic',
            'underline',
            'strikethrough',
            '|',
            'rowspacingtop',
            'rowspacingbottom',
            'lineheight',
            '|',
            'justifyleft',
            'justifycenter',
            'justifyright',
            'justifyjustify',
            '|',
            'link',
            'unlink',
            'simpleupload',
            'horizontal',
            'emotion',
            'removeformat',
            'formatmatch',
            'autotypeset',
            '|',
            'inserttable'
            // '|', 'goods', 'letter', 'templet', 'insertfield'
          ]
        ]
      },
      // 表单验证
      addGroupRules: {
        // 请输入分组名称
        name: [
          {
            required: true,
            message: _this.$t(
              'mxpcweb.systemset.mailset.fasttext.1528976077900'
            ),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.loadAllData()
  },
  methods: {
    // 编辑器加载完成时
    editorReady(instance) {
      instance.setContent(this.fastTextForm.content) // 设置初始值放进来，不设置则为 config 里的 initialContent 值
    },
    /**
     * 新增快速文本
     */
    saveNewFastText() {
      const _this = this
      let data = {
        fastText: {
          groupId: _this.fastTextForm.groupId,
          textName: _this.fastTextForm.name,
          content: _this.fastTextForm.content
        }
      }
      _this.$http
        .post(
          _this.Global.baseURL +
            _this.Global.api.SystemSet.mailset.fastText.addFastText,
          data
        )
        .then(
          function(res) {
            if (res.body.code.toString() == _this.Global.RES_OK) {
              // 新增快速文本成功
              _this.$message.success(
                _this.$t('mxpcweb.systemset.mailset.fasttext.1528976315619')
              )
              _this.loadAllData()
            } else {
              _this.$message.error(_this.msg(res.body))
            }
          },
          function(res) {
            _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
          }
        )
    },
    /**
     * 修改快速文本
     */
    updateFastText() {
      const _this = this
      let data = {
        fastText: {
          groupId: _this.fastTextForm.groupId,
          textName: _this.fastTextForm.name,
          content: _this.fastTextForm.content,
          id: _this.fastTextForm.fastTextId
        }
      }
      _this.$http
        .post(
          _this.Global.baseURL +
            _this.Global.api.SystemSet.mailset.fastText.modifyFastText,
          data
        )
        .then(
          function(res) {
            if (res.body.code.toString() == _this.Global.RES_OK) {
              // 修改快速文本成功
              _this.$message.success(
                _this.$t('mxpcweb.systemset.mailset.fasttext.1528976360968')
              )
              _this.loadAllData()
            } else {
              _this.$message.error(_this.msg(res.body))
            }
          },
          function(res) {
            _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
          }
        )
    },
    /**
     * 删除快速文本
     */
    deleteFastText(store, textData) {
      const _this = this
      let data = {
        id: textData.fastTextId
      }
      _this.$http
        .post(
          _this.Global.baseURL +
            _this.Global.api.SystemSet.mailset.fastText.deleteFastText,
          data
        )
        .then(
          function(res) {
            if (res.body.code.toString() == _this.Global.RES_OK) {
              _this.loadAllData()
              _this.clearFastTextForm()
              // 删除快速文本成功
              _this.$message.success(
                _this.$t('mxpcweb.systemset.mailset.fasttext.1528976405288')
              )
            } else {
              _this.$message.error(_this.msg(res.body))
            }
          },
          function(res) {
            _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
          }
        )
    },
    /**
     * 删除分组
     */
    deleteFastGroup(store, groupData) {
      const _this = this
      let data = {
        id: groupData.groupId
      }
      _this.$http
        .post(
          _this.Global.baseURL +
            _this.Global.api.SystemSet.mailset.fastText.deleteFastTextGroup,
          data
        )
        .then(
          function(res) {
            if (res.body.code.toString() == _this.Global.RES_OK) {
              _this.loadAllData()
              //  删除分组成功
              _this.$message.success(
                _this.$t('mxpcweb.systemset.mailset.fasttext.1528976454096')
              )
            } else {
              _this.$message.error(_this.msg(res.body))
            }
          },
          function(res) {
            _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
          }
        )
    },
    /**
     * 加载所有数据
     */
    loadAllData() {
      let _this = this
      // 加载分组列表
      var p0 = new Promise((resolve, reject) => {
        _this.getGroupList(resolve) // 加载分组列表
      })
      // 加载开发信列表
      var p1 = new Promise((resolve, reject) => {
        _this.getLetterList(resolve) // 加载默认设置列表
      })
      Promise.all([p0, p1]).then(function(results) {
        if (
          results != undefined &&
          results != null &&
          results.length > 1 &&
          isArray(results[0]) &&
          results[0].length > 0
        ) {
          if (isArray(results[1]) && results[1].length > 0) {
            results[0].forEach(group => {
              group.label = group.groupName
              group.children = []
              results[1].forEach(fastText => {
                if (fastText.groupId == group.groupId) {
                  fastText.label = fastText.textName
                  fastText.fastTextId = fastText.id
                  group.children.push(fastText)
                }
              })
            })
            _this.treeList = results[0]
          } else {
            results[0].forEach(element => {
              element.label = element.groupName
            })
            _this.treeList = results[0]
          }
        } else {
          _this.treeList = []
        }
      })
    },
    /**
     * 获取分组列表
     */
    getGroupList(resolve) {
      const _this = this
      _this.$http
        .get(
          _this.Global.baseURL +
            _this.Global.api.SystemSet.mailset.fastText.getFastTextGroupList,
          {}
        )
        .then(
          function(res) {
            if (
              res.body.code.toString() == _this.Global.RES_OK &&
              isArray(res.body.data) &&
              res.body.data.length > 0
            ) {
              let data = res.body.data
              resolve(data)
            } else if (res.body.code.toString() == _this.Global.RES_OK) {
              // _this.defaultTemplateList = [];
              resolve([])
            }
          },
          function(res) {
            _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
          }
        )
    },
    /**
     * 获取快速文本列表
     */
    getLetterList(resolve) {
      const _this = this
      _this.$http
        .get(
          _this.Global.baseURL +
            _this.Global.api.SystemSet.mailset.fastText.getFastTextList,
          { params: { type: 'all' } }
        )
        .then(
          function(res) {
            if (
              res.body.code.toString() == _this.Global.RES_OK &&
              isArray(res.body.data) &&
              res.body.data.length > 0
            ) {
              let data = res.body.data
              resolve(data)
            } else if (res.body.code.toString() == _this.Global.RES_OK) {
              // _this.defaultTemplateList = [];
              resolve([])
            }
          },
          function(res) {
            _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
          }
        )
    },
    getSingleFastText(fastTextId) {
      const _this = this
      _this.$http
        .get(
          _this.Global.baseURL +
            _this.Global.api.SystemSet.mailset.fastText.getFastTextList,
          { params: { fastTextId: fastTextId } }
        )
        .then(
          function(res) {
            if (
              res.body.code.toString() == _this.Global.RES_OK &&
              isObject(res.body.data)
            ) {
              let data = res.body.data
              _this.fastTextForm.fastTextId = data.id
              _this.fastTextForm.groupId = data.groupId
              _this.fastTextForm.name = data.textName
              _this.fastTextForm.content = data.content
            } else if (res.body.code.toString() == _this.Global.RES_OK) {
              // _this.defaultTemplateList = [];
            }
          },
          function(res) {
            _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
          }
        )
    },
    /**
     * 创建新分组
     */
    createNewGroup() {
      const _this = this
      let data = {
        fastTextGroup: { groupName: _this.addGroup.name }
      }
      _this.$http
        .post(
          _this.Global.baseURL +
            _this.Global.api.SystemSet.mailset.fastText.addFastTextGroup,
          data
        )
        .then(
          function(res) {
            if (res.body.code.toString() == _this.Global.RES_OK) {
              // 新增分组成功
              _this.$message.success(
                _this.$t('mxpcweb.systemset.mailset.fasttext.1528976526222')
              )
              _this.closeGroupWindow()
              _this.loadAllData()
            } else {
              _this.$message.error(_this.msg(res.body))
            }
          },
          function(res) {
            _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
          }
        )
    },
    /**
     * 更新分组
     */
    updateGroup() {
      const _this = this
      let data = {
        fastTextGroup: {
          groupName: _this.addGroup.name,
          groupId: _this.addGroup.groupId
        }
      }
      _this.$http
        .post(
          _this.Global.baseURL +
            _this.Global.api.SystemSet.mailset.fastText.updateFastTextGroup,
          data
        )
        .then(
          function(res) {
            if (res.body.code.toString() == _this.Global.RES_OK) {
              // 修改分组成功
              _this.$message.success(
                _this.$t('mxpcweb.systemset.mailset.fasttext.1528976552605')
              )
              _this.loadAllData()
              _this.closeGroupWindow()
            } else {
              _this.$message.error(_this.msg(res.body))
            }
          },
          function(res) {
            _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
          }
        )
    },
    /**
     * 修改分组名称
     */
    thisEdit(store, data) {
      this.addGroup.groupId = data.groupId
      this.addGroup.name = data.groupName
      // 修改分组
      this.showGroupWindow(
        this.$t('mxpcweb.systemset.mailset.fasttext.1528976589103')
      )
    },
    /**
     * 关闭分组弹窗
     */
    closeGroupWindow() {
      this.addGroup.popupShow = false
      this.addGroup.name = ''
      this.addGroup.groupId = ''
    },
    /**
     * 显示分组弹窗
     */
    showGroupWindow(title) {
      this.addGroup.title = title
      this.addGroup.popupShow = true
    },
    // 左菜单点击
    treeClick(data) {
      this.currentNode = data
      if (
        data.fastTextId != undefined &&
        data.fastTextId != null &&
        data.fastTextId != ''
      ) {
        this.getSingleFastText(data.fastTextId)
      } else {
        this.clearFastTextForm()
      }
    },
    createNewFastText() {
      if (
        this.currentNode.groupId != undefined &&
        this.currentNode.groupId != null &&
        this.currentNode.groupId != ''
      ) {
        this.clearFastTextForm()
      } else {
        // 请选择一个分组
        this.$message.info(
          this.$t('mxpcweb.systemset.mailset.fasttext.1528976623877')
        )
      }
    },
    // 提交表单
    onSubmit() {
      this.fastTextForm.content = this.$refs.ueditor.getContent()
      this.fastTextForm.groupId = this.currentNode.groupId
      if (
        this.fastTextForm.fastTextId != undefined &&
        this.fastTextForm.fastTextId != null &&
        this.fastTextForm.fastTextId != ''
      ) {
        this.updateFastText()
      } else {
        this.saveNewFastText()
      }
      // this.$refs.ueditor.aabb();
    },
    // 添加分组
    addGroupSubmit(formName) {
      const _this = this
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (
            _this.addGroup.groupId != undefined &&
            _this.addGroup.groupId != null &&
            _this.addGroup.groupId != ''
          ) {
            _this.updateGroup()
          } else {
            _this.createNewGroup()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    renderContent(h, { node, data, store }) {
      if (
        data.fastTextId != undefined &&
        data.fastTextId != null &&
        data.fastTextId != ''
      ) {
        return (
          <span>
            <span>
              <span>{node.label}</span>
            </span>
            <span class="btns">
              <span>
                <i
                  class="iconfont icon-del"
                  on-click={() => this.deleteFastText(store, data)}
                />
              </span>
            </span>
          </span>
        )
      } else {
        return (
          <span>
            <span>
              <span>{node.label}</span>
            </span>
            <span class="btns">
              <span>
                <i
                  class="iconfont icon-edit-single"
                  on-click={() => this.thisEdit(store, data)}
                />
              </span>
              <span>
                <i
                  class="iconfont icon-del"
                  on-click={() => this.deleteFastGroup(store, data)}
                />
              </span>
            </span>
          </span>
        )
      }
    },

    // 清空表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.closeGroupWindow()
    },
    /**
     * 清空快速文本
     */
    clearFastTextForm() {
      this.fastTextForm.content = ''
      this.fastTextForm.name = ''
      this.fastTextForm.groupId = ''
      this.fastTextForm.fastTextId = ''
      this.$refs.ueditor.clearContent()
    }
  },
  components: {
    'page-title': PageTitle,
    ueditor: UEditor
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
