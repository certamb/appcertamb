'use strict';

/* jshint -W098 */
angular.module('certamb').controller('Certamb.Organizacion.Trabajador.CrearController',
    function ($scope, $state, $stateParams, toastr, DIRECCION_REGIONAL, SGTipoDocumento, SGPersonaNatural, SGDireccionRegional, SGTrabajador) {
        $scope.working = false;

        $scope.view = {
            trabajador: SGTrabajador.$build()
        };

        $scope.view.loaded = {
            persona: undefined,
            trabajador: undefined
        };

        $scope.combo = {
            direccionRegional: undefined,
            tipoDocumento: undefined
        };
        $scope.combo.selected = {
            direccionRegional: DIRECCION_REGIONAL ? DIRECCION_REGIONAL : undefined,
            tipoDocumento: undefined
        };

        $scope.loadCombo = function () {
            var criteria = {
                filters: [{name: 'tipoPersona', value: 'NATURAL', operator: 'eq'}],
                paging: {page: 1, pageSize: 20}
            };
            SGTipoDocumento.$search(criteria).then(function (response) {
                $scope.combo.tipoDocumento = response.items;
            });

            if ($scope.access.administrarTrabajadores) {
              SGDireccionRegional.$getAll().then(function(response){
                $scope.combo.direccionRegional = response;
              });
            } else if ($scope.access.administrarTrabajadoresDireccionRegional) {
              $scope.combo.direccionRegional = [DIRECCION_REGIONAL];
            } else {
              console.log('User not authenticated for this action.');
            }
        };
        $scope.loadCombo();

        $scope.check = function ($event) {
            if (!angular.isUndefined($event)) {
                $event.preventDefault();
            }
            var criteria1 = {
                filters: [
                    {name: 'tipoDocumento.abreviatura', value: $scope.combo.selected.tipoDocumento.abreviatura, operator: 'eq'},
                    {name: 'numeroDocumento', value: $scope.view.trabajador.numeroDocumento, operator: 'eq'}
                ], paging: {page: 1, pageSize: 20}
            };
            SGPersonaNatural.$search(criteria1).then(function (response) {
                $scope.view.loaded.persona = response.items[0];
                if ($scope.view.loaded.persona) {
                    toastr.info('Persona encontrada');
                } else {
                    toastr.warning('Persona no encontrada');
                }
            });

            var criteria2 = {
                filters: [
                    {name: 'tipoDocumento', value: $scope.combo.selected.tipoDocumento.abreviatura, operator: 'eq'},
                    {name: 'numeroDocumento', value: $scope.view.trabajador.numeroDocumento, operator: 'eq'}
                ], paging: {page: 1, pageSize: 20}
            };
            SGTrabajador.$search(criteria2).then(function (response) {
                $scope.view.loaded.trabajador = response.items[0];
            });
        };

        $scope.save = function () {
            if (angular.isUndefined($scope.view.loaded.persona)) {
                toastr.warning('Debe de seleccionar una persona.');
                return;
            }
            if (angular.isDefined($scope.view.loaded.trabajador)) {
                toastr.warning('El trabajador ya fue registrado, no puede continuar.');
                return;
            }

            var trabajador = angular.copy($scope.view.trabajador);
            trabajador.tipoDocumento = $scope.combo.selected.tipoDocumento.abreviatura;
            trabajador.direccionRegional = {id: $scope.combo.selected.direccionRegional.id};

            $scope.working = true;

            trabajador.$save().then(
                function (response) {
                    toastr.success('Trabajador creado');
                    $scope.working = false;
                    $state.go('^.editar', {trabajador: response.id});
                },
                function error(err) {
                    toastr.error(err.data.errorMessage);
                }
            );

        };

    })
;
