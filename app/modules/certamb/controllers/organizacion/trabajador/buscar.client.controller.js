'use strict';

/* jshint -W098 */
angular.module('certamb').controller('Certamb.Organizacion.Trabajador.BuscarController',
  function ($scope, $state, DIRECCION_REGIONAL, SGDireccionRegional, SGTrabajador, SGPersonaNatural) {

    $scope.combo = {
      direccionRegional: undefined
    };
    $scope.combo.selected = {
      direccionRegional: DIRECCION_REGIONAL ? DIRECCION_REGIONAL : undefined,
    };

    $scope.loadCombo = function () {
      if ($scope.access.administrarTrabajadores) {
        SGDireccionRegional.$getAll().then(function (response) {
          $scope.combo.direccionRegional = response;
          $scope.combo.direccionRegional.unshift({denominacion: 'Todos', valor: 'TODO'});
        });
      } else if ($scope.access.administrarTrabajadoresDireccionRegional) {
        $scope.combo.direccionRegional = [DIRECCION_REGIONAL];
      } else {
        console.log('User not authenticated for this action.');
      }
    };
    $scope.loadCombo();

    var paginationOptions = {
      page: 1,
      pageSize: 10
    };

    $scope.filterOptions = {
      filterText: undefined
    };

    $scope.gridOptions = {
      data: [],
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      multiSelect: false,

      paginationPageSizes: [10, 25, 50],
      paginationPageSize: 10,
      useExternalPagination: true,
      useExternalSorting: true,

      columnDefs: [
        {field: 'tipoDocumento', displayName: 'T.documento'},
        {field: 'numeroDocumento', displayName: 'Num.documento'},
        {field: 'persona.apellidoPaterno', displayName: 'A.Paterno'},
        {field: 'persona.apellidoMaterno', displayName: 'A.Materno'},
        {field: 'persona.nombres', displayName: 'Nombres'},
        {
          name: 'edit',
          displayName: 'Edit',
          cellTemplate: '' +
          '<div style="text-align: center; padding-top: 5px;">' +
          '<button type="button" ng-click="grid.appScope.gridActions.edit(row.entity)" class="btn btn-info btn-xs">' +
          '<i class="pficon pficon-edit"></i>' +
          '<span>&nbsp;Editar</span>' +
          '</button>' +
          '</div>'
        }
      ],
      onRegisterApi: function (gridApi) {
        $scope.gridApi = gridApi;
        $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
          console.log('Order by. Not available.');
        });
        gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
          paginationOptions.page = newPage;
          paginationOptions.pageSize = pageSize;
          $scope.search();
        });
      }
    };
    $scope.gridActions = {
      edit: function (row) {
        $state.go('^.editar', {trabajador: row.id});
      }
    };

    $scope.search = function () {
      if (!$scope.combo.selected.direccionRegional) {
        return;
      }

      if($scope.combo.selected.direccionRegional.valor === 'TODO'){
        var criteria = {
          filterText: $scope.filterOptions.filterText,
          filters: [],
          orders: [],
          paging: paginationOptions
        };
        SGTrabajador.$search(criteria).then(function (response1) {
          $scope.gridOptions.data = response1.items;
          $scope.gridOptions.totalItems = response1.totalSize;
          angular.forEach($scope.gridOptions.data, function (row) {
            var criteria = {
              filters: [
                {name: 'tipoDocumento.abreviatura', value: row.tipoDocumento, operator: 'eq'},
                {name: 'numeroDocumento', value: row.numeroDocumento, operator: 'eq'}
              ], paging: {page: 1, pageSize: 10}
            };
            SGPersonaNatural.$search(criteria).then(function (response2) {
              row.persona = response2.items[0];
            });
          });
        });
      } else {
        var criteria = {
          filterText: $scope.filterOptions.filterText,
          filters: [],
          orders: [],
          paging: paginationOptions
        };
        SGDireccionRegional.$new($scope.combo.selected.direccionRegional.id).SGTrabajador().$search(criteria).then(function (response1) {
          $scope.gridOptions.data = response1.items;
          $scope.gridOptions.totalItems = response1.totalSize;
          angular.forEach($scope.gridOptions.data, function (row) {
            var criteria = {
              filters: [
                {name: 'tipoDocumento.abreviatura', value: row.tipoDocumento, operator: 'eq'},
                {name: 'numeroDocumento', value: row.numeroDocumento, operator: 'eq'}
              ], paging: {page: 1, pageSize: 10}
            };
            SGPersonaNatural.$search(criteria).then(function (response2) {
              row.persona = response2.items[0];
            });
          });
        });
      }

    };

  });
