/**
 * Created by Lxy on 2017/12/10.
 */
app.controller('unitCountController', ['$scope','$timeout','echart_round','foreground_http','$filter','$rootScope','all_dic','exp_tool','downloadFiles',
function($scope,$timeout,echart_round,foreground_http,$filter,$rootScope,all_dic,exp_tool,downloadFiles){
	$scope.month_to_number = all_dic.month_to_number;
	//本日本月本年数量统计
	foreground_http.get_unit_period_count({"customerSiteId":localStorage.unit_id},function(result){
		for(var k in result){
			if(result[k]==0){
				result[k] = '0000000';
			}else if(result[k]<10){
				result[k] = '000000' + result[k];
			}else if(result[k]<100){
				result[k] = '00000' + result[k];
			}else if(result[k]<1000){
				result[k] = '0000' + result[k];
			}else if(result[k]<10000){
				result[k] = '000' + result[k];
			}else if(result[k]<100000){
				result[k] = '00' + result[k];
			}else if(result[k]<1000000){
				result[k] = '0' + result[k];
			}else if(result[k]<10000000){
				result[k] = '' + result[k];
			}
			if(typeof(result[k])=='string'){
				result[k] = result[k].split("");
			}
			//本日报警数5位   本月报警数6位   本年报警数7位
			if(k == "todayActualFire" || k == "todayFalseFire" || k == "todayAlert"){
				result[k].splice(0,2);
			}else if(k == "monthActualFire" || k == "monthFalseFire" || k == "monthAlert"){
				result[k].splice(0,1);
			}
		}
		$scope.count_number = result;
	});
 	//按年份筛选 
 	$scope.current_year = $filter('date')(new Date(), 'yyyy');
	$scope.get_year_data = function(){
		values_line = []; //火警
		values2_line = []; //误报
		values3_line = []; //故障
		foreground_http.get_unit_month_count({"customerSiteId":localStorage.unit_id,yearTime:$scope.current_year},function(result){
			for(var j=0;j<result.length;j++){
				values_line.push(result[j].monthActualFire);
				values2_line.push(result[j].monthFalseFire);
				values3_line.push(result[j].monthAlert);
			}
			if($rootScope.router_state == 'unitCount'){ //防止点击过快报错
				init_set();//配置初始化
				chart_line = echarts.init(document.getElementById('alarm_line'));				
				chart_line.clear();
				chart_line.setOption(options_line);
	    		chart_line.off("click");
	    		chart_line.on("click", function (param){
					//console.log(param.seriesIndex)	//当前线
					$scope.show_type = param.seriesIndex;
					if(param.seriesIndex == 0){ //火警
						$scope.type_id = 0;
						$scope.end_id = 2
					}else if(param.seriesIndex == 1){//误报
						$scope.type_id = 0;
						$scope.end_id = 1
					}else if(param.seriesIndex == 2){//故障
						$scope.type_id = 1;
						$scope.end_id = null
					}
					$scope.current_month = $filter('dic_filter')(param.name,$scope.month_to_number);
					$scope.get_search();
					$scope.detail_show_user = true;
					$scope.$apply();
				});
			}				
		});
	};
	$scope.show_types = function(){
		if($scope.show_type == 0){
			//return '火警';
			return '报警总数';
		}else if($scope.show_type == 1){
			return '误报';
		}else if($scope.show_type == 2){
			return '故障';
		}
	};
	
	//单位列表
	var limits = true;
	var page_num = 0;
	var page_size = 20;
	var total_page = 0;
	var param;
	$scope.unit_list = [];
	$scope.get_list=function(){
		page_num = page_num+1;
	   	param = {customerSiteId:localStorage.unit_id,pageNum:page_num,pageSize:page_size,endStateId:$scope.end_id};
		foreground_http.get_unit_fire_record(param,function(result){
			$scope.unit_list = $scope.unit_list.concat(result.results);
			limits = true;
			total_page = result.totalPage;
			$scope.all_count = result.count;
		})
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
		        onTotalScrollOffset: 20
		   }
		});
	};
	$timeout(scrollDate, 10);
	$scope.get_search=function(){
		page_num = 0;
		$scope.unit_list = [];
		$scope.get_list();
	};
	
	$scope.get_year_data();
	//年份下拉初始化
	$scope.year = [];
	if(parseInt($scope.current_year)>=2017&&parseInt($scope.current_year)<2027){
		var during = parseInt($scope.current_year) - 2017;
		for(var k = 0;k<=during;k++){
			$scope.year.push(parseInt($scope.current_year)-k)
		}
	}else{
		for(var k = 0;k<=10;k++){
			$scope.year.push(parseInt($scope.current_year)-k)
		}
	};
	//初始化
	var month=[
		'一月', 
		'二月', 
		'三月', 
		'四月', 
		'五月', 
		'六月', 
		'七月', 
		'八月', 
		'九月',
		'十月',
		'十一月',
		'十二月'
	];
    //折线图
    var options_line =  angular.copy(echart_round);
    options_line.title.text="火警／误报／故障 报警数量对比走势图";
	options_line.legend={
    	data:['火警','误报','故障'],
    	x:'center',
    	padding:20
   }
	options_line.color=['#F6565B','#4687FE','#EDA47E']
	options_line.xAxis={
        type: 'category',
        data: month, //键
        axisTick: {
            alignWithLabel: true
        }
    };
	options_line.yAxis={
        type: 'value',
        
   	};
   	options_line.series = [{
		name:'火警',
        type: 'line',
        smooth:true,
        symbol:'rectangle',
        label: {
            normal: {
                show: true,
                position: 'inside',
                textStyle: {color:'#FA757A'}
            }
        }
   	},{
   		name:'误报',
        type: 'line',
        smooth:true,
        symbol:'rectangle',
        label: {
            normal: {
                show: true,
                position: 'inside',
                textStyle:{color:'#4A88FB'},
            }
        }
   	},{
   		name:'故障',
        type: 'line',
        smooth:true,
        symbol:'rectangle',
        label: {
            normal: {
                show: true,
                position: 'inside',
                textStyle:{color:'#ECA380'},
            }
        }
   	}];
   	function init_set(){
    	options_line.series[0].data = values_line;
		options_line.series[1].data = values2_line;
		options_line.series[2].data = values3_line;
    };
    $(window).resize(function(){
    	$timeout(chart_line.resize, 100);	
    });
    //颜色标识
    $scope.colorful = function(item,index,data,type){
    	var length = 0;
    	for(var i=0;i<=data.length;i++){  //全为0
    		if(data[i] == 0){
    			length = length + 1;
    		}
    	}
    	if(length == data.length){
    		if(index == data.length-1){
    			return colors(type);
    		}
    		return;
    	}
    	var status = false;
    	for(var i=0;i<=index;i++){
    		if(data[i]>0){
    			status = true;
    			break
    		}
    	}
    	if(status){ //前面数字不为0
    		return colors(type);
    	}else{ //前面数字为0
    		if(item>0){
    			return colors(type);
    		}
    	}
    };
    function colors(type){
    	if(type == 0){
			return 'alarm_statis_red'
		}else if(type == 1){
			return 'alarm_statis_blue'
		}else if(type == 2){
			return 'alarm_statis_orange'
		}
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
				if($scope.show_type==0 || $scope.show_type == 1){
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
				}else if($scope.show_type==2){
					return '已处理';
				}
		}
    };
    //导出文件
	$scope.download_file = function(){
		var urls,params,filenames;
		urls = "record/exportNetworkingFireExcels";
		params = {customerSiteId:localStorage.unit_id,endStateId:$scope.end_id};
		filenames = "火灾报警记录";
		if($scope.type_id == 1){
			urls = "record/exportNetworkingMalfunctionExcels";
			params = {customerSiteId:localStorage.unit_id};
			filenames = "故障信息记录";
		}
		downloadFiles.download(urls,params,'',"GET",filenames);
	}
}]);