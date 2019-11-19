/*

1.Task :app:mergeReleaseStagingResources FAILED

2.在app的gradle配置文件中，android下加上下面一段代码：
aaptOptions {
    cruncherEnabled = false //禁止AS对png图片进行校验
}
最后是吧对应报错目标的png图片删了解决的。




*/