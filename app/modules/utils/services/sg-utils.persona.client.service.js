'use strict';

angular.module('utils').provider('sgPersona', function () {

    this.restUrl = 'http://localhost';

    this.$get = function () {
        var restUrl = this.restUrl;
        return {
            getRestUrl: function () {
                return restUrl;
            }
        };
    };

    this.setRestUrl = function (restUrl) {
        this.restUrl = restUrl;
    };
});



angular.module('utils').factory('PersonaRestangular', ['Restangular', 'sgPersona', function(Restangular, sgPersona) {
    return Restangular.withConfig(function(RestangularConfigurer) {
        RestangularConfigurer.setBaseUrl(sgPersona.getRestUrl());
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

angular.module('utils').factory('SGEstadoCivil', ['PersonaRestangular', function (PersonaRestangular) {
    var estadosCivilesResource = new RestObject('estadosCiviles', PersonaRestangular);
    return estadosCivilesResource;
}]);

angular.module('utils').factory('SGSexo', ['PersonaRestangular', function (PersonaRestangular) {
    var sexosResource = new RestObject('sexos', PersonaRestangular);
    return sexosResource;
}]);

angular.module('utils').factory('SGTipoEmpresa', ['PersonaRestangular', function (PersonaRestangular) {
    var sexosResource = new RestObject('tiposEmpresa', PersonaRestangular);
    return sexosResource;
}]);

angular.module('utils').factory('SGTipoPersona', ['PersonaRestangular', function (PersonaRestangular) {
    var tiposPersonaResource = new RestObject('tiposPersona', PersonaRestangular);
    return tiposPersonaResource;
}]);

angular.module('utils').factory('SGTipoDocumento', ['PersonaRestangular', function (PersonaRestangular) {
    var extendMethod = {
        $new: function (abreviatura) {
            return angular.extend({abreviatura: abreviatura}, this.$getModelMethods());
        },
        $build: function () {
            return angular.extend({abreviatura: undefined}, this.$getModelMethods(), {
                $save: function () {
                    return PersonaRestangular.all(this.$getBasePath()).post(this);
                }
            });
        },
        $save: function () {
            return PersonaRestangular.one(this.$getBasePath(), this.abreviatura).customPUT(PersonaRestangular.copy(this), '', {}, {});
        },
        $enable: function () {
            return PersonaRestangular.one(this.$getBasePath(), this.abreviatura).all('enable').post();
        },
        $disable: function () {
            return PersonaRestangular.one(this.$getBasePath(), this.abreviatura).all('disable').post();
        },
        $remove: function () {
            return PersonaRestangular.one(this.$getBasePath(), this.abreviatura).remove();
        }
    };

    var tiposDocumentoResource = new RestObject('tipoDocumentos', PersonaRestangular, extendMethod);
    return tiposDocumentoResource;
}]);

angular.module('utils').factory('SGPersonaNatural', ['PersonaRestangular', 'Upload', function (PersonaRestangular, Upload) {

    var extendMethod = {
        $setFoto: function (file) {
            var urlFile = PersonaRestangular.one(this.$getBasePath(), this.id).all('foto').getRestangularUrl();
            return Upload.upload({
                url: urlFile,
                file: file
            });
        },
        $setFirma: function (file) {
            var urlFile = PersonaRestangular.one(this.$getBasePath(), this.id).all('firma').getRestangularUrl();
            return Upload.upload({
                url: urlFile,
                file: file
            });
        }
    };

    var personaNaturalResource = new RestObject('personas/naturales', PersonaRestangular, extendMethod);

    return personaNaturalResource;
}]);

angular.module('utils').factory('SGPersonaJuridica', ['PersonaRestangular', 'Upload', function (PersonaRestangular) {

    var extendMethod = {};

    var personaJuridicaResource = new RestObject('personas/juridicas', PersonaRestangular, extendMethod);

    /**
     * Accionistas*
     * */
    personaJuridicaResource.SGAccionista = function () {
        var extendMethod = {};

        var accionistaSubResource = new RestObject(this.$concatSubResourcePath('accionistas'), PersonaRestangular, extendMethod);

        return accionistaSubResource;
    };

    return personaJuridicaResource;
}]);
