const defaultState = {
  count: 10,
  inputValue: '123',
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
  if(action.type==='change_input_value'){
    newState.inputValue = action.value
  }
  if(action.type==='add_todo_item'){
    newState.count = action.count
    newState.list = [...newState.list, action.item]
  }
  return newState
}