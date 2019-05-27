/**
 * 定义请求node服务端接口地址
 */
export default {
    UniversalInterface: {
        // 通用接口
        verifySMS: 'UniversalInterface/verifySMS', // 发送短信验证码
        verifyemail: 'UniversalInterface/verifyemail', // 发送邮箱验证码
        checkValid: 'UniversalInterface/checkValid', // 有效性验证
        timestamp: 'UniversalInterface/timestamp', // 获取服务器linux时间戳
        dictionaryInf: 'UniversalInterface/dictionaryInf', // 获取系统字典信息
        uploadCutPicture: 'UniversalInterface/uploadCutPicture', // 上传裁剪图片，每天清理一次文件
        getShortcutMenu: 'UniversalInterface/shortcutMenu', // 菜单，快捷导航
        imgVerificationCode: 'UniversalInterface/imgVerificationCode', // 获取图片验证码
        accountQuery: 'UniversalInterface/accountQuery', // 查询个人账户信息
        accountIndividualInf: 'UniversalInterface/accountIndividualInf', // 查询某企业下的个人账户信息,查询企业下的所有账户信息
        companysettingGet: 'UniversalInterface/companysettingGet', // 获取企业配置信息
        companysettingUpdate: 'UniversalInterface/companysettingUpdate', // 修改企业配置信息
        personalsettingGet: 'UniversalInterface/personalsettingGet', // 获取个人配置信息
        frontLog: 'UniversalInterface/frontLog', // 前端日志记录
        excel: 'UniversalInterface/excel', // 解析excel,返回json
        log: 'UniversalInterface/log', // 收件日志
        domain: 'UniversalInterface/domain', // 获取系统后端域名前缀
        versionInspect: 'UniversalInterface/versionInspect', // 检查版本号
        encryptionComparison: 'UniversalInterface/encryptionComparison', // 密码比较
        timezoneConversion: 'UniversalInterface/timezoneConversion' // 把北京时间（+8区时间）转换成指定时区的时间
    },
    SystemSet: {
        enterpriseset: {
            // 企业设置
            enterpriseInf: 'SystemSet/enterpriseset/enterpriseInf', // 获取企业基础信息，获取企业配置信息
            saveEnterpriseInf: 'SystemSet/enterpriseset/saveEnterpriseInf', // 修改企业基础信息，修改企业配置信息
            areaInf: 'SystemSet/enterpriseset/areaInf' // 获取国家城市
        },
        systemparameter: {
            // 系统参数
            companysettingGet: 'SystemSet/systemparameter/companysettingGet', // 全员重置密码
            companyWhiteListGet: 'SystemSet/systemparameter/companyWhiteListGet', // 获取企业白名单
            companyWhiteListAdd: 'SystemSet/systemparameter/companyWhiteListAdd' // 修改企业白名单
        },
        personaldata: {
            // 个人资料
            accountIndividualInf: 'SystemSet/personaldata/accountIndividualInf', // 查询某企业下的个人账户信息
            accountPut: 'SystemSet/personaldata/accountPut' // 修改账号信息
        },
        accountsettings: {
            // 账号设置
            personalsettingGet: 'SystemSet/accountsettings/personalsettingGet', // 获取个人配置信息
            personalsettingPut: 'SystemSet/accountsettings/personalsettingPut', // 修改个人配置信息
            accountPut: 'SystemSet/accountsettings/accountPut' // 修改账号信息
        },
        applicationcenter: {
            // 应用中心
            appGet: 'SystemSet/applicationcenter/appGet' // 获取应用中心列表/get
        },
        groupstructure: {
            // 组织架构
            getTree: 'SystemSet/groupstructure/getTree', // 获取树菜单
            getTable: 'SystemSet/groupstructure/getTable', // 获取表格数据
            departmentAdd: 'SystemSet/groupstructure/departmentAdd', // 添加部门
            departmentPut: 'SystemSet/groupstructure/departmentPut', // 更新部门
            departmentDelete: 'SystemSet/groupstructure/departmentDelete', // 删除部门
            accountAdd: 'SystemSet/groupstructure/accountAdd', // 添加成员
            invitation: 'SystemSet/groupstructure/invitation', // 生成邀请链接邀请成员
            accountUpdate: 'SystemSet/groupstructure/accountUpdate', // 单人或多人部门调整
            operateLogQuery: 'SystemSet/groupstructure/operateLogQuery', // 批量注册账号日志
            accountlist: 'SystemSet/groupstructure/accountlist', // 批量注册账号
            downloadResults: 'SystemSet/groupstructure/downloadResults', // 创建文件并下载
            contactUpdate: 'SystemSet/groupstructure/contactUpdate', // 修改资料
            contactAdd: 'SystemSet/groupstructure/contactAdd', // 添加人员进企业
            quickAddAccount: 'SystemSet/groupstructure/quickAddAccount', // 快速添加成员
            disableEnable: 'SystemSet/groupstructure/disableEnable' // 禁用启用
        },
        rolemanag: {
            // 角色管理
            roles: 'SystemSet/rolemanag/roles', // 获取角色
            rolesPost: 'SystemSet/rolemanag/rolesPost', // 新增角色
            rolesPut: 'SystemSet/rolemanag/rolesPut', // 编辑角色
            rolesDelete: 'SystemSet/rolemanag/rolesDelete', // 删除角色
            rolesContacts: 'SystemSet/rolemanag/rolesContacts', // 获取角色人员/get
            rolesContactsPost: 'SystemSet/rolemanag/rolesContactsPost', // 添加角色人员/post
            rolesContactsDelete: 'SystemSet/rolemanag/rolesContactsDelete', // 删除角色人员/post
            permissionsGet: 'SystemSet/rolemanag/permissionsGet', // 查询权限项目定义,查询权限分配/get
            permissionsPut: 'SystemSet/rolemanag/permissionsPut', // 权限分配设置/post
            rolesId: 'SystemSet/rolemanag/rolesId' // 查询角色下告警人员/get
        },
        logaction: {
            // 日志和行为
            operateLogQuery: 'SystemSet/logaction/operateLogQuery', // 批量注册账号日志/获取登录日志/get
            behaviorLogGet: 'SystemSet/logaction/behaviorLogGet', // 获取行为日志/get
            frontLogAdd: 'SystemSet/logaction/frontLogAdd', // 前端日志记录/post
            moduleGet: 'SystemSet/logaction/moduleGet' // 获取模块列表及对应的操作/get
        },
        bizfield: {
            // 业务字段配置
            bizNavigatorGet: 'SystemSet/bizfield/bizNavigatorGet', // 业务字段配置导航
            bizFieldAdd: 'SystemSet/bizField/bizFieldAdd', // 新增字段
            bizFieldQuery: 'SystemSet/bizfield/bizFieldQuery', // 查询业务字段
            bizFieldUpdate: 'SystemSet/bizField/bizFieldUpdate', // 修改(编辑)字段
            controlTypeQuert: 'SystemSet/bizField/controlTypeQuert' // 获取字段控件列表
        },
        bizdict: {
            // 业务字典
            dictNavigatorGet: 'SystemSet/bizdict/dictNavigatorGet', // 获取业务字典导航/get
            dictionarysAdd: 'SystemSet/bizdict/dictionarysAdd', // 字典新增/ post
            dictionarysUpdate: 'SystemSet/bizdict/dictionarysUpdate', // 字典修改/ post
            dictionarysQuery: 'SystemSet/bizdict/dictionarysQuery' // 字典查询/ post
        },
        scheduleremind: {
            // 日程和提醒
            messengerPost: 'SystemSet/scheduleremind/messengerPost', // 新建提醒
            messageGet: 'SystemSet/scheduleremind/messageGet', // 获取提醒列表
            messagePut: 'SystemSet/scheduleremind/messagePut', // 修改提醒
            messengerGet: 'SystemSet/scheduleremind/messengerGet', // 获取日程列表
            messengerPut: 'SystemSet/scheduleremind/messengerPut', // 修改日程
            messengerDelete: 'SystemSet/scheduleremind/messengerDelete' // 删除日程
        },
        mailset: {
            // 邮件帐号
            mailaccount: {
                reviseAccount: 'SystemSet/mail/reviseAccount', // 修改已添加的邮箱账号
                reviseAccounts: 'SystemSet/mail/reviseAccounts', // 修改已添加的邮箱账号
                mailsAccount: 'SystemSet/mail/mailsAccount', // 添加账号
                accountAdd: 'SystemSet/mail/accountAdd', // 添加账号
                accounts: 'SystemSet/mail/accounts', // 获取用户绑定的所有邮箱账号
                accountsDelete: 'SystemSet/mail/accountsDelete', // 删除已添加的邮箱账号
                config: 'SystemSet/mail/config'
            },
            // 邮件设置
            setindex: {
                GetOptions: 'SystemSet/mail/mailOptionsGetOptions', // 获取邮件列表
                updateOptions: 'SystemSet/mail/updateOptions' // 邮件设置修改
            },
            // 模板
            template: {
                mailTemplatePost: 'Mails/home/mailTemplatePost', // 新增模板
                getMailsTemplate: 'Mails/home/getMailsTemplate', // 获取模板列表
                mailTmplSetPost: 'Mails/home/mailTmplSetPost', // 设置默认模板
                getMailsTmplSet: 'Mails/home/getMailsTmplSet', // 获取设置的默认模板
                mailTemplatePut: 'Mails/home/mailTemplatePut', // 修改模板
                mailTmplSetPut: 'Mails/home/mailTmplSetPut', // 修改默认模板
                mailTmplSetDelete: 'Mails/home/mailTmplSetDelete' // 删除模板
            },
            // 签名
            sign: {
                mailsSignaturePost: 'Mails/home/mailsSignaturePost', // 新建签名
                getMailsSignature: 'Mails/home/getMailsSignature', // 获取单个签名/签名列表
                mailsSignatureDelete: 'Mails/home/mailsSignatureDelete', // 删除签名
                mailsSignaturePut: 'Mails/home/mailsSignaturePut' // 修改签名
            },
            // 开发信
            developmentLetter: {
                mailsDevletterPost: 'Mails/home/mailsDevletterPost', // 新建开发信
                mailsDevletterGet: 'Mails/home/mailsDevletterGet', // 获取分组开发信/单个详情
                mailsDevletterGroupPost: 'Mails/home/mailsDevletterGroupPost', // 新建分组
                mailsDevletterGroupGet: 'Mails/home/mailsDevletterGroupGet', // 获取分组列表
                mailsDevletterGroupPut: 'Mails/home/mailsDevletterGroupPut', // 修改分组
                mailsDevletterGroupDelete: 'Mails/home/mailsDevletterGroupDelete', // 删除分组
                mailsDevletterPut: 'Mails/home/mailsDevletterPut', // 修改开发信
                mailsDevletterDelete: 'Mails/home/mailsDevletterDelete' // 删除开发信
            },
            // 快速开发文本
            fastText: {
                deleteFastTextGroup: 'Mails/home/deleteFastTextGroup', // 删除快速文本组
                getFastTextGroupList: 'Mails/home/getFastTextGroupList', // 获取快速文本组列表
                addFastTextGroup: 'Mails/home/addFastTextGroup', // 新增快速文本组
                updateFastTextGroup: 'Mails/home/modifyFastTextGroup', // 修改快速文本分组

                addFastText: 'Mails/home/addFastText', // 新增快速文本
                deleteFastText: 'Mails/home/deleteFastText', // 删除快速文本
                getFastTextList: 'Mails/home/getFastTextList', // 获取快速文本列表
                modifyFastText: 'Mails/home/modifyFastText' // 修改快速文本
            }
        },
        highseas: {
            // 公海设置
            seasSettingSeasAdd: 'SystemSet/highseas/seasSettingSeasAdd', // 新建自动放入规则,新建公海规则
            seasSettingSeasGet: 'SystemSet/highseas/seasSettingSeasGet', // 获取自动放入规则条件筛选,获取公海规则列表,获取公海规则详情
            seasSettingSeasDelete: 'SystemSet/highseas/seasSettingSeasDelete', // 删除公海规则
            seasSettingSeasPut: 'SystemSet/highseas/seasSettingSeasPut', // 修改公海规则
            custLimitGet: 'SystemSet/highseas/custLimitGet', // 获取客户最大保护规则$条件筛选
            custLimitAdd: 'SystemSet/highseas/custLimitAdd', // 新建客户最大保护规则
            custLimitPut: 'SystemSet/highseas/custLimitPut', // 修改客户最大保护规则
            custLimitDelete: 'SystemSet/highseas/custLimitDelete' // 删除客户最大保护规则
        }
    },
    WorkBench: {
        getMenuNavList: 'WorkBench/menuNavList'
    },
    Client: {
        list: {
            getListConfig: 'Client/list/getListConfig', //  聚合，单据列表配置数据聚合接口
            getDetailConfig: 'Client/list/getDetailConfig', // 聚合，存储单据详情配置数据
            getList_Polymerization: 'Client/list/getList_Polymerization', // 聚合，单据列表数据聚合接口
            getListDetail: 'Client/list/getListDetail', // 聚合，单据列表详情数据聚合接口
            getListDetail_contacts: 'Client/list/getListDetail_contacts' // 聚合，单据列表详情，联系人tab
        }
    },
    Subordinate: {
        getTreeMenu: 'Subordinate/getTreeMenu'
    },
    Mail: {
        getMenuNavList: 'Mail/menuNavList',
        mailsMailscountGet: 'Mails/home/mailsMailscountGet', // 获取邮件文件夹列表
        mailsMailboxesGet: 'Mails/home/mailsMailboxesGet', // 获取邮件文件夹列表
        mailsMailboxPost: 'Mails/home/mailsMailboxPost', // 添加文件夹
        mailsMailboxPut: 'Mails/home/mailsMailboxPut', // 修改文件夹
        mailsMailboxGet: 'Mails/home/mailsMailboxGet', // 获取邮件文件夹信息
        mailsMailboxDelete: 'Mails/home/mailsMailboxDelete', // 清空回收站文件夹
        getMailsFastSearch: 'Mails/home/getMailsFastSearch', // 邮件快速搜索
        mailBoxRulePut: 'Mails/home/mailBoxRulePut', // 文件夹规则修改
        mailBoxRuleAdd: 'Mails/home/mailBoxRuleAdd', // 文件夹规则新建
        mailBoxRuleDelete: 'Mails/home/mailBoxRuleDelete', // 删除文件夹规则
        // 标签

        maillabelPost: 'Mails/home/maillabelPost', // 新增标签
        maillabelDelete: 'Mails/home/maillabelDelete', // 删除标签
        MaillabelPut: 'Mails/home/MaillabelPut', // 修改标签
        maillabelsGet: 'Mails/home/maillabelsGet', // 获取用户标签列表
        maillabelGet: 'Mails/home/maillabelGet', // 获取单个标签信息
        mailPut: 'Mails/home/mailPut', // 邮件设置标签
        // 邮件列表
        getMaillist: 'Mails/home/getMaillist', // 获取指定文件夹的邮件列表
        getTopmaillist: 'Mails/home/getTopmaillist', // 获取置顶邮件
        ManyMaillistPut: 'Mails/home/ManyMaillistPut', // 邮件更新操作
        getMailCurrent: 'Mails/home/getMailCurrent', // 获取指定邮件
        mailDelete: 'Mails/home/mailDelete', // 删除邮件
        getDownload: 'Mails/home/getDownload', // 邮件文件下载
        billLabelPut: 'Mails/home/billLabelPut', // 单据更新标签
        getAdvancedSearch: 'Mails/home/getAdvancedSearch', // 获取邮件搜索字段
        searchFieldPut: 'Mails/home/searchFieldPut', // 修改搜索字段
        searchFieldPost: 'Mails/home/searchFieldPost', // 添加(删除)搜索字段
        bulkUpdatePut: 'Mails/home/bulkUpdatePut', // 批量标记为已读
        getMailStatus: 'Mails/home/getMailStatus', // 邮件收件错误消息
        mailsSpamSetPost: 'Mails/home/mailsSpamSetPost', // 把邮件设置为垃圾邮件
        mailBoxTransferPost: 'Mails/home/mailBoxTransferPost', // 文件夹移交给
        mailMergePost: 'Mails/home/mailMergePost', // 归档
        getMailsManualRec: 'Mails/home/getMailsManualRec', // 收件
        mailsImportUrl: 'Mails/home/mailsImportUrl', // 邮件导入
        mailDistributePost: 'Mails/home/mailDistributePost', // 邮件内分发
        mailPublicMailDistPost: 'Mails/home/mailPublicMailDistPost', // 未分发
        getMailsMail: 'Mails/home/getMailsMail', // 获取单个邮件信息
        mailssavePost: 'Mails/home/mailssavePost', // 写邮件
        mailsrecipientsGet: 'Mails/home/mailsrecipientsGet', // 白名单联系人查询
        MailEditor: 'Mails/home/MailEditor', // 邮件编辑
        MailWrite: 'Mails/home/MailWrite', // 写邮件
        MailDraft: 'Mails/home/MailDraft', // 编辑草稿
        mailsTmplSelectGet: 'Mails/home/mailsTmplSelectGet', // 写，回复，转发模板选择
        MailWSwitchAccountite: 'Mails/home/MailWSwitchAccountite', // 切换账号
        mailsDeliveryStatusGet: 'Mails/home/mailsDeliveryStatusGet', // 邮件发送状态获取
        GetDeliveryStatus: 'Mails/home/GetDeliveryStatus', // 邮件发送状态获取
        getSendMailAccount: 'Mails/home/getSendMailAccount', // 获取发送账号
        mailsSendReceiptPost: 'Mails/home/mailsSendReceiptPost', // 发送回执
        getSettingInformation: 'Mails/home/getSettingInformation', // 邮件设置
        DeleteTimeTask: 'Mails/home/DeleteTimeTask', // 邮件撤销发送
        // 黑名单
        BlackListGet: 'Mails/home/BlackListGet', // 获取黑名单列表
        BlackListPost: 'Mails/home/BlackListPost', // 加入黑名单
        BlackListDelete: 'Mails/home/BlackListDelete', // 移除黑名单
        // 白名单
        whitelistAdd: 'Mails/home/whitelistAdd', // 白名单添加
        whitelistGet: 'Mails/home/whitelistGet', // 获取白名单列表
        whitelistDelete: 'Mails/home/whitelistDelete', // 移除白名单

        GetNumberAccounts: 'Mails/home/GetNumberAccounts', // 获取账号数量
        GetPersonnels: 'Mails/home/GetPersonnels', // 获取当前用户有权限查看邮件的人员列表
        GetRightsCheck: 'Mails/home/GetRightsCheck', // 判断操作是否有权限接口
        mailsImport: 'Mails/home/mailsImport', // 导入邮件
        generalOperateGet: 'Mails/home/generalOperateGet',
        recipientCheckPost: 'Mails/home/recipientCheckPost', // 邮件接收者检查接口
        tracklogsGet: 'Mails/home/tracklogsGet', // 获取邮件阅读记录
        mailsMergePost: 'Mails/home/mailsMergePost', // 全部归并
        getMailsContacts: 'Mails/home/getMailsContacts' // 客户联系人获取
    },
    CompanyRegister: {
        companyAdd: 'CompanyRegister/companyAdd' // 注册企业
    },
    Files: {
        all_download: 'files/all/download',
        all_pdf: 'files/all/pdf',
        all_readContent: 'files/all/readContent',
        docFiles_pack: 'files/doc/pack',
        docFiles_download: 'files/doc/get/'
    },
    // 代理后端请求
    v2: {
        download: 'v2/download/', // 下载
        // 通用
        verifySMS: 'v2/verifySMS', // 发送校验短信验证码
        verifyemail: 'v2/verifyemail', // 发送校验邮箱验证码
        checkValid: 'v2/checkValid/', // 有效性验证（企业、账号）
        navigator_get: 'v2/navigator/get', // 获取导航列表
        timestamp: 'v2/timestamp', // 获取服务器linux时间戳
        dictionary: 'v2/dictionary/', // 获取系统基础信息
        area: 'v2/area/', // 获取行政区划信息
        accountDropList_get: 'v2/accountDropList/get', // 获取人员/部门下拉框
        sysDefault_get: 'v2/sysDefault/get', // 获取系统默认配置信息
        // 邮件
        mails_fastTextGroup_deleteFastTextGroup: 'v2/mails/fastTextGroup/deleteFastTextGroup', // 删除快速文本组
        mails_fastTextGroup_getFastTextGroupList: 'v2/mails/fastTextGroup/getFastTextGroupList', // 获取快速文本组列表
        mails_fastTextGroup_addFastTextGroup: 'v2/mails/fastTextGroup/addFastTextGroup', // 新增快速文本组
        mails_fastText_addFastText: 'v2/mails/fastText/addFastText', // 新增快速文本
        mails_fastText_deleteFastText: 'v2/mails/fastText/deleteFastText', // 删除快速文本
        mails_fastText_getFastTextList: 'v2/mails/fastText/getFastTextList', // 获取快速文本列表
        mails_account: 'v2/mails/account', // 邮箱账号相关=>添加账号,修改已添加的邮箱账号,删除已添加的邮箱账号,获取已添加的邮箱账号列,获取已添加账户信息
        mails_mailOptions_getOptions: 'v2/mails/mailOptions/getOptions', // 邮箱服务器配置
        mails_mailOptions_updateOptions: 'v2/mails/mailOptions/updateOptions', // 更新邮件设置列表
        mails_mailbox: 'v2/mails/mailbox', // 邮件文件夹相关=>添加文件夹,修改文件夹,获取邮件文件夹信息,清空回收站文件夹
        mails_mailboxes: 'v2/mails/mailboxes', // 获取邮件文件夹列表
        mails_maillist: 'v2/mails/maillist', // 邮件列表相关
        mails_search: 'v2/mails/search', // 邮件高级搜索
        mails_mailscount: 'v2/mails/mailscount', // 获取邮件目录统计信息
        mails_mail: 'v2/mails/mail', // 邮件相关操作=>邮件更新操作,获取单个邮件信息,邮件彻底删除,
        mails_download: 'v2/mails/download', // 邮件文件下载
        mails_searchField_get: 'v2/mails/searchField/get', // 搜索字段配置=>获取邮件搜索字段
        mails_searchField_put: 'v2/mails/searchField/put', // 修改搜索字段
        mails_searchField_add: 'v2/mails/searchField/add', // 添加(删除)搜索字段
        mails_accountStatus: 'v2/mails/accountStatus', // 获取邮件接收状态
        mails_accounts: 'v2/mails/accounts', // 获取邮件接收状态
        mails_publicRules: 'v2/mails/publicRules', // 分发规则列表
        internalMailDomain: 'v2/mails/internalMailDomain',
        // 单据框架
        document_formKey: 'v2/document/formKey', // 获取新增表单校验key
        customers_add: 'v2/customers/add', // 新增客户
        customers_get: 'v2/customers/get', // 获取客户列表, 获取客户详情
        document_quickSearch_get: 'v2/document/quickSearch/get', // 单据列表快速查询
        document_file_list: 'v2//document/file/list', // 单据附件列表接口
        customers_put: 'v2/customers/put', // 修改客户（基础信息）
        customers_status_put: 'v2/customers/status/put', // 修改客户（特殊信息）,修改联系人（特殊信息）
        customerCheck_get: 'v2/customerCheck/get', // 客户查重
        customerFind: 'v2/customerFind', // 客户查重（根据客户名称定向查某客户）
        customerMerge_do: 'v2/customerMerge/do', // 客户合并
        custContacts_add: 'v2/custContacts/add', // 客户联系人=>新增联系人
        custContacts_get: 'v2/custContacts/get', // 获取联系人列表,获取联系人详情
        custContacts_put: 'v2/custContacts/put', // 修改联系人（基础信息）
        socialType_get: 'v2/socialType/get', // 获取社交类型
        custTracks_add: 'v2/custTracks/add', // 客户跟进=>新增客户跟进
        custTracks_get: 'v2/custTracks/get', // 获取客户跟进列表,获取客户跟进详情
        custTracks_put: 'v2/custTracks/put', // 修改跟进（基础信息）
        customerWithContact_add: 'v2/customerWithContact/add', // 修改跟进（基础信息）
        module_get: 'v2/module/get', // 获取模块列表及对应的操
        fieldShow_get: 'v2/fieldShow/get', // 获取业务字段展示
        moduleStruct: 'v2/moduleStruct/', // 获取模块结构
        fieldShow_custCheck_do: 'v2/fieldShow/custCheck/do', // 获取客户查重字段展示,修改相关字段
        sysBoxValue_get: 'v2/sysBoxValue/get', // 获取下拉框值
        fieldDetails_get: 'v2/fieldDetails/get', // 字段操作相关=>获取相关字段
        fieldDetails_put: 'v2/fieldDetails/put', // 修改相关字段
        document_generalOperate_add: 'v2/document/generalOperate/add', // 单据新增
        document_generalOperate_get: 'v2/document/generalOperate/get', // 获取单据列表,获取单据详情
        document_generalOperate_put: 'v2/document/generalOperate/put', // 修改单据
        document_generalOperate_delete: 'v2/document/generalOperate/delete', // 单据删除
        moduleOptSet_get: 'v2/moduleOptSet/get', // 获取单据操作项
        document_rightCheck_do: 'v2/document/rightCheck/do', // 判断是否有权限操作
        document_viewset_get: 'v2/document/viewset/get', // 获取单据视图布局
        document_operate_listOpt_put: 'v2/document/operate/listOpt/put', // 批量修改
        document_operate_detailOpt_put: 'v2/document/operate/detailOpt/put', // 关注,取消关注
        document_config_get: 'v2/document/config/get', // 字段单独检验重复
        customerIntegrity_do: 'v2/customerIntegrity/do', // 获取客户资料完整度详情
        document_importExport_do: 'v2/document/importExport/do', // 导入（下载模板，获取模板字段，单据导入）
        document_feedback: 'v2/document/feedback', // 新增我的反馈
        // reportManage: 'v2/reportManage', // 新增我的反馈
        // 单据和邮箱公用接口
        label_add: 'v2/label/add', // 新增标签
        label_delete: 'v2/label/delete', // 删除标签
        label_put: 'v2/label/put', // 修改标签
        label_get: 'v2/label/get', // 获取标签列表,获取单个标签信息
        billLabel_put: 'v2/billLabel/put', // 单据(邮件)更新标签
        labelManage: 'v2/labelManage', // 合并标签
        billComment_add: 'v2/billComment/add', // 新增批注
        billComment_update: 'v2/billComment/update', // 删除批注
        billComment_get: 'v2/billComment/get', // 修改批注
        // 系统设置
        operateLog_query: 'v2/operateLog/query', // 获取登录日志,使用个人令牌
        behaviorLog_get: 'v2/behaviorLog/get', // 获取行为日志
        behaviorLog_get: 'v2/behaviorLog/get', // 获取行为日志
        frontLog_add: 'v2/frontLog/add', // 前端日志记录
        auth: 'v2/auth', // 登录
        dinglogin: 'v2/dinglogin/', // 钉钉扫码登录
        loginEnterprise: 'v2/loginEnterprise', // 登入进企业记录行为
        department: 'v2/department/', // 获取部门信息
        department_add: 'v2/department/add', // 新增部门
        department_put: 'v2/department/put', // 修改部门信息,同级部门移动
        department_delete: 'v2/department/delete', // 删除部门
        company_add: 'v2/company/add', // 注册企业,个人令牌
        company_query: 'v2/company/query', // 获取企业基础信息
        company_put: 'v2/company/put', // 修改企业基础信息
        companysetting_get: 'v2/companysetting/get', // 获取企业配置信息,全员重置密码
        companysetting_update: 'v2/companysetting/update', // 修改企业配置信息
        simpleCompanyInfo: 'v2/simpleCompanyInfo/', // 根据二级域名获取简单企
        companyWhiteList_add: 'v2/companyWhiteList/add', // 修改企业白名单
        companyWhiteList_get: 'v2/companyWhiteList/get', // 获取企业白名单
        companyWhiteList2: 'v2/companyWhiteList2', // 企业白名单2期
        account_add: 'v2/account/add', // 注册个人账号
        resetpwd: 'v2/resetpwd', // 修改密码、重置密码
        account_put: 'v2/account/put', // 修改账号信息,个人令牌
        account_update: 'v2/account/update', // 单人或多人部门调整
        account_get: 'v2/account/get', // 查询个人账户信息,个人令牌,多条件获取企业人员信息
        account_query: 'v2/account/query', // 查询企业下的个人账户信息，查询企业下的所有账户信息
        account: 'v2/account/', // 根据部门获取个人信息列表
        personalsetting_get: 'v2/personalsetting/get', // 获取个人配置信息
        personalsetting_put: 'v2/personalsetting/put', // 修改个人配置信息
        invitation: 'v2/invitation', // 生成邀请链接邀请成员
        accountlist: 'v2/accountlist', // 批量添加账号
        contact_update: 'v2/contact/update', // 修改个人账号在某企业中
        contact_delete: 'v2/contact/delete', // 删除账号和企业的关联
        contact_add: 'v2/contact/add', // 添加人员进企业
        contact_do: 'v2/contact/do', // 添加人员进企业/是否为管理员
        messenger_post: 'v2/messenger/post', // 新建提醒（日程）
        message_get: 'v2/message/get', // 获取提醒列表
        messenger_put: 'v2/messenger/put', // 修改日程
        messenger_get: 'v2/messenger/get', // 获取日程列表
        messenger_delete: 'v2/messenger/delete', // 删除日程
        roles: 'v2/roles/', // 获取角色
        roles_post: 'v2/roles/post', // 新增/复制角色
        roles_put: 'v2/roles/put', // 编辑角色
        roles_delete: 'v2/roles/delete', // 角色删除
        roles_contacts: 'v2/roles/contacts/', // 获取角色人员,获取人员的角色数
        roles_contacts_post: 'v2/roles/contacts/post', // 添加角色人员
        roles_contacts_delete: 'v2/roles/contacts/delete', // 删除角色人员
        permissions_get: 'v2/permissions/get', // 获取权限页,查询权限项目定义,查询权限分配
        permissions_put: 'v2/permissions/put', // 查询权限分配
        permissions_do: 'v2/permissions/do', // 权限字段限制查询
        rolesField_do: 'v2/rolesField/do', // 权限字段限制查询

        customerCooperate_do: 'v2/customerCooperate/do', // 新增共享协作人
        dictNavigator_get: 'v2/dictNavigator/get', // 获取业务字典导航
        dictionarys_add: 'v2/dictionarys/add', // 字典新增
        dictionarys_update: 'v2/dictionarys/update', // 字典修改
        dictionarys_query: 'v2/dictionarys/query', // 字典查询
        app_get: 'v2/app/get', // 获取应用中心列表
        appSet_doPut: 'v2/appSet/doPut', // 获取应用中心列表
        bizNavigator_get: 'v2/bizNavigator/get', // 业务字段配置导航
        bizField_add: 'v2/bizField/add', // 新增字段
        bizField_query: 'v2/bizField/query', // 业务字段相关查询接口
        bizField_update: 'v2/bizField/update', // 修改(编辑)字段
        seasSetting_set_do: 'v2/seasSetting/set/do', // 获取及修改公海设置
        seasSetting_seas_add: 'v2/seasSetting/seas/add', // 新建公海规则
        seasSetting_seas_put: 'v2/seasSetting/seas/put', // 修改公海规则
        seasSetting_seas_delete: 'v2/seasSetting/seas/delete', // 删除公海规则
        seasSetting_seas_get: 'v2/seasSetting/seas/get', // 获取公海规则列表,获取公海规则详情,获取自动放入规则条件筛
        seasSetting_custLimit_get: 'v2/seasSetting/custLimit/get', // 获取$条件筛选,获取$列表,获取$详情
        seasSetting_custLimit_add: 'v2/seasSetting/custLimit/add', // 新建$
        seasSetting_custLimit_put: 'v2/seasSetting/custLimit/put', // 修改$
        seasSetting_custLimit_delete: 'v2/seasSetting/custLimit/delete', // 删除$
        textDict_get: 'v2/textDict/get', // 多行文本
        homeQuickOptSet_do: 'v2/homeQuickOptSet/do',
        // 数据统计接口
        stat_panel_get: 'v2/stat/pers/panel/get', // MX工作台个人面板信息接
        stat_custDist_get: 'v2/stat/pers/custDist/get', // MX工作台客户分布面板数
        stat_pers_get: 'v2/stat/pers/get', // MX工作台简报数据接口,MX工作台提醒小秘书数据,MX工作台活跃度统计接口,MX工作台月走势图接口
        stat_rank_get: 'v2/stat/pers/rank/get', // MX工作台部门内排行接口
        stat_pers_trackDetail_get: 'v2/stat/pers/trackDetail/get', // 客户跟进动态统计数接口
        stat_dept_panel_get: 'v2/stat/dept/panel/get', // 部门面板初始化信息接口
        stat_dept_briefReport: 'v2/stat/dept/briefReport/get', // 部门工作简报接口
        stat_dept_rank_get: 'v2/stat/dept/rank/get', // 部门排行接口
        stat_dept_custSummarize_get: 'v2/stat/dept/custSummarize/get', // 部门客户概述统计接口
        stat_dept_custDist_get: 'v2/stat/dept/custDist/get', // 部门客户分布统计接口
        stat_dept_monthlyChart_get: 'v2/stat/dept/monthlyChart/get', // 部门客户走势图统计接口
        stat_dept_activity_get: 'v2/stat/dept/activity/get', // 部门活跃度统计接口
        stat_dept_actCustDist_get: 'v2/stat/dept/actCustDist/get', // 部门业务员客户分布统计接口
        stat_init_put: 'v2/stat/init/put', // 统计数据初始化接口

        /* 文档与知识库 */
        folders_foldersTree: 'v2/folders/foldersTree', // 树目录
        folders_files: 'v2/folders/files', // 文件相关的操作
        folders_inFileSys: 'v2/folders/inFileSys', // 本地文件服务器上传接口
        folders_folderRights: 'v2/folders/folderRights', //  权限相关的接口
        folders_fileRights: 'v2/folders/fileRights', // 文件操作权限查询接口
        folders_fileLock: 'v2/folders/fileLock', // 文件迁入迁出相关的接口
        folders_fileVersion: 'v2/folders/fileVersion', // 文件历史版本
        folders_downloadURL: 'v2/folders/downloadURL', // 文件获取下载链接接口
        folders_fileDownloadV2: 'v2/folders/fileDownloadV2', // 文件下载
        folders_newFile: 'v2/folders/newFile', // 修订后的文件回显接口
        folders_recycleBinFile: 'v2/folders/recycleBinFile', // 回收站相关的接口
        folders_file_content: 'v2/folders/file/content', // 文本内容获取
        folders_preViewImage: 'v2/folders/preViewImage', // 视频封面上传
        folders_zipDownloadFiles: 'v2/folders/zipDownloadFiles', // java处理的多文件下载
        folders_mailAttachmentPaser: 'v2/folders/mailAttachmentPaser', // 邮件附件预览时内容解析

        folders_moveFiles: 'v2/folders/moveFiles', // 文档系统文件转存入文件服务器接口
        folders_foldersTreeWithRight: 'v2/folders/foldersTreeWithRight', // 根据操作权限获取对应许可列表数据接
        folders_transferFiles: 'v2/folders/transferFiles', // 其他模块文件转存文档接口
        folders_changeFolder: 'v2/folders/changeFolder', // 移动文件到指定文件夹
        folders_copyFile: 'v2/folders/copyFile', // 复制文件到指定文件夹
        folders_fileInteraction: 'v2/folders/fileInteraction',

        customerNearby_do: 'v2/customerNearby/do', // 接口名称: 获取周边客户
        sldCheck_add: 'v2/sldCheck/add', // 接口名称: 二级域名新增
        sldCheck_get: 'v2/sldCheck/get', // 接口名称: 二级域名校验
        sldCheck_put: 'v2/sldCheck/put', // 接口名称: 二级域名修改 => 重置code

        /* 单据附件，文件上传OSS */
        docFile_get: 'v2/docFile/get', // 单据附件列表
        fileDownLoad_get: 'v2/fileDownLoad/get', // 单据附件的下载链接的获取
        docFile_put: 'v2/docFile/put', // 单据附件删除
        folders_fileTask: 'v2/folders/fileTask', // 单据附件删除
        /* 工单 */
        workOrder_add: 'v2/workOrder/add',
        workOrder_get: 'v2/workOrder/get',
        workOrder_put: 'v2/workOrder/put',
        /* 工单记录 */
        statusChange_add: 'v2/statusChange/add',
        statusChange_get: 'v2/statusChange/get',
        // 评价
        workEvaluate_add: 'v2/workEvaluate/add',

        // 系统更新通知相关
        sysNotice_add: 'v2/sysNotice/add',
        sysNotice_get: 'v2/sysNotice/get',
        sysNotice_put: 'v2/sysNotice/put',
        // 开通支付-java
        authOrder: 'v2/payCenter/onlineOrder',
        reSelectProduct: 'v2/payCenter/reSelectProduct', // 更改产品信息
        getAuthInfo: 'v2/payCenter/getAuth', // 获取授权信息
        toAuthEmployee: 'v2/payCenter/getAuth', // 授权或者解除授权
        getAuthMembers: 'v2/payCenter/authDetail', // 获取授权人员信息
        getOrderList: 'v2/mxOrder/mxOrderList', // 获取订单列表
        orderDetail: 'v2/mxOrder/mxOrder', // 订单明细
        createOrder: 'v2/mxOrder/mxOrder', // 创建订单
        offlinePay: 'v2/payCenter/offlinepay', // 线下开通
        mxOrder_mxOrder: 'v2/mxOrder/mxOrder', // 接口名称: 修改订单

        // 费用中心--java
        am_userInfo: 'v2/am/userInfo', // java获取账户信息
        pay_ac_info: 'v2/payCenter/acAccount', // 获取账户信息
        consume_list: 'v2/accountManager/consume', // 消费记录
        recharge_list: 'v2/accountManager/recharge', // 充值记录
        invoice_list: 'v2/accountManager/invoiceList', // 发票记录
        invoice_detail: 'v2/accountManager/invoice', // 发票明细
        invoice_setting_list: 'v2/accountManager/invoiceSettingList', // 发票记录列表
        invoice_setting_modify: 'v2/accountManager/invoiceSetting', // 发票设置修改
        invoice_setting_add: 'v2/accountManager/invoiceSetting', // 发票设置新增
        invoice_setting_delete: 'v2/accountManager/invoiceSetting', // 发票设置删除
        invoice_add: 'v2/accountManager/invoice', // 发票新增
        // 财务模块
        consume_list_all: 'v2/accountManager/consume', // 所有公司消费记录
        recharge_list_all: 'v2/accountManager/recharge', // 所有公司充值记录
        refund: 'v2/accountManager/refund', // 退款
        refundList: 'v2/accountManager/refund', // 退款记录
        invoice_list_all: 'v2/accountManager/invoiceList', // 所有公司发票记录
        invoice_rechargeList: 'v2/accountManager/recharge', // 一笔发票，查询其中对应的充值记录列表
        saveExpress: 'v2/accountManager/express', // 邮寄
        recharge_offline: 'v2/accountManager/recharge', // 线下充值
        // 钉钉
        dingtalk_relationship_check: 'v2/dingtalk/relationship/check',
        dingtalk_licenseCode_add: 'v2/dingtalk/licenseCode/add',

        // java 暂时注释，等后面java接口全部调完，再使用
        setting_mis_scuser: 'v2/mis/scAccount', // 获取SC用户信息
        setting_domain_list: 'v2/am/domainList', // 获取模板信息
        setting_domain_add: 'v2/am/domain', // 新建域名
        setting_domain_update: 'v2/am/domain', // 修改域名
        setting_domain_configure: 'v2/am/domainList', // 配置域名
        setting_send_list: 'v2/am/send', // send列表
        setting_reply_list: 'v2/am/reply', // reply列表
        setting_send_add: 'v2/am/send', // send新增
        setting_reply_add: 'v2/am/reply', // reply新增
        setting_send_delete: 'v2/am/send', // send删除
        setting_reply_delete: 'v2/am/reply', // reply删除
        template_update: 'v2/am/template', // 修改模板信息
        template_list: 'v2/am/template', // 获取模板信息
        template_delete: 'v2/am/template', // 删除模板
        tmplClone_Add: 'v2/am/tmplClone', // 模板克隆
        // cyy***
        template_add: 'v2/am/template', // 添加模板
        template_one: 'v2/am/template', // 获取单个模板
        addrBook_Add: 'v2/am/addrBook', // 添加地址簿
        addrBook_Delete: 'v2/am/addrBook', // 删除地址簿
        addrBook_Edit: 'v2/am/addrBook', // 删除地址簿
        addrBook_Get: 'v2/am/addrBook', // 地址簿列表
        addrMember_Get: 'v2/am/addrMember', // 获取地址簿成员信息
        addrMember_Add: 'v2/am/addrMember', // 手动输入新增成员
        addrMember_Import: 'Mails/home/addrImport', // 导入成员
        addrMember_Edit: 'v2/am/addrMember', //  修改地址簿成员
        addrMember_Delete: 'v2/am/addrMember', // 删除地址簿成员
        domainVerify_Get: 'v2/am/domainVerify', // 验证记录信息获取
        domainVerify_Put: 'v2/am/domainVerify', // 手动触发验证
        domainVerify_Export: 'v2/am/domainInfoExport', // 导出域名配置
        tmplContent_Get: 'v2/am/tmplContent', // 写邮件获取开发信内容
        internalImport: 'v2/mails/importV2', // 内部导入邮件
        //    : '' // 投递回应生成地址簿

        // 发送设置
        domainManage_Get: 'v2/am/domainManage', //   获取域名列表
        domainManage_Add: 'v2/am/domainManage', // 添加域名
        domainManage_Edit: 'v2/am/domainManage', // 修改域名
        // 收-发件人
        sendAndReply_Get: 'v2/am/sendAndReply', // 获取发件人/回复列表
        sendAndReply_Add: 'v2/am/sendAndReply', // 添加回复/发件人
        sendAndReply_Delete: 'v2/am/sendAndReply', // 删除发件人/回复人
        report_Get: 'v2/am/report', // 统计报表
        openAndClick_Get: 'v2/am/openAndClick', // 点击/打开发送表现获取
        reportExport_Get: 'v2/am/reportExport', // 报告总览 报表导出

        // 营销任务
        task_Get: 'v2/am/task', // 获取营销任务列表详情
        task_Add: 'v2/am/task', // 新建营销任务
        task_Delete: 'v2/am/task', // 营销任务删除
        addrGenerate_Add: 'v2/am/addrGenerate', // 投递回应生成地址簿

        eventDetails_Get: 'v2/am/eventDetails', // 获取各个事件地址详情接口
        statistics_Get: 'v2/am/statistics', // 人员发送统计
        payCenter_onlinepay: 'v2/payCenter/onlinepay', // 充值

        // java 未调完前，先使用原来地址
        // setting_mis_scuser: 'am/api/v1/setting/mis/scuser', // 获取SC用户信息
        // setting_domain_list: 'am/api/v1/setting/domain/list', // 获取域名信息
        // setting_domain_add: 'am/api/v1/setting/domain/add', // 新建域名
        // setting_domain_update: 'am/api/v1/setting/domain/update', // 修改域名
        // setting_domain_configure: 'am/api/v1/setting/domain/configure', // 配置域名
        // setting_send_list: 'am/api/v1/setting/send/list', // send列表
        // setting_reply_list: 'am/api/v1/setting/reply/list', // reply列表
        // setting_send_add: 'am/api/v1/setting/send/add', // send新增
        // setting_reply_add: 'am/api/v1/setting/reply/add', // reply新增
        // setting_send_delete: 'am/api/v1/setting/send/delete', // send删除
        // setting_reply_delete: 'am/api/v1/setting/reply/delete', // reply删除
        // template_update: 'am/api/v1/template/update', // 修改模板信息
        // template_list: 'am/api/v1/template/list', // 获取模板信息
        // template_delete: 'am/api/v1/template/delete', // 删除模板
        // template_add: 'am/api/v1/template/add', // 新增模板
        // template_one: 'am/api/v1/template/one', // 获取单个模板
        /* 自动化策略 */
        autoStrategy_strategyLib: 'v2/autoStrategy/strategyLib', // 策略库基础数据加载接口
        autoStrategy_strategy: 'v2/autoStrategy/strategy', // 策略列表数据查询
        autoStrategy_actions: 'v2/autoStrategy/actions', // 新增邮件通知
        autoStrategy_manualExecAct: 'v2/autoStrategy/manualExecAct', // 手动执行动作接口
        autoStrategy_actionListPick: 'v2/autoStrategy/actionListPick', // 手动执行选取动作列表数据接口
        autoStrategy_controlTypeV2: 'v2/autoStrategy/controlTypeV2', // am开发信变量字段下拉2
        autoStrategy_validityCheck: 'v2/autoStrategy/validityCheck',
        autoStrategy_executeRecord: 'v2/autoStrategy/executeRecord', // 自动化策略提示弹框操作
        /* 商品 */
        document_product_category: 'v2/document/product/category', // 商品大类查询
        product_catgAttrSet: 'v2/product/catgAttrSet', // 新增描述字段
        document_product_fieldList_get: 'v2/document/product/fieldList/get', // 接口名称: 获取字段
        document_product_fieldList_add: 'v2/document/product/fieldList/add', // 接口名称: 新增字段
        document_product_fieldList_put: 'v2/document/product/fieldList/put', // 接口名称: 修改字段
        document_product_group: 'v2/document/product/group', // 商品目录的新增、删除、查询、操作
        document_product_fieldShow: 'v2/document/product/fieldShow', // 获取商品业务字段展示
        document_product: 'v2/document/product', // 获取商品列表
        document_product_productAnalysis_get: 'v2/document/product/productAnalysis/get', // 商品分析获取数据
        document_product_companyCategory: 'v2/document/product/companyCategory', // 企业大类启用
        document_product_importExport: 'v2/document/product/importExport', // 商品导入
        document_product_attr: 'v2/document/product/attr', // 描述字段
        document_product_attr_sysBox: 'v2/document/product/attr/sysBox', // 描述字段
        product_attrDictItem: 'v2/product/attrDictItem', // 接口名称: 二级类目的列表/详情
        /* 发现 */
        find_search: 'v2/find/findSearch',
        find_socialInfo: 'v2/find/socialInfo',
        find_detailed: 'v2/find/findDetailed',
        find_socialAccount: 'v2/find/socialAccount', // 社交账号
        find_socialRelease: 'v2/find/socialRelease',
        find_socialReleaseList: 'v2/find/socialReleaseList',
        find_socialPrivateLetter: 'v2/find/socialPrivateLetter',
        find_deep: 'v2/find/findDeep', // 继续深挖获取邮箱
        find_corpration: 'v2/find/corpration', // 广交会
        find_inquiryData: 'v2/find/inquiryData', // 寻盘数据
        find_inquiryKeywords: 'v2/find/inquiryKeywords', // 询盘关键字
        find_attention: 'v2/find/Attention',
        find_customsCorpration: 'v2/find/customsCorpration',
        find_customsTrading: 'v2/find/customsTrading', // 采购 ，供应趋势
        find_customsCommerce: 'v2/find/customsCommerce', // 采购，供应  数据
        find_customsCompany: 'v2/find/customsCompany', // 获取关联企业
        find_customsAttentionDeep: 'v2/find/customsAttentionDeep', // 海关数据关注深挖接口
        find_customsCust: 'v2/find/customsCust', // 客户透视中关联企业修改
        find_customsCheck: 'v2/find/customsCheck', // 检查企业是否被关注或被深挖
        find_findDeepCustoms: 'v2/find/findDeepCustoms', // 深挖数据绑定海关数据接口
        /* template field */
        controlType: 'v2/controlType', // am开发信变量字段下拉
        am_variables: 'v2/am/variables', // 接口名称: am开发信变量

        tk_trackLogs: 'v2/tk/trackLogs', // 接口名称: 行为跟踪
        tk_behaviorList: 'v2/tk/behaviorList', // 接口名称: 客户详情获取客户行为
        notHaveAppList: 'v2/notHaveAppList', // 接口名称: 获取某公司没有的应用列表
        templateMarket: 'v2/templateMarket', // 接口名称: 模板获取
        bulkDeliver_Post: 'v2/mails/bulkDeliver', // 触发邮件普通发送
        marketingRecord_Get: 'v2/am/marketingRecord', // 获取营销记录
        misAccount: 'v2/am/misAccount', // 绑定mis账号

        /* landingPage */
        landingPage: 'v2/landingPage', // 获取落地页
        landingPageDocument: 'v2/landingPageDocument', // 外链落地页代码返回

        imgManage: 'v2/imgManage', // 接口名称: 图片管理
        mails_contAttachments: 'v2/mails/contAttachments', // 接口名称: 获取附件接口 待扩展
        activity: 'v2/activity', // 接口名称:
        priceCount: 'v2/priceCount', // 接口名称:
        reportManage: 'v2/reportManage', // 打印报表
        manageFlag: 'v2/manageFlag', // 接口名称: 权限校验
        companyOrder: 'v2/companyOrder', // 接口名称: 公司内部订单（限老板/管理员角色使用）
        payCenter_onlineOrder: 'v2/payCenter/onlineOrder', // 接口名称: 公司内部订单（限老板/管理员角色使用）
        saleOrder: 'v2/saleOrder', // 接口名称: 订单审核
        offCost: 'v2/offCost', // 接口名称: 优惠金额体现

        // 报价
        document_searchListFilter_post: 'v2/document/searchListFilter/post', // 新增快速过滤接口
        document_searchListFilter_list: 'v2/document/searchListFilter/list', // 查询快速过滤列表
        document_searchListFilter_detail: 'v2/document/searchListFilter/detail', // 查询指定快速过滤条件
        document_searchListFilter_delete: 'v2/document/searchListFilter/delete', // 删除快速搜索过滤
        document_quotation_get: 'v2/document/quotation/get', // 获取详情
        document_quotation_post: 'v2/document/quotation/post', // 新增
        document_quotation_put: 'v2/document/quotation/put', // 编辑
        document_quotation_delete: 'v2/document/quotation/delete', // 彻底删除
        document_quotation_bulkDelete: 'v2/document/quotation/bulkDelete', // 批量彻底删除
        document_documentary_list: 'v2/document/documentary/list', // 查询跟单列表信息接口
        document_documentary_put: 'v2/document/documentary/put', // 手动提交跟单状态信息
        document_documentaryNode_post: 'v2/document/documentaryNode/post', // 新增节点操作
        document_documentaryNode_put: 'v2/document/documentaryNode/put', // 修改节点操作
        document_documentaryNode_get: 'v2/document/documentaryNode/get', // 查询节点信息
        document_documentaryNode_allList: 'v2/document/documentaryNode/allList', // 查询所有跟单环节跟单信息列表
        document_documentaryNode_taskRecord: 'v2/document/documentaryNode/taskRecord', // 核销任务操作录入接口
        document_documentaryNode_receiptRecord: 'v2/document/documentaryNode/receiptRecord', // 金额节点录入
        document_documentaryNode_receiptRecordList: 'v2/document/documentaryNode/receiptRecordList', // 金额列表录入
        document_documentaryNode_receiptList: 'v2/document/documentaryNode/receiptList', // 查询收款记录列表
        document_order_receipt_post: 'v2/document/order/receipt/post', // 新增收款记录接口
        document_order_receipt_put: 'v2/document/order/receipt/put', // 修改收款记录接口
        document_order_receipt_delete: 'v2/document/order/receipt/delete', // 删除收款记录接口
        document_order_receipt_list: 'v2/document/order/receipt/list', // 查询收款记录列表
        document_documentaryInfo_put: 'v2/document/documentaryInfo/put', // 跟单单独修改接口
        document_documentary_followDetail: 'v2/document/documentary/followDetail', // 查询跟单信息
        document_documentary_normalPut: 'v2/document/documentary/normalPut', // 跟单信息修改接口
        document_documentary_manualPut: 'v2/document/documentary/manualPut', // 手动提交跟单状态信息
        document_documentaryTiming_taskTiming: 'v2/document/documentaryTiming/taskTiming', // 新建核销任务提醒
        document_documentaryTiming_receiptTiming: 'v2/document/documentaryTiming/receiptTiming', // 新建核销金额任务提醒
        document_documentaryTiming_get: 'v2/document/documentaryTiming/get', // 新建核销金额任务提醒
        orderTemplate: 'v2/orderTemplate', //  订单跟单模板列表
        orderNode: 'v2/orderNode', //  模板节点列表
        rateManage: 'v2/rateManage/curCode', // 货币列表
        putRateManage: 'v2/rateManage/put', // 汇率修改
        // 市场活动区域设置
        activityArea: 'v2/activityArea', //  区域列表
        allPackages: 'v2/allPackages' // 全部套餐
    },
    mx: { // mx运维管理模块
        online: 'mx/online', // 在线人数
        count: 'mx/count', // 开通企业、平台用户、本月活跃企业、用户数量
        online_count: 'mx/online/count', // 在线趋势图
        register_count: 'mx/register/count', // 新增趋势图
        product_count: 'mx/product/count', // 产品使用情况
        enterprise_list: 'mx/enterprise/list', // 公司列表
        service_list: 'mx/service/list', // 获取服务人员列表
        enterprise_list: 'mx/enterprise/list', // 分配服务人员
        enterprise_detail: 'mx/enterprise/detail', // 公司详情页--使用产品、剩余金额、使用日期、人数、云空间
        enterprise_online: 'mx/enterprise/online', // 公司在线人数
        operation_count: 'mx/operation/count', // 操作统计
        enterprise_operation: 'mx/enterprise/operation', // 公司操作统计
        enterprise_line_operation: 'mx/enterprise/line/operation', // 公司操作统计--曲线
        enterprise_line_count: 'mx/enterprise/line/count' // 公司在线趋势
    },
    // 用处：代理.net后端api n1版本接口
    n1: {
        // authOrder: 'n1/api/v1/payCenter/mxalipay/order', // 创建订单
        mxpay: 'n1/api/v1/payCenter/mxalipay/mxpay', // 支付
        // offlinePay: 'n1/api/v1/payCenter/mxalipay/offlinepay', // 线下开通
        // getAuthInfo: 'n1/api/v1/payCenter/mxalipay/getAuth', // 支付
        // toAuthEmployee: 'n1/api/v1/payCenter/mxalipay/AuthEmployee', // 授权或者解除授权
        // reSelectProduct: 'n1/api/v1/payCenter/mxalipay/reSelectProduct', // 更改产品信息
        // getAuthMembers: 'n1/api/v1/payCenter/mxalipay/getAuthMembers', // 获取授权信息
        // 后台开通
        // getOrderList: 'n1/api/v1/MXOrder/getMxOrderList', // 获取订单列表
        // createOrder: 'n1/api/v1/MXOrder/createOrder', // 创建订单
        uploadImage: 'n1/api/v1/MXOrder/uploadImg' // 上传图片
        // orderDetail: 'n1/api/v1/MXOrder/getMxOrder', // 订单明细
        // getOrderByKey: 'n1/api/v1/MXOrder/getOrderByKey' // 根据authkey获取offlineno

    },
    // 用处：代理am后端api
    am: {},
    // amjava: {
    //     pay_ac_info: 'v2/pay/acAccount'
    // },
    gl: { // 费用中心
        payCenter_alipay_call: 'gl/api/v1/payCenter/alipay/call' // 充值
        // consume_list: 'gl/api/v1/accountManager/consume/list', // 消费记录
        // recharge_list: 'gl/api/v1/accountManager/recharge/list', // 充值记录
        // invoice_list: 'gl/api/v1/accountManager/invoice/list', // 发票记录
        // invoice_setting_add: 'gl/api/v1/accountManager/invoiceSetting/add', // 发票记录
        // invoice_setting_list: 'gl/api/v1/accountManager/invoiceSetting/list', // 发票记录列表
        // invoice_setting_delete: 'gl/api/v1/accountManager/invoiceSetting/delete', // 发票设置删除
        // invoice_setting_modify: 'gl/api/v1/accountManager/invoiceSetting/modify', // 发票设置修改
        // invoice_add: 'gl/api/v1/accountManager/invoice/add', // 发票新增
        // 财务模块
        // consume_list_all: 'gl/api/v1/accountManager/consume/listAll', // 所有公司消费记录
        // recharge_list_all: 'gl/api/v1/accountManager/recharge/listAll', // 所有公司充值记录
        // recharge_offline: 'gl/api/v1/accountManager/recharge/offline' // 线下充值
        // invoice_list_all: 'gl/api/v1/accountManager/invoice/listAll', // 所有公司发票记录
        // saveExpress: 'gl/api/v1/accountManager/invoice/saveExpress' // 邮寄
        // refundList: 'gl/api/v1/accountManager/recharge/refundList', // 退款记录
        // invoice_detail: 'gl/api/v1/accountManager/invoice/detail', // 发票记录
        // invoice_rechargeList: 'gl/api/v1/accountManager/invoice/rechargeList' // 发票中的充值记录
        // refund: 'gl/api/v1/accountManager/recharge/refund' // 退款
    },
    // langdingPage
    landingPage: {
        landingPageDocument: 'landingPage/landingPageDocument'
    },
    v1: {
        reportPackage: 'v1/report/package', // 自定义报表
        reportList: 'v1/report/list', // 报表列表
        mainModule: 'v1/report/main/module', // 获取主数据
        relyModule: 'v1/report/rely/module', // 获取依赖数据
        reportField: 'v1/report/field', //   获取模块字段
        reportDept: 'v1/report/dept/emp', //   获取部门和人员
        filterField: 'v1/report/filter/field', //   获取筛选字段
        filterValue: 'v1/report/filter/value', //   筛选字段返回值
        createReport: 'v1/report', //   创建报表
        reportData: 'v1/report/data', //   运行报表
        reportUnify: 'v1/report/unify', //  报表统一数据
        reportCheck: 'v1/report/check', //   检查报表名称是否重名
        reportCollect: 'v1/report/collect', //   收藏报表
        reportChart: 'v1/report/chart/data', //   图表数据
        reportPage1: 'v1/report/page1', //   配置《1》页回显
        reportPage2: 'v1/report/page2', //   配置《2》页回显
        reportPage3: 'v1/report/page3', //   配置《3》页回显
        reportPage4: 'v1/report/page4', //   配置《4》页回显
        qFilterInfo: 'v1/report/qFilter/info', //   快速筛选条件查询
        batchCollect: 'v1/report/batch/collect', //   批量收藏报表
        fuzzySearch: 'v1/report/fuzzy/search', //   模糊查询
        reportExport: 'v1/report/export', //   导出报表
        simpleFilter: 'v1/report/simple/filter', //   普通筛选字段
        subscriber: 'v1/report/subscriber', //   获取可订阅报表的人员
        dustbin: 'v1/report/dustbin', // 查询已删除的报表
        subscribe: 'v1/report/subscribe' // 创建订阅
    }
}
