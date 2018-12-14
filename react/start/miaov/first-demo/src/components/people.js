// 创建组件 引入react -> 创建一个组建类，继承基组件类 -> 类里面写个render返回jsx -> 导出
import React from 'react' ;

class People extends React.Component {
    

    render(){
        
        console.log(this.props) ; //this是当前组件创建的实例对象People,this.props接收传入的参数
        return <div>
                    <div>班级：{this.props.class}</div>
                   { 
                    this.props.list.length ? <ul>
                            {this.props.list.map((item,index)=>{
                                    return <li key={item.id}>编号：{item.id+1}，姓名：{item.name}</li>
                                })}
                        </ul> : null
                   }
                </div>      
    }

}
People.defaultProps = { //在组件中设置默认的props,本质上就是给类设置静态属性
    class : '一班',
    list : []
}

export default People ;