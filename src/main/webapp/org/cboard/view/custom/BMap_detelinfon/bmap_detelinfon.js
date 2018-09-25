
var map = new BMap.Map("allmap",{enableMapClick:false});
setTimeout(function () {
    map.centerAndZoom(new BMap.Point(116.42,39.92), 12);
    map.addControl(new BMap.NavigationControl());
    map.addControl(new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT}));
},100)
map.setMinZoom(12);
map.enableScrollWheelZoom();
let citys = {};
$(function () {
    $("#city_name").select2();
    $(".js-example-basic-multiple").select2({
        theme:"classic"})
});


// 初始化加载搜索框
$.get('ext/getDataset.do?dsCode=0f5a68a2-3e22-11e8-b8e5-2f283bb1c5c7',function (data) {
    var html = "";
    var ci = time1 = new Date().Format("yyyy-MM-dd hh:mm:ss");
    $('.timer').html(ci);
    citys = eval('('+ data.msg +')');
    $.each(citys, function(index, content){
        var dataObj =content ;
        html += "<option value='"+ dataObj.city_name +"'>"+ dataObj.city_name +"</option>";
    });
    $('#city_name').append(html);
    dataServer();
})

//切换城市
var select_name = function () {
    assign_zhi("0","0","0","0");
    $('.reception_probability').html("N/A");
    var t = false;
    var cityName = $('#city_name').val();
    Array.prototype.filter.call(citys,(o) =>{
        if(o.city_name == cityName ){
            return map.setCenter(new BMap.Point(o.center_lng,o.center_lat)) ;
        }
    })
    dataServer()
}
//时间过滤
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
//刷新
$('.update').click(function () {
    assign_zhi("0","0","0","0");
    $('.reception_probability').html("N/A");
    var i = time1 = new Date().Format("yyyy-MM-dd hh:mm:ss");
    // $('.timer').html("");
    $('.timer').html(i);
    dataServer();
})
//赋值
var assign_zhi = function(a,b,c,d) {
    $('.total_waiting_couriers').html(a);   //闪送员
    $('.total_pay_orders').html(b);         //支付单
    $('.total_receive_orders').html(c);     //接收单
    $('.not_receive_orders').html(d);       //未接单

}
// 显示信息
var showInfo1 = function (polygon_cof1) {
    // console.log(polygon_cof1)
    var sContent =
        '<ul style="margin:0 0 5px 0;padding:0.2em 0">';
        sContent = sContent
            + '<li style="line-height: 26px;font-size: 15px;">' +'实时未接单量:&nbsp;'+ polygon_cof1.day_not_receive_orders + '</li>'
            + '<li style="line-height: 26px;font-size: 15px;">' +'实时可接单闪送员:&nbsp;'+ polygon_cof1.day_total_waiting_couriers + '</li>'
            + '<li style="line-height: 26px;font-size: 15px;">' +'今日累计支付单量:&nbsp;'+ polygon_cof1.day_total_pay_orders + '</li>'
            + '<li style="line-height: 26px;font-size: 15px;">' +'今日累计接收单量:&nbsp;'+ polygon_cof1.day_total_receive_orders + '</li>'
            + '<li style="line-height: 26px;font-size: 15px;">' +'今日累计接单率:&nbsp;'+ polygon_cof1.reception_probability + '</li>'
            ;
    sContent = sContent + '</ul>';
    return sContent;
}
//获取中心点
var getcenter_point1 = function (polygon_points) {
    var center_sum_L = 0
    var center_sum_N = 0
    for (m = 0; m < polygon_points.length; m++) {
        center_sum_L = center_sum_L + parseFloat(polygon_points[m].lng)
        center_sum_N = center_sum_N + parseFloat(polygon_points[m].lat)
    }
    return new BMap.Point(center_sum_L / polygon_points.length, center_sum_N / polygon_points.length);
}
//排序
var store = function (arry) {
    var arrys = [];
    var max_value,min_value;
    arry.sort(function(a,b){
        return a-b;
    });
    if(arry.length == 0){
         min_value=0;
         max_value=0;
    }else if(arry.length == 1){
         min_value=arry[0];
         max_value=arry[0];
    }else {
        min_value=arry[0];
        max_value=arry[arry.length-1];
    }

    if(min_value < 0 ){
        min_value=0;
    }
    if(max_value < 0 ){
        max_value=0;
    }
    if(min_value == 0 && max_value == 0){
        min_value=0;
        max_value=1;
    }
    return arrys = [min_value,max_value]
}
//颜色获取
var getColor = function (min,max,one_polygon_value) {
        var color_tmp = 0;
        if(one_polygon_value <0){
            one_polygon_value = 0
        }

        if(max != 0){
            if( one_polygon_value >= 0 )
            {
                color_tmp=120 * (1-((one_polygon_value - min)/max));   //倒序
            }
            //    color_tmp=((one_polygon_value-min)/max)*120;
        }
        return 'hsl('+color_tmp+',90%,50%)';

}
Array.prototype.sum = function (){
    return this.reduce(function (partial, value){
        return partial + value;
    })
};

