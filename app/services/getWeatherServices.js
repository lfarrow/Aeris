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