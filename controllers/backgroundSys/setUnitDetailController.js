/**
 * Created by Lxy on 2017/12/12.
 */
app.controller('setUnitDetailController', ['$scope','acceptance_http','myself_alert','$state','$stateParams','router_state', function($scope,acceptance_http,myself_alert,$state,$stateParams,router_state){
	$scope.tab_list=[	
		{links:'setUnitDetail.baseInfo', name:'基本信息'},
		{links:'setUnitDetail.transDevice', name:'传输装置信息'},
		{links:'setUnitDetail.buildingInfo', name:'建筑物信息'},
		{links:'setUnitDetail.fireCtrl', name:'火灾自动报警控制器信息'},
		{links:'setUnitDetail.waterSystem', name:'水系统信息'},
		{links:'setUnitDetail.outdoor', name:'室外消防设施信息'},
		{links:'setUnitDetail.indoor', name:'建筑物内消防设施信息'},
		{links:'setUnitDetail.surface', name:'建筑火灾自动报警平面图'},
		{links:'setUnitDetail.plan', name:'重点部位灭火预案'},
		{links:'setUnitDetail.picture', name:'周边道路及外观'},
		{links:'setUnitDetail.map', name:'地理位置'}
	];
	//默认第一项
    $scope.show_tab=function(index){
    	if(!$stateParams.unit_id){
    		myself_alert.dialog_show("请先保存基本信息!");
    		return;
    	}
    	$state.go($scope.tab_list[index].links,{unit_id:$stateParams.unit_id,'token':$stateParams.token,'sys':$stateParams.sys,'unit':$stateParams.unit});
	};
}]);