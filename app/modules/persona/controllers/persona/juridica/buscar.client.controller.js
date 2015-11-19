'use strict';

/* jshint -W098 */
angular.module('persona').controller('Persona.Juridica.BuscarPersonaJuridicaController',
    function ($scope, $state, SGPersonaJuridica) {

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
                {field: 'tipoDocumento', displayName: 'Documento'},
                {field: 'numeroDocumento', displayName: 'Numero'},
                {field: 'razonSocial', displayName: 'Razon social'},
                {field: 'nombreComercial', displayName: 'Nombre comercial'},
                {field: 'tipoEmpresa', displayName: 'Tipo Empresa'},
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
                $state.go('^.editar', {personaJuridica: row.id});
            }
        };

        $scope.search = function () {
            SGPersonaJuridica.$search(angular.extend($scope.filterOptions, paginationOptions)).then(function(response){
                $scope.gridOptions.data = response.items;
                $scope.gridOptions.totalItems = response.totalSize;
            });
        };

    });
