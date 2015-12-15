'use strict';

/* jshint -W098 */
angular.module('certamb').controller('Certamb.Organizacion.Trabajador.Editar.ResumenController',
    function ($scope, $state, $window, $stateParams, toastr, trabajador, SGDialog, SGPersonaNatural, SGUsuarioKeycloak, SGTrabajador) {

        $scope.view = {
            trabajador: trabajador
        };

        $scope.view.loaded = {
            persona: undefined,
            userKeycloak: {
                rolesAssigned: []
            }
        };

        $scope.loadPersona = function () {
            var criteria = {
                filters: [
                    {name: 'tipoDocumento.abreviatura', value: $scope.view.trabajador.tipoDocumento, operator: 'eq'},
                    {name: 'numeroDocumento', value: $scope.view.trabajador.numeroDocumento, operator: 'eq'}
                ], paging: {page: 1, pageSize: 20}
            };
            SGPersonaNatural.$search(criteria).then(function (response) {
                $scope.view.loaded.persona = response.items[0];
            });
        };
        $scope.loadPersona();

        $scope.loadUsuario = function () {
            //Usuario de keycloak, para sacar roles
            var usuario = $scope.view.trabajador.usuario;
            if (usuario) {
                SGUsuarioKeycloak.$search({username: usuario, max: 1}).then(function (response1) {
                    //SGUsuarioKeycloak.$realmRoles(response1[0].id).then(function (response2) {
                    SGUsuarioKeycloak.$realmRoles(response1[0].username).then(function (response2) {
                        for (var i = 0; i < response2.length; i++) {
                            $scope.view.loaded.userKeycloak.rolesAssigned.push(response2[i].name);
                        }
                    });
                });
            }
        };
        $scope.loadUsuario();

    });
