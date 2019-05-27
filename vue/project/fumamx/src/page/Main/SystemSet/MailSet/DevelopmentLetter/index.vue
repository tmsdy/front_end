<template>
    <div class="mainWrap DevelopmentLetter">
        <!--大标题-->
        <page-title title="开发信" iconfont="icon-mail"></page-title>

        <div class="mainBody MXscroll" style="padding:0;">

            <div class="menu MXscroll">
                <div class="text-center">
                    <el-button type="primary" size="small" @click="showGroupWindow('新建分组')">添加分组</el-button>
                    <el-button type="primary" @click="resetForm('letter')" size="small">新建开发信</el-button>
                </div>
                <!-- 左菜单树 -->
                <el-tree :data="treeList" :expand-on-click-node="false"  :render-content="renderContent" :props="defaultTree" :indent="20" :highlight-current="true" :default-expand-all="true" @node-click="treeClick"></el-tree>
            </div>
            <div class="navWindow MXscroll">
                <div style="height:10px;"></div>
                <el-form :model="letterAdminForm"  :rules="saveLetterRules" ref="letterAdminForm"  label-width="90px" label-position="left">
                    <el-form-item label="开发信名称"  prop="name">
                        <el-input v-model="letterAdminForm.name" placeholder="请输入开发信名称" style="width:300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="邮件主题"  prop="subject">
                        <el-input v-model="letterAdminForm.subject" placeholder="请输入邮件主题" style="width:300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="附件" >
                  <file-upload :file-list="letterAdminForm.attachments" :limitSize="10">
                      <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
                  </file-upload>
                </el-form-item>
                     <ueditor :config="config"  @ready="editorReady"  :converContent="letterAdminForm.content"  ref="ueditor" height="200"></ueditor>
                    <br>

                    <el-button type="primary" @click="onSubmit('letterAdminForm')" style="width:120px;">保存</el-button>
                </el-form>
            </div>

        </div>

        <!-- 添加分组弹窗 -->
        <el-dialog :title="addGroup.title" :visible.sync="addGroup.popupShow" @close="closeGroupWindow()" custom-class="width420">
            <el-form :model="addGroup" :rules="addGroupRules" ref="addGroup" :inline="true" label-width="90px">
                <el-form-item label="分组名称" prop="name">
                    <el-input v-model="addGroup.name" auto-complete="off" placeholder="请输入分组名称" style="width:220px;"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="text-center">
                <el-button @click="closeGroupWindow()">取 消</el-button>
                <el-button type="primary" @click="addGroupSubmit('addGroup')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
/**
 * 角色管理
 * 作者：向士健
 * 时间：2017/10/11
 * */
import PageTitle from '@/components/PageTitle/index.vue'
import UEditor from '@/components/UEditor/component.vue' // 编辑器
import { isArray, isObject } from '@/libs/utils.js'
import FileUpload from '@/components/FileUpload/index' // 文件上传

