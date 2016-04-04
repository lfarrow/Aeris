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