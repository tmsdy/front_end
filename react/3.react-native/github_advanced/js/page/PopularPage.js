import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer, createMaterialTopTabNavigator } from 'react-navigation'

import NavigationUtil from '../navigator/NavigationUtil'

type Props = {};
export default class PopularPage extends Component<Props> {
  constructor(props) {
    super(props)
    this.tabNames = ["前端", "后端", "大数据", "人工智能", "区块链", "其他"]
  }
  _genTabs() {
    const tabs = {}
    this.tabNames.forEach((item, index) => {
      tabs[`tab${index}`] = {
        screen: props=>
          <PopularTab //便于传参给每个tab对应的页面
              {...props}
              tabLabel={item}
            />,
        navigationOptions: {
          title: item
        }
      }
    })
    return tabs
  }
  render() {
    const TopTabNavigator = createMaterialTopTabNavigator(
      this._genTabs(), {
        tabBarOptions: {
          tabStyle: styles.tabStyle,
          scrollEnabled: true, //设置可以滚动
          style: {
            backgroundColor: '#999'
          },
          indicatorStyle: styles.indicatorStyle,
          labelStyle: styles.labelStyle
        }
      }
    )
    let TopTabContainer = createAppContainer(TopTabNavigator)
    return <TopTabContainer/>
  }
}
class PopularTab extends Component<Props> {
  render() {
    // console.log(this.props)
    const { navigation,tabLabel } = this.props
    return (
      <View style={{marginTop:30}}>
        <Text>{tabLabel}</Text>
        <Text onPress={() => {
          NavigationUtil.goPage({ navigation }, "DetailPage")
        }}>跳转到详情页1</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabStyle: {

  },
  indicatorStyle: {
    height: 2,
    backgroundColor: 'white'
  },
  labelStyle: {
    fontSize: 13,
  },
  indicatorContainer: {
    alignItems: "center"
  },
  indicator: {
    color: 'red',
    margin: 10
  }
});