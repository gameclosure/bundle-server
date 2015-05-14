// disable unused for this interface definition
/* jshint unused: false */

/* jshint -W079 */
var Promise = require('bluebird');
/* jshint +W079 */

var EventEmitter = require('events').EventEmitter;
var UnimplementedError = require('./UnimplementedError');

/**
 * @typedef {object} ProviderCapabilities
 *
 * @property {bool} watchable - awaitChanges and 'change' event are supported
 * @property {bool} bundles - getBundle, getLatestBundle supported
 * @property {bool} getFile - getFile supported
 * @property {bool} listFiles - listFiles supported
 */

/**
 * An abstract class to back the bundle loading API.
 *
 * Examples of concrete providers could be git, prebuilt archiver, etc. Just
 * implement this interface
 *
 * @class Provider
 * @inherits EventEmitter
 * @fires {'change', ChangeSpec}
 * @property {ProviderCapabilities} capabilities - Provider capabilities
 * @abstract
 */

function Provider() {
  EventEmitter.call(this);
}

Provider.prototype = new EventEmitter();

/**
 * @typedef {object} ApplicationSummary
 * @property {string} id - app uuid
 * @property {string} name - app shortname
 * @property {string} desc - latest description
 * @property {string} icon - latest relative icon path
 * @property {string} splash - latest relative splash path
 */

/**
 * list applications available from the service
 *
 * @abstract
 * @return {Promise<Array<ApplicationSummary>>}
 */

Provider.prototype.getApps = function getApps() {
  return Promise.reject(new UnimplementedError('list apps'));
};

/**
 * @typedef {object} ApplicationVersion
 * @property {string} version
 */

/**
 * @typedef {object} Application
 * @property {string} id - app uuid
 * @property {string} name - app name
 * @property {string} description - latest description
 * @property {string} icon - latest relative icon path
 * @property {string} splash - latest relative splash path
 * @property {Array<ApplicationVersion>} versions

/**
 * get properties for a specific application
 *
 * @abstract
 * @param {string} appName
 * @return {Promise<Application>}
 */

Provider.prototype.getAttributes = function getAttributes(appName) {
  return Promise.reject(new UnimplementedError('base provider'));
};

/**
 * get latest bundle for a given application
 *
 * @abstract
 * @param {string} appName
 * @return {Promise<String>} path to the latest archive file for the app
 */

Provider.prototype.getLatestBundle = function getLatestBundle(appName) {
  return Promise.reject(new UnimplementedError('base provider'));
};

/**
 * get bundle for app at a particular revision
 *
 * @abstract
 * @param {string} appName
 * @param {string} appVersion
 * @return {Promise<String>} path to the archive file at version for app
 */

Provider.prototype.getBundle = function getBundle(appName, appVersion) {
  return Promise.reject(new UnimplementedError('base provider'));
};

/**
 * Get a promise for the next changeset
 *
 * @abstract
 * @param {string} appName
 * @return {Promise<ChangeSpec|null>}
 */

Provider.prototype.awaitChanges = function awaitChanges(appName) {
  return Promise.reject(new UnimplementedError('base provider'));
};

/**
 * Get list of files for app at version
 *
 * @abstract
 * @param {string} appName - application name
 * @param {string} [appVersion] - optional version (latest by default)
 * @return {Promise<Array<String>>}
 */

Provider.prototype.getFileList = function (appName, appVersion) {
  return Promise.reject(new UnimplementedError('base provider'));
};

/**
 * Get a file for an app at some version
 *
 * @abstract
 * @param {string} appName - application name
 * @param {string
 */

Provider.prototype.getFile = function (appName, appVersion, file) {
  return Promise.reject(new UnimplementedError('base provider'));
};

module.exports = Provider;
