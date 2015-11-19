'use strict';

/* jshint -W098 */
angular.module('persona').controller('Persona.TipoDocumento.BuscarTipoDocumentoController',
    function ($scope, $state, SGTipoDocumento) {

        var paginationOptions = {
            page: 1,
            pageSize: 10
        };

        $scope.filterOptions = {
            filterText: undefined,
            estado: true
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
                {field: 'abreviatura', displayName: 'Abreviatura'},
                {field: 'denominacion', displayName: 'Denominacion'},
                {field: 'cantidadCaracteres', displayName: 'Num.Caracteres'},
                {field: 'tipoPersona', displayName: 'T.persona'},
                {field: 'estado', displayName: 'Estado', cellFilter: 'si_no : "activo" | uppercase'},
                {
                    name: 'edit',
                    displayName: 'Edit',
                    cellTemplate: '' +
                    '<div style="text-align: center; padding-top: 5px;">' +
                    '<button type="button" ng-click="grid.appScope.gridActions.edit(row.entity)" class="btn btn-info btn-xs">' +
                    '<i class="pficon pficon-edit"></i>' +
                    '<span>&nbsp;Editar</span>'+
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
                $state.go('^.editar', {documento: row.abreviatura});
            }
        };

        $scope.search = function () {
            var criteria = {
                filterText: $scope.filterOptions.filterText,
                filters: [],
                orders: [],
                paging: paginationOptions
            };
            if (angular.isDefined($scope.filterOptions.estado)) {
                criteria.filters = [{name: 'estado', value: $scope.filterOptions.estado, operator: 'bool_eq'}];
            }

            SGTipoDocumento.$search(criteria).then(function (response) {
                $scope.gridOptions.data = response.items;
                $scope.gridOptions.totalItems = response.totalSize;
            });
        };

        $scope.$watch('filterOptions.estado', function(newValue, oldValue) {
            if(newValue !== oldValue) {
                $scope.search();
            }
        }, true);

    }
)
;
