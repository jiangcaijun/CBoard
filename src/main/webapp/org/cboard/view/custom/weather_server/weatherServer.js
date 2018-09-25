// var chk_value = [];
// var userTableInit = new Object();
var $table = $('#weather_table_bar'),
    start_time_h = '',
    end_time_h = '',
    start_time_f = '',
    end_time_f = '',
    weather_city = '',
    weather_type = '',
    selections = [];
var logPageSize = 10;
// 1.初始化Table
var oTable;
var get_weather = 'ext/getDataset.do';

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
        value:GetDateStr(-6),
        type: 'datetime',
        // range:'/',
        done:function(value, date, endDate){
            // var date_value = value.split("/");
            // start_time = date_value[0];
            // end_time = date_value[1];
            // console.log(value)
        }
    });
    laydate.render({
        elem: '#time2',
        // theme: 'molv',
        showBottom: true,
        value:GetDateStr(0),
        type: 'datetime',
        // range:'/',
        done:function(value, date, endDate){
            // var date_value = value.split("/");
            // start_time = date_value[0];
            // end_time = date_value[1];
            // console.log(value)
        }
    });
    laydate.render({
        elem: '#time3',
        // theme: 'molv',
        showBottom: true,
        value:GetDateStr(0),
        type: 'datetime',
        // range:'/',
        done:function(value, date, endDate){
            // var date_value = value.split("/");
            // start_time = date_value[0];
            // end_time = date_value[1];
            // console.log(value)
        }
    });
    laydate.render({
        elem: '#time4',
        // theme: 'molv',
        showBottom: true,
        value:GetDateStr(15),
        type: 'datetime',
        // range:'/',
        done:function(value, date, endDate){
            // var date_value = value.split("/");
            // start_time = date_value[0];
            // end_time = date_value[1];
            // console.log(value)
        }
    });
    $("#select_city").select2();
    $(".js-example-basic-multiple").select2({
        theme:"classic",
        multiple : true,

    })
});

initWeather()
function initWeather() {
    var weater_html='';
    var weather_arr=[
        {'weatherType':'扬沙','weatherStatus':'扬沙'},
        {'weatherType':'阵雨','weatherStatus':'阵雨'},
        {'weatherType':'雷阵雨','weatherStatus':'雷阵雨'},
        {'weatherType':'暴雨','weatherStatus':'暴雨'},
        {'weatherType':'浮尘','weatherStatus':'浮尘'},
        {'weatherType':'雨','weatherStatus':'雨'},
        {'weatherType':'雪','weatherStatus':'雪'},
        {'weatherType':'少云','weatherStatus':'少云'},
        {'weatherType':'大雨','weatherStatus':'大雨'},
        {'weatherType':'中雨','weatherStatus':'中雨'},
        {'weatherType':'小雨','weatherStatus':'小雨'},
        {'weatherType':'阴','weatherStatus':'阴'},
        {'weatherType':'晴','weatherStatus':'晴'},
        {'weatherType':'雨夹雪','weatherStatus':'雨夹雪'},
        {'weatherType':'多云','weatherStatus':'多云'},
        {'weatherType':'霾','weatherStatus':'霾'},
        {'weatherType':'雾','weatherStatus':'雾'}
    ]
    $.each( weather_arr, function(index, content){
        weater_html += "<option value='"+ content.weatherType +"'>"+ content.weatherStatus +"</option>";
    });
    $('.select_weather').append(weater_html);
    weather_type = $('.select_weather').val();
}

//初始化获取城市
$.get('ext/getDataset.do?dsCode=7e529bc8-6ac6-11e8-8d49-73c9989d4999',function (data) {
    // console.log(data)
    if(data.status != '1'){
        // console.error(data.msg);
        return;
    }
    var city_html = "";
    data = JSON.parse(data.msg);
    // console.log(data)
    $.each( data, function(index, content){
        var dataObj =content ;
        city_html += "<option value='"+ dataObj.city_id +"'>"+ dataObj.city_name +"</option>";
    });
    $('.select_city').append(city_html);
    // weather_city = $(".select_city").val();
    // creat_table();
})

