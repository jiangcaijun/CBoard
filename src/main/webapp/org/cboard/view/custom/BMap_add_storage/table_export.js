function tableToExcel() {
    // console.log(111)
    var city_name = $('#city_name').val();
    var dsCode = '9bda36a8-75f5-11e8-ac6b-105ea72ce702';
    var data_poi = [];
// alert('已导出，请稍等');
//要导出的json数据
    var jsonData=[];
    jsonData = JSON.parse(JSON.stringify(map_data));
    $.post('ext/getDataset.do',{
        dsCode,
        params:"{city_name:'"+ city_name +"'}"
    },function (datas) {
        var data_masg = JSON.parse(datas.msg);
        data_poi = data_masg
        // console.log(data_poi,jsonData)
        jsonData.forEach(ele => {
            for(var i=0;i<data_poi.length;i++){
                if(ele.hexagon_area_id == (data_poi[i].block_id).substring(0,data_poi[i].block_id.length-4)){
                    ele.address_1 = data_poi[i].address_1 ? data_poi[i].address_1 : '';
                    ele.address_2 = data_poi[i].address_2 ? data_poi[i].address_2 : '';
                    ele.address_3 = data_poi[i].address_3 ? data_poi[i].address_3 : '';
                    // console.log(ele.address_1)
                }
            }
        })
    })
    console.log(jsonData)
    $(function () {
        $('#table_').bootstrapTable('destroy');
        $('#table_').bootstrapTable({
            data: jsonData
        });
    });
// window.actionEvents = {
//     'click .glyphicon-save': function (e, value, row, index) {
//         alert(JSON.stringify(row));
//         return false;
//     }
// };
}
function exportData(){
    $('#table_').tableExport({type:'excel',fileName:"闪送实时地图数据", excelstyles:['border-bottom', 'border-top', 'border-left', 'border-right']});
}