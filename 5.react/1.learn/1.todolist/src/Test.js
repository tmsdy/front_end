import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Test extends Component {
  render() { //父组件的render执行时，子组件render也重新执行
    // console.log('test render')
    let {content} = this.props
    return (
      <div>
        {content}
      </div>
    )
  }
}
Test.propTypes = { //传值类型校验
  content: PropTypes.oneOfType([PropTypes.string,PropTypes.number])
}
Test.defaultProps = {
  content: ''
}
