/**
 * 首页顶部导航图标
 */
import React, {PureComponent} from 'react'
import {TouchableHighlight} from 'react-native'
import {Text, View} from '@iqiyi/rn-ui'

import BaseStyleSheet from '../../common/BaseStyleSheet'
import WebImage from '../WebImage'
import {setStorage, getStorage} from '../../common/util'
import {sendBlockPingback} from '../../common/pingback'

import {QipuDataItem} from '../../typings/apis/homePage'

export interface MenuItemProps {
  data: QipuDataItem;
  onPress(): any;
}

interface MenuItemState {
  newIconVisible: boolean; // 是否显示上新图标
}

export default class MenuItem extends PureComponent<MenuItemProps, MenuItemState> {
  constructor(props) {
    super(props)

    this.state = {
      newIconVisible: false,
    }
  }

  componentDidMount() {
    sendBlockPingback('homeRN', 200200)
    this.showNewMarkIcon()
  }

  render() {
    const {data} = this.props
    const {newIconVisible} = this.state

    return (
      <TouchableHighlight
        style={styles.container}
        underlayColor="transparent"
        onPress={this.handleClick}
      >
        <View style={styles.wrapper}>
          <View style={[styles.iconWrapper, styles.icon]}>
            <WebImage style={styles.icon} uri={data.imgUrl}/>
            {newIconVisible && (
              <WebImage style={styles.newIconWrapper} name={`new_${data.values.tips}`}/>
            )}
          </View>
          <Text style={styles.menuText} numberOfLines={1}>{data.properTitle}</Text>
        </View>
      </TouchableHighlight>
    )
  }

  getStorageName = () => {
    const {entityId, values: {tips = null}} = this.props.data
    return `${tips}_${entityId}_${global.USER_INFO.userId}`
  }

  showNewMarkIcon = async () => {
    const {values: {tips = null}} = this.props.data
    const storageName = this.getStorageName()
    if(tips) {
      const isShown = await getStorage(storageName)
      if(!isShown) {
        this.setState({newIconVisible: true})
      }
    }
  }

  handleClick = () => {
    const storageName = this.getStorageName()

    setStorage(storageName, true)

    if(this.state.newIconVisible) {
      this.setState({newIconVisible: false})
    }
    this.props.onPress()
  }
}

const styles = BaseStyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },

  iconWrapper: {
    marginBottom: 5,
  },
  icon: {
    width: 40,
    height: 40,
  },

  newIconWrapper: {
    position: 'absolute',
    top: 0,
    left: 20,
    width: 38,
    height: 22,
  },

  menuText: {
    width: '100%',
    height: 16.5,
    textAlign: 'center',
    color: '#333333',
    fontSize: 12,
  },
})
