import { ADD_COUNT } from '../action/actionTypes'

const defaultState = {
    count: 0
}

export default (state = defaultState, action) => {
    let newState = JSON.parse(JSON.stringify(state)) || state
    switch (action.type) {
        case ADD_COUNT: newState.count += action.num; break;
        default: break;
    }
    return newState
}