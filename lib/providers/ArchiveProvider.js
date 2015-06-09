/* jshint -W079 */
var Promise = require('bluebird');
/* jshint +W079 */
var Provider = require('./Provider');
var glob = Promise.promisify(require('glob'));
var path = require('path');
var zip = require(path.join('..', 'zip'));
var semver = require('semver');
var Application = require('../Application');
var ApplicationSummary = require('../ApplicationSummary');
var ProviderCapabilities = require('./ProviderCapabilities');
var CapabilityError = require('./CapabilityError');
var MisconfiguredApplicationError = require('../MisconfiguredApplicationError');

// TODO if ArchiveProvider needs to handle a lot of requests, we should add
// caching for responses that are known not to change (save for methods
// returning a buffer). Right now, we are doing IO every time these methods are
// called.

/**
 * Provide bundles from a directory of precompiled apps
 *
 * Archive provider expects directories to have a particular layout. The
 * following example shows a root folder named `archives`. The root should have
 * a set of folders organized by application short name. Each app folder has a
 * list of archives whose titles are semantic versions. The extension is `zip`
 * by default. An alternative extension can be passed to
 * {@link ArchiveProvider.create}
 * options.
 *
 * ```
 *     archives
 *     ├── platformer
 *     │   ├── v0.1.0.zip
 *     │   ├── v0.2.0.zip
 *     │   └── v1.0.0.zip
 *     └── shooter
 *         ├── v1.13.1.zip
 *         ├── v1.15.0.zip
 *         └── v2.0.0.zip
 * ```
 *
 * This provider is ideal for production environments where access to changes
 * or individual files is not important.
 *
 * @class module:providers#ArchiveProvider
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
 * @private
 */
function contains(str, substr) {
  return str.indexOf(substr) !== -1;
}

/**
 * Given a list of semver strings, get the latest one
 * @private
 */

function latestVersion(versions) {
  var list =  versions.slice(0).sort(semver.rcompare);
  return list[0];
}

/**
 * Get versions from archives
 *
 * @param {String} base - the app name
 * @param {Array<String>} archives
 * @param {String} ext
 * @private
 */

function archiveVersions(name, archives, ext) {
  return archives.filter(function (a) {
    return contains(a, name);
  }).map(function (s) {
    return s.replace('.' + ext, '').replace(name + '/', '');
  });
}

/**
 * Read a manifest from an archive
 * @private
 */

function readManifest(archivePath) {
  // TODO zip should be async
  var manifest = JSON.parse(zip.readFileAsText(archivePath, 'manifest.json'));
  return Promise.resolve(manifest);
}

ArchiveProvider.prototype.getApps = function () {

  return Promise.all([
    glob('*/', {cwd: this.path}),
    glob('**/*.' + this.ext, {cwd: this.path})
  ]).bind(this).spread(function (names, archives) {
    var ext = this.ext;
    return names.map(function (name) {
      name = name.replace('/', '');
      return {
        name: name,
        versions: archiveVersions(name, archives, ext)
      };
    });
  }).map(function (app) {
    var latest = latestVersion(app.versions);
    var archive = path.join(this.path, app.name, latest + '.' + this.ext);
    // nested handler since we need app objects that were passed in
    return readManifest(archive).then(function (manifest) {
      return ApplicationSummary.fromManifest(manifest);
    }).catch(MisconfiguredApplicationError, function (err) {
      // Archive doesn't have required properties in manifest.
      console.log(err);
      return null;
    });
  }).filter(function (app) {
    // Remove misconfigured apps from the collection
    return app !== null;
  });
};

ArchiveProvider.prototype.getAttributes = function getLatestBundle(appName) {
  return glob(appName + '/*.' + this.ext, {
    cwd: this.path
  }).bind(this).then(function (archives) {
    var versions = archiveVersions(appName, archives, this.ext);
    var latest = latestVersion(versions);
    var archive = path.join(this.path, appName, latest + '.' + this.ext);

    return readManifest(archive).then(function (manifest) {
      return Application.fromManifestAndVersions(manifest, versions);
    });
  });
};

ArchiveProvider.prototype.getLatestBundle = function getLatestBundle(appName) {
  return this.getAttributes(appName).bind(this).then(function (app) {
    var latest = app.versions[app.versions.length - 1];
    return this.getBundle(appName, latest);
  });
};

ArchiveProvider.prototype.getBundle = function getBundle(appName, appVersion) {
  var bundle = path.join(this.path, appName, appVersion + '.' + this.ext);
  return Promise.resolve(bundle);
};

/**
 * Archives are immutable. No changes will happen.
 * @override
 */

ArchiveProvider.prototype.awaitChanges = function awaitChanges() {
  return Promise.reject(new CapabilityError('ArchiveProvider'));
};

/**
 * List files owned by a particular version of the app
 *
 * For the ArchiveProvider this means opening a zip and creating a list by
 * enumerating the contents. Delegate to zip util.
 */

ArchiveProvider.prototype.getFileList = function getFileList(name, version) {
  return this.getBundle(name, version).then(function (archivePath) {
    return zip.listFiles(archivePath);
  });
};

/**
 * read a file as a buffer
 */

ArchiveProvider.prototype.getFile = function getFile(name, version, file) {
  return this.getBundle(name, version).then(function (archivePath) {
    return zip.readFile(archivePath, file);
  });
};

/**
 * read a file as a buffer for latest version
 */

ArchiveProvider.prototype.getLatestFile = function getLatestFile(name, file) {
  return this.getLatestBundle(name).then(function (archivePath) {
    return zip.readFile(archivePath, file);
  });
};

// ArchiveProvider capablities
var capabilities = ProviderCapabilities.create({
  watchable: false,
  bundles: true,
  getFile: true,
  getFileList: true,
});

/**
 * Ensure correct options for archive provider
 *
 * @throws TypeError
 * @private
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
exports.capabilities = capabilities;
