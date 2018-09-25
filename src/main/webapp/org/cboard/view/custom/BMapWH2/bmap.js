
var map_data = [];
var map = new BMap.Map("allmap",{enableMapClick:false});
var timer_ = setTimeout(function () {
    map.centerAndZoom(new BMap.Point(116.42,39.92), 15);
    map.addControl(new BMap.NavigationControl());
    map.addControl(new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT}));
    timer_ = null;
},100)

map.setMinZoom(11);
map.enableScrollWheelZoom();

//右键事件
// drawingManager.addEventListener("rightclick",function(e){
//     // map.removeOverlay(e.overlay)
//     e.overlay.z.fillColor ='blue';
//     console.log(e.overlay.z.fillColor)
// });
let citys = {};
$(function () {
    $("#city_name").select2();
    $(".js-example-basic-multiple").select2({
        theme:"classic"})
});
//初始化获取信息
$.get('ext/getDataset.do?dsCode=0f5a68a2-3e22-11e8-b8e5-2f283bb1c5c7',function (data) {
    var html = "";
    citys = JSON.parse(data.msg);
    $.each( citys, function(index, content){
        var dataObj =content ;
        html += "<option value='"+ dataObj.city_id +"'>"+ dataObj.city_name +"</option>";
    });
    $('#city_name').append(html);
    dataServer();
})
// ajaxThenParams('117a5bde-9952-11e8-9790-496b3deef604',"{city_id:'"+ 1101 +"'}").then((res) => {
//     renderMap(res)
// })
//切换城市
var select_name = function () {
    var cityid = $('#city_name').val();
    Array.prototype.filter.call(citys,(o) =>{
        if(o.city_id == cityid ){
            return map.setCenter(new BMap.Point(o.center_lng,o.center_lat)) ;
        }
    })
    dataServer()
}

