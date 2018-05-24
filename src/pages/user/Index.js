import React, { Component } from "react";
import Contents from "../../components/Content";
import { Form, Icon, Input, Button, Select, Table, Pagination, Modal } from "antd";
import { Link } from 'react-router-dom';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;

import { getFetch, postFetch } from '../../../api'
import Url from '../../../api/url'
const locale = {
  filterTitle: '筛选',
  filterConfirm: '确定',
  filterReset: '重置',
  emptyText: '暂无数据',
};
export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      pageTotle: 0,
      loading: true,
      nowPage: 1,
      username: '',
      status: '',
      expired: ''
    }
  }
  componentDidMount() {
    // console.log(this.props);
    this.changePageServer()
  }
  changePageServer = async (page) => {
    if(page){page = page -1}else{page = 0} 
    await this.setState({
      loading: true
    })
    const res = await getFetch(Url.getAlluser, {
      username: this.state.username,
      status: this.state.status,
      expired: this.state.expired,
      page: page,
      size: 10
    })
    if(res.code == 2000){
      for(let i=0; i<res.data.content.length; i++){
        res.data.content[i].key = i
      }
      this.setState({
        pageTotle: res.data.totalElements,
        data: res.data.content,
        loading: false,
        nowPage: page + 1
      })
    }
  }
  handleSubmit = e => {
    e.preventDefault();
    this.changePageServer()
  }
  addUser = () => {
    this.props.history.push('/add')
  }
  changePage = (page, pageSize) => {
    this.changePageServer(page)
  }
  onChangeValue = key => (e) => {
    this.setState({
      [key]: e
    })
  }
  onChangeValueName = key => (e) => {
    this.setState({
      [key]: e.target.value
    })
  }
  delete = (id) => () => {
    const that = this
    confirm({
      title: '确定删除此条用户信息?',
      content: '',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      async onOk() {
         const res = await postFetch(Url.addUser + '/' + id, {
           id: id
         }, 'DELETE')
         if(res.code == 2000){
           that.changePageServer()
         }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  locked = (record) => async () => {
    let res = null
    if(record.status == 0){
      res = await postFetch(Url.addUser + '/' + record.id + '/lock', {
        id: record.id
      }, 'PUT')
    }else{
      res = await postFetch(Url.addUser + '/' + record.id + '/unlock', {
        id: record.id
      }, 'PUT')
    }
    if(res.code == 2000){
      this.changePageServer()
    }
  }
  render() {
    const columns = [
      { title: 'id', dataIndex: 'id', className: 'hide' },
      { title: '用户名', dataIndex: 'username' },
      { title: '状态', dataIndex: 'status', render: (obj, record)=> {
        if(obj == 0){
          return <Button type="primary" onClick={ this.locked(record) }>正常</Button>
        }else{
          return <Button type="default" onClick={ this.locked(record)}>锁定</Button>
        }
      }},
      { title: '过期时间', dataIndex: 'expireTime', render: time => {
        if(time) {
          return moment(time).format('YYYY-MM-DD HH:mm:ss')
        }else{
          return ''
        }
      }},
      { title: '创建日期', dataIndex: 'createTime', render: (time) => {
        return moment(time).format('YYYY-MM-DD HH:mm:ss')
      } },
      { title: '拥有的平台权限', dataIndex: 'platforms', render: (arr)=>{
        let platformName = ''
        for(let i=0; i<arr.length; i++){
          platformName+= arr[i].name + ','
        }
        platformName = platformName.substring(0, platformName.length -1)
        return platformName
      } },
      {
        title: '操作',
        key: 'operation',
        render: (txt, record) => {
          return (
            <div>
              <Link to={{pathname: '/add',
              search: 'id=' + record.id,
              state: { fromDashboard: true }}}>
                编辑
              </Link>
              <a className="marginLeft" onClick={ this.delete(record.id) }>删除</a>
            </div>
          )
        },
      },
    ];
    return (
      <Contents router={this.props} keys="3" name="用户管理">
        <div className="content-search">
          <Form layout="inline" onSubmit={this.handleSubmit}>
            <FormItem label="用户名">
              <Input type="text" value={ this.state.username } onChange={ this.onChangeValueName('username') } placeholder="查询用户名" />
            </FormItem>
            <FormItem label="状态">
              <Select
              placeholder="请选择状态"
              value={ this.state.status }
              onChange={ this.onChangeValue('status') }
              style={{ minWidth: '200px' }}
            >
              <Option value="">全部</Option>
              <Option value="0">正常</Option>
              <Option value="1">锁定</Option>
            </Select>
            </FormItem>
            <FormItem label="是否过期">
              <Select
                  style={{ minWidth: '200px' }}
                  placeholder="是否过期"
                  value={ this.state.expired }
                  onChange={ this.onChangeValue('expired') }
                >
                <Option value="">全部</Option>
                <Option value="1">已过期</Option>
                <Option value="0">未过期</Option>
              </Select>
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                htmlType="submit"
              >
                查询
              </Button>
              <Button
                type="primary"
                style={{marginLeft:'10px'}}
                onClick={ this.addUser }
              >
                添加用户
              </Button>
            </FormItem>
          </Form>
        </div>
        <Table columns={columns} locale={ locale } dataSource={this.state.data} pagination={false} loading={ this.state.loading } />
        <div className="page-right">
         <Pagination current={this.state.nowPage} defaultCurrent={1} pageSize={10} total={ this.state.pageTotle } onChange={ this.changePage } />
        </div>
      </Contents>
    );
  }
}
