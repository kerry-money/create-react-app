(function(window) {
  'use strict';
  var set = function set(azureValue, defaultValue, returnType) {
    returnType = returnType || type.string;
    return returnType(/^__\w+__$/.test(azureValue) ? defaultValue : azureValue);
  };
  var get = function get(value, returnValue) {
    return value === undefined ? value : returnValue;
  };
  var type = {
    string: function string(value) {
      return get(value, ('' + value).trim());
    },
    number: function number(value) {
      return get(value, parseInt(value, 10));
    },
    boolean: function boolean(value) {
      return get(value, type.string(value).toLowerCase() === 'true');
    },
  };
  window.__env = {
    idpUrl: set('__IDP_URL__', 'https://qa.myidentifi.com/identityprovider'),
    idpClientId: set('__IDP_CLIENT_ID__', 'identifiui-localhost-devidp'),
    idpRequiredScopes: set(
      '__IDP_REQUIRED_SCOPES__',
      'openid identifiapiscope'
    ),
    identifiServices: set(
      '__IDENTIFI_SERVICES__',
      'https://qa.myidentifi.com/IdentifiWeb/'
    ),
    userAdminServices: set(
      '__USER_ADMIN_SERVICES__',
      'https://qa.myidentifi.com/UserAdminServices/'
    ),
    environmentName: set('__ENVIRONMENT_NAME__', ''),
    loginUrl: set('__LOGIN_URL__', '../'),
    mobileEnabled: set('__MOBILEENABLED__', false),
  };
  // Object.assign(window.__env, {
  //   services: "http://localhost:51111/",
  //   identifiServices: "http://localhost:59999/",
  //   userAdminServices: "http://localhost:61478/"
  // });
})(this);
