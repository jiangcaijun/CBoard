/**
 * Created by yfyuan on 2016/8/29.
 */
cBoard.controller('extDatasetCtrl', function ($scope, $http, ModalUtils, $filter) {

    var translate = $filter('translate');
    $scope.optFlag = 'none';
    $scope.extDatasetList = {};
    $scope.alerts = [];
    $scope.verify = {categoryName:true};

    var getCategoryList = function () {
        $http.get("ext/datasetList.do").success(function (response) {
            $scope.extDatasetList = response;
            getDatasourceList();
        });
    };

    var categoryChange = function () {
        $scope.verify = {categoryName:true};
        $scope.$emit("categoryChange");
    };

    var getDatasourceList = function () {
        $http.get("dashboard/getDatasourceList.do").success(function (response) {
            $scope.datasourceList = response;
            //给 dsDatasourceId （下拉框）输出 html
            var selectValues = response;
            var html = '';
            for (key in selectValues) {
                var value = selectValues[key];
                html += '<option value="' + value.id + '">' + value.name + '</option>';
            }
            $('#dsDatasourceId').html(html);
        });
    };

    getCategoryList();

    /**
     * 新增
     */
    $scope.newBordCategory = function () {
        $scope.optFlag = 'new';
        $scope.curCategory = {};
        $scope.alerts = [];
        $("#outputJson").val('');

        //隐藏 dscode
        // $("#dsCode").parent().parent().hide();
        $scope.verify = {
            dsName : true,
            dsCode : true,
            dsDesc : true,
            dsParas : true,
            dsQuery : true
        };
        //清除 请求参数
        $("#output4Post").val('');
        $("#output4Get").val('');
    };
    /**
     * 编辑
     */
    $scope.editBordCategory = function (ds) {
        $scope.optFlag = 'edit';

        //显示 dscode
        // $("#dsCode").parent().parent().show();

        $scope.curCategory = angular.copy(ds);

        //给 dsDatasourceId 赋值
        $('#dsDatasourceId').val(ds.dsDatasourceId);

        //清除 请求参数
        $("#output4Post").val('');
        $("#output4Get").val('');
    };


    /**
     * 删除
     * @param ds
     */
    $scope.deleteBordCategory = function (ds) {
        ModalUtils.confirm(translate("COMMON.CONFIRM_DELETE"), "modal-warning", "lg", function () {
            $http.post("ext/deleteDataset.do", {id: ds.id}).success(function () {
                $scope.optFlag = 'none';
                getCategoryList();
                categoryChange();
            });
        });
    };


    var validate = function () {
        $scope.alerts = [];
        if(!$scope.curCategory.dsName){
            $scope.alerts = [{msg: translate('CONFIG.CUSTOM.EXTDATASET.NAME')+translate('COMMON.NOT_EMPTY'), type: 'danger'}];
            $scope.verify = {dsName : false};
            $("#dsName").focus();
            return false;
        }
        if(!$scope.curCategory.dsCode && !$("#dsCode").is(":hidden")){
            $scope.alerts = [{msg: translate('CONFIG.CUSTOM.EXTDATASET.CODE')+translate('COMMON.NOT_EMPTY'), type: 'danger'}];
            $scope.verify = {dsCode : false};
            $("#dsCode").focus();
            return false;
        }
        if(!$scope.curCategory.dsDesc){
            $scope.alerts = [{msg: translate('CONFIG.CUSTOM.EXTDATASET.DESC')+translate('COMMON.NOT_EMPTY'), type: 'danger'}];
            $scope.verify = {dsDesc : false};
            $("#dsDesc").focus();
            return false;
        }
        /*if(!$scope.curCategory.dsParas){
            $scope.alerts = [{msg: translate('CONFIG.CUSTOM.EXTDATASET.PARAS')+translate('COMMON.NOT_EMPTY'), type: 'danger'}];
            $scope.verify.dsParas = false;
            $("#dsParas").focus();
            return false;
        }*/
        if(!$scope.curCategory.dsQuery){
            $scope.alerts = [{msg: translate('CONFIG.CUSTOM.EXTDATASET.QUERY')+translate('COMMON.NOT_EMPTY'), type: 'danger'}];
            $scope.verify = {dsQuery : false};
            $("#dsQuery").focus();
            return false;
        }
        return true;
    }

    $scope.save = function () {
        if(!validate()){
            return;
        }

        var url = '';
        var id = undefined;
        if($scope.optFlag == 'new'){
            url = 'ext/saveDataset.do';
        }else if($scope.optFlag == 'edit'){
            url = 'ext/updateDataset.do';
            id = $scope.curCategory.id;
        }else {
            return;
        }

        $http.post(url,
            {
                id: id,
                dsCode: $scope.curCategory.dsCode,
                dsName: $scope.curCategory.dsName,
                dsDesc: $scope.curCategory.dsDesc,
                dsParas: $scope.curCategory.dsParas,
                dsQuery: $scope.curCategory.dsQuery,
                dsDatasourceId: $("#dsDatasourceId").val()
            }).success(function (serviceStatus) {
            if (serviceStatus.status == '1') {
                $scope.optFlag = 'none';
                getCategoryList();
                ModalUtils.alert(translate("COMMON.SUCCESS"), "modal-success", "sm");
            } else {
                $scope.alerts = [{msg: serviceStatus.msg, type: 'danger'}];
            }
        });

    };

    /**
     * 预览
     */
    $scope.preview = function () {

        if(!$scope.curCategory.dsQuery){
            $scope.alerts = [{msg: translate('CONFIG.CUSTOM.EXTDATASET.QUERY')+translate('COMMON.NOT_EMPTY'), type: 'danger'}];
            $scope.verify.dsQuery = false;
            $("#dsQuery").focus();

            $("#outputJson").val('');
            return false;
        }
        $scope.alerts = [];

        var json = {
            datasourceId: $("#dsDatasourceId").val(),
            query: $("#dsQuery").val(),
            dsParas: $("#dsParas").val(),
        };
        var dsParas = undefined;
        if(json.dsParas == ""){
            dsParas = [];
        }else {
            dsParas = json.dsParas.split(',');
        }
        var inputParas = $("#inputParas").val().split('@#@');

        // 参数（post 请求）
        var output4PostHtml = "{";
        output4PostHtml += ("dsCode:'" + $("#dsCode").val() + "'");
        // 参数（get 请求）
        var output4GetHtml = ("?dsCode='" + $("#dsCode").val() + "'");
        var params4Json = '';
        for(var i = 0; i < dsParas.length; i++){
            if(i == 0){
                output4PostHtml += ",params:"
                params4Json += "{";
                output4GetHtml += "&params=";
            }
            params4Json += (dsParas[i] + ":'" + inputParas[i] + "'");
            if(i != dsParas.length -1){
                params4Json += ",";
            }else{
                params4Json += "}";
                output4PostHtml += params4Json;
                output4GetHtml += params4Json;
            }
        }
        output4PostHtml += "}";

        json.inputParas = params4Json;
        $http.post("ext/queryDatasetBySQL.do", json).success(function (serviceStatus) {
            if (serviceStatus.status == '1') {

                $("#output4Post").val(output4PostHtml);
                $("#output4Get").val(output4GetHtml);
                ModalUtils.alert(translate(serviceStatus.msg, "modal-success", "sm"));
            } else {
                $("#outputJson").val('');
                $scope.alerts = [{msg: serviceStatus.msg, type: 'danger'}];
            }
        });

    };
});