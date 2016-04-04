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