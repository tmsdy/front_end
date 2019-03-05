import React from 'react'
import { connect } from 'react-redux'
import { CSSTransition } from 'react-transition-group'
import {
	HeaderWrapper,
	Logo,
	Nav,
	NavItem,
	SearchWrapper,
	NavSearch,
	Addition,
	Button
} from './style';
// connect让组件和store建立连接
const Header = (props) => { //无状态组件，组件只有render函数的时候可以写，性能好
  let {focused,handleInputFocus,handleInputBlur} = props
  return (
    <HeaderWrapper>
      <Logo />
      <Nav>
      <NavItem className='left active'>首页</NavItem>
        <NavItem className='left'>下载App</NavItem>
        <NavItem className='right'>登陆</NavItem>
        <NavItem className='right'>
          <i className="iconfont">&#xe636;</i>
        </NavItem>
        <SearchWrapper>
          <CSSTransition //给内层组件挂载动画的class: slide-enter,slide-enter-active...
            in={focused}
            timeout={200}
            classNames="slide"
          >
            <NavSearch
              className={focused ? 'focused': ''}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            ></NavSearch>
          </CSSTransition>
          <i className={focused ? 'focused iconfont zoom': 'iconfont zoom'}>
            &#xe614;
          </i>
        </SearchWrapper>
      </Nav>
      <Addition>
          <Button className='writting'>
            <i className="iconfont">&#xe615;</i>
            写文章
          </Button>
        <Button className='reg'>注册</Button>
      </Addition>
    </HeaderWrapper>
  )
}

const mapStateToProps = (state) => { //把store中的数据映射到当前组件props上
  return {
    focused: state.focused
  }
}
const mapDispatchToProps = (dispatch) => { //让组件有能力用dispatch方法
  return {
    handleInputFocus() {
      const action = {
        type: 'search_focus'
      }
      dispatch(action)
    },
    handleInputBlur() {
      const action = {
        type: 'search_blur'
      }
      dispatch(action)
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Header)