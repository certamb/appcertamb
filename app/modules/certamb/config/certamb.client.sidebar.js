'use strict';

// Setting up sidebar
angular.module('certamb').controller('CertambSidebarController',
    function ($scope, $menuItemsCertamb) {
        $scope.menuItems = $menuItemsCertamb.prepareSidebarMenu().getAll();
    }
);
