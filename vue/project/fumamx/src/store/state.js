const state = {
    // 头像信息
    personalInfo: {},
    // 企业配置信息
    companyConfigInfo: {},
    // 导航列表
    navigator: {},
    // 所选公司信息
    company: {},
    // 企业基础信息
    companyBasicInfo: {},
    // 个人配置信息
    individualConfigInfo: {},
    // 系统动态组件下拉框值
    sysBoxValue: [],
    // 系统动态组件下拉框值key/value形式
    sysBoxValueShow: [],
    // 系统动态组件自定义下拉框值
    cusBoxValue: [],
    // 组类型
    fieldGroupType: [],
    // 系统后端域名前缀
    domain: {},
    // 公司全部人员下拉框值
    contactList: {},
    // 公司全部人员下拉框值
    contactValue: {},
    // 公司全部部门下拉框值
    departmentList: {},
    // 社交类型下拉
    socialTypeList: [],
    // 管理员权限
    contactCheck: {},
    screenWidth: document.documentElement.clientWidth, // 屏幕宽度
    screenHeight: document.documentElement.clientHeight, // 屏幕高度
    formKey: '' // 获取新增表单校验key
}

export default state
