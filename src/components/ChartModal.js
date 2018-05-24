import echarts from 'echarts/dist/echarts.common';

let arrayOption = {
    publicLineOption : (params)=> {
        // var dataShadow = [];
        // var yMax = 500;
        // for (var i = 0; i < params.topSaleSum.length; i++) {
        //     dataShadow.push(yMax);
        // }
        return {
            title: {
                text: params.name,
                // subtext: 'Feature Sample: Gradient Color, Shadow, Click Zoom'
            },
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            toolbox: {   
                trigger: 'axis', 
                //显示策略，可选为：true（显示） | false（隐藏），默认值为false    
                show: true, 
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },   
                //启用功能，目前支持feature，工具箱自定义功能回调处理    
                feature: {    
                    //saveAsImage，保存图片（IE8-不支持）,图片类型默认为'png'    
                    saveAsImage: {show: true, title: '保存'}    
                }    
            },
            dataZoom: [
                {
                    show: true,
                    start: 0,
                    end: 20
                },
                {
                    type: 'inside',
                    start: 0,
                    end: 20
                }
            ],
            grid: {
                left: '3%',
                right: '6%',
                bottom: '25%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: params.topSaleName,
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                z: 10,
                axisLabel :{  
                    interval:0,
                    rotate: 45
                } 
            },
            yAxis: {
                type: 'value',
            },
            series: [{
                type: 'bar',
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                    }
                },
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#83bff6'},
                                {offset: 0.5, color: '#188df0'},
                                {offset: 1, color: '#188df0'}
                            ]
                        )
                    },
                    emphasis: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#2378f7'},
                                {offset: 0.7, color: '#2378f7'},
                                {offset: 1, color: '#83bff6'}
                            ]
                        )
                    }
                },
                data: params.topSaleSum
            }]
        }
    },
    publicCicleOption: (params)=>{
        let allList = []
        for(let i=0; i<params.topSaleName.length; i++){
            allList.push({name: params.topSaleName[i], value: params.topSaleSum[i]})
        }
        return{
            title: {
                text: params.name,
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            toolbox: {    
                //显示策略，可选为：true（显示） | false（隐藏），默认值为false    
                show: true,    
                //启用功能，目前支持feature，工具箱自定义功能回调处理    
                feature: {    
                    //saveAsImage，保存图片（IE8-不支持）,图片类型默认为'png'    
                    saveAsImage: {show: true, title: '保存'}    
                }    
            },
            series: [
                {
                    name:'统计',
                    type:'pie',
                    center: ['40%', '55%'],
                    radius: ['20%', '60%'],
                    avoidLabelOverlap: false,
                    grid:{
                        top: 100,
                    },
                    label: {
                        normal: {
                            formatter: '{b}：{c}({d}%)'
                        }
                    },
                    minAngle:'10',
                    data:allList,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    color:['#e54bb0', '#fea088','#86ffd0','#ffc587','#da9bff','yellow','#7af047','ee3939']
                }
            ]
        }
    },
};
module.exports = {
    arrayOption:arrayOption
};