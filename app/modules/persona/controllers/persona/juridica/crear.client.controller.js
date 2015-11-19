'use strict';

/* jshint -W098 */
angular.module('persona').controller('Persona.Juridica.CrearPersonaJuridicaController',
    function ($scope, $state, $stateParams, toastr, SGTipoEmpresa, SGTipoDocumento, SGCountryCode, SGPersonaJuridica) {

        $scope.working = false;

        $scope.view = {
            persona: SGPersonaJuridica.$build()
        };

        $scope.loadParams = function () {
            $scope.view.persona.tipoDocumento = $stateParams.tipoDocumento;
            $scope.view.persona.numeroDocumento = $stateParams.numeroDocumento;
        };
        $scope.loadParams();

        $scope.loadDefaultConfiguration = function () {
            $scope.view.persona.codigoPais = 'PER';
        };
        $scope.loadDefaultConfiguration();

        $scope.save = function () {

            if (!$scope.view.persona.representanteLegal || !$scope.view.persona.representanteLegal.id) {
                toastr.warning('Representante legal no definido.');
                return;
            }

            SGPersonaJuridica.$search({
                tipoDocumento: $scope.view.persona.tipoDocumento,
                numeroDocumento: $scope.view.persona.numeroDocumento
            }).then(function (response) {
                if (!response.items.length) {
                    $scope.view.persona.representanteLegal = {
                        tipoDocumento: $scope.view.persona.representanteLegal.tipoDocumento,
                        numeroDocumento: $scope.view.persona.representanteLegal.numeroDocumento
                    };

                    $scope.working = true;

                    $scope.view.persona.$save().then(
                        function (response) {
                            toastr.success('Persona creada');
                            $scope.working = false;
                            $state.go('^.^.editar', {personaJuridica: response.id});
                        },
                        function error(err) {
                            toastr.error(err.data.errorMessage);
                        }
                    );
                } else {
                    toastr.error('Documento de identidad no disponible');
                }
            });

        };

    });
