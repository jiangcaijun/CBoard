
$.ajax({
    url:'bmap/data4OneCity.do',
    type:'POST',
    data:{
        city_id: "0156"
    },
    success: function (result) {
        console.log(result)
        if(result.data == null){
            return false;
        }else {
            conturyData(result.data[0]);
            $('.update_time').html(result.createDate);
            InitGaugeCharts('name1_0156',small_number_no(result.data[0].reception_probability))
        }
    }
})
// 天气类型
$(document).ready(function(){
    ajaxThen('03e86744-898b-11e8-82ef-860ba3137511').then((res)=>{
        var htmlWeather = "";
        WeatherType = res;
        $.each(WeatherType, function(index, content){
            var dataObj =content ;
            // console.log(dataObj)
            htmlWeather += "<option value='"+ dataObj.status +"'>"+ dataObj.status +"</option>";
        });
        $('#monitor_select_weather').append(htmlWeather);
        $('#monitor_select_weather2').append(htmlWeather);
    })
});
var sattusClick = true;
$('.city_box').on('click','.hour_weather',function (e) {
    // debugger
    var cityNameText = $(this).parent().parent().parent().parent().parent().children().children().children('.cityes_name').text();
    $(this).parent().siblings().children().children('.LineCharts1').show();
    $(this).parent().siblings().children().children('.LineCharts2').hide();
    $(this).parent().siblings().children().children('.LineCharts3').hide();
    $(this).addClass('btn_active');
    $(this).siblings().removeClass('btn_active');
    if(cityNameText == '北京市' || cityNameText == '上海市' || cityNameText == '成都市' || cityNameText == '广州市' || cityNameText == '深圳市' || cityNameText == '杭州市'){
        $(this).parent().parent().parent().parent().parent().stop().animate({ height:"370px"},1000);
    }
})
$('.city_box').on('click','.hour_probability',function () {
    $(this).parent().siblings().children().children('.LineCharts2').show();
    $(this).parent().siblings().children().children('.LineCharts1').hide();
    $(this).parent().siblings().children().children('.LineCharts3').hide();
    $(this).addClass('btn_active');
    $(this).siblings().removeClass('btn_active');
    $(this).parent().parent().parent().parent().parent().stop().animate({ height:"240px"},1000)
})
$('.city_box').on('click','.yesday_data',function () {
    $(this).parent().siblings().children().children('.LineCharts3').show();
    $(this).parent().siblings().children().children('.LineCharts1').hide();
    $(this).parent().siblings().children().children('.LineCharts2').hide();
    $(this).addClass('btn_active');
    $(this).siblings().removeClass('btn_active');
})
                                                                        //判断消失单位
function display_i(){
    var monoRate = $('#mono_rate').val();
    if(monoRate.indexOf('rate') == '-1' && monoRate.indexOf('probability') == '-1'){
        $('.i_disp').hide();
    }else {
        $('.i_disp').show();
    }
    $('.star_rate').val('');
    $('.end_rate').val('');
}
                                                                        //判断提示文字
function fontDisply() {
    var star = $('.star_rate').val();
    var end = $('.end_rate').val();
    if(star == '' && end == '' || star == '' && end || star && end == '' || Number(star) < Number(end)){
        $('.erroFont').hide();
    }else{
        $('.erroFont').show();
    }
}
                                                                        //长线地图状态数据更改   21状态
function mapAllDate(data) {
    console.log(data)
    $('.not_receive_orders').html(data[0].day_not_receive_orders);
    $('.total_waiting_couriers').html(data[0].day_total_waiting_couriers);
    $('.total_pay_orders').html(data[0].day_total_pay_orders);
    $('.total_receive_orders').html(data[0].day_total_receive_orders);
    $('.reception_probability').html(small_number(data[0].reception_probability));

}
                                                                        //长线天气状态数据更改   30状态
function weatherSt(id,data) {
    var weatherStatus_='.weatherStatus_'+id;
    var weatherTemp_ = '.weatherTemp_'+id;
    var weatherWindLevel_ = '.weatherWindLevel_'+id;
    $(weatherStatus_).html(weather_icn(data.condition)+data.condition);
    $(weatherTemp_).html(data.temp);
    $(weatherWindLevel_).html(data.windLevel);
}
                                                                       //长线接单率折线图  22状态
