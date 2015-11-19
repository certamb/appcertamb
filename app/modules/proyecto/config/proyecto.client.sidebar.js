'use strict';

// Setting up sidebar
angular.module('proyecto').controller('ProyectoSidebarController',
    function ($scope, $menuItemsProyecto) {
        $scope.menuItems = $menuItemsProyecto.prepareSidebarMenu().getAll();
    }
);
