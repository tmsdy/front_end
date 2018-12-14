import React from 'react' ;


class News extends React.Component{

    constructor(props){
        super(props) ;
        this.state = {
            color : 'red' 
        }
    }

    change_color = ()=>{ //用箭头函数使this指向实例，否则this是undefined
        this.setState({
            color : 'green'
        })
    }

    render(){
        return (
            <div>
                <p style={{color:this.state.color}}>改变颜色吧</p>
                <button onClick={this.change_color}>改变颜色</button>
            </div>
        )
    }

}

export default News