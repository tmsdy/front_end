/*

* 1.接入登陆验证组件包：dz-sso-extension-dk，用的时候有个iframe的权限报错
需要在manifest.dev.json中的content_security_policy加个frame-src https://sso.duozhun.cc;

* 2.像webRequest、storage、notifications这种chrome上的API用的话一定要先permissions中先写好，还有检测某个网址才加载inject.js需要在permissions中配置,记得先run build再run dev


*/