function jiedanLine(id,data) {
    var content_id = 'name3_' + id;
    var MyLineChaerts = echarts.init(document.getElementById(content_id));
    var option = MyLineChaerts.getOption();
    // debugger
    var optionxAxisData = option.xAxis[0].data;
    var option0series = option.series[0].data;     //过去24小时
    var option1series = option.series[1].data;     //环比同期24
    var sun_ = optionxAxisData.indexOf(data.date);
    if(sun_ > -1 ){
        optionxAxisData.splice(sun_,1);
        optionxAxisData.splice(sun_,0,data.date)   //时间
        option0series.splice(sun_,1);
        option0series.splice(sun_,0,data.receive_order_rate)     //接单率
        // option1series.splice(sun_,1);
        // option1series.splice(sun_,0,data.finish_order_rate)    // 完成率
        MyLineChaerts.setOption(option);
    }else {

        optionxAxisData.shift();
        optionxAxisData.push(data.date)   //时间

        option1series.push(option0series[0]);        //环期同比增加一个到尾部
        option1series.shift();                       //环期同比删除一个头部

        option0series.shift();
        option0series.push(data.receive_order_rate)     //接单率

        // option1series.shift();
        // option1series.push(data.finish_order_rate)    // 完成率
        MyLineChaerts.setOption(option);
    }
}
                                                                     //长线各城市更改数值变化  21 and 20状态
function classSetDate(id,data){
    var classData_1='.total_pay_'+id;
    var classData_2='.total_receive_'+id;
    var classData_3='.total_finish_'+id;
    var classData_4='.not_receive_'+id;
    var classData_5='.total_waiting_'+id;
    var classData_6='.reception_rate_'+id;
    var classData_7='.completion_rate_'+id;
    var classData_8='.cancellation_rate_'+id;
    var classData_9='.supply_'+id;

    var total_pay_ = Number($(classData_1).text().replace(/,/g,''));
    var total_receive_ = Number($(classData_2).text().replace(/,/g,''));
    var total_finish_ = Number($(classData_3).text().replace(/,/g,''));
    var not_receive_ = Number($(classData_4).text().replace(/,/g,''));
    var total_waiting_ = Number($(classData_5).text().replace(/,/g,''));
    var reception_rate_ = $(classData_6).text();
    var completion_rate_ = $(classData_7).text();
    var cancellation_rate_ = $(classData_8).text();
    var supply_ = $(classData_9).text();

    if((data[0].day_total_pay_orders) !== total_pay_){
        $(classData_1).addClass('spanChange');
        $(classData_1).html(filter_number_(data[0].day_total_pay_orders));
    }
    if((data[0].day_total_receive_orders) !== total_receive_){
        $(classData_2).addClass('spanChange');
        $(classData_2).html(filter_number_(data[0].day_total_receive_orders));
    }
    if((data[0].day_total_finish_orders) !== total_finish_){
        $(classData_3).addClass('spanChange');
        $(classData_3).html(filter_number_(data[0].day_total_finish_orders));
    }
    if((data[0].day_not_receive_orders) !== not_receive_){
        $(classData_4).addClass('spanChange');
        $(classData_4).html(filter_number_(data[0].day_not_receive_orders));
    }
    if((data[0].day_total_waiting_couriers) !== total_waiting_){
        $(classData_5).addClass('spanChange');
        $(classData_5).html(filter_number_(data[0].day_total_waiting_couriers));
    }
    if(small_number(data[0].reception_probability) !== reception_rate_){
        $(classData_6).addClass('spanChange');
        $(classData_6).html(small_number(data[0].reception_probability));
    }
    if(small_number(data[0].completion_rate) !== completion_rate_){
        $(classData_7).addClass('spanChange');
        $(classData_7).html(small_number(data[0].completion_rate));
    }
    if(small_number(data[0].cancellation_rate) !== cancellation_rate_){
        $(classData_8).addClass('spanChange');
        $(classData_8).html(small_number(data[0].cancellation_rate));
    }
    if(data[0].supply_demand_ratio !== supply_){
        $(classData_9).addClass('spanChange');
        $(classData_9).html(data[0].supply_demand_ratio);
    }
    var dispNone = setTimeout(function () {
        $('.disnone').removeClass('spanChange');
        dispNone = null;
    },2000)

}
                                                                    //全国数值变化
