/**
 * Created by lixiaoxi1.
 * @date 2019/4/3
 * @description
 */

 // tslint:disable:no-import-side-effect
import 'react'
import {DeviceEventEmitter} from 'react-native'
import {PurePage} from '@iqiyi/rn-navigation'
import {sendPagePingback} from '../common/pingback'

interface BlurData {
  state: {
    routeName: string;
  };
}

export default class BasePage<P = {}, S = {}> extends PurePage<P, S> {
  private nameFuncList = [];

  public pageName = 'basePage';
  public onBlur?(data: BlurData): void;
  public onDestroyed?(): void;
  public back?(): void;
  public openWeb?(url: string): void;
  public goTo?(routeName: string, options?: object): void;
  public navigate?(routeName: string, options?: object): void;

  // eslint-disable-next-line no-useless-constructor
  constructor(props: P) {
    super(props)
    this.listenLoginChange()

    this.overrideMethod('componentWillUnmount', () => {
      this.loginSubscription && this.loginSubscription.remove()
    })
  }

  private overrideMethod(funName: string, func: Function) {
    const originFunction = this[funName]

    this.nameFuncList.push({funName, func})

    this[funName] = (...args: any[]) => {
      originFunction && originFunction()

      this.nameFuncList.forEach((t) => {
        t && t.func && t.func.apply(this, args)
      })
    }
  }

  public sendRtimePingback(rtime: number | string): void {
    sendPagePingback(this.pageName, {rtime})
  }

  public onShow() {
    this.stayTime = Date.now();
    // iOS 生命周期函数失效了
  }

  // 重载 取消onHide事件， 将页面的离开统一为onBlur & openWeb 这两个周期
  public onHide() {
    // // hide 会被调用两次， 因此做判断草果1000s则不投递
    // this.stayTime = Date.now() - this.stayTime;
    // this.stayTime < 1000000 && sendPagePingback(this.pageName, {rtime: this.stayTime});
  }

  public listenLoginChange() {
    this.loginSubscription = DeviceEventEmitter.addListener('loginChange', (isLogin) => {
      this.loginChange(isLogin)
    });
  }

  public loginChange(isLogin: boolean): void {}

}
