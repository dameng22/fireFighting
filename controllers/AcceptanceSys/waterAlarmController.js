/**
 * Created by Lxy on 2017/12/28.
 */
//app.controller('waterAlarmController', ['$scope', function($scope){
//	
//}]);

app.controller('waterAlarmController', ['$scope','$timeout','echart_round','foreground_http','$filter','$rootScope', function($scope,$timeout,echart_round,foreground_http,$filter,$rootScope){
	var myChart = echarts.init(document.getElementById("water_alarm_line"));
    var option = {
        // 标题
        title: {
            text: '历史状态分析',
            left: '1%',
            top: '3%'
        },
        tooltip: {
            trigger: 'axis'
        },
        //图例名
        legend: {
            data:['报警','故障'],
            right: '26%',
            top: '5%'            
        },
        grid: {
            left: '1%',   //图表距边框的距离
            right: '1%',
            bottom: '3%',
            containLabel: true
        },
        //x轴信息样式
        xAxis: {
            type: 'category',
            boundaryGap: false,
//          data: ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17',
//          '18','19','20','21','22','23','24','25','26','27','28','29','30'],
			data: ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17',
            '18','19','20','21','22','23','24','25','26','27','28','29','30','31'],
            //坐标轴颜色
            axisLine:{
                lineStyle:{
                    color:'#000'
                }
            },
            //x轴文字旋转
            axisLabel:{
                rotate:0,
                interval:0
            },
        },

        yAxis : [
            {
                type : 'value',
                max: 10,
                min: 0,
                splitNumber: 6,
                axisLabel : {
                    formatter: '{value}'
                }
            }
        ],
        series: [
            {
                name:'报警',
                type:'line',
                symbolSize:0,   //拐点圆的大小
                color:['#4E9BFA'],  //折线条的颜色
//              data:[6, 7, 9, 10, 9.9, 9.8, 8, 7, 6, 7, 8, 9, 9.5, 20, 22,
//              		25, 28, 29, 29, 30, 30, 29, 26, 20, 20, 19.9, 19.8, 18, 20, 20],
				data:[0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                smooth:true,   //关键点，为true是不支持虚线的，实线就用true
                itemStyle:{
                    normal:{
                        lineStyle:{
                            width:3,
                            type:'solid'  //'dotted'虚线 'solid'实线
                        }
                    }
                }
            },
            //实线
            {
                name:'故障',
                type:'line',
                symbolSize:0,   //拐点圆的大小
                color:['#00BFAE'],  //折线条的颜色
//            	data:[13, 14, 15, 16, 17, 18, 19, 24, 25, 26, 27, 26, 27, 28, 25, 22,
//          		20, 18, 30, 40, 40, 40, 40, 40, 43, 46, 50, 49.8, 48.5, 50],
				data:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0],
                smooth:true,   //关键点，为true是不支持虚线的，实线就用true
                itemStyle:{
                    normal:{
                        lineStyle:{
                            width:3,
                            type:'solid'  //'dotted'虚线 'solid'实线
                        }
                    }
                }
            },
        ]
    };

    myChart.setOption(option);
    
    $scope.detail_wa_click = function(){
    		$scope.detail_wa_show = true;
    		$scope.detail_wa_gz_show = false;
    		
    }
    
    $scope.detail_wa_gz_click = function(){
    		$scope.detail_wa_gz_show = true;
    		$scope.detail_wa_show = false;
    }
    
    var clientHe = document.documentElement.clientHeight;
    $("#ea_table_id")[0].style.height = clientHe - 360 - 105 - 30 + 'px';
    
}]);