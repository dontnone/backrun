import React, { PureComponent } from 'react'
import { Layout, Menu, Icon, Button } from 'antd'
const { Header, Content, Footer, Sider } = Layout
import Cookie from '../components/Util';
const SubMenu = Menu.SubMenu;

export default class extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            menuKeys: ['sub1', 'sub2'],
            menuShow: false
        }
    }
    componentDidMount() {
    }
    chooseMenu = (e) => {
        if(e.key == '1'){
            this.props.that.history.push('/home')
        }
        if(e.key == '2'){
            this.props.that.history.push('/addsearch')
        }
        if(e.key == '3'){
            this.props.that.history.push('/user')
        }
    }
    render() {
        return (
            <div>
                <div className="logo">
                    <img src={require('../static/img/logo1.png')} />
                </div>
                <Sider style={{ overflow: 'auto', height: '100vh', top: '50px', position: 'fixed', left: 0 }}>
                    <Menu theme="dark" 
                        defaultSelectedKeys={[this.props.keys]} 
                        mode="inline" 
                        defaultOpenKeys={this.state.menuKeys}
                        onSelect={ this.chooseMenu }>
                        <SubMenu
                        key="sub1"
                        title={<span><Icon type="home" /><span>主页</span></span>}
                        >
                            <Menu.Item key="1">查询抓取</Menu.Item>
                            <Menu.Item key="2">新增抓取</Menu.Item>
                        </SubMenu>
                        {
                            JSON.parse(Cookie.getCookie('data')).username == 'admin' ?
                            <SubMenu
                            key="sub2"
                            title={<span><Icon type="user" /><span>用户中心</span></span>}
                            >
                            <Menu.Item key="3">用户管理</Menu.Item>
                            </SubMenu> : ''
                        }
                    </Menu>
                </Sider>
            </div>
        )
    }
}