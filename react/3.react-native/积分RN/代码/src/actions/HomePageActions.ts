/**
 * 已完成未领取任务列表
 */
import ReduxUtil from '../common/ReduxUtil';
import {isCompleted, isDone} from '../model/homePage/task'
import {fetchFlowerStatsBar} from '../model/homePage/index'
import {FlowerMageStatusBarInfo} from '../typings/apis/homePage'

export const SET_HOME_PAGE_TASK = 'SET_HOME_PAGE_TASK';
export const SET_HOME_PAGE_FLOWER = 'SET_HOME_PAGE_FLOWER';

// 设置任务列表
export const setHomePageTask = ReduxUtil.createSimpleAction(SET_HOME_PAGE_TASK, 'homePageTaskData');

// 设置花儿入口数据
export const setHomePageFlower = ReduxUtil.createSimpleAction(SET_HOME_PAGE_FLOWER, 'homePageFlower');


// 设置任务列表
export const setTaskDataInfo = (homePageTaskData) => {
  return (dispatch) => {
    const {taskList, deepList} = homePageTaskData;
    // 手动筛选出已完成未领取任务
    const completedList = taskList.concat(deepList).filter(task => {
      return isCompleted(task) && !isDone(task)
    })
    dispatch(setHomePageTask({homePageTaskData: {...homePageTaskData, completedList}}));
    return Promise.resolve();
  };
};

// 设置首页花儿数据
export const setFlowerStatsBar = () => {
  return (dispatch) => {
    fetchFlowerStatsBar().then((result = {}) => {
      const {channelCode, status, waterToday, hasLottery, daysWhenLottery} = result;
      dispatch(setHomePageFlower({homePageFlower: {channelCode, status, waterToday, hasLottery, daysWhenLottery}}));
    })
  };
}
