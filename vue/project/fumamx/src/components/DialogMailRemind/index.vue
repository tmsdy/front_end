<template>
    <div class="DialogMailRemind">
        <el-dialog title="提醒设置" :visible.sync="isOpen" custom-class="width420" @close="resetForm('dialogForm')" v-dialogDrag>
            <el-form :model="dialog" :rules="dialogRules" ref="dialogForm" label-width="88px">

                <el-form-item label="提醒内容" prop="content">
                    <el-input v-model="dialog.content" type="textarea" :rows="5" placeholder="请填写提醒内容"></el-input>

                    <el-dropdown trigger="click" @command="handleCommand">
                        <span class="el-dropdown-link">
                            <i class="el-icon-arrow-down"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="(item,index) in arrShortcutText" :key="index" :command="item">{{item}}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>

                </el-form-item>
                <el-form-item label="提醒时间" prop="datetime">
                    <el-date-picker v-model="dialog.datetime" align="center" type="datetime" placeholder="请选择时间" :picker-options="pickerOptions" class="widthFull"> </el-date-picker>
                </el-form-item>
                <el-form-item label="触发事件" prop="eventCheck">
                    <el-radio-group v-model="dialog.eventCheck">
                        <div v-for="(item,index) in arrEvents" :key="index">
                            <el-radio :label="item"></el-radio>
                        </div>
                    </el-radio-group>
                </el-form-item>

                <div class="text-center">
                    <el-button type="primary" @click="submit('dialogForm')" style="width:170px;">保存</el-button>
                </div>
            </el-form>
        </el-dialog>

    </div>
</template>

<script>
/**
 * 描述：邮件部分
 * 作者：向士健(CSS) / ***(API)
 * 时间：2017/11/11
 */
export default {
  name: 'DialogMailRemind',
  props: [],
  data () {
    return {
      isOpen: false, // 弹窗开关
      arrEvents: ['始终提醒（无前置触发条件）', '若在提醒时间到达以前我未回复该邮件'],
      arrShortcutText: ['此客户晚上发邮件跟进一下', '明早电话回访上海孚盟软件', '晚上不吃饭了'],
      dialog: {
        content: '',
        datetime: '',
        eventCheck: '始终提醒（无前置触发条件）'
      },
      dialogRules: {
        content: [
          { required: true, message: '请输入提醒内容', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
        ],
        datetime: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ]
      },
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '明天',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周后',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      }
    }
  },
  methods: {
    // 父组件来调用
    isDialog (to) {
      if (to == 'open') {
        this.isOpen = true
      } else {
        this.isOpen = false
      }
    },
    // 提交
    submit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.dialog)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 点击快捷文本下拉
    handleCommand (command) {
      this.dialog.content = command
    },
    // 清空表单
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
