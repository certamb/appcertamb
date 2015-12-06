'use strict';

//Start by defining the main module and adding the module dependencies
/* jshint ignore:start */
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);
/* jshint ignore:end */

// Setting HTML5 Location Mode
/* jshint ignore:start */
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
  function ($locationProvider) {
    $locationProvider.hashPrefix('!');
  }
]);
/* jshint ignore:end */

//Then define the init function for starting up the application
/* jshint ignore:start */
window.auth = {};
//window.auth.keycloakUrl = 'http://localhost:10948/auth';
window.auth.keycloakUrl = 'http://certificacion.grarecursosnaturales.gob.pe/auth';
window.auth.keycloakRealm = 'certamb';
window.auth.keycloakClientId = 'certamb_app';

/*window.auth.certambUrl = 'http://localhost:10948/certamb/rest';
window.auth.personaUrl = 'http://localhost:10948/persona/rest';
window.auth.iso3166Url = 'http://localhost:10948/iso3166/rest';*/
window.auth.certambUrl = 'http://certificacion.grarecursosnaturales.gob.pe/certamb/rest';
window.auth.personaUrl = 'http://certificacion.grarecursosnaturales.gob.pe/persona/rest';
window.auth.iso3166Url = 'http://certificacion.grarecursosnaturales.gob.pe/iso3166/rest';


//Then define the init function for starting up the application
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

  var keycloakUrl = window.auth.keycloakUrl;
  var keycloakRealm = window.auth.keycloakRealm;
  var keycloakClientId = window.auth.keycloakClientId;

  var certambUrl = window.auth.certambUrl;

  /* jshint ignore:start */
  var keycloak = new Keycloak({
    url: keycloakUrl,
    realm: keycloakRealm,
    clientId: keycloakClientId
  });
  /* jshint ignore:end */

  /* jshint ignore:start */
  keycloak.init({onLoad: 'login-required'}).success(function () {
    var certamb = new Certamb({
      url: certambUrl,
      authenticatedToken: keycloak.token
    });

    certamb.init({onLoad: 'login-required'}).success(function () {
      window.auth.authz = keycloak;
      angular.module('mean').factory('Auth', function () {
        return window.auth;
      });

      angular.module('mean').constant('REALM', {name: keycloakRealm, authServerUrl: keycloakUrl});

      angular.module('mean').constant('DIRECCION_REGIONAL', certamb.direccionRegional);
      angular.module('mean').constant('TRABAJADOR', certamb.trabajador);

      //if (angular.isUndefined(certamb.agencia) || angular.isUndefined(certamb.caja) || angular.isUndefined(certamb.persona)) {
      //    alert('No tiene una agencia, trabajador o caja asignada.');
      //    keycloak.logout();
      //} else {
      //Then init the app
      angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
      //}
    }).error(function () {
      alert('No se pudo cargar los datos del servidor, contactese con su administrador.');
    });
  }).error(function () {
    window.location.reload();
  });
  /* jshint ignore:end */

});


angular.module('mean').controller('KeycloakController',
  function ($scope, Auth, DIRECCION_REGIONAL, TRABAJADOR, SGPersonaNatural) {

    $scope.logout = function () {
      Auth.authz.logout();
    };
    $scope.accountManagement = function () {
      Auth.authz.accountManagement();
    };

    $scope.user = {
      username: Auth.authz.idTokenParsed.preferred_username,
      roles: []
    };

    $scope.loadRoles = function () {
      if (!angular.isUndefined(Auth.authz.realmAccess)) {
        var realmRoles = Auth.authz.realmAccess.roles;
        for (var i = 0; i < realmRoles.length; i++) {
          $scope.user.roles.push(realmRoles[i]);
        }
      }
    };
    $scope.loadRoles();

    $scope.session = {};
    $scope.session.direccionRegional = DIRECCION_REGIONAL;
    $scope.session.trabajador = TRABAJADOR;


    if(TRABAJADOR){
      var criteria1 = {
        filters: [
          {name: 'tipoDocumento.abreviatura', value: $scope.session.trabajador.tipoDocumento, operator: 'eq'},
          {name: 'numeroDocumento', value: $scope.session.trabajador.numeroDocumento, operator: 'eq'}
        ], paging: {page: 1, pageSize: 20}
      };
      SGPersonaNatural.$search(criteria1).then(function (response) {
        $scope.session.persona = response.items[0];
      });
    }

  }
);

var resourceRequests = 0;
var loadingTimer = -1;

angular.module('mean').factory('authInterceptor', function ($q, Auth) {
  return {
    request: function (config) {
      if (!config.url.match(/.html$/)) {
        var deferred = $q.defer();
        if (Auth.authz.token) {
          Auth.authz.updateToken(5).success(function () {
            config.headers = config.headers || {};
            config.headers.Authorization = 'Bearer ' + Auth.authz.token;

            deferred.resolve(config);
          }).error(function () {
            location.reload();
          });
        }
        return deferred.promise;
      } else {
        return config;
      }
    }
  };
});

