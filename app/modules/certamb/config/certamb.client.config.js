'use strict';

// Configuring the Chat module
angular.module('certamb').run(['Menus', 'Auth',
	function (Menus, Auth) {
    Menus.addMenuItem('topbar', {
      title: 'Certamb',
      state: 'certamb.app'
    });
	}
]);
