
var map = new BMap.Map("allmap",{enableMapClick:false});
var timer_ = setTimeout(function () {
    map.centerAndZoom(new BMap.Point(116.42,39.92), 12);
    map.addControl(new BMap.NavigationControl());
    map.addControl(new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT}));
    timer_ = null;
},100)

map.setMinZoom(10);
map.enableScrollWheelZoom();


var this_url = document.URL;
// var ws = new WebSocket("ws://localhost:8080/bdportal/chat");
var ws = new WebSocket("ws://172.23.1.130:8080/bdportal/chat");
// 地址栏发生变化时关闭
if( ('onhashchange' in window) && ((typeof document.documentMode==='undefined') || document.documentMode==8)) {
    // 浏览器支持onhashchange事件
    window.onhashchange = hashChangeFire;  // TODO，对应新的hash执行的操作函数
}

function hashChangeFire(){
    if( document.URL != this_url){
        console.log("地址栏发生变化")
        ws.close();
    }else {
        console.log(111)
    }
}
ws.onopen = function(message) {
    console.log(message)
    console.log(ws.readyState)
};
ws.onclose = function(message) {
    console.log(message)
};
ws.onmessage = function(message) {
    showMessage(message.data);
    // console.log(message)
};
//关闭连接
//        function closeWebSocket() {
//            ws.close();
//        }
//页面刷新的时候关闭
window.onbeforeunload = function() {
    ws.close();
    console.log("连接已关闭...");
};
//页面关闭时的监听方法
//        window.onload = function () {
//            console.log('页面关闭时')
//            ws.close();
//        }

//发送消息
function send() {
    var input = document.getElementById("msg");
    var text = input.value;
    var data = {
        cityId:"1101,3101",
        cityName:"北京市,上海市",
        statusFromMenu:"21,22,30,31",
        status:10
    };
    // var data = {
    //     fromMenuName : "dashboard/test_websocket",
    //     data : text,
    //     status : 0
    // };
    ws.send(JSON.stringify(data));
    input.value = "";
}
function sends(cityId,cityNam) {
    var data = {};
    data = {
        cityId:cityId,
        cityName:cityNam,
        statusFromMenu:"20,21",
        status:10
    };
    console.log(websorketAdd.readyState)
    if(websorketAdd.readyState == 1){
        websorketAdd.send(JSON.stringify(data))
        return;
    }
    websorketAdd.addEventListener('open', function () {
        websorketAdd.send(JSON.stringify(data))
        return;
    });
}
sends('1101','北京市');
function showMessage(message) {
    var map_data = eval('('+ message +')');
    // var map_code = eval('('+ map_data.data +')');
    // var map_data = JSON.parse(message);
    // var map_code = JSON.parse(map_data.data);
    // // var br = document.createElement("br")
    // // var div = document.getElementById("showChatMessage");
    // // div.appendChild(text);
    // // div.appendChild(br);
    console.log(map_data)
    if(map_data.status == 11){
        var map_code = JSON.parse(map_data.data);
        map_code.forEach((v,i)=>{
            web_canvas_marker(v.lng,v.lat,v.user_id)
        })
        // var br = document.createElement("br")
        // var div = document.getElementById("showChatMessage");
        // div.appendChild(text);
        // div.appendChild(br);
    }else if(map_data.status == 12){
        $('.inp_1').text(JSON.parse(message).data);
    }else if(map_data.status == 13){
        console.log(JSON.parse(map_data.data))
    }else if(map_data.status == 21){
        console.log(JSON.parse(map_data.data));
    }
    // console.log(map_code)
    // canvas_polyline(map_code,1)
    // map_code.forEach((v,i)=>{
    //     web_canvas_marker(v.lng,v.lat,v.user_id)
    // })
    // var cont_lng = map_code[0].lng;
    // var cont_lat = map_code[0].lat;
    // web_canvas_marker(cont_lng,cont_lat,map_code[0].user_id)

}





//绘图-划线
function web_canvas_polyline(data, id){
    // console.log(data)
    var data_ = [];
    data_ = data.map((v,i)=>{
        return new BMap.Point(v.lng,v.lat)
    })
    var sy = new BMap.Symbol(BMap_Symbol_SHAPE_BACKWARD_OPEN_ARROW, {
        scale: 0.6,//图标缩放大小
        strokeColor:'#fff',//设置矢量图标的线填充颜色
        strokeWeight: '2',//设置线宽
    });
    var icons = new BMap.IconSequence(sy, '10', '30');
    var polyline_1 =new BMap.Polyline(data_, {
        enableEditing: false,//是否启用线编辑，默认为false
        enableClicking: true,//是否响应点击事件，默认为true
        // icons:[icons],
        strokeWeight:'2',//折线的宽度，以像素为单位
        strokeOpacity: 0.8,//折线的透明度，取值范围0 - 1
        strokeColor:"red" //折线颜色
    });
    polyline_1.ownId = id
    map.addOverlay(polyline_1);
}
//绘图-打点
function web_canvas_marker(data_lng,data_lat, id){
    var point = new BMap.Point(data_lng,data_lat);
    var marker = new BMap.Marker(point);// 创建标注
    marker.ownId = id
    map.addOverlay(marker);
}