/**
 * @class
 * @property {String} id app uuid
 * @property {String} name app name
 * @property {String} description latest description
 * @property {String} icon latest relative icon path
 * @property {String} splash latest relative splash path
 * @property {String[]} versions
 */

function Application() {
  this.id = '';
  this.name = '';
  this.description = '';
  this.icon = '';
  this.splash = '';
  this.versions = [];
}

/**
 * Create an {@link Application} from a manifest and version list
 * @static
 * @param {Object} manifest - manifest.json from the app bundle
 * @param {Array<String>} versions - list of available app versions
 */

Application.fromManifestAndVersions = function (manifest, versions) {
  var app = new Application();
  app.id = manifest.appID;
  app.name = manifest.title;
  app.description = manifest.description;
  app.icon = manifest.icon;
  app.splash = manifest.splash.universal;
  for (var i = 0; i !== versions.length; i++) {
    app.versions.push(versions[i]);
  }

  return app;
};

module.exports = Application;