var TableInit = function(witout,dsCode) {
    $table.on('check.bs.table uncheck.bs.table ' +
        'check-all.bs.table uncheck-all.bs.table',
        function() {
            // save your data, here just save the current page
            selections = getIdSelections();
            // push or splice the selections if you want to save all data selections
        });
    start_time_h = ($('.time1').is(':hidden'))?'':$('.time1').val();
    end_time_h = ($('.time2').is(':hidden'))?'':$('.time2').val();
    start_time_f = ($('.time3').is(':hidden'))?'':$('.time3').val();
    end_time_f = ($('.time4').is(':hidden'))?'':$('.time4').val();
    weather_city = ($(".select_city").val()) == null ? '':$(".select_city").val().join(",");
    weather_type = ($(".select_weather").val()) == null ? '':$(".select_weather").val().join(",");
    var data_typenum = ($('.time_serach2').is(':hidden'))?'1':'2';
    var weather_city_ = '';
    var columns = [];
    var condition={};
    if(witout == 'weather_table_bar'){
        columns = [{
            field: 'id',
            title: 'ID'
        }, {
            field: 'city_id',
            title: '城市ID'
            // sortable:true
        }, {
            field: 'city_name',
            title: '城市名称',
            visible: true,
        },{
            field: 'updatetime',
            title: '更新时间'
        },{
            field: 'predict_date',
            title: '预测日期',
            visible: false,
        },{
            field: 'weather_data',
            title: '天气状况',
            formatter : function(value, row, index) {
                return date_filtter(row)
            }
        }];
        condition = {
            weather_data:weather_type,
            city_id:weather_city,
            start_time:start_time_h,
            end_time:end_time_h,
        };

    }else {
        columns = [{
            field: 'id',
            title: 'ID'
        }, {
            field: 'city_id',
            title: '城市ID'
            // sortable:true
        }, {
            field: 'city_name',
            title: '城市名称',
            visible: true,
        },{
            field: 'predict_date',
            title: '预测日期',
            visible: true,
        },{
            field: 'updatetime',
            title: '更新时间'
        },{
            field: 'weather_data',
            title: '天气状况',
            formatter : function(value, row, index) {
                return date_filtter(row)
            }
        }];
        condition ={
            weather_data:weather_type,
            city_id:weather_city,
            predict_start_time : start_time_f,
            predict_end_time:end_time_f,
            data_type : data_typenum
        };

    }

    //过滤参数
    function date_filtter(row) {
        var htms = '',html1 = '',htmlN = '',weatherClass='';
        var weatherDatas = JSON.parse(row.weather_data);
        // console.log(weatherDatas)
        if(witout == 'weather_table_bar'){
            if(weatherDatas.condition == '多云' || weatherDatas.condition == '少云'){
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
            }else if(weatherDatas.condition == '扬沙'){
                html1 = '<i class="blowing_sand i_style"></i>';
            }else if(weatherDatas.condition == '阵雨'){
                html1 = '<i class="shower i_style"></i>';
            }else if(weatherDatas.condition == '雷阵雨'){
                html1 = '<i class="thunder_shower i_style"></i>';
            }else if(weatherDatas.condition == '中雨'){
                html1 = '<i class="moderate_rain i_style"></i>';
            }else if(weatherDatas.condition == '小雨'){
                html1 = '<i class="smll_rain i_style"></i>';
            }else if(weatherDatas.condition == '雨夹雪'){
                html1 = '<i class="sleet i_style"></i>';
            }else if(weatherDatas.condition == '暴雨'){
                html1 = '<i class="rainstorm i_style"></i>';
            }else if(weatherDatas.condition == '大雨'){
                html1 = '<i class="big_rain i_style"></i>';
            }
            htms =  html1 + '<span>' + weatherDatas.condition+'&nbsp/&nbsp'+ '气温:'+ weatherDatas.temp+'' +'&nbsp/&nbsp'+'风力:' +weatherDatas.windLevel + '级' + '</span>';
        }else {
            // console.log(columns[4].visible)
            if(data_typenum == '1'){
                if(weatherDatas.condition == '多云' || weatherDatas.condition == '少云'){
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
                }else if(weatherDatas.condition == '扬沙'){
                    html1 = '<i class="blowing_sand i_style"></i>';
                }else if(weatherDatas.condition == '阵雨'){
                    html1 = '<i class="shower i_style"></i>';
                }else if(weatherDatas.condition == '雷阵雨'){
                    html1 = '<i class="thunder_shower i_style"></i>';
                }else if(weatherDatas.condition == '中雨'){
                    html1 = '<i class="moderate_rain i_style"></i>';
                }else if(weatherDatas.condition == '小雨'){
                    html1 = '<i class="smll_rain i_style"></i>';
                }else if(weatherDatas.condition == '雨夹雪'){
                    html1 = '<i class="sleet i_style"></i>';
                }else if(weatherDatas.condition == '暴雨'){
                    html1 = '<i class="rainstorm i_style"></i>';
                }else if(weatherDatas.condition == '大雨'){
                    html1 = '<i class="big_rain i_style"></i>';
                }
                htms =  html1 + '<span>' + weatherDatas.condition+'&nbsp/&nbsp'+ '气温:'+ weatherDatas.temp+'' +'&nbsp/&nbsp'+'风力:' +weatherDatas.windLevel + '级' +
                    '&nbsp/&nbsp'+'降水量:'+weatherDatas.pop+'&nbsp/&nbsp'+'降雪量:'+weatherDatas.snow +'</span>';
            }else if(data_typenum == '2'){
                // console.log(weatherDatas)
                //判断白天天气
                if(weatherDatas.conditionDay == '多云' || weatherDatas.conditionDay == '少云'){
                    html1 = '<i class="cloudy_day i_style"></i>';
                }else if(weatherDatas.conditionDay == '晴'){
                    html1 = '<i class="clear_day i_style"></i>';
                }else if(weatherDatas.conditionDay == '雾'){
                    html1 = '<i class="fog_day i_style"></i>';
                }else if(weatherDatas.conditionDay == '霾'){
                    html1 =  '<i class="haze_day i_style"></i>';
                }else if(weatherDatas.conditionDay == '雨'){
                    html1 =  '<i class="rain_day i_style"></i>';
                }else if(weatherDatas.conditionDay == '阴'){
                    html1 =  '<i class="shade_day i_style"></i>';
                }else if(weatherDatas.conditionDay == '雪'){
                    html1 =  '<i class="snow_day i_style"></i>';
                }else if(weatherDatas.conditionDay == '浮尘'){
                    html1 = '<i class="smoke_day i_style"></i>';
                }else if(weatherDatas.conditionDay == '扬沙'){
                    html1 = '<i class="blowing_sand i_style"></i>';
                }else if(weatherDatas.conditionDay == '阵雨'){
                    html1 = '<i class="shower i_style"></i>';
                }else if(weatherDatas.conditionDay == '雷阵雨'){
                    html1 = '<i class="thunder_shower i_style"></i>';
                }else if(weatherDatas.conditionDay == '中雨'){
                    html1 = '<i class="moderate_rain i_style"></i>';
                }else if(weatherDatas.conditionDay == '小雨'){
                    html1 = '<i class="smll_rain i_style"></i>';
                }else if(weatherDatas.conditionDay == '雨夹雪'){
                    html1 = '<i class="sleet i_style"></i>';
                }else if(weatherDatas.conditionDay == '暴雨'){
                    html1 = '<i class="rainstorm i_style"></i>';
                }else if(weatherDatas.conditionDay == '大雨'){
                    html1 = '<i class="big_rain i_style"></i>';
                }
                //判断夜间气候
                if(weatherDatas.conditionNight == '多云' || weatherDatas.conditionNight == '少云'){
                    htmlN = '<i class="cloudy_day i_style"></i>';
                }else if(weatherDatas.conditionNight == '晴'){
                    htmlN = '<i class="clear_day i_style"></i>';
                }else if(weatherDatas.conditionNight == '雾'){
                    htmlN = '<i class="fog_day i_style"></i>';
                }else if(weatherDatas.conditionNight == '霾'){
                    htmlN =  '<i class="haze_day i_style"></i>';
                }else if(weatherDatas.conditionNight == '雨'){
                    htmlN =  '<i class="rain_day i_style"></i>';
                }else if(weatherDatas.conditionNight == '阴'){
                    htmlN =  '<i class="shade_day i_style"></i>';
                }else if(weatherDatas.conditionNight == '雪'){
                    htmlN =  '<i class="snow_day i_style"></i>';
                }else if(weatherDatas.conditionNight == '浮尘'){
                    htmlN = '<i class="smoke_day i_style"></i>';
                }else if(weatherDatas.conditionNight == '扬沙'){
                    htmlN = '<i class="blowing_sand i_style"></i>';
                }else if(weatherDatas.conditionNight == '阵雨'){
                    htmlN = '<i class="shower i_style"></i>';
                }else if(weatherDatas.conditionNight == '雷阵雨'){
                    htmlN = '<i class="thunder_shower i_style"></i>';
                }else if(weatherDatas.conditionNight == '中雨'){
                    htmlN = '<i class="moderate_rain i_style"></i>';
                }else if(weatherDatas.conditionNight == '小雨'){
                    htmlN = '<i class="smll_rain i_style"></i>';
                }else if(weatherDatas.conditionNight == '雨夹雪'){
                    htmlN = '<i class="sleet i_style"></i>';
                }else if(weatherDatas.conditionNight == '暴雨'){
                    htmlN = '<i class="rainstorm i_style"></i>';
                }else if(weatherDatas.conditionNight == '大雨'){
                    htmlN = '<i class="big_rain i_style"></i>';
                }
                htms =  '<p>'+ html1 + '<span>' + weatherDatas.conditionDay +'&nbsp/&nbsp'+ '白天气温:'+ weatherDatas.tempDay+'' +'&nbsp/&nbsp'+'白天风力:' +weatherDatas.windLevelDay + '级' + '</span></p>'+
                    '<p>'+ htmlN + '<span>' + weatherDatas.conditionNight +'&nbsp/&nbsp'+ '夜间气温:'+ weatherDatas.tempNight+'' +'&nbsp/&nbsp'+'夜间风力:' +weatherDatas.windLevelNight + '级' + '</span></p>'
                ;
            }

        }
        // console.log(htms)
        return htms;
    }
    // 这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的


    var dsCode = dsCode;
    return jQuery.tgrid(witout,'toolbar', get_weather, columns, condition, logPageSize, true, undefined,dsCode);
};

