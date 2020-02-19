/*

* 1.样式引入方法
    1) import './App.css'
    2) style内联或者抽出来：
        const footerStyle = {
            width: '100%',
            backgroundColor: 'green',
            padding: '50px',
        }
        <div style={footerStyle}>
            <div style={{backgroundColor:'orange'}}></div>
        </div>

* 2.动态绑定 className
 <div className={flag?"active":"no-active"}>test</div>

* 3.

*/