import { CHANGE_INPUT_VALUE, ADD_TODO_ITEM, DELETE_TODO_ITEM } from './actionTypes'

const defaultState = {
    count: 10,
    inputValue: '',
    list: [
        {
            id: 0,
            content: "默认的 todo item"
        }
    ]
}
/*
1.reducer可以接收state决不能修改state
2.reducer必须得是纯函数：
  1)给定固定的输入，就一定会有固定的输出:
    有了state和action其实输出就已经确定了，如果里面有new Date()之类的就不是纯函数了，因为输出不再由state/action固定
  2)不会有任何副作用:
    比如去改state就是副作用，不要去改
*/
export default (state = defaultState, action) => { //这state是store原先的state
    console.log(state, action)
    let newState = JSON.parse(JSON.stringify(state)) || state
    switch (action.type) {
        case CHANGE_INPUT_VALUE:
            newState = { ...state, inputValue: action.value }
            break;
        case ADD_TODO_ITEM:
            newState = {
                ...state,
                count: action.count,
                list: [...newState.list, action.item],
                inputValue: ''
            };
            break;
        case DELETE_TODO_ITEM:
            newState = {
                ...state,
                list: newState.list.filter(item => item.id !== action.id)
            }; break;
        default: ;
    }
    return newState //把新的数据返回给store，store拿到新的数据自己更新自己的state
}