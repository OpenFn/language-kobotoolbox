"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.execute = execute;
exports.getForms = getForms;
exports.getSubmissions = getSubmissions;
Object.defineProperty(exports, "alterState", {
  enumerable: true,
  get: function get() {
    return _languageCommon.alterState;
  }
});
Object.defineProperty(exports, "dataPath", {
  enumerable: true,
  get: function get() {
    return _languageCommon.dataPath;
  }
});
Object.defineProperty(exports, "dataValue", {
  enumerable: true,
  get: function get() {
    return _languageCommon.dataValue;
  }
});
Object.defineProperty(exports, "each", {
  enumerable: true,
  get: function get() {
    return _languageCommon.each;
  }
});
Object.defineProperty(exports, "field", {
  enumerable: true,
  get: function get() {
    return _languageCommon.field;
  }
});
Object.defineProperty(exports, "fields", {
  enumerable: true,
  get: function get() {
    return _languageCommon.fields;
  }
});
Object.defineProperty(exports, "http", {
  enumerable: true,
  get: function get() {
    return _languageCommon.http;
  }
});
Object.defineProperty(exports, "lastReferenceValue", {
  enumerable: true,
  get: function get() {
    return _languageCommon.lastReferenceValue;
  }
});
Object.defineProperty(exports, "merge", {
  enumerable: true,
  get: function get() {
    return _languageCommon.merge;
  }
});
Object.defineProperty(exports, "sourceValue", {
  enumerable: true,
  get: function get() {
    return _languageCommon.sourceValue;
  }
});

var _languageCommon = require("language-common");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Execute a sequence of operations.
 * Wraps `language-common/execute`, and prepends initial state for http.
 * @example
 * execute(
 *   create('foo'),
 *   delete('bar')
 * )(state)
 * @function
 * @param {Operations} operations - Operations to be performed.
 * @returns {Operation}
 */
function execute() {
  for (var _len = arguments.length, operations = new Array(_len), _key = 0; _key < _len; _key++) {
    operations[_key] = arguments[_key];
  }

  var initialState = {
    references: [],
    data: null
  };
  return function (state) {
    return _languageCommon.execute.apply(void 0, operations)(_objectSpread(_objectSpread({}, initialState), state));
  };
}
/**
 * Make a request to get the list of forms
 * @public
 * @example
 * getForms(state => {
 *    console.log(state.data);
 *    return state;
 * });
 * @function
 * @param {function} callback - callback to execute after fetching form list
 * @returns {Operation}
 */


function getForms(callback) {
  return function (state) {
    var _state$configuration = state.configuration,
        baseURL = _state$configuration.baseURL,
        apiVersion = _state$configuration.apiVersion,
        username = _state$configuration.username,
        password = _state$configuration.password;
    return _languageCommon.http.get({
      baseURL: baseURL,
      url: "api/".concat(apiVersion, "/assets/?format=json"),
      auth: {
        username: username,
        password: password
      }
    })(state).then(function (response) {
      console.log('Printing response...\n', response.data.count + ' forms fetched... \n');
      var nextState = (0, _languageCommon.composeNextState)(state, response.data);
      if (callback) return callback(nextState);
      return nextState;
    })["catch"](function (error) {
      console.log(error);
      return error;
    });
  };
}
/**
 * Get submissions for a specific form
 * @example
 * getSubmissions('aXecHjmbATuF6iGFmvBLBX', {}, state => {
 *   console.log(state.data);
 *   return state;
 * });
 * @function
 * @param {string} formId - id of the form
 * @param {object} params - data to make the fetch or filter
 * @param {function} callback - callback to execute after fetching form submissions.
 * @returns {Operation}
 */


function getSubmissions(formId, params, callback) {
  return function (state) {
    var _state$configuration2 = state.configuration,
        baseURL = _state$configuration2.baseURL,
        apiVersion = _state$configuration2.apiVersion,
        username = _state$configuration2.username,
        password = _state$configuration2.password;

    var _expandReferences = (0, _languageCommon.expandReferences)(params)(state),
        body = _expandReferences.body,
        headers = _expandReferences.headers,
        query = _expandReferences.query;

    return _languageCommon.http.get({
      baseURL: baseURL,
      url: "api/".concat(apiVersion, "/assets/").concat(formId, "/data/?format=json"),
      auth: {
        username: username,
        password: password
      },
      params: {
        query: JSON.stringify(query)
      }
    })(state).then(function (response) {
      console.log('Printing response...\n', response.data.count + ' submissions fetched... \n');
      var nextState = (0, _languageCommon.composeNextState)(state, response.data);
      if (callback) return callback(nextState);
      return nextState;
    })["catch"](function (error) {
      console.log(error);
      return error;
    });
  };
}
