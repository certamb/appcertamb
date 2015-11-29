'use strict';

/* jshint -W098 */
angular.module('certamb').controller('Certamb.CertificacionAmbiental.Proyecto.Editar.ResumenController',
  function ($scope, $state, proyecto, SGPersonaNatural) {

    $scope.view = {
      proyecto: proyecto
    };

    $scope.view.load = {
      historialActivo: undefined,
      persona: undefined
    };

    $scope.loadHistorial = function () {
      var criteria = {
        filters: [{name: 'estado', value: true, operator: 'bool_eq'}],
        paging: {
          page: 1,
          pageSize: 10
        }
      };
      $scope.view.proyecto.SGHistorialProyecto().$search(criteria).then(function (response) {
        $scope.view.load.historialActivo = response.items[0];

        //Buscar responsalbe
        if(angular.isDefined($scope.view.load.historialActivo.responsableTipoDocumento) && angular.isDefined($scope.view.load.historialActivo.responsableNumeroDocumento)){
          var criteria = {
            filters: [
              {name: 'tipoDocumento.abreviatura', value: $scope.view.load.historialActivo.responsableTipoDocumento, operator: 'eq'},
              {name: 'numeroDocumento', value: $scope.view.load.historialActivo.responsableNumeroDocumento, operator: 'eq'}
            ], paging: {page: 1, pageSize: 20}
          };
          SGPersonaNatural.$search(criteria).then(function (response) {
            $scope.view.load.persona = response.items[0];
          });
        }
      });
    };
    $scope.loadHistorial();

    $scope.vencido = function () {
      var currentDate = new Date();
      var desde =  new Date($scope.view.proyecto.fechaVigenciaDesde);
      var hasta =  new Date($scope.view.proyecto.fechaVigenciaHasta);
      if (currentDate.getTime() >= desde.getTime() && currentDate <= hasta.getTime()) {
        return false;
      } else {
        return true;
      }
    };

  });
