'use strict';

// Init the application configuration module for AngularJS application
/* jshint ignore:start */
var ApplicationConfiguration = (function () {

  // Init module configuration options
  var applicationModuleName = 'mean';

  var applicationModuleVendorDependencies = [
    'ngAnimate',
    'ui.router',
    'ui.bootstrap',
    'ui.utils',
    //own
    'ngMessages',
    'ngSanitize',
    'restangular',
    'ui.grid',
    'ui.grid.edit',
    'ui.grid.pagination',
    'ui.grid.selection',
    'ui.select',
    'ui.utils.masks',
    'toastr',
    'patternfly',
    'xeditable',
    'ngFileUpload',
    'ncy-angular-breadcrumb',
    'angularSpinner',
    'angular-ui-view-spinner'
  ];

  // Add a new vertical module
  var registerModule = function (moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  };

  return {
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: applicationModuleVendorDependencies,
    registerModule: registerModule
  };

})();
/* jshint ignore:end */
