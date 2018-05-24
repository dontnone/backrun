import React, { Component } from 'react'
import MenuList from '../../components/Header'
import LoginIn from '../../components/Login'
import Cookie from '../../components/Util'
import { Menu, Icon } from 'antd'

const SubMenu = Menu.SubMenu
const MenuItemGroup = Menu.ItemGroup

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            current: 'app'
        }
    }
    componentDidMount() {
    }
    handleClick(e) {
        console.log('click ', e);
        this.setState({
            current: e.key
        })
    }
    render() {
        return (
            <div className="flexhome">
                <div className="home-bg">
                    <LoginIn that={ this } />
                </div>
            </div>
        )
    }
}

export default Home