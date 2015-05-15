function Application() {
  this.id = null;
  this.name = null;
  this.description = null;
  this.icon = null;
  this.splash = null;
  this.versions = [];
}

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
