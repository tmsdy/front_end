/*
参考：https://www.jianshu.com/p/f6ac6e3ee7a3
1.权限：在 Manifest 的 permissions 中声明 "storage"

2.两种储存区域：sync & local。
  sync储存的区域会根据用户当前在Chrome上登陆的Google账户自动同步数据，当无可用网络连接可用时，sync区域对数据的读写和local区域对数据的读写行为一致
chrome.storage.sync.set
chrome.storage.local.set

3.储存区域的五种方法：
get：取值 & set：设值 & remove(清除单一值) & clear(清除全部值)
getBytesInUse：获取一个数据或多个数据所占用的总空间，返回结果的单位是字节

4.

*/