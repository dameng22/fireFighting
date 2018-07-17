/**
 * Created by Lxy on 2017/12/28.
 */
//app.controller('elecAlarmController', ['$scope', function($scope){
//	
//}]);

app.controller('elecAlarmController', ['$scope','$timeout','echart_round','foreground_http','$filter','$rootScope', function($scope,$timeout,echart_round,foreground_http,$filter,$rootScope){
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
//              data:[19, 20, 21, 24, 22, 21, 20, 20, 19, 15, 5, 10, 18, 19, 20,
//              		22, 28, 28, 27, 27, 26, 24, 26, 18, 18, 18, 20, 23, 23, 23],
				data:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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
//            	data:[26, 27, 30, 31, 32, 33, 35, 33, 32, 31, 30.5, 32, 33, 30, 27, 20,
//            		20, 20, 20, 27, 35, 37, 38, 40, 42, 44, 46, 50, 52, 53],
				data:[0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0],
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