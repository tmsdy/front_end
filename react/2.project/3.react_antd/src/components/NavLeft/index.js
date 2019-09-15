import React from 'react'
import { Menu, Icon } from 'antd';
import './index.less'

const SubMenu = Menu.SubMenu;

export default (props) => {
    return (
        <div>
            <div className="logo">
                <img src="/assets/logo-ant.svg" alt="" />
                <h1>Imooc MS</h1>
            </div>
        </div>
    )
}
