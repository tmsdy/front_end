import React from 'react'
import { Input,Button,List } from 'antd'
/*
无状态组件：
  可以替换只有render函数的普通组件。只是个函数性能高，一般用在UI组件里
  普通组件，是个类有生命周期等要执行性能没无状态组件好
*/
 const TodoListUI = (props) => { 
  return (
    <div style={{marginTop:10,marginLeft:10}}>
      <Input 
        id="insertArea"
        style={{width:300,marginRight:10}}
        placeholder="做点什么吧"
        value={props.inputValue}
        onChange={props.inputChange}
      />
      <Button type="primary" onClick={props.btnClick}>提交</Button>
      <ul>
        {props.getTodoItem()}
      </ul>
      <List 
        style={{marginTop:10,width:400}}
        bordered
        dataSource={props.list}
        renderItem={item=>(<List.Item>{item.content}</List.Item>)}
        />
    </div>
  )
}
export default TodoListUI

