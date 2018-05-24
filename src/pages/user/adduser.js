import React, { Component, PureComponent } from 'react'
import Contents from '../../components/Content'
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, DatePicker, message } from 'antd';
import moment from 'moment'
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import { getFetch, postFetch } from '../../../api'
import Url from '../../../api/url'

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const { MonthPicker, RangePicker } = DatePicker;


const plainOptions = [{
    label: '淘宝/天猫', 
    value: '10001'  
},{
    label: '1688', 
    value: '10002'  
},{
    label: '京东', 
    value: '10003'  
},{
    label: '苏宁易购', 
    value: '10004'  
},{
    label: '闲鱼', 
    value: '10005'  
},{
    label: '拼多多', 
    value: '10006'  
}];

// const plainOptions = ['1', '2', '3']

const lang = {
    "lang": {
      "placeholder": "选择日期",
      "rangePlaceholder": [
        "开始日期",
        "结束日期"
      ],
      "today": "今天",
      "now": "现在",
      "backToToday": "返回今天",
      "ok": "确定",
      "clear": "清除",
      "month": "月",
      "year": "年",
      "timeSelect": "选择时间",
      "dateSelect": "选择日期",
      "monthSelect": "Choose a month",
      "yearSelect": "Choose a year",
      "decadeSelect": "Choose a decade",
      "yearFormat": "YYYY",
      "dateFormat": "M/D/YYYY",
      "dayFormat": "D",
      "dateTimeFormat": "M/D/YYYY HH:mm:ss",
      "monthFormat": "MMMM",
      "monthBeforeYear": true,
      "previousMonth": "Previous month (PageUp)",
      "nextMonth": "Next month (PageDown)",
      "previousYear": "Last year (Control + left)",
      "nextYear": "Next year (Control + right)",
      "previousDecade": "Last decade",
      "nextDecade": "Next decade",
      "previousCentury": "Last century",
      "nextCentury": "Next century"
    },
    "timePickerLocale": {
      "placeholder": "选择时间"
    }
  }

