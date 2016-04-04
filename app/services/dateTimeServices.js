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