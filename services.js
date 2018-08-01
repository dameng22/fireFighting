/**
 * Created by Lxy on 2017/12/7.
 */
var services = angular.module('services', ['ngResource']);
//公共服务,处理网络请求异常或者程序异常等等情况
// params{result, status, headers, config, paramsObj}
services.factory("handleHttpError",[ 'myself_alert',function(myself_alert){
    return {
        deal_app_error: function(params) {
            if (!params) {//params.result
                console.log("接口报错或者没有success字段");
                params && params["paramsObj"] && (params["error_code"] = "app_error") && params["paramsObj"]["errorDo"] && params["paramsObj"]["errorDo"](params);
                return false;
            }
            return true;
        },
        deal_network_error: function(params){
        	if(params.status != -1 && params.status != 401){  // && params.status != 401
      		myself_alert.dialog_show("错误码:"+ params.status);
//      		myself_alert.dialog_show("页面出错了");
        	}
            params && params["paramsObj"] && (params["error_code"] = "network_error") && params["paramsObj"]["errorDo"] && params["paramsObj"]["errorDo"](params);
            return false;
        }
    }
}]);

// paramsObj {url: '/', params:{a:1, b:1}, successDo:function(handleResult), errorDo:(handleResult)   }
services.factory('httpBase', ['$http', 'handleHttpError','http_url','$location','$rootScope','$base64', function($http, handleHttpError,http_url,$location,$rootScope,$base64){
    return{
        request: function(paramsObj){
        	var store = JSON.parse(localStorage.user_type);
        	if((paramsObj.url !='login' && paramsObj.url !='user/me'&& paramsObj.url !='accountCustomerSiteKeys/roleName'&& paramsObj.url !='accountCustomerSiteKeys/' && (!$rootScope.sys_token || !$rootScope.sys_unit || store.indexOf($rootScope.sys_role)==-1))  ){
		    	location.href="./login.html";
	        }
        	var urlplus = (typeof(paramsObj.urlplus))!='undefined'?paramsObj.urlplus:'';//query:path
            var requestObj = {method: paramsObj.method, url:http_url+paramsObj.url+urlplus};
          if (paramsObj.method == "GET" || paramsObj.method == "DELETE"){
              requestObj.params = paramsObj.params;
          }else {
              requestObj.data = paramsObj.params;
          }
			requestObj.headers = {'Authorization':$rootScope.sys_token?$base64.decode($rootScope.sys_token):'','customer_id':$rootScope.sys_unit?$base64.decode($rootScope.sys_unit):''};
            $http(requestObj).success(function(result,status,headers,config){
                var handleResult = {result: result,status: status,headers: headers,config:config, paramsObj:paramsObj};
                if(handleHttpError.deal_app_error(handleResult)){
                    paramsObj["successDo"] && paramsObj["successDo"](handleResult.result, handleResult);
                }
            }).error(function(result,status,headers,config){
                handleHttpError.deal_network_error({result: result,status: status,headers: headers,config:config, paramsObj:paramsObj});
            })
        },
        get: function(paramsObj){
            paramsObj.method = "GET";
            this.request(paramsObj);
        },
        post: function(paramsObj, url, params, successFunc, errorFunc, alwaysFunc){
            paramsObj.method = "POST";
            this.request(paramsObj);
        },
        put: function(paramsObj){
            paramsObj.method = "PUT";
            this.request(paramsObj);
        },
        delete: function(paramsObj){
            paramsObj.method = "DELETE";
            this.request(paramsObj);
        }
    }
}]);
//公用
services.factory('common_http', ['httpBase', function(httpBase){
	    return{
	        get_customer_map: function(params, successDo, errorDo){
	            httpBase.get({
	                url:'alerts/fa/map/customerMap',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
//			get_customer_map: function(params, successDo, errorDo){
//	            httpBase.get({
//	                url:'alerts/fa/map',
//	                params: params,
//	                successDo: successDo,
//	                errorDo: errorDo
//	            });
//	        },
	        user_check: function(user,params, successDo, errorDo){ //检查用户名是否可用
	            httpBase.get({
	                url:'username/availability/'+user,
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
            change_password: function(params, successDo, errorDo){
                httpBase.put({
                    url:'changepw',
                    params: params,
                    successDo: successDo,
                    errorDo: errorDo
                });
            },


	    }
}]);
services.factory('acceptance_http', ['httpBase', function(httpBase){
	    return{
	        get_unit_info: function(params, successDo, errorDo){
	            httpBase.get({
	                url:'customerSites/pageByCustomerId',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_auth_unit_info: function(params, successDo, errorDo){
	            httpBase.get({
	                url:'customerSites/pageByCustomerId/SystemRole',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        delete_unit_info: function(params, successDo, errorDo){
	            httpBase.delete({
	                url:'customerSites',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_unit_info_base: function(params, successDo, errorDo){ //基本信息
	            httpBase.get({
	                url:'customerSites/byId',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        edit_unit_info_base: function(params, successDo, errorDo){
	            httpBase.put({
	                url:'customerSites',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_unit_info_trans: function(params, successDo, errorDo){ //传输装置
	            httpBase.get({
	                url:'famRelays/byCustomerSiteId',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        edit_unit_info_trans: function(params, successDo, errorDo){ //传输装置修改
	            httpBase.put({
	                url:'famRelays',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        del_unit_info_trans: function(params, successDo, errorDo){ //传输装置删除
	            httpBase.delete({
	                url:'famRelays',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        check_trans_code: function(params, successDo, errorDo){ //传输装置校验
	            httpBase.post({
	                url:'famRelays/relayCheckCode',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_unit_all_build: function(params, successDo, errorDo){ //当前单位所有建筑物
	            httpBase.get({
	                url:'siteBuildingInfos',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_unit_info_build: function(params, successDo, errorDo){ //建筑物
	            httpBase.get({
	                url:'siteBuildingInfos/pages',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        edit_unit_info_build: function(params, successDo, errorDo){ //建筑物修改
	            httpBase.put({
	                url:'siteBuildingInfos',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        del_unit_info_build: function(params, successDo, errorDo){ //建筑物删除
	            httpBase.delete({
	                url:'siteBuildingInfos',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_unit_info_ctrl: function(params, successDo, errorDo){ //主控制器基础信息
	            httpBase.get({
	                url:'facuMains',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        edit_unit_info_ctrl: function(params, successDo, errorDo){ //主控制器基础信息修改
	            httpBase.put({
	                url:'facuMains',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        del_unit_info_ctrl: function(params, successDo, errorDo){ //主控制器基础信息修改
	            httpBase.delete({
	                url:'facuMains',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_unit_ctrl_sub: function(params, successDo, errorDo){ //主控制器下所有
	            httpBase.get({
	                url:'famFacus/byMainId',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        edit_unit_ctrl_sub: function(params, successDo, errorDo){ //子控制器修改
	            httpBase.put({
	                url:'famFacus/famFacus',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        del_unit_ctrl_sub: function(params, successDo, errorDo){ //子控制器修改
	            httpBase.delete({
	                url:'famFacus/delete',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_unit_info_water: function(params, successDo, errorDo){ //水系统
	            httpBase.get({
	                url:'waterInfos/pages',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        edit_unit_info_water: function(params, successDo, errorDo){ //水系统修改
	            httpBase.put({
	                url:'waterInfos',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        del_unit_info_water: function(params, successDo, errorDo){ //水系统修改
	            httpBase.delete({
	                url:'waterInfos',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_unit_info_outdoor: function(params, successDo, errorDo){ //室外
	            httpBase.get({
	                url:'facilitiesInfos/pages',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        edit_unit_info_outdoor: function(params, successDo, errorDo){ //室外修改
	            httpBase.put({
	                url:'facilitiesInfos',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        del_unit_info_outdoor: function(params, successDo, errorDo){ //室外消防栓删除
	            httpBase.delete({
	                url:'facilitiesInfos',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_unit_info_indoor: function(params, successDo, errorDo){ //室内消防栓
	            httpBase.get({
	                url:'fireHydrants/pages',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        edit_unit_info_indoor: function(params, successDo, errorDo){ //室内消防栓修改
	            httpBase.put({
	                url:'fireHydrants',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        del_unit_info_indoor: function(params, successDo, errorDo){ //室内消防栓删除
	            httpBase.delete({
	                url:'fireHydrants',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_unit_info_detect: function(params, successDo, errorDo){ //点位
	            httpBase.get({
	                url:'famDetectors/pageCategorys',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        edit_unit_info_detect: function(params, successDo, errorDo){ //点位
	            httpBase.put({
	                url:'famDetectors',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        del_unit_info_detect: function(params, successDo, errorDo){ //点位
	            httpBase.delete({
	                url:'famDetectors',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_picture_list: function(params, successDo, errorDo){ //图片信息
	            httpBase.get({
	                url:'famSitePicture',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       	},
	       	edit_picture_list: function(params, successDo, errorDo){ //图片信息修改
	            httpBase.put({
	                url:'famSitePicture',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       	},
	       	del_picture_list: function(params, successDo, errorDo){ //图片信息删除
	            httpBase.delete({
	                url:'famSitePicture',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       	},
	        get_unit_info_areas: function(params, successDo, errorDo){ //获取所有区域
	            httpBase.get({
	                url:'famSiteRegion/byId',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_authority_areas: function(params, successDo, errorDo){ //获取所有区域
	            httpBase.get({
	                url:'famSiteRegion/byId/systemRole',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_online_unit: function(params, successDo, errorDo){ //获取在线状态
	            httpBase.get({
	                url:'famRelays/byCustomerId',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_authority_unit: function(params, successDo, errorDo){ //获取在线状态
	            httpBase.get({
	                url:'famRelays/byCustomerId/addSystemRoleByCustomerId',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_online_test: function(params, successDo, errorDo){ //获取测试单位
	            httpBase.get({
	                url:'famRelays/listTesting',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_online_remark: function(params, successDo, errorDo){ //获取单位备注
	            httpBase.get({
	                url:'famDeviceRemarks/pages',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        add_online_remark: function(params, successDo, errorDo){ //单位备注
	            httpBase.put({
	                url:'famDeviceRemarks',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        delete_online_remark: function(params, successDo, errorDo){ //删除单位备注
	            httpBase.delete({
	                url:'famDeviceRemarks/delete',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_check_task: function(params, successDo, errorDo){ //获取巡检任务
	            httpBase.get({
	                url:'famCheckTasks/pages',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        add_check_task: function(params, successDo, errorDo){ //新增巡检任务
	            httpBase.put({
	                url:'famCheckTasks',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        start_check_task: function(params, successDo, errorDo){ //开始/结束巡检
	            httpBase.post({
	                url:'famCheckTasks/RunFlags',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        add_check_task_now: function(params, successDo, errorDo){ //立即执行
	            httpBase.put({
	                url:'famCheckTasks/immediately',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        del_check_task: function(params, successDo, errorDo){ //删除巡检
	            httpBase.post({
	                url:'famCheckTasks',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
			get_all_task: function(params, successDo, errorDo){ //查岗，校时
	            httpBase.get({
	                url:'famCheckRequests/pages',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       	},
	       	get_subs_task: function(params, successDo, errorDo){ //查岗，校时
	            httpBase.get({
	                url:'famCheckRequests/deviceInfo',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       	},
			get_fire_alarm: function(params, successDo, errorDo){ //火警报警
	            httpBase.get({
	                url:'alerts/fa/newFireConditionalQuery',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_alarms_unit: function(params, successDo, errorDo){ //火警右侧单位
	            httpBase.get({
	                url:'alerts/fa/companyList',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        deal_alarms: function(params, successDo, errorDo){ //警情处理
	            httpBase.put({
	                url:'alerts/fa/process/list',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_info_count: function(params, successDo, errorDo){ //左侧树数量 火警数量、故障数量、新报警
	            httpBase.get({
	                url:'alerts/count/newCountByView',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_unit_info_count: function(params, successDo, errorDo){ //左侧树数量  在线单位数量、单位总数、测试单位数量
	            httpBase.get({
	                url:'alerts/count/newCountByTable',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_authority_count: function(params, successDo, errorDo){ //加权限左侧树数量  在线单位数量、单位总数、测试单位数量
	            httpBase.get({
	                url:'alerts/count/countByRegionId/systemRole',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_alarms_detail: function(params, successDo, errorDo){ //警情详情
	            httpBase.get({
	                url:'alerts/fa/customer/processInfoByAlertId',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_troubles_list: function(params, successDo, errorDo){ //故障列表
	            httpBase.get({
	                url:'alerts/fa/deviceConditionalQuery',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        deal_troubles: function(params, successDo, errorDo){ //故障处理
	            httpBase.put({
	                url:'alerts/ft/process/list',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_troubles_detail: function(params, successDo, errorDo){ //警情详情
	            httpBase.get({
	                url:'alerts/fa/customer/getDeviceProcessInfoByAlertId',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
			get_troubles_record: function(params, successDo, errorDo){ //记录-故障条件查询
	            httpBase.get({
	                url:'alerts/fa/deviceRecordCondition',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
            get_troubles_record_systemRole: function (params, successDo, errorDo) {
                httpBase.get({
                    url:'alerts/fa/deviceRecordCondition/systemRole',
                    params: params,
                    successDo: successDo,
                    errorDo: errorDo
                });
            },
			get_fire_record: function(params, successDo, errorDo){ //记录-火警条件查询
	            httpBase.get({
	                url:'alerts/fa/fireRecordCondition',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
            get_fire_record_systemRole: function (params, successDo, errorDo) {
                httpBase.get({
                    url:'alerts/fa/fireRecordCondition/systemRole',
                    params: params,
                    successDo: successDo,
                    errorDo: errorDo
                });
            },
	        get_supervise_record: function(params, successDo, errorDo){ //记录-监管条件查询
	            httpBase.get({
	                url:'alerts/fa/supervise/getSuperviseByCustomerId',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
            get_supervise_record_systemRole: function (params, successDo, errorDo) {
                httpBase.get({
                    url:'alerts/fa/supervise/getSuperviseByCustomerId/systemRole',
                    params: params,
                    successDo: successDo,
                    errorDo: errorDo
                });
            },
	        get_monitor_count: function(params, successDo, errorDo){ //监控器右上角
	            httpBase.get({
	                url:'alerts/fa/map/countByCustomer',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        add_to_test: function(params, successDo, errorDo){ //加入测试
	            httpBase.post({
	                url:'famRelays/updateDeviceToTest',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        remove_test: function(params, successDo, errorDo){ //移除测试
	            httpBase.post({
	                url:'famRelays/updateDeviceToNetworking',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
//	        get_processed_task: function(params, successDo, errorDo){ //已完成任务
//	            httpBase.get({
//	                url:'famCheckTasks/record',
//	                params: params,
//	                successDo: successDo,
//	                errorDo: errorDo
//	            });
//	        },
//	        get_processing_task: function(params, successDo, errorDo){ //进行中任务
//	            httpBase.get({
//	                url:'famCheckTasks/record/pageByCustomerId',
//	                params: params,
//	                successDo: successDo,
//	                errorDo: errorDo
//	            });
//	        },
			get_processed_task: function(params, successDo, errorDo){ //已完成任务
	            httpBase.get({
	                url:'famCheckTasks/record/pageByCustomerId',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_processing_task: function(params, successDo, errorDo){ //进行中任务
	            httpBase.get({
	                url:'famCheckTasks/record',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_task_info: function(params, successDo, errorDo){ //进行中详情信息
	            httpBase.get({
	                url:'famCheckTasks',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_task_code: function(params, successDo, errorDo){ //任务编码
	            httpBase.get({
	                url:'famCheckTasks/record/repeatCode',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_test_record: function(params, successDo, errorDo){ //测试单位记录
	            httpBase.get({
	                url:'famTestingSiteRecord/getByCustomerId',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
            get_test_record_systemRole: function (params, successDo, errorDo) {
                httpBase.get({
                    url:'famTestingSiteRecord/getByCustomerId/systemRole',
                    params: params,
                    successDo: successDo,
                    errorDo: errorDo
                });
            },
	        get_plan: function(params, successDo, errorDo){ //灭火预案
	            httpBase.get({
	                url:'famExtingtishingPlan/page',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       edit_plan: function(params, successDo, errorDo){ //灭火预案修改
	            httpBase.put({
	                url:'famExtingtishingPlan/put',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       del_plan: function(params, successDo, errorDo){ //灭火预案删除
	            httpBase.delete({
	                url:'famExtingtishingPlan/delete',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       get_online_count: function(params, successDo, errorDo){ //获取单位在线数量
	            httpBase.get({
	                url:'famOnlineStatistics/pageByDayTime',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       get_region_count: function(params, successDo, errorDo){ //获取区域单位在线数量
	            httpBase.get({
	                url:'alerts/count/countByRegionId',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       get_region_authority_count: function(params, successDo, errorDo){ //获取区域单位在线数量
	            httpBase.get({
	                url:'alerts/count/countByRegionId/systemRole',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       get_api_types: function(params, successDo, errorDo){ //接口类型
	            httpBase.get({
	                url:'famFacus/types',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
			get_building_cells: function(params, successDo, errorDo){ //建筑物层数(坐)
	            httpBase.get({
	                url:'famSitePlace',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       	},
			modify_building_cells: function(params, successDo, errorDo){ //建筑物层数
	            httpBase.put({
	                url:'famSitePlace',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       	},
	       	get_floor_cells: function(params, successDo, errorDo){ //获取楼层
	            httpBase.get({
	                url:'famSiteStorey',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       	},
	       	delete_floor_cells: function(params, successDo, errorDo){ //删除楼层
	            httpBase.delete({
	                url:'famSiteStorey',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       	},
	       	modfiy_floor_cells: function(params, successDo, errorDo){ //增加/修改楼层
	            httpBase.put({
	                url:'famSiteStorey',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       	},
	       	delete_building_cells: function(params, successDo, errorDo){ //删除接口
	            httpBase.delete({
	                url:'famSitePlace',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       	},
	       	get_cells_pic: function(params, successDo, errorDo){ //平面图
	            httpBase.get({
	                url:'famSitePicture/storey',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       	},
	       	get_fire_alert_info: function(params, successDo, errorDo){ //火警详情
	            httpBase.get({
	                url:'alerts/fa/customer/alarmInformation',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       	},
	       	modify_super_status: function(plus,params, successDo, errorDo){ //超级状态
	            httpBase.put({
	                url:'famRelays/superStatus'+plus,
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       	},
	       	get_cal_list: function(params, successDo, errorDo){ //日历数据
	            httpBase.get({
	                url:'alerts/count/calendar',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_day_region: function(params, successDo, errorDo){ //某日期区域数据
	            httpBase.get({
	                url:'alerts/count/onlineStatusByRegion',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_region_detail: function(params, successDo, errorDo){ //某日期区域数据详情
	            httpBase.get({
	                url:'alerts/count/onlineStatisticsInfo',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_region_detail_auth: function(params, successDo, errorDo){ //某日期区域数据详情权限
	            httpBase.get({
	                url:'alerts/count/onlineStatisticsInfo/systemRole',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	       
	    }
}]);

services.factory('superivse_http', ['httpBase', function(httpBase){
	    return{
	        get_area_every_month: function(params, successDo, errorDo){
	            httpBase.get({
	                url:'countAlertAndFire/countMonthByRegionId',  
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_auth_area_every_month: function(params, successDo, errorDo){
	            httpBase.get({
	                url:'countAlertAndFire/countMonthByRegionId/newGetCountMonthByRegionId',  
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_year_month_day: function(params, successDo, errorDo){
	            httpBase.get({
	                url:'countAlertAndFire/countDayMonthYear',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_auth_year_month_day: function(params, successDo, errorDo){
	            httpBase.get({
	                url:'countAlertAndFire/countDayMonthYear/newGetCountDayMonthYear',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_month_data_by_year: function(params, successDo, errorDo){
	            httpBase.get({
	                url:'countAlertAndFire/countMonthByYear',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_auth_month_data_by_year: function(params, successDo, errorDo){
	            httpBase.get({
	                url:'countAlertAndFire/countMonthByYear/newGetCountByYear',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_year_fire_by_unit: function(params, successDo, errorDo){
	            httpBase.get({
	                url:'countAlertAndFire/countThisYearBySiteTypeId',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
            get_year_fire_by_unit_systemRole: function(params, successDo, errorDo){
                httpBase.get({
                    url:'countAlertAndFire/countThisYearBySiteTypeId/newCountThisYearBySiteTypeId',
                    params: params,
                    successDo: successDo,
                    errorDo: errorDo
                });
            },
	        get_trouble_top_ten: function(params, successDo, errorDo){
	            httpBase.get({
	                url:'countAlertAndFire/countThisMonthDeviceAlert',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
            get_trouble_top_ten_systemRole: function(params, successDo, errorDo){
                httpBase.get({
                    url:'countAlertAndFire/countThisMonthDeviceAlert/systemRole',
                    params: params,
                    successDo: successDo,
                    errorDo: errorDo
                });
            },
	        get_fire_top_ten: function(params, successDo, errorDo){
	            httpBase.get({
	                url:'countAlertAndFire/countThisMonthActualFire',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
            get_fire_top_ten_systemRole: function(params, successDo, errorDo){
                httpBase.get({
                    url:'countAlertAndFire/countThisMonthActualFire/systemRole',
                    params: params,
                    successDo: successDo,
                    errorDo: errorDo
                });
            },
	        get_current_month: function(params, successDo, errorDo){
	            httpBase.get({
	                url:'countAlertAndFire/countThisMonthByRegionId',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_auth_current_month: function(params, successDo, errorDo){
	            httpBase.get({
	                url:'countAlertAndFire/countThisMonthByRegionId/newGetCountThisMonthByRegionId',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_out_rate_percent: function(params, successDo, errorDo){//脱岗率
	            httpBase.get({
	                url:'countAlertAndFire/countOutGuardRate',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
            get_out_rate_percent_systemRole: function(params, successDo, errorDo){//脱岗率
                httpBase.get({
                    url:'countAlertAndFire/countOutGuardRate/systemRole',
                    params: params,
                    successDo: successDo,
                    errorDo: errorDo
                });
            },
	        get_on_rate_percent: function(params, successDo, errorDo){//在岗率
	            httpBase.get({
	                url:'countAlertAndFire/countOnGuardRate',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
            get_on_rate_percent_systemRole: function(params, successDo, errorDo){//在岗率
                httpBase.get({
                    url:'countAlertAndFire/countOnGuardRate/systemRole',
                    params: params,
                    successDo: successDo,
                    errorDo: errorDo
                });
            },
	        get_notice: function(params, successDo, errorDo){//通知列表
	            httpBase.get({
	                url:'networking/noticeList',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        add_notice: function(params, successDo, errorDo){//新增通知
	            httpBase.put({
	                url:'networking/famNoticeFile',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_notice_file: function(params, successDo, errorDo){//通知附件列表
	            httpBase.get({
	                url:'networking/noticeFileList',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        delete_notice: function(params, successDo, errorDo){//删除通知
	            httpBase.delete({
	                url:'networking/deleteFamNotice',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_upload_token: function(params, successDo, errorDo){ //上传token
	            httpBase.get({
	                url:'upload/token',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       upload_wmf_file: function(params, successDo, errorDo){ //上传wmf
	            httpBase.post({
	                url:'upload/wmftopng',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       get_alert_unit: function(params, successDo, errorDo){ //火警故障单位
	            httpBase.get({
	                url:'countAlertAndFire/countThisMonthActualFire/alert',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       get_rate_alert_unit: function(params, successDo, errorDo){ //在岗脱岗单位
	            httpBase.get({
	                url:'countAlertAndFire/countThisMonthActualFire/onGuardRateAlert',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       get_region_unit: function(params, successDo, errorDo){ //区域
	            httpBase.get({
	                url:'countAlertAndFire/countByMonthTime',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       get_region_auth: function(params, successDo, errorDo){ //区域
	            httpBase.get({
	                url:'countAlertAndFire/countByMonthTime/systemRole',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       get_region_area: function(params, successDo, errorDo){ //区域
	            httpBase.get({
	                url:'countAlertAndFire/countThisMonthActualFire/alertByRegionId',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       get_online_line: function(params, successDo, errorDo){ //折线
	            httpBase.get({
	                url:'alerts/count/getFoldLine/systemRole',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       	get_site_type: function(params, successDo, errorDo){ //字典查询
	            httpBase.get({
	                url:'siteTypes',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       	},
	    }
}]);
services.factory('foreground_http', ['httpBase', function(httpBase){
	    return{
	        get_unit_fire_alarm: function(params, successDo, errorDo){
	            httpBase.get({
	                url:'alerts/fa/networking/fireConditionalQuery',  
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_unit_trouble_alarm: function(params, successDo, errorDo){
	            httpBase.get({
	                url:'alerts/fa/networking/malfunctionConditionalQuery',  
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_unit_fire_record: function(params, successDo, errorDo){ //记录-火警条件查询
	            httpBase.get({
	                url:'alerts/fa/networking/fireRecordCondition',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_unit_supervise_record: function(params, successDo, errorDo){ //记录-监管条件查询
	            httpBase.get({
	                url:'alerts/fa/networking/supervise/getSuperviseByCustomerId',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_unit_troubles_record: function(params, successDo, errorDo){ //记录-故障条件查询
	            httpBase.get({
	                url:'alerts/fa/networking/malfunctionRecordCondition',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_unit_period_count: function(params, successDo, errorDo){ //联网单位统计每日每月每年
	            httpBase.get({
	                url:'countAlertAndFire/countDayMonthYearBySiteId',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_unit_month_count: function(params, successDo, errorDo){ //联网单位每月数量
	            httpBase.get({
	                url:'countAlertAndFire/countMonthlyBySiteId',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_check_task: function(params, successDo, errorDo){ //联网单位巡检列表
	            httpBase.get({
	                url:'famCheckTasks/page',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        add_check_task: function(params, successDo, errorDo){ //新增巡检任务
	            httpBase.put({
	                url:'famCheckTasks/Add',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
			start_check_task: function(params, successDo, errorDo){ //开始/结束巡检
	            httpBase.post({
	                url:'famCheckTasks/RunFlagUser',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        add_check_task_now: function(params, successDo, errorDo){ //立即执行
	            httpBase.put({
	                url:'famCheckTasks/immediately/customerSiteId',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        del_check_task: function(params, successDo, errorDo){ //删除巡检
	            httpBase.post({
	                //url:'/famCheckTasks/User',
	                url:'/famCheckTasks',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_all_task: function(params, successDo, errorDo){ //查岗，校时
	            httpBase.get({
	                url:'famCheckRequests/page',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       	},
	       	get_subs_task: function(params, successDo, errorDo){ //查岗，校时
	            httpBase.get({
	                url:'famCheckRequests/deviceInfo/customerSiteId',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       	},
//			get_processed_task: function(params, successDo, errorDo){ //已完成任务
//	            httpBase.get({
//	                url:'famCheckTasks/record/customerSiteId',
//	                params: params,
//	                successDo: successDo,
//	                errorDo: errorDo
//	            });
//	        },
//	        get_processing_task: function(params, successDo, errorDo){ //进行中任务
//	            httpBase.get({
//	                url:'famCheckTasks/record/pageByCustomerId/customerSiteId',
//	                params: params,
//	                successDo: successDo,
//	                errorDo: errorDo
//	            });
//	        },
			get_processing_task: function(params, successDo, errorDo){ //已完成任务
	            httpBase.get({
	                url:'famCheckTasks/record/customerSiteId',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_processed_task: function(params, successDo, errorDo){ //进行中任务
	            httpBase.get({
	                url:'famCheckTasks/record/pageByCustomerId/customerSiteId',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        get_sys_setting: function(params, successDo, errorDo){ //系统设置数组
	            httpBase.get({
	                url:'famDeviceConfig/list',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        delete_sys_setting: function(params, successDo, errorDo){ //系统设置删除
	            httpBase.delete({
	                url:'famDeviceConfig',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        modify_sys_setting: function(params, successDo, errorDo){ //系统设置修改
	            httpBase.put({
	                url:'famDeviceConfig',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	        modify_sys_setting_list: function(params, successDo, errorDo){ //系统设置修改
	            httpBase.put({
	                url:'famDeviceConfig/list',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	       	get_single_setting: function(params, successDo, errorDo){ //系统设置
	            httpBase.get({
	                url:'famDeviceConfig',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	        },
	    }
}]);
services.factory('background_http', ['httpBase', function(httpBase){
		return {
			logs: function(params, successDo, errorDo){ //日志
	            httpBase.get({
	                url:'loginLogs/pages',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       get_operate_logs: function(params, successDo, errorDo){ //操作日志
	            httpBase.get({
	                url:'famLog/pageByCustomerId',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       get_phone_list: function(params, successDo, errorDo){ //电话簿
	            httpBase.get({
	                url:'FamPhoneBookPerson/pages',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       edit_phone_list: function(params, successDo, errorDo){ //电话簿修改
	            httpBase.put({
	                url:'FamPhoneBookPerson/',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       del_phone_list: function(params, successDo, errorDo){ //电话簿删除
	            httpBase.delete({
	                url:'FamPhoneBookPerson/delete',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       get_account: function(params, successDo, errorDo){ //获取账户
	            httpBase.get({
	                url:'accountManager/roleId',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       add_account: function(params, successDo, errorDo){ //添加账户
	            httpBase.post({
	                url:'accountManager',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       modify_account: function(params, successDo, errorDo){ //修改账户
	            httpBase.put({
	                url:'accountManager',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       del_account: function(params, successDo, errorDo){ //账户删除
	            httpBase.delete({
	                url:'accountManager',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       suspend_account: function(params, successDo, errorDo){ //账户停用
	            httpBase.put({
	                url:'accountManager/deactivate',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       start_using_account: function(params, successDo, errorDo){ //账户启用
	            httpBase.put({
	                url:'accountManager/reactivate',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
			get_account_list: function(params, successDo, errorDo){ //获取账户
	            httpBase.get({
	                url:'accountCustomerSiteKeys/getChoice',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       del_account_item: function(params, successDo, errorDo){ //删除一个角色
	            httpBase.delete({
	                url:'accountCustomerSiteKeys/deleteByAccountIdAndSiteIdOrRegionId',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       add_account_item: function(params, successDo, errorDo){ //添加一个角色
	            httpBase.put({
	                url:'accountCustomerSiteKeys/putAccountCustomerSite',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       get_account_item: function(params, successDo, errorDo){ //获取角色
	            httpBase.get({
	                url:'accountCustomerSiteKeys/getDoubleList',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       get_roles_list: function(params, successDo, errorDo){ //获取角色列表
	            httpBase.get({
	                url:'accountManager/roles',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       get_sub_roles: function(params, successDo, errorDo){ //获取子角色列表
	            httpBase.get({
	                url:'accountManager/leafRoles',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	      get_pie_data: function(params, successDo, errorDo){ //获取饼图
	            httpBase.get({
	                url:'countAlertAndFire/pieChartCount',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       get_pie_company: function(params, successDo, errorDo){ //获取饼图单位
	            httpBase.get({
	                url:'countAlertAndFire/paiChartRightList',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       
	       
	       
		};
}]);
services.factory('dic_http', ['httpBase', function(httpBase){
	    return{
			get_fire_bridge: function(params, successDo, errorDo){ //获取消防中队
	            httpBase.get({
	                url:'fireBrigades',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       get_device_type: function(params, successDo, errorDo){ //设备类型
	            httpBase.get({
	                url:'famDetectors/listCategories',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       get_manufacturer: function(params, successDo, errorDo){ //产商列表
	            httpBase.get({
	                url:'famRelays/famManufacturers',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       modify_manufacturer: function(params, successDo, errorDo){ //修改产商
	            httpBase.put({
	                url:'famRelays/famManufacturers/put',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       delete_manufacturer: function(params, successDo, errorDo){ //删除产商
	            httpBase.delete({
	                url:'famRelays/famManufacturers/delete',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       disabled_manufacturer: function(params, successDo, errorDo){ //禁用产商
	            httpBase.post({
	                url:'famRelays/famManufacturers/updateIsDisable',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       get_fam_type: function(params, successDo, errorDo){ //通讯方式
	            httpBase.get({
	                url:'famModeType/famModeTypes',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       modify_fam_type: function(params, successDo, errorDo){ //修改通讯方式
	            httpBase.put({
	                url:'famModeType/put',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       delete_fam_type: function(params, successDo, errorDo){ //删除通讯方式
	            httpBase.delete({
	                url:'famModeType/delete',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       disabled_fam_type: function(params, successDo, errorDo){ //禁用通讯方式
	            httpBase.post({
	                url:'famModeType/updateIsDisable',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       get_device_types: function(params, successDo, errorDo){ //设备型号
	            httpBase.get({
	                url:'famModel/getByCustomerId',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       modify_device_type: function(params, successDo, errorDo){ //修改设备型号
	            httpBase.put({
	                url:'famModel/put',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       delete_device_type: function(params, successDo, errorDo){ //删除设备型号
	            httpBase.delete({
	                url:'famModel/delete',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       disabled_device_type: function(params, successDo, errorDo){ //禁用设备型号
	            httpBase.post({
	                url:'famModel/updateIsDisable',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       get_unit_phone_list: function(params, successDo, errorDo){ //联网单位电话簿
	            httpBase.get({
	                url:'customerSites/pagePhoneBookByCustomerId',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       get_super_bridge: function(params, successDo, errorDo){ //获取消防大队
	            httpBase.get({
	                url:'fireBrigades/superiorNameList',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       get_sub_bridge: function(params, successDo, errorDo){ //获取大队消防中队
	            httpBase.get({
	                url:'fireBrigades/nameList',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       get_fam_modal: function(params, successDo, errorDo){ //查询指定制造商下的设备型号
	            httpBase.get({
	                url:'famModel/getByManufacturerId',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       get_common_dic: function(params, successDo, errorDo){ //字典查询
	            httpBase.get({
	                url:'famDictionary',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       modify_common_dic: function(params, successDo, errorDo){ //字典修改
	            httpBase.put({
	                url:'famDictionary',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       delete_common_dic: function(params, successDo, errorDo){ //字典删除
	            httpBase.delete({
	                url:'famDictionary',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       },
	       	get_site_type: function(params, successDo, errorDo){ //字典查询
	            httpBase.get({
	                url:'siteTypes',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       	},
       	}
}]);
services.factory('login', ['httpBase', function(httpBase){
		return {
			entry: function(params, successDo, errorDo){ //设备类型
	            httpBase.post({
	                url:'login',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       	},
	       	user: function(params, successDo, errorDo){ //设备类型
	            httpBase.get({
	                url:'user/me',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       	},
	       	unit: function(params, successDo, errorDo){ //获取登录人信息
	            httpBase.get({
	                url:'accountCustomerSiteKeys/',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       	},
	       	unit_info: function(params, successDo, errorDo){ //获取登录人信息
	            httpBase.get({
	                url:'accountCustomerSiteKeys/roleName',
	                params: params,
	                successDo: successDo,
	                errorDo: errorDo
	            });
	       	},
		};
}]);
//路由状态
services.factory('router_state', function(){
	return {
		state:'',
	};
});
//新火警数量
services.factory('new_fire', function(){
	return {
		count:0,
	};
});
//弹出框
services.factory('myself_alert', function(){
    return{
        dialog_show: function(dia_content){
            var d = dialog({
                content: dia_content
            });
            d.show();
            setTimeout(function() {
                d.close().remove();
            }, 1000);
        }
    }
});
//判断汉字
services.factory('exp_tool', function(){
    return{
        is_chinese: function(val){
            var strExp=new RegExp(/^[\u4E00-\u9FA5]+$/);
			if(strExp.test(val)){
			   	return true;
			}else{
				return false;
			}
        },
         moreThanZero: function(num){ //大于0的浮点数
            var regular = /^(\d|[1-9]\d+)(\.\d+)?$/;
		    if(regular.test(num)){
	            return true;    
		    }else{
		    	return false;
		    }
        },
        email: function(num){
            var regular = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
		    if(regular.test(num)){
	            return true;  
		    }else{
		    	return false;
		    }
       	},
        cellphone:function(num){
            var regular = /^1\d{10}$/;
		    if(regular.test(num)){
	            return true;   
		    }else{
		    	return false;
		    }
       	},
        tellphone:function(num){
            var regular = /^0\d{2,3}-\d{7,8}(-\d{1,6})?$/;// /^0\d{2,3}-?\d{7,8}$/ 不带分机号
		    if(regular.test(num)){
	            return true;   
		    }else{
		    	return false;
		    }
      	},
      	id_card:function(num){ //身份证
            var regular = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
		    if(regular.test(num)){
	            return true;   
		    }else{
		    	return false;
		    }
      	},
      	more_than_zero_int: function (num) { //正整数
            var regular = /^[1-9]*[1-9][0-9]*$/;
            if(regular.test(num)){
	            return true;   
		    }else{
		    	return false;
		    }
        },
        unit_code: function (num) { //单位编码
            var regular = /^[0-9]*$/;
            if(regular.test(num)){
	            return true;   
		    }else{
		    	return false;
		    }
        },
       	check_number_input: function (value) {
            var string = value.match(/(^(\d)+[\.]?(\d){1,2})|^\d/g);
            return string;
        }
    }
});
//导出文件
services.factory('downloadFiles',['$http','http_url','$rootScope','$base64',function($http,http_url,$rootScope,$base64){
    return {
        download: function(links,addurl,jsons,types,filename) {
       		$http({
			    url: http_url + links,
			    method: types,
			    responseType: 'arraybuffer',
			    params: addurl,
			    data:jsons,
			    headers: {
			    	'Authorization':$base64.decode($rootScope.sys_token),
			        'customer_id':$base64.decode($rootScope.sys_unit),
			        'Content-type': 'application/json',
			        'Accept': 'application/octet-stream'
			    }
			}).success(function(data){
			    var blob = new Blob([data], {
			        type: 'application/octet-stream'    //  xls
			    });
			    saveAs(blob, filename + '.xls');
			})
	    }
    }
}]);
//天气
services.factory('weather',function(){
    return {
        get: function(data) {
        	var styles;
       		switch(data){
				case '晴':
					styles = 'wea_sunny';
					break;
				case '多云':
					styles = 'wea_clound';
					break;
				case '阴':
					styles = 'wea_shade';
					break;	
				case '阵雨':
				case '雷阵雨':
				case '小雨':
				case '中雨':
				case '大雨':
				case '冻雨':
				case '小雨-中雨':
				case '中雨-大雨':
					styles = 'wea_rain';
					break;		
				case '雷阵雨并伴有冰雹':
				case '雨夹雪':
				case '弱高吹雪':
					styles = 'wea_rain_snow';
					break;	
				case '暴雨':
				case '大暴雨':
				case '特大暴雨':
				case '大雨-暴雨':
				case '暴雨-大暴雨':
				case '大暴雨-特大暴雨':
					styles = 'wea_heavy_rain';
					break;	
				case '阵雪':
				case '小雪':
				case '中雪':
				case '大雪':
				case '暴雪':
				case '小雪-中雪':
				case '中雪-大雪':
				case '大雪-暴雪':
					styles = 'wea_snow';
					break;	
				case '雾':
				case '轻雾':
					styles = 'wea_fog';
					break;	
				case '沙尘暴':
				case '浮尘':
				case '扬沙':
				case '强沙尘暴':
					styles = 'wea_dust_storm';
					break;	
				case '龙卷风':
				case '飑':
					styles = 'wea_tornado';
					break;
				case '霾':
					styles = 'wea_haze';
					break;
				default:
					styles = 'wea_unknow';
			}
       		return styles;
	    }
    }
});
//生成菜单树
services.factory('trans',["$filter",function($filter){
    return {
    	currentTree: function(menu,datas) {  //生成当前数Json
			var currentNav = new Array();
			var leng = menu.length;
			for(var k in datas){
				for(var i=0;i<leng;i++){
					if(k == menu[i].id){
						menu[i].permission = datas[k];
						currentNav.push(menu[i]);
					}
				}
			}
			currentNav =  $filter("orderBy")(currentNav,"id");
			return currentNav;
	    },
    }
}]);
services.factory('navData', function(){
    return {
	    data:'',
		user:''
    }
});
services.factory('timeTools', function(){
    return {
	    getDaysInMonth: function(year, month) { //某年某月多少天
			var date = new Date(year, month, 1);
       		return new Date(date.getTime() - 864e5).getDate();  
	    },
	    formatMonths: function(today) { //月份
			return today.getMonth()+1<=9?'0'+(today.getMonth()+1):(today.getMonth()+1).toString(); 
	    },
    }
});
services.factory('curTime', function(){
    return {
    	nowDate:function(){
    		var date = new Date();
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var day = date.getDate();
			if (month < 10) {
			    month = "0" + month;
			}
			if (day < 10) {
			    day = "0" + day;
			}
			return nowDate = year + "/" + month + "/" + day;
    	},
	}
});
services.factory('timeStamp', function(){//时间戳转当前年月日
    return {
    	getLocalTime:function(inputTime) {  
		    var date = new Date(inputTime);
		    var y = date.getFullYear();  
		    var m = date.getMonth() + 1;  
		    m = m < 10 ? ('0' + m) : m;  
		    var d = date.getDate();  
		    d = d < 10 ? ('0' + d) : d;  
		    var h = date.getHours();
		    h = h < 10 ? ('0' + h) : h;
		    return y + '/' + m + '/' + d;  
		},
	}
});