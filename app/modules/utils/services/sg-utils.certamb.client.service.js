'use strict';

angular.module('utils').provider('sgCertamb', function() {

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


angular.module('utils').factory('CertambRestangular', ['Restangular', 'sgCertamb', function(Restangular, sgCertamb) {
    return Restangular.withConfig(function(RestangularConfigurer) {
        RestangularConfigurer.setBaseUrl(sgCertamb.getRestUrl());
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

angular.module('utils').factory('SGDireccionRegional', ['CertambRestangular',  function(CertambRestangular) {

    var extendMethod = {
        /*$getCuentaAporte: function () {
            return CertambRestangular.one(this.$getBasePath(), this.id).customGET('cuentaAporte', {});
        }*/
    };

    var direccionRegionalResource = new RestObject('direccionesRegionales', CertambRestangular, extendMethod);

    /**
     * Cuentas personales*
     * */
    direccionRegionalResource.SGProyecto = function () {
        var extendMethod = {};

        var proyectoSubResource = new RestObject(this.$concatSubResourcePath('proyectos'), CertambRestangular, extendMethod);
        proyectoSubResource.SGHistorialProyecto = function () {
            var extendMethod = {};
            var historialProyectoSubResource = new RestObject(this.$concatSubResourcePath('historiales'), CertambRestangular, extendMethod);
            return historialProyectoSubResource;
        };

        return proyectoSubResource;
    };

    direccionRegionalResource.SGTrabajador = function () {
        var extendMethod = {
            $setUsuario: function () {
                return CertambRestangular.one(this.$getBasePath(), this.id).all('usuario').customPUT(CertambRestangular.copy(this), '', {}, {});
            },
            $removeUsuario: function () {
                return CertambRestangular.one(this.$getBasePath(), this.id).all('usuario').remove();
            }
        };

        var trabajadorSubResource = new RestObject(this.$concatSubResourcePath('trabajadores'), CertambRestangular, extendMethod);

        return trabajadorSubResource;
    };

    return direccionRegionalResource;

}]);

angular.module('utils').factory('SGTrabajador', ['CertambRestangular',  function(CertambRestangular) {

    var extendMethod = {
        $setUsuario: function () {
            return CertambRestangular.one(this.$getBasePath(), this.id).all('usuario').customPUT(CertambRestangular.copy(this), '', {}, {});
        },
        $removeUsuario: function () {
            return CertambRestangular.one(this.$getBasePath(), this.id).all('usuario').remove();
        }
    };

    var trabajadorResource = new RestObject('trabajadores', CertambRestangular, extendMethod);

    return trabajadorResource;
}]);

angular.module('utils').factory('SGProyecto', ['CertambRestangular',  function(CertambRestangular) {

    var extendMethod = {};

    var proyectoResource = new RestObject('proyectos', CertambRestangular, extendMethod);

    /**
     * Cuentas personales*
     * */
    proyectoResource.SGHistorialProyecto = function () {
        var extendMethod = {};

        var historialProyectoSubResource = new RestObject(this.$concatSubResourcePath('historiales'), CertambRestangular, extendMethod);

        return historialProyectoSubResource;
    };

    return proyectoResource;

}]);

angular.module('utils').factory('SGEtapa', ['CertambRestangular',  function(CertambRestangular) {

    var extendMethod = {};

    var etapaResource = new RestObject('etapas', CertambRestangular, extendMethod);

    /**
     * Cuentas personales*
     * */
    etapaResource.SGProcedimiento = function () {
        var extendMethod = {};

        var procedimientoSubResource = new RestObject(this.$concatSubResourcePath('procedimientos'), CertambRestangular, extendMethod);

        procedimientoSubResource.SGSugerencia = function () {
            var extendMethod = {};

            var sugerenciaSubResource = new RestObject(this.$concatSubResourcePath('sugerencias'), CertambRestangular, extendMethod);

            return sugerenciaSubResource;
        };

        return procedimientoSubResource;
    };

    return etapaResource;

}]);
