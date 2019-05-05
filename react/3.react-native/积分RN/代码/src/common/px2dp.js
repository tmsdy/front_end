/**
 * Created by kerwinliu on 2018/3/9.
 */
import {Dimensions} from 'react-native'

const DEVICE_WIDTH = Dimensions.get('window').width
const BASIC_DESIGN = 375

export default function px2dp(px) {
  return px * (DEVICE_WIDTH / BASIC_DESIGN)
}
