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
(function(){
  "use strict";

	angular.module('weatherApp.Controllers')
	.controller('currentWeatherController', currentWeatherController);
		function currentWeatherController(loadingServices, $http, $scope, $stateParams, getWeatherServices, dateTimeServices, weatherFontCodeServices){
			var currentWeatherVm = this;

			currentWeatherVm.weather = {};
			loadingServices.setLoading(true);

			getWeatherServices.getCurrentWeather($stateParams.locationId)
				.then(function(weather) {
	              	console.warn(weather);
	              	currentWeatherVm.weather = weather.data;

	              	//Replace unix date time format, with readable format
	              	currentWeatherVm.weather.dt = dateTimeServices.convertFromUnix(currentWeatherVm.weather.dt);
	              	currentWeatherVm.weather.timeUpdated = dateTimeServices.getHoursMinutes(currentWeatherVm.weather.dt);
	              	currentWeatherVm.weather.sunrise = dateTimeServices.getHours(dateTimeServices.convertFromUnix(currentWeatherVm.weather.sys.sunrise));
	              	currentWeatherVm.weather.sunset = dateTimeServices.getHours(dateTimeServices.convertFromUnix(currentWeatherVm.weather.sys.sunset));
	              	
	              	weatherFontCodeServices.getFontCharacter(currentWeatherVm.weather.weather[0].id, dateTimeServices.getHours(currentWeatherVm.weather.dt), currentWeatherVm.weather.sunrise, currentWeatherVm.weather.sunset).then(function(response){
						loadingServices.setLoading(false);
	              		currentWeatherVm.weather.icon = response;
	              		console.log(currentWeatherVm.weather.icon);
	              		console.log(dateTimeServices.getDayString(currentWeatherVm.weather.dt));
	              	});
	            });
		}

})();
(function(){
  "use strict";

	angular.module('weatherApp.Controllers')
	.controller('homeController', homeController);
		function homeController(loadingServices){
			// var homeVm = this;

		}

})();
(function(){
  "use strict";

	angular.module('weatherApp.Controllers')
	.controller('locationController', locationController);
		function locationController(loadingServices, $http, $scope, citiesServices){
			var locationVm = this;
			locationVm.cities = [];

			loadingServices.setLoading(true);

			citiesServices.getCities().then(function(response){
				loadingServices.setLoading(false);
				locationVm.cities = response.data;
			});
		}

})();
angular.module('weatherApp.Services')
.factory('citiesServices', citiesServices);
	function citiesServices($http, $q, loadingServices){
        var cities = [];

        function getCities() {
        	var def = $q.defer();
        	if(cities.length == 0) {
        		def.resolve($http.get('assets/json/cities.json'));
        	}
        	else {
				def.resolve(cities);
        	}        	
			return def.promise;
        }

        return {
		    getCities: getCities
		}
};
angular.module('weatherApp.Services')
.factory('dateTimeServices', dateTimeServices);
	function dateTimeServices() {
        function addLeadingZero(value) {
            value < 10 ? value = '0' + value : value;
            return value;
        }

        function convertFromUnix(date) {
            return (new Date(date * 1000));
        }

        function getHours(date) {
            var hours;
            hours = date.getHours();
            hours = addLeadingZero(hours);
            return hours;
        }

         function getMinutes(date) {
            var minutes;
            minutes = date.getMinutes();
            minutes = addLeadingZero(minutes);
            return minutes;
        }

        function getHoursMinutes(date) {
            return getHours(date) + ':' + getMinutes(date);
        }

        function dayOrNight(time, sunrise, sunset) {
            if(time < sunset && time > sunrise) {
              return 'day';
            }
            else {
                return 'night';
            }
        }

        function getDayString(date) {
            var week= {
                "0": {
                    "short":"Sun",
                    "long":"Sunday"
                },
                "1": {
                    "short":"Mon",
                    "long":"Monday"
                },
                "2": {
                    "short":"Tue",
                    "long":"Tuesday"
                },
                "3": {
                    "short":"Wed",
                    "long":"Wednesday"
                },
                "4": {
                    "short":"Thur",
                    "long":"Thursday"
                },
                "5": {
                    "short":"Fri",
                    "long":"Friday"
                },
                "6": {
                    "short":"Sat",
                    "long":"Saturday"
                },
            }
            return week[date.getDay()];
        }

        return {
            getHoursMinutes: getHoursMinutes,
            convertFromUnix : convertFromUnix,
            getHours : getHours,
            getMinutes : getMinutes,
            dayOrNight : dayOrNight,
            getDayString : getDayString
        }        
    }
angular.module('weatherApp.Services')
.factory('getWeatherServices', getWeatherServices);
	function getWeatherServices($http, $q, app_constants){
        var cities = [];
        var lastRequest = 0;

        function getCurrentTime() {
            return (new Date()).getTime();
        }

        function makeRequest(url) {
            var newUrl = app_constants.api_url + url + '&units=metric' + '&APPID=' + app_constants.dev_key;
            var currentTime = getCurrentTime();
            var def = $q.defer();

            //Prevent requests being sent too quickly
            if (currentTime - 500 > lastRequest) {
                def.resolve($http.get(newUrl));
            }
            else {
                setTimeout(function(){
                    def.resolve($http.get(newUrl));
                }, 100);
            }
            lastRequest = getCurrentTime(); 
            return def.promise;
        }       

        function getCurrentWeather(locationId) {
			var url = 'weather?id=' + locationId ;
            return makeRequest(url);
        }

        function getForecast(locationId) {
            var url = 'forecast?id=' + locationId;
            return makeRequest(url);
        }

        return {
		    getCurrentWeather: getCurrentWeather
		}
};
angular.module('weatherApp.Services')
.factory('loadingServices', loadingServices);
	function loadingServices($http, $q){
        this.loading = false;
        return{
            setLoading: function(isLoading){
                this.loading = isLoading;
                return this.loading;
            }
        };        
    }
angular.module('weatherApp.Services')
.factory('weatherFontCodeServices', weatherFontCodeServices);
	function weatherFontCodeServices($http, $q, dateTimeServices) {
		var weatherConditions = {};

		function isEmpty(obj) {
		    for(var prop in obj) {
		        if(obj.hasOwnProperty(prop))
		            return false;
		    }
		    return true;
		}

        function getFontCharacter(id, time, sunrise, sunset) {
          time = Number(time);
          sunrise = Number(sunrise);
          sunset = Number(sunset);
          
          var dayNight = dateTimeServices.dayOrNight(time, sunrise, sunset);
         
          var def = $q.defer();
          if(isEmpty(weatherConditions)) {
              $http.get('assets/json/weatherConditions.json').then(function(response){
					weatherConditions = response.data;
					def.resolve(
						{
							"icon" : weatherConditions[id][dayNight],
							"label" : weatherConditions[id].label
						}
					);
               });
          }
          else {
              def.resolve(
	              	{
						"icon" : weatherConditions[id][dayNight],
						"label" : weatherConditions[id].label
					}
				);
          }

          return def.promise;            
      }

        return {
            getFontCharacter: getFontCharacter
        }        
    }