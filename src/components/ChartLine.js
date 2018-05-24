import React , {Component} from 'react';
import ReactEcharts from 'echarts-for-react';
import {arrayOption} from './ChartModal';

// 堆叠图
export class PublicLine extends Component {
    constructor (props){
        super(props);
        var me = this;
        me.getOption  = me.getOption.bind(me);
    }

    getOption () {
        return arrayOption.publicLineOption(this.props.params);
    }

    onChartClick = (param, echarts) => {
        var zoomSize = 6;
        echarts.dispatchAction({
            type: 'dataZoom',
            startValue: this.props.params.topSaleName[Math.max(param.dataIndex - zoomSize / 2, 0)],
            endValue: this.props.params.topSaleName[Math.min(param.dataIndex + zoomSize / 2, this.props.params.topSaleSum.length - 1)]
        });
    };
    render(){
        var me = this;
        let onEvents = {
            'click': this.onChartClick,
            'legendselectchanged': this.onChartLegendselectchanged
        };
        return (
            <ReactEcharts option={me.getOption()}
                          notMerge={true}
                          lazyUpdate={true}
                          theme={"theme_name"}
                          onChartReady={me.onChartReadyCallback}
                          onEvents={onEvents}  />
        );
    }
}


// 饼图
export class PublicCicleInit extends Component {
    constructor (props){
        super(props);
        var me = this;
        me.getOption  = me.getOption.bind(me);
    }

    getOption () {
        return arrayOption.publicCicleOption(this.props.params);
    }
    onChartClick = (param, echarts) => {
        var zoomSize = 6;
        echarts.dispatchAction({
            type: 'dataZoom',
            startValue: this.props.params.topSaleName[Math.max(param.dataIndex - zoomSize / 2, 0)],
            endValue: this.props.params.topSaleName[Math.min(param.dataIndex + zoomSize / 2, this.props.params.topSaleSum.length - 1)]
        });
    };
    render(){
        var me = this;
        let onEvents = {
            'click': this.onChartClick,
            'legendselectchanged': this.onChartLegendselectchanged
        };
        return (
            <ReactEcharts option={me.getOption()}
                          notMerge={true}
                          lazyUpdate={true}
                          style={{height: 300}}
                          onChartReady={me.onChartReadyCallback}
                          onEvents={onEvents}  />
        );
    }
}