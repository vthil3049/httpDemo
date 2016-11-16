'use strict';

angular.module('starter.services',  ['ngResource'])
.constant("baseURL","http://192.168.2.153:3000/")
.service('gpsFactory', ['$resource', 'baseURL', function($resource,baseURL) {

    //console.log($resource(baseURL+"sysGpsData"));
    return $resource(baseURL+"sysGpsData",{} , {'get':{method:'GET', isArray:false}});
    // return $resource(baseURL+"sysGpsData", {}, {
    //       getGPS: {method:'GET', params:{} }
    // });
}]);