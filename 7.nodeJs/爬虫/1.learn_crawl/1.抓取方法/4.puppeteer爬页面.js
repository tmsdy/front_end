let puppeteer = require('puppeteer');
let url = 'https://juejin.im/tag/%E5%89%8D%E7%AB%AF';
(async function () {
  const browser = await puppeteer.launch({ headless: false }) // headless配置可以看到它是怎么运作浏览器的
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' }); // 等network空闲没在加载的时候
  //获取指定节点的属性：一个$代表document.querySelector()  两个$$代表document.querySelectorAll('a.title')
  const titles = await page.$$eval('a.title', elements => {
    console.log(elements)
    return elements.map(item => item.innerText);
  });
  console.log(titles);
  // browser.close();
})();