/**
 * Created by liuzhimeng.
 * @date 2019-04-19
 * @description 积分中心商品列表组
 */

import React, {PureComponent} from 'react'

import LimitedSale from './LimitedSale'
import ProductList from './ProductList'
import Bottom from './Bottom'

import {FetchPropsProductItem, FetchPropCodeItem} from '../../typings/apis/homePage'

import {fetchPropsCodeList, fetchPropsProductList, fetchIntegralShopping} from '../../model/homePage'

interface SectionItem {
  code?: string;
  title?: string;
  list: FetchPropsProductItem[];
}

interface ProductSectionProps {
  openWeb(route: string): void;
  goTo(route: string): void;
}

interface ProductSectionState {
  codeList: FetchPropCodeItem[]; // tag数据
  limitSaleData: SectionItem; // 秒杀
  selectData: SectionItem; // 为你精选
  scoredata: SectionItem; // 积分当钱花
  sectionList: SectionItem[]; // 其他商品数据
}

export default class ProductSection extends PureComponent<ProductSectionProps, ProductSectionState> {
  constructor(props: ProductSectionProps) {
    super(props)

    this.state = {
      codeList: [],
      limitSaleData: {
        code: '',
        list: [],
      },
      selectData: {
        code: '',
        title: '',
        list: [],
      },
      scoredata: {
        code: 'shopgoods',
        title: '积分当钱花',
        list: [],
      },
      sectionList: [],
    }
  }

  componentDidMount() {
    this.fetchIntegralShopping()
    this.getSectionList()
  }

  render() {
    const {codeList, limitSaleData, selectData, scoredata, sectionList} = this.state
    const {code: limitCode, list: limitList} = limitSaleData
    const {code: selectCode, title: selectTitle, list: selectList} = selectData
    const {code: scoreCode, title: scoreTitle, list: scoreList} = scoredata

    const offlineTime = (codeList[0] && codeList[0].isLimitedSale) ? codeList[0].offlineTime : 0

    return (
      <React.Fragment>

        {/* 秒杀 */}
        {!!limitList.length && (
          <LimitedSale code={limitCode} time={offlineTime} list={limitList} goTo={this.props.goTo} />
        )}

        {/* 为你精选（如后台没有配置此数据，则展示下一组道具商品数据）@龚腾 */}
        {!!selectList.length && (
          <ProductList
            key={selectCode}
            code={selectCode}
            title={selectTitle}
            list={selectList}
            theme="board"
            numColumns={3}
            goTo={this.props.goTo}
            openWeb={this.props.openWeb}
          />
        )}

        {/* 积分当钱花（数据取自商城接口） */}
        {!!scoreList.length && (
          <ProductList
            key={scoreCode}
            code={scoreCode}
            title={scoreTitle}
            list={scoreList}
            theme="normal"
            productType="score"
            numColumns={2}
            goTo={this.props.goTo}
            openWeb={this.props.openWeb}
          />
        )}

        {/* 其他道具商品组数据 */}
        {sectionList.map(({code, title, list}) => {
          return (
            <ProductList
              key={code}
              title={title}
              code={code}
              list={list}
              theme="normal"
              numColumns={2}
              goTo={this.props.goTo}
              openWeb={this.props.openWeb}
            />
          )
        })}

        {/* 底部栏 */}
        {!!sectionList.length && (
          <Bottom containerStyle={{marginTop: 10}} goTo={this.props.goTo} />
        )}

      </React.Fragment>
    )
  }

  // 获取商城数据（积分当钱花）
  fetchIntegralShopping = async () => {
    const data = await fetchIntegralShopping()
    const {scoredata} = this.state
    scoredata.list = data

    this.setState({scoredata})
  }

  getSectionList = async () => {
    const codeList: FetchPropCodeItem[] = await fetchPropsCodeList()

    let hasLimitedSale = false

    const promises = codeList.map(({code, isLimitedSale}, index) => {
      let pageSize = 4
      if(isLimitedSale) {
        hasLimitedSale = true
        pageSize = 100
      } else if((hasLimitedSale && index === 1) || (!hasLimitedSale && index === 0)) {
        pageSize = 6
      }

      return fetchPropsProductList(code, pageSize, 1)
    })

    const sections = await Promise.all(promises)
    let {limitSaleData, selectData} = this.state
    const sectionList = []

    for(let key = 0; key < sections.length; key++) {
      const productList = sections[key]
      const codeData = codeList[key]

      if(productList && productList.length) {
        const itemData = {
          code: codeList[key].code,
          title: codeList[key].title,
          list: productList,
        }

        if(codeData.isLimitedSale) {
          limitSaleData = itemData
        } else if(!selectData.code) {
          selectData = itemData
        } else {
          sectionList.push(itemData)
        }
      }
    }

    this.setState({codeList, limitSaleData, selectData, sectionList})
  }

}
