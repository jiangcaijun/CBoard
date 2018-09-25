// var dat = [{"pop":"99","predict_date":"2018-07-17 21","condition":"雷阵雨","temp":"24","qpf":"2.54","snow":"0.00","windLevel":"4","updatetime":"2018-07-17 19:07:03"},{"pop":"100","predict_date":"2018-07-17 22","condition":"雷阵雨","temp":"24","qpf":"3.05","snow":"0.00","windLevel":"4","updatetime":"2018-07-17 19:07:03"},{"pop":"97","predict_date":"2018-07-17 23","condition":"雷阵雨","temp":"24","qpf":"2.54","snow":"0.00","windLevel":"4","updatetime":"2018-07-17 19:07:03"},{"pop":"89","predict_date":"2018-07-18 00","condition":"雷阵雨","temp":"24","qpf":"1.52","snow":"0.00","windLevel":"4","updatetime":"2018-07-17 19:07:03"},{"pop":"72","predict_date":"2018-07-18 01","condition":"雷阵雨","temp":"24","qpf":"0.76","snow":"0.00","windLevel":"4","updatetime":"2018-07-17 19:07:03"},{"pop":"40","predict_date":"2018-07-18 02","condition":"雷阵雨","temp":"25","qpf":"0.00","snow":"0.00","windLevel":"4","updatetime":"2018-07-17 19:07:03"},{"pop":"41","predict_date":"2018-07-18 03","condition":"雷阵雨","temp":"25","qpf":"0.25","snow":"0.00","windLevel":"4","updatetime":"2018-07-17 19:07:03"},{"pop":"43","predict_date":"2018-07-18 04","condition":"雷阵雨","temp":"25","qpf":"0.25","snow":"0.00","windLevel":"4","updatetime":"2018-07-17 19:07:03"},{"pop":"11","predict_date":"2018-07-18 05","condition":"阴","temp":"25","qpf":"0.00","snow":"0.00","windLevel":"3","updatetime":"2018-07-17 19:07:03"},{"pop":"16","predict_date":"2018-07-18 06","condition":"阴","temp":"24","qpf":"0.00","snow":"0.00","windLevel":"2","updatetime":"2018-07-17 19:07:03"},{"pop":"9","predict_date":"2018-07-18 07","condition":"阴","temp":"24","qpf":"0.00","snow":"0.00","windLevel":"3","updatetime":"2018-07-17 19:07:03"},{"pop":"13","predict_date":"2018-07-18 08","condition":"阴","temp":"25","qpf":"0.00","snow":"0.00","windLevel":"3","updatetime":"2018-07-17 19:07:03"},{"pop":"5","predict_date":"2018-07-18 09","condition":"阴","temp":"26","qpf":"0.00","snow":"0.00","windLevel":"3","updatetime":"2018-07-17 19:07:03"},{"pop":"9","predict_date":"2018-07-18 10","condition":"阴","temp":"27","qpf":"0.00","snow":"0.00","windLevel":"3","updatetime":"2018-07-17 19:07:03"},{"pop":"4","predict_date":"2018-07-18 11","condition":"阴","temp":"29","qpf":"0.00","snow":"0.00","windLevel":"4","updatetime":"2018-07-17 19:07:03"},{"pop":"2","predict_date":"2018-07-18 12","condition":"阴","temp":"30","qpf":"0.00","snow":"0.00","windLevel":"3","updatetime":"2018-07-17 19:07:03"},{"pop":"9","predict_date":"2018-07-18 13","condition":"阴","temp":"30","qpf":"0.00","snow":"0.00","windLevel":"4","updatetime":"2018-07-17 19:07:03"},{"pop":"12","predict_date":"2018-07-18 14","condition":"阴","temp":"31","qpf":"0.00","snow":"0.00","windLevel":"4","updatetime":"2018-07-17 19:07:03"},{"pop":"9","predict_date":"2018-07-18 15","condition":"少云","temp":"33","qpf":"0.00","snow":"0.00","windLevel":"4","updatetime":"2018-07-17 19:07:03"},{"pop":"3","predict_date":"2018-07-18 16","condition":"少云","temp":"33","qpf":"0.00","snow":"0.00","windLevel":"5","updatetime":"2018-07-17 19:07:03"},{"pop":"8","predict_date":"2018-07-18 17","condition":"少云","temp":"33","qpf":"0.00","snow":"0.00","windLevel":"5","updatetime":"2018-07-17 19:07:03"},{"pop":"13","predict_date":"2018-07-18 18","condition":"少云","temp":"33","qpf":"0.00","snow":"0.00","windLevel":"4","updatetime":"2018-07-17 19:07:03"},{"pop":"23","predict_date":"2018-07-18 19","condition":"少云","temp":"31","qpf":"0.00","snow":"0.00","windLevel":"5","updatetime":"2018-07-17 19:07:03"}];

