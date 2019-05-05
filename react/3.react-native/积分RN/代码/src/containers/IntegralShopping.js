/**
 * 积分购物
 */

import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
  ScrollView,
  ListView
} from 'react-native';
import {View, Text, Image, ActivityIndicator} from '@iqiyi/rn-ui';
import WebImage from '../components/WebImage';
import NavBar from '../components/DefaultNavBar';
import {getIntegralShopping} from '../api';
import {compare, goToDianShangDetail} from '../common/util';
import {sendPagePingback, sendClickPingback} from '../common/pingback'
import {TOUCH_LIGHT_MASK} from '../constants/touchableStyle';
import {hideLoading} from '../common/QYNativeBridge';
import BasePage from '../components/BasePage';

const {width} = Dimensions.get('window');

let ds;

export default class IntegralShopping extends BasePage {
  pageName = 'shopping';

  constructor(props) {
    super(props);
    ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      goodsList: ds.cloneWithRows([]), // 商品列表
      selectedBtnStatue: 'zonghe', // 头部点击按钮状态： 综合，销量 「zonghe,saleQuantity」
      isLoading: true, // 页面加载态
    };
    this.listArray = [];
    this.listSortByQuantity = [];
  }

  componentDidMount() {
    sendPagePingback(this.pageName)
    hideLoading()
    this._getData();
  }

  _getData = () => {
    getIntegralShopping()
      .then((param) => {
        let {data, code} = param;
        if(code !== 'A00000') {
          data = [];
        }
        this.listArray = this.listArray.concat(data);
        this.setState({
          goodsList: ds.cloneWithRows(this.listArray),
          isLoading: false
        })
      }, () => {
        this.setState({
          isLoading: false
        })
      });
  };

  sortByZonghe = () => {
    this.setState({
      goodsList: ds.cloneWithRows(this.listArray),
      selectedBtnStatue: 'zonghe'
    })
  }

  sortBysaleQuantity = () => {
    if(this.listSortByQuantity.length === 0) {
      this.listSortByQuantity = this.listArray.concat([])
      this.listSortByQuantity.sort(compare('salesQuantity')); // 根据商品的销量salesQuantity降序排序，
    }
    this.setState({
      goodsList: ds.cloneWithRows(this.listSortByQuantity),
      selectedBtnStatue: 'saleQuantity'
    })
  }

  _renderTopSection = () => {
    const {selectedBtnStatue} = this.state;
    const selected = {
      marginTop: 0,
      fontSize: 16,
      color: '#FF7E00',
    }
    const unselected = {
      marginTop: 0,
      fontSize: 16,
      color: '#333333',
    }

    const colorZongHe = selectedBtnStatue === 'zonghe' ? selected : unselected;
    const colorSaleQuantity = selectedBtnStatue === 'zonghe' ? unselected : selected
    const lineZongHe = selectedBtnStatue === 'zonghe' ? styles.lineSelected : styles.lineUnselected
    const lineSaleQuantity = selectedBtnStatue === 'zonghe' ? styles.lineUnselected : styles.lineSelected

    return (
      <View style={styles.titleBox}>
        <TouchableOpacity activeOpacity={1} style={styles.topItem} onPress={this.sortByZonghe}>
          <Text style={colorZongHe}>综合</Text>
          <View style={[styles.bottomLine, lineZongHe]}/>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={1} style={styles.topItem} onPress={this.sortBysaleQuantity}>
          <Text style={colorSaleQuantity}>销量</Text>
          <View style={[styles.bottomLine, lineSaleQuantity]}/>
        </TouchableOpacity>
      </View>
    )
  }

  _goToDetailPage = (itemId, index) => {
    const rseat = `goods${parseInt(index) + 1}`
    this.openWeb(goToDianShangDetail(itemId))
    sendClickPingback('shopping', '500100', rseat)
  }

  _renderOldItem = (rowData, rowID) => {
    const itemId = rowData.itemIdStr
    return (
      <TouchableHighlight {...TOUCH_LIGHT_MASK} style={styles.itemBox} key={rowID} onPress={() => this._goToDetailPage(itemId, rowID)}>
        <View style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        >
          <Image source={{uri: rowData.showImage}} style={{width: 120, height: 120}}/>
          <View style={{marginLeft: 10, flex: 1}}>
            <Text style={{fontSize: 15, color: '#333333', marginTop: 10}} numberOfLines={1}>
              {rowData.itemName}
            </Text>
            <Text style={{fontSize: 14, color: '#FD7E23', marginTop: 6}}>
              {rowData.scoreValue}积分可抵{rowData.discount / 100}元
            </Text>
            <Text style={{fontSize: 11, color: '#666666', marginTop: 7.5}}>
              已销售{rowData.salesQuantity}
            </Text>
            <Text style={{fontSize: 15, color: '#8B572A', marginTop: 13}}>
              ￥{rowData.price / 100}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    )
  }

  _renderNothing = () => {
    return (
      (!this.state.isLoading && this.listArray.length === 0) &&
      <View style={styles.nothing}>
        <WebImage name="shopping_kong" style={{width: 163, height: 124}}/>
        <Text style={{
          fontSize: 14,
          color: '#666666',
          marginTop: 45,
          textAlign: 'center'
        }}
        >
          新商品还在打包哟
        </Text>
      </View>
    )
  }

  _renderOldsList = () => {
    return (
      !!this.listArray.length &&
      <View style={styles.harvestListBox}>
        <ListView
          enableEmptySections
          initialListSize={10}
          onEndReachedThreshold={10}
          onEndReached={this._onEndReached}
          dataSource={this.state.goodsList}
          renderRow={(rowData, sectionID, rowID) => this._renderOldItem(rowData, rowID)}
        />
      </View>
    )
  }

  _renderLoading = () => {
    return (
      !!this.state.isLoading &&
      <View style={{
        height: 30,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100
      }}
      >
        <ActivityIndicator text="内容即将呈现..."/>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <NavBar
          title="积分购物"
          type="black"
          titleColor="#333333"
          backgroundColor="#ffffff"
          backPress={this.back}
        />
        <ScrollView style={styles.scrollContainer}>
          {this._renderTopSection()}
          {this._renderNothing()}
          {this._renderOldsList()}
          {this._renderLoading()}
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    flexDirection: 'column'
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    flexDirection: 'column'
  },
  titleBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: 55,
    paddingHorizontal: 35,
    borderBottomColor: '#ECECEC',
    borderBottomWidth: 0.5,
  },
  bottomLine: {
    width: 12,
    height: 3,
    borderRadius: 8.5,
    marginTop: 8,
  },
  lineSelected: {
    backgroundColor: '#FF7E00',
  },
  lineUnselected: {
    backgroundColor: 'transparent',
  },
  topItem: {
    alignItems: 'center',
    width: (width - 70) / 2,
    height: 54
  },
  harvestListBox: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    flex: 1
  },
  itemBox: {
    width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 120,
    paddingRight: 10,
    marginTop: 12
  },
  nothing: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
  },
})
