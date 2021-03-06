var map_polygons = new Object();

var map_data = [];
var map = new BMap.Map("allmap",{enableMapClick:false});
var map_save_Polygon = 'ext/userPageProfile/save.do';
var map_query_Polygon = 'ext/userPageProfile/query.do';
var map_delete_polygon = 'ext/userPageProfile/delete.do'
var mapMenuID = creat_mulist_id(window.location.hash);
var map_city_name = $('#city_name').val();
var timer_ = setTimeout(function () {
    map.centerAndZoom(new BMap.Point(116.42,39.92), 12);
    map.addControl(new BMap.NavigationControl());
    map.addControl(new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT}));
    timer_ = null;
},100)

map.setMinZoom(10);
map.enableScrollWheelZoom();

$("#getLastOverLay").click(function(e){
    if(overlays.length){
        console.log(e.overlays);
    }else{
        alert("没有覆盖物");
    }
})

var overlays = [];
//回调获得覆盖物信息
var overlaycomplete = function(e){
    var count_num = 0;
    // console.log(e.overlay)
    overlays.push(e.overlay);
    var result = "";
    result = "<p class='info_p'><span class='count_number'></span><button class='info_clear btn-primary'>清除</button></br>";
    // result += e.drawingMode + ":";
    if (e.drawingMode == BMAP_DRAWING_MARKER) {
        // console.log(map)
        result += ' 坐标：' + e.overlay.getPosition().lng + ' / ' + e.overlay.getPosition().lat;
    }
    if (e.drawingMode == BMAP_DRAWING_CIRCLE) {
        result += ' 半径：' + e.overlay.getRadius()+'</br>';
        result += ' 中心点：' + e.overlay.getCenter().lng + " / " + e.overlay.getCenter().lat;
    }
    if (e.drawingMode == BMAP_DRAWING_POLYLINE || e.drawingMode == BMAP_DRAWING_POLYGON || e.drawingMode == BMAP_DRAWING_RECTANGLE) {
        result += e.overlay.getPath().length+'个点'+'</br>';
        var objf = e.overlay.getPath();
        objf.forEach((v,i)=>{
            result += v.lng+' / '+v.lat+'</br>';
    })
        result+= "中心点 ："+getcenter_point1(objf).lng +" /  "+getcenter_point1(objf).lat+"</br>";
    }
    result += "</p>";
    // $("showOverlayInfo").style.display = "none";
    $(".show_infos").append(result);
};

$('.show_infos').on('click','button',function (e) {
    $(this).parent().remove();
})
var pline_color = 'red';
var fillor_color ='green';

function color_selection() {
    return {
        pline_color : $('.pline_color').val(),
        fillor_color : $('.fillor_color').val()
    }
}
var styleOptions = {
    strokeColor:pline_color,    //边线颜色。
    fillColor:fillor_color,      //填充颜色。当参数为空时，圆形将没有填充效果。
    strokeWeight: 8,       //边线的宽度，以像素为单位。
    strokeOpacity: 0.8,    //边线透明度，取值范围0 - 1。
    fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
    strokeStyle: 'solid' //边线的样式，solid或dashed。
}
//实例化鼠标绘制工具
var drawingManager = new BMapLib.DrawingManager(map, {
    isOpen: false, //是否开启绘制模式
    enableDrawingTool: true, //是否显示工具栏
    drawingToolOptions: {
        anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
        offset: new BMap.Size(185, 0), //偏离值
        scale: 0.8 //工具栏缩放比例
    },
    circleOptions: styleOptions, //圆的样式
    polylineOptions: styleOptions, //线的样式
    polygonOptions: styleOptions, //多边形的样式
    rectangleOptions: styleOptions //矩形的样式
});
function clearAll() {
    for(var i = 0; i < overlays.length; i++){
        map.removeOverlay(overlays[i]);
    }
    overlays.length = 0;
}

//添加鼠标绘制工具监听事件，用于获取绘制结果
drawingManager.addEventListener('overlaycomplete', overlaycomplete);