//数据转化
var dataServer = function (e) {
    var cityName=$('#city_name').val();
    // var total_not_receive_orders = $('.not_receive_orders').val();      //未接单
    // var total_waiting_couriers = $('.total_waiting_couriers').val();     //闪送员
    // var total_pay_orders = $('.total_pay_orders').val();                //支付单
    // var total_receive_orders = $('.total_receive_orders').val();        //接收单
    var city_json = 'bmap/dataByCityName2es.do';
    $.ajax({
        beforeSend: function(){
            $(".heen").show();
        },
        url: city_json,
        type:'POST',
        data:{
            cityName:cityName
        },
        success: function (result) {
            map.clearOverlays();  //清除地图覆盖物
            var dataPoints1 = result;
            if(dataPoints1.length <= 0){
                return $(".heen").hide();
            }
            // console.log(dataPoints1.length)
            var areas1 = {}
            for (var areaa of dataPoints1) {
                var _area1 = areaa.hexagon_points;    //商圈坐标对象
                var areaPoint = _area1.substring(0, _area1.length - 1).substr(1);
                var point_ = areaPoint.split(',');
                var str = [];
                for (var poin of point_) {
                    var onePoint = poin.split(' ');
                    var point = new BMap.Point(onePoint[0], onePoint[1]);
                    str.push(point)
                }
                var window_conf1 = areaa;
                areas1[areaa.hexagon_points] = {     //商圈坐标对象
                    'points': str,
                    'window_conf1': window_conf1
                }
                // console.log(areas1[area.polygon_path])    //商圈坐标对象
            }
            // console.log(areas1)
            var polygons_value_day_not_receive_orders = [];            //未接单
            var polygons_value_day_total_waiting_couriers = [];       //可活跃闪送员
            var polygons_value_day_total_pay_orders = [];              //支付单量
            var polygons_value_day_total_receive_orders = [];          //接收单

            for (key in areas1) {
                var polygon_cof1 = areas1[key];
                var polygon_window_conf1 = polygon_cof1['window_conf1'];
                polygons_value_day_not_receive_orders.push(parseFloat(polygon_window_conf1.day_not_receive_orders));
                polygons_value_day_total_waiting_couriers.push(parseFloat(polygon_window_conf1.day_total_waiting_couriers));
                polygons_value_day_total_pay_orders.push(parseFloat(polygon_window_conf1.day_total_pay_orders));
                polygons_value_day_total_receive_orders.push(parseFloat(polygon_window_conf1.day_total_receive_orders));
            }

            assign_zhi(
                polygons_value_day_total_waiting_couriers.sum(),
                polygons_value_day_total_pay_orders.sum(),
                polygons_value_day_total_receive_orders.sum(),
                polygons_value_day_not_receive_orders.sum()
            )
            var reception_probability_percent = "N/A";
            if (polygons_value_day_total_pay_orders.sum() > 0) {
                reception_probability_percent = (polygons_value_day_total_receive_orders.sum() / polygons_value_day_total_pay_orders.sum());

                reception_probability_percent = Math.round(100 * reception_probability_percent, 2).toString() + "%";
            }

            $('.reception_probability').html(reception_probability_percent);
            var ayyes = store(polygons_value_day_not_receive_orders)
            var min = ayyes[0];
            var max = ayyes[1];
            for (var key in areas1) {
                var polygon_cof1 = areas1[key];
                var polygon_points = polygon_cof1['points'];
                var polygon_window_conf1 = polygon_cof1['window_conf1'];
                var center_point_arr = getcenter_point1(polygon_points);
                // polygons_value_day_not_receive_orders.push(parseFloat(polygon_window_conf1.day_not_receive_orders));
                // var clor=getColor1(polygons_value_day_not_receive_orders,polygon_window_conf1.day_not_receive_orders);
                var clor = getColor(min, max, polygon_window_conf1.day_not_receive_orders);
                var polygon = new BMap.Polygon(polygon_points, {
                    strokeColor: 'white',
                    fillColor: clor,
                    strokeWeight: 1,
                    strokeOpacity: 0.5
                });

                //创建多边形
                (function () {
                    var contents = showInfo1(polygon_window_conf1)
                    var infoWindow = new BMap.InfoWindow(contents, {
                        // title: polygon_window_conf1.reception_probability
                    });
                    var center_point = getcenter_point1(polygon.getPath())
                    // console.log(center_point_arr.lng)
                    polygon.infoWindow = infoWindow;
                    polygon.center_point = center_point;
                    polygon.addEventListener('click', function (e) {
                        // 创建信息窗口对象
                        map.openInfoWindow(e.target.infoWindow, e.target.center_point);
                    })
                    var scale = map.getZoom();
                    var dx = -(5 / 2 * ( 19 - scale));
                    var dy = -(5 / 2 * ( 19 - scale));

                    // var opts1 = {
                    //     position : center_point_arr,    // 指定文本标注所在的地理位置
                    //     offset   : new BMap.Size(dx,dy)    //设置文本偏移量
                    // }
                    // var line1FontSize = "18";
                    // var content = "";
                    // var temp = polygon_window_conf1['day_not_receive_orders'];
                    // if(temp < 0){
                    //     temp = 0;
                    // }
                    // var defaultContent = "<p style='text-align: center;padding-left: 3px;line-height: 12px'>"+temp + '&nbsp;/&nbsp;'+polygon_window_conf1['day_total_waiting_couriers']+'</p>'+polygon_window_conf1['reception_probability'];
                    // if(scale<11){
                    //     content = polygon_window_conf1['day_not_receive_orders'];
                    // }else{
                    //     content = defaultContent;
                    // }
                    // var label = new BMap.Label(content, opts1);
                    // label.setStyle({
                    //     color:'black' ,
                    //     fontSize: "9px",
                    //     backgroundColor: "0.05",
                    //     border: "0"//,
                    //     //fontWeight: "bold"//,
                    //     //textAlign
                    // });
                    // label.addEventListener('click', function (e) {
                    //     // 创建信息窗口对象
                    //     map.openInfoWindow(e.target.infoWindow, e.target.center_point);
                    // })
                    // map.addOverlay(label);
                })();
                map.addOverlay(polygon);
            }
            $(".heen").hide();
        },error: function(){
            $(".heen").hide();
        }
    })
}



