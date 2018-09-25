
function p(s) {
    return s < 10 ? '0' + s: s;
}

function GetDateStr(AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;//获取当前月份的日期
    var d = dd.getDate();
    return y + "-" + p(m) + "-" + p(d);
}
//遍历数据转化
var dataJ = function dataJ(_ref) {
    var columnList = _ref.columnList;
    var data = _ref.data;
    var obj = {};
    // console.log(data.length)
    columnList.map(function (o, i) {
        return obj[o.name] = data[0][i];
    });
    return obj;
};
//监听是否是全国
var watchhender = function () {
    if($('.select_city').val() == '0'){
        $('.hidens').css("display","none");
    }else {
        $('.hidens').css("display","block");
    }
}
$(function () {
    //执行一个laydate实例   +  日期切换
    laydate.render({
        elem: '#time',
        theme: 'molv',
        showBottom: false,
        min: '2014-03-26',
        max:GetDateStr(-1),
        value: GetDateStr(-1),
        done:function(value, date, endDate){
           // console.log(value);
            $(".datas").empty();
            data_push()
        }
    });
    $(".select_city").select2();
    $(".js-example-basic-multiple").select2({
        theme:"classic"
    })
});

//城市切换
var changer = function(){
    $(".datas").empty();
    data_push();
    watchhender();
}

// 判断上下箭头
var check = function(statua){
	var classes;
    if(statua == 1) {
        classes = 'Triangle'
    } else {
        classes = 'Triangle-down'
    }
    return classes
}

// 判断是否有警告框
var notice = function(statub){
	var imgs;
    if(statub == 0){
        imgs = "";
    }else {
        imgs = "ycz.png";
    }
    return imgs
}

//过滤方法
var filter_number = function(num){
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

var filltersnum = function (b,a) {
    var stte = Math.round(b/a * 100);
    if(stte == 'Infinity'){
        stte = 0;
    }
    var numbss = stte.toString()+"%";
    return numbss;
}
//赋值加减符号判断
var threshold =function(num,fazhi){
    var numbe ='';
    if(fazhi == 0){
        numbe = '';
    }else if(fazhi == 1){
        numbe = '+' + small_number(num) + '<i><img src="org/cboard/view/custom/overh/imgs/ycz.png" alt=""></i>';
    }else {
        numbe = '-' + small_number(num) + '<i><img src="org/cboard/view/custom/overh/imgs/ycz.png" alt=""></i>';
    }
    return numbe;
}
// console.log(threshold(0.21,2))

//初始化
$.get('ext/getDataset.do?dsCode=0f5a68a2-3e22-11e8-b8e5-2f283bb1c5c7',function (data) {
    if(data.status != '1'){
        console.error(data.msg);
        return;
    }
    var html = "";
    data = eval('('+ data.msg +')');

    // console.log(data)
    $.each( data, function(index, content){
        var dataObj =content ;
        html += "<option value='"+ dataObj.city_id +"'>"+ dataObj.city_name +"</option>";
    });
    $('.select_city').append(html);
})



