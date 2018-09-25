
var websorketApi_ = "ws://bigdata-push-api.bingex.com/chat";                 //测试接口
var websorkeLocal = "ws://172.23.0.84:8781/chat";                 //本地接口
var websorketApi = "ws://bigdata-push-api.ishansong.com/chat";                 //生产接口

// 处理后端自定义数据集接口
function ajaxThen(dscode) {
    return new Promise(function (resovel,rejecten) {
        $.get('ext/getDataset.do?dsCode='+dscode,function (data) {
            resovel(JSON.parse(data.msg))
        })
    })
}
//处理后端自定义数据集接口  + 参数 "{city_id:'"+ 1101 +"'}"
function  ajaxThenParams(dsCosde,params) {
    return new Promise(function (resovel,rejecten) {
        $.ajax({
            url:'ext/getDataset.do',
            type:'POST',
            data:{
                dsCode:dsCosde,
                params:params
            },
            success: function (data) {
                // debugger
                if(data.status == 2){
                    alert(data.msg)
                }else {
                    resovel(JSON.parse(data.msg))
                }
            }
        })
    })
}

//监听左侧目录高度设置地图高度
var content_arapper = document.querySelector('.content-wrapper');
var observer = new MutationObserver(function (mutations,self) {
    mutations.forEach(function (mutation) {
        var bmap_box_height = mutation.target.clientHeight
        $('.bmap_box').css('height',bmap_box_height);
        // console.log(mutation.target.clientHeight,$('.bmap_box').height());

    });
});
var config_ = {attributes: true, childList: true, characterData: true};
observer.observe(content_arapper, config_);

//地址解析
function basePath(){
    //获取当前网址，如： http://localhost:8080/ems/Pages/Basic/Person.jsp
    var curWwwPath = window.document.location.href;
    //获取主机地址之后的目录，如： /ems/Pages/Basic/Person.jsp
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    //获取主机地址，如： http://localhost:8080
wenn
    var localhostPath = curWwwPath.substring(0, pos);
    var str4Http = "http://";
    if(localhostPath.startsWith(str4Http)){
        localhostPath = localhostPath.substring(str4Http.length, localhostPath.length);
    }
    //获取带"/"的项目名，如：/ems
    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    //获取项目的basePath   http://localhost:8080/ems/
    var basePath=localhostPath+projectName+"/";
    return curWwwPath;
};

