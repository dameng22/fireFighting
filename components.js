/**
 * Created by Lxy on 2017/12/7.
 */
var components = angular.module('components', []);
//受理 查看联网单位
components.component('networkUnitAlert', {
    bindings:{
        showAlert:'=',
        info:'=',
        id:'=',
        selected:'=',
        unitName:'=',
        buildingsInfo:'=',
        deviceList:'='
    },
    controller:function(acceptance_http,all_dic,dic_http,$filter,$rootScope,$base64,$stateParams,qiniu_url){
        var self = this;
        //获取区域
	  	acceptance_http.get_unit_info_areas({customerId:$base64.decode($rootScope.sys_unit)},function(result){
	  		self.net_areas = result;
	  	})
	  	//获取单位类别
	  	//self.site_type = all_dic.siteType;	
	  	self.site_type = [];
		dic_http.get_site_type({customerId:$base64.decode($stateParams.unit)},function(result){
	        for(var i=0;i<result.length;i++){
	            self.site_type.push(result[i]);  
	        }
    	});
	
        //监管等级
        self.resistance_rates = all_dic.resistanceRates;
        //耐火等级
		self.fire_rates = all_dic.fireRates;
		//通讯模式
		dic_http.get_fam_type({customerId:$base64.decode($rootScope.sys_unit),isdisable:false},function(result){
			self.communication_mdl = result;
		})
		//建筑物结构
		self.building_structure = all_dic.buildingStructure;
		//建筑物使用性质
		self.using_types = all_dic.usingTypes;
		//建筑物类别
		self.building_categorys = all_dic.buildingCategorys;
		//耐火等级
		self.fire_risks = all_dic.fireRisks;
		//防火门类型
		self.fire_door_types = all_dic.fireProofDoorTypes;
		//楼梯形式
		self.stair_forms = all_dic.stairForms;
		//控制器分类
		self.fam_facus_type = all_dic.famFacusType;
		//服务状态
		self.service_state = all_dic.serviceState;
		//获取设备类型
		dic_http.get_device_type({},function(result){
			self.device_type = result;
		});
		//获取厂商信息
		dic_http.get_manufacturer({customerId:$base64.decode($rootScope.sys_unit),isdisable:false},function(result){
			self.manufacturer = result;
		});
		//获取控制器厂商信息
		dic_http.get_manufacturer({customerId:$base64.decode($rootScope.sys_unit),isdisable:false,typeId:1},function(result){
			self.ctrl_manu = result;
		});
		acceptance_http.get_api_types({customerId:$base64.decode($rootScope.sys_unit)},function(result){
			self.api_types = result;
		});
		//电信运营商
		self.operate_company = all_dic.operateCompany;
		//图片类型
	   	self.picture_type = all_dic.pictureType;
        self.tab_list=[	
			{order:0,name:'基本信息'},
			{order:1,name:'传输装置信息'},
			{order:2,name:'建筑物信息'},
			{order:3,name:'火灾自动报警控制器信息'},
			{order:4,name:'水系统信息'},
			{order:5,name:'室外消防设施信息'},
			{order:6,name:'建筑物内消防设施信息'},
			{order:8,name:'建筑火灾自动报警平面图'},
			{order:9,name:'重点部位灭火预案'},
//			{order:10,name:'周边道路及外观'},
			{order:10,name:'外观图'},
			{order:11,name:'地理位置'}
		];
        self.show_tab=function(index){
        	self.gz_pic_building = true;
			if($rootScope.sys_role == "fams_famadmin" || $rootScope.sys_role == "fams_org" ){
				self.gz_pic_building = false;
			}
        	self.selected = index;
        	if(self.selected == sessionStorage.current_tab){
        		return;
        	}
			sessionStorage.current_tab = angular.copy(index);
			self.currentPage = 1;
			self.get_page_data(index);
		};
		var map = new BMap.Map("unitMap");
		if($base64.decode($rootScope.sys_unit) == 'ANLITAI_2017_FAKE'){
			var point = new BMap.Point(113.269616, 23.15995);
		}else{
			var point = new BMap.Point(113.11, 23.05);
		};
	    map.centerAndZoom(point, 13);
//	    map.setCurrentCity("广州");
	    map.enableScrollWheelZoom(true);
		self.get_page_data = function(index){
			self.show_location = false;
			switch(index){
				case 1://传输装置
					acceptance_http.get_unit_info_trans({customerSiteId:self.id},function(result){
						self.info = result;
					})
				  	break;
				case 2://建筑物
					acceptance_http.get_unit_info_build({customerSiteId:self.id,pageNum:self.currentPage,pageSize:1},function(result){
						self.info = result.results;
						self.bigTotalItems = result.count;
						self.totalPage = result.totalPage;
					})
				  	break;
				case 3://控制器
					acceptance_http.get_unit_info_ctrl({customerSiteId:self.id,pageNum:self.currentPage,pageSize:1},function(result){
						self.info = result.results;
						self.bigTotalItems = result.count;
						self.totalPage = result.totalPage;
						if(typeof(self.info[0]) != 'undefined' && self.info[0].id){
							acceptance_http.get_unit_ctrl_sub({mainId:self.info[0].id},function(result){
								self.sub = result;
							});
						}else{
							self.sub = [];
						}
					})
				  	break;
				case 4://水系统
					acceptance_http.get_unit_info_water({customerSiteId:self.id,pageNum:self.currentPage,pageSize:1},function(result){
						self.info = result.results;
						self.bigTotalItems = result.count;
						self.totalPage = result.totalPage;
					})
				  	break;
				case 5://室外
					acceptance_http.get_unit_info_outdoor({customerSiteId:self.id,pageNum:self.currentPage,pageSize:1},function(result){
						self.info = result.results;
						self.bigTotalItems = result.count;
						self.totalPage = result.totalPage;
					})
				  	break;
				case 6://室内
					acceptance_http.get_unit_info_indoor({customerSiteId:self.id,pageNum:self.currentPage,pageSize:1},function(result){
						self.info = result.results;
						self.bigTotalItems = result.count;
						self.totalPage = result.totalPage;
					})
				  	break;
				case 8://消防图纸
					//图片类型
	   				self.picture_type = all_dic.surfaceType;
	   				self.floors = [];
	   				self.floor_list=[];
	   				self.info=[];
	   				self.re_floor = {};
	   				self.isShowCell = true;
					//获取建筑物
					acceptance_http.get_unit_all_build({customerSiteId:self.id},function(result){
						self.buildings_info = result;
						if(self.buildings_info.length>0){
							self.build_id = self.buildings_info[0].id;
							self.get_cell();
						} else {
							self.isShowCell = false;
						}
					});
					//获取建筑物层数
					var start = 0;
					self.isShowFloor = false;
					self.get_cell = function(){
						if(!self.build_id){
							return;
						}
						acceptance_http.get_building_cells({'buildId':self.build_id},function(result){
							self.floors = result;
							for(var i in self.floors){
								var val = self.floors[i];
								if(val.buildId){
									self.isShowFloor = true;
								} 
							}	
							//初始化
							//start = start + 1
							if(self.floors.length>0){
								self.floor_id = self.floors[0].id;
								self.get_floor();
							}
						})
					};
					//楼层
					self.get_floor = function(){
						self.floor_list = [];
						if(self.floor_id){
							acceptance_http.get_floor_cells({'placeId':self.floor_id},function(result){
								self.floor_list = result;
							});
						}
						
						
						for(var i=0;i<self.floors.length;i++){
							if(self.floors[i].id == self.floor_id){
								self.re_floor = self.floors[i];
							}
						}
						for(var i = self.re_floor.floorUpQuantity;i>0;i--){
							self.floor_list.push({'index':i,'name':'地上'+i+'层'})
						}
						for(var i = 1;i<=self.re_floor.floorDownQuantity;i++){
							self.floor_list.push({'index':-i,'name':'地下'+i+'层'})
						}	
					};
					//显示平面图
					self.show_surface = function(floor){
						self.sur_selected = floor;
						acceptance_http.get_cells_pic({'customerSiteId':self.id,'pictureTypeIds':10,'placeId':self.floor_id,'storeyId':floor,'pageNum':1,'pageSize':1},function(result){
							self.info = result.results;
							for(var i in self.info){
								self.pictureId = self.info[i].id;
								self.famPointPosition = self.info[i].famPointPositions;
								if(self.famPointPosition.length == 0){
									$("#img_surface_id").hide();
									self.dot_info = false;
								} else {
									$("#img_surface_id").show();
									self.dot_info = true;
								}
							}
							if(self.info.length == 0){//
								self.show_draw_dot = false;
								self.famPointPosition = [];
							} else {
								self.show_draw_dot = true;
							}
						})
					};
				  	break;
				case 9://灭火预案
					acceptance_http.get_plan({customerSiteId:self.id,pageNum:1,pageSize:100},function(result){
						self.info = result.results;
					})
					self.download = function(name,origin){
			        	window.open(qiniu_url+name+'?attname='+origin);
			        }
				  	break;
				  	
				case 10://图片
					self.picture_type = all_dic.pictureType;
					acceptance_http.get_picture_list({customerSiteId:self.id,pageNum:self.currentPage,pageSize:100,pictureTypeIds:[0,1,2]},function(result){
						self.info = result.results;
						self.bigTotalItems = result.count;
						self.totalPage = 0;
					});
					acceptance_http.get_picture_list({customerSiteId:self.id,pageNum:1,pageSize:20,pictureTypeIds:[3,4,5,6]},function(result){
						self.roadside = result.results;
						self.east = $filter("filter")(self.roadside,{pictureType:3});
						self.west = $filter("filter")(self.roadside,{pictureType:4});
						self.sourth = $filter("filter")(self.roadside,{pictureType:5});
						self.north = $filter("filter")(self.roadside,{pictureType:6});
					});
				  	break;
				case 11://地理位置
					acceptance_http.get_unit_info_trans({customerSiteId:self.id},function(result){
						self.info = result;
						map.clearOverlays();
						angular.forEach(result, function (site, i) {
					    	if(typeof(site.address) != 'undefined'&&site.address){
					            var pt = new BMap.Point(site.address.longitude, site.address.lattitude);
						        var myIcon = new BMap.Icon("images/icon_online.png", new BMap.Size(25, 33));
						        var marker = new BMap.Marker(pt, {icon: myIcon});
						        map.addOverlay(marker);
						        map.panTo(pt);
						        
//						        map.addEventListener('zoomend', function(){    //地图更改缩放级别结束时触发触发此事件
//				                	marker.setPosition(map.getCenter());
//				          		});
					       }
					    })
					});
				  	break;
				default: //基本
					acceptance_http.get_unit_info_base({id:self.id},function(result){
						self.info = result;
					})
			}
		}
		//显示图片或标题
		self.show_pic = function(alias){
			if(self.selected != 9){
				return;
			}
			if(alias){
				for(var i=0;i<alias.length;i++){
					if(alias[i].attachmentTypeId == 0){
						return alias[i];
						break;
					}
				}
			}
		}
		self.get_location = function(){
			self.show_location = true;
			acceptance_http.get_unit_info_detect({customerSiteId:self.id,pageNum:self.currentPage,pageSize:100},function(result){
				self.info = result.results;
				self.totalPage = 0;
			})
		}
        self.selected = self.current;
        self.alert_cancel = function(){
            self.showAlert = false;
        };
        self.is_or_no_alert = function(){
            if(typeof(self.showAlert) == 'undefined'){
                return 'network_alert';
            }
            if(self.showAlert){
                return 'network_alert fams_alert_enter';
            }else{
                return 'network_alert fams_alert_none';
            }
        }
    },
    templateUrl:'./template/components/networkUnitAlert.html'
});
//添加备注或修改备注
components.component('showRemarkAlert', {
    bindings:{
        showAlert:'=',
        type:'=',
        ids:"=",
        list:"=",
        typeId:'=',
        currentPage:'=',
        totalPage:'='
    },
    controller:function(acceptance_http,myself_alert,$rootScope){
        var self = this;
        self.user_name = $rootScope.users_name;
        self.alert_true = function(){
        	var param = {
			  "deviceId": self.ids,
			  "operatorId": self.operator,
			  "remark": self.remark,
			  "remarkTime": 0,
			  "typeId": self.typeId
			}
			acceptance_http.add_online_remark(param,function(result){
				myself_alert.dialog_show("添加成功!");
				self.showAlert = false;
				self.ids = null;
				self.operator = null;
				self.remark = null;
			});
        };
        self.alert_cancel = function(){
            self.showAlert = false;
        };
        self.get_by_page=function(){
        	acceptance_http.get_online_remark({deviceId:self.ids,typeId:self.typeId,pageNum:self.currentPage,pageSize:5},function(result){
				self.list = result;
			});
        };
        self.delete_remark = function(id){
        	acceptance_http.delete_online_remark({'id':id},function(){
        		myself_alert.dialog_show("删除成功!");
        		self.currentPage = 1;
        		self.get_by_page();
        	})
        }
        self.is_or_no_alert = function(){
            if(typeof(self.showAlert) == 'undefined'){
                return 'remark_alert';
            }
            if(self.showAlert){
            	if(self.type==0){
            		return 'remark_alert fams_alert_enter';
            	}else{
            		return 'remark_alert remark_alert_view fams_alert_enter';
            	}
            }else{
            	if(self.type==0){
            		return 'remark_alert fams_alert_none';
            	}else{
            		return 'remark_alert remark_alert_view fams_alert_none';
            	}
            }
        }
    },
    templateUrl:'./template/components/showRemarkAlert.html'
});
//火灾报警信息详情
components.component('fireDetailAlert', {
    bindings:{
        showAlert:'=',
        fireInfo:'=',
        type:'@'
    },
    controller:function(){
        var self = this;
        self.status_format = function(process,end){
			switch(process){
				case 0:
					return '未处理';
				case 1:
					return '待确认';
				case -1:
					return '单位确认';
				case 2:
					if(self.type == 'fire'){
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
					}else if(self.type == 'trouble'){
						return '已处理';
					}
			}
        };
        self.alert_cancel = function(){
            self.showAlert = false;
        };
        self.is_or_no_alert = function(){
            if(typeof(self.showAlert) == 'undefined'){
                return 'fire_detail_alert';
            }
            if(self.showAlert){
            	return 'fire_detail_alert fams_alert_enter';
            }else{
            	return 'fire_detail_alert fams_alert_none';
            }
        }
    },
    templateUrl:'./template/components/fireDetailAlert.html'
});
//换岗弹框
components.component('relieveGuardAlert', {
    bindings:{
        showAlert:'='
    },
    controller:function(login,myself_alert,$http,$state,$base64,$rootScope,$scope,navData){
        var self = this;
        self.alert_true = function(){
        	if (!self.new_user){
	            myself_alert.dialog_show("用户名不能为空!");
	            return;
	        }
	        if (!self.new_pwd){
	            myself_alert.dialog_show("密码不能为空!");
	            return;
	        }
	        var data = {
	            username:self.new_user,
	            password:md5(self.new_pwd).toUpperCase(),
	        }
	        login.entry(data,function(res,transfer){
				if(transfer.status == 200){
				    login.user({}, function(result){
						var sys_role = result.accounts[0].roleIdentifiers[0];
						var trans = $base64.encode(res.tokenType + ' ' + res.token)+'/'+$base64.encode(result.accounts[0].customerId)+'/'+sys_role;
						if(sys_role.indexOf('fams_famadmin')!=-1){
							$rootScope.users_name = self.new_user;
							//location.href = "./index.html#/fireAlarm/"+trans;
							$rootScope.sys_token = $base64.encode(res.tokenType + ' ' + res.token);
							$rootScope.sys_unit = $base64.encode(result.accounts[0].customerId);
							navData.data = null;
							$state.go("fireAlarm",{token:$base64.encode(res.tokenType + ' ' + res.token),unit:$base64.encode(result.accounts[0].customerId),sys:sys_role},{reload:true});
							self.showAlert = false;
							self.new_user = "";
							self.new_pwd = "";
							//$scope.$apply();
						}else{
							myself_alert.dialog_show("您没有访问权限!");
						}
				    });
				}
	       	},function(error){
	       		myself_alert.dialog_show("用户名或密码错误!");
	       	});
        };
        self.alert_cancel = function(){
            self.showAlert = false;
        };
        self.is_or_no_alert = function(){
            if(typeof(self.showAlert) == 'undefined'){
                return 'relieve_guard_wrap';
            }
            if(self.showAlert){
            	return 'relieve_guard_wrap fams_alert_enter';
            }else{
            	return 'relieve_guard_wrap fams_alert_none';
            }
        }
    },
    templateUrl:'./template/components/relieveGuardAlert.html'
});
//修改密码弹框
components.component('revisePwdAlert', {
    bindings:{
        showAlert:'='
    },
    controller:function(myself_alert,common_http){
        var self = this;
        self.alert_true = function(){
            if (!self.old_pwd){
                myself_alert.dialog_show("请输入旧密码!");
                return;
            }
            if (!self.new_pwd){
                myself_alert.dialog_show("请输入新密码!");
                return;
            }
            if (!self.rewrite_pwd){
                myself_alert.dialog_show("请再次输入新密码!");
                return;
            }
            if (self.rewrite_pwd != self.new_pwd) {
                myself_alert.dialog_show("两次输入的新密码不一致,请重新输入!");
                return;
			}
            var data = {
                password:md5(self.old_pwd).toUpperCase(),
                newPassword:md5(self.new_pwd).toUpperCase(),
            }
            common_http.change_password(data,function(res,transfer){
            	if (data.password != md5(self.old_pwd).toUpperCase()) {
                    myself_alert.dialog_show("旧密码输入错误!");
				} else {
                    myself_alert.dialog_show("修改成功!");
                    self.showAlert = false;
                    self.old_pwd = "";
            		self.new_pwd = "";
            		self.rewrite_pwd = "";
				}
			},function(error){
                myself_alert.dialog_show("旧密码输入错误!");
            });
        };
        self.alert_cancel = function(){
            self.old_pwd = "";
            self.new_pwd = "";
            self.rewrite_pwd = "";
            self.showAlert = false;
        };
        self.is_or_no_alert = function(){
            if(typeof(self.showAlert) == 'undefined'){
                return 'relieve_guard_wrap';
            }
            if(self.showAlert){
                return 'relieve_guard_wrap fams_alert_enter';
            }else{
                return 'relieve_guard_wrap fams_alert_none';
            }
        }
    },
    templateUrl:'./template/components/revisePwdAlert.html'
});
//传输装置地图
components.component('deviceMapAlert', {
    bindings:{
        showAlert:'=',
        locaiton:'=',
        locaitonTemp:'=',
        type:"@"
    },
    controller:function(){
        var self = this;
        self.alert_true = function(){
			self.locaiton.address = angular.copy(self.locaitonTemp.address);
			self.showAlert = false;
        };
        self.alert_cancel = function(){
            self.showAlert = false;
        };
        self.is_or_no_alert = function(){
            if(typeof(self.showAlert) == 'undefined'){
                return 'device_map_alert';
            }
            if(self.showAlert){
                return 'device_map_alert fams_alert_enter';
            }else{
                return 'device_map_alert fams_alert_none';
            }
        }
    },
    templateUrl:'./template/components/deviceMapAlert.html'
});
//记录查询
components.component('recordSearchAlert', {
    bindings:{
        showAlert:'=',
        baseInfo:'=',
        recordsDetails:'=',
        baseFireInfo:'=',
        recordsCodes:'=',
        type:'=',
        outside:'=',
        inside:'=',
    },
    controller:function(){
        var self = this;
        self.device_broke = function(l){
        	if(typeof(l)!= 'undefined'){
				if(l.detectorId){
					return '探测器故障';
				}else if(l.facuId){
					return '控制器故障';
				}else if(l.relayId){
					return '传输器故障';
				}
        	}
	  	};
	    self.danger_status = function(name,mark){
	  		if(mark){
	  			return name + '-' + mark;
	  		}else{
	  			return name;
	  		}
	  	};
        self.status_format = function(process,end){
			switch(process){
				case 0:
					return '未处理';
				case 1:
					return '待确认';
				case -1:
					return '单位确认';
				case 2:
					if(self.type == 0){
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
					}else if(self.type == 1){
						return '已处理';
					}
			}
        };
        self.alert_cancel = function(){
            self.showAlert = false;
        };
        self.is_or_no_alert = function(){
            if(typeof(self.showAlert) == 'undefined'){
                return 'network_alert';
            }
            if(self.showAlert){
                return 'network_alert fams_alert_enter';
            }else{
                return 'network_alert fams_alert_none';
            }
        }
    },
    templateUrl:'./template/components/recordSearchAlert.html'
});
//联网单位弹窗
components.component('unitDetailAlert', {
    bindings:{
        showAlert:'=',
        info:'=',
        id:'=',
        selected:'=',
        unitName:'=',
        buildingsInfo:'=',
        deviceList:'='
    },
    controller:function(acceptance_http,all_dic,dic_http,$filter,$rootScope,$base64,$stateParams){
        var self = this;
        //获取区域
	  	acceptance_http.get_unit_info_areas({customerId:$base64.decode($rootScope.sys_unit)},function(result){
	  		self.net_areas = result;
	  	});
	  	//获取单位类别
	  	//self.site_type = all_dic.siteType;
	  	self.site_type = [];		
		dic_http.get_site_type({customerId:$base64.decode($stateParams.unit)},function(result){
	        for(var i=0;i<result.length;i++){
	            self.site_type.push(result[i]);   
	        }
    	});
	  	//监管等级
		self.resistance_rates = all_dic.resistanceRates;
		//耐火等级
		self.fire_rates = all_dic.fireRates;
		//通讯模式
		dic_http.get_fam_type({customerId:$base64.decode($rootScope.sys_unit),isdisable:false},function(result){
			self.communication_mdl = result;
		})
		//建筑物结构
		self.building_structure = all_dic.buildingStructure;
		//建筑物使用性质
		self.using_types = all_dic.usingTypes;
		//建筑物类别
		self.building_categorys = all_dic.buildingCategorys;
		//耐火等级
		self.fire_risks = all_dic.fireRisks;
		//防火门类型
		self.fire_door_types = all_dic.fireProofDoorTypes;
		//楼梯形式
		self.stair_forms = all_dic.stairForms;
		//控制器分类
		self.fam_facus_type = all_dic.famFacusType;
		//服务状态
		self.service_state = all_dic.serviceState;
		//获取设备类型
		dic_http.get_device_type({},function(result){
			self.device_type = result;
		});
		//获取厂商信息
		dic_http.get_manufacturer({customerId:$base64.decode($rootScope.sys_unit),isdisable:false},function(result){
			self.manufacturer = result;
		});
		//获取控制器厂商信息
		dic_http.get_manufacturer({customerId:$base64.decode($rootScope.sys_unit),isdisable:false,typeId:1},function(result){
			self.ctrl_manu = result;
		});
		acceptance_http.get_api_types({customerId:$base64.decode($rootScope.sys_unit)},function(result){
			self.api_types = result;
		});
		//电信运营商
		self.operate_company = all_dic.operateCompany;
        self.tab_list=[	
			{order:0,name:'基本信息'},
			{order:1,name:'传输装置信息'},
			{order:2,name:'建筑物信息'},
			{order:3,name:'火灾自动报警控制器信息'},
			{order:4,name:'水系统信息'},
			{order:5,name:'室外消防设施信息'},
			{order:6,name:'建筑物内消防设施信息'},
			{order:8,name:'建筑火灾自动报警平面图'},
			{order:9,name:'重点部位灭火预案'},
//			{order:10,name:'周边道路及外观'},
			{order:10,name:'外观图'},
			{order:11,name:'地理位置'}
		];
        self.show_tab=function(index){
        	self.selected = index;
        	if(self.selected == sessionStorage.current_tab){
        		return;
        	}
			sessionStorage.current_tab = angular.copy(index);
			self.currentPage = 1;
			self.get_page_data(index);
		};
		var map = new BMap.Map("unitMap");
		if($base64.decode($rootScope.sys_unit) == 'ANLITAI_2017_FAKE'){
			var point = new BMap.Point(113.269616, 23.15995);
		}else{
			var point = new BMap.Point(113.11, 23.05);
		};
	    map.centerAndZoom(point, 13);
//	    map.setCurrentCity("广州");
	    map.enableScrollWheelZoom(true);
		self.get_page_data = function(index){
			self.show_location = false;
			switch(index){
				case 1://传输装置
					acceptance_http.get_unit_info_trans({customerSiteId:self.id},function(result){
						self.info = result;
						self.totalPage = 0;
					})
				  	break;
				case 2://建筑物
					acceptance_http.get_unit_info_build({customerSiteId:self.id,pageNum:self.currentPage,pageSize:1},function(result){
						self.info = result.results;
						self.bigTotalItems = result.count;
						self.totalPage = result.totalPage;
					})
				  	break;
				case 3://控制器
					acceptance_http.get_unit_info_ctrl({customerSiteId:self.id,pageNum:self.currentPage,pageSize:1},function(result){
						self.info = result.results;
						self.bigTotalItems = result.count;
						self.totalPage = result.totalPage;
						if(typeof(self.info[0]) != 'undefined' && self.info[0].id){
							acceptance_http.get_unit_ctrl_sub({mainId:self.info[0].id},function(result){
								self.sub = result;
							});
						}else{
							self.sub = [];
						}
					})
				  	break;
				case 4://水系统
					acceptance_http.get_unit_info_water({customerSiteId:self.id,pageNum:self.currentPage,pageSize:1},function(result){
						self.info = result.results;
						self.bigTotalItems = result.count;
						self.totalPage = result.totalPage;
					})
				  	break;
				case 5://室外
					acceptance_http.get_unit_info_outdoor({customerSiteId:self.id,pageNum:self.currentPage,pageSize:1},function(result){
						self.info = result.results;
						self.bigTotalItems = result.count;
						self.totalPage = result.totalPage;
					})
				  	break;
				case 6://室内
					acceptance_http.get_unit_info_indoor({customerSiteId:self.id,pageNum:self.currentPage,pageSize:1},function(result){
						self.info = result.results;
						self.bigTotalItems = result.count;
						self.totalPage = result.totalPage;
					})
				  	break;
				case 9://灭火预案
					acceptance_http.get_plan({customerSiteId:self.id,pageNum:1,pageSize:100},function(result){
						self.info = result.results;
					})
				  	break;
				case 8://消防图纸
					//图片类型
	   				self.picture_type = all_dic.surfaceType;
	   				self.floors = [];
	   				self.floor_list=[];
	   				self.info=[];
	   				self.re_floor = {};
	   				self.isShowCell = true;
					//获取建筑物
					acceptance_http.get_unit_all_build({customerSiteId:self.id},function(result){
						self.buildings_info = result;
						if(self.buildings_info.length>0){
							self.build_id = self.buildings_info[0].id;
							self.get_cell();
						} else {
							self.isShowCell = false;
						}
					});
					//获取建筑物层数
					var start = 0;
					self.isShowFloor = false;
					self.get_cell = function(){
						if(!self.build_id){
							return;
						}
						acceptance_http.get_building_cells({'buildId':self.build_id},function(result){
							self.floors = result;
							self.floor_id = self.floors[0].id;
							for(var i in self.floors){
								var val = self.floors[i];
								if(val.buildId){
									self.isShowFloor = true;
								} 
							}	
							//初始化
							start = start + 1
							if(self.floors.length>0&&start<=1){
								self.floor_id = self.floors[0].id;
								self.get_floor();
							}
						})
					};
					//楼层
					self.get_floor = function(){
						self.floor_list = [];
						if(self.floor_id){
							acceptance_http.get_floor_cells({'placeId':self.floor_id},function(result){
								self.floor_list = result;
							});
						}

						acceptance_http.get_floor_cells({'placeId':self.floor_id},function(result){
							self.floor_list = result;
						})

		
						for(var i = self.re_floor.floorUpQuantity;i>0;i--){
							self.floor_list.push({'index':i,'name':'地上'+i+'层'})
						}
						for(var i = 1;i<=self.re_floor.floorDownQuantity;i++){
							self.floor_list.push({'index':-i,'name':'地下'+i+'层'})
						}
					};
					//显示平面图
					self.show_surface = function(floor){
						self.sur_selected = floor;
						acceptance_http.get_cells_pic({'customerSiteId':self.id,'pictureTypeIds':10,'placeId':self.floor_id,'storeyId':floor,'pageNum':1,'pageSize':1},function(result){
							self.info = result.results;
						})
					};
				  	break;
				case 10://图片
					//图片类型
	   				self.picture_type = all_dic.pictureType;
					acceptance_http.get_picture_list({customerSiteId:self.id,pageNum:self.currentPage,pageSize:100,pictureTypeIds:[0,1,2]},function(result){
						self.info = result.results;
						self.bigTotalItems = result.count;
						self.totalPage = 0;
					})
					acceptance_http.get_picture_list({customerSiteId:self.id,pageNum:1,pageSize:20,pictureTypeIds:[3,4,5,6]},function(result){
						self.roadside = result.results;
						self.east = $filter("filter")(self.roadside,{pictureType:3});
						self.west = $filter("filter")(self.roadside,{pictureType:4});
						self.sourth = $filter("filter")(self.roadside,{pictureType:5});
						self.north = $filter("filter")(self.roadside,{pictureType:6});
					});
				  	break;
				case 11://地理位置
					acceptance_http.get_unit_info_trans({customerSiteId:self.id},function(result){
						self.info = result;
						map.clearOverlays();
						angular.forEach(result, function (site, i) {
					    	if(typeof(site.address) != 'undefined'&&site.address){
					            var pt = new BMap.Point(site.address.longitude, site.address.lattitude);
						        var myIcon = new BMap.Icon("images/icon_online.png", new BMap.Size(25, 33));
						        var marker = new BMap.Marker(pt, {icon: myIcon});
						        map.addOverlay(marker);
						        map.panTo(pt);
						        
//						        map.addEventListener('zoomend', function(){    //地图更改缩放级别结束时触发触发此事件
//				                	marker.setPosition(map.getCenter());
//				          		});
					       }
					    })
					});
				  	break;
				default: //基本
					acceptance_http.get_unit_info_base({id:self.id},function(result){
						self.info = result;
						self.totalPage = 0;
					})
			}
		}
		//显示图片或标题
		self.show_pic = function(alias){
			if(self.selected != 9){
				return;
			}
			if(alias){
				for(var i=0;i<alias.length;i++){
					if(alias[i].attachmentTypeId == 0){
						return alias[i];
						break;
					}
				}
			}
		}
		self.get_location = function(){
			self.show_location = true;
			acceptance_http.get_unit_info_detect({customerSiteId:self.id,pageNum:self.currentPage,pageSize:100},function(result){
				self.info = result.results;
				self.totalPage = 0;
			})
		}
        self.selected = self.current;
        self.alert_cancel = function(){
            self.showAlert = false;
        };
        self.is_or_no_alert = function(){
            if(typeof(self.showAlert) == 'undefined'){
                return 'unit_detail_alert';
            }
            if(self.showAlert){
                return 'unit_detail_alert fams_alert_enter';
            }else{
                return 'unit_detail_alert fams_alert_none';
            }
        }
    },
    templateUrl:'./template/components/unitDetailAlert.html'
});
//发布通知
components.component('announcementAlert', {
    bindings:{
        showAlert:'=',
        getList:'&'
    },
    controller:function(superivse_http,myself_alert,http_url,$http,$scope,$base64,$rootScope){
        var self = this;
        var files = [];
        self.file_list = [];
        self.alert_true = function(){
        	if(!self.title){
        		myself_alert.dialog_show("请输入必填项!");
        		return;
        	}
        	//上传图片到七牛
        	if(self.file_list.length>0){
        		superivse_http.get_upload_token({},function(result){
					if(result.token){
						angular.forEach(self.file_list, function(data,index){
							var fd = new FormData();
							fd.append('file', data);
							fd.append('filename', data.name);
							$http({
								method:'POST',
								url:'http://up-z0.qiniu.com/?token='+result.token+'&filename='+data.name, //+'&unique_names=false'
								data: fd,
								headers: {'Content-Type':undefined},
								transformRequest: angular.identity
							}).success(function(result,status,header,config){
								files.push({"fileName": result.key,"originalName":getQueryString('filename',config.url)});
								if(files.length == self.file_list.length){
									submit_notice()
								}
							});
						});
					}
				});	
        	}else{
        		submit_notice()
        	}
        };
        
        function strlen(str){
		    var len = 0;
		    for (var i=0; i<str.length; i++) { 
		     var c = str.charCodeAt(i); 
		    //单字节加1 
		     if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) { 
		       len++; 
		     } 
		     else { 
		      len+=2; 
		     } 
		    } 
		    return len;
		}
        function submit_notice(){
        	var str_len = strlen(self.remark);
			if(str_len >= 1000){
				myself_alert.dialog_show("输入内容不可超过1000个字符,请重新输入!");
        		return;
			}
        	superivse_http.add_notice({"customerId": $base64.decode($rootScope.sys_unit),"famNoticeAttachment":files,"noticeTitle":self.title,"noticeContent":self.remark},function(result){
				myself_alert.dialog_show("添加成功!");
				self.showAlert = false;
				self.file_list = [];
				files = [];
				self.title = null;
				self.remark = null;
				self.getList();
			});
        }
        function getQueryString(name,urls){
	        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	        var param = urls.substr(1).match(reg);
	        if (param != null){
	        	return decodeURIComponent(param[2]);
	        }else{
	        	return null;
	        }
	    };
	    self.file_list = [];
        $("#notice_upload").change(function(e){
			var file = e.target.files[0];
			if(!/\.(DOC|DOCX|XLS|XLSX|PDF)$/.test((file.name).toUpperCase())){
	           myself_alert.dialog_show("文件格式必须为DOC、DOCX、XLS、XLSX、PDF");
	           return;
	       	}
			self.file_list.push(file);
			$("#notice_upload").val("");
			$scope.$apply();
		});
        self.alert_cancel = function(){
            self.showAlert = false;
            self.file_list = [];
            files = [];
        };
		self.del_file = function(index){
			self.file_list.splice(index,1);
		};
        self.is_or_no_alert = function(){
            if(typeof(self.showAlert) == 'undefined'){
                return 'notice_alert';
            }
            if(self.showAlert){
            	return 'notice_alert fams_alert_enter';
            }else{
            	return 'notice_alert fams_alert_none';
            }
        }
    },
    templateUrl:'./template/components/announcementAlert.html'
});
//查看通知
components.component('noticeDetailAlert', {
    bindings:{
        showAlert:'=',
        noticeDetail:'=',
        noticeItem:'='
    },
    controller:function(superivse_http,myself_alert,qiniu_url,$window){
        var self = this;
        self.alert_cancel = function(){
            self.showAlert = false;
            if(self.showAlert == false){
				$window.location.reload();
			}
        };
        self.download = function(name,origin){
        	window.open(qiniu_url+name+'?attname='+origin);
        }
        self.is_or_no_alert = function(){
            if(typeof(self.showAlert) == 'undefined'){
                return 'notice_alert';
            }
            if(self.showAlert){
            	return 'notice_alert fams_alert_enter'; 
            }else{
            	return 'notice_alert fams_alert_none';
            }
        }
    },
    templateUrl:'./template/components/noticeDetailAlert.html'
});
//添加图片
components.component('pictureAlert', {
    bindings:{
        showAlert:'=',
        type:'=',
        unitId:'=',
        getList:'&',
        picUrl:"=",
        titles:"=",
        types:"=",
        picId:'=',
        flag:"=",
        bulid:"=",
        floor:'=',
        place:'='
    },
    controller:function(acceptance_http,superivse_http,myself_alert,http_url,$http,$scope,http_url,$base64,$rootScope){
        var self = this;
        self.alert_true = function(){
        	if(!self.titles){
        		myself_alert.dialog_show("请输入图片名称!");
        		return;
        	}else if(!self.types){
        		myself_alert.dialog_show("请选择属性!");
        		return;
        	}else if((self.types==3||self.types==4||self.types==5||self.types==6)){
        		if(!self.bulid.roadName){
        			myself_alert.dialog_show("请输入道路名称!");
        			return;
        		}
        	}
        	var tips;
        	if(self.type == 'edit'){
        		tips = "修改成功!";
        	}else{
        		tips = "添加成功!";
        	}
			//上传图片到七牛
			if(self.flag){
				var fd = new FormData();
				fd.append('file', self.file_list);
				fd.append('filename', self.file_list.name);
				//wmf
				if(/\.(WMF)$/.test((self.file_list.name).toUpperCase())){
					$http({
						method:'POST',
						url:http_url+'upload/wmftopng',
						data: fd,
						headers: {'Content-Type':undefined,'Authorization':$base64.decode($rootScope.sys_token),'customer_id':$base64.decode($rootScope.sys_unit)},
						transformRequest: angular.identity
					}).success(function(result,status){
						acceptance_http.edit_picture_list({"customerSiteId": self.unitId,"id":self.picId,"pictureName":self.titles,"pictureType":self.types,'qiniuName':result.fileName,'roadName':self.bulid.roadName,'roadWidth':self.bulid.roadWidth,'appearanceBuilding':self.bulid.appearanceBuilding,'storeyId':self.floor,'placeId':self.place},function(result){
							myself_alert.dialog_show(tips);
							self.showAlert = false;
							self.file_list = null;
							self.getList();
							//$("#pic_upload").val("");
							$("#pic_upload")[0].value = "";
						});
					});
				}else{ //非wmf
					superivse_http.get_upload_token({},function(result){
						if(result.token){
							$http({
								method:'POST',
								url:'http://up-z0.qiniu.com/?token='+result.token+'&filename='+self.file_list.name, //+'&unique_names=false'
								data: fd,
								headers: {'Content-Type':undefined},
								transformRequest: angular.identity
							}).success(function(result,status){
								acceptance_http.edit_picture_list({"customerSiteId": self.unitId,"id":self.picId,"pictureName":self.titles,"pictureType":self.types,'qiniuName':result.key,'roadName':self.bulid.roadName,'roadWidth':self.bulid.roadWidth,'appearanceBuilding':self.bulid.appearanceBuilding,'storeyId':self.floor,'placeId':self.place},function(result){
									myself_alert.dialog_show(tips);
									self.showAlert = false;
									self.file_list = null;
									self.getList();
									//$("#pic_upload").val("");
									$("#pic_upload")[0].value = "";
								});
							});
						}
					});
				}
			}else{
				acceptance_http.edit_picture_list({"customerSiteId": self.unitId,"id":self.picId,"pictureName":self.titles,"pictureType":self.types,'qiniuName':self.picUrl,'roadName':self.bulid.roadName,'roadWidth':self.bulid.roadWidth,'appearanceBuilding':self.bulid.appearanceBuilding,'storeyId':self.floor,'placeId':self.place},function(result){
					myself_alert.dialog_show(tips);
					self.showAlert = false;
					self.file_list = null;
					self.getList();
					//$("#pic_upload").val("");
					$("#pic_upload")[0].value = "";
				});
			}
        };

		$("#pic_upload").change(function(e){			
			self.file_list = e.target.files[0];					
			if(!/\.(GIF|JPG|PNG|BMP|JPEG|WMF)$/.test((self.file_list.name).toUpperCase())){
	           myself_alert.dialog_show("图片类型必须是JPEG、JPG、GIF、PNG、BMP、WMF");
	           return;
	        }
			if(!/\.(WMF)$/.test((self.file_list.name).toUpperCase())){				
				self.picUrl=window.URL.createObjectURL(self.file_list);	
			}
			self.flag = true;				
			$scope.$apply();	

		});
    	
        
        self.alert_cancel = function(){
            self.showAlert = false;
            self.file_list = null;
            $("#pic_upload")[0].value = ""; //取消时清空input的值
        };
        self.is_or_no_alert = function(){
            if(typeof(self.showAlert) == 'undefined'){
                return 'picture_alert';
            }
            if(self.showAlert){
            	return 'picture_alert fams_alert_enter';
            }else{
            	return 'picture_alert fams_alert_none';
            }
        }
    },
    templateUrl:'./template/components/pictureAlert.html'
});
//灭火预案
components.component('planDetailAlert', {
    bindings:{
        showAlert:'=',
        unitId:'=',
        info:'=',
        addData:'=',
        showType:'='
    },
    controller:function(acceptance_http,myself_alert,qiniu_url,superivse_http, $http,$base64,$rootScope){
        var self = this;
        self.alert_cancel = function(){
        	init_data();
            self.showAlert = false;
        };
        self.download = function(name,origin){
        	window.open(qiniu_url+name+'?attname='+origin);
        };
        self.save_plan = function(){
        	if(!self.addData.extinguishingTitle){
        		myself_alert.dialog_show("请输入标题内容！");
        		return;
        	}
        	acceptance_http.edit_plan(self.addData,function(result){
        		if(self.showType == 'add'){
        			myself_alert.dialog_show("上传成功！");
	        		self.info.push(result);
        		}else if(self.showType == 'edit'){
        			myself_alert.dialog_show("保存成功！");
        		}
        		init_data();
        		self.showAlert = false;
        	});
        };
    	$("#upload_material").change(function(e){
			self.file_list = e.target.files[0];
			if(!/\.(PDF|GIF|JPG|PNG|BMP|JPEG)$/.test((self.file_list.name).toUpperCase())){
	           myself_alert.dialog_show("只能上传图片或pdf");
	           return;
	       	}
			superivse_http.get_upload_token({},function(result){
				if(result.token){
					var fd = new FormData();
					fd.append('file', self.file_list);
					fd.append('filename', self.file_list.name);
					$http({
						method:'POST',
						url:'http://up-z0.qiniu.com/?token='+result.token, //+'&unique_names=false'
						data: fd,
						headers: {'Content-Type':undefined},
						transformRequest: angular.identity
					}).success(function(result,status){
						var type;
						var add = {};
						if(/\.(GIF|JPG|PNG|BMP|JPEG)$/.test((self.file_list.name).toUpperCase())){
				           type = 0;
				       	}else if(/\.(PDF)$/.test((self.file_list.name).toUpperCase())){
				           type = 1;
				       	}
						add = {"originalName":self.file_list.name,"fileName":result.key,"attachmentTypeId":type};
						if(typeof(self.addData.famExtingtishingPlanAttachment) == "undefined"){
							self.addData.famExtingtishingPlanAttachment = [];
						}
						self.addData.famExtingtishingPlanAttachment.push(add);
						$("#upload_material").val("");
					});
				}
			});
		});
		function init_data(){
			 self.addData = {
			  "customerId": $base64.decode($rootScope.sys_unit),
			  "customerSiteId": self.unitId,
			  "extingtishingContent": "",
			  "extinguishingTitle": "",
			  "famExtingtishingPlanAttachment": []
			};
		}
       	init_data();
        self.is_or_no_alert = function(){
            if(typeof(self.showAlert) == 'undefined'){
                return 'network_alert';
            }
            if(self.showAlert){
            	return 'network_alert fams_alert_enter'; 
            }else{
            	return 'network_alert fams_alert_none';
            }
        }
    },
    templateUrl:'./template/components/planDetailAlert.html'
});
//处理中
components.component('loadingAlert', {
    bindings:{
        showAlert:'=',
        tips:'@'
    },
    controller:function(login,myself_alert){
        var self = this;
        self.alert_cancel = function(){
            self.showAlert = false;
        };
    },
    templateUrl:'./template/components/loadingAlert.html'
});
//确认删除
components.component('deleteConfirm', {
    bindings:{
        showAlert:'='
    },
    controller:function(){
        var self = this;
        self.is_or_no_alert = function(){
            if(typeof(self.showAlert) == 'undefined'){
                return 'relieve_guard_wrap';
            }
            if(self.showAlert){
            	return 'relieve_guard_wrap fams_alert_enter';
            }else{
            	return 'relieve_guard_wrap fams_alert_none';
            }
        }
    },
    templateUrl:'./template/components/deleteConfirm.html'
});
//确认添加
components.component('addConfirm', {
    bindings:{
        showAlert:'='
    },
    controller:function(){
        var self = this;
        self.is_or_no_alert = function(){
            if(typeof(self.showAlert) == 'undefined'){
                return 'relieve_guard_wrap';
            }
            if(self.showAlert){
            	return 'relieve_guard_wrap fams_alert_enter';
            }else{
            	return 'relieve_guard_wrap fams_alert_none';
            }
        }
    },
    templateUrl:'./template/components/addConfirm.html'
});
//确认火警
components.component('fireConfirm', {
    bindings:{
        showAlert:'='
    },
    controller:function(){
        var self = this;
        self.is_or_no_alert = function(){
            if(typeof(self.showAlert) == 'undefined'){
                return 'relieve_guard_wrap';
            }
            if(self.showAlert){
            	return 'relieve_guard_wrap fams_alert_enter';
            }else{
            	return 'relieve_guard_wrap fams_alert_none';
            }
        }
    },
    templateUrl:'./template/components/fireConfirm.html'
});
//确认火警上传119
components.component('reportFireConfirm', {
    bindings:{
        showAlert:'='
    },
    controller:function(){
        var self = this;
        self.is_or_no_alert = function(){
            if(typeof(self.showAlert) == 'undefined'){
                return 'relieve_guard_wrap';
            }
            if(self.showAlert){
            	return 'relieve_guard_wrap fams_alert_enter';
            }else{
            	return 'relieve_guard_wrap fams_alert_none';
            }
        }
    },
    templateUrl:'./template/components/reportFireConfirm.html'
});
//记录搜索无记录
components.component('recordZeroAlert', {
    bindings:{
        showAlert:'='
    },
    controller:function(){
        var self = this;
        self.is_or_no_alert = function(){
            if(typeof(self.showAlert) == 'undefined'){
                return 'relieve_guard_wrap';
            }
            if(self.showAlert){
            	return 'relieve_guard_wrap fams_alert_enter';
            }else{
            	return 'relieve_guard_wrap fams_alert_none';
            }
        }
    },
    templateUrl:'./template/components/recordZeroAlert.html'
});
//新增楼栋
components.component('buildingAlert', {
    bindings:{
        showAlert:'=',
        buildId:'=',
        getCell:'&',
        item:'=',
        type:'=',
    },
    controller:function(acceptance_http,myself_alert,exp_tool){
        var self = this;
        self.alert_cancel = function(){
            self.showAlert = false;
        };
        self.alert_true = function(){
        	if(!self.item.placeName){
        		myself_alert.dialog_show("请输入楼栋名称!");
        		return;
        	}if((self.item.floorDownQuantity&&!exp_tool.more_than_zero_int(self.item.floorDownQuantity))||(self.item.floorUpQuantity&&!exp_tool.more_than_zero_int(self.item.floorUpQuantity))){
        		myself_alert.dialog_show("楼栋层数必须为整数!");
        		return;
        	}  
        	for(var i=0;i<self.item.floors.length;i++){
        		if(self.item.id != self.item.floors[i].id){
        			if(self.item.placeName == self.item.floors[i].placeName){
	        			myself_alert.dialog_show("楼栋名称重复,请重新输入!");
	        			return;
	        		}
        		}
        		
        	}
    		acceptance_http.modify_building_cells({"buildId": self.buildId,"canUpdate": true,"floorDownQuantity": self.item.floorDownQuantity,"floorUpQuantity": self.item.floorUpQuantity,"placeName": self.item.placeName},function(result){
        		myself_alert.dialog_show("保存成功!");
        		self.getCell();
        		self.showAlert = false;
        	})   
        };
        self.is_or_no_alert = function(){
            if(typeof(self.showAlert) == 'undefined'){
                return 'relieve_guard_wrap';
            }
            if(self.showAlert){
            	return 'relieve_guard_wrap fams_alert_enter';
            }else{
            	return 'relieve_guard_wrap fams_alert_none';
            }
        }
    },
    templateUrl:'./template/components/buildingAlert.html'
});
//编辑楼栋
components.component('buildEditAlert', {
    bindings:{
        showAlert:'=',
        buildId:'=',
        getCell:'&',
        item:'=',
        type:'=',
    },
    controller:function(acceptance_http,myself_alert,exp_tool,$rootScope){
        var self = this;
        self.alert_cancel = function(){
            self.showAlert = false;
        };
        $rootScope.$on('bulidName',function(e,data){
        	self.bulidName = data;
        });
        self.alert_true = function(){
        	if(!self.bulidName){
        		myself_alert.dialog_show("请输入楼栋名称!");
        		return;
        	}    
        	for(var i=0;i<self.item.floors.length;i++){
        		if(self.item.id != self.item.floors[i].id){
        			if(self.bulidName == self.item.floors[i].placeName){
	        			myself_alert.dialog_show("楼层名称重复,请重新输入!");
	        			return;
	        		}
        		}
        		
        	}
    		acceptance_http.modify_building_cells({"id":self.item.id,"buildId": self.buildId,"canUpdate": true,"floorDownQuantity": self.item.floorDownQuantity,"floorUpQuantity": self.item.floorUpQuantity,"placeName": self.bulidName},function(result){
        		myself_alert.dialog_show("保存成功!");
        		self.getCell();
        		self.showAlert = false;
        	})   
        };
        self.is_or_no_alert = function(){
            if(typeof(self.showAlert) == 'undefined'){
                return 'relieve_guard_wrap';
            }
            if(self.showAlert){
            	return 'relieve_guard_wrap fams_alert_enter';
            }else{
            	return 'relieve_guard_wrap fams_alert_none';
            }
        }
    },
    templateUrl:'./template/components/buildEditAlert.html'
});
//编辑楼层
components.component('floorAlert', {
    bindings:{
        showAlert:'=',
        storeyNum:'=',
        floorId:'=',
        item:'=',
        type:'=',   
        getFloor:'&',
    },
    controller:function(acceptance_http,myself_alert,exp_tool,$rootScope){
        var self = this;
        self.alert_cancel = function(){
            self.showAlert = false;
        };
        $rootScope.$on('tranName',function(e,data){
        	self.name = data;
        });
        
        self.alert_true = function(){
        	if(!self.name){
        		myself_alert.dialog_show("请输入楼层名称!");
        		return;
        	}
        	for(var i=0;i<self.item.floor_lists.length;i++){
        		if(self.item.id != self.item.floor_lists[i].id){
        			if(self.name == self.item.floor_lists[i].storeyName){
	        			myself_alert.dialog_show("楼层名称重复,请重新输入!");
	        			return;
	        		}
        		}
        		
        	}
        	acceptance_http.modfiy_floor_cells({"id":self.item.id,"placeId": self.floorId, "storeyName":self.name,"storey":self.item.storeyNum,},function(result){
            	myself_alert.dialog_show("保存成功!");
            	self.getFloor();
            	self.showAlert = false;
            })
        };
        self.is_or_no_alert = function(){
            if(typeof(self.showAlert) == 'undefined'){
                return 'relieve_guard_wrap';
            }
            if(self.showAlert){
            		return 'relieve_guard_wrap fams_alert_enter';
            }else{
            		return 'relieve_guard_wrap fams_alert_none';
            }
        }
    },
    templateUrl:'./template/components/floorAlert.html'
});
//新建夹层确认
components.component('childAlert', {
    bindings:{
        showAlert:'=',
        storeyNum:'=',
        floorId:'=',
        item:'=',
        type:'=',   
        getFloor:'&',
    },
    controller:function(acceptance_http,myself_alert,exp_tool){
        var self = this;
        self.alert_cancel = function(){
            self.showAlert = false;
        };
        self.alert_true = function(){
        	if(!self.item.placeName){
        		myself_alert.dialog_show("请输入楼层名称!");
        		return;
        	}
        	acceptance_http.modfiy_floor_cells({"placeId": self.floorId, "storeyName":self.item.placeName,"storey":self.item.storeyNum,},function(result){
            	myself_alert.dialog_show("保存成功!");
            	self.getFloor();
            	self.showAlert = false;
            })
        };
        self.is_or_no_alert = function(){
            if(typeof(self.showAlert) == 'undefined'){
                return 'relieve_guard_wrap';
            }
            if(self.showAlert){
            		return 'relieve_guard_wrap fams_alert_enter';
            }else{
            		return 'relieve_guard_wrap fams_alert_none';
            }
        }
    },
    templateUrl:'./template/components/childAlert.html'
});
//火灾下拉详情
components.component('fireDropAlert', {
    bindings:{
        showAlert:'=',
        fireDetails:'=',
        outside:'=',
        surface:'=',
        famCustomerSite:'=',
    },
    controller:function(){
        var self = this;
        self.is_or_no_alert = function(){
            if(typeof(self.showAlert) == 'undefined'){
                return 'fire_alert_info';
            }
            if(self.showAlert){
            	return 'fire_alert_info fams_alert_enter';
            }else{
            	return 'fire_alert_info fams_alert_none';
            }
        }
        self.alert_cancel = function(){
            self.showAlert = false;
        };
    },
    templateUrl:'./template/components/fireDropAlert.html'
});