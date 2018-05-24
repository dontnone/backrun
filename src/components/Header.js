import React, { Component } from 'react'
import LoginIn from '../components/Login'
import { Menu, Icon } from 'antd'

const SubMenu = Menu.SubMenu
const MenuItemGroup = Menu.ItemGroup

class MenuList extends Component {
    constructor() {
        super()
        this.state = {
            current: 'app'
        }
    }
    handleClick(e) {
        console.log('click ', e);
        this.setState({
            current: e.key
        })
    }
    render() {
        return (
            <Menu
                onClick={(e)=> this.handleClick(e)}
                selectedKeys={[this.state.current]}
                mode="horizontal"
            >
                <Menu.Item key="mail">
                    <Icon type="mail" />Home
                </Menu.Item>
                <Menu.Item key="app">
                    <Icon type="appstore" />Blog
                </Menu.Item>
                <SubMenu title={<span><Icon type="setting" />Article</span>}>
                    <MenuItemGroup title="New">
                        <Menu.Item key="setting:1">My new article</Menu.Item>
                        <Menu.Item key="setting:2">Be interested</Menu.Item>
                    </MenuItemGroup>
                    <MenuItemGroup title="Recommend">
                        <Menu.Item key="setting:3">Option 3</Menu.Item>
                        <Menu.Item key="setting:4">Option 4</Menu.Item>
                    </MenuItemGroup>
                </SubMenu>
                <Menu.Item key="alipay">
                    <Icon type="contacts" /> About
                </Menu.Item>
            </Menu>
        )
    }
}

export default MenuList