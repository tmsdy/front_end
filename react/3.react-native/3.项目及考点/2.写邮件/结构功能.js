/*

* 发件人
1.用户绑定的邮箱可能一个或多个，还有可能配置默认展示的邮箱

* 收件人、抄送、暗送
1.右边自动展开收缩抄送、暗送，如果展开状态但是抄送、暗送都是空的，再点其他功能区域会自动收缩抄送、暗送
2.都用的一个AutoInput
1）不同AutoInput聚焦时候设置不同的iputType标记 0 1 2来记录当前在哪个input上操作的
2）展示收件人：输入的时候获取值并请求后端拿到联想的列表，联想的列表根据不同AutoInput的ref计算的不同位置的定位显示。如果选中了则在当前AutoInput上面加一个收件人，如果没选一直在输入，会加失焦的时候邮箱检测，如果符合则加入，不符合则提醒。这样的话复制黏贴也支持了。
3）删除收件人：AutoInput值为空这时候按删除键，当前AutoInput选中的收件人列表最后一个会红色高亮，再点删除时候就会删除了。

* 附件
支持上传图片(单选多选)和文件
1.上传过程中加进度条效果
    * shouldComponentUpdate优化上传过程中整个组件的渲染，正在上传就不渲染了。
2.id自增给每个附件赋值key，因为可能在知识库传同样的附件，自身上的属性都一样key就相同了

* 文档和知识库选择和联系人选择及跳转
1.用RN的FlatList做下拉刷新上拉加载的列表
2.根据不同文件type显示不同iconfont图片
3.路由pop+路由监听+路由传参数设置清空参数做选择确认并跳转回写邮件并赋值：保证原始邮件状态正常

* 发送
1.立即发送、定时、延时，定时会用到时间选择器。






*/