import React, { Component,Fragment } from 'react';
// import './TodoList.scss'

class TodoList extends Component {

  constructor(props){
    super(props)
    this.state = {
      inputValue: '',
      list: []
    }
  }

  inputChange(e){
    this.setState({
      inputValue: e.target.value
    })
  }
  btnClick(){
    let {inputValue,list} = this.state
    if(inputValue){
      this.setState({
        list: [...list,{content:inputValue}],
        inputValue: ''
      })
    }
  }
  deleteItem(i){
    let {list} = this.state
    list.splice(i,1)
    this.setState({
      list
    })
  }

  render() {
    return ( //加括号可以多行写
      <Fragment>
        <input 
          value={this.state.inputValue}
          onChange={this.inputChange.bind(this)}
        />
        <button onClick={this.btnClick.bind(this)}>提交</button>
        <ul>
          {
            this.state.list.map((item,i)=>{
              return (
                <li key={i}>{item.content}<span className="item_delete" onClick={this.deleteItem.bind(this,i)}>删除</span></li>
              )
            })
          }
        </ul>
      </Fragment>
    );
  }
}

export default TodoList;
