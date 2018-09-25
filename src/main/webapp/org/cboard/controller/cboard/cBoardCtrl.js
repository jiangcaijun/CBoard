/**
 * Created by yfyuan on 2016/7/19.
 */
cBoard.controller('cBoardCtrl', function ($rootScope, $scope, $location, $http, $q, $filter, $uibModal, ModalUtils) {

    var translate = $filter('translate');

    $rootScope.alert = function (msg) {
        ModalUtils.alert(msg);
    };

    $http.get("commons/getUserDetail.do").success(function (response) {
        $scope.user = response;
        var avatarUrl = 'dist/img/user-male-circle-blue-128.png';
        $scope.user.avatar = avatarUrl;
    });

    var getMenuList = function () {
        $http.get("commons/getMenuList.do").success(function (response) {
            $scope.menuList = response;
            getBoardList();
        });
    };

    var getCategoryList = function () {
        $http.get("dashboard/getCategoryList.do").success(function (response) {
            $scope.categoryList = response;
            getMenuList();
        });
    };

    var getBoardList = function () {
        $http.get("dashboard/getBoardList.do").success(function (response) {
            $scope.boardList = response;
            appendMainSidebar();
        });
    };

    $scope.$on("boardChange", function () {
        getBoardList();
    });

    $scope.$on("categoryChange", function () {
        getCategoryList();
    });

    $scope.isShowMenu = function (code) {
        return !_.isUndefined(_.find($scope.menuList, function (menu) {
            // return menu.menuCode == code;
            return true;
        }));
    };

    //获取看板的方法
    getCategoryList();

    $scope.changePwd = function () {
        $uibModal.open({
            templateUrl: 'org/cboard/view/cboard/changePwd.html',
            windowTemplateUrl: 'org/cboard/view/util/modal/window.html',
            backdrop: false,
            size: 'sm',
            controller: function ($scope, $uibModalInstance) {
                $scope.close = function () {
                    $uibModalInstance.close();
                };
                $scope.ok = function () {
                    // if($scope.newPwd !=$scope.cfmPwd){
                    //     ModalUtils.alert('密码输入不一致，请重新输入', "modal-success", "sm");
                    //     $scope.newPwd ='';
                    //     $scope.cfmPwd ='';
                    // }else{

                    $http.post("commons/changePwd.do", {
                        curPwd: $scope.curPwd,
                        newPwd: $scope.newPwd,
                        cfmPwd: $scope.cfmPwd
                    }).success(function (serviceStatus) {
                        if (serviceStatus.status == '1') {
                            ModalUtils.alert(translate("COMMON.SUCCESS"), "modal-success", "sm");
                            $uibModalInstance.close();
                        } else {
                            ModalUtils.alert(serviceStatus.msg, "modal-warning", "lg");
                        }
                    });

                    // }



                };
            }
        });
    }
    // china_map_city = [
    //     {"city_name":"北京市","center_lng":"116.42","center_lat":"39.92","level":"12"},
    //     {"city_name":"上海市","center_lng":"121.47","center_lat":"31.23","level":"12"},
    //     {"city_name":"深圳市","center_lng":"114.05","center_lat":"22.6","level":"12"},
    //     {"city_name":"杭州市","center_lng":"120.25","center_lat":"30.28","level":"12.5"},
    //     {"city_name":"成都市","center_lng":"104.07","center_lat":"30.67","level":"12.5"},
    //     {"city_name":"天津市","center_lng":"117.2","center_lat":"39.12","level":"12.9"},
    //     {"city_name":"武汉市","center_lng":"114.3","center_lat":"30.6","level":"12.8"},
    //     {"city_name":"西安市","center_lng":"108.93","center_lat":"34.27","level":"12.5"},
    //     {"city_name":"济南市","center_lng":"116.98","center_lat":"36.67","level":"12.5"},
    //     {"city_name":"重庆市","center_lng":"106.55","center_lat":"29.57","level":"12.5"},
    //     {"city_name":"南京市","center_lng":"118.78","center_lat":"32.04","level":"13"},
    //     {"city_name":"苏州市","center_lng":"120.58","center_lat":"31.3","level":"12.5"},
    //     {"city_name":"太原市","center_lng":"112.55","center_lat":"37.85","level":"12.8"},
    //     {"city_name":"广州市","center_lng":"113.3","center_lat":"23.08","level":"12"},
    //     {"city_name":"石家庄市","center_lng":"114.52","center_lat":"38.05","level":"12.5"},
    //     {"city_name":"唐山市","center_lng":"118.2","center_lat":"39.63","level":"12.5"},
    //     {"city_name":"秦皇岛市","center_lng":"119.6","center_lat":"39.93","level":"12.5"},
    //     {"city_name":"南宁市","center_lng":"108.37","center_lat":"22.82","level":"12.5"}
    // ];
    // $.get('ext/getDataset.do?dsCode=0f5a68a2-3e22-11e8-b8e5-2f283bb1c5c7',function (data) {
    //     citys = eval('('+ data.msg +')');
    //     china_map_city = citys
    // })


    /***
     *  看板分类转为jstree
     *  create on 2018/04/19
     * @param listIn
     * @returns {Array}
     */
    function html_CateGory2TreeData(response) {

        var listIn = response.map(function (ds) {
            return {
                "id": ds.id,
                "categoryName": ds.name,
                "parentId": ds.parentId,
                "editFlag": '1'
            };
        });

        var newParentId = 1;
        var listOut = [];
        listOut.push({"id": "root", "parent": "#", "text": "看板", "original_id": -1});
        for (var i = 0; i < listIn.length; i++) {
            var arr = listIn[i].categoryName.split('/');
            arr.push(listIn[i].name);
            var parent = 'root';
            for (var j = 0; j < arr.length; j++) {
                var flag = false;
                var a = arr[j];
                for (var m = 0; m < listOut.length; m++) {
                    if (listOut[m].text == a && listOut[m].parent == parent && listOut[m].id.substring(0, 6) == 'parent') {
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    if (j != arr.length - 1) {
                        listOut.push({
                            "id": 'parent' + newParentId,
                            "parent": parent,
                            "cateName": a,
                            "original_id": listIn[i].id,
                            "original_parent_id": listIn[i].parentId,
                        });
                    }
                    parent = 'parent' + newParentId;
                    newParentId ++;
                } else {
                    parent = listOut[m].id;
                }
            }
        }
        return listOut;
    }

    $scope.cate = [
        {
            cateId: 1,
            cateName: '前端技术x',
            child: [
                {
                    cateId: 4,
                    cateName: 'JavaScript'
                },
                {
                    cateId: 5,
                    cateName: 'HTML 5 + CSS 3'
                }
            ]
        },
        {
            cateId: 2,
            cateName: '运营',
            child: [
                {
                    cateId: 3,
                    cateName: '市场',
                    child: [
                        {
                            cateId: 6,
                            cateName: 'ThinkPHP'
                        },
                        {
                            cateId: 7,
                            cateName: 'Symfony'
                        }
                    ]
                }
            ]
        }
    ];

    var json4CateAndBoard = [];
    function appendMainSidebar() {
        var jsonArray = getJsonTree($scope.categoryList,'-1');
        $scope.cate = jsonArray;
        appendJson(jsonArray);
    };

    /**
     * 拼接json
     * @param listOut
     */
    function appendJson4CateAndBoard(listOut) {
        for(var j = 0; j < listOut.length; j++) {
            var out = listOut[j];
            if(out.parent == "root"){
                var flag = true;
                for(var m = 0; m < json4CateAndBoard.length; m++) {
                    if((json4CateAndBoard[m].cateName == out.cateName)){
                        // flag = false;
                        break;
                    }
                }
                if(flag){
                    var txt = {"cateName":out.cateName,"child":[],"parent":out.parent,"id":out.id,"original_id":out.original_id,"original_parent_id": out.parentId};
                    json4CateAndBoard.push(txt);
                }
            }else{
                for(var m = 0; m < json4CateAndBoard.length; m++) {
                    // if((json4CateAndBoard[m].id == out.parent)){
                    //     var txt = {"cateName":out.cateName,"child":[],"parent":out.parent,"id":out.id,"original_id":out.original_id};
                    //     json4CateAndBoard[m].child.push(txt);
                    //     break;
                    // }
                    recursionJson4Cate(json4CateAndBoard[m],out,json4CateAndBoard);
                }
            }

        }
    }

    /**
     * 递归调用
     * @param json
     * @param out
     * @param json4CateAndBoard
     */
    function recursionJson4Cate(json, out,json4CateAndBoard) {
        if((json.id == out.parent)){
            var txt = {"cateName":out.cateName,"child":[],"parent":out.parent,"id":out.id,"original_id":out.original_id,"original_parent_id": out.parentId};
            json.child.push(txt);
        }else{
            for(var i=0; i < json.child.length; i++){
                recursionJson4Cate(json.child[i],out,json4CateAndBoard);
            }
        }
    }
    /**
     * 根据看板分类数据（父子级关系），组合成json数据（child）
     * create by 高盛森
     * @param data
     * @param parentId
     * @returns {Array}
     */
    var getJsonTree=function(data,parentId){
        var itemArr=[];
        Array.prototype.filter.call(data,(o) =>{
            if(o.parentId == parentId ){
            var newNode = {
                cateId:o.id,
                cateName:o.name,
                child:getJsonTree(data,o.id)
            };
            itemArr.push(newNode);

        }
    })
        return itemArr;
    }

    /**
     * 拼接成需要的格式，append到对应到位置下
     * @param jsonArray
     */
    function appendJson(jsonArray) {
        var html = appendHtml_menu(jsonArray);
        $('#ul_dashboard').html(html);
        // nav收缩展开一个
        $('.navMenu li a').on('click',function(){
            var parent = $(this).parent().parent();//获取当前页签的父级的父级
            var labeul =$(this).parent("li").find(">ul")
            if ($(this).parent().hasClass('open') == false) {
                //展开未展开
                parent.find('ul').slideUp(300);
                parent.find("li").removeClass("open");
                parent.find('li a').removeClass("active").find(".arrow").removeClass("open");
                $(this).parent("li").addClass("open").find(labeul).slideDown(300);
                $(this).addClass("active").find(".arrow").addClass("open");
            }else{
                $(this).parent("li").removeClass("open").find(labeul).slideUp(300);
                if($(this).parent().find("ul").length>0){
                    $(this).removeClass("active").find(".arrow").removeClass("open");
                }else{
                    $(this).addClass("active");
                }
            }
        });
    };



    function showall(child, parent){
        for ( var itemChild in child) {
            //如果有子节点，则遍历该子节点
            if (child[itemChild].child.length > 0) {
                //创建一个子节点a
                var la = $("<a></a>");
                //创建一个子节点li
                var li = $("<li></li>");
                $(la).append(child[itemChild].cateName);
                //将li的文本设置好，并马上添加一个空白的ul子节点，并且将这个li添加到父亲节点中
                $(li).append(la).append("<ul></ul>").appendTo(parent);
                //将空白的ul作为下一个递归遍历的父亲节点传入
                //递归
                showall(child[itemChild].child, $(li).children().eq(1));
            }
            //如果该节点没有子节点，则直接将该节点li以及文本创建好直接添加到父亲节点中
            else {
                var la = $("<a></a>");
                var li = $("<li></li>");
                $(la).append(child[itemChild].cateName);
                $(li).append(la).appendTo(parent);
            }
        }
    };

    /**
     * * 解析模板文件
     * @param template 模板字符串
     * @param scope 模板作用域
     * return [string] 解析过后的字符串
     */
    function templateParse(template, scope) {
        if(typeof template != "string") return ;
        return template.replace(/\{\w+\}/gi, function(matchs) {
            var returns = scope[matchs.replace(/(\{)|(\})/g, "")];
            return (returns + "") == "undefined"? "": returns;
        });
    }

    function appendHtml_menu(jsonArray,flag) {

        /**
         * 通过ajax的逻辑顺序控制，确保此时已经将 $scope.menuList,$scope.boardList 成功赋值
         */
        var boardList = $scope.boardList;
        var menuList = $scope.menuList;
        /**
         * 筛选
         */
        for(var m = 0; m < boardList.length; m++){
            var board = boardList[m];
            //若为标准看板
            if(board.id >= 0){
                board.href = '#/dashboard/{cateName}/' + board.id;
            }else {
                for(var n = 0; n < menuList.length; n++){
                    var menu = menuList[n];
                    if(menu.menuId == (-1 * board.id)){
                        var reg =/\./g;
                        board.href = '#/' + menu.menuCode.replace(reg,'/');
                        break;
                    }
                }
            }
        }
        var exists_categoryIds = '';
        for(var m = 0; m < boardList.length; m++){
            var board = boardList[m];
            exists_categoryIds += board.categoryIds;
        }

        var temp_array_exists_categoryIds = exists_categoryIds.split('/');

        //数组去重,array_exists_categoryIds为去重后的
        var array_exists_categoryIds=[];
        for(var i = 0;i < temp_array_exists_categoryIds.length; i++) {
            var items = temp_array_exists_categoryIds[i];
            //判断元素是否存在于new_arr中，如果不存在则插入到new_arr的最后
            if($.inArray(items, array_exists_categoryIds) == -1 && items != '') {
                array_exists_categoryIds.push(items);
            }
        }

        var ret = (function (c,flag) {
            if (!c || !c.length) return '';
            var result = '<ul class="sub-menu">';
            if(flag == 0){
                result = '';
            }
            for (var i = 0, j = c.length; i < j; i++) {

                if($.inArray(c[i].cateId + '', array_exists_categoryIds) == -1){
                    //递归调用
                    result += arguments.callee(c[i].child, 1);
                }else {

                    var template = '<a class="afinve"><i class="fa fa-folder"></i><span class="arrow">{cateName}</span></a>';
                    if(boardList.length > 0){
                        template += '<ul class="sub-menu">';
                    }
                    for(var m = 0; m < boardList.length; m++){
                        var board = boardList[m];
                        //判断哪些看板board在对应分类cate下
                        if(board.categoryId == c[i].cateId){
                            template += '<li><a href="';
                            template += board.href;
                            template += '"><i class="fa fa-dashboard"></i>';
                            template += board.name;
                            template += '</a></li>';
                        }
                    }
                    if(boardList.length > 0){
                        template += '</ul>';
                    }
                    result += '<li>';
                    result += templateParse(template, c[i]);
                    //递归调用
                    result += arguments.callee(c[i].child, 1);
                    result += '</li>';
                }
            }
            if(flag == 0){
                return (result);
            }
            return (result + '</ul>');
        })(jsonArray,0);
        return ret;
    }


});




