import Types from '../../action/types'

const defaultState = {
  theme: 'skyblue'
}
export default function onAction(state = defaultState, action) {

  switch (action.type) {
    case Types.THEME_CHANGE:
      return {
        ...state,
        theme: action.theme
      }; break;
    default: return state
    
  }

}