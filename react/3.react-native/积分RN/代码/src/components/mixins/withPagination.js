/**
 * Created by liuzhimeng.
 * @date 2018/9/19
 * @description 挂载RN列表组件（ScrollView\FlatList\SectionList）分页数据
 */

import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'

/**
 * @param WrappedComponent RN列表组件
 * @param pageState {object} 初始分页数据: {offset, limit}
 * @returns 高阶组件
 */
export const withPagination = (WrappedComponent, {pageState: {offset, limit}}) =>
  class WithWrappedComponent extends PureComponent {
    static propTypes = {
      total: PropTypes.number,
      onEndBack: PropTypes.func, // 参数{object}: {info: onEndReached返回的参数；pageState: {offset: 当前数据起始位置；limit：每次获取数据长度；}，loadAll：是否已加载全部}
    }

    static defaultProps = {
      total: 0,
      onEndBack: () => null,
    }

    constructor(props) {
      super(props)
      this.offset = offset
      this.limit = limit
    }

    render() {
      return (
        <WrappedComponent
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.5}
          onEndReached={info => this._onEndReached(info)}
          {...this.props}
        />
      )
    }

    _onEndReached(info) {
      const current = this.offset + this.limit
      const _total = this.props.total
      const newOffset = current > _total ? _total : current
      const loadAll = newOffset >= _total
      this.offset = newOffset
      this.props.onEndBack({
        info,
        pageState: {
          offset: newOffset,
          limit,
        },
        loadAll,
      })
    }
  }