//右键事件删除
map.addEventListener("rightclick",function(e){
    map.removeOverlay(e.overlay)
    // console.log(e)
});
map.addEventListener("click",function(e){
    var clase = e.overlay.class_id;
    // map.removeOverlay(e.overlay)
    // console.log(e.point)
    console.log(map_polygons)
    console.log(e.overlay.class_id)
    // setContent('12')
    // getFillColor()
    // $('.e8849f17f8df637ca110aa6436cda477').html('12');
    console.log(e)
    // e8849f17f8df637ca110aa6436cda477
    $('.'+ clase).html('11')
    // e.overlay.day_total_pay_orders = 0;
    // console.log(e.overlay.day_total_pay_orders)
    // console.log(e.type)
    console.log(e.target)
    // map_polygons["e8849f17f8df637ca110aa6436cda477"].setFillColor("black")
    if('e8849f17f8df637ca110aa6436cda477'  == clase){
        console.log(clase)
        e.overlay.setFillColor('red')
    }
    // console.log(e.pixel)
    // console.log(e.target.ownId)
    // var order_map=map.getOverlays();
    // order_map.forEach(function (ele) {
    //     if (ele.ownId) {
    //         // console.log(ele)
    //     }
    // })

    //点击返回
    // var geoc = new BMap.Geocoder();
    // var pt = e.point;
    // geoc.getLocation(pt, function(rs){
    //     var addComp = rs.addressComponents;
    //     alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
    // });
    //
    // 转化
    // var myGeo = new BMap.Geocoder();
    // myGeo.getLocation(new BMap.Point(116.204461 ,39.866077), function(result){
    //     if (result){
    //         console.log(result.address);
    //     }
    // })

    });
// console.log(drawingManager)

$('#clear_infos').click(function () {
    $('.show_infos').html('')
})
//控制编辑面板显示隐藏
var isPanelShow = false;
//显示结果面板动作
function showPanel(){
    if (isPanelShow == false) {
        isPanelShow = true;
        $("#showPanelBtn").css('right','230px');
        $("#panelWrap").css('width','230px');
        $("#showPanelBtn").html( "点击隐藏操作");
        $('.left_btn').addClass('btn-primary');
        $('.right_btn').removeClass('btn-primary');
        $('.three_btn').removeClass('btn-primary');
        $('.table_one').show();
        // $('.table_three').hide();
    } else {
        isPanelShow = false;
        $("#showPanelBtn").css('right','0');
        $("#panelWrap").css('width','0');
        $("#showPanelBtn").html("地图详细操作");
        $('.BMapLib_Drawing').hide();
        $('.table_two').hide();
    }
}

$('.left_btn').click(function () {
    $('.table_two').hide();
    // $('.table_three').hide();
    $('.table_one').show();
    $('.right_btn').removeClass('btn-primary');
    $('.three_btn').removeClass('btn-primary');
    $('.left_btn').addClass('btn-primary');
    $('.BMapLib_Drawing').hide();
    drawingManager.close();
})
$('.right_btn').click(function () {
    $('.table_one').hide();
    // $('.table_three').hide();
    $('.table_two').show();
    $('.left_btn').removeClass('btn-primary');
    $('.three_btn').removeClass('btn-primary');
    $('.right_btn').addClass('btn-primary');
    $('.BMapLib_Drawing').show();
})
// $('.three_btn').click(function () {
//     $('.table_one').hide();
//     $('.table_two').hide();
//     $('.table_three').show();
//     $('.right_btn').removeClass('btn-primary');
//     $('.left_btn').removeClass('btn-primary');
//     $('.three_btn').addClass('btn-primary');
//     $('.BMapLib_Drawing').hide();
//     drawingManager.close();
// })