export default class Index extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            userName: '',
            password: '',
            checkedList: [],
            indeterminate: true,
            checkAll: false,
            dates: null || '',
            errUser: '',
            errPassword: '',
            titleName: '添加用户',
            createName: '创建用户',
            isAdd: false,
            status: 0
        }
    }
    async componentDidMount() {
        if(this.props.location.search){
            let paramsId = this.props.location.search.substring(4)
            let checkList = []
            this.setState({
                titleName: '编辑用户',
                createName: '确定修改',
                isAdd: true
            })
            const res = await getFetch(Url.addUser + '/' + paramsId, {
                id: paramsId
            })
            if(res.code == 2000){
                const platformList = res.data.platforms
                for(let i=0; i<platformList.length; i++){
                    checkList.push(platformList[i].code)
                }
                this.setState({
                    userName: res.data.username,
                    password: res.data.password,
                    dates: res.data.expireTime ? moment(Number(res.data.expireTime)) : null,
                    checkedList: checkList,
                    status: res.data.status
                })
            }
        }
    }
    onChange = (checkedList) => {
        this.setState({
          checkedList,
          indeterminate: !!checkedList.length && (checkedList.length < plainOptions.length),
          checkAll: checkedList.length === plainOptions.length,
        });
    }
    onChangeUserName = (e) => {
        let valueLength = e.target.value.length
        var reg = /^[0-9a-zA-Z]+$/
        if(!reg.test(e.target.value)){
            if(e.target.value != '') return
        }
        if(valueLength > 20){
            return
        }
        this.setState({ userName: e.target.value });
    }
    onChangePassword = (e) => {
        let valueLength = e.target.value.length
        var reg = /^[0-9a-zA-Z]+$/
        if(!reg.test(e.target.value)){
            if(e.target.value != '') return
        }
        if(valueLength > 10){
            return
        }
        this.setState({ password: e.target.value });
    }
    onStartChange = async (value) => {
        await this.setState({
            dates: value,
        })
    }
    onBlur = (key) => (e) => {
        if(key == 'username'){
            if(e.target.value.length == 0){
                this.setState({
                    errUser: '用户名不能为空'
                })
            }else if(e.target.value.length < 6){
                this.setState({
                    errUser: '用户名不能小于6位'
                })
            }else{
                this.setState({
                    errUser: ''
                })
            }
        }else if(key == 'password'){
            if(e.target.value.length == 0){
                this.setState({
                    errPassword: '密码不能为空'
                })
            }else if(e.target.value.length < 6){
                this.setState({
                    errPassword: '密码不能小于6位'
                })
            }else{
                this.setState({
                    errPassword: ''
                })
            }
        }
    }
    
    handleSubmit = async (e) => {
        e.preventDefault();
        if(this.state.userName == ''){
            this.setState({
                errUser: '用户名不能为空'
            })
            return
        }else if(this.state.userName.length < 6){
            this.setState({
                errUser: '用户名不能小于6位'
            })
            return
        }
        if(this.state.password == ''){
            this.setState({
                errPassword: '密码不能为空'
            })
            return
        }else if(this.state.password.length < 6){
            this.setState({
                errPassword: '密码不能小于6位'
            })
            return
        }
        if(this.state.checkedList.length == 0){
            message.warning('请选择平台')
            return
        }
        let res = ''
        let times
        if(this.state.dates){
            times = moment(this.state.dates).format('x')
        }
        if(this.props.location.search){
            res = await postFetch(Url.addUser, {
                id: this.props.location.search.substring(4),
                password: this.state.password,
                status: this.state.status,
                expiredTime: times || '',
                platforms: this.state.checkedList.join(',')
            }, 'put')
        }else{
            res = await postFetch(Url.addUser, {
                username: this.state.userName,
                password: this.state.password,
                expiredTime: times || '',
                platforms: this.state.checkedList.join(',')
            })
        }
        
        if(res.code == 2000){
            if(this.props.location.search){
                message.info('修改成功')
            }else{
                message.info('添加成功')
            }
            setTimeout(()=> {
                this.props.history.push('/user')
            }, 2000)
        }
    }
    disabledDate = (current) => {
        return current && current < moment().endOf('day');
    }
    disabledDateTime = () => {
        return {
            disabledHours: () => this.range(0, 24).splice(4, 20),
            disabledMinutes: () => this.range(30, 60),
            disabledSeconds: () => [55, 56],
        };
    }
    range = (start, end) => {
        const result = [];
        for (let i = start; i < end; i++) {
          result.push(i);
        }
        return result;
    }
    back = () => {
        this.props.history.push('/user')
    }
    render() {
        return (
            <Contents router={ this.props } keys="3" name={ this.state.titleName }>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem label="用户名">
                        <Input type="text" disabled={ this.state.isAdd } value={ this.state.userName } onBlur={ this.onBlur('username') } onChange={ this.onChangeUserName } placeholder="用户名长度在6-20位之间"/>
                        <span className="errmsg">{ this.state.errUser }</span>
                    </FormItem>
                    <FormItem label="密码">
                        <Input type="password" value={ this.state.password } onBlur={ this.onBlur('password') } onChange={ this.onChangePassword } placeholder="请输入密码" />
                        <span className="errmsg">{ this.state.errPassword }</span>
                    </FormItem>
                    <FormItem label="过期时间">
                        <DatePicker
                            format="YYYY-MM-DD HH:mm:ss"
                            disabledDate={this.disabledDate}
                            disabledTime={this.disabledDateTime}
                            locale={lang}
                            value={ this.state.dates }
                            onChange={ this.onStartChange } 
                            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                        />
                    </FormItem>
                    <FormItem label="平台">
                        <CheckboxGroup options={plainOptions} value={this.state.checkedList} onChange={this.onChange} />
                    </FormItem>
                    <FormItem>
                        <Button type="primary" htmlType="submit">{ this.state.createName }</Button>
                        <Button type="primary" style={{marginLeft: '10px'}} onClick={ this.back }>取消</Button>
                    </FormItem>
                </Form>
            </Contents>
        )
    }
}