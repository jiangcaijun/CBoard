
//仪表盘
function InitGaugeCharts(container,number) {
    var GaugeChart = echarts.init(document.getElementById(container));
    option = {
        tooltip : {
            formatter: "{a} <br/>{b} : {c}%"
        },
        series: [
            {
                name: '接单率',
                type: 'gauge',
                radius: '55%',
                // splitNumber:11,
                axisLine: {
                    lineStyle: {
                        width: 10 ,// 这个是修改宽度的属性
                        color:[[0.2, '#c23531'],[0.5, '#d4df1d'], [0.8, '#63869e'], [1, '#91c7ae']]
                    }
                },
                pointer : { //指针样式
                    length: '50%',
                    width:6
                    // shadowColor:'red'
                },
                axisTick : { //刻度线样式（及短线样式）
                    // show:false,
                    length : 10
                },
                axisLabel : { //文字样式（及“10”、“20”等文字样式）
                    show:false,
                    color : "black",
                    distance : 0//文字离表盘的距离
                },
                detail: {
                    formatter:'{value}%',
                    offsetCenter: [0, "60%"],
                    textStyle : {
                        color : "red",
                        fontFamily : "微软雅黑",
                        fontSize : 20
                    }

                },
                data: [{value: number, name: '接单率'}]
            }
        ]
    };
    GaugeChart.setOption(option);
}