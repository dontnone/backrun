import React, { Component } from 'react'
import { Layout, Menu, Icon, Avatar, Dropdown, message } from 'antd'
import Left from './Left'
import Cookie from '../components/Util'
const { Header, Content, Footer, Sider } = Layout

export default class extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: ''
        }
    }
    componentDidMount() {
        const data = Cookie.getCookie('data')
        if(data){
            this.setState({
                username: JSON.parse(data).username
            })
        }else{
            message.info('登录失效，请重新登录')
            setTimeout(()=> {
                this.props.router.history.push('/')
            },2000)
        }
        
    }
    exitUser = () => {
        Cookie.clearCookie('data')
        Cookie.clearCookie('token')
        message.info('注销成功')
        setTimeout(()=> {
            this.props.router.history.push('/')
        },2000)
    }
    render() {
        const menu = (
            <Menu>
              <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" onClick={ this.exitUser }>注销</a>
              </Menu.Item>
            </Menu>
        );
        return (
            <Layout>
                <Left that= { this.props.router } keys={ this.props.keys } />
                <Layout style={{ marginLeft: 200 }}>
                    <Header className="header">
                        <Avatar style={{ backgroundColor: '#87d068' }} icon="user" />
                        <Dropdown overlay={menu}>
                            <div className="inlineblock">
                                <span>{ this.state.username }</span>
                                <Icon type="caret-down" />
                            </div>
                        </Dropdown>
                    </Header>
                    <Content style={{ margin: '64px 16px 0', overflow: 'initial' }}>
                        <div className="content-bg">
                            <div className="content-title"><span>{ this.props.name }</span><span className="right">{ this.props.otherName }</span></div>
                            <div style={{ padding: 24, paddingTop: 0, background: '#fff' }}>
                                {this.props.children}
                            </div>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        System ©2018 Created by Hdkongjia
                    </Footer>
                </Layout>
            </Layout>
        )
    }
}