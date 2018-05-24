import React, { Component } from "react";
import Contents from "../../components/Content";
import {
  Form,
  Icon,
  Input,
  Button,
  Select,
  Table,
  Pagination,
  Modal,
  message,
  Spin
} from "antd";
import { Link } from "react-router-dom";
import Cookie from "../../components/Util";
import moment from "moment";
import fetch from "isomorphic-fetch";
require("es6-promise").polyfill();

import { getFetch, postFetch } from "../../../api";
import Url from "../../../api/url";

const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;
const locale = {
  filterTitle: '筛选',
  filterConfirm: '确定',
  filterReset: '重置',
  emptyText: '暂无数据',
};
const plainOptions = [
  {
    label: "淘宝/天猫",
    value: "10001"
  },
  {
    label: "1688",
    value: "10002"
  },
  {
    label: "京东",
    value: "10003"
  },
  {
    label: "苏宁易购",
    value: "10004"
  },
  {
    label: "闲鱼",
    value: "10005"
  },
  {
    label: "拼多多",
    value: "10006"
  }
];
let uuid = 0;
class DynamicFieldSet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      keyword: "",
      floorPrice: 0,
      ceilingPrice: 5000,
      platforms: [],
      platform: '',
      dataSource: [],
      nowPage: 1,
      pageTotle: 0,
      loading: false,
      modal: false,
      record: { platforms: "" },
      spinLoading: false
    };
  }
  async componentDidMount() {
    const data = Cookie.getCookie("data");
    if (data) {
      this.setState({
        options: JSON.parse(data).platforms
      });
    } else {
      message.info("登录失效，请重新登录");
      setTimeout(() => {
        this.props.router.history.push("/");
      }, 2000);
    }
    this.platformsServer();
  }
  platformsServer = async page => {
    if (page) {
      page = page - 1;
    } else {
      page = 0;
    }
    await this.setState({
      loading: true
    });
    const res = await getFetch(Url.getAllJobs, {
      page: page,
      size: 10,
      keyword: this.state.keyword,
      platform: this.state.platform
    });
    if (res.code == 2000) {
      for(let i =0; i<res.data.content.length; i++){
        res.data.content[i].key = res.data.content[i].id
        if(res.data.content[i].jobItems.length != 0){
            res.data.content[i].children = res.data.content[i].jobItems
            for(let j=0; j<res.data.content[i].children.length; j++){
                res.data.content[i].children[j].key = res.data.content[i].children[j].id
            }
        }
      }
      this.setState({
        nowPage: page + 1,
        pageTotle: res.data.totalElements,
        dataSource: res.data.content
      });
      for(let i=0; i<res.data.content.length; i++){
        if(res.data.content[i].status != 2){
            this.timeout = setTimeout(()=> {
                this.platformsServer(this.state.nowPage)
            },5000)
            await this.setState({
                loading: false
            })
            return
        }
    }
    } else {
      message.info(res.message);
    }
    this.setState({
      loading: false
    });
  };
  onChange = key => e => {
    this.setState({
      [key]: e.target.value
    });
  };
  handleChange = e => {
    this.setState({
      platform: e
    });
  };
  changePage = (page, pageSize) => {
    this.platformsServer(page);
  };
  downFiles = (record, id) => async () => {
    const that = this;
    await this.setState({
      spinLoading: true
    });
    fetch(Url.downFiles + "/" + record.id + "?platformCode=" + id, {
      method: "GET",
      mode: "cors",
      headers: {
        token: Cookie.getCookie("token"),
        Accept: "application/json;charset=UTF-8"
      }
    }).then(res =>
      res.blob().then(blob => {
        var a = document.createElement("a");
        var url = window.URL.createObjectURL(blob);
        var disposition = res.headers.get("Content-Disposition");
        var filename = "";
        // var disposition = xhr.getResponseHeader('Content-Disposition');
        if (disposition && disposition.indexOf('attachment') !== -1) {
            var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            var matches = filenameRegex.exec(disposition);
            if (matches != null && matches[1]) { 
              filename = matches[1].replace(/['"]/g, '');
            }
        }
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
        that.setState({
          spinLoading: false
        });
      })
    );
  };
  componentWillUnmount(){ 
    //重写组件的setState方法，直接返回空
    this.setState = (state,callback)=>{
      return;
    };  
  }
  showPlatforms = record => {
    const platformsList = record.platforms.split(",");
    for (let i = 0; i < platformsList.length; i++) {
      for (let j = 0; j < plainOptions.length; j++) {
        if (platformsList[i] == plainOptions[j].value) {
          platformsList[i] = plainOptions[j];
        }
      }
    }
    return (
      <div>
        {platformsList.map((items, index) => {
          return (
            <p key={index}>
              {items.label}{" "}
              <a onClick={this.downFiles(record, items.value)}>下载报表</a>
            </p>
          );
        })}
      </div>
    );
  };
  openModal = modal => () => {
    this.setState({
      modal
    });
  };
  downOpen = (record, modal) => () => {
    if(record.status == 2){
      this.setState({
        modal,
        record
      });
    }else{
      message.info('搜索任务还未完成')
    }
  };
  seeChart = (record) => () => {
    if(record.status == 2){
      this.props.history.push({pathname: '/chart', search: "jobid=" + record.id})
    }else{
      message.info('搜索任务还未完成')
    }
  }
  handleSubmit = e => {
    e.preventDefault();
    this.platformsServer()
  };
  retry = (record) => async () => {
    const res = await postFetch(Url.getAllJobs + '/' + record.id + '/retry', {
        id: record.id
    }, 'PUT')
    if(res.code == 2000){
        clearTimeout(this.timeout)
        this.platformsServer(this.state.nowPage)
    }
  }
  render() {
    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
    const columns = [
      {
        title: "关键字",
        dataIndex: "keyword",
        key: "keyword"
      },
      {
        title: "最低价格",
        dataIndex: "floorPrice",
        key: "floorPrice"
      },
      {
        title: "最高价格",
        dataIndex: "ceilingPrice",
        key: "ceilingPrice"
      },
      {
        title: "查询时间",
        dataIndex: "createTime",
        key: "createTime",
        render: time => {
          return moment(time).format("YYYY-MM-DD HH:mm:ss");
        }
      },
      {
        title: "查询人",
        dataIndex: "user.username",
        key: "user.username"
      },
      {
        title: "查询状态",
        dataIndex: "status",
        key: "status",
        render: status => {
          return status == '2' ? '爬取完成' : status == '0' ? '等待抓取' : '爬取中……' 
        }
      },
      {
        title: "查询平台",
        dataIndex: "platforms",
        key: "platforms",
        render: key => {
          let keyArr = key.split(",");
          let keyName = "";
          for (let i = 0; i < keyArr.length; i++) {
            for (let j = 0; j < plainOptions.length; j++) {
              if (keyArr[i] == plainOptions[j].value) {
                keyName += plainOptions[j].label + ",";
              }
            }
          }
          keyName = keyName.substring(0, keyName.length -1)
          return keyName;
        }
      },
      {
        title: "操作",
        dataIndex: "option",
        key: "option",
        render: (txt, record) => {
          return (
            <div>
                {
                    record.user ? 
                    <div>
                      <a onClick={ this.seeChart(record) }>查看图表</a>
                      <a className="marginLeft" onClick={this.downOpen(record, true)}>
                        下载报表
                      </a>
                      {
                        record.status == "1" ? <a className="marginLeft" onClick={ this.retry(record) }>重试</a> : ''
                      }
                    </div> : ''
                }
            </div>
          );
        }
      }
    ];
    return (
      <Contents router={this.props} keys="1" name="主页">
        <div className="content-search">
          <Form onSubmit={this.handleSubmit} layout="inline">
            <FormItem label="关键字">
              <Input type="text" value={ this.state.keyword } onChange={ this.onChange('keyword') } placeholder="输入关键字" />
            </FormItem>
            <FormItem label="查询平台">
              <Select
                value={ this.state.platform }
                onChange={ this.handleChange }
                style={{ minWidth: "200px" }}
                placeholder="请选择平台"
              >
                <Option
                key='' value=''>
                  全部
                </Option>
                {this.state.options.map(items => {
                  return (
                    <Option key={items.id} value={items.code}>
                      {items.name}
                    </Option>
                  );
                })}
              </Select>
            </FormItem>
            <FormItem>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </FormItem>
          </Form>
        </div>
        <div className="home-tables">
          <Table
            dataSource={this.state.dataSource}
            loading={this.state.loading}
            defaultExpandAllRows={false}
            columns={columns}
            pagination={false}
            locale={ locale } 
          />
          <div className="page-right">
            <Pagination
              current={this.state.nowPage}
              defaultCurrent={1}
              pageSize={10}
              total={this.state.pageTotle}
              onChange={this.changePage}
            />
          </div>
        </div>
        <Modal
          title="选择平台下载"
          visible={this.state.modal}
          onCancel={this.openModal(false)}
          footer={null}
        >
          <Spin
            indicator={antIcon}
            tip="下载中……"
            spinning={this.state.spinLoading}
          >
            {this.showPlatforms(this.state.record)}
          </Spin>
        </Modal>
      </Contents>
    );
  }
}

const WrappedDynamicFieldSet = Form.create()(DynamicFieldSet);
export default WrappedDynamicFieldSet;