angular.module('mean').factory('spinnerInterceptor', function ($q, $window, $rootScope, $location) {
  return function (promise) {
    return promise.then(function (response) {
      resourceRequests--;
      if (resourceRequests === 0) {
        if (loadingTimer !== -1) {
          window.clearTimeout(loadingTimer);
          loadingTimer = -1;
        }
        //$('#loading').hide();
      }
      return response;
    }, function (response) {
      resourceRequests--;
      if (resourceRequests === 0) {
        if (loadingTimer !== -1) {
          window.clearTimeout(loadingTimer);
          loadingTimer = -1;
        }
        //$('#loading').hide();
      }
      return $q.reject(response);
    });
  };
});

angular.module('mean').factory('errorInterceptor', function ($q, $window, $rootScope, $location, Auth) {
  return function (promise) {
    return promise.then(function (response) {
      return response;
    }, function (response) {
      if (response.status === 401) {
        Auth.authz.logout();
      } else if (response.status === 403) {
        $location.path('/forbidden');
      } else if (response.status === 404) {
        $location.path('/notfound');
      } else if (response.status) {
        if (response.data && response.data.errorMessage) {
          alert(response.data.errorMessage);
        } else {
          alert.error("An unexpected server error has occurred");
        }
      }
      return $q.reject(response);
    });
  };
});

angular.module('mean').config(function ($httpProvider) {
  $httpProvider.interceptors.push('errorInterceptor');
  var spinnerFunction = function (data, headersGetter) {
    if (resourceRequests === 0) {
      loadingTimer = window.setTimeout(function () {
        //$('#loading').show();
        loadingTimer = -1;
      }, 500);
    }
    resourceRequests++;
    return data;
  };
  $httpProvider.defaults.transformRequest.push(spinnerFunction);
  $httpProvider.interceptors.push('spinnerInterceptor');
  $httpProvider.interceptors.push('authInterceptor');
});

angular.module('mean').provider('sgKeycloak', function () {

  this.restUrl = 'http://localhost';

  this.$get = function () {
    var restUrl = this.restUrl;
    return {
      getRestUrl: function () {
        return restUrl;
      }
    };
  };

  this.setRestUrl = function (restUrl) {
    this.restUrl = restUrl;
  };
});

angular.module('mean').factory('KeycloakRestangular', ['Restangular', 'sgKeycloak', function (Restangular, sgKeycloak) {
  return Restangular.withConfig(function (RestangularConfigurer) {
    RestangularConfigurer.setBaseUrl(sgKeycloak.getRestUrl());
  });
}]);

angular.module('mean').config(function ($provide, sgKeycloakProvider, REALM) {
  sgKeycloakProvider.restUrl = REALM.authServerUrl + '/admin/realms/' + REALM.name;
});

angular.module('mean').factory('SGUsuarioKeycloak', ['KeycloakRestangular', 'REALM', function (KeycloakRestangular, REALM) {

  var url = 'users';

  var modelMethos = {
    $new: function (id) {
      return angular.extend({id: id}, modelMethos);
    },

    $find: function (id) {
      return KeycloakRestangular.one(url, id).get();
    },
    $search: function (queryParams) {
      return KeycloakRestangular.all(url).getList(queryParams);
    },
    $roleMappings: function (username) {
      return KeycloakRestangular.one(url + '/' + username + '/role-mappings').get();
    },
    $realmRoles: function (username) {
      return KeycloakRestangular.one(url + '/' + username + '/role-mappings/realm').get();
    },

    $getRealmLevelRoles: function () {
      return KeycloakRestangular.all('roles').getList();
    },
    $getCreateRealmUserUrl: function () {
      return REALM.authServerUrl + '/admin/' + REALM.name + '/console/#/create/user/' + REALM.name;
    },
    $getRoleMappingsUserUrl: function (id) {
      return REALM.authServerUrl + '/admin/' + REALM.name + '/console/#/realms/' + REALM.name + '/users/' + id + '/role-mappings';
    },

    $remove: function () {
      return KeycloakRestangular.one(url, this.id).remove();
    }

  };

  return modelMethos;

}]);

angular.module('mean').config(function (sgCertambProvider) {
  sgCertambProvider.restUrl = window.auth.certambUrl;
});

angular.module('mean').config(function (sgIso3166Provider) {
  sgIso3166Provider.restUrl = window.auth.iso3166Url;
});

angular.module('mean').config(function (sgPersonaProvider) {
  sgPersonaProvider.restUrl = window.auth.personaUrl;
});
