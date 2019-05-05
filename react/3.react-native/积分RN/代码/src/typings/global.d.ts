/**
 * Created by liuzhimeng.
 * @date 2019-02-22
 * @description declare global variable
 */

type UserId = string | number
type ENV = 'test' | 'pro'

interface IClientInfo {
  appVersion: string;
  qyId: string;
  deviceId: string;
  dfp: string;
  biqid: string;
  iqid: string;
  ua: string;
}
interface IUserInfo {
  userId: UserId;
  userIcon: string;
  userName: string;
  authCookie: string;
  isLogin: boolean;
  isVIP: boolean;
}
interface ICommonParams {
  userId: UserId;
  authCookie: string;
  cookie: string;
  agentversion: string;
  appver: string;
  version: string;
}

interface BaseStyleSheet {
  FontWeight: {
    Medium: string;
    Bold: string;
  };
  hairlineWidth: number;
  create(style: object): any;
}

declare namespace NodeJS {
  interface Global {
    _ENV_CONFIG_: ENV; // 环境变量
    CLIENT_INFO: IClientInfo;
    USER_INFO: IUserInfo;
    COMMON_PARAMS: ICommonParams;
    BaseStyleSheet: BaseStyleSheet;
    uniqueID: string; // 原生端生成的唯一ID
    from: string; // 投递参数，标记页面来源
    mod: string; // 地区和语言
    NOOP(): void;
  }
}
