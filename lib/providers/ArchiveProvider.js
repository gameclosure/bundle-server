/* jshint -W079 */
var Promise = require('bluebird');
/* jshint +W079 */
var Provider = require('./Provider');
var glob = Promise.promisify(require('glob'));
var path = require('path');
var zip = require(path.join('..', 'zip'));

/**
 * Provide bundles from a directory of precompiled apps
 *
 * Archive provider expects directories to have a particular layout. The
 * following example shows a root folder named `archives`. The root should have
 * a set of folders organized by application short name. Each app folder has a
 * list of archives whose titles are semantic versions. The extension is `zip`
 * by default. An alternative extension can be passed to ArchiveProvider.create
 * options.
 *
 *     archives
 *     ├── platformer
 *     │   ├── v0.1.0.zip
 *     │   ├── v0.2.0.zip
 *     │   └── v1.0.0.zip
 *     └── shooter
 *         ├── v1.13.1.zip
 *         ├── v1.15.0.zip
 *         └── v2.0.0.zip
 *
 * This provider is ideal for production environments where access to changes
 * or individual files is not important.
 *
 * @class ArchiveProvider
 */

function ArchiveProvider(opts) {
  Provider.call(this);

  this.path = path.resolve(process.cwd(), opts.path);
  this.ext = opts.ext;
}

// Inherit from Provider
ArchiveProvider.prototype = Object.create(Provider.prototype);
ArchiveProvider.prototype.constructor = ArchiveProvider;

/**
 * Get a list of application shortnames
 * @return {Array<String>} application shortnames
 */

function getAppNames() {
  return glob('*/', {cwd: this.path});
}

/**
 * List archives for app
 *
 * @return {Object}
 * @property {String} name
 * @property {Array<String>} archives
 */

function getArchiveNames(appName) {
  return glob('*.', + this.ext, {
    cwd: path.join(this.path, appName)
  }).then(function (archives) {
    return {
      name: appName,
      archives: archives
    };
  });
}

function contains(str, substr) {
  return str.indexOf(substr) !== -1;
}

/**
 * Get latest semver from a list of versions
 */

function latest(list) {
}

/**
 * Get versions from archives
 *
 * @param {String} base - the app name
 * @param {Array<String>} archives
 * @param {String} ext
 */

function versions(base, archives, ext) {
  return archives.filter(function (a) {
    return contains(a, base);
  }).map(function (s) {
    return s.replace(ext, '').replace(name + '/', '');
  });
}

/**
 * Read a manifest from an archive
 */

function readManifest(archivePath) {
  return JSON.parse(zip.readFileAsText(archivePath, 'manifest.json'));
}

/**
 * Parse archive versions
 *
 * @return {Array<Object>} semvers
 */

ArchiveProvider.prototype.getApps = function () {

  return Promise.all([
    glob('*/', {cwd: this.path}),
    glob('**/*.' + this.ext, {cwd: this.path})
  ]).bind(this).spread(function (names, archives) {
    var ext = this.ext;
    return names.map(function (name) {
      return {
        name: name,
        versions: versions(name, archives, ext)
      };
    });
  }).map(function (app) {
    var latest = latest(app.versions);
    // nested handler since we need app objects that were passed in
    return readManifest(app, latest, this).then(function (manifest) {

    });
  });
};

ArchiveProvider.prototype.getAttributes = function getLatestBundle(appName) {

};

ArchiveProvider.prototype.getLatestBundle = function getLatestBundle(appName) {

};

ArchiveProvider.prototype.getBundle = function getBundle(appName, appVersion) {

};

/**
 * Archives are immutable. No changes will happen.
 * @override
 */

ArchiveProvider.prototype.awaitChanges = function awaitChanges() {
  return Promise.reject(new CapabilityError('ArchiveProvider'));
};

// ArchiveProvider capablities
var capabilities = Object.freeze({
  watchable: false,
  bundles: true,
  getFile: true,
  listFiles: true,
});

/**
 * Ensure correct options for archive provider
 *
 * @throws TypeError
 * @api private
 */

function applyDefaultOptions(opts) {
  if (!opts || !opts.path) {
    throw new TypeError('opts.path is required for ArchiveProvider');
  }

  return {
    path: opts.path,
    ext: opts.ext || 'zip'
  };
}

/**
 * Create an archive provider
 *
 * @param {object} opts
 * @property {string} opts.path - relative or absolute path to archive root
 * @property {string} [opts.ext] - extension to search for (zip by default)
 */
ArchiveProvider.create = function createArchiveProvider(opts) {

  opts = applyDefaultOptions(opts);

  var provider = Object.create(ArchiveProvider.prototype, {
    capabilities: {
      enumerable: true,
      value: capabilities
    }
  });

  ArchiveProvider.call(provider, opts);
  return provider;
};

exports.create = ArchiveProvider.create;
