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