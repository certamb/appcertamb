'use strict';

//Start by defining the main module and adding the module dependencies
/* jshint ignore:start */
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);
/* jshint ignore:end */

// Setting HTML5 Location Mode
/* jshint ignore:start */
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
  function($locationProvider) {
    $locationProvider.hashPrefix('!');
  }
]);
/* jshint ignore:end */

//Then define the init function for starting up the application
/* jshint ignore:start */
angular.element(document).ready(function () {

    //Fixing facebook bug with redirect
    if (window.location.hash && window.location.hash === '#_=_') {
        if (window.history && history.pushState) {
            window.history.pushState('', document.title, window.location.pathname);
        } else {
            // Prevent scrolling by storing the page's current scroll offset
            var scroll = {
                top: document.body.scrollTop,
                left: document.body.scrollLeft
            };
            window.location.hash = '';
            // Restore the scroll offset, should be flicker free
            document.body.scrollTop = scroll.top;
            document.body.scrollLeft = scroll.left;
        }
    }

    //Then init the app
    angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
/* jshint ignore:end */
