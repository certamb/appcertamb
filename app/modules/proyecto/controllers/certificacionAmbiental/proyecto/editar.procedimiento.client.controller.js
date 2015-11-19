'use strict';

/* jshint -W098 */
angular.module('proyecto').controller('Proyecto.CertificacionAmbiental.Proyecto.Editar.ProcedimientoController',
  function ($scope, $state, toastr, proyecto, SGDialog, SGEtapa) {

    $scope.working = false;

    $scope.view = {
      proyecto: proyecto,
      historial: proyecto.SGHistorialProyecto().$build(),

      sugerencia: undefined
    };

    $scope.combo = {
      etapa: undefined,
      procedimiento: undefined,

      categoria: undefined
    };
    $scope.combo.selected = {
      etapa: undefined,
      procedimiento: undefined,

      categoria: undefined
    };

    $scope.view.load = {
      historialActivo: undefined
    };

    $scope.loadCombo = function () {
      SGEtapa.$getAll().then(function (response) {
        $scope.combo.etapa = response;
      });
      $scope.$watch('combo.selected.etapa', function (newVal, olVal) {
        if (angular.isDefined($scope.combo.selected.etapa)) {
          SGEtapa.$new($scope.combo.selected.etapa.id).SGProcedimiento().$getAll().then(function (response) {
            $scope.combo.procedimiento = response;
          });
        }
      }, true);

      $scope.combo.categoria = [
        {denominacion: 'CATEGORIA I', valor: 'I', observacion: 'Aprobado'},
        {denominacion: 'CATEGORIA II', valor: 'II', observacion: 'Rechazado'},
        {denominacion: 'CATEGORIA III', valor: 'III', observacion: 'Rechazado'}
      ];
    };
    $scope.loadCombo();

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
      });
    };
    $scope.loadHistorial();

    $scope.$watch('view.sugerencia', function (newVal, oldVal) {
      if (newVal !== oldVal) {
        if ($scope.view.sugerencia) {
          $scope.combo.selected.etapa = $scope.view.sugerencia.procedimientoSugerencia.etapa;
          $scope.combo.selected.procedimiento = $scope.view.sugerencia.procedimientoSugerencia;
        } else {
          $scope.combo.selected.etapa = undefined;
          $scope.combo.selected.procedimiento = undefined;
        }
      }
    }, true);

    $scope.save = function () {
      $scope.working = true;
      SGDialog.confirm('Guardar', '¿Estas seguro de crear la etapa?', function () {
        var historial = angular.copy($scope.view.historial);

        historial.procedimiento = {id: $scope.combo.selected.procedimiento.id};
        if ($scope.combo.selected.procedimiento.requiereCategoria) {
          historial.categoria = $scope.combo.selected.categoria.valor;
        }
        if (!$scope.combo.selected.procedimiento.requiereResolucion) {
          historial.resolucion = undefined;
        }

        historial.$save().then(
          function (response) {
            $scope.working = false;
            toastr.success('Nueva etapa creada satisfactoriamente');
            $state.reload();

          }, function error(err) {
            toastr.error(err.data.message);
          }
        );
      });
    };

  });
