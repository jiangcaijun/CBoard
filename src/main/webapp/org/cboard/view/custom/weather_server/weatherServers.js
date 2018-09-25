
var get_weather = 'ext/getDataset.do';
var start_time ='',
    end_time = '',
    weather_city = '',
    weather_type = '';
function p(s) {
    return s < 10 ? '0' + s: s;
}
function GetDateStr(AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;  //获取当前月份的日期
    var d = dd.getDate();
    var hour = dd.getHours();       //得到小时
    var minu = dd.getMinutes();    //得到分钟
    var sec = dd.getSeconds();     //得到秒
    var MS = dd.getMilliseconds(); //获取毫秒
    return y + "-" + p(m) + "-" + p(d) +' '+ p(hour) + ":" + p(minu) + ":" + p(sec);
}
$(function () {
    //执行一个laydate实例   +  日期切换
    laydate.render({
        elem: '#time1',
        // theme: 'molv',
        showBottom: true,
        value:GetDateStr(-1),
        type: 'datetime',
        // range:'/',
        done:function(value, date, endDate){
            // var date_value = value.split("/");
            // start_time = date_value[0];
            // end_time = date_value[1];
            console.log(value)
        }
    });
    laydate.render({
        elem: '#time2',
        // theme: 'molv',
        showBottom: true,
        value:GetDateStr(-6),
        type: 'datetime',
        // range:'/',
        done:function(value, date, endDate){
            // var date_value = value.split("/");
            // start_time = date_value[0];
            // end_time = date_value[1];
            console.log(value)
        }
    });
    $(".select_city").select2();
    $(".js-example-basic-multiple").select2({
        theme:"classic"
    })
});

initWeather()
function initWeather() {
    var weater_html='';
    var weather_arr=[
        {'weatherType':'晴','weatherStatus':'晴'},
        {'weatherType':'雨','weatherStatus':'雨'},
        {'weatherType':'多云','weatherStatus':'多云'},
        {'weatherType':'雪','weatherStatus':'雪'},
        {'weatherType':'雾','weatherStatus':'雾'},
        {'weatherType':'霾','weatherStatus':'霾'},
        {'weatherType':'阴','weatherStatus':'阴'},
        {'weatherType':'浮沉','weatherStatus':'浮沉'}
    ]
    $.each( weather_arr, function(index, content){
        weater_html += "<option value='"+ content.weatherType +"'>"+ content.weatherStatus +"</option>";
    });
    $('.select_weather').append(weater_html);
    weather_type = $('.select_weather').val();
}

//初始化获取城市
$.get('ext/getDataset.do?dsCode=0f5a68a2-3e22-11e8-b8e5-2f283bb1c5c7',function (data) {
    // console.log(data)
    if(data.status != '1'){
        // console.error(data.msg);
        return;
    }
    var city_html = "";
    data = JSON.parse(data.msg);
    $.each( data, function(index, content){
        var dataObj =content ;
        city_html += "<option value='"+ dataObj.city_id +"'>"+ dataObj.city_name +"</option>";
    });
    $('.select_city').append(city_html);
    weather_city = $(".select_city").val();
    // creat_table();
})


function creat_table() {
    start_time = $('.time1').val();
    end_time = $('.time2').val();
    // console.log($('.time1').val(),$('.time2').val())
    $.ajax({
        url:get_weather,
        type:'POST',
        data:{
            dsCode:'aad4e848-6951-11e8-8d49-73c9989d4999',
            params:"{city_id:'"+ weather_city +"'," +
            "start_time:'"+ '2018-03-01' +"'," +
            "end_time:'"+ '2018-04-07' +"'," +
            "weather_data:'"+ weather_type +"'," +
            "offset:'"+ '0' +"',"+
            "size:'"+ '10' +"'}"
        },
        success: function (result) {
            if(result.status == 1){
               var weather_data_ =  JSON.parse(result.msg);
               var weather_data = weather_data_.rows;
               console.log(weather_data_.total)
                weather_data_push(weather_data)
            }
        }
    })
}
function weather_data_push(data) {
    $('#table').bootstrapTable({
        // url: get_weather,                           //请求后台的URL（*）
        // method: 'post',                     //请求方式（*）
        // toolbar: '#table',                   //工具按钮用哪个容器
        striped: true,                      //是否显示行间隔色
        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,                   //是否显示分页（*）
        sortable: true,                    //是否启用排序
        sortOrder: "asc",                   //排序方式
        // queryParams:          //传递参数（*），这里应该返回一个object，即形如{param1:val1,param2:val2}
        sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
        pageNumber:1,                       //初始化加载第一页，默认第一页
        pageSize: 20,                       //每页的记录行数（*）
        pageList: [20, 50, 100],            //可供选择的每页的行数（*）
        search: true,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        strictSearch: true,
        showColumns: true,                  //是否显示所有的列
        showRefresh: false,                  //是否显示刷新按钮
        minimumCountColumns: 2,             //最少允许的列数
        clickToSelect: true,                //是否启用点击选中行
        //height: 500,                      //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        uniqueId: "ID",                     //每一行的唯一标识，一般为主键列
        showToggle:true,                    //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        detailView: false,                  //是否显示父子表
        columns: [ {
            field: 'id',
            title: 'ID'
        }, {
            field: 'city_id',
            title: '城市ID'
        }, {
            field: 'city_name',
            title: '城市名称'
        },{
            field: 'updatetime',
            title: '更新时间'
        }, {
            field: 'weather_data',
            title: '天气状况',
            formatter : function(value, row, index) {
                var htms = '',html1 = '',weatherClass='';
                var weatherDatas = JSON.parse(row.weather_data);
                if(weatherDatas.condition == '多云'){
                    html1 = '<i class="cloudy_day i_style"></i>';
                }else if(weatherDatas.condition == '晴'){
                    html1 = '<i class="clear_day i_style"></i>';
                }else if(weatherDatas.condition == '雾'){
                    html1 = '<i class="fog_day i_style"></i>';
                }else if(weatherDatas.condition == '霾'){
                    html1 =  '<i class="haze_day i_style"></i>';
                }else if(weatherDatas.condition == '雨'){
                    html1 =  '<i class="rain_day i_style"></i>';
                }else if(weatherDatas.condition == '阴'){
                    html1 =  '<i class="shade_day i_style"></i>';
                }else if(weatherDatas.condition == '雪'){
                    html1 =  '<i class="snow_day i_style"></i>';
                }else if(weatherDatas.condition == '浮尘'){
                    html1 = '<i class="smoke_day i_style"></i>';
                }
                htms =  html1 + '<span>' + weatherDatas.condition+'/'+ '气温 :'+ weatherDatas.temp +'/'+'风力 :' +weatherDatas.windLevel + '级' + '</span>';
                // console.log(htms)
                return htms;
            }
        }],
        data
    });
}
function history_btn() {
    creat_table();
}

