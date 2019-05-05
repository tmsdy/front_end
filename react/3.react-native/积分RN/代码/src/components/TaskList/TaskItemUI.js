/**
 * Created by liuzhimeng.
 * @date 2019-04-01
 * @description 任务列表内子项（纯UI组件，已解耦）
 */

import React, {PureComponent} from 'react'
import {TouchableOpacity} from 'react-native'
import PropTypes from 'prop-types'
import {View, Text} from '@iqiyi/rn-ui'

import ReduxUtil from '../../common/ReduxUtil'

import WebImage from '../WebImage'
import TaskItemButton from './TaskItemButton'

export default class TaskItemUI extends PureComponent {
  static propTypes = {
    image: PropTypes.string,
    title: PropTypes.string,
    iconName: PropTypes.string,
    onIconPress: PropTypes.func,
    buttonOptions: PropTypes.shape(TaskItemButton.propTypes),

    renderDescriptionComponent: PropTypes.node,
    renderButtonComponent: PropTypes.node,

    containerStyle: PropTypes.object,
  }

  static defaultProps = {
    iconName: '',
    buttonOptions: {},

    renderDescriptionComponent: null,
    renderButtonComponent: null,

    containerStyle: {},
  }

  constructor(props) {
    super(props)

    this.refIcon = ReduxUtil.createRef()
  }

  render() {
    const {image, title, showVipIcon, renderDescriptionComponent, iconName, onIconPress, buttonOptions} = this.props

    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <View style={styles.left}>
          <WebImage style={styles.leftImage} name={image} resizeMode="contain" />
          {!!showVipIcon && <WebImage name="vip_label" style={styles.vipIcon} />}
        </View>
        <View style={styles.content}>
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>{title}</Text>
            {(!!iconName && !!onIconPress) && (
              <TouchableOpacity ref={this.refIcon} style={styles.titleIconWrapper} activeOpacity={1} onPress={onIconPress}>
                <WebImage style={styles.titleIcon} name={iconName}/>
              </TouchableOpacity>
            )}
          </View>
          {renderDescriptionComponent}
        </View>
        <View style={styles.right}>
          {!this.props.renderButtonComponent
            ? <TaskItemButton {...buttonOptions}/>
            : this.props.renderButtonComponent
          }
        </View>
      </View>
    )
  }

  getIconRef = () => {
    return this.refIcon
  }
}

const styles = BaseStyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 75,
    paddingHorizontal: 15,
    borderRadius: 15,
    backgroundColor: '#F9F9F9',
  },
  left: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 45,
    height: 55,
    overflow: 'hidden',
  },
  leftImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
  vipIcon: {
    position: 'absolute',
    left: (45 - 36) / 2,
    bottom: 0,
    width: 36,
    height: 20,
  },
  content: {
    flex: 1,
    paddingLeft: 7,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    height: 23,
    lineHeight: 23,
    fontSize: 16,
    color: '#333333',
  },
  titleIconWrapper: {
    marginLeft: 4,
  },
  titleIcon: {
    width: 15,
    height: 15,
  },

  right: {
    alignSelf: 'flex-end',
    justifyContent: 'center',
    height: '100%',
  },
})
