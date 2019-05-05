/**
 * 首页顶部导航图标
 */
import React, { PureComponent } from 'react'
import {
  StyleSheet,
  TouchableHighlight,
} from 'react-native'
import {
  Text,
  Image,
  View
} from '@iqiyi/rn-ui'
import WebImage from './WebImage'
import { getAsyncStorage } from '../common/util'
import {
  Width
}from '@iqiyi/rn-utils'
import { sendBlockPingback } from '../common/pingback'

const width = 78
const ICON_MARGIN_RIGHT = width/2 - 42 > 0 ?  width/2 - 42 : 0

export default class extends PureComponent {
  state = {
    visible: false,
    iconName: null
  }

  componentDidMount() {
    this.showIcon()
    //展示投递pingback
    const { index } = this.props;
    this.navIconPingBack(index)
  }

  navIconPingBack = (index) =>{
    switch (index) {
        case 0:
            sendBlockPingback('homeRN', 200200)
            break;
        case 1:
            sendBlockPingback('homeRN', 200200)
            break;
        case 2:
            sendBlockPingback('homeRN', 200200)
            break;
        case 3:
            sendBlockPingback('homeRN', 200200)
            break;
        case 4:
            sendBlockPingback('homeRN', 200200)
            break;
        case 5:
            sendBlockPingback('homeRN', 200200)
            break;
        case 6:
            sendBlockPingback('homeRN', 200200)
            break;
        default:
    }
  }

  //筛选key value
  _filterValue =(arr , keyName)=>{
      const data = arr.filter(item => item.name && item.name === keyName)[0]
      return data ? data.value : ''
  }
  showIcon = ()=>{
      const { item } = this.props
      const { key_value_pair, entity_id } = item
      const iconName =this._filterValue(key_value_pair,"tips")
      let keys;
      let localNew = ''
      if (iconName) {
          keys = [`${iconName}${entity_id}${global.USER_INFO.userId}`]
          getAsyncStorage(keys, (errs, result) => {
              if (errs) {
                  return;
              }
              localNew = result[0][1] != null ? result[0][1] : '';
              if (localNew === '') {
                  this.setState({
                      visible: true,
                      iconName
                  })
              }
          })
      }
  }

  handleClick = () => {
    const { item, clickIcon, index } = this.props;
    const { iconName , visible } = this.state
    let isIconVisible = false;

    if (visible) {
        isIconVisible = true;
    }

    this.setState({
      visible: false
    }, () => {
      clickIcon(item, index, isIconVisible , iconName)
    })
  }

  render() {
    const { item } = this.props;
    const { iconName , visible } = this.state
    return (
      <TouchableHighlight
        key={item.entity_id}
        style={styles.icon_item}
        onPress={this.handleClick}
        underlayColor="transparent"
      >
          <View style={{flex: 1, justifyContent: 'space-between', alignItems: 'center'}}>
            <View style={{width:45,height:45,justifyContent:'center',alignItems:'center'}}>
              <Image source={{uri: item.thumbnail_url}} style={{width: 45, height: 45}} />
              {
                visible &&
                <WebImage name={`new_${iconName}`} style={{width: 38, height: 22, position: 'absolute', top: 0, left: 20}}/>
              }
            </View>
            <Text style={styles.icon_text}>{item.title.proper_title}</Text>
          </View>
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  icon_item: {
    width,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 6,
  },
  icon_text: {
    fontSize: 13,
    marginTop: 3,
    color: '#333333',
  },
})
