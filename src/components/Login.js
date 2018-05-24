import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { withRouter } from 'react-router'
import { Form, Icon, Input, Button, Checkbox, Spin, message } from 'antd'
import { getFetch, postFetch } from '../../api'
import Cookie from '../components/Util'
import Url from '../../api/url'
const FormItem = Form.Item

class NormalLoginForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            username: '',
            password: ''
        }
    }
    componentDidMount() {
        Cookie.clearCookie('data')
        Cookie.clearCookie('token')
        console.log(Cookie.getCookie('userName'))
        if(Cookie.getCookie('userName') && Cookie.getCookie('password')){
            this.setState({
                username: Cookie.getCookie('userName'),
                password: Cookie.getCookie('password')
            })
        }
    }
    handleSubmit(e) {
        let that = this
        e.preventDefault()
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                const res = await postFetch(Url.login + '?username=' + values.userName + '&password=' + values.password, {
                    data: {
                        username: values.userName,
                        password: values.password
                    }
                })
                console.log(values.remember)
                if(res.code == 2000){
                    await this.setState({
                        loading: true
                    })
                    message.info('登录成功')
                    if(values.remember){
                        Cookie.setCookie('userName', values.userName)
                        Cookie.setCookie('password', values.password)
                    }else{
                        Cookie.clearCookie('userName')
                        Cookie.clearCookie('password')
                    }
                    Cookie.setCookie('token', res.data.token)
                    Cookie.setCookie('data', JSON.stringify(res.data))
                    setTimeout(()=> {
                        this.props.that.props.history.push('/home')
                    }, 2000)
                }else{
                    this.setState({loading: false})
                    message.info(res.message)
                }
                console.log(res)
            }
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="login-form">
                <Spin className="loading" spinning={this.state.loading} delay={500} >
                    <div className="logo-home">
                        <img src={require('../static/img/logo1.png')} />
                    </div>
                    <Form onSubmit={(e)=> this.handleSubmit(e)}>
                        <FormItem>
                        {getFieldDecorator('userName', {
                            rules: [{ required: true, message: '请输入用户名' }],
                            initialValue: this.state.username
                        })(
                            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="请输入用户名" />
                        )}
                        </FormItem>
                        <FormItem>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: '请输入密码' }],
                            initialValue: this.state.password
                        })(
                            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="请输入密码" />
                        )}

                        </FormItem>
                        <FormItem>
                        {getFieldDecorator('remember', {
                            valuePropName: 'checked',
                            initialValue: true,
                        })(
                            <Checkbox>记住密码</Checkbox>
                        )}
                        </FormItem>
                        <FormItem>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            登录
                        </Button>
                        </FormItem>
                    </Form>
                </Spin>
            </div>
        );
    }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

export default WrappedNormalLoginForm