# MockServer 使用方法

* 创建mock文件: yarn cmock <你的接口api>  # 如 `yarn cmock /apis/user/mage/stats`
  - openApi/task/execute 中转的接口使用task_code创建文件, 如:
    mock请求: openApi/task/execute?task_code=qipuFusionGetEntity
    执行: `yarn cmock qipuFusionGetEntity`
    
* 启动mock服务: `yarn mockserver / yarn mock`
