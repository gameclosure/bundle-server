/**
 * @class
 * @property {bool} watchable - awaitChanges and 'change' event are supported
 * @property {bool} bundles - getBundle, getLatestBundle supported
 * @property {bool} getFile - getFile supported
 * @property {bool} getFileList - getFileList supported
 */

function ProviderCapabilities() {
  this.watchable = false;
  this.bundles = false;
  this.getFile = false;
  this.getFileList = false;
}

/**
 * Create a new ProviderCapabilities object with provided options
 *
 * @static
 * @param {boolean} opts.watchable
 * @param {boolean} opts.bundles
 * @param {boolean} opts.getFile
 * @param {boolean} opts.getFileList
 */

ProviderCapabilities.create = function (opts) {
  var obj = new ProviderCapabilities();
  obj.watchable = opts.watchable;
  obj.bundles = opts.bundles;
  obj.getFile = opts.getFile;
  obj.getFileList = opts.getFileList;

  Object.freeze(obj);
  return obj;
};

module.exports = ProviderCapabilities;
