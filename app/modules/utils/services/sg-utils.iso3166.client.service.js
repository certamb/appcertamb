'use strict';

angular.module('utils').provider('sgIso3166', function() {

    this.restUrl = 'http://localhost';

    this.$get = function() {
        var restUrl = this.restUrl;
        return {
            getRestUrl: function() {
                return restUrl;
            }
        };
    };

    this.setRestUrl = function(restUrl) {
        this.restUrl = restUrl;
    };
});

angular.module('utils').factory('Iso3166Restangular', ['Restangular', 'sgIso3166', function(Restangular, sgIso3166) {
    return Restangular.withConfig(function(RestangularConfigurer) {
        RestangularConfigurer.setBaseUrl(sgIso3166.getRestUrl());
    });
}]);


var RestObject = function (path, restangular, extendMethods) {
    var modelMethods = {

        /**
         * Retorna url*/
        $getModelMethods: function () {
            return modelMethods;
        },

        /**
         * Retorna url*/
        $getBasePath: function () {
            return path;
        },
        /**
         * Retorna la url completa del objeto*/
        $getAbsoluteUrl: function () {
            return restangular.one(path, this.id).getRestangularUrl();
        },
        /**
         * Concatena la url de subresource con la url base y la retorna*/
        $concatSubResourcePath: function (subResourcePath) {
            return this.$getBasePath() + '/' + this.id + '/' + subResourcePath;
        },


        $new: function (id) {
            return angular.extend({id: id}, modelMethods);
        },
        $build: function () {
            return angular.extend({id: undefined}, modelMethods, {
                $save: function () {
                    return restangular.all(path).post(this);
                }
            });
        },

        $search: function (queryParams) {
            return restangular.one(path).all('search').post(queryParams);
        },
        $getAll: function (queryParams) {
            return restangular.all(path).getList(queryParams);
        },

        $find: function (id) {
            return restangular.one(path, id).get();
        },
        $save: function () {
            return restangular.one(path, this.id).customPUT(restangular.copy(this), '', {}, {});
        },
        $saveSent: function (obj) {
            return restangular.all(path).post(obj);
        },

        $enable: function () {
            return restangular.one(path, this.id).all('enable').post();
        },
        $disable: function () {
            return restangular.one(path, this.id).all('disable').post();
        },
        $remove: function () {
            return restangular.one(path, this.id).remove();
        }
    };

    modelMethods = angular.extend(modelMethods, extendMethods);

    function extendObject(obj, modelMethods){
        angular.extend(obj, modelMethods);
    }

    function extendArray(obj, modelMethods){
        angular.forEach(obj, function (row) {
            if (angular.isObject(row)) {
                if (!angular.isArray(row)) {
                    extendObject(row, modelMethods);
                }
            }
        });
    }

    function automaticExtend(obj, modelMethods){
        if (angular.isDefined(obj)) {
            if (angular.isObject(obj)) {
                if (angular.isArray(obj)) {
                    extendArray(obj, modelMethods);
                } else {
                    if (angular.isDefined(obj.items) && angular.isArray(obj.items)) {
                        extendArray(obj.items, modelMethods);
                    } else {
                        extendObject(obj, modelMethods);
                    }
                }
            }
        }
    }

    restangular.extendModel(path, function (obj) {
        automaticExtend(obj, modelMethods);
        return obj;
    });

    restangular.extendCollection(path, function (collection) {
        automaticExtend(collection, modelMethods);
        return collection;
    });

    return modelMethods;
};

angular.module('utils').factory('SGCountryCode', ['Iso3166Restangular',  function(Iso3166Restangular) {
    var countryCodeResource = new RestObject('countryCodes', Iso3166Restangular);
    return countryCodeResource;
}]);


angular.module('utils').factory('SGCountryName', ['Iso3166Restangular',function(Iso3166Restangular) {
    var countryNameResource = new RestObject('countryNames', Iso3166Restangular);
    return countryNameResource;
}]);


angular.module('utils').factory('SGLanguage', ['Iso3166Restangular',function(Iso3166Restangular) {
    var countryLanguagesResource = new RestObject('countryLanguages', Iso3166Restangular);
    return countryLanguagesResource;
}]);


angular.module('utils').factory('SGSubdivisionCategory', ['Iso3166Restangular', function(Iso3166Restangular) {
    var subdivisionCategoriesResource = new RestObject('subdivisionCategories', Iso3166Restangular);
    return subdivisionCategoriesResource;
}]);


angular.module('utils').factory('SGTerritory', ['Iso3166Restangular',function(Iso3166Restangular) {
    var territorieResource = new RestObject('territories', Iso3166Restangular);
    return territorieResource;
}]);
