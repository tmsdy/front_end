import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, Icon } from 'antd';
import MenuConfig from '../../config/menuConfig'
import './index.less'

const SubMenu = Menu.SubMenu;

export default (props) => {
    const renderMenu = (data) => {
        return data.map((item) => {
            if (item.children) {
                return (
                    <SubMenu title={item.title} key={item.key}>
                        {renderMenu(item.children)}
                    </SubMenu>
                )
            }
            return <Menu.Item title={item.title} key={item.key}>
                {item.title}
                <NavLink to={item.key}>{item.title}</NavLink>
            </Menu.Item>
        })
    }
    const [menuTreeNode, setMenuTreeNode] = useState(renderMenu(MenuConfig))
    return (
        <div>
            <div className="logo">
                <h1>Imooc MS</h1>
            </div>
            <Menu theme="dark">
                {menuTreeNode}
            </Menu>
        </div>
    )
}
