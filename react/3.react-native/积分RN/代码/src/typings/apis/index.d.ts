/**
 * Created by liuzhimeng.
 * @date 2019/04/11
 * @description apis/index
 */

 // 任务接口body
export interface TaskParams {
  task_code: string;
  timestamp: number;
}
export interface TaskExtsParams {
  daojuProductList?: any;
  generalInfo?: any;
  [propName: string]: any;
}

export interface GetPunchLastParams {
  params: {
    userId?: UserId;
  };
  ext: object;
}

// 勋章排名
export interface MedalRank {
  data: {
    data: {
      total: number;
      your: number;
    };
  };
}

// 用户信息接口参数
export interface FetchUserInfoParams {
  needExpire?: number;
}
// 用户信息接口返回值
export interface GetUserInfo {
  expireTime: number;
  frozenScore: number;
  lastPeriodScore: number;
  level: number;
  nextLevel: number;
  nextLevelScore: number;
  todayScore: number;
  totalScore: number;
  typeCode: string;
  userId: number;
  verticalCode: string;
}
