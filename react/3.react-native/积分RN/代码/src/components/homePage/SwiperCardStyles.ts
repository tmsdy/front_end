import {Width} from '@iqiyi/rn-utils'
import BaseStyleSheet from '../../common/BaseStyleSheet'
import px2dp from '../../common/px2dp'

const SwipeCardStyle = BaseStyleSheet.create({
  boxWrapper: {
    alignItems: 'center',
    width: Width - 55,
    height: 0.95 * (Width - 55),
    borderRadius: 10,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    borderWidth: 0.5,
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowOffset: {
      width: 0,
      height: 0
    }
  },
  title: {
    fontWeight: BaseStyleSheet.FontWeight.Bold,
    fontSize: 16,
    lineHeight: 23,
    color: '#222',
    textAlign: 'center'
  },
  contentView: {
    width: px2dp(275),
    height: px2dp(46),
    marginBottom: px2dp(15),
    justifyContent: 'center',
    alignItems: 'center'
  },
  newTopBox: {
    width: Width - 55,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: px2dp(10),
    height: px2dp(50)
  },
  newTopBoxLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  extraWrapper: {
    fontSize: 12,
    color: '#666',
  },
  iconButton: {
    minWidth: 50,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  }
})

export default SwipeCardStyle
