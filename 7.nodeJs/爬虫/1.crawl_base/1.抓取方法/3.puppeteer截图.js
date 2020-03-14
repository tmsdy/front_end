/*
puppeteer：
  1.谷歌开发，适合爬复杂的页面
  2.可以通过api控制浏览器的行为，比如点击、跳转、刷新、在控制台执行js脚本等等
  3.通过这个工具可以用来写爬虫、自动签到、网页截图、生成pdf、自动化测试等
*/
let puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();  //1.打开一个无界面浏览器
  const page = await browser.newPage();     //2.打开一个空白页
  await page.goto('http://www.baidu.com');   //3.在地址栏中输入百度的地址
  await page.screenshot({ path: 'baidu.png' });//  4. 把当前的页面进行截图,保存到baidu.png文件里
  await browser.close();//关闭浏览器
})();