// 显示信息
var showInfo1 = function (polygon_cof1) {
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
// //获取中心点
var getcenter_point1 = function (polygon_points) {
    var center_sum_L = 0
    var center_sum_N = 0
    for (m = 0; m < polygon_points.length; m++) {
        center_sum_L = center_sum_L + parseFloat(polygon_points[m].lng)
        center_sum_N = center_sum_N + parseFloat(polygon_points[m].lat)
    }
    return new BMap.Point(center_sum_L / polygon_points.length, center_sum_N / polygon_points.length);
}
var small_number = function (data) {
    var ret = '';
    if(data == undefined){
        ret = 0;
    }else {
        var strData = parseInt( data * 1000) / 10;
        ret = strData.toString()+"%";
    }
    return ret;
}
//颜色获取
var getColor = function (numS) {
    cityId = $('#city_name').val();
    if(numS == undefined){
        numS = 0
    }
    var num =numS;
    var color_tmp = '#fff';
    if(cityId == 4403){
        if( num < 7){
            color_tmp = '#0b26e4'
        }else if(num >= 7  && num < 40 ){
            color_tmp = '#e40bd3'
        }else if(num >= 40  && num < 200){
            color_tmp = 'yellow'
        }else if(num >= 200){
            color_tmp = '#0be412'
        }
    }else if(cityId == 5101){
        if( num < 10){
            color_tmp = '#0b26e4'
        }else if(num >= 10  && num < 50 ){
            color_tmp = '#e40bd3'
        }else if(num >= 50  && num < 700){
            color_tmp = 'yellow'
        }else if(num >= 700){
            color_tmp = '#0be412'
        }
    }


    // color_tmp=120 * (1-((num - 1)/16));   //倒序
    return color_tmp;

}
Array.prototype.sum = function (){
    return this.reduce(function (partial, value){
        return partial + value;
    })
};


//数据转化
var dataServer = function (e) {
    var cityId=$('#city_name').val();
    ajaxThenParams('b2ef5406-a9d8-11e8-8a88-bd71fc9f27e2',"{city_id:'"+ cityId +"'}").then((res) => {
        renderMap(res)
    })
}

function renderMap(data) {
    console.log(data)
    map.clearOverlays();  //清除地图覆盖物
    var dataPoints1 = data;
    if(dataPoints1.length <= 0){
        return $(".heen").hide();
    }
    var areas1 = {}
    for (var areaa of dataPoints1) {
        var _area1 = areaa.sixpoint;    //商圈坐标对象
        var areaPoint = _area1.substring(0, _area1.length - 1).substr(1);
        var point_ = areaPoint.split(',');
        var str = [];
        for (var poin of point_) {
            var onePoint = poin.split(' ');
            var point = new BMap.Point(onePoint[0], onePoint[1]);
            str.push(point)
        }
        var window_conf1 = areaa;
        areas1[areaa.sixpoint] = {     //商圈坐标对象
            'points': str,
            'window_conf1': window_conf1
        }
        // console.log(areas1[area.polygon_path])    //商圈坐标对象
    }

    for (var key in areas1) {
        var polygon_cof1 = areas1[key];
        var polygon_points = polygon_cof1['points'];
        var polygon_window_conf1 = polygon_cof1['window_conf1'];
        var center_point_arr = getcenter_point1(polygon_points);
        var clor = getColor(polygon_window_conf1.avg_order_cnt);
        var polygon = new BMap.Polygon(polygon_points, {
            strokeColor: 'white',
            fillColor: clor,
            strokeWeight: 1,
            strokeOpacity: 0.5,
            fillOpacity:0.3
        });

        //创建多边形
        (function () {
            var contents = showInfo1(polygon_window_conf1);
            var hrcenter_ = polygon_window_conf1.center_point;     //后端的中心点坐标
            var content_id_ = polygon_window_conf1.block_id;
            var content_id = content_id_.replace(/\,/g,"/");
            var hrcenter = hrcenter_.replace(/\,/g,"/");
            var infons_id_center = '六边形ID :'+ content_id + '</br>'+'六边形中心点为 :'+ hrcenter;
            var infoWindow = new BMap.InfoWindow(contents, {
                // title: polygon_window_conf1.reception_probability
            });
            var infoWindow_id = new BMap.InfoWindow(infons_id_center, {
                // title: polygon_window_conf1.reception_probability
            });
            var center_point = getcenter_point1(polygon.getPath())
            // console.log(center_point_arr.lng)
            polygon.infoWindow = infoWindow;
            polygon.infoWindow_id = infoWindow_id;
            polygon.center_point = center_point;
            var scale = map.getZoom();
            var dx = -(5 / 2 * ( 19 - scale));
            var dy = -(5 / 2 * ( 19 - scale));

            var opts1 = {
                position: center_point_arr,    // 指定文本标注所在的地理位置
                offset: new BMap.Size(dx, dy)    //设置文本偏移量
            }
            var content = "<p style='text-align: center;padding-left: 3px;line-height: 12px'>"+small_number(polygon_window_conf1.week1) + '</p>'+
                "<p style='text-align: center;padding-left: 3px;line-height: 12px'>"+small_number(polygon_window_conf1.week2) + '</p>'+
                "<p style='text-align: center;padding-left: 3px;line-height: 12px'>"+small_number(polygon_window_conf1.week3) + '</p>'+
                "<p style='text-align: center;padding-left: 3px;line-height: 12px'>"+small_number(polygon_window_conf1.week4) + '</p>'+
                "<p style='text-align: center;padding-left: 3px;line-height: 12px'>"+polygon_window_conf1.avg_order_cnt + '</p>'
            ;
            var label = new BMap.Label(content, opts1);
            label.setStyle({
                color: 'black',
                fontSize: "9px",
                backgroundColor: "0.05",
                border: "0"//,
                //fontWeight: "bold"//,
                //textAlign
            });
            // label.addEventListener('click', function (e) {
            //     // 创建信息窗口对象
            //     // map.openInfoWindow(e.target.infoWindow, e.target.center_point);
            // })
            map.addOverlay(label);
        })();
        map.addOverlay(polygon);
    }
    $(".heen").hide();
}

//
// $("#getLastOverLay").click(function(e){
//     if(overlays.length){
//         console.log(e.overlays);
//     }else{
//         alert("没有覆盖物");
//     }
// })


// var overlays = [];
// //回调获得覆盖物信息
// var overlaycomplete = function(e){
//     var count_num = 0;
//     // console.log(e.drawingMode)
//     overlays.push(e.overlay);
//     var result = "";
//     result = "<p class='info_p'><span class='count_number'></span><button class='info_clear btn-primary'>清除</button></br>";
//     // result += e.drawingMode + ":";
//     if (e.drawingMode == BMAP_DRAWING_MARKER) {
//         result += ' 坐标：' + e.overlay.getPosition().lng + ' / ' + e.overlay.getPosition().lat;
//     }
//     if (e.drawingMode == BMAP_DRAWING_CIRCLE) {
//         result += ' 半径：' + e.overlay.getRadius()+'</br>';
//         result += ' 中心点：' + e.overlay.getCenter().lng + " / " + e.overlay.getCenter().lat;
//     }
//     if (e.drawingMode == BMAP_DRAWING_POLYLINE || e.drawingMode == BMAP_DRAWING_POLYGON || e.drawingMode == BMAP_DRAWING_RECTANGLE) {
//         result += e.overlay.getPath().length+'个点'+'</br>';
//         var objf = e.overlay.getPath();
//         objf.forEach((v,i)=>{
//             result += v.lng+' / '+v.lat+'</br>';
//         })
//         result+= "中心点 ："+getcenter_point1(objf).lng +" /  "+getcenter_point1(objf).lat+"</br>";
//     }
//     result += "</p>";
//     // $("showOverlayInfo").style.display = "none";
//     $(".show_infos").append(result);
// };

// $('.show_infos').on('click','button',function (e) {
//     $(this).parent().remove()
// })
// var styleOptions = {
//     strokeColor:"red",    //边线颜色。
//     fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
//     strokeWeight: 3,       //边线的宽度，以像素为单位。
//     strokeOpacity: 0.8,    //边线透明度，取值范围0 - 1。
//     fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
//     strokeStyle: 'solid' //边线的样式，solid或dashed。
// }
//实例化鼠标绘制工具
// var drawingManager = new BMapLib.DrawingManager(map, {
//     isOpen: false, //是否开启绘制模式
//     enableDrawingTool: true, //是否显示工具栏
//     drawingToolOptions: {
//         anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
//         offset: new BMap.Size(185, 0), //偏离值
//         scale: 0.8 //工具栏缩放比例
//     },
//     circleOptions: styleOptions, //圆的样式
//     polylineOptions: styleOptions, //线的样式
//     polygonOptions: styleOptions, //多边形的样式
//     rectangleOptions: styleOptions //矩形的样式
// });
// function clearAll() {
//     for(var i = 0; i < overlays.length; i++){
//         map.removeOverlay(overlays[i]);
//     }
//     overlays.length = 0;
// }

//添加鼠标绘制工具监听事件，用于获取绘制结果
// drawingManager.addEventListener('overlaycomplete', overlaycomplete);


// console.log(drawingManager)

// $('#clear_infos').click(function () {
//     $('.show_infos').html('')
// })
//控制编辑面板显示隐藏
// var isPanelShow = false;
// //显示结果面板动作
// function showPanel(){
//     if (isPanelShow == false) {
//         isPanelShow = true;
//         $("#showPanelBtn").css('right','230px');
//         $("#panelWrap").css('width','230px');
//         $("#showPanelBtn").html( "点击隐藏操作");
//         $('.left_btn').addClass('btn-primary');
//         $('.right_btn').removeClass('btn-primary');
//         $('.table_one').css('display','block');
//     } else {
//         isPanelShow = false;
//         $("#showPanelBtn").css('right','0');
//         $("#panelWrap").css('width','0');
//         $("#showPanelBtn").html("地图详细操作");
//         $('.BMapLib_Drawing').css('display','none');
//         $('.table_two').css('display','none');
//     }
// }
//
// $('.left_btn').click(function () {
//     $('.table_two').css('display','none');
//     $('.table_one').css('display','block');
//     $('.right_btn').removeClass('btn-primary');
//     $('.left_btn').addClass('btn-primary');
//     $('.BMapLib_Drawing').css('display','none');
// })
// $('.right_btn').click(function () {
//     $('.table_one').css('display','none');
//     $('.table_two').css('display','block');
//     $('.left_btn').removeClass('btn-primary');
//     $('.right_btn').addClass('btn-primary');
//     $('.BMapLib_Drawing').css('display','block');
// })

// $('.shensuo').click(function () {
//
// })
//时间过滤
// Date.prototype.Format = function (fmt) {
//     var o = {
//         "M+": this.getMonth() + 1, //月份
//         "d+": this.getDate(), //日
//         "h+": this.getHours(), //小时
//         "m+": this.getMinutes(), //分
//         "s+": this.getSeconds(), //秒
//         "q+": Math.floor((this.getMonth() + 3) / 3), //季度
//         "S": this.getMilliseconds() //毫秒
//     };
//     if (/(y+)/.test(fmt)) {
//         fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
//     }
//     for (var k in o)
//         if (new RegExp("(" + k + ")").test(fmt))
//             fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
//     return fmt;
// }
//刷新
// $('.update').click(function () {
//     assign_zhi("0","0","0","0");
//     $('.reception_probability').html("N/A");
//     var i = time1 = new Date().Format("yyyy-MM-dd hh:mm:ss");
//     // $('.timer').html("");
//     $('.timer').html(i);
//     dataServer();
// })
//赋值
// var assign_zhi = function(a,b,c,d) {
//     $('.total_waiting_couriers').html(a);   //闪送员
//     $('.total_pay_orders').html(b);         //支付单
//     $('.total_receive_orders').html(c);     //接收单
//     $('.not_receive_orders').html(d);       //未接单
//
// }

//////////////////////


