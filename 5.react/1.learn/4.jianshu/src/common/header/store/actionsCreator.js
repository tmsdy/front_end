import {actionTypes}  from './index'

const searchFocus = () => {
  return {
    type: actionTypes.SEARCH_FOCUS
  }
}
const searchBlur = () => {
  return {
    type: actionTypes.SEARCH_BLUR
  }
}

export {
  searchFocus,
  searchBlur
}