import React, { useState } from 'react'
import { Row, Col } from "antd"
import Util from '../../utils/utils'
import axios from '../../axios'
import './index.less'

export default (props) => {
    // let [menuType, menuName] = props
    let menuType = ''
    let menuName = ''
    let _sysTime = Util.formateDate(new Date().getTime());
    let [userName, setUserName] = useState('feifei')
    let [sysTime, setSysTime] = useState(_sysTime)
    let [weather, setWeather] = useState('晴转多云')
    let [dayPictureUrl, setDayPictureUrl] = useState('')
    getWeatherAPIData()
    function getWeatherAPIData() {
        let city = '上海'
        axios.jsonp({
            url: 'http://api.map.baidu.com/telematics/v3/weather?location=' + encodeURIComponent(city) + '&output=json&ak=3p49MVra6urFRGOT9s8UBWr2'
        }).then((res) => {
            if (res.status == 'success') {
                let data = res.results[0].weather_data[0];
                setWeather(data.weather)
                setDayPictureUrl(data.dayPictureUrl)
            }
        })
    }
    return (
        <div className="header">
            <Row className="header-top">
                {
                    menuType ?
                        <Col span={6} className="logo">
                            <img src="/assets/logo-ant.svg" alt="" />
                            <span>IMooc 通用管理系统</span>
                        </Col> : ''
                }
                <Col span={menuType ? 18 : 24}>
                    <span>欢迎，{userName}</span>
                    <a href="#">退出</a>
                </Col>
            </Row>
            {
                menuType ? '' :
                    <Row className="breadcrumb">
                        <Col span={4} className="breadcrumb-title">
                            {menuName || '首页'}
                        </Col>
                        <Col span={20} className="weather">
                            <span className="date">{sysTime}</span>
                            <span className="weather-img">
                                <img src={dayPictureUrl} alt="" />
                            </span>
                            <span className="weather-detail">
                                {weather}
                            </span>
                        </Col>
                    </Row>
            }
        </div>
    )
}
