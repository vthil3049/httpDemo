// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

angular.module('starter', ['ionic', 'starter.services', 'ngCordova', 'ngResource'])
.run(function($ionicPlatform,  $rootScope, $timeout, $ionicLoading,  $cordovaSplashscreen) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    $timeout(function(){
      $cordovaSplashscreen.hide();
    },5000);

  });
})
.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state('map', {
    url: '/',
    templateUrl: 'templates/map.html',
    controller: 'MapCtrl',
    resolve: {
     sysGpsData:  ['gpsFactory', function(gpsFactory){
       //console.log(gpsFactory.get());
       return gpsFactory.get();
     }]
   }
  });

  $urlRouterProvider.otherwise("/");

})
.controller('MapCtrl', ['$scope', '$timeout', '$ionicLoading', 'sysGpsData', function($scope, $timeout, $ionicLoading, sysGpsData){

    // $scope.latitude = 42.234234;
    // $scope.longitude = -71.21233;
    // Setup the loader
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });

    $timeout(function () {
        $ionicLoading.hide();
        $scope.stooges = [{name: 'Moe'}, {name: 'Larry'}, {name: 'Curly'}];
      }, 10);

    $scope.showMap = true;
    //console.log(sysGpsData);
    //  gpsFactory.get().$promise.then(
    //     function(response){
    //       $scope.sysGpsData = response;

        sysGpsData.$promise.then(
        function (response) {
            $scope.sysGpsData = sysGpsData.toJSON();
            //console.log('Final GPS Data=',sysGpsData);
            $scope.showMap = true;

            $scope.latitude = sysGpsData.latitude;
            $scope.longitude = sysGpsData.longitude;
            $scope.showMap = true;

            var latLng = new google.maps.LatLng($scope.latitude, $scope.longitude);
          // var latLng = new google.maps.LatLng($scope.sysGpsData.latitude, $scope.sysGpsData.longitude);

            var mapOptions = {
              center: latLng,
              zoom: 12,
              mapTypeId: google.maps.MapTypeId.ROADMAP,
              disableDefaultUI: true
            };


            $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
            //new
            google.maps.event.addListenerOnce($scope.map, 'idle', function(){

              var marker = new google.maps.Marker({
                  map: $scope.map,
                  animation: google.maps.Animation.DROP,
                  position: latLng,
                  title: 'You are here'
              });
              var infoWindow = new google.maps.InfoWindow({
                  content: "CWS is here!"
              });

              google.maps.event.addListener(marker, 'click', function () {
                  infoWindow.open($scope.map, marker);
              });

              google.maps.event.addDomListener(window, "resize", function() {
               var center = $scope.map.getCenter();
               google.maps.event.trigger($scope.map, "resize");
               $scope.map.setCenter(center);
             });

            });


        }
        ,
        function (response) {
            $scope.showMap = false;
            $scope.message = "Error: " + response.status + " " + response.statusText;
            console.log($scope.message);
        }
      );



}]);