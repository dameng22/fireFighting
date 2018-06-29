/**
 * Created by Lxy on 2017/12/10.
 */
app.controller('rankingStatisticsController', ['$scope','$timeout','echart_round','superivse_http','$filter','$rootScope','downloadFiles',
	function($scope,$timeout,echart_round,superivse_http,$filter,$rootScope,downloadFiles){
	var values = [];
	if ($rootScope.system_name == '消防监管单位管理系统'){
        //火灾前十
		superivse_http.get_fire_top_ten_systemRole({}, function (result) {
            $scope.fire_top = result;
            $scope.init_lines(result,0);
        });
        //故障前十
        superivse_http.get_trouble_top_ten_systemRole({},function(result){
            $scope.trouble_top = result;
        });
        //脱岗比率前十
        superivse_http.get_out_rate_percent_systemRole({},function(result){
            $scope.rate_out_top = result;
        });
        //在岗比率前十
        superivse_http.get_on_rate_percent_systemRole({},function(result){
            $scope.rate_in_top = result;
        });
	}else {
        //火灾前十
        superivse_http.get_fire_top_ten({},function(result){
            $scope.fire_top = result;
            $scope.init_lines(result,0);
        });
        //故障前十
        superivse_http.get_trouble_top_ten({},function(result){
            $scope.trouble_top = result;
        });
        //脱岗比率前十
        superivse_http.get_out_rate_percent({},function(result){
            $scope.rate_out_top = result;
        });
        //在岗比率前十
        superivse_http.get_on_rate_percent({},function(result){
            $scope.rate_in_top = result;
        });
	}
	//折线图
	$scope.init_lines = function(result,index){
		values = [];
		if(index == 0|| index == 1){
			for(var i=0;i<result.length;i++){
				values.push(result[i].countSum)
			}
			options.series[0].label.normal.formatter = '{c}';
		}else if(index == 2|| index == 3){
			for(var i=0;i<result.length;i++){
				values.push(result[i].newValues);
			}
			options.series[0].label.normal.formatter = '{c}%';
		}
		$scope.selected = index;
		if(index == 0){
			options.title.text="本月火灾报警数量统计";
		}else if(index == 1){
			options.title.text="本月故障信息数排名";
		}else if(index == 2){
			options.title.text="本月查岗在岗率排名";
		}else if(index == 3){
			options.title.text="本月查岗脱岗率排名";
		}
		if($rootScope.router_state == 'rankingStatistics'){ //防止点击过快报错
			init_set();
			chart = echarts.init(document.getElementById('ranking_bar'));
	    	chart.setOption(options);
		}
	};
	//样式显示
	$scope.top_ranking = function(val){
		if(val == 1){
			return 'ranking_first';
		}else if(val == 2){
			return 'ranking_second';
		}else if(val == 3){
			return 'ranking_third';
		}
	};
	var categorys=[
		'第一名', 
		'第二名', 
		'第三名', 
		'第四名', 
		'第五名', 
		'第六名', 
		'第七名', 
		'第八名', 
		'第九名',
		'第十名'
	];
	var options =  angular.copy(echart_round);
	//柱状图
	options.title.text="本月火灾报警数量统计";
	options.color=['#4786FF']
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
		name:'火警',
        type: 'bar',
        barWidth: '40%',
        label: {
            normal: {
                show: true,
                position: 'inside'
            }
        }
   	}];
    function init_set(){
    	options.series[0].data = values;
    }
    $(window).resize(function(){
    	$timeout(chart.resize, 100);
    })
	//点击单位
	$scope.unit_click = function(l,type,check){
		$scope.unit = l;
		$scope.unit_id = l.siteId;
		$scope.type_id = type;
		$scope.check_type = check;
		$scope.get_search();
		$scope.detail_show = true;
	}
	//单位列表
	var limits = true;
	var page_num = 0;
	var page_size = 20;
	var total_page = 0;
	var get_data,param;
	$scope.unit_list = [];
	$scope.get_list=function(){
		page_num = page_num+1;
		if($scope.check_type == 1 || $scope.check_type == 2){
	   		get_data = superivse_http.get_alert_unit;
	   		param = {'customerSiteId':$scope.unit_id,'alertType':$scope.type_id,'pageNum':page_num,'pageSize':page_size};
	   	}else{
	   		get_data = superivse_http.get_rate_alert_unit;
	   		param = {'customerSiteId':$scope.unit_id,'checkType':$scope.type_id,'pageNum':page_num,'pageSize':page_size};
	   	}
   		if(typeof(get_data) == "function"){
			get_data(param,function(result){
				$scope.unit_list = $scope.unit_list.concat(result.results);
				limits = true;
				total_page = result.totalPage;
				$scope.all_count = result.count;
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
	$scope.get_search=function(){
		page_num = 0;
		$scope.unit_list = [];
		$scope.get_list();
	};
	$scope.type_name=function(){
		if($scope.check_type==1){
			return '火警';
		}else if($scope.check_type==2){
			return '故障';
		}else if($scope.check_type==3){
			return '在岗';
		}else if($scope.check_type==4){
			return '脱岗';
		};
	};
	//警情状态  terminalStatusId：0自动火警  1确认火警  2紧急火警 
  	$scope.danger_status = function(id){
  		if(id == 0){
  			return '自动火警';
  		}else if(id == 1){
  			return '确认火警';
  		}else if(id == 2){
  			return '紧急火警 ';
  		}
  	};
  	$scope.status_format = function(process,end){
		switch(process){
			case 0:
				return '未处理';
			case 1:
				return '待确认';
			case -1:
				return '单位确认';
			case 2:
				if($scope.check_type==1){
					switch(end){
						case 0:
							return '未知火警';
						case 1:
							return '误报火警';
						case 2:
							return '真实火警';
						case 3:
							return '测试火警';
					}
				}else if($scope.check_type==2){
					return '已处理';
				}
		}
    };
    var urls,params,filenames;
    $scope.download_file = function(){
		if($scope.check_type==1 || $scope.check_type==2){
			urls = "countAlertAndFire/countThisMonthActualFire/alert/exportAlertByCustomerSiteId";//火警故障
			params = {customerSiteId:$scope.unit_id,alertType:$scope.type_id};
			if($scope.check_type==1){
				filenames = "火警报警数量";
			}else{
				filenames = "故障报警数量";
			}
		}else if($scope.check_type==3 || $scope.check_type==4){
			urls = "countAlertAndFire/countThisMonthActualFire/onGuardRateAlert/exportOnGuardRateAlertByCustomerSiteId";//在岗脱岗
			params = {customerSiteId:$scope.unit_id,checkType:$scope.type_id};
			if($scope.check_type==3){
				filenames = "在岗数量";
			}else{
				filenames = "脱岗数量";
			}
		}
        downloadFiles.download(urls,params,'',"GET",filenames);
   	};
}]);