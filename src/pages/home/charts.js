import React, { Component, PureComponent } from 'react'
import Contents from '../../components/Content'
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, DatePicker, message } from 'antd';
import moment from 'moment'
import { Link } from 'react-router-dom';

import { getFetch, postFetch } from '../../../api'
import Url from '../../../api/url'

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;
const { MonthPicker, RangePicker } = DatePicker;

import { PublicLine, PublicCicleInit } from '../../components/ChartLine'


export default class Index extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            topSaleSum: [],
            topSaleName: [],
            topSaleSums: [],
            topSaleNames: [],
            topProvinceSellerSum: [],
            topProvinceSellerName: [],
            topProvinceSaleSum: [],
            topProvinceSaleName: [],
            topProvinceSaleSums: [],
            topProvinceSaleNames: [],
            totleSum: 50
        }
    }
    async componentDidMount() {
        this.renderRepeat()
    }
    renderRepeat = async () => {
        if(this.props.location.search){
            let paramsId = this.props.location.search.substring(7)
            const res = await getFetch(Url.getAllJobs + '/' + paramsId, {
                id: paramsId
            })
            if(res.code == 2000){
                let topSaleSum = [], topSaleName = [], topSaleSums = [],  topSaleNames = []
                let topProvinceSellerSum = [], topProvinceSellerName = []
                let topProvinceSaleSum = [], topProvinceSaleName = []
                let topProvinceSaleSums = [], topProvinceSaleNames = []
                const topSaleList = JSON.parse(res.data.topSale)
                const topSaleLists = JSON.parse(res.data.topSales)
                const topProvinceSellerList = JSON.parse(res.data.topProvinceSeller)
                const topProvinceSaleList = JSON.parse(res.data.topProvinceSale)
                const topProvinceSalesList = JSON.parse(res.data.topProvinceSales)
                for(let i=0; i<topSaleList.length; i++){
                    let totlePrice = topSaleList[i].price * topSaleList[i].sales
                    if(String(totlePrice).indexOf(".") != -1){
                        totlePrice = (topSaleList[i].price * topSaleList[i].sales).toFixed(2)
                    }
                    topSaleSum.push(totlePrice) 
                    topSaleName.push(topSaleList[i].sellerName)
                }
                for(let i=0; i<topSaleLists.length; i++){
                    topSaleSums.push(topSaleLists[i].sales) 
                    topSaleNames.push(topSaleLists[i].sellerName)
                }
                for(let i=0; i<topProvinceSellerList.length; i++){
                    topProvinceSellerSum.push(topProvinceSellerList[i].value) 
                    topProvinceSellerName.push(topProvinceSellerList[i].key)
                }
                for(let i=0; i<topProvinceSaleList.length; i++){
                    topProvinceSaleSum.push(topProvinceSaleList[i].value) 
                    topProvinceSaleName.push(topProvinceSaleList[i].key)
                }
                for(let i=0; i<topProvinceSalesList.length; i++){
                    topProvinceSaleSums.push(topProvinceSalesList[i].value) 
                    topProvinceSaleNames.push(topProvinceSalesList[i].key)
                }
                this.setState({
                    topSaleSum: topSaleSum.splice(0, this.state.totleSum),
                    topSaleName: topSaleName.splice(0, this.state.totleSum),
                    topSaleSums: topSaleSums.splice(0, this.state.totleSum),
                    topSaleNames: topSaleNames.splice(0, this.state.totleSum),
                    topProvinceSellerSum: topProvinceSellerSum.splice(0, this.state.totleSum),
                    topProvinceSellerName: topProvinceSellerName.splice(0, this.state.totleSum),
                    topProvinceSaleSum: topProvinceSaleSum.splice(0, this.state.totleSum),
                    topProvinceSaleName: topProvinceSaleName.splice(0, this.state.totleSum),
                    topProvinceSaleSums: topProvinceSaleSums.splice(0, this.state.totleSum),
                    topProvinceSaleNames: topProvinceSaleNames.splice(0, this.state.totleSum)
                })
            }
        }
    }
    onChange = async (value) => {
        await this.setState({
            totleSum: value
        })
        this.renderRepeat()
    }
    backHome = () => {
        return (
            <span>
                <span>显示条数：</span>
                <Select label="显示条数" className="pagelength" value={ this.state.totleSum } onChange={ this.onChange }>
                    <Option value="10">10</Option>
                    <Option value="20">20</Option>
                    <Option value="30">30</Option>
                    <Option value="40">40</Option>
                    <Option value="50">50</Option>
                </Select>
                <Link to="/home">返回首页</Link>
            </span>
        )
    }
    render() {
        const topSale = {
            topSaleSum: this.state.topSaleSum,
            topSaleName: this.state.topSaleName,
            name: '卖家销售额TOP排名'
        }
        const topSales = {
            topSaleSum: this.state.topSaleSums,
            topSaleName: this.state.topSaleNames,
            name: '卖家销售量TOP排名'
        }
        const topProvinceSeller = {
            topSaleSum: this.state.topProvinceSellerSum,
            topSaleName: this.state.topProvinceSellerName,
            name: '按省份区域划分卖家数量'
        }
        const topProvinceSale = {
            topSaleSum: this.state.topProvinceSaleSum,
            topSaleName: this.state.topProvinceSaleName,
            name: '按省份区域划分销售额TOP排名'
        }
        const topProvinceSales = {
            topSaleSum: this.state.topProvinceSaleSums,
            topSaleName: this.state.topProvinceSaleNames,
            name: '按省份区域划分销售量TOP排名'
        }
        return (
            <Contents router={ this.props } keys="0" name="图表展示" otherName={ this.backHome() }>
                <div className="flex-chart">
                    <PublicLine params={ topSale } />
                </div>
                <div className="flex-chart">
                    <PublicLine params={ topSales } />
                </div>
                <div className="flex-chart cicle">
                    <PublicLine params={ topProvinceSeller } />
                </div>
                <div className="flex-chart">
                    <PublicLine params={ topProvinceSale } />
                </div>
                <div className="flex-chart">
                    <PublicLine params={ topProvinceSales } />
                </div>
            </Contents>
        )
    }
}