function conturyData(datas) {
    $('.coutry_total_pay').html(filter_number_(datas.day_total_pay_orders));     //支付单
    $('.coutry_total_receive').html(filter_number_(datas.day_total_receive_orders));   //接收单
    $('.coutry_total_finish').html(filter_number_(datas.day_total_finish_orders));   //完成单
    $('.coutry_not_receive').html(filter_number_(datas.day_not_receive_orders));    //未接单
    $('.coutry_total_waiting').html((datas.day_total_waiting_couriers));       //空闲
    $('.coutry_probability').html(small_number(datas.reception_probability));     //接单率
    $('.coutry_completion_rate').html(small_number(datas.completion_rate));           //完成率
    $('.coutry_ancellation_rate').html(small_number(datas.cancellation_rate));         //取消率
    $('.coutry_supply').html(filter_number_(datas.supply_demand_ratio));

}
var setIntervalTime = null;
var setIntervalTimer;
                                                                                // 仪表盘变化   20状态
function gaugeChartsDate(id,data){
    var content_id = 'name1_' + id;
    var MyChaerts = echarts.init(document.getElementById(content_id));
    var option = MyChaerts.getOption();
    option.series[0].data[0].value = small_number_no(data[0].reception_probability);
    MyChaerts.setOption(option);
}

function setTime(){
    setIntervalTimer = setInterval(function () {
        if(setIntervalTime > 0){
            setIntervalTime --;
            // console.log(setIntervalTime)
        }else if(setIntervalTime == 0){
            clearInterval(setIntervalTimer);
            seacherAllDate();
        }
    },1000)
}
// window.onhashchange=function(){
//     console.log('跳转了')
//     debugger
//     if(document.URL == document.URL){
//         clearInterval(setIntervalTimer)
//     }else {
//         clearInterval(setIntervalTimer)
//     }
//
// }
var setTime_out = setTimeout(function () {
    // debugger
    setIntervalTime = 1200;
    setTime();
    setTime_out = null;
},1100)
// seacherAllDate()
                                            //查询
function seacherAllDate() {
    // clearInterval(setIntervalTimer);
    $('.allDatas').html(0)
    $(".city_box").empty();
    var citySelectVal = $('#monitor_city_name').val()? $('#monitor_city_name').val().toString() : '';
    var cityNa=$("#monitor_city_name").select2("data");
    var cityid = '';
    if(citySelectVal == ''){
        cityid='0156';
        localstorage_search(all_cityis.toString())
        citysData(all_cityis.toString());
    }else {
        var cityArry = $('#monitor_city_name').val();
        if($.inArray('', cityArry) > -1){
            cityid = citySelectVal+',0156';
            localstorage_search(all_cityis.toString())
            citysData(all_cityis.toString());
        }else {
            cityid = citySelectVal+',0156';
            localstorage_search(citySelectVal)
            citysData(citySelectVal);
        }
    }
    var as = setTimeout(function () {
        sends($('.citys_ids').text().replace(/ /g, ','),'');
        as =null
    },2000)
    clearInterval(setIntervalTimer);
    setIntervalTime = 1200;
    setTime();
}
                                            //查询转化
