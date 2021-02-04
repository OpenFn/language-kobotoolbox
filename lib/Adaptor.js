"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.execute = execute;
exports.getForms = getForms;
exports.getSubmissions = getSubmissions;
Object.defineProperty(exports, "alterState", {
  enumerable: true,
  get: function () {
    return _languageCommon.alterState;
  }
});
Object.defineProperty(exports, "dataPath", {
  enumerable: true,
  get: function () {
    return _languageCommon.dataPath;
  }
});
Object.defineProperty(exports, "dataValue", {
  enumerable: true,
  get: function () {
    return _languageCommon.dataValue;
  }
});
Object.defineProperty(exports, "each", {
  enumerable: true,
  get: function () {
    return _languageCommon.each;
  }
});
Object.defineProperty(exports, "field", {
  enumerable: true,
  get: function () {
    return _languageCommon.field;
  }
});
Object.defineProperty(exports, "fields", {
  enumerable: true,
  get: function () {
    return _languageCommon.fields;
  }
});
Object.defineProperty(exports, "http", {
  enumerable: true,
  get: function () {
    return _languageCommon.http;
  }
});
Object.defineProperty(exports, "lastReferenceValue", {
  enumerable: true,
  get: function () {
    return _languageCommon.lastReferenceValue;
  }
});
Object.defineProperty(exports, "merge", {
  enumerable: true,
  get: function () {
    return _languageCommon.merge;
  }
});
Object.defineProperty(exports, "sourceValue", {
  enumerable: true,
  get: function () {
    return _languageCommon.sourceValue;
  }
});

var _languageCommon = require("@openfn/language-common");

/** @module Adaptor */

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
function execute(...operations) {
  const initialState = {
    references: [],
    data: null
  };
  return state => {
    return (0, _languageCommon.execute)(...operations)({ ...initialState,
      ...state
    });
  };
}
/**
 * Make a request to get the list of forms
 * @public
 * @example
 * getForms({}, state => {
 *    console.log(state.data);
 *    return state;
 * });
 * @function
 * @param {object} params - Query, Headers and Authentication parameters
 * @param {function} callback - (Optional) Callback function to execute after fetching form list
 * @returns {Operation}
 */


function getForms(params, callback) {
  return state => {
    params = (0, _languageCommon.expandReferences)(params)(state);
    const {
      baseURL,
      apiVersion,
      username,
      password
    } = state.configuration;
    const url = `${baseURL}/api/${apiVersion}/assets/?format=json`;
    const auth = {
      username,
      password
    };
    const config = {
      url,
      params,
      auth
    };
    return _languageCommon.http.get(config)(state).then(response => {
      console.log('✓', response.data.count, 'forms fetched.');
      const nextState = (0, _languageCommon.composeNextState)(state, response.data);
      if (callback) return callback(nextState);
      return nextState;
    });
  };
}
/**
 * Get submissions for a specific form
 * @example
 * getSubmissions({formId: 'aXecHjmbATuF6iGFmvBLBX'}, state => {
 *   console.log(state.data);
 *   return state;
 * });
 * @function
 * @param {object} params - Form Id and data to make the fetch or filter
 * @param {function} callback - (Optional) Callback function to execute after fetching form submissions
 * @returns {Operation}
 */


function getSubmissions(params, callback) {
  return state => {
    params = (0, _languageCommon.expandReferences)(params)(state);
    const {
      baseURL,
      apiVersion,
      username,
      password
    } = state.configuration;
    const {
      formId
    } = params;
    const url = `${baseURL}/api/${apiVersion}/assets/${formId}/data/?format=json`;
    const auth = {
      username,
      password
    };
    const config = {
      url,
      params: params.query,
      auth
    };
    return _languageCommon.http.get(config)(state).then(response => {
      console.log('✓', response.data.count, 'submissions fetched.');
      const nextState = (0, _languageCommon.composeNextState)(state, response.data);
      if (callback) return callback(nextState);
      return nextState;
    });
  };
}
