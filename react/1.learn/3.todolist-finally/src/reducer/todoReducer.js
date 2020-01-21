import { CHANGE_INPUT_VALUE, ADD_TODO_ITEM, DELETE_TODO_ITEM } from '../action/actionTypes'

const defaultState = {
    count: 10,
    inputValue: '',
    list: [
        {
            id: 0,
            content: "默认的item"
        }
    ]
}

export default (state = defaultState, action) => {
    let newState = JSON.parse(JSON.stringify(state)) || state
    switch (action.type) {
        case CHANGE_INPUT_VALUE:
            newState.inputValue = action.value; break;
        case ADD_TODO_ITEM:
            newState.count = action.count
            newState.list = [...newState.list, action.item]
            newState.inputValue = ''; break;
        case DELETE_TODO_ITEM:
            newState.list = newState.list.filter(item => item.id !== action.id); break;
        default: break;
    }
    return newState
}