import {CHANGE_INPUT_VALUE,ADD_TODO_ITEM,DELETE_TODO_ITEM} from './actionTypes'

const defaultState = {
  count: 10,
  inputValue: '',
  list: [
    {
      id: 3,
      content: "默认的"
    }
  ]
}
// reducer可以接收state决不能修改state
export default (state=defaultState,action)=>{
  console.log(state,action)
  let newState = JSON.parse(JSON.stringify(state)) || state
  switch(action.type){
    case CHANGE_INPUT_VALUE : 
      newState.inputValue = action.value ;break ;
    case ADD_TODO_ITEM :
      newState.count = action.count
      newState.list = [...newState.list, action.item]
      newState.inputValue = '';break;
    case DELETE_TODO_ITEM :
      newState.list = newState.list.filter(item=>item.id!==action.id);break;
    default: ;
  }
  return newState
}