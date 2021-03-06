'use strict';

angular.module('common.patient')
    .factory('patientAttributeService', ['$http', function ($http) {

    var urlMap;

    var init = function(){
        urlMap = {
            "personName" : Bahmni.Common.Constants.bahmniSearchUrl + "/personname",
            "personAttribute" : Bahmni.Common.Constants.bahmniSearchUrl + "/personattribute"
        }
    };
    init();

    var search = function(fieldName, query, type){
        var url = urlMap[type];
        var queryWithoutTrailingSpaces = query.trimLeft();

        return $http.get(url, {
            method: "GET",
            params: {q: queryWithoutTrailingSpaces, key: fieldName },
            withCredentials: true
        });
    };

    return{
        search : search
    };
}]);
