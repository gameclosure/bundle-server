var MisconfiguredApplicationError = require('./MisconfiguredApplicationError');

/**
 * @class
 * @property {String} id - app uuid
 * @property {String} name - app shortname
 * @property {String} desc - latest description
 * @property {String} icon - latest relative icon path
 * @property {String} splash - latest relative splash path
 */

function ApplicationSummary() {
  this.id = null;
  this.name = null;
  this.description = null;
  this.icon = null;
  this.splash = null;
}

/**
 * Create an {@link ApplicationSummary} from a manifest
 * @static
 * @param {Object} manifest - manifest.json from the app bundle
 * @param {Array<String>} versions - list of available app versions
 *
 * @throws MisconfiguredApplicationError
 */

ApplicationSummary.fromManifest = function (manifest) {
  var summary = new ApplicationSummary();

  try {
    summary.id = manifest.appID;
    summary.name = manifest.title;
    summary.description = manifest.description;
    summary.icon = manifest.icon;
    summary.splash = manifest.splash.universal;
  } catch (e) {
    if (e instanceof TypeError) {
      var msg = [
        'Error parsing manifest for ', manifest.shortName, ': ', e.message
      ].join('');
      throw new MisconfiguredApplicationError(msg);
    } else {
      throw e;
    }
  }

  return summary;
};

module.exports = ApplicationSummary;
