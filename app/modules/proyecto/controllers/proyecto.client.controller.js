'use strict';

/* jshint -W098 */
angular.module('proyecto').controller('ProyectoController', ['$scope', 'Auth',
    function ($scope, Auth) {

        $scope.package = {
            name: 'proyecto'
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

            get verProyectos() {
                return getAccess('ver-proyectos');
            },
            get verProyectosDireccionRegional(){
                return getAccess('ver-proyectos-direccionRegional');
            },

            get administrarProyectos() {
                return getAccess('administrar-proyectos');
            },

            get administrarProyectosDireccionRegional() {
                return getAccess('administrar-proyectos-direccionRegional');
            }

        };

    }
]);
