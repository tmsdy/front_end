/*

1.新建module：file -> new -> new module -> android library

2.利用

继承ReactContextBaseJavaModule类
@Override
public String getName() {
    return "UMShareModule"; //这样RN这边可以NativeModules.UMShareModule拿到
}
@ReactMethod
public void share(...){ //这样RN就能用到这个方法了

}
原生给RN通信一是callback而是Promise


*/