/*

* 1.标志字符: 类似这种用法 /re/g
  g : 全局搜索 记忆方式global
  i ：不区分大小写 记忆方式 ignore
  m ：多行搜索

  ^：表示以xxx开头 或者 非xxx

* 2.量词：出现的次数
  *：0到多次
  +：一到多次
  ?：表示量词是0或1个，也可以表示惰性模式
  {n}：出现n次 // {}都是贪婪的
  {n,}：出现n到多次
  {n,m}：出现n到m次（包前包后）

* 3.特殊元字符：单个或者组合在一起代表特殊的含义，大写代表非，如\S为非空格
  空格：\s
  数字：\d <=> [0,9]， \D <=> [^0-9]
  数字、大小写字母和下划线：\w <=> [0-9a-zA-Z_]， \W <=> [^0-9a-zA-Z_]

*/
