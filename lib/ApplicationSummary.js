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
 */

ApplicationSummary.fromManifest = function (manifest) {
  var summary = new ApplicationSummary();

  summary.id = manifest.appID;
  summary.name = manifest.title;
  summary.description = manifest.description;
  summary.icon = manifest.icon;
  summary.splash = manifest.splash.universal;

  return summary;
};

module.exports = ApplicationSummary;
