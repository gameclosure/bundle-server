var Application = require(lib('Application'));
var ApplicationSummary = require(lib('ApplicationSummary'));

function providerUnitTests(provider) {
  describe(provider.name, function () {
    before(provider.setup);

    describe('#getApps', function () {
      it('returns a promise', function () {
        assert(this.provider.getApps() instanceof Promise);
      });

      it('resolves to an array', function (done) {
        this.provider.getApps().then(function (apps) {
          assert(Array.isArray(apps));
        }).then(done, done);
      });

      it('resolves an array of ApplicationSummary', function (done) {
        this.provider.getApps().then(function (apps) {
          assert(Array.isArray(apps));
          apps.forEach(function (app) {
            assert(app instanceof ApplicationSummary);
            assert(app.id);
            assert(app.name);
            assert(app.description);
            assert(app.icon);
            assert(app.splash);
          });
        }).then(done, done);
      });

    });

    describe('#getAttributes', function () {
      var appName = 'shooter';
      it('returns a promise', function () {
        assert(this.provider.getAttributes(appName) instanceof Promise);
      });

      it('resolves to an Application', function () {
        this.provider.getAttributes(appName).then(function (attrs) {
          assert(attrs instanceof Application);
        });

      });

      it('contains the correct data', function () {
        this.provider.getAttributes(appName).then(function (attrs) {
          assert(attrs.id);
          assert(attrs.name);
          assert(attrs.description);
          assert(attrs.icon);
          assert(attrs.splash);
          assert(attrs.versions);
          assert(Array.isArray(attrs.versions));
        });
      });
    });
  });
}

exports.unitTests = providerUnitTests;

