/**
 * Created by kerwinliu on 2017/11/21.
 */
/*
* 弹框公用样式
* */
import {Width} from '@iqiyi/rn-utils'
import BaseStyleSheet from '../common/BaseStyleSheet'

export default BaseStyleSheet.create({
  modalContainer: {
    width: Width,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainerTrans: {
    width: Width,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  innerContainer: {
    alignItems: 'center',
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
})
