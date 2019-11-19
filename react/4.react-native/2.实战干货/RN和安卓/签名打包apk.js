/*

1.生成android签名证书
https://blog.csdn.net/qq_24349695/article/details/78540982

2.设置gradle变量，放到gradle.properties
MYAPP_RELEASE_KEY_ALIAS=android_keystore //对应签名证书里面的配置,证书文件名
MYAPP_RELEASE_KEY_PASSWORD=123456
MYAPP_RELEASE_STORE_PASSWORD=123456
MYAPP_RELEASE_STORE_FILE=andriod_keystore.jks
android.useDeprecateNdk=true

3.在app/build.gradle里面添加签名配置
signingConfigs {
        release {
            storeFile file(MYAPP_RELEASE_STORE_FILE)
            storePassword MYAPP_RELEASE_STORE_PASSWORD
            keyAlias MYAPP_RELEASE_KEY_ALIAS
            keyPassword MYAPP_RELEASE_KEY_PASSWORD
        }
    }
     buildTypes {
        release {
            ...
            signingConfig signingConfigs.release
        }
    }

4.执行打包命令： ./gradlew assembleRelease
生成jsbundle包并合并到生成的apk中
遇到报错：Execution failed for task ':app:bundleReleaseJsAndAssets'.
解决：https://stackoverflow.com/questions/49513047/react-native-assemblerelease-fails-for-task-appbundlereleasejsandassets
执行打包命令得用这个：./gradlew assembleRelease -x bundleReleaseJsAndAssets

5.RN要求1.8java版本：https://blog.csdn.net/qq_15988951/article/details/83930574
java jsk安装路径：/Library/Java/JavaVirtualMachines/jdk-9.jdk/Contents/Home
把高版本的删了就行

*/