//天气折线图1
function InitWeatherLineCharts(container,datas) {
    var weatherTempArry = [];
    var weatherTimeArry = [];
    var condition = [];
    // debugger
    if(datas == '' || datas == [] || datas == undefined){
        weatherTempArry =['0°C','20°C'];
        weatherTimeArry =['该城市数据尚未采集'];
        condition = [''];
    }else {
        datas.forEach((o,i)=>{
            weatherTimeArry.push((o.predict_date).slice(8).replace(/ /,'T '));
            weatherTempArry.push(o.temp);
            condition.push(o.condition);
        })
    }
    var arr_ = [];
    // var sad = 'image://org/cboard/view/custom/static/imgs/weather_48/cloudy_day.png';
    weatherTempArry.forEach((o,i)=>{
            arr_.push({
            value: o,
            symbol: LineWearterTpye(condition[i]),
            symbolSize: [30, 30]
        })
    })
    weatherTempArry = arr_;
    var LineChart1 = echarts.init(document.getElementById(container));
    option = {
        tooltip : {
            trigger: 'axis',
            // backgroundColor: 'silver',
            // textStyle:{color:'#ffffff',align:'center',fontSize: 15,},
            formatter: function (params) {
                var param = params[0];
                var indexe = param.dataIndex;
                var htmls = '';
                htmls += '<div>';
                htmls += '<p style="text-align: center;">'+weather_icn(condition[indexe])+condition[indexe]+'</p>';
                htmls += param.name+'时'+'</br>'+'气温 ：'+param.value +'°C';
                htmls += '</div>';
                return htmls;

            }
        },
        xAxis: {
            type: 'category',
            data: weatherTimeArry,
            axisLabel:{
                interval:2,
                // rotate:15,
                formatter: '{value}(时)'
            }
        },
        yAxis: [{
            type: 'value',
            axisLabel:{
                formatter: '{value} °C'
            },
            splitNumber:3
        }],
        series: [
            {
            type: 'line',
            data: weatherTempArry,
            itemStyle : {
                normal: {
                    label : {
                        show: true,
                        formatter:function (params) {
                            var indexe = params.dataIndex;
                            var value_temp = params.value;
                            var icn_ = condition[indexe];
                            return icn_ +' '+ value_temp+'°C';
                        }
                    }
                }
            }
        }]
    };

    LineChart1.setOption(option);
}
//天气折线图2
function InitWeatherLineCharts2(container,datas) {
    var cotent = "#"+container;
    var brr1=[];
    var brr2=[];
    if(datas == '' || datas == null){
        var sat3 = '<p style="text-align: center;font-size: 20px;margin-top: 20px;">该城市数据尚未采集</p>';
        $(cotent).append(sat3)
    }else {
        if(datas.length == '23'){
            for(var i=0;i<datas.length/2;i++){
                brr1[i]=datas[i];
                brr2[i]=datas[i+(datas.length+1) /2];
            }
        }else {
            for(var i=0;i<datas.length/2;i++){
                brr1[i]=datas[i];
                brr2[i]=datas[i+datas.length /2];
            }
        }
        brr1.forEach((o,i)=>{
            sta1 = `<div class="weatherBox">
                <p>${(o.predict_date).slice(11)}时</p>
                <p>${weather_icn_16(o.condition)}</p>
                <p>${o.condition}</p>
                <p>${o.temp}°C</p>
                <p>${o.windLevel}级</p>
            </div>`;

        $(cotent).find('.wbf_1').append(sta1);
        })
            brr2.forEach((o,i)=>{
                if(o == undefined){
                return false;
            }
            sta2 = `<div class="weatherBox">
                    <p>${(o.predict_date).slice(11)}时</p>
                    <p>${weather_icn_16(o.condition)}</p>
                    <p>${o.condition}</p>
                    <p>${o.temp}°C</p>
                    <p>${o.windLevel}级</p>
                </div>`;
            $(cotent).find('.wbf_2').append(sta2);
        })
    }


}