function exportData_history(){
    $('#weather_table_bar').tableExport({type:'excel',fileName:"天气数据", excelstyles:['border-bottom', 'border-top', 'border-left', 'border-right']});
}
function exportData_forecast(){
    $('#forecast_table_bar').tableExport({type:'excel',fileName:"天气数据", excelstyles:['border-bottom', 'border-top', 'border-left', 'border-right']});
}
$(function() {
    // var jobId = getUrlParam('jobId');
    // var jobId = localStorage.getItem('jobId');
    // localStorage.clear("jobId");
    // $("input[name='jobId']").val(jobId);
    oTable = new TableInit('weather_table_bar',"aad4e848-6951-11e8-8d49-73c9989d4999");
});

function getIdSelections() {
    return $.map($table.bootstrapTable('getSelections'), function(row) {
        return row.id;
    });
}


//历史天气服务"搜索"按钮
$(".weather_history_search_btn").click(function() {
    $("#weather_table_bar").bootstrapTable('destroy');
    oTable = new TableInit('weather_table_bar',"aad4e848-6951-11e8-8d49-73c9989d4999");
});

function weather_history() {
        $("#weather_table_bar").bootstrapTable('destroy');
        oTable = new TableInit('weather_table_bar',"aad4e848-6951-11e8-8d49-73c9989d4999");
}
//预测天气服务"搜索"按钮
$(".forecast_search_btn").click(function() {
    $("#forecast_table_bar").bootstrapTable('destroy');
    oTable = new TableInit('forecast_table_bar',"d28eb3a0-6d20-11e8-b1b6-36fa425e1139");
});

function forecast() {
        $("#forecast_table_bar").bootstrapTable('destroy');
        oTable = new TableInit('forecast_table_bar',"d28eb3a0-6d20-11e8-b1b6-36fa425e1139");
}
// var config = {
//     ".chosen-select": {},
//     ".chosen-select-deselect": {
//         allow_single_deselect: !0
//     },
//     ".chosen-select-no-single": {
//         disable_search_threshold: 10
//     },
//     ".chosen-select-no-results": {
//         no_results_text: "Oops, nothing found!"
//     },
//     ".chosen-select-width": {
//         width: "95%"
//     }
// };
