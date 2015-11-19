'use strict';

/* jshint -W098 */
angular.module('persona').controller('Persona.Natural.CrearPersonaNaturalController',
    function ($scope, $state, $stateParams, toastr, SGCountryCode, SGTipoDocumento, SGEstadoCivil, SGSexo, SGPersonaNatural) {

        $scope.working = false;

        $scope.view = {
            persona: SGPersonaNatural.$build()
        };

        $scope.combo = {
            pais: undefined,
            tipoDocumento: undefined,
            sexo: undefined,
            estadoCivil: undefined
        };
        $scope.combo.selected = {
            pais: undefined,
            tipoDocumento: undefined,
            sexo: undefined,
            estadoCivil: undefined
        };

        $scope.loadCombos = function () {
            SGCountryCode.$getAll().then(function (response) {
                $scope.combo.pais = response;
            });

            var criteria = {
                filterText: undefined,
                filters: [{name: 'tipoPersona', value: 'NATURAL', operator: 'eq'}],
                orders: [],
                paging: {
                    page: 1,
                    pageSize: 20
                }
            };
            SGTipoDocumento.$search(criteria).then(function (response) {
                $scope.combo.tipoDocumento = response.items;
            });

            SGSexo.$getAll().then(function (response) {
                $scope.combo.sexo = response;
            });
            SGEstadoCivil.$getAll().then(function (response) {
                $scope.combo.estadoCivil = response;
            });
        };
        $scope.loadCombos();

        $scope.loadParams = function () {
            $scope.view.persona.tipoDocumento = $stateParams.tipoDocumento;
            $scope.view.persona.numeroDocumento = $stateParams.numeroDocumento;
        };
        $scope.loadParams();

        $scope.loadDefaultConfiguration = function () {
            //$scope.view.persona.codigoPais = 'PER';
            $scope.combo.selected.pais = {
                alpha2Code: 'PE',
                alpha3Code: 'PER',
                fullNameEn: 'Peru',
                independent: true,
                numericCode: '051',
                shortNameEn: 'Peru',
                shortNameUppercaseEn: 'Peru',
                status: 'officially-assigned'
            };
        };
        $scope.loadDefaultConfiguration();

        $scope.check = function ($event) {
            if (!angular.isUndefined($event))
                $event.preventDefault();
            if (!angular.isUndefined($scope.combo.selected.tipoDocumento) && !angular.isUndefined($scope.view.persona.numeroDocumento)) {
                var criteria = {
                    filters: [
                        {name: 'tipoDocumento.abreviatura', value: $scope.combo.selected.tipoDocumento.abreviatura, operator: 'eq'},
                        {name: 'numeroDocumento', value: $scope.view.persona.numeroDocumento, operator: 'eq'}
                    ], paging: {
                        page: 1,
                        pageSize: 20
                    }
                };
                SGPersonaNatural.$search(criteria).then(function (response) {
                    if (!response.items.length)
                        toastr.info('Documento de identidad disponible');
                    else
                        toastr.warning('Documento de identidad no disponible');
                });
            }
        };

        $scope.save = function () {
            var save = function () {
                $scope.view.persona.codigoPais = $scope.combo.selected.pais.alpha3Code;
                $scope.view.persona.tipoDocumento = $scope.combo.selected.tipoDocumento.abreviatura;
                $scope.view.persona.sexo = $scope.combo.selected.sexo;
                $scope.view.persona.estadoCivil = $scope.combo.selected.estadoCivil;
                $scope.working = true;
                $scope.view.persona.$save().then(
                    function (response) {
                        toastr.success('Persona creada');
                        $scope.working = false;
                        $state.go('^.editar', {personaNatural: response.id});
                    },
                    function error(err) {
                        toastr.error(err.data.errorMessage);
                    }
                );
            };

            var criteria = {
                filters: [
                    {name: 'tipoDocumento.abreviatura', value: $scope.combo.selected.tipoDocumento.abreviatura, operator: 'eq'},
                    {name: 'numeroDocumento', value: $scope.view.persona.numeroDocumento, operator: 'eq'}
                ], paging: {
                    page: 1,
                    pageSize: 20
                }
            };
            SGPersonaNatural.$search(criteria).then(function (response) {
                if (response.items.length) {
                    toastr.error('Documento de identidad no disponible', 'Error');
                } else {
                    save();
                }
            });
        };

    });
