'use strict';

// Configuring the Chat module
angular.module('admin').run(['Menus',
	function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Admin',
      state: 'admin.app'
    });
	}
]);
