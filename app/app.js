(function() {
    'use strict';

    angular.module('weatherApp.Controllers', ['weatherApp.Services']);
    angular.module('weatherApp.Services', []);
    angular.module('weatherApp.Directives', []);

    angular.module('weatherApp', [
        'ui.router',
        'ngCookies',
        'weatherApp.Controllers',
        'weatherApp.Services',
        'weatherApp.Directives'
    ]);

    angular.module('weatherApp')
        .constant('app_constants', {
            "dev_key": "88c6d825c16530a9ea7651866c2625ae",
            "api_url": "http://api.openweathermap.org/data/2.5/"
        })
        .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
            $urlRouterProvider.rule(function($injector, $location) {
                var path = $location.path();
                var hasTrailingSlash = path[path.length-1] === '/';

                if(hasTrailingSlash) {
                  //if last charcter is a slash, return the same url without the slash  
                  var newPath = path.substr(0, path.length - 1); 
                  return newPath; 
                } 
            });
            $urlRouterProvider.otherwise('root');

            $stateProvider
                .state('root', {
                    url: '',
                    title: 'Home',
                    templateUrl: 'app/home/home.html',
                    controller: 'homeController as homeCtrlVm',
                    data: {
                       bodyClass: 'home'
                   }
                })
                .state('home', {
                    url: '/',
                    title: 'Home',
                    templateUrl: 'app/home/home.html',
                    controller: 'homeController as homeCtrlVm',
                    data: {
                       bodyClass: 'home'
                   }
                })
                .state('location', {
                    url: '/location',
                    title: 'Select your location',
                    templateUrl: 'app/location/location.html',
                    controller: 'locationController as locationVm',
                    data: {
                       bodyClass: 'location'
                   }
                })
                .state('currentWeather', {
                    url: '/location/:locationId',
                    title: 'Current Weather',
                    templateUrl: 'app/currentWeather/currentWeather.html',
                    controller: 'currentWeatherController as currentWeatherVm',
                    data: {
                       bodyClass: 'currentWeather'
                   }
                })
                .state('otherwise', {
                    url: '*path',
                    templateUrl: 'app/home/home.html',
                    title: 'Page Not Found',
                    controller: 'homeController as mainCtrlVm',
                    data: {
                       bodyClass: 'home'
                   }
                });
        })
    .controller('appController', appController);

    function appController($scope, $rootScope, loadingServices, dateTimeServices, getWeatherServices, $state, $http) {
        var appVm = this;
        appVm.loading = true;
        appVm.title = '';
        appVm.bodyClass = '';
        appVm.dayNight = '';

        $scope.$watch(function() {
          return loadingServices.loading;
        }, function(newValue, oldValue) {
              appVm.loading = newValue;
        }, true);

        $scope.$on('$stateChangeStart', function(event) {
          loadingServices.setLoading(true);
        });

        $scope.$on('$stateChangeSuccess', function(event) {
          loadingServices.setLoading(false);
          appVm.title = $state.current.title;
          appVm.bodyClass = $state.current.data.bodyClass;
        });

        function checkDayNight() {
            getWeatherServices.getCurrentWeather(2642214).then(function(weather) {
                weather = weather.data;
                weather.dt = Number(dateTimeServices.getHours(dateTimeServices.convertFromUnix(weather.dt)));
                weather.sunrise = Number(dateTimeServices.getHours(dateTimeServices.convertFromUnix(weather.sys.sunrise)));
                weather.sunset = Number(dateTimeServices.getHours(dateTimeServices.convertFromUnix(weather.sys.sunset)));
                appVm.dayNight = dateTimeServices.dayOrNight(weather.dt, weather.sunrise, weather.sunset);                
            });
        }     
        checkDayNight();
        setInterval(checkDayNight, 60000);
    };

})();