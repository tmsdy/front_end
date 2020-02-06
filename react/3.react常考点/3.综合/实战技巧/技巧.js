/*
* 1.react中用dangerouslySetInnerHTML实现innerHTML效果
 <div dangerouslySetInnerHTML={{ __html: "<span>这是渲染的 HTML 内容</span>" }}></div>

* 2.路径别名配置：
resolve:{
    alias:{
        '@': path.join(__dirname, '../src')
    }
}


*/