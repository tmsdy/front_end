import React from 'react' ;
import People from './components/people' ;
import Tab from './components/tab' ;


let people1 = {class:'一班',list:[{name:"feifei111",id:0},{name:"fangfang111",id:1},{name:"xiaoxiao111",id:2}]} ;
let people2 = {class:'二班',list:[{name:"feifei222",id:0},{name:"fangfang222",id:1},{name:"xiaoxiao222",id:2}]} ;
let people3 = {}

class  App extends React.Component{
    constructor(props){ //只要用了constructor就必须要用super
        super(props) ;
        this.state = {
            num : 1
        }
    }
    render(){
        return (   
        <div>
            <People {...people1} />
            <People class={people2.class} list={people2.list} />
            <People {...people3} />
            <Tab />
        </div>)
    }
}

export default App ;