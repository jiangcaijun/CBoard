COMMON_BASE_URL="http://39.107.53.128:8765/";
jsessionId="c3772ac7623649449d45ad11cd1b5fd1";

var msg4Login = '登陆失败，前往登陆页面';
function ajaxRequest(method, url, callback, urlParams, bodyParams) {

    var urlSuffix = "";
    if(typeof urlParams != 'undefined') {
       for(var k in urlParams) {
           if(urlSuffix.length == 0) {
               urlSuffix = "?";
           } else {
               urlSuffix += "&";
           }
           urlSuffix += k + "=" + encodeURIComponent(urlParams[k]);
       }
    }
    
    var data = "";
    if(typeof bodyParams != 'undefined') {
        data = bodyParams;
    }
    
    var headers = {};

    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': 'true',
    };
    url = COMMON_BASE_URL + url + urlSuffix;
    /*axios({
        headers: headers,
        method: method,
        url: url,
        credentials: true,
        timeout: 50000, // 请求的超时时间
        data: data,
    })
    .then(function (response) {
        if(response != undefined && response.status == "2" && response.code == 401){
            layer.alert(response.msg, {icon: 2});
        }else {
            callback(response.data);
        }
    })
    .catch(function (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            if(error.response.status == 401){
                //询问框
                layer.confirm(msg4Login, {
                    icon: 2,
                    btn : [ '确定', '取消' ]//按钮
                }, function(index) {
                    window.location.href = "login.html";
                });
            }else if(error.response.status != undefined){
                layer.alert("接口：" + url + "；</br> 返回：" + error.response.status + "," + error.response.statusText, {icon: 2});
            }else if(error.responseJSON.status != undefined && error.responseJSON.status == "2"){
                layer.alert(error.responseJSON.msg, {icon: 2});
            }
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            layer.alert(error.message, {icon: 2});
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
    });*/

    $.ajax({
        headers: headers,
        dataType: 'json',
        processData: false,
        contentType: 'application/json',
        type: method,
        url:  url,
        data:  data,
        success: function(data) {     
            callback(data);
        } ,
        error: function(XMLHttpRequest, textStatus, errorThrown){

            var statusCode = XMLHttpRequest.status;
            var statusText = XMLHttpRequest.statusText;

            var msg = JSON.stringify(XMLHttpRequest);
            layer.alert("连接服务器错误: " + msg +". 请联系管理员后再做尝试" );
        }
      });
}

function ajaxGet(url, callback, urlParams) {
    ajaxRequest("GET", url, callback, urlParams);
}

function checkLogin() {
    var token = $.cookie("zeus_token");
    if(typeof token == "undefined" || token == null) {
        location.href="../../login.html";
    }
}

function logout() {
    $.removeCookie("zeus_token");
    location.href="../../login.html";
}

//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return decodeURI(r[2]); return null; //返回参数值
}

/**
 * jquery 的扩展方法
 */
