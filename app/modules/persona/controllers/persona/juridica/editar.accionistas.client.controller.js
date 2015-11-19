'use strict';

/* jshint -W098 */
angular.module('persona').controller('Persona.Juridica.EditarPersonaJuridica.AccionistasController',
    function ($scope, $state, toastr, SGTipoDocumento, SGPersonaNatural) {

        $scope.entradas = {
            tipoDocumento: undefined,
            numeroDocumento: undefined,
            porcentaje: undefined
        };
        $scope.buscados = {
            persona: undefined
        };

        $scope.combo = {
            tipoDocumento: undefined
        };
        $scope.combo.selected = {
            tipoDocumento: undefined
        };

        $scope.loadCombo = function () {
            SGTipoDocumento.$search({tipoPersona: 'natural'}).then(function (response) {
                $scope.combo.tipoDocumento = response.items;
            });
        };
        $scope.loadCombo();

        $scope.view.loadObjects = {
            accionistas: []
        };

        $scope.loadAccionistas = function () {
            $scope.view.persona.SGAccionista().$search().then(function (response) {
                $scope.view.loadObjects.accionistas = response.items;
            });
        };
        $scope.loadAccionistas();

        $scope.checkAccionista = function ($event) {
            if (!angular.isUndefined($event))
                $event.preventDefault();
            if (!angular.isUndefined($scope.combo.selected.tipoDocumento) && !angular.isUndefined($scope.entradas.numeroDocumento)) {
                SGPersonaNatural.$search({
                    documento: $scope.combo.selected.tipoDocumento.abreviatura,
                    numero: $scope.entradas.numeroDocumento
                }).then(function (response) {
                    if (!response.items.length) {
                        toastr.warning('Persona no encontrada');
                    }
                    $scope.buscados.persona = response.items[0];
                });
            }
        };

        $scope.crearAccionista = function () {
            var accionista = {
                personaNatural: {
                    tipoDocumento: $scope.entradas.tipoDocumento,
                    numeroDocumento: $scope.entradas.numeroDocumento
                },
                porcentajeParticipacion: $scope.entradas.porcentaje
            };
            $scope.view.persona.SGAccionista().$saveSent(accionista).then(
                function (data) {
                    toastr.success('Accionista agregado');
                    $scope.buscados.persona.porcentajeParticipacion = $scope.entradas.porcentaje;
                    $scope.loadAccionistas();
                },
                function error(err) {
                    toastr.error(err.data.errorMessage);
                }
            );
        };

        $scope.editarPersonaNatural = function (item) {
            $state.go('^.^.editarPersonaNatural.resumen', {id: item.id});
        };

        $scope.goCrearPersonaNatural = function () {
            $state.go('^.^.crearPersonaNatural.datosPrincipales');
        };

    });
