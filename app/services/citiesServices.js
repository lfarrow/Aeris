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