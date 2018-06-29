/**
 * Created by Lxy on 2017/12/7.
 */
app.controller('onlineStatisticsController', ['$scope','acceptance_http','all_dic','exp_tool','$timeout','myself_alert','downloadFiles','$rootScope','$base64','$stateParams','superivse_http','$filter','echart_round',
	function($scope,acceptance_http,all_dic,exp_tool,$timeout,myself_alert,downloadFiles,$rootScope,$base64,$stateParams,superivse_http,$filter,echart_round){
	//时分日历
   	$(".form_datetime").datetimepicker({
    	language:'zh-CN',
        weekStart: 1,
        todayBtn:  0,
		autoclose: 1,
		todayHighlight: 1,
		forceParse: 0,
		minView:2,
		format:'yyyy/mm/dd',
		endDate: new Date()
   	});
  	//当前时间
  	var today = new Date();
  	$scope.current_time = new Date();
  	function init_date(){
  		var temp = new Date(angular.copy($scope.current_time));
  		if($filter('date')(today,'yyyy/MM/dd') == $filter('date')($scope.current_time,'yyyy/MM/dd')){
  			$scope.next_time = $filter('date')(temp,'yyyy/MM/dd');
  			$scope.current_time = $filter('date')(temp.setDate(temp.getDate() - 14),'yyyy/MM/dd');	
  		}else{
  			$scope.current_time = $filter('date')(temp,'yyyy/MM/dd');
  			$scope.next_time = $filter('date')(temp.setDate(temp.getDate() + 14),'yyyy/MM/dd');	
  		}
  	};
	//区域
  	acceptance_http.get_unit_info_areas({customerId:$base64.decode($stateParams.unit)},function(result){
  		$scope.net_areas = result;
  		$scope.region_id = $scope.net_areas[0].id;
  		$scope.get_online_data();
  	})
	var values = [];//离线
	var values2 = [];//在线
	var legends = [];
  	//各区域每天
	$scope.get_online_data = function(){
		values_line = [];
		values2_line = [];
		legends = [];
		$scope.unit_list = [];
		init_date();
		superivse_http.get_online_line({'regionId':$scope.region_id,'beginTime':new Date($scope.current_time).getTime(),'endTime':new Date($scope.next_time).getTime()},function(result){
			for(var i = 0;i<result.length;i++){
				values_line.push(result[i].newOutlineCount);
				values2_line.push(result[i].newOnlineCount);
				legends.push($filter('date')(result[i].dayTime,'yyyy-MM-dd'));
			}
			if($rootScope.router_state == 'onlineStatistics'){ //防止点击过快报错
				init_line();
				chart_line = echarts.init(document.getElementById('area_line'));
				chart_line.clear();
	    		chart_line.setOption(options_line);
	    		chart_line.off("click");
	    		chart_line.on("click", function (param){
	    			$scope.day_time = new Date($filter('date')(param.name,"yyyy-MM-dd 00:00:00")).getTime();
					$scope.status = param.seriesIndex==1?0:1; //0在线 1离线
					$scope.get_search();
				});
			}
		});
	};
	//折线图
    var options_line =  angular.copy(echart_round);
    options_line.title.text="在线数量统计";
	options_line.legend={
    	data:['离线','在线'],
    	x:'right',
    	padding:[23,500,0,0]
    }
	options_line.color=['#6B6FD3','#F575A0'];
	options_line.xAxis={
        type: 'category',
        data: [], //键
        axisTick: {
            alignWithLabel: true
        }
    };
	options_line.yAxis={
        type: 'value',
   	};
   	options_line.series = [{
		name:'离线',
        type: 'line',
        smooth:true,
        symbol:'rectangle',
        label: {
            normal: {
                show: true,
                position: 'inside'
            }
        }
   	},{
   		name:'在线',
        type: 'line',
        smooth:true,
        symbol:'rectangle',
        label: {
            normal: {
                show: true,
                position: 'inside'
            }
        }
   	}];
	function init_line(){
		options_line.series[0].data = values_line;
		options_line.series[1].data = values2_line;
		options_line.xAxis.data = legends;
	};
	$(window).resize(function(){
    	$timeout(chart_line.resize, 100);	
   	});
	//信息统计列表
	var limits = true;
	var page_num = 0;
	var page_size = 20;
	var total_page = 0;
	var get_data;
	$scope.unit_online = [];
	$scope.get_list=function(){
		page_num = page_num+1;
		if($rootScope.system_name == '消防监管单位管理系统'){
	   		get_data = acceptance_http.get_region_detail_auth;
	   	}else{
	   		get_data = acceptance_http.get_region_detail;
	   	}
   		if(typeof(get_data) == "function"){
			get_data({dayTime:$scope.day_time,stauts:$scope.status,regionId:$scope.region_id,pageNum:page_num,pageSize:page_size},function(result){
				$scope.unit_online = $scope.unit_online.concat(result.results);
				limits = true;
				total_page = result.totalPage;
			})
		}
	};
	//下拉加载
	function scrollDate(){
		$(".list_data_scroll").mCustomScrollbar({
			theme:"minimal-dark",
			autoHideScrollbar:true,
			callbacks:{
		        onTotalScroll:function(){
			        if(limits&&(page_num<total_page)){
			        	limits = false;
				        $scope.get_list();
			    	}
		        },
		        onTotalScrollOffset: 2
		   }
		});
	};
	$timeout(scrollDate, 10);
	$scope.get_search=function(type){
		page_num = 0;
		$scope.unit_online = [];
		$scope.get_list();
	};
}]);