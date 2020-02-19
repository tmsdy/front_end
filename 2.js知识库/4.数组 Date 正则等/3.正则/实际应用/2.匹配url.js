var parse_url = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
/* 匹配http: /(?:([A-Za-z]+):)/ 
  (?: )表示一个非捕获型分组：即在这个括号内的，但是不在其子括号内所匹配到的字符将不放入结果数组中
*/
let url = 'http://qiji123.kerlai.net:81/GoodsBasic/Operate/12678?q#simen'
url.replace(parse_url, ($0, $1, $2, $3, $4, $5, $6, $7) => {
    console.log(`
母亲：${$0}
scheme: ${$1}
slash:${$2}
host:${$3}
port:${$4}
path:${$5}
query:${$6}
hash:${$7}
  `)
})