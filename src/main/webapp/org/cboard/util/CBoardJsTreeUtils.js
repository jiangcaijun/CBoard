/**
 * Created by zyong on 2016/12/27.
 */

/**
 *
 * Configuration for DataSet/Widget/Dashboard tree
 */
var jsTreeConfig1 = {
    core : {
        multiple : false,
        animation: true,
        error : function(error) {
            //$log.error('treeCtrl: error from js tree - ' + angular.toJson(error));
        },
        check_callback : function(operation, node, node_parent, node_position, more) {
            if (operation === "move_node") {
                return node_parent.id.substring(0, 6) == 'parent' || node_parent.id.substring(0, 4) == 'root';
                /*if((node.original.editFlag != undefined) && (!node.original.editFlag)) {
                    return false;
                }else {
                    //only allow dropping inside nodes of type 'Parent'
                    return node_parent.id.substring(0, 6) == 'parent' || node_parent.id.substring(0, 4) == 'root';
                }*/
            }
            return true;  //allow all other operations
        },
        worker : true
    },
    types : {
        default : {
            valid_children : ["default","file"]
        },
        file : {
            icon : 'glyphicon glyphicon-file'
        }
    },
    dnd : {
        check_while_dragging: true
    },
    state: {"key": "cboard"},
    version: 1,
    plugins: ['types', 'unique', 'state', 'sort', 'dnd']
};

/**
 * Holds all jstree related functions and variables, including the actual class and methods to create, access and manipulate instances.
 * @param domID
 */
function jstree_GetWholeTree(domID) {
    return $("#" + domID).jstree(true);
}
/**
 * get an array of all selected nodes
 * @returns {jQuery}
 */
function jstree_GetSelectedNodes(domID) {
    return jstree_GetWholeTree(domID).get_selected(true);
}
/**
 *
 * @param listIn [{
 *      "id": id,
 *      "name": name,
 *      "categoryName": folder[/subfolder]*
 *      }]
 * @returns {Array}
 */
function jstree_CvtVPath2TreeData (listIn) {
    var newParentId = 1;
    var listOut = [];
    listOut.push({"id": "root", "parent": "#", "text": "Root", state: {opened: true}});
    for (var i = 0; i < listIn.length; i++) {
        if(listIn[i].categoryName == undefined){
            continue;
        }
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
                if (j == arr.length - 1) {
                    listOut.push({
                        "id": listIn[i].id.toString(),
                        "editFlag": (listIn[i].editFlag == undefined || listIn[i].editFlag == true)? true : false,
                        "parent": parent,
                        "text": a,
                        icon: 'glyphicon glyphicon-file'
                    });
                } else {
                    listOut.push({
                        "id": 'parent' + newParentId,
                        "parent": parent,
                        "text": a
                    });
                }
                parent = 'parent' + newParentId;
                newParentId++;
            } else {
                parent = listOut[m].id;
            }
        }
    }
    return listOut;
}

/***
 *  看板分类转为jstree
 *  create on 2018/04/19
 * @param listIn
 * @returns {Array}
 */
function jstree_CateGory2TreeData(listIn) {
    var topParentId = -1;
    var listOut = [];
    listOut.push({"id": topParentId, "parent": "#", "text": "看板", state: {opened: true}});
    for (var i = 0; i < listIn.length; i++) {
        var json = listIn[i];
        listOut.push({
            "id": json.id,
            "parent": json.parentId,
            "text": json.categoryName
        });
    }
    return listOut;
}

function jstree_CheckTreeNode(actionType, treeID, popup) {
    var selectedNodes = jstree_GetSelectedNodes(treeID);
    if (selectedNodes === undefined ) {
        return false;
    } else if (selectedNodes.length == 0) {
        // popup("Please, select one widget first!", "modal-warning", "lg");
        popup("请先选择某一条数据!", "modal-warning", "lg");
        return false;
    } else if (typeof(selectedNodes[0].children) != "undefined" && selectedNodes[0].children.length > 0) {
        popup("Can't " + actionType + " a folder!", "modal-warning", "lg");
        return false;
    } else {
        return true;
    }
}

/**
 * 获取jstree 被选中的数据
 * @param actionType
 * @param treeID
 * @param popup
 * @returns {boolean}
 */
