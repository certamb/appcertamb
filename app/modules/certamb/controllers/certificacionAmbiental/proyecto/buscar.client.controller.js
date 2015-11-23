'use strict';

/* jshint -W098 */
angular.module('certamb').controller('Certamb.CertificacionAmbiental.Proyecto.BuscarController',
    function ($scope, $state, SGProyecto, SGDireccionRegional) {

        $scope.combo = {
            direccionRegional: undefined
        };
        $scope.combo.selected = {
            direccionRegional: undefined
        };

        $scope.loadCombo = function (response) {
            SGDireccionRegional.$getAll().then(function (response) {
                $scope.combo.direccionRegional = response;
            });
        };
        $scope.loadCombo();

        var paginationOptions = {
            page: 1,
            pageSize: 10
        };

        $scope.filterOptions = {
            filterText: undefined,
            tipo: undefined
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
                {field: 'denominacion', displayName: 'DENOMINACION', width: '35%'},
                {field: 'direccionRegional.denominacion', displayName: 'DIR.REGIONAL', width: '20%'},
                {field: 'tipo', displayName: 'TIPO', width: '10%'},
                {field: 'monto', displayName: 'MONTO', cellFilter: 'currency: " " ', width: '15%'},
                {field: 'estado', displayName: 'ESTADO', width: '10%'},
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
                $state.go('^.editar', {proyecto: row.id});
            }
        };

        $scope.search = function () {
            var criteria = {
                filterText: $scope.filterOptions.filterText,
                filters: [],
                orders: [],
                paging: paginationOptions
            };

            if ($scope.filterOptions.tipo) {
                criteria.filters = [{name: 'tipo', value: $scope.filterOptions.tipo, operator: 'eq'}];
            }

            if (angular.isDefined($scope.combo.selected.direccionRegional)) {
                $scope.combo.selected.direccionRegional.SGProyecto().$search(criteria).then(function (response) {
                    $scope.gridOptions.data = response.items;
                    $scope.gridOptions.totalItems = response.totalSize;
                });
            } else {
                SGProyecto.$search(criteria).then(function (response) {
                    $scope.gridOptions.data = response.items;
                    $scope.gridOptions.totalItems = response.totalSize;
                });
            }
        };


        $scope.$watch('filterOptions.tipo',function(newVal, oldVal){
            if(newVal !== oldVal) {
                $scope.search();
            }
        }, true);


    });
