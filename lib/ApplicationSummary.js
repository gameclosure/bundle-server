function ApplicationSummary() {
  this.id = null;
  this.name = null;
  this.description = null;
  this.icon = null;
  this.splash = null;
}

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