//接单率折线图
function InitJiedanLineCharts(container,datas) {
    var datTime = [];
    var receiveOrder24 = [];
    var receiveOrder = [];

    if(datas =='' || datas.length < 48){
        datTime =['数据暂无'];
        var receiveOrder24 = ['0','0'];
        var receiveOrder = ['0','0'];
    }else {
        for(var t=0;t<datas.length/2;t++){
            receiveOrder24[t]=datas[t].receive_order_rate;
            receiveOrder[t]=datas[t+datas.length /2].receive_order_rate;
            datTime[t] =datas[t+datas.length /2].date;
            // datTime[t] =datas[t+datas.length /2].date.substring(datas[t+datas.length /2].date.length-2);
        }
        console.log(receiveOrder24,receiveOrder)
    }
    var LineChart2 = echarts.init(document.getElementById(container));
    option = {
        tooltip : {
            trigger: 'axis',
            formatter: function (parmas) {
                // debugger
                var htmls = '';
                for(var i=0;i<parmas.length;i++){
                    var param = parmas[i];
                    var val = ((Math.floor(param.value * 100) / 100) * 100).toFixed(0);
                    htmls += '<div>';
                    htmls += param.name.substring(param.name.length-2)+'时' + '</br>'+param.seriesName +':'+val+'%';
                    htmls += '</div>';
                }
                return htmls
            }
        },
        legend: {
            data:['当日过去24小时','昨日过去24小时'],
            top:30
        },
        xAxis: {
            type: 'category',
            data: datTime,
            axisLabel:{
                interval:4,
                formatter:function(params){
                    return params.slice(0, 10)
                }
            }
        },
        yAxis: [
            {
                type: 'value',
                axisLabel:{
                    formatter: function (params) {
                        return (params * 100) +'%';
                    }
                }
            }
        ],
        series: [{
            name:'当日过去24小时',
            data: receiveOrder,
            type: 'line'
        },{
            name:'昨日过去24小时',
            type:'line',
            data:receiveOrder24
        }]
    };

    LineChart2.setOption(option);
}

//昨日指标
function InitYesdayLineCharts(container,number) {
    var LineChart3 = echarts.init(document.getElementById(container));
    option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                }
            }
        },
        // toolbox: {                 //辅助工具切换
        //     feature: {
        //         dataView: {show: true, readOnly: false},
        //         magicType: {show: true, type: ['line', 'bar']},
        //         restore: {show: true},
        //         saveAsImage: {show: true}
        //     }
        // },
        // legend: {
        //     data:['蒸发量','降水量','平均温度'] //头部文字
        // },
        xAxis: [
            {
                type: 'category',
                data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],   //时间
                axisPointer: {
                    type: 'shadow'
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                // name: '水量',
                min: 0,
                max: 250,
                interval: 50,
                axisLabel: {
                    formatter: '{value} '
                }
            },
            {
                type: 'value',
                // name: '温度',
                min: 0,
                max: 25,
                interval: 5,
                axisLabel: {
                    formatter: '{value} °C'
                }
            }
        ],
        series: [
            {
                name:'蒸发量',
                type:'bar',
                data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
            },
            // {
            //     name:'降水量',
            //     type:'bar',
            //     data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
            // },
            {
                name:'平均温度',
                type:'line',
                yAxisIndex: 1,
                data:[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
            }
        ]
    };

    LineChart3.setOption(option);
}