//过滤方法
var filter_number_ = function(num){
    var num =num.toString();
    var numb='';
    // console.log(num.length)
    var re=/(?=(?!(\b))(\d{3})+$)/g;
    if( num.length == 1){
        numb = num + '.0';
    }else if(num.length <= 3){
        numb = num;
    }else {
        numb = num.replace(re,",");
    }
    return numb;
}
//小数转化
var small_number = function (data) {
    var strData = parseInt( data * 1000) / 10;
    var ret = strData.toString()+"%";
    return ret;
}
var small_number_no = function (data) {
    var strData = parseInt( data * 1000) / 10;
    var ret = strData.toString();
    return ret;
}
//导出数据
function tableToExcel(){
    var city_name = $('#city_name').val();
    var dsCode = '9bda36a8-75f5-11e8-ac6b-105ea72ce702';
    var data_poi = [];
    alert('已导出，请稍等');
    //要导出的json数据
    var jsonData=[];
    jsonData = JSON.parse(JSON.stringify(map_data));
    ajaxThenParams('9bda36a8-75f5-11e8-ac6b-105ea72ce702',"{city_name:'"+ city_name +"'}").then((datas)=>{
    // $.post('ext/getDataset.do',{
    //     dsCode,
    //     params:"{city_name:'"+ city_name +"'}"
    // },function (datas) {
        // console.log(datas)
        // var data_masg = JSON.parse(datas.msg);
        var data_poi = datas;
        // console.log(data_poi,jsonData)
        jsonData.forEach(ele => {
            for(var i=0;i<data_poi.length;i++){
            if(ele.hexagon_area_id == data_poi[i].block_id.substring(0,data_poi[i].block_id.length-4)){
                ele.address_1 = data_poi[i].address_1 ? data_poi[i].address_1 : '';
                ele.address_2 = data_poi[i].address_2 ? data_poi[i].address_2 : '';
                ele.address_3 = data_poi[i].address_3 ? data_poi[i].address_3 : '';
            }
        }
        delete ele.hexagon_points;
        delete ele.id;
        delete ele.hexagon_area_id;
        delete ele.cancellation_rate;
        delete ele.completion_rate;
        delete ele.day_total_cancel_orders;
        delete ele.day_total_orders;
        delete ele.day_total_finish_orders;
        delete ele.supply_demand_ratio;
    })
        console.log(jsonData)
        // 列标题，逗号隔开，每一个逗号就是隔开一个单元格
        let str = `未接单,可接单闪送员,接收单量,该区域接单率,六边形经度,六边形纬度,所在城市,支付单量,该区域中心位置_1,该区域中心位置_2,该区域中心位置_3\n`;
        //增加\t为了不让表格显示科学计数法或者其他格式
        setTimeout(() => {
            for(let i = 0 ; i < jsonData.length ; i++ ){
            for(let item in jsonData[i]){
                // console.log(jsonData[i][item])
                str+=`${jsonData[i][item] + '\t'},`;
                // str +=  jsonData[i][item];
            }
            str+='\n';
        }
        //encodeURIComponent解决中文乱码
        let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
        //通过创建a标签实现
        var link = document.createElement("a");
        link.href = uri;
        //对下载的文件命名
        link.download =  "实时地图闪送信息数据.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },1000)

    })

}
// 天气标签图标48px
var weather_icn = function (day) {
    var html1 = '';
    if(day == '多云' || day == '少云'){
        html1 = '<i class="cloudy_day i_style"></i>';
    }else if(day == '晴' || day == '大部晴朗'){
        html1 = '<i class="clear_day i_style"></i>';
    }else if(day == '雾'){
        html1 = '<i class="fog_day i_style"></i>';
    }else if(day == '霾'){
        html1 =  '<i class="haze_day i_style"></i>';
    }else if(day == '雨'){
        html1 =  '<i class="rain_day i_style"></i>';
    }else if(day == '阴'){
        html1 =  '<i class="shade_day i_style"></i>';
    }else if(day == '雪'){
        html1 =  '<i class="snow_day i_style"></i>';
    }else if(day == '浮尘'){
        html1 = '<i class="smoke_day i_style"></i>';
    }else if(day == '扬沙'){
        html1 = '<i class="blowing_sand i_style"></i>';
    }else if(day == '阵雨'){
        html1 = '<i class="shower i_style"></i>';
    }else if(day == '雷阵雨'){
        html1 = '<i class="thunder_shower i_style"></i>';
    }else if(day == '中雨'){
        html1 = '<i class="moderate_rain i_style"></i>';
    }else if(day == '小雨'){
        html1 = '<i class="smll_rain i_style"></i>';
    }else if(day == '雨夹雪'){
        html1 = '<i class="sleet i_style"></i>';
    }else if(day == '暴雨'){
        html1 = '<i class="rainstorm i_style"></i>';
    }else if(day == '大雨'){
        html1 = '<i class="big_rain i_style"></i>';
    }else {
        html1 = '<i class=""></i>';
    }
    return html1;
}
// 天气标签图标16px
var weather_icn_16 = function (day) {
    var html1 = '';
    if(day == '多云' || day == '少云'){
        html1 = '<i class="cloudy_day_ i_style_"></i>';
    }else if(day == '晴' || day == '大部晴朗'){
        html1 = '<i class="clear_day_ i_style_"></i>';
    }else if(day == '雾'){
        html1 = '<i class="fog_day_ i_style_"></i>';
    }else if(day == '霾'){
        html1 =  '<i class="haze_day_ i_style_"></i>';
    }else if(day == '雨'){
        html1 =  '<i class="rain_day_ i_style_"></i>';
    }else if(day == '阴'){
        html1 =  '<i class="shade_day_ i_style_"></i>';
    }else if(day == '雪'){
        html1 =  '<i class="snow_day_ i_style_"></i>';
    }else if(day == '浮尘'){
        html1 = '<i class="smoke_day_ i_style_"></i>';
    }else if(day == '扬沙'){
        html1 = '<i class="blowing_sand_ i_style_"></i>';
    }else if(day == '阵雨'){
        html1 = '<i class="shower_ i_style_"></i>';
    }else if(day == '雷阵雨'){
        html1 = '<i class="thunder_shower_ i_style_"></i>';
    }else if(day == '中雨'){
        html1 = '<i class="moderate_rain_ i_style_"></i>';
    }else if(day == '小雨'){
        html1 = '<i class="smll_rain_ i_style_"></i>';
    }else if(day == '雨夹雪'){
        html1 = '<i class="sleet_ i_style_"></i>';
    }else if(day == '暴雨'){
        html1 = '<i class="rainstorm_ i_style_"></i>';
    }else if(day == '大雨'){
        html1 = '<i class="big_rain_ i_style_"></i>';
    }else {
        html1 = '<i class=""></i>';
    }
    return html1;
}

//折线图状态显示
function LineWearterTpye(day) {
    var TYpeStatus ='';
    if(day == '多云' || day == '少云'){
        TYpeStatus = 'image://org/cboard/view/custom/static/imgs/weather_48/cloudy_day.png';
    }else if(day == '晴' || day == '大部晴朗'){
        TYpeStatus = 'image://org/cboard/view/custom/static/imgs/weather_48/clear_day.png';
    }else if(day == '雾'){
        TYpeStatus = 'image://org/cboard/view/custom/static/imgs/weather_48/fog_day.png';
    }else if(day == '霾'){
        TYpeStatus =  'image://org/cboard/view/custom/static/imgs/weather_48/haze_day.png';
    }else if(day == '雨'){
        TYpeStatus =  'image://org/cboard/view/custom/static/imgs/weather_48/big_rain.png';
    }else if(day == '阴'){
        TYpeStatus =  'image://org/cboard/view/custom/static/imgs/weather_48/shade_day.png';
    }else if(day == '雪'){
        TYpeStatus =  'image://org/cboard/view/custom/static/imgs/weather_48/snow_day.png';
    }else if(day == '浮尘'){
        TYpeStatus = 'image://org/cboard/view/custom/static/imgs/weather_48/smoke_day.png';
    }else if(day == '扬沙'){
        TYpeStatus = 'image://org/cboard/view/custom/static/imgs/weather_48/blowing_sand.png';
    }else if(day == '阵雨'){
        TYpeStatus = 'image://org/cboard/view/custom/static/imgs/weather_48/shower.png';
    }else if(day == '雷阵雨'){
        TYpeStatus = 'image://org/cboard/view/custom/static/imgs/weather_48/thunder_shower.png';
    }else if(day == '中雨'){
        TYpeStatus = 'image://org/cboard/view/custom/static/imgs/weather_48/moderate_rain.png';
    }else if(day == '小雨'){
        TYpeStatus = 'image://org/cboard/view/custom/static/imgs/weather_48/smll_rain.png';
    }else if(day == '雨夹雪'){
        TYpeStatus = 'image://org/cboard/view/custom/static/imgs/weather_48/sleet.png';
    }else if(day == '暴雨'){
        TYpeStatus = 'image://org/cboard/view/custom/static/imgs/weather_48/rainstorm.png';
    }else if(day == '大雨'){
        TYpeStatus = 'image://org/cboard/view/custom/static/imgs/weather_48/big_rain.png';
    }else {
        TYpeStatus ='image://org/cboard/view/custom/static/imgs/weather_48/clear_day.png';
    }
    return TYpeStatus;
}