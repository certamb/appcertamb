'use strict';

// Setting up sidebar
angular.module('configuracion').controller('ConfiguracionSidebarController',
    function ($scope, $menuItemsConfiguracion) {
        $scope.menuItems = $menuItemsConfiguracion.prepareSidebarMenu().getAll();
    }
);
