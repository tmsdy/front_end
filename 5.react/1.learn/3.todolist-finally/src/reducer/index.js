import { combineReducers } from "redux"
import todo from "./todoReducer"
import count from './countReducer'

export default combineReducers({
    todo,
    count
})
