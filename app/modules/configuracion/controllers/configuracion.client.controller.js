'use strict';

/* jshint -W098 */
angular.module('configuracion').controller('ConfiguracionController', ['$scope', 'Auth',
    function ($scope, Auth) {

        $scope.package = {
            name: 'configuracion'
        };

        function getAccess(role) {
            if (!Auth) {
                return false;
            }

            var rolesSession = Auth.authz.resourceAccess.certamb.roles;
            if(rolesSession.indexOf(role) !== -1) {
                return true;
            }

            return false;
        }

        $scope.access = {
            get createRealm() {
                return Auth.user && Auth.user.createRealm;
            },

            get verDireccionesRegionales() {
                return getAccess('ver-direccionesRegionales');
            },
            get verTrabajadores(){
                return getAccess('ver-trabajadores');
            },


            get administrarDireccionesRegionales() {
                return getAccess('administrar-direccionesRegionales');
            },
            get administrarTrabajadores() {
                return getAccess('administrar-trabajadores');
            },

            get eliminarDireccionRegional() {
                return getAccess('eliminar-direccionesRegionales');
            },
            get eliminarTrabajadores() {
                return getAccess('eliminar-trabajadores');
            }

        };

    }
]);