let citys = {};
$(function () {
    $("#city_name").select2();
    $(".js-example-basic-multiple").select2({
        theme:"classic"})
});
//初始化获取信息
$.get('ext/getDataset.do?dsCode=0f5a68a2-3e22-11e8-b8e5-2f283bb1c5c7',function (data) {
    var html = "";
    var ci = time1 = new Date().Format("yyyy-MM-dd hh:mm:ss");
    $('.timer').html(ci);
    citys = eval('('+ data.msg +')');
    $.each( citys, function(index, content){
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
    var sContent =
        '<ul style="margin:0 0 5px 0;padding:0.2em 0">';
    sContent = sContent
        + '<li style="line-height: 26px;font-size: 15px;">' +'实时未接单量:&nbsp;'+ polygon_cof1.day_not_receive_orders + '</li>'
        + '<li style="line-height: 26px;font-size: 15px;">' +'实时可接单闪送员:&nbsp;'+ polygon_cof1.day_total_waiting_couriers + '</li>'
        + '<li style="line-height: 26px;font-size: 15px;">' +'今日累计支付单量:&nbsp;'+ polygon_cof1.day_total_pay_orders + '</li>'
        + '<li style="line-height: 26px;font-size: 15px;">' +'今日累计接收单量:&nbsp;'+ polygon_cof1.day_total_receive_orders + '</li>'
        + '<li style="line-height: 26px;font-size: 15px;">' +'今日累计接单率:&nbsp;'+ polygon_cof1.reception_probability + '</li>'
        + '<li style="line-height: 26px;font-size: 15px;">' +'六边形ID:&nbsp;'+ polygon_cof1.hexagon_area_id + '</li>'
    ;
    sContent = sContent + '</ul>';
    return sContent;
}
//获取中心点
var getcenter_point1 = function (polygon_points) {
    var center_sum_L = 0;
    var center_sum_N = 0;
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
$('.append-setting').on('click', function () {
    $('.color_options').append('<div class="quse">\n' +
        '                        <input class="input_text start" type="text" placeholder="数字"> - <input class="input_text end" type="text" placeholder="数字">\n' +
        '                        <input class="select_color" type="color"><span class="delet_dom glyphicon glyphicon-remove-circle"></span>\n' +
        '                    </div>')
})
var settingArr = [
    { start: 0, end: 10, select: '#05f90d' },
    {start: 11, end: 100, select: '#f2ff21'},
    {start: 101, end: 500, select: '#ffa529'},
    {start: 501, end: 1000, select: '#ff312d'}
]
initColorMap()

// 初始化显示默认设置的区间与值
function initColorMap() {
    settingArr.forEach(function (ele) {
        var htmls = `<div class="quse">
                        <input value="${ele.start}" class="input_text start" type="text" placeholder="数字"> - <input value="${ele.end}" class="input_text end" type="text" placeholder="数字">
                        <input class="select_color" value="${ele.select}" type="color"><span class="delet_dom glyphicon glyphicon-remove-circle"></span>
                    </div>`;
        $('.color_options').append(htmls)
    })
}
$('#loadMapSetting').on('click', function () {
    settingArr = []
    $('.quse').each(function () {
        settingArr.push({
            start: $(this).find('.input_text').val(),
            end: $(this).find('.end').val(),
            select: $(this).find('.select_color').val()
        })
    })
    renderMap(map_data,$('.select_status').val(),$(".checkbox_hides[type='checkbox']").is(':checked'))
    // $(".checkbox_hides[type='checkbox']").is(':checked');
    // dataServer()
})
function careCloar(num) {
    var color = '#ebc5e8';
    // console.log(parseFloat(num))
    settingArr.forEach(function (ele) {
        if (parseFloat(num) >= ele.start && parseFloat(num) <= ele.end) {
            color = ele.select
        }
    })
    return color
}
$('.color_options').on('click','span',function () {
    $(this).parent().remove();
})

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
    // 'org/cboard/view/custom/BMap_AI_server/app.json'
    // 'bmap/dataByCityName2es.do'
    $.ajax({
        beforeSend: function(){
            $(".heen").show();
        },
        url:city_json,
        type:'POST',
        data:{
            cityName:cityName
        },
        success: function (result) {
            var select_statusd = $('.select_status').val();
            map_data = result
            // console.log(result)
            renderMap(map_data, select_statusd,$(".checkbox_hides[type='checkbox']").is(':checked'))
        }
    })
}
//得到数据转换的方法
function renderMap(data, type,checkbox_hides) {
    map.clearOverlays();  //清除地图覆盖物
    var dataPoints1 = data;
    if(dataPoints1.length <= 0){
        return $(".heen").hide();
    }
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
    var polygons_value_day_total_waiting_couriers = [];       //可接单闪送员
    var polygons_value_day_total_pay_orders = [];              //支付单量
    var polygons_value_day_total_receive_orders = [];          //接收单

    for (key in areas1) {
        var polygon_cof1 = areas1[key];
        var polygon_window_conf1 = polygon_cof1['window_conf1'];
        // console.log(polygon_window_conf1)
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
    var GossValue  = polygons_value_day_total_pay_orders;
    if(type == 'day_not_receive_orders'){
        GossValue = polygons_value_day_not_receive_orders;
    }else if(type == 'day_total_waiting_couriers'){
        GossValue = polygons_value_day_total_waiting_couriers;
    }else if(type == 'day_total_pay_orders'){
        GossValue = polygons_value_day_total_pay_orders;
    }else if(type == 'day_total_receive_orders'){
        GossValue = polygons_value_day_total_receive_orders
    }

    for (var key in areas1) {
        var polygon_cof1 = areas1[key];
        var polygon_points = polygon_cof1['points'];
        var polygon_window_conf1 = polygon_cof1['window_conf1'];
        var center_point_arr = getcenter_point1(polygon_points);
        // console.log(polygon_window_conf1.id)
        var clor = careCloar(polygon_window_conf1[type]);
        // console.log(clor)
        var polygon = new BMap.Polygon(polygon_points, {
            strokeColor: 'white',
            fillColor: clor,
            strokeWeight: 1,
            strokeOpacity: 0.5
        });
        // console.log(polygon_window_conf1)
        polygon.ownId = polygon_window_conf1.hexagon_area_id;
        //创建多边形
        (function () {
            var contents = showInfo1(polygon_window_conf1);
            var hrcenter_ = polygon_window_conf1.center_point;     //后端的中心点坐标
            var content_id_ = polygon_window_conf1.hexagon_area_id; //六边形id
            var content_id = content_id_.replace(/\,/g,"/");
            var hrcenter = hrcenter_.replace(/\,/g,"/");
            var oder_id = polygon_window_conf1.id;
            var infons_id_center = '六边形ID :'+ content_id + '</br>'+'六边形中心点为 :'+ hrcenter;
            var infoWindow = new BMap.InfoWindow(contents, {
                // title: polygon_window_conf1.reception_probability
            });
            // var infoWindow_id = new BMap.InfoWindow(infons_id_center, {
            //     // title: polygon_window_conf1.reception_probability
            // });
            var center_point = hrcenter_;
            polygon.infoWindow = infoWindow;
            // polygon.infoWindow_id = infoWindow_id;
            polygon.class_id = oder_id;
            polygon.center_point = center_point;
            polygon.day_total_pay_orders = polygon_window_conf1.day_total_pay_orders;
            map_polygons[oder_id] = polygon;
            polygon.addEventListener('click', function (e) {
                // 创建信息窗口对象
                map.openInfoWindow(e.target.infoWindow, e.target.center_point);
            })
            // polygon.addEventListener("rightclick",function(e){
            //     map.openInfoWindow(e.target.infoWindow_id, e.target.center_point);
            // });
            var scale = map.getZoom();
            var dx = -(5 / 2 * ( 19 - scale));
            var dy = -(5 / 2 * ( 19 - scale));

            var opts1 = {
                position: center_point_arr,    // 指定文本标注所在的地理位置
                offset: new BMap.Size(dx, dy)    //设置文本偏移量
            }
            var line1FontSize = "18";
            var content = "";
            var temp = polygon_window_conf1[type];
            var defaultContent = "<p class='"+oder_id+"' style='text-align: center;padding-left: 3px;line-height: 35px'>" + temp +'</p>' ;
            if (scale < 11) {
                content = polygon_window_conf1[type];
            } else {
                content = defaultContent;
            }
            var label = new BMap.Label(content, opts1);
            label.setStyle({
                color: 'black',
                fontSize: "9px",
                backgroundColor: "0.05",
                border: "0"//,
                //fontWeight: "bold",
                //textAlign
            });
            label.addEventListener('click', function (e) {
                // 创建信息窗口对象
                map.openInfoWindow(e.target.infoWindow, e.target.center_point);
            })
            map.addOverlay(label);
            if(checkbox_hides == true){
                label.hide();
            }else {
                console.log(111)
            }
            // console.log(checkbox_hides)
        })();
        // console.log(polygon.ownId)
        // console.log("ID="+poi_id);

        map.addOverlay(polygon);
    }
    $(".heen").hide();
}


// var map_polygon_name = [];
update_map_list()
//刷新绘图数据列表
function update_map_list() {
    // profileClass  传  1 是option设置   传 2 是绘图坐标
    $.ajax({
        url:map_query_Polygon,
        type:'POST',
        data:{
            menuId:mapMenuID,
            profileClass:2
        },
        success: function (result) {
            var data_msg = undefined;
            var resuul = '';
            if(result.status == '1'){
                data_msg = eval('('+ result.msg +')');
                // console.log(data_msg)
                for(var k=0;k<data_msg.length;k++){
                    var dso = data_msg[k].profileValue;
                    var map_id = data_msg[k].id;
                    resuul +="<tr><td class='td_center' style='width: 40px;'>"+ map_id + "</td><td class='td_center' style='overflow: auto;width: 106px'>"+ data_msg[k].profileName + "</td><td><span class='hangnei_btn shouzhi btn-success map_delete' onclick='canvas_map("+dso+ ',' + map_id + ")'>预览</span><span class='hangnei_btn btn-danger shouzhi' onclick='map_deletel("+map_id+")'>删除</span></td></tr>";
                    // map_polygon_name.push( data_msg[k].profileName);
                }
                $('.table_count').html(resuul);
            }else if(result.status == '2'){
                data_msg = result.msg;
                resuul = '<tr><td>'+data_msg+'</td><td>'+data_msg+'</td><td>'+data_msg+'</td></tr>';
                $('.table_count').html(resuul);
            }
        }
    })
}
//绘图-
$('.add_btn').click(function () {
    $('.add_map_infor_zhe').show();
    $('.fugai').html(overlays.length)

})
//绘图-取消
$('.btn_cancel').click(function () {
    $('.add_map_infor_zhe').hide();

})
//绘图-已保存
$('.btn_ok').click(function () {
    var fugaiwu_val = $('.fugai').text();
    var mapCanvasName = $('.map_canvas_name').val();
    if(fugaiwu_val == 0 ){
        alert("没有覆盖物，请绘制完画完再保存");
        $('.add_map_infor_zhe').hide();
    }else if(mapCanvasName == ''){
        alert("请输入名称");
    }else {
        $('.add_map_infor_zhe').hide();
        var map_type_arry=[];
        var map_type_ = overlays.toString();
        var map_type =map_type_.replace(/\[object /g,'').replace(/\]/g,'').split(',');
        var map_obj={};
        var map_arr = [];
        // console.log(map_type)
        for(var i=0;i<map_type.length;i++){
            // console.log(map_type[i])
            if(map_type[i] == 'Polygon' || map_type[i] == 'Polyline'){
                map_obj ={
                    map_type:map_type[i],
                    map_point : overlays[i].ia
                }
                map_arr.push(map_obj);
            }else if(map_type[i] == 'Marker'){
                map_obj ={
                    map_type:map_type[i],
                    map_point : overlays[i].point
                }
                map_arr.push(map_obj);
            }
        }
        var map_canvas_data = JSON.stringify(map_arr);
        $.ajax({
            url:map_save_Polygon,
            type:'POST',
            data:{
                cityName:map_city_name,
                profileValue:map_canvas_data,
                profileClass:2,
                profileName:mapCanvasName,
                menuId:mapMenuID
            },
            success: function (result) {
                if(result.status == 1){
                    alert(result.msg);
                    update_map_list()
                }else{
                    alert(result.msg);
                }
            }
        })
    }

})

//绘图- 预览
function canvas_map(o ,id) {
    var overi_map=map.getOverlays();
    // console.log(overi_map)
    var  dataArr = o;
    overi_map.forEach(function (ele) {
        if (ele.ownId) {
            map.removeOverlay(ele)
        }
    })
    dataArr.forEach((v,i)=>{
        if(v.map_type == "Polygon"){
        canvas_polygon(v.map_point, id)
    }else if(v.map_type == "Polyline"){
        canvas_polyline(v.map_point, id)
    }else if(v.map_type == "Marker"){
        canvas_marker(v.map_point, id)
    }
})
}
//绘图-多边形
function canvas_polygon(data, id){
    var polygon_1 = new BMap.Polygon(data, {
        strokeColor: 'red',
        fillColor: 'green',
        strokeWeight: 8,
        strokeOpacity: 0.5
    });
    polygon_1.ownId = id
    map.addOverlay(polygon_1);
}
//绘图-划线
function canvas_polyline(data, id){
    data = data.map((v,i)=>{
        return new BMap.Point(v.lng,v.lat)
    })
    var polyline_1 =new BMap.Polyline(data, {
        enableEditing: false,//是否启用线编辑，默认为false
        enableClicking: true,//是否响应点击事件，默认为true
        strokeWeight:'8',//折线的宽度，以像素为单位
        strokeOpacity: 0.8,//折线的透明度，取值范围0 - 1
        strokeColor:"red" //折线颜色
    });
    polyline_1.ownId = id
    map.addOverlay(polyline_1);
}
//绘图-打点
function canvas_marker(data, id){
    var marker = new BMap.Marker(data);// 创建标注
    marker.ownId = id
    map.addOverlay(marker);
}
//获取menuId
function creat_mulist_id(mulistUrl){
    var mulist_url = '/'+ mulistUrl.split('/').pop();
    var menuID='';
    Array.prototype.filter.call(menuList,(o) =>{
        if(o.menuStateUrl == mulist_url ){
        return menuID = o.menuId;
    }
})
    return menuID;
}
//绘图-删除
function map_deletel(id) {
    var r = confirm("是否删除");
    if (r) {
        $.ajax({
            url:map_delete_polygon,
            type:'POST',
            data:{
                id,
                profileClass:2
            },
            success: function (result) {
                if(result.status == 1){
                    alert('删除成功')
                    update_map_list();
                    var overi_map=map.getOverlays();
                    overi_map.forEach(function (ele) {
                        if (ele.ownId) {
                            map.removeOverlay(ele)
                        }
                    })
                    update_map_list();
                }
            }
        })
    } else {
        alert("已取消");
    }
}

//参数保存options
$('.save_options').click(function () {
    var select_statusd = $('.select_status').find("option:selected").text();
    $('.dateServer_infor').show();
    $('.selected_name').html(select_statusd);
    var options_colorarr = [];
    $('.quse').each(function () {
        options_colorarr.push({
            start: $(this).find('.input_text').val(),
            end: $(this).find('.end').val(),
            select: $(this).find('.select_color').val()
        })
    })
    // console.log(options_colorarr)
    updateColorMap(options_colorarr);
    // options_colorarr = '';
    // console.log(options_colorarr)

})

//传参-取消
$('.dateServer_cancel').click(function () {
    $('.dateServer_infor').hide();

})
//映射弹窗
function updateColorMap(arrys) {
    // $('.dataServer_option').empty();
    var htmls = ''
    arrys.forEach(function (ele) {
        htmls += `<p>
                        <span>${ele.start}</span> - <span>${ele.end}</span>
                        <span class="selected_co">${ele.select}</span>
                    </p>`;

    })
    $('.dataServer_option').html(htmls);
}
//传参-点击确认
$('.dateServer_ok').click(function () {
    var dateServerOptionName = $('.dateServer_option_name').val();
    var selectedName = $('.selected_name').val();
    // console.log(dateServerOptionName)
    if(dateServerOptionName == ''){
        alert("请输入保存名称");
    }else {
        $('.dateServer_infor').hide();
        var optionName = $('.select_status').val();
        var optionName_ = {
            optionName :optionName
        };
        var option_colorarry = [];
        $('.quse').each(function () {
            option_colorarry.push({
                start: $(this).find('.input_text').val(),
                end: $(this).find('.end').val(),
                select: $(this).find('.select_color').val()
            })
        })
        option_colorarry.push(optionName_);
        // console.log(option_colorarry)
        // console.log(option_colorarry)

        var optionColorArry = JSON.stringify(option_colorarry);
        $.ajax({
            url:map_save_Polygon,
            type:'POST',
            data:{
                cityName:map_city_name,
                profileValue:optionColorArry,
                profileClass:1,
                profileName:dateServerOptionName,
                menuId:mapMenuID
            },
            success: function (result) {
                if(result.status == 1){
                    alert(result.msg);
                    update_option_list()
                }else{
                    alert(result.msg);
                }
            }
        })
    }

})
update_option_list()
//刷新配置数据列表
function update_option_list() {
    // profileClass  传  1 是option设置   传 2 是绘图坐标
    $.ajax({
        url:map_query_Polygon,
        type:'POST',
        data:{
            menuId:mapMenuID,
            profileClass:1
        },
        success: function (result) {
            var data_msg = undefined;
            var resuul = '';
            if(result.status == '1'){
                data_msg = eval('('+ result.msg +')');
                // console.log(data_msg)
                for(var k=0;k<data_msg.length;k++){
                    var dso = data_msg[k].profileValue;
                    var map_id = data_msg[k].id;
                    resuul +="<tr><td class='td_center' style='width: 40px;'>"+ map_id + "</td><td class='td_center' style='overflow: auto;width: 106px'>"+ data_msg[k].profileName + "</td><td><span class='hangnei_btn shouzhi btn-success map_delete' onclick='option_map("+dso+ ")'>加载</span><span class='hangnei_btn btn-danger shouzhi' onclick='option_deletel("+map_id+")'>删除</span></td></tr>";
                }
                $('.table_option').html(resuul);

            }else if(result.status == '2'){
                data_msg = result.msg;
                resuul = '<tr><td>'+data_msg+'</td><td>'+data_msg+'</td><td>'+data_msg+'</td></tr>';
                $('.table_option').html(resuul);
            }
        }
    })
}

//配置-删除
function option_deletel(id) {
    var r = confirm("是否删除");
    if (r) {
        $.ajax({
            url:map_delete_polygon,
            type:'POST',
            data:{
                id,
                profileClass:1
            },
            success: function (result) {
                if(result.status == 1){
                    alert('删除成功')
                    update_map_list();
                    var overi_map=map.getOverlays();
                    overi_map.forEach(function (ele) {
                        if (ele.ownId) {
                            map.removeOverlay(ele)
                        }
                    })
                    update_option_list()
                }
            }
        })
    } else {
        alert("已取消");
    }
}
//预览读取参数渲染页面
function option_map(o) {
    // console.log(o)
    var option_type='';
    o.forEach(function (o) {
        return option_type = o.optionName;
    })
    $('.color_options').html('');
    o.slice(0,o.length-1).forEach(function (ele) {
        var htmls = `<div class="quse">
                        <input value="${ele.start}" class="input_text start" type="text" placeholder="数字"> - <input value="${ele.end}" class="input_text end" type="text" placeholder="数字">
                        <input class="select_color" value="${ele.select}" type="color"><span class="delet_dom glyphicon glyphicon-remove-circle"></span>
                    </div>`;
        $('.color_options').append(htmls);
    })
    $('.select_status').val(option_type);
    settingArr = o.slice(0,o.length-1);
    dataServer()
}

function tableToExcel(){
    console.log(map_data);
    //要导出的json数据
    var jsonData=[];
    var jsonData_ = JSON.parse(JSON.stringify(map_data));
    jsonData = jsonData_;
    map_data.forEach(ele => {
        var center_points = ele.center_point;
        // ele.center_point = '';
        // ele.hexagon_area_id = '';
        // ele.hexagon_points = '';
        delete ele.hexagon_points;
        delete ele.hexagon_area_id;
        delete ele.id;
        // var hexagon_id = ele.hexagon_area_id;
        // console.log(hexagon_id.replace(',',''))
        var l = center_points.indexOf(',');
        var lng = center_points.slice(0, l);
        var lat = center_points.slice(l + 1, center_points.length);
        var myGeo = new BMap.Geocoder();
        myGeo.getLocation(new BMap.Point(lng,lat), function(result){
            // console.log(result)
            if (result){
                ele.address = result.address
            }
        })
    })
    jsonData = map_data;
    // console.log(jsonData)
    // 列标题，逗号隔开，每一个逗号就是隔开一个单元格
    let str = `六边形经度,六边形纬度,所在城市,未接单,可接单闪送员,接收单量,支付单量,该区域接单率,该区域中心位置\n`;
    // //增加\t为了不让表格显示科学计数法或者其他格式
    setTimeout(() => {
        for(let i = 0 ; i < jsonData.length ; i++ ){
            for(let item in jsonData[i]){
                // console.log(jsonData[i][item])
                str+=`${jsonData[i][item] + '\t'},`;
                // str +=  jsonData[i][item];
            }
            // console.log(str)
            str+='\n';
        }
        // console.log(str)
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
    },10000)
}