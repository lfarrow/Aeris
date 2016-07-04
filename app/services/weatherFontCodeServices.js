angular.module('weatherApp.Services')
.factory('weatherFontCodeServices', weatherFontCodeServices);
	function weatherFontCodeServices($http, $q, dateTimeServices) {
		var weatherConditions = {};
		var temperatureColours = {};

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

      function getTemperatureColour(temperature) {
      	temperature = Math.round(temperature);

      	var def = $q.defer();
		if(isEmpty(temperatureColours)) {
		  $http.get('assets/json/temperatureColours.json').then(function(response){
				temperatureColours = response.data;
				def.resolve(temperatureColours[temperature]);
		   });
		}
		else {
		  def.resolve(temperatureColours[temperature]);
		}
		return def.promise;
    }

        return {
            getFontCharacter: getFontCharacter,
            getTemperatureColour : getTemperatureColour
        }        
    }