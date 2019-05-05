import {filterExts} from "../../common/util"

/**
 * Created by liuzhimeng.
 * @date 2019-04-22
 * @description 任务列表配置
 */

// 递归比较compareList的子项数值是否大于等于limitList的子项数值
function getDoneStatus(limitList, compareList, initStatus = false) {
  let status = initStatus

  if(!limitList.length || !compareList.length) return status

  const limitValue = limitList.shift()
  const compareValue = compareList.shift()
  const value = limitValue <= 0 ? false : compareValue >= limitValue

  return value || getDoneStatus(limitList, compareList, status)
}

// 任务已完成且领取奖励
export function isDone(task) {
  if(task.limitTotal === 1) {
    // 一次性任务  总共完成次数 小于等于 总共领取次数
    return task.limitTotal <= task.getRewardTotalCount
  } else {
    const {
      processCount, processTotalCount,
      limitPerDay, limitTotal,
      getRewardDayCount, getRewardTotalCount,
    } = task

    const limitList = [limitPerDay, limitTotal]
    const countList = [processCount, processTotalCount]
    const rewardList = [getRewardDayCount, getRewardTotalCount]
    // 参与次数达到参与上限 是完成状态
    const participateStatus = getDoneStatus(limitList, countList)
    // 领取奖励次数达到参与次数 是完成状态
    const rewardStatus = getDoneStatus(countList, rewardList)

    // 所有任务，依次判断已完成次数是否大于每日、每周、每月任务数量限制及领取数量限制
    return participateStatus && rewardStatus

    // 每日性任务 每日限制次数 === 完成次数，并且 每日限制次数 <= 每日领取次数
    // return (limitPerDay <= processCount) && (limitPerDay === getRewardDayCount)
  }
}

// 任务已完成未领取奖励
export function isCompleted(task) {
  if(task.limitTotal === 1) {
    // 一次性任务  总共完成次数 大于 总共领取次数
    return task.processTotalCount && task.processTotalCount > task.getRewardTotalCount
  } else {
    // 每日性任务
    return (task.processCount && task.processCount > task.getRewardDayCount) || (task.status === 0)
  }
}

export function getDesc(task: any, {type, typeOptions, showDoubleCard}) {
  let desc = []
  if(type === 'flower') {
    const {propName} = typeOptions
    const {limitTotal} = task

    desc = [
      {id: 'id1', text: `可获得${propName}`},
      {id: 'id2', text: 'hl|x1'},
    ]
    if(limitTotal > 0 && limitTotal <= 100) {
      // @柯慧士 大于100次默认不显示
      desc = [].concat(desc, [
        {id: 'id1', text: '，仅限'},
        {id: 'id2', text: `hl|${limitTotal}`},
        {id: 'id3', text: '次'},
      ])
    }
  } else {
    const {limitPerDay, processCount, score, multiple} = task

    const scoreText = [{id: 'id1', text: `积分值+${score}`}]
    const doubleCard = showDoubleCard && !!multiple ? [{id: 'id2', text: 'tag|翻倍'}] : []
    const completeText = limitPerDay ? [{id: 'id3', text: `，完成${processCount}/${limitPerDay}`}] : []

    desc = scoreText.concat(doubleCard, completeText)
  }

  return desc
}

// 格式化任务列表
export function formatTaskList(list = [], {getTaskItemOptions, type, typeOptions, showDoubleCard}: any = {}) {
  return list.map((task: any) => {
    const {icon, channelName: title, exts = []} = task
    const extMaps = filterExts(exts)
    const iconName = extMaps.notes ? 'flower/icon-question' : ''

    // 自定义item配置，相同属性覆盖默认配置
    const taskOptions = getTaskItemOptions ? getTaskItemOptions(task) : {}

    return {
      task,
      extMaps,

      image: extMaps.taskicon || icon,
      title,
      iconName,
      tip: extMaps.notes,
      description: getDesc(task, {type, typeOptions, showDoubleCard}),
      isDrawedStatus: false,
      isDoneStatus: isDone(task),
      isCompletedStatus: !!(isCompleted(task)),
      buttonOptions: {},
      ...taskOptions,
    }
  })
}
