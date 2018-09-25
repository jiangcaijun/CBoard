/**
 * Created by yfyuan on 2016/10/11.
 */
cBoard.controller('pageAdminCtrl', function ($scope, $http, dataService, $uibModal, ModalUtils, $filter, chartService, $timeout, uuid4) {

    var translate = $filter('translate');
    $scope.optFlag = 'none';
    $scope.curDataset = {data: {expressions: [], filters: [], schema: {dimension: [], measure: []}}};
    $scope.curWidget = {};
    $scope.alerts = [];
    $scope.verify = {dsName: true};
    $scope.loadFromCache = true;
    $scope.queryAceOpt = cbAcebaseOption;
    $scope.hierarchy = translate("CONFIG.DATASET.HIERARCHY");
    $scope.uuid4 = uuid4;
    $scope.params = [];

    var treeID = 'dataSetTreeID'; // Set to a same value with treeDom
    var originalData = [];
    var updateUrl = "page/updatePageDashBoardOrMenu.do";

    var trash = {};

    $scope.toTrash = function (array, index) {
        var o = array[index];
        if (o.type == 'column') {
            if (!trash[o.column]) {
                trash[o.column] = [];
            }
            trash[o.column].push(o);
        }
        array.splice(index, 1);
    };

    $scope.dndTransfer = {
        dimension: function (list, index, item, type) {
            if (type == 'column') {
                list[index] = {type: 'column', column: item};
            }
        },
        measure: function (list, index, item, type) {
            if (type == 'column') {
                list[index] = {type: 'column', column: item};
            }
        }
    };

    $scope.getPageList = function () {
        getPageList();
    };
    /**
     * 页面管理的自定义开发
     */
    /*$http.get("page/getMenuList.do").success(function (response) {
        $scope.datasourceList = response;
    });
*/
    var getPageList = function () {
        $http.get("page/getPageList.do").success(function (response) {
            $scope.datasetList = response;
            $scope.searchNode();
        });

    };


    getPageList();

    $scope.newDs = function () {
        $scope.optFlag = 'new';
        getParentMap4Page();

        if( $scope.curPage != undefined ){
            $scope.curPage.name = '';
            $scope.curPage.dashboardMenu_MenuName = '';
            $scope.curPage.dashboardMenu_MenuCode = '';
            $scope.curPage.dashboardMenu_MenuIcon = '';
            $scope.curPage.dashboardMenu_MenuStateUrl = '';
            $scope.curPage.dashboardMenu_MenuStateTemplateUrl = '';
            $scope.curPage.dashboardMenu_MenuStateController = '';
        }


        $('#curPageButton4Edit').show();
    };

    /**
     * 加载父级菜单
     */
    function getParentMap4Page() {
        $('#menuParentId').html('');
        $.ajax({
            url: "page/getParentMap4Page.do",
            type: "GET",
            dataType: "json",
            async: false,
            success: function(response) {
                var selectValues = response;
                for (key in selectValues) {
                    var value = selectValues[key];
                    $('#menuParentId').append('<option value="' + value.parentId + '">' + value.parentName + '</option>');
                }
            }
        });

    }

    $scope.editDs = function (ds) {
        $scope.optFlag = 'edit';
        getParentMap4Page();
        $http.post("page/checkPageById.do", {id: ds.menuId}).success(function (response) {
            if (response.status == '1') {
                // doEditDs(ds);
                doEditPage(ds,response.msg);
                // $scope.doConfigParams();
            }
        });
    };

    var doEditPage = function (ds,menu) {
        menu = eval("("+menu+")");//转换为json对象
        $scope.curPage = angular.copy(ds);

        $scope.curPage.menuId = menu.menuId;

        $scope.curPage.name = menu.menuName;
        $scope.curPage.dashboardMenu_MenuName = menu.menuName;
        $scope.curPage.dashboardMenu_MenuCode = menu.menuCode;
        $scope.curPage.dashboardMenu_MenuIcon = menu.menuIcon;
        $scope.curPage.dashboardMenu_MenuStateUrl = menu.menuStateUrl;
        $scope.curPage.dashboardMenu_MenuStateTemplateUrl = menu.menuStateTemplateUrl;
        $scope.curPage.dashboardMenu_MenuStateController = menu.menuStateController;

        // 如果是初始化页面，不可编辑
        if(!menu.editFlag){
            $('#curPageButton4Edit').hide();
        }else{
            $('#curPageButton4Edit').show();
        }
        // 如果是看板目录下，parentId的值为负数
        if(menu.dashboardOrMenuFlag){
            $('#menuParentId').val((-1 * menu.parentId));
        }else{
            $('#menuParentId').val(menu.parentId);
        }
    }

    $scope.saveOrEdit = function () {
        if(!validate()){
            return;
        }
        var url = '';
        var menuId = undefined;
        if($scope.optFlag == 'new'){
            url = 'page/saveNewPage.do';
        }else if($scope.optFlag == 'edit'){
            url = 'page/updatePage.do';
            menuId = $scope.curPage.menuId;
        }else {
            return;
        }

        $http.post(url,
            {
                menuId: menuId,
                menuName: $scope.curPage.dashboardMenu_MenuName,
                menuCode: $scope.curPage.dashboardMenu_MenuCode,
                menuIcon: $scope.curPage.dashboardMenu_MenuIcon,
                menuStateUrl: $scope.curPage.dashboardMenu_MenuStateUrl,
                menuStateTemplateUrl: $scope.curPage.dashboardMenu_MenuStateTemplateUrl,
                menuStateController: $scope.curPage.dashboardMenu_MenuStateController,
                parentId: $("#menuParentId").val()
            }).success(function (serviceStatus) {
            if (serviceStatus.status == '1') {
                $scope.optFlag = 'none';
                getPageList();
                $scope.verify = {dsName:true,provider:true};
                ModalUtils.alert(translate("COMMON.SUCCESS"), "modal-success", "sm");
            } else {
                $scope.alerts = [{msg: serviceStatus.msg, type: 'danger'}];
            }
        });
    };


    var doEditDs = function (ds) {
        $scope.optFlag = 'edit';
        $scope.curDataset = angular.copy(ds);
        $scope.curDataset.name = $scope.curDataset.categoryName + '/' + $scope.curDataset.name;
        if (!$scope.curDataset.data.expressions) {
            $scope.curDataset.data.expressions = [];
        }
        if (!$scope.curDataset.data.filters) {
            $scope.curDataset.data.filters = [];
        }
        if (!$scope.curDataset.data.schema) {
            $scope.curDataset.data.schema = {dimension: [], measure: []};
        }
        $scope.datasource = _.find($scope.datasourceList, function (ds) {
            return ds.menuId == $scope.curDataset.data.datasource;
        });
        $scope.curWidget.query = $scope.curDataset.data.query;
        $scope.loadData();
    };

    $scope.checkExist = function (column) {
        var find = _.find($scope.curDataset.data.schema.measure, function (e) {
            return e.column == column;
        });
        if (!_.isUndefined(find)) {
            return true;
        }
        find = _.find($scope.curDataset.data.schema.dimension, function (e) {
            if (e.type == 'level') {
                var _find = _.find(e.columns, function (_e) {
                    return _e.column == column;
                });
                return !_.isUndefined(_find);
            } else {
                return e.column == column;
            }
        });
        return !_.isUndefined(find);
    };

    $scope.deleteDs = function (ds) {

        $http.post("page/checkPageById.do", {id: ds.menuId}).success(function (response) {
            if (response.status == '1') {
                var menu = eval("("+ response.msg +")");//转换为json对象
                if ( (menu.editFlag != undefined)&&(!menu.editFlag)) {
                    ModalUtils.alert(translate("不允许删除，因为初始化页面！"), "modal-warning", "lg");
                    return false;
                }
                ModalUtils.confirm(translate("COMMON.CONFIRM_DELETE"), "modal-warning", "lg", function () {
                    $http.post("page/deletePage.do", {id: ds.menuId}).success(function (serviceStatus) {
                        if (serviceStatus.status == '1') {
                            ModalUtils.alert(translate("COMMON.SUCCESS"), "modal-success", "sm");
                            getPageList();
                        } else {
                            ModalUtils.alert(serviceStatus.msg, "modal-warning", "lg");
                        }
                        $scope.optFlag = 'none';
                    });
                });
            }else {
                ModalUtils.alert( "该页面已不存在，建议刷新页面后重试", "modal-warning", "lg");
            }
        });
    };

    $scope.copyDs = function (ds) {
        var data = angular.copy(ds);
        data.menuName = data.menuName + "_copy";
        $http.post("page/saveNewPageByCopy.do",
            {
                id: ds.menuId,
                menuName: data.menuName
            }).success(function (serviceStatus) {
                if (serviceStatus.status == '1') {
                    $scope.optFlag = 'none';
                    getPageList();
                    ModalUtils.alert(translate("COMMON.SUCCESS"), "modal-success", "sm");
                } else {
                    ModalUtils.alert(serviceStatus.msg, "modal-warning", "lg");
                }
            }
        );
    };

    var validate = function () {
        $scope.alerts = [];
        if (!$("#menuName").val()) {
            $scope.alerts = [{msg: translate('CONFIG.DATASET.NAME') + translate('COMMON.NOT_EMPTY'), type: 'danger'}];
            $scope.verify = {dsName: false};
            $("#menuName").focus();
            return false;
        }

        /*$scope.alerts = [{msg: "[" + msg + "]" + translate('COMMON.NOT_EMPTY'), type: 'danger'}];
        for (i in $scope.curPage) {
            var name = $scope.params[i].name;
            var label = $scope.params[i].label;
            var required = $scope.params[i].required;
            var value = $scope.curWidget.query[name];
            if (required == true && value != 0 && (value == undefined || value == "")) {
                var pattern = /([\w_\s\.]+)/;
                var msg = pattern.exec(label);
                if (msg && msg.length > 0)
                    msg = translate(msg[0]);
                else
                    msg = label;
                $scope.alerts = [{msg: "[" + msg + "]" + translate('COMMON.NOT_EMPTY'), type: 'danger'}];
                $scope.verify[name] = false;
                return false;
            }
        }*/
        return true;
    };


    $scope.editFilterGroup = function (col) {
        var selects = schemaToSelect($scope.curDataset.data.schema);
        $uibModal.open({
            templateUrl: 'org/cboard/view/config/modal/filterGroup.html',
            windowTemplateUrl: 'org/cboard/view/util/modal/window.html',
            backdrop: false,
            scope: $scope,
            controller: function ($scope, $uibModalInstance) {
                if (col) {
                    $scope.data = angular.copy(col);
                } else {
                    $scope.data = {group: '', filters: [], id: uuid4.generate()};
                }
                $scope.selects = selects;
                $scope.close = function () {
                    $uibModalInstance.close();
                };
                $scope.addColumn = function (str) {
                    $scope.data.filters.push({col: str, type: '=', values: []})
                };
                $scope.ok = function () {
                    if (col) {
                        col.group = $scope.data.group;
                        col.filters = $scope.data.filters;
                    } else {
                        if ($scope.$parent.curDataset.data.filters == null) {
                            $scope.$parent.curDataset.data.filters = [];
                        }
                        $scope.$parent.curDataset.data.filters.push($scope.data);
                    }
                    $uibModalInstance.close();
                };
                $scope.editFilter = function (filter) {
                    $uibModal.open({
                        templateUrl: 'org/cboard/view/dashboard/modal/param.html',
                        windowTemplateUrl: 'org/cboard/view/util/modal/window.html',
                        backdrop: false,
                        size: 'lg',
                        resolve: {
                            param: function () {
                                return angular.copy(filter);
                            },
                            filter: function () {
                                return false;
                            },
                            getSelects: function () {
                                return function (byFilter, column, callback) {
                                    dataService.getDimensionValues($scope.datasource.id, $scope.curWidget.query, undefined, column, undefined, function (filtered) {
                                        callback(filtered);
                                    });
                                };
                            },
                            ok: function () {
                                return function (param) {
                                    filter.type = param.type;
                                    filter.values = param.values;
                                }
                            }
                        },
                        controller: 'paramSelector'
                    });
                };
            }
        });
    };

    $scope.deleteFilterGroup = function (index) {
        ModalUtils.confirm(translate("COMMON.FILTER_GROUP") + ": [" + $scope.curDataset.data.filters[index].group + "], " +
            translate("COMMON.CONFIRM_DELETE"), "modal-warning", "lg",
            function () {
                $scope.curDataset.data.filters.splice(index, 1)
            }
        );
    };

    var schemaToSelect = function (schema) {
        if (schema.selects) {
            return angular.copy(schema.selects);
        } else {
            var selects = [];
            selects = selects.concat(schema.measure);
            _.each(schema.dimension, function (e) {
                if (e.type == 'level') {
                    _.each(e.columns, function (c) {
                        selects.push(c);
                    });
                } else {
                    selects.push(e);
                }
            });
            return angular.copy(selects);
        }
    };

    $scope.editExp = function (col) {
        var selects = schemaToSelect($scope.curDataset.data.schema);
        var aggregate = [
            {name: 'sum', value: 'sum'},
            {name: 'count', value: 'count'},
            {name: 'avg', value: 'avg'},
            {name: 'max', value: 'max'},
            {name: 'min', value: 'min'}
        ];
        var ok;
        var data = {expression: ''};
        if (!col) {
            ok = function (exp, alias) {
                $scope.curDataset.data.expressions.push({
                    type: 'exp',
                    exp: data.expression,
                    alias: data.alias,
                    id: uuid4.generate()
                });
            }
        } else {
            data.expression = col.exp;
            data.alias = col.alias;
            ok = function (data) {
                col.exp = data.expression;
                col.alias = data.alias;
            }
        }

        $uibModal.open({
            templateUrl: 'org/cboard/view/config/modal/exp.html',
            windowTemplateUrl: 'org/cboard/view/util/modal/window.html',
            backdrop: false,
            size: 'lg',
            controller: function ($scope, $uibModalInstance) {
                $scope.data = data;
                $scope.selects = selects;
                $scope.aggregate = aggregate;
                $scope.alerts = [];
                $scope.expAceOpt = expEditorOptions(selects, aggregate);

                $scope.close = function () {
                    $uibModalInstance.close();
                };
                $scope.addToken = function (str, agg) {
                    var tc = document.getElementById("expression_area");
                    var tclen = $scope.data.expression.length;
                    tc.focus();
                    var selectionIdx = 0;
                    if (typeof document.selection != "undefined") {
                        document.selection.createRange().text = str;
                        selectionIdx = str.length - 1;
                    }
                    else {
                        var a = $scope.data.expression.substr(0, tc.selectionStart);
                        var b = $scope.data.expression.substring(tc.selectionStart, tclen);
                        $scope.data.expression = a + str;
                        selectionIdx = $scope.data.expression.length - 1;
                        $scope.data.expression += b;
                    }
                    if (!agg) {
                        selectionIdx++;
                    }
                    tc.selectionStart = selectionIdx;
                    tc.selectionEnd = selectionIdx;
                };
                $scope.verify = function () {
                    $scope.alerts = [];
                    var v = verifyAggExpRegx($scope.data.expression);
                    $scope.alerts = [{
                        msg: v.isValid ? translate("COMMON.SUCCESS") : v.msg,
                        type: v.isValid ? 'success' : 'danger'
                    }];
                };
                $scope.ok = function () {
                    if (!$scope.data.alias) {
                        ModalUtils.alert(translate('CONFIG.WIDGET.ALIAS') + translate('COMMON.NOT_EMPTY'), "modal-warning", "lg");
                        return;
                    }
                    ok($scope.data);
                    $uibModalInstance.close();
                };
            }
        });
    };

    $scope.deleteExp = function (index) {
        ModalUtils.confirm(translate("CONFIG.COMMON.CUSTOM_EXPRESSION") + ": [" + $scope.curDataset.data.expressions[index].alias + "], " +
            translate("COMMON.CONFIRM_DELETE"), "modal-warning", "lg",
            function () {
                $scope.curDataset.data.expressions.splice(index, 1)
            }
        );
    };

    $scope.createNode = function (item) {
        if (trash[item.column]) {
            var _i = trash[item.column].pop();
            if (_i) {
                return _i;
            }
        }
        item.id = uuid4.generate();
        return item;
    };

    $scope.measureToDimension = function (index, o) {
        $scope.curDataset.data.schema.measure.splice(index, 1);
        $scope.curDataset.data.schema.dimension.push(o);
    };

    $scope.toDimension = function (o) {
        $scope.curDataset.data.schema.dimension.push($scope.createNode(o));
    };

    $scope.custom = function (o) {
        var selects = $scope.selects;
        var datasource = $scope.datasource;
        $uibModal.open({
            templateUrl: 'org/cboard/view/config/modal/custom.html',
            windowTemplateUrl: 'org/cboard/view/util/modal/window.html',
            backdrop: false,
            size: 'lg',
            controller: function ($scope, $uibModalInstance) {
                $scope.c = o;
                $scope.ok = function () {
                    $uibModalInstance.close();
                };
                $scope.customAceOpt = schemaCustomOpt(selects, datasource.type);
            }
        });
    };

    $scope.loadData = function () {
        cleanPreview();
        $scope.loading = true;

        dataService.getColumns({
            datasource: $scope.datasource.id,
            query: $scope.curWidget.query,
            datasetId: null,
            reload: !$scope.loadFromCache,
            callback: function (dps) {
                $scope.loading = false;
                $scope.toChartDisabled = false;
                if (dps.msg == "1") {
                    $scope.alerts = [];
                    $scope.selects = dps.columns;
                } else {
                    $scope.alerts = [{msg: dps.msg, type: 'danger'}];
                }

                var widget = {
                    chart_type: "table",
                    filters: [],
                    groups: [],
                    keys: [],
                    selects: [],
                    values: [{
                        cols: []
                    }
                    ]
                };
                _.each($scope.selects, function (c) {
                    widget.keys.push({
                        col: c,
                        type: "eq",
                        values: []
                    });
                });
            }
        });
    };

    var cleanPreview = function () {
        $('#dataset_preview').html("");
    };

    /**  js tree related start **/

    //将可拖动功能注释掉
    // $scope.treeConfig = jsTreeConfig1;

    $("#" + treeID).keyup(function (e) {
        if (e.keyCode == 46) {
            $scope.deleteNode();
        }
    });

    var getSelectedDataSet = function () {
        var selectedNode = jstree_GetSelectedNodes(treeID)[0];
        return _.find($scope.datasetList, function (ds) {
            return ds.menuId == selectedNode.id;
        });
    };

    var checkTreeNode = function (actionType) {
        return jstree_CheckTreeNode(actionType, treeID, ModalUtils.alert);
    };

    var switchNode = function (id) {
        $scope.ignoreChanges = false;
        var dataSetTree = jstree_GetWholeTree(treeID);
        dataSetTree.deselect_all();
        dataSetTree.select_node(id);
    };

    $scope.applyModelChanges = function () {
        return !$scope.ignoreChanges;
    };

    $scope.copyNode = function () {
        if (!checkTreeNode("copy")) return;
        $scope.copyDs(getSelectedDataSet());
    };

    $scope.editNode = function () {
        if (!checkTreeNode("edit")) return;
        $scope.editDs(getSelectedDataSet());
    };

    $scope.deleteNode = function () {
        if (!checkTreeNode("delete")) return;
        $scope.deleteDs(getSelectedDataSet());
    };
    $scope.searchNode = function () {
        var para = {dsName: '', dsrName: ''};
        //map datasetList to list (add datasourceName)
        var list = $scope.datasetList.map(function (ds) {
            var dsr = _.find($scope.datasourceList, function (obj) {
                return obj.id == ds.data.datasource
            });
            return {
                "id": ds.menuId,
                "name": ds.menuName,
                "categoryName": ds.categoryName,
                "datasourceName": dsr ? dsr.name : '',
                "editFlag": false
            };
        });
        //split search keywords
        if ($scope.keywords) {
            if ($scope.keywords.indexOf(' ') == -1 && $scope.keywords.indexOf(':') == -1) {
                para.dsName = $scope.keywords;
            } else {
                var keys = $scope.keywords.split(' ');
                for (var i = 0; i < keys.length; i++) {
                    var w = keys[i].trim();
                    if (w.split(':')[0] == 'ds') {
                        para["dsName"] = w.split(':')[1];
                    }
                    if (w.split(':')[0] == 'dsr') {
                        para["dsrName"] = w.split(':')[1];
                    }
                }
            }
        }
        //filter data by keywords
        originalData = jstree_CvtVPath2TreeData(
            $filter('filter')(list, {name: para.dsName, datasourceName: para.dsrName})
        );

        jstree_ReloadTree(treeID, originalData);
    };

    $scope.treeEventsObj = function () {
        var baseEventObj = jstree_baseTreeEventsObj({
            ngScope: $scope, ngHttp: $http, ngTimeout: $timeout,ModalUtils: ModalUtils,
            treeID: treeID, listName: "datasetList", updateUrl: updateUrl
        });
        return baseEventObj;
    }();

    $scope.doConfigParams = function () {
        $http.get('dashboard/getConfigParams.do?type=' + $scope.datasource.type + '&page=dataset.html').then(function (response) {
            $scope.params = response.data;
        });
    };

    /**  js tree related end **/


    /** Ace Editor Starer... **/
    $scope.queryAceOpt = datasetEditorOptions();

});