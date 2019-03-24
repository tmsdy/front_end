import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import './tabs.less'

class Tabs extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      unFinishedTodoLength: 0,
      states: ['all', 'active', 'completed']
    };
  }
  componentDidMount() {
    this.setState({
      unFinishedTodoLength: this.props.todos.filter(todo => !todo.completed).length
    })
  }
  componentWillReceiveProps(nextProps) { //props变化走这里
    this.setState({
      unFinishedTodoLength: nextProps.todos.filter(todo => !todo.completed).length
    })
  }
  toggleFilter(state){
    this.props.onToggle(state)
  }
  render() {
    let { unFinishedTodoLength, states } = this.state
    let {filter} = this.props
    return (<View className='helper'>
      <Text className='left'>{unFinishedTodoLength} item left</Text>
      <Text className='tabs'>
        {
          states.map((state, index) => {
            return <Text key={index}
              className={'state ' + [filter === state ? 'actived' : '']}
              onClick={this.toggleFilter.bind(this,state)} >
              {state}
            </Text>
          })
        }
      </Text>
    </View>)
  }
}
export default Tabs;
