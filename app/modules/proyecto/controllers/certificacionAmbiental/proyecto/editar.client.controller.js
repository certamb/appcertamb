'use strict';

/*global go:false */
/* jshint -W098 */
angular.module('proyecto').controller('Proyecto.CertificacionAmbiental.Proyecto.EditarController',
    function ($scope, $state, $stateParams, toastr, proyecto, DIRECCION_REGIONAL) {

        $scope.working = false;

        $scope.view = {
            proyecto: proyecto
        };

        $scope.view.load = {
            historial: undefined
        };

        $scope.view.flow = {
            nodes: [],
            relations: []
        };

        $scope.model = new go.GraphLinksModel(
            [
                {key: 1, name: 'EN PROCESO DE CLASIFICACION', color: 'lightblue'},
                {key: 2, name: 'SOLICITUD DE TDR', color: 'orange'},
                {key: 3, name: 'EMISION DE RESOLUCION APROBATORIA DE TDR', color: 'lightgreen'},
                {key: 4, name: 'EN PROCESO DE CLASIFICACION', color: 'pink', group: 5},
                {key: 5, text: 'Epsilon', color: 'green', isGroup: true}
            ],
            [
                {from: 1, to: 2},
                {from: 2, to: 3},
                {from: 3, to: 4}
            ]);
        $scope.model.selectedNodeData = null;


        $scope.loadHistorial = function () {
            var criteria = {
                filterText: undefined,
                filters: [],
                orders: [{name: 'fecha', ascending: true}],
                paging: {
                    page: 1,
                    pageSize: 100
                }
            };

            $scope.view.proyecto.SGHistorialProyecto().$search(criteria).then(function (response) {
                $scope.view.load.historial = response.items;

                //poner inicio
                $scope.view.flow.nodes = [{key: 0, name: 'Inicio', color: 'yellow'}];
                $scope.view.flow.relations = [];

                //ponser historialess
                for (var i = 0; i < $scope.view.load.historial.length; i++) {
                    $scope.view.flow.nodes.push({
                        key: i + 1,
                        name: $scope.view.load.historial[i].procedimiento.denominacion,
                        color: $scope.view.load.historial[i].procedimiento.responsable === 'INSTITUCION' ? 'lightblue' : 'lightgreen',
                        item: $scope.view.load.historial[i]
                    });
                    $scope.view.flow.relations.push({from: i, to: i + 1});
                }

                //poner fin
                $scope.view.flow.nodes.push({
                    key: $scope.view.flow.nodes.length,
                    name: $scope.view.proyecto.estado,
                    color: 'yellow'
                });
                $scope.view.flow.relations.push({
                    from: $scope.view.flow.nodes.length - 2,
                    to: $scope.view.flow.nodes.length - 1
                });

                //crear objeto
                $scope.model = new go.GraphLinksModel($scope.view.flow.nodes, $scope.view.flow.relations);
            });
        };
        $scope.loadHistorial();

        $scope.accessProyecto = function () {
            if ($scope.access.administrarProyectos) {
                return true;
            } else if ($scope.access.administrarProyectosDireccionRegional) {
                if (DIRECCION_REGIONAL) {
                    if (proyecto.direccionRegional.id === DIRECCION_REGIONAL.id) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            } else {
                return false;
            }
        };

    })
;
