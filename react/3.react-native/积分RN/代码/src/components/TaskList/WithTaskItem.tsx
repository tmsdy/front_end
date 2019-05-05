
/**
 * Created by liuzhimeng.
 * @date 2019-04-22
 * @description 任务列表内子项
 */

import React, {PureComponent} from 'react'
import {TouchableOpacity} from 'react-native'
import {View, Text} from '@iqiyi/rn-ui'

import BaseStyleSheet, {ImageStyle, ViewStyle} from '../../common/BaseStyleSheet'
import ReduxUtil from '../../common/ReduxUtil'

import WebImage, {DefaultImage} from '../WebImage'

interface WithTaskItemProps {
  image: string;
  title: string;
  iconName: string;
  showTag?: boolean;
  tagName?: string;
  tagStyle?: ImageStyle;
  renderDescriptionComponent?: React.ReactNode;
  renderButtonComponent?: React.ReactNode;
  containerStyle?: ViewStyle;
  onIconPress(): void;
  onItemPress(): void;
}

export default class WithTaskItem extends PureComponent<WithTaskItemProps, {}> {
  private refIcon: any;

  static defaultProps = {
    iconName: '',
    showTag: false,
    renderDescriptionComponent: null,
    renderButtonComponent: null,
    containerStyle: {},
    tagStyle: {},
  }

  constructor(props: WithTaskItemProps) {
    super(props)

    this.refIcon = ReduxUtil.createRef()
  }

  render() {
    const {image, title, showTag, tagName, tagStyle, renderDescriptionComponent, iconName, onIconPress, onItemPress} = this.props

    return (
      <TouchableOpacity style={[styles.container, this.props.containerStyle]} activeOpacity={1} onPress={onItemPress}>
        <View style={styles.left}>
          <DefaultImage style={styles.leftImage} name={image} defaultImage="icon/default-task"/>
        </View>
        <View style={styles.content}>
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>{title}</Text>
            {(!!iconName && !!onIconPress) && (
              <TouchableOpacity ref={this.refIcon} style={styles.titleIconWrapper} activeOpacity={1} onPress={onIconPress}>
                <WebImage style={styles.titleIcon} name={iconName} />
              </TouchableOpacity>
            )}
            {(showTag && !!tagName) && <WebImage style={[styles.tag, tagStyle]} name={tagName} />}
          </View>
          {renderDescriptionComponent}
        </View>
        <View style={styles.right}>
          {this.props.renderButtonComponent}
        </View>
      </TouchableOpacity>
    )
  }

  public getIconRef = (): Promise<any> => {
    if(this.refIcon) {
      return this.refIcon.getInstance()
    }
    return null
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
    width: 35,
    height: 35,
    borderRadius: 17.5,
    overflow: 'hidden',
  },
  leftImage: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
  },
  content: {
    flex: 1,
    paddingLeft: 5,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    height: 20,
    lineHeight: 20,
    fontSize: 14,
    color: '#222222',
  },
  titleIconWrapper: {
    marginLeft: 4,
  },
  titleIcon: {
    width: 15,
    height: 15,
  },

  tag: {
    width: 23,
    height: 13,
    marginLeft: 3,
  },

  right: {
    alignSelf: 'flex-end',
    justifyContent: 'center',
    height: '100%',
  },
})
