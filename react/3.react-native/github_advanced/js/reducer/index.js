import {combineReducers} from 'redux'
import theme from './theme'
import {rootCom, RootNavigator} from '../navigator/AppNavigators';

//1.指定默认state
const navState = RootNavigator.router.getStateForAction(RootNavigator.router.getActionForPathAndParams(rootCom));

const navReducer = (state = navState, action) => {
    const nextState = RootNavigator.router.getStateForAction(action, state);
    // 如果`nextState`为null或未定义，只需返回原始`state`
    return nextState || state;
};

const index = combineReducers({ //合并reducer
    nav: navReducer,
    theme: theme
});

export default index;