function citysData(cityVal) {
    var filed4Range= $('#mono_rate').val();
    var startNum = $('.star_rate').val();
    var endNum = $('.end_rate').val();
    var weatherStatus4Condition = $('.monitorW_').val()? $('.monitorW_').val():[' '];
    var weatherStatus4Forecast24Hour = $('.foreactW_').val()? $('.foreactW_').val():[' '];
    if(startNum != '' || endNum != ''){
        if($(".i_disp").is(":hidden") == false){
            startNum = $('.star_rate').val() ? $('.star_rate').val() / 100:'';
            endNum = $('.end_rate').val() ? $('.end_rate').val() / 100:'';
        }else {
            startNum = $('.star_rate').val();
            endNum = $('.end_rate').val();
        }
    }else {
        startNum = '';
        endNum = '';
    }
    var flag4Sort = $("#sort_u[type='checkbox']").is(':checked');
    if(weatherStatus4Condition.indexOf('') >-1){
        weatherStatus4Condition = '';
    }else {
        weatherStatus4Condition = weatherStatus4Condition.toString();
    }
    if(weatherStatus4Forecast24Hour.indexOf('') >-1){
        weatherStatus4Forecast24Hour = '';
    }else {
        weatherStatus4Forecast24Hour = weatherStatus4Forecast24Hour.toString();
    }
    $.ajax({
        beforeSend: function(){
            $(".heen_2").show();
        },
        url:MonitUrl,
        type:'POST',
        data:{
            city_ids : cityVal,
            weatherStatus4Condition,
            weatherStatus4Forecast24Hour,
            filed4Range,
            startNum,
            endNum,
            flag4Sort,
            size:6,
            offset:0
        },
        success: function (result) {
            // console.log(result)
            $('.allDatas').html(result.total)
            citys_data(result)
            pagetionInit(result)
        }
    })
}
//个城市数据转化
function citys_data(result) {
    $(".heen_2").hide();
    var citys_data = result.rt_city_operation;
    var weather_status = result.weather_conditon;
    var weather_24 = result.weather_forecast24Hour;
    var last_24hour = result.last_24hour;
    // var last_24hour =lskd;
    // console.log(last_24hour)
    if(citys_data == null && weather_status == null && weather_24 == null && last_24hour == null ){
        console.log('该条件下暂无数据')
        var strs_ = '<p style="text-align: center;font-size: 20px">该条件下暂无数据</p>'
        $('.city_box').append(strs_);
    }else {
        citys_data.forEach((o,i)=>{
            var GaugeChart_1 = 'name1_'+o.city_id;
        var LineChart_1 = 'name2_'+o.city_id;
        var LineChart_2 = 'name3_'+o.city_id;
        var LineChart_3 = 'name4_'+o.city_id;
        if(weather_status[i] == undefined ||weather_status[i] == null || weather_status[i] == []){
            weather_status[i] ={
                "condition":"数据尚未采集",
                "temp":"~~",
                "windLevel":"~~"
            };
        }
        let strs = `
                            <div class="cityes_lie">
                                <div class="can_1">
                                    <div class="">
                                        <p class="cityes_name"><b>${citys_data[i].city_name}</b></p>
                                    </div>
                                    <div class="weather_name">
                                        <p class="weatherStatus_${citys_data[i].city_id}">${weather_icn(weather_status[i].condition)}${weather_status[i].condition}</p>
                                        <p class="citys_ids" style="display:none;">${citys_data[i].city_id} </p>   
                                        <p class="font_weather">气温： <span class="weatherTemp_${citys_data[i].city_id}">${weather_status[i].temp}</span> °C</p>
                                        <p class="font_weather">风力：<span class="weatherWindLevel_${citys_data[i].city_id}">${weather_status[i].windLevel}</span>级</p>
                                    </div>
                                </div>
                                <div class="can_2">
                                    <div class="all_city_realdata">
                                        <p class="all_city_realdata_font"><b>实时:</b></p>
                                        <div class="all_city_realdata_">
                                            <ul class="city_realdata_ul">
                                                    <li><b>支付单 </b><span class="disnone total_pay_${citys_data[i].city_id}">${filter_number_(citys_data[i].day_total_pay_orders)}</span></li>
                                                    <li><b>接收单 </b><span class="disnone total_receive_${citys_data[i].city_id}">${filter_number_(citys_data[i].day_total_receive_orders)}</span></li>
                                                    <li><b>完成单 </b><span class="disnone total_finish_${citys_data[i].city_id}">${filter_number_(citys_data[i].day_total_finish_orders)}</span></li>
                                                    <li><b>未接单 </b><span class="disnone not_receive_${citys_data[i].city_id}">${filter_number_(citys_data[i].day_not_receive_orders)}</span></li>
                                                    <li><b>空闲运力 </b><span class="total_waiting_${citys_data[i].city_id}">${filter_number_(citys_data[i].day_total_waiting_couriers)}</span></li>
                                                </ul>
                                                <ul class="city_realdata_ul">
                                                    <li><b>接单率 </b><span class="disnone reception_rate_${citys_data[i].city_id}">${small_number(citys_data[i].reception_probability)}</span></li>
                                                    <li><b>完成率 </b><span class="disnone completion_rate_${citys_data[i].city_id}">${small_number(citys_data[i].completion_rate)}</span></li>
                                                    <li><b>取消率 </b><span class="disnone cancellation_rate_${citys_data[i].city_id}">${small_number(citys_data[i].cancellation_rate)}</span></li>
                                                    <li><b>供需比 </b><span class="disnone supply_${citys_data[i].city_id}">${citys_data[i].supply_demand_ratio}</span></li>
                                                </ul>
                                        </div>
                                    </div>
                                    <div class="all_city_forecastdata ">
                                        <p class="city_forecastdata_tittle"></p>
                                        <div class="right_" style="width:90%;">
                                            <div class="btn_table">
                                                <p class="hour_weather btn_qie ">未来24小时天气预报</p>
                                                <p class="hour_probability btn_qie btn_active">过去24小时接单率</p>
                                            </div>
                                            <div class="cityes_forecastdata_">
                                                <div class="charts_line">
                                                    <div class="LineCharts1" id="LineChart_1">
                                                        <div class="wbf_" id="">
                                                            <div class="wbf_1" id="">
                                                                
                                                            </div>
                                                            <div class="wbf_2" id="">
                                                                
                                                            </div>
                                                        </div>
                                                        
                                                    </div>
                                                    <div class="LineCharts2" id="LineChart_2" style="width:710px;height:200px;"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="can_3">
                                    <div class="cityes_charts_guage">
                                        <div class="all_city_charts_" id="GaugeCharts1" style="width:600px;height:200px;"></div>
                                    </div>
                                </div>
                            </div>
                        `;
        $('.city_box').append(strs);
        $("#LineChart_1").attr('id',LineChart_1);
        $("#LineChart_2").attr('id',LineChart_2);
        $("#LineChart_3").attr('id',LineChart_3);
        $("#GaugeCharts1").attr('id',GaugeChart_1);

        InitWeatherLineCharts2(LineChart_1,weather_24[i])
        InitJiedanLineCharts(LineChart_2,last_24hour[i])
        // InitYesdayLineCharts(LineChart_3,70)
        InitGaugeCharts(GaugeChart_1,small_number_no(o.reception_probability));
    })
    }

}
                                                                       //初始化加载
