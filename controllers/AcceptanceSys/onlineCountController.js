/**
 * Created by Lxy on 2017/12/7.
 */
app.controller('onlineCountController', ['$scope','acceptance_http','all_dic','exp_tool','$timeout','myself_alert','downloadFiles','$rootScope','$base64','$stateParams','timeTools','$filter','echart_round',
	function($scope,acceptance_http,all_dic,exp_tool,$timeout,myself_alert,downloadFiles,$rootScope,$base64,$stateParams,timeTools,$filter,echart_round){
  	var start,end;
  	$scope.get_calender = function(){
	  	acceptance_http.get_cal_list({'time':$scope.year+'-'+$scope.month},function(result){
	  		$scope.month_days = result;
	  		if(result.length<=0){
	  			$scope.month_days = [];
	  			return;
	  		}
	  		for(var i= 0;i<result.length;i++){
	  			result[i].dates = $filter('date')(new Date($scope.year+'/'+$scope.month+'/'+(result[i].dayFormatTime>=10?result[i].dayFormatTime:'0'+result[i].dayFormatTime)),"yyyy-MM-dd 00:00:00");//0点格式化
	  			result[i].dates = new Date(result[i].dates).getTime();//转时间戳
	  		}
			start = new Date($scope.month_days[0].dates).getDay();//当月第一个数
			end = new Date($scope.month_days[$scope.month_days.length-1].dates).getDay();//当月最后一个数	
			start = start==0?start=7:start;
			end = end==0?end=7:end;
			for(var k = 0;k<start-1;k++){ //补齐日期
				$scope.month_days.unshift({'dayFormatTime':null,'dates':null,'newOnlineCount':null,'newOutlineCount':null})
			}
			for(var m = 0;m<7-end;m++){ //补齐日期
				$scope.month_days.push({'dayFormatTime':null,'dates':null,'newOnlineCount':null,'newOutlineCount':null})
			}
	 	})
  	};
	$scope.today = new Date();
	get_year_month();
	//上一月 下一月
	var switch_month;
	$scope.toggle_month = function(type){
		if(type == 'pre'){
			$scope.today.setMonth($scope.today.getMonth()-1);
		}else if(type == 'next'){
			$scope.today.setMonth($scope.today.getMonth()+1);
		}
		get_year_month();
	};
	//获取年月
  	function get_year_month(){ 
  		$scope.year = $scope.today.getFullYear();
		$scope.month = timeTools.formatMonths($scope.today);
		$scope.unformat_month = $scope.today.getMonth()+1;
		$scope.get_calender();
  	}
  	//当前时间
  	$scope.current = new Date();
  	$scope.current_year = $scope.current.getFullYear();
	$scope.current_month = $scope.current.getMonth()+1;
	//上月显示
  	$scope.pre_show = function(){
  		if((parseInt($scope.year)>=2018) && ($scope.unformat_month>4)){
  			return true;
  		}else{
  			return false;
  		}
  	};
  	//下月显示
  	$scope.next_show = function(){
  		if((parseInt($scope.year)>=parseInt($scope.current_year)) && ($scope.unformat_month>=$scope.current_month)){
  			return false;
  		}else{
  			return true;
  		}
  	};
  	//点击当天
  	$scope.show_current = function(date,stamp){
  		if(!date){
  			return;
  		}
  		$scope.day_time = stamp;
  		acceptance_http.get_day_region({'dayTime':stamp},function(result){
  			$scope.show_chart = result;
  			values = [];
  			values2 = [];
  			categorys = [];
  			for(var k = 0;k<result.length;k++){
                values.push(result[k].newOutlineCount); //离线
                values2.push(result[k].newOnlineCount); //在线
                categorys.push($filter('area_filter')(result[k].regionId,$scope.net_areas))
            }
            if($rootScope.router_state == 'onlineCount'){ //防止点击过快报错
                init_bar();
                chart = echarts.init(document.getElementById('area_bar'));
                chart.clear();
                chart.setOption(options);
                chart.off("click");
                chart.on("click", function (param){
//					console.log(options.series[param.seriesIndex].data[param.dataIndex]);
					$scope.region_names = param.name;
					$scope.region_id = $filter('region_name')(param.name,$scope.net_areas);
					$scope.status = param.seriesIndex==1?0:1; //0在线 1离线
					$scope.get_search()
				});
            }
  		});
  		$scope.unit_online = [];//清空列表
  	};
  	$scope.day_time = new Date($filter('date')($scope.today,"yyyy-MM-dd 00:00:00")).getTime();
  	$scope.show_current(1,$scope.day_time);//默认当天柱图
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
  	var chart;
  	var categorys = []; //区域数组
	var values = [];//离线
	var values2 = [];//在线
	//区域
  	acceptance_http.get_unit_info_areas({customerId:$base64.decode($stateParams.unit)},function(result){
  		$scope.net_areas = result;
  	})
  	var options =  angular.copy(echart_round);
	//柱状图
	options.title.text="各区在线数量统计";
	options.title.textStyle = {fontSize: 16,fontWeight: 'normal',color: '#1E2F4F'}
	options.title.color = '#1E2F4F',
	options.legend={
    	data:['离线','在线'],
    	x:'right',
    	padding:[23,200,0,0]
    }
	options.color=['#4786FF','#50DEB8'];
	options.xAxis={
        type: 'category',
        data: categorys, //键
        axisTick: {
            alignWithLabel: true
        }
    };
	options.yAxis={
        type: 'value'
   	};
   	options.series = [{
		name:'离线',
        type: 'bar',
        barGap:0,
        barWidth: '40%',
        label: {
            normal: {
                show: true,
                position: 'inside'
            }
        }
   	},{
   		name:'在线',
        type: 'bar',
        barGap:0,
        barWidth: '40%',
        label: {
            normal: {
                show: true,
                position: 'inside'
            }
        }
   	}];
	function init_bar(){
		options.xAxis.data = categorys;
		options.series[0].data = values;
		options.series[1].data = values2;
	};
  	$(window).resize(function(){
  		if(typeof(chart)!='undefined'){
  			$timeout(chart.resize, 100);	
  		}
    });
  	
}]);