export default {
  name: 'DevelopmentLetter',
  props: {},
  data () {
    return {
      value: '',
      currentNode: [],
      currentLetter: null,
      defaultTree: {
        children: 'children',
        label: 'label',
        groupId: 'groupId'
      },
      treeList: [],
      // 表单
      letterAdminForm: {
        name: '', // 名称
        subject: '', // 主题
        content: '', // 内容
        groupId: '',
        templateId: '',
        attachments: []
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
        initialContent: '请输入开发信内容', // 初始化编辑器的内容
        initialFrameHeight: 260, // 内容初始高度
        toolbars: [[
          'source', '|', 'fontfamily', 'fontsize', 'forecolor', 'backcolor', '|',
          'bold', 'italic', 'underline', 'strikethrough', '|',
          'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
          'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'link', 'unlink',
          'simpleupload',
          'horizontal', 'emotion', 'removeformat', 'formatmatch', 'autotypeset', '|',
          'inserttable'
        ]]
      },
      // 表单验证
      addGroupRules: {
        name: [{ required: true, message: '请输入分组名称', trigger: 'blur' }]
      },
      saveLetterRules: {
        name: [
          { required: true, message: '请输入开发信名称', trigger: 'blur' }
        ],
        subject: [
          { required: true, message: '请输入开发信主题', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入开发信内容', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.loadAllData()
  },
  mounted () {

  },
  methods: {
    // 编辑器加载完成时
    editorReady (instance) {
      instance.setContent(this.letterAdminForm.content)// 设置初始值放进来，不设置则为 config 里的 initialContent 值
    },
    /**
     * 关闭分组弹窗
     */
    closeGroupWindow () {
      this.addGroup.popupShow = false
      this.addGroup.name = ''
      this.addGroup.groupId = ''
    },
    /**
     * 显示分组弹窗
     */
    showGroupWindow (title) {
      this.addGroup.title = title
      this.addGroup.popupShow = true
    },
    renderContent (h, { node, data, store }) {
      if (
        data.templateId != undefined &&
        data.templateId != null &&
        data.templateId != ''
      ) {
        return (
          <span>
            <span>
              <span>{node.label}</span>
            </span>
            <span style="float: right; margin-right: 20px">
              <el-button
                size="mini"
                on-click={() => this.thisRemoveLetter(store, data)}
              >
                删除
              </el-button>
            </span>
          </span>
        )
      } else {
        return (
          <span>
            <span>
              <span>{node.label}</span>
            </span>
            <span style="float: right; margin-right: 20px">
              <el-button
                size="mini"
                on-click={() => this.thisEdit(store, data)}
              >
                修改
              </el-button>
              <el-button
                size="mini"
                on-click={() => this.thisRemoveGroup(store, data)}
              >
                删除
              </el-button>
            </span>
          </span>
        )
      }
    },

    /**
     * 修改分组名称
     */
    thisEdit (store, data) {
      this.addGroup.groupId = data.groupId
      this.addGroup.name = data.groupName
      this.showGroupWindow('修改分组')
    },
    /**
     * 删除分组
     */
    thisRemoveGroup (store, data) {
      this.$confirm('此操作将永久删除该分组及开发信, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (
            data.groupId != undefined &&
            data.groupId != null &&
            data.groupId > 0
          ) {
            const _this = this
            let paraData = {
              groupId: data.groupId
            }
            _this.$http
              .post(
                _this.Global.baseURL +
                  _this.Global.api.SystemSet.mailset.developmentLetter
                    .mailsDevletterGroupDelete,
                paraData
              )
              .then(
                function (res) {
                  if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.$message.success('删除分组成功!')
                    _this.loadAllData()
                  } else {
                    _this.$message.error(_this.msg(res.body))
                  }
                },
                function (res) {
                  _this.$message.error(_this.$t(_this.Global.errorTitle))
                }
              )
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    /**
     * 删除开发信
     */
    thisRemoveLetter (store, data) {
      this.$confirm('此操作将永久删除该开发信, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (
            data.templateId != undefined &&
            data.templateId != null &&
            data.templateId > 0
          ) {
            const _this = this
            let paraData = {
              templateId: data.templateId
            }
            _this.$http
              .post(
                _this.Global.baseURL +
                _this.Global.api.SystemSet.mailset.developmentLetter.mailsDevletterDelete,
                paraData
              )
              .then(
                function (res) {
                  if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.$message.success('删除开发信成功!')
                    _this.loadAllData()
                  } else {
                    _this.$message.error(_this.msg(res.body))
                  }
                },
                function (res) {
                  _this.$message.error(_this.$t(_this.Global.errorTitle))
                }
              )
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    /**
     * 新增开发信
     */
    saveNewLetterTemplate () {
      const _this = this
      let data = {
        groupId: _this.letterAdminForm.groupId,
        templateName: _this.letterAdminForm.name,
        mailSubject: _this.letterAdminForm.subject,
        content: {'htmlContent': _this.letterAdminForm.content},
        attachments: _this.letterAdminForm.attachments
      }
      _this.$http
        .post(
          _this.Global.baseURL +
            _this.Global.api.SystemSet.mailset.developmentLetter
              .mailsDevletterPost,
          data
        )
        .then(
          function (res) {
            if (res.body.code.toString() == _this.Global.RES_OK) {
              _this.$message.success('新增开发信成功!')
              _this.loadAllData()
              _this.resetForm('')
            } else {
              _this.$message.error(_this.msg(res.body))
            }
          },
          function (res) {
            _this.$message.error(_this.$t(_this.Global.errorTitle))
          }
        )
    },
    /**
     * 修改开发信
     */
    updateLetterTemplate () {
      const _this = this
      let data = {
        groupId: _this.letterAdminForm.groupId,
        templateName: _this.letterAdminForm.name,
        mailSubject: _this.letterAdminForm.subject,
        content: {'htmlContent': _this.letterAdminForm.content},
        templateId: _this.letterAdminForm.templateId,
        attachments: _this.letterAdminForm.attachments
      }
      _this.$http
        .post(
          _this.Global.baseURL +
            _this.Global.api.SystemSet.mailset.developmentLetter
              .mailsDevletterPut,
          data
        )
        .then(
          function (res) {
            if (res.body.code.toString() == _this.Global.RES_OK) {
              _this.$message.success('修改开发信成功!')
              _this.loadAllData()
              _this.resetForm('')
            } else {
              _this.$message.error(_this.msg(res.body))
            }
          },
          function (res) {
            _this.$message.error(_this.$t(_this.Global.errorTitle))
          }
        )
    },
    /**
     * 加载所有数据
     */
    loadAllData () {
      let _this = this
      // 加载分组列表
      var p0 = new Promise((resolve, reject) => {
        _this.getGroupList(resolve) // 加载分组列表
      })
      // 加载开发信列表
      var p1 = new Promise((resolve, reject) => {
        _this.getLetterList(resolve) // 加载默认设置列表
      })
      Promise.all([p0, p1]).then(function (results) {
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
              results[1].forEach(letter => {
                if (letter.groupId == group.groupId) {
                  letter.label = letter.templateName
                  group.children.push(letter)
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
     * 获取开发信列表
     */
    getLetterList (resolve) {
      const _this = this
      _this.$http
        .get(
          _this.Global.baseURL +
            _this.Global.api.SystemSet.mailset.developmentLetter
              .mailsDevletterGet,
          { params: { type: 'all' } }
        )
        .then(
          function (res) {
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
          function (res) {
            _this.$message.error(_this.$t(_this.Global.errorTitle))
          }
        )
    },
    /**
     * 获取分组列表
     */
    getGroupList (resolve) {
      const _this = this
      _this.$http
        .get(
          _this.Global.baseURL +
            _this.Global.api.SystemSet.mailset.developmentLetter
              .mailsDevletterGroupGet,
          {}
        )
        .then(
          function (res) {
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
          function (res) {
            _this.$message.error(_this.$t(_this.Global.errorTitle))
          }
        )
    },
    /**
     * 创建新分组
     */
    createNewGroup () {
      const _this = this
      let data = {
        groupName: _this.addGroup.name
      }
      _this.$http
        .post(
          _this.Global.baseURL +
            _this.Global.api.SystemSet.mailset.developmentLetter
              .mailsDevletterGroupPost,
          data
        )
        .then(
          function (res) {
            if (res.body.code.toString() == _this.Global.RES_OK) {
              _this.$message.success('新增分组成功!')
              _this.closeGroupWindow()
              _this.loadAllData()
            } else {
              _this.$message.error(_this.msg(res.body))
            }
          },
          function (res) {
            _this.$message.error(_this.$t(_this.Global.errorTitle))
          }
        )
    },
    /**
     * 更新分组
     */
    updateGroup () {
      const _this = this
      let data = {
        groupName: _this.addGroup.name,
        groupId: _this.addGroup.groupId
      }
      _this.$http
        .post(
          _this.Global.baseURL +
            _this.Global.api.SystemSet.mailset.developmentLetter
              .mailsDevletterGroupPut,
          data
        )
        .then(
          function (res) {
            if (res.body.code.toString() == _this.Global.RES_OK) {
              _this.$message.success('修改分组成功!')
              _this.loadAllData()
              _this.closeGroupWindow()
            } else {
              _this.$message.error(_this.msg(res.body))
            }
          },
          function (res) {
            _this.$message.error(_this.$t(_this.Global.errorTitle))
          }
        )
    },
    /**
     * 获取单个开发信
     */
    getSingleLetter (templateId) {
      const _this = this
      _this.$http
        .get(
          _this.Global.baseURL +
                _this.Global.api.SystemSet.mailset.developmentLetter
                  .mailsDevletterGet,
          { params: { type: 'detail', templateId: templateId } }
        )
        .then(
          function (res) {
            if (
              res.body.code.toString() == _this.Global.RES_OK && isObject(res.body.data)
            ) {
              let data = res.body.data
              console.log(data)
              var obj = JSON.parse(data.template)
              _this.currentLetter = data
              _this.letterAdminForm.name = obj.templateName
              _this.letterAdminForm.subject = obj.mailSubject
              _this.letterAdminForm.templateId = templateId
              _this.letterAdminForm.groupId = obj.groupId
              _this.letterAdminForm.content = data.content
            } else if (res.body.code.toString() == _this.Global.RES_OK) {
            }
          },
          function (res) {
            _this.$message.error(_this.$t(_this.Global.errorTitle))
          }
        )
    },
    // 左菜单点击
    treeClick (data) {
      this.currentNode = data
      if (data.templateId != undefined && data.templateId != null && data.templateId != '') {
        this.getSingleLetter(data.templateId)
      } else {
        this.resetForm('')
      }
    },
    // 提交表单
    onSubmit (formName) {
      const _this = this
      this.$refs[formName].validate(valid => {
        if (valid) {
          _this.letterAdminForm.content = _this.$refs.ueditor.getContent()
          _this.letterAdminForm.groupId = _this.currentNode.groupId
          if (
            _this.letterAdminForm.groupId != undefined &&
            _this.letterAdminForm.groupId != ''
          ) {
            if (
              _this.letterAdminForm.content != undefined &&
              _this.letterAdminForm.content != null &&
              _this.letterAdminForm.content != ''
            ) {
              if (_this.letterAdminForm.templateId != undefined && _this.letterAdminForm.templateId != null && _this.letterAdminForm.templateId != '') {
                _this.updateLetterTemplate()
              } else {
                _this.saveNewLetterTemplate()
              }
            } else {
              _this.$message.info('开发信内容不能为空!')
            }
          } else {
            _this.$message.info('请选择一个分组!')
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
      // let getContent = this.$refs.ueditor.getContent();
      // console.log(getContent)
    },
    // 添加分组
    addGroupSubmit (formName) {
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
    // 清空表单
    resetForm (formName) {
      // this.$refs[formName].resetFields();
      this.letterAdminForm.name = ''
      this.letterAdminForm.subject = ''
      this.letterAdminForm.content = ''
      this.letterAdminForm.groupId = ''
      this.letterAdminForm.templateId = ''
      this.letterAdminForm.attachments = []
      this.$refs.ueditor.clearContent()
    }

  },
  components: {
    'page-title': PageTitle,
    ueditor: UEditor,
    'file-upload': FileUpload
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