function jstree_CheckTreeNode_other(actionType, treeID, popup) {
    var selectedNodes = jstree_GetSelectedNodes(treeID)[0];
    if (selectedNodes === undefined || selectedNodes.length == 0) {
        // popup("Please, select one widget first!", "modal-warning", "lg");
        popup("请先选择某一条数据!", "modal-warning", "lg");
        return false;
    }else if (selectedNodes.parent == '#') {
        // popup("Please, select one widget first!", "modal-warning", "lg");
        popup("不可勾选顶级，请重新选择某一条数据!", "modal-warning", "lg");
        return false;
    } else {
        return true;
    }
}


function jstree_ReloadTree (treeID, treeData, ngScope) {
    jstree_GetWholeTree(treeID).settings.core.data = treeData;
    jstree_GetWholeTree(treeID).refresh();
}

/**
 * 生成jstree 树，同时可选中父级
 * create by caijun.jiang on date 2018-05-04
 * @param treeID
 * @param treeData
 */
function jstree_ReloadTree_other (treeID, treeData) {
    var tree = $('#' + treeID);
    //这个是关键，如果不清空实例，jstree不会重新生成
    tree.data('jstree', false);
    tree.jstree({
        'core' : {
            'multiple' : false,
            'data' : treeData
        }
    });
    jstree_GetWholeTree(treeID).refresh();
}


/**
 *
 * @param paramObj {
 *      "actionType": tag,
 *      "treeID": treeID,
 *      "copyFunc": function,
 *      "node": selectedNode:
 * }
 * @returns {Function}
 */
var jstree_CopyNode = function(paramObj) {
    return function () {
        if (!jstree_CheckTreeNode(paramObj.actionType, paramObj.treeID)) {
            return;
        }
        paramObj.copyFunction(paramObj.oldNode);
    };
};

/**
 * {
 *   treeID: xx,
 *   ngScope: $scope,
 *   ngHttp: $http,
 *   ngTimeout $timeout,
 *   listName: "widgetList",
 *   updateUrl: xxx
 * }
 * @param option
 * @returns {{ready: ready, activate_node: activate_node, dblclick: dblclick, move_node: move_node}}
 */
function jstree_baseTreeEventsObj(option) {
        return  {
            ready: function() {
                option.ngTimeout(function() {
                    option.ngScope.ignoreChanges = false;
                });
            },
            activate_node: function(obj, e) {
                var myJsTree = jstree_GetWholeTree(option.treeID);
                var data = myJsTree.get_selected(true)[0];
                if (data.children.length > 0) {
                    myJsTree.deselect_node(data);
                    myJsTree.toggle_node(data);
                }
            },
            dblclick: function () {
                var selectedNodes = jstree_GetSelectedNodes(option.treeID);
                if (selectedNodes.length == 0) return; // Ignore double click folder action
                option.ngScope.editNode();
            },
            move_node: function (e, data) {

            var updateItem = function (nodeid, newCategory) {
                var item = _.find(option.ngScope[option.listName], function (i) { return i.id == nodeid; });
                item.categoryName = newCategory;
                option.ngHttp.post(option.updateUrl, {json: angular.toJson(item)}).success(function (serviceStatus) {
                    if (serviceStatus.status == '1') {
                        //console.log('success!');
                    } else {
                        option.ModalUtils.alert(serviceStatus.msg, "modal-warning", "lg");
                        try {
                            option.ngScope.getPageList();
                        }catch (err){
                            console.error('option.ngScope.getPageList() 未被定义');
                        }
                    }
                });
            };

                var updateNode = function (node, tarPath) {
                    var children = node.children;
                    if (children.length == 0) {
                        updateItem(node.id, tarPath);
                    } else {
                        var newTarPath = tarPath == "" ? node.text : tarPath + "/" + node.text;
                        for (var i = 0; i < children.length; i++) {
                            var child = myJsTree.get_node(children[i]);
                            updateNode(child, newTarPath);
                        }
                    }
                };

                var myJsTree = jstree_GetWholeTree(option.treeID),
                    curNode = data.node,
                    tarNodeID = data.parent;
                var tarPath = myJsTree.get_path(tarNodeID, "/").substring(5);
                updateNode(curNode, tarPath);
            }
        };
}