/**
 * 脑洞打赏actions
 */
import ReduxUtil from '../common/ReduxUtil';

export const SET_UNRECEIVE_SCORE = 'SET_UNRECEIVE_SCORE';
export const USER_SELECT_PIC = 'USER_SELECT_PIC'


export const setUnreceiveScore = ReduxUtil.createSimpleAction(SET_UNRECEIVE_SCORE, 'unreceiveScore');
export const setUserSelectPic = ReduxUtil.createSimpleAction(USER_SELECT_PIC, 'selectImage');
