<template>
    <span class="moduleIco" :style="moduleBgColor">
        <i class="iconfont" :class="moduleIco" style="font-size: 13px;"></i>
        <em>{{moduleCode}}</em>
    </span>
</template>

<script>
/**
 * 描述：系统设置=>日志与行为
 * 作者：向士健
 * 时间：2017/10/31
 */
export default {
  name: 'userActionIco',
  props: {
    moduleCode: {
      type: String,
      required: true,
      default: ''
    }
  },
  data () {
    return {
      moduleBgColor: '', // 默认模块背景色
      moduleIco: '' // 默认模块图标
    }
  },
  created () {
    let _this = this
    // console.log(_this.moduleCode);
    switch (_this.moduleCode) {
      case 'DC002': // 文档
        _this.moduleBgColor = 'background-color:#D0021B'
        _this.moduleIco = 'icon-file-manager'
        break
      case 'WO001': // 工单
        _this.moduleBgColor = 'background-color:#D0021B'
        _this.moduleIco = 'icon-work-sheet'
        break
      case 'SY005': // 部门模块
        _this.moduleBgColor = 'background-color:#D0021B'
        _this.moduleIco = 'icon-groups'
        break
      case 'SY006': // 角色模块
        _this.moduleBgColor = 'background-color:#D0021B'
        _this.moduleIco = 'icon-role-set'
        break
      case 'BF001': // 客户模块
        _this.moduleBgColor = 'background-color:#D0021B'
        _this.moduleIco = 'icon-people_list_light'
        break
      case 'BF004': // 跟进模块
        _this.moduleBgColor = 'background-color:#D0021B'
        _this.moduleIco = 'icon-follow-up'
        break
      case 'BF003': // 联系人模块
        _this.moduleBgColor = 'background-color:#D0021B'
        _this.moduleIco = 'icon-contacts'
        break
      case '': // 登录企业
        _this.moduleBgColor = 'background-color:#D0021B'
        _this.moduleIco = 'icon-go'
        break
      default:
        _this.moduleBgColor = 'background-color:#D0021B'
        _this.moduleIco = 'icon-sign'
    }
  },
  methods: {

  }
}
</script>
