'use strict';

/* jshint -W098 */
angular.module('persona').controller('PersonaController', ['$scope', 'Auth',
    function($scope, Auth) {

        $scope.package = {
            name: 'persona'
        };

        function getAccess(role) {
            if (!Auth) {
                return false;
            }

            var rolesSession = Auth.authz.resourceAccess.persona.roles;
            if(rolesSession.indexOf(role) !== -1) {
                return true;
            }

            return false;
        }

        $scope.access = {
            get createRealm() {
                return Auth.user && Auth.user.createRealm;
            },

            get verDocumentos() {
                return getAccess('ver-documentos');
            },

            get verPersonas(){
                return getAccess('ver-personas');
            },

            get administrarDocumentos() {
                return getAccess('administrar-documentos');
            },

            get administrarPersonas() {
                return getAccess('administrar-personas');
            },

            get eliminarPersonas() {
                return getAccess('eliminar-personas');
            },

            get eliminarDocumentos() {
                return getAccess('eliminar-documentos');
            }

        };

    }
]);