function getMsg() {
    localstorage_search(all_cityis.toString());
    $.ajax({
        beforeSend: function(){
            $(".heen_2").show();
        },
        url: MonitUrl,
        type: 'POST',
        data:{
            city_ids : all_cityis.toString(),
            filed4Range:'day_total_pay_orders',
            weatherStatus4Condition:'',
            weatherStatus4Forecast24Hour:'',
            startNum:'',
            endNum:'',
            flag4Sort:true,
            size:6,
            offset:0
        },
        success: function(data) {
            citys_data(data)
            pagetionInit(data)
        }
    })
}
 var csh  = setTimeout(function () {
    getMsg();
    csh = null;
},1000)

                                                    //初始化分页
function pagetionInit(data) {
    var showNum = 6;
    var total = data.total;
    $('.allDatas').html(total);
    // var flag4Sort = $("#sort_u[type='checkbox']").is(':checked');
    var pageNum = Math.ceil(total / showNum);
    $('.Pagination').pagination({
        showData:6,
        // maxentries:total,
        pageCount: pageNum,
        totalData:total,
        jump: false,
        coping: true,
        homePage: '首页',
        endPage: '末页',
        prevContent: '上页',
        nextContent: '下页',
        callback: function (api) {
            // api.getPageCount()  //获取总页数
            // api.setPageCount()  //设置总页数
            // console.log(api.getCurrent())
            // var cits = $('#monitor_city_name').val().toString();
            var datas = JSON.parse(localStorage.getItem('searchCondtion'));
            datas.offset = api.getCurrent() -1;
            $.ajax({
                beforeSend: function(){
                    $(".heen_2").show();
                },
                url: MonitUrl,
                type: 'POST',
                data:datas,
                success: function(data) {
                    $(".city_box").empty();
                    citys_data(data)
                    var citys_id = [];
                    data.rt_city_operation.forEach((o,i)=>{
                        citys_id.push(o.city_id)
                    })
                    sends(citys_id.toString(),'');
                }
            })
        }
    })
}

                                                                    //本地存储查询条件
