import { CHANGE_INPUT_VALUE, ADD_TODO_ITEM, DELETE_TODO_ITEM } from './actionTypes'

export const getInputChangeAction = (value) => ({
  type: CHANGE_INPUT_VALUE,
  value
})

export const getAddTodoItemAction = (inputValue, count) => ({
  type: ADD_TODO_ITEM,
  count: ++count,
  item: {
    id: count,
    content: inputValue
  }
})

export const getDeleteTodoItemAction = (id) => ({
  type: DELETE_TODO_ITEM,
  id
})