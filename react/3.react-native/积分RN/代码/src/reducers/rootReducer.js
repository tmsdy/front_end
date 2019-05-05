
import {combineReducers} from 'redux'
import changeAvatar from './changeAvatar'
import changeAvailable from './changeAvailableScore'
import scoreInfo from './scoreInfo'
import gardenDetail from './gardenDetail'
import answerItemDetail from './answerChanged'
import questionInfo from './questionInfo'
import homePage from './homePage'

const rootReducer = combineReducers({
  root: () => ({}),
  changeAvatar,
  changeAvailable,
  scoreInfo,
  gardenDetail,
  answerItemDetail,
  questionInfo,
  homePage
})

export default rootReducer