function localstorage_search(cityid) {
    var filed4Range= $('#mono_rate').val();
    var startNum = $('.star_rate').val();
    var endNum = $('.end_rate').val();
    var weatherStatus4Condition = $('.monitorW_').val() ? $('.monitorW_').val():[' '];
    var weatherStatus4Forecast24Hour = $('.foreactW_').val()? $('.foreactW_').val():[' '];

    if(startNum != '' || endNum != ''){
        if($(".i_disp").is(":hidden") == false){
            startNum = $('.star_rate').val() ? $('.star_rate').val() / 100:'';
            endNum = $('.end_rate').val() ? $('.end_rate').val() / 100:'';
        }else {
            startNum = $('.star_rate').val();
            endNum = $('.end_rate').val();
        }
    }else {
        startNum = '';
        endNum = '';
    }
    var flag4Sort = $("#sort_u[type='checkbox']").is(':checked');
    if(weatherStatus4Condition.indexOf('') >-1){
        weatherStatus4Condition = '';
    }else {
        weatherStatus4Condition = weatherStatus4Condition.toString();
    }
    if(weatherStatus4Forecast24Hour.indexOf('') >-1){
        weatherStatus4Forecast24Hour = '';
    }else {
        weatherStatus4Forecast24Hour = weatherStatus4Forecast24Hour.toString();
    }
    var data={};
    data = {
        city_ids : cityid,
        weatherStatus4Condition,
        weatherStatus4Forecast24Hour,
        filed4Range,
        startNum,
        endNum,
        flag4Sort,
        size:6,
        offset:0
    }
    localStorage.setItem('searchCondtion',JSON.stringify(data));
}
                                                                //返回
$('.to_DayMonitoring').click(function () {
    $('.data_brall').show();
    $('.map_box').hide()
    var ag = setTimeout(function () {
        sends($('.citys_ids').text().replace(/ /g, ','),'');
        ag =null
    },2000)
})
                                                                    //外部点击切进地图
$('.city_box').on('click','.cityes_name',function () {
    var select_city =$(this).text();
    sends($('.citys_ids').text().replace(/ /g, ','),select_city);
    localStorage.setItem('cityId_',JSON.stringify($('.citys_ids').text().replace(/ /g, ',')))
    $('.map_box').show();
    $('.data_brall').hide(500);
    var sd_ = setTimeout(function () {
        $('#city_name').val(select_city).trigger("change");
        sd_ = null;
    },100)
})

//最近节日
ajaxThen('99c2917a-961c-11e8-aabc-001b87530d45').then((res)=>{
    // console.log(res)
    var data = res;
    var weekday=["星期日","星期一","星期二","星期三","星期四","星期五","星期六"]
    var data1 = '下一个节日 : '+data[0].festivalName + '  '+ data[0].festival + weekday[new Date(data[0].festival).getDay()];
    $('.oneFestival').html(data1);
    // var date_ = ((new Date(data[0].festival)).getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000);
    // $('.shengDay').html(parseInt(date_) + 1)
    var lp = '<p class="twoFestival">';
    var rp =  '</p>';
    var hmtl_ = '';
    data.forEach((o,i)=>{
        hmtl_ += lp+'<b>'+o.festivalName +'</b>'+'&nbsp'+o.festival +'&nbsp'+ weekday[new Date(o.festival).getDay()] +rp;
    })
    $('.showDay').append(hmtl_)
})


function FestivalDay() {
    if($('.clickFestival').text() == '最近节日'){
        $('.all_city').stop().animate({ height:"245px"},1000);
        $('.clickFestival').html('点击收起');
        $('.showDay').show();
    }else {
        $('.all_city').stop().animate({ height:"110px"},1000);
        $('.clickFestival').html('最近节日');
        $('.showDay').hide();
    }

}
