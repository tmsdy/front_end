import React from 'react'
import { Row, Col } from 'antd'
import Header from './components/Header'
import Footer from './components/Footer'
import NavLeft from './components/NavLeft'
import './style/common.less'

export default (props) => {
    return (
        <Row>
            <Col className="nav-left" span="3">
                <NavLeft />
            </Col>
            <Col className="main" span="21">
                <Header></Header>
                <Row className="content">
                    content
                    {/* {this.props.children} */}
                </Row>
                <Footer></Footer>
            </Col>
        </Row>
    )
}