/**
 * Created by kerwinliu on 2018/8/13.
 */

import React from 'react'
import {TouchableHighlight} from 'react-native'
import {Text, View} from '@iqiyi/rn-ui'
import WebImage from '../WebImage'
import BaseStyleSheet from '../../common/BaseStyleSheet'

interface TabTitleProps {
  title: string;
  showLookMore?: boolean;
  showNotice?: boolean;
  renderDescription?: React.ReactNode;
  renderLookMoreComponent?: React.ReactNode;
  onPress(): void;
}

export default function TabTitle({
  title = '',
  showLookMore = false,
  showNotice = false,
  renderDescription = null,
  renderLookMoreComponent = <Text style={styles.moreText}>查看更多</Text>,
  onPress,
}: TabTitleProps) {
  return (
    <View style={styles.container}>
      <View style={styles.titleLeft}>
        {!!title && <Text style={styles.title}>{title}</Text>}
        {renderDescription}
      </View>
      {showLookMore && (
        <TouchableHighlight activeOpacity={1} underlayColor="transparent" onPress={onPress}>
          <View style={styles.lookMore}>
            {showNotice && <WebImage name="red_icon_medal" style={styles.redIcon}/>}
            {renderLookMoreComponent}
            <WebImage name="icon/triangle-right" style={styles.moreIcon}/>
          </View>
        </TouchableHighlight>
      )}
    </View>
  )
}

const CONTAINER_HEIGHT = 50
const styles = BaseStyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: CONTAINER_HEIGHT,
    paddingHorizontal: 20,
  },
  titleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    minWidth: 70,
    fontSize: 16,
    fontWeight: BaseStyleSheet.FontWeight.Bold,
    color: '#333333',
  },
  moreText: {
    height: CONTAINER_HEIGHT,
    lineHeight: CONTAINER_HEIGHT,
    color: '#999999',
    fontSize: 12,
  },
  redIcon: {
    width: 15,
    height: 15,
    marginRight: 3.5,
  },
  lookMore: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: CONTAINER_HEIGHT,
    minWidth: 70,
  },
  moreIcon: {
    width: 7,
    height: 12,
    marginLeft: 7,
  },
})