jQuery.extend( {
    /**
     *将form表单数据转化为json-data
     *@form : form id
     *@jsondata : 需要拓展的json数据
     *@symbol : 多选分隔符
     *@blacklist:不需要的element
     */
    form2json : function(form, jsondata, symbol, blacklist) {
        var formString = "";
        var dataString = "";
        if (isEmpty(symbol)) {
            symbol = "";
        }
        if (isNotEmpty(form)) {
            var formEle = new Map();
            var elements = jQuery("#" + form).formToArray(true);
            for (var i = 0; i < elements.length; i++) {
                if (elements[i].type == "checkbox" && elements[i].checked != true) {
                    continue;
                }
                if (formEle.containsKey(elements[i].name)) {
                    formEle.get(elements[i].name).push(elements[i].value);
                } else if (elements[i].name != blacklist) {
                    var dataArray = new Array();
                    dataArray[0] = elements[i].value;
                    formEle.put(elements[i].name, dataArray);
                }
            }
            for (var i = 0; i < formEle.array.length; i++) {
                var ele = formEle.array[i];
                var eleName = ele.key;
                var eleValue = "";
                for (var j = 0; j < ele.value.length; j++) {
                    eleValue += symbol + ele.value[j].replaceAll('#','%23').replaceAll('&',"%26") + symbol + ",";
                }
                if (eleValue.length > 0) {
                    eleValue = eleValue.substring(0, eleValue.length - 1);
                }
                formString += '"' + eleName + '":"' + eleValue + '",';
            }

            if (formString.length > 0) {
                formString = formString.substring(0, formString.length - 1);
            }
        }

        if (isNotEmpty(jsondata)) {
            dataString = JSON.stringify(jsondata);
            dataString = trim(dataString.substring(1, dataString.length - 1));
        }

        var obj = {};
        if (formString.length > 0 && dataString.length > 0) {
            obj.data = "{" + formString + "," + dataString + "}";
        } else if (formString.length > 0) {
            obj.data = "{" + formString + "}";
        } else {
            obj.data = "{" + dataString + "}";
        }

        return obj;
    },
    /**
     * @author
     *@gridID         grid 容器id
     *@toolbarId      工具类id
     *@url			 请求url
     *@columns        列属性
     *@condition    请求参数
     *@header       请求headers
     *@pageSize     初始每列显示条数
     *@noPage       是否分页
     *@dsCode       自定义数据集概览的dsCode
     */
    tgrid : function(gridID, toolbarId, url, columns, condition, pageSize, noPage, onClickRow, dsCode) {

        var headers = {};

        headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
            'jsessionId':  jsessionId,
        };

        //传递的参数
        function queryParams(params) {
            var param={};
            var paramTemp={};
            // param["pageNum"]=(params.offset / params.limit) + 1;
            // param["pageSize"]=params.limit;
            // paramTemp["search"] = params.search;
            paramTemp["offset"] = params.offset;
            paramTemp["size"] = params.limit;
            // paramTemp["start_time"] = params.start_time;
            if( typeof(condition) != "undefined"&&condition !=null ){
                for ( var key in condition) {
                    paramTemp[key] = condition[key];
                }
            }
            param["params"] = JSON.stringify(paramTemp);
            param["dsCode"] = dsCode;
            return param;
        }
        $('#' + gridID).bootstrapTable({
            xhrFields: {
                withCredentials: true
            },
            url: url, // 请求后台的URL（*）
            dataType : "json",
            method: 'get', // 请求方式（*）
            toolbar: '#'+toolbarId, // 工具按钮用哪个容器
            striped: true, // 是否显示行间隔色
            cache: false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: isEmpty(noPage) ? true : noPage, // 是否显示分页（*）
            sortable: false, // 是否启用排序
            sortOrder: "asc", // 排序方式
            queryParamsType : "limit",     // restful
            queryParams: queryParams, // 传递参数（*）
            sidePagination: "server", // 分页方式：client客户端分页，server服务端分页（*）
            pageNumber: 1, // 初始化加载第一页，默认第一页
            pageSize: pageSize, // 每页的记录行数（*）
            pageList: [ 10, 20,50, 100], // 可供选择的每页的行数（*）
            //			height : 456,
            uniqueId: "ID", // 每一行的唯一标识，一般为主键列
            search: false, // 是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
            strictSearch: false,
            showColumns: true, // 是否显示所有的列
            showRefresh: false, // 是否显示刷新按钮
            minimumCountColumns: 2, // 最少允许的列数
            clickToSelect: true, // 设置true 将在点击行时，自动选择rediobox 和 checkbox
            showToggle: true, // 是否显示详细视图和列表视图的切换按钮
            cardView: false, // 是否显示详细视图
            detailView: false, // 是否显示父子表、
            paginationLoop: true,
            maintainSelected: true,
            showExport: true,
            exportDataType: "basic",
            responseHandler: function(res , data) { // res 为后台返回码, data为返回体
                if(res.status == 2){
                        res.total = 0;
                    return res;
                }else {
                    // console.log(JSON.parse(res.msg))
                    return JSON.parse(res.msg);
                }
            },
            onLoadError: function(res , data) { // res 为后台返回码, data为返回体
                //询问框
                // if(res == 401){
                //     layer.confirm(msg4Login, {
                //         icon: 2,
                //         btn : [ '确定', '取消' ]//按钮
                //     }, function(index) {
                //         window.location.href = "login.html";
                //     });
                // }else if(data != undefined && data.responseJSON != undefined && data.responseJSON.status != undefined && data.responseJSON.status == "2"){
                //     layer.alert(data.responseJSON.msg, {icon: 2});
                // }
                // return res;
            },
            onCheck: function(row) {
                return false;
            },
            onUncheck: function(row) {
                return false;
            },
            onCheckAll: function(rows) {
                return false;
            },
            onUncheckAll: function(rows) {
                return false;
            },
            onClickRow : onClickRow,
            columns: columns,
            ajaxOptions:{
                headers: headers
            }
        });
    },

});