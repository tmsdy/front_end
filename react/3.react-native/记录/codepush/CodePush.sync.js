/*

CodePush.sync(options: Object, syncStatusChangeCallback: function(syncStatus: Number), downloadProgressCallback: function(progress: DownloadProgress)): Promise<Number>;
通过调用该方法CodePush会帮我们自动完成检查更新，下载，安装等一系列操作。除非我们需要自定义UI表现，不然直接用这个方法就可以了。

sync方法，提供了如下属性以允许你定制sync方法的默认行为
    deploymentKey （String）： 部署key，指定你要查询更新的部署秘钥，默认情况下该值来自于Info.plist(Ios)和MianActivity.java(Android)文件，你可以通过设置该属性来动态查询不同部署key下的更新。
    installMode (codePush.InstallMode)： 安装模式，用在向CodePush推送更新时没有设置强制更新(mandatory为true)的情况下，默认codePush.InstallMode.ON_NEXT_RESTART即下一次启动的时候安装。
    mandatoryInstallMode (codePush.InstallMode):强制更新,默认codePush.InstallMode.IMMEDIATE。
    minimumBackgroundDuration (Number):该属性用于指定app处于后台多少秒才进行重启已完成更新。默认为0。该属性只在installMode为InstallMode.ON_NEXT_RESUME情况下有效。
    updateDialog (UpdateDialogOptions) :可选的，更新的对话框，默认是null,包含以下属性
        appendReleaseDescription (Boolean) - 是否显示更新description，默认false
        descriptionPrefix (String) - 更新说明的前缀。 默认是” Description: “
        mandatoryContinueButtonLabel (String) - 强制更新的按钮文字. 默认 to “Continue”.
        mandatoryUpdateMessage (String) - 强制更新时，更新通知. Defaults to “An update is available that must be installed.”.
        optionalIgnoreButtonLabel (String) - 非强制更新时，取消按钮文字. Defaults to “Ignore”.
        optionalInstallButtonLabel (String) - 非强制更新时，确认文字. Defaults to “Install”.
        optionalUpdateMessage (String) - 非强制更新时，更新通知. Defaults to “An update is available. Would you like to install it?”.
        title (String) - 要显示的更新通知的标题. Defaults to “Update available”.

*/