import React, { Component } from 'react';
import './App.css';
import Person from './person/person' ; // './'必须有，与像react这些系统提供好的库进行区分

class App extends Component {
  state = {
    my_off:false ,
    persons:[
      {name:"feifei",count:50},
      {name:"rekey",count:5},
      {name:"fangfang",count:150}
    ],
    showPersons:false
  };

  change_data = (newName)=>{
    this.setState({
      persons:[
        {name:newName,count:50},
        {name:"rekey",count:5123},
        {name:"fangfang",count:150}
      ],
    })
  }
  change_input = (event)=>{
    this.setState({
      persons:[
        {name:event.target.value,count:50},
        {name:"rekey",count:5},
        {name:"fangfang",count:150}
      ]
    })
  }

  render() {
    return (
      <div className="App">
        <h1>Hello</h1>
        <div className="my-btn" onClick={this.change_data.bind(this,"bbbb123")}>更改状态值</div>
        { this.state.showPersons ?
          <div>
            <Person 
              change_input={this.change_input}
              name={this.state.persons[0].name} 
              count={this.state.persons[0].count} />
            <Person 
              myclick={this.change_data.bind(this,"feifei111")}
              name={this.state.persons[1].name} 
              count={this.state.persons[1].count} />
            <Person 
              name={this.state.persons[2].name} 
              count={this.state.persons[2].count} />
            <Person name="chaochao" count="20">哈哈哈哈或</Person>
          </div> : null
        }
        
      </div>
    );
  }

}

export default App;
