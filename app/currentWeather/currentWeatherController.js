(function(){
  "use strict";

	angular.module('weatherApp.Controllers')
	.controller('currentWeatherController', currentWeatherController);
		function currentWeatherController(loadingServices, $http, $scope, $stateParams, getWeatherServices, dateTimeServices, weatherFontCodeServices){
			var currentWeatherVm = this;

			currentWeatherVm.current = {};
			loadingServices.setLoading(true);

			getWeatherServices.getCurrentWeather($stateParams.locationId).then(function(weather) {
              	console.warn(weather.data);
              	currentWeatherVm.current = weather.data;

              	//Replace unix date time format, with readable format
              	currentWeatherVm.current.dt = dateTimeServices.convertFromUnix(currentWeatherVm.current.dt);
              	currentWeatherVm.current.timeUpdated = dateTimeServices.getHoursMinutes(currentWeatherVm.current.dt);
              	currentWeatherVm.current.sunrise = dateTimeServices.getHours(dateTimeServices.convertFromUnix(currentWeatherVm.current.sys.sunrise));
              	currentWeatherVm.current.sunset = dateTimeServices.getHours(dateTimeServices.convertFromUnix(currentWeatherVm.current.sys.sunset));

              	
              	weatherFontCodeServices.getFontCharacter(currentWeatherVm.current.weather[0].id, dateTimeServices.getHours(currentWeatherVm.current.dt), currentWeatherVm.current.sunrise, currentWeatherVm.current.sunset).then(function(response){
              		currentWeatherVm.current.icon = response;
              		currentWeatherVm.current.main.temp = Math.round(currentWeatherVm.current.main.temp);
              		currentWeatherVm.current.tempColour = weatherFontCodeServices.getTemperatureColour(currentWeatherVm.current.main.temp).then(function(response){
              			currentWeatherVm.current.tempColour = response;
              		});
					loadingServices.setLoading(false);
              	});
            });


		}

})();