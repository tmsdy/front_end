import React, { Component } from "react";
import {getUser} from '../api'

export default class User extends Component {
  state = {
    user: {

    }
  }
  componentDidMount(){
    
    getUser().then(res=>{ //这个请求有时候成功有时候失败
      console.log(res)
      if(res){
        this.setState({
          user: res.data.user
        })
      }
    })

    
  }
  render() {
    let {user} = this.state
    return <div>欢迎用户：{user.username}</div>
  }
}
