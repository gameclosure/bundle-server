var Application = require(lib('Application'));
var ApplicationSummary = require(lib('ApplicationSummary'));
var Provider = require(lib('providers/Provider'));
var CapabilityError = require(lib('providers/CapabilityError'));

function providerUnitTests(provider) {
  describe(provider.name, function () {
    before(function () {
      provider.setup.call(this);
      assert(this.provider instanceof Provider);
    });

    var appName = 'shooter';
    var manifestFile = 'manifest.json';
    var version = 'v2.0.0';

    if (provider.capabilities.bundles) {
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

      describe('#getLatestBundle', function () {
        it('returns a promise', function () {
          assert(this.provider.getLatestBundle(appName) instanceof Promise);
        });

        it('resolves to a String', function (done) {
          this.provider.getLatestBundle(appName).then(function (bundle) {
            assert(typeof bundle === 'string');
          }).then(done, done);
        });

        it('returns a valid file path', function (done) {
          var fs = require('fs');
          this.provider.getLatestBundle(appName).then(function (bundle) {
            fs.stat(bundle, function (err, stats) {
              if (err) { return done(err); }
              assert(stats.isFile());
            });
          }).then(done, done);
        });
      });

      describe('#getBundle', function () {
        it('returns a promise', function () {
          assert(this.provider.getBundle(appName, version) instanceof Promise);
        });

        it('resolves to a String', function (done) {
          this.provider.getBundle(appName, version).then(function (bundle) {
            assert(typeof bundle === 'string');
          }).then(done, done);
        });

        it('returns a valid file path', function (done) {
          var fs = require('fs');
          this.provider.getBundle(appName, version).then(function (bundle) {
            fs.stat(bundle, function (err, stats) {
              if (err) { return done(err); }
              assert(stats.isFile());
            });
          }).then(done, done);
        });
      });
    }

    describe('#watchable', function () {
      if (provider.capabilities.watchable) {
        // TODO
      } else {
        it('should reject with a CapabilityError', function (done) {
          function inverseDone(err) {
            if (!err || !(err instanceof CapabilityError)) {
              done(new Error('did not reject with CapabilityError'));
            } else {
              done();
            }
          }

          this.provider.awaitChanges().then(inverseDone, inverseDone);
        });
      }
    });

    if (provider.capabilities.getFile) {
      function createGetFileTests() {
        it('returns a promise', function () {
          assert(this.getFile() instanceof Promise);
        });

        it('resolves a Buffer', function (done) {
          this.getFile().then(function (res) {
            assert(res instanceof Buffer);
          }).then(done, done);
        });

        it('returns the correct file', function (done) {
          this.getFile().then(function (buffer) {
            // this should be returning a Buffer that has the contents of the
            // manifest. We just check file identity by making sure the manifest
            // has some of the expected fields
            assert(buffer instanceof Buffer);
            var str = buffer.toString();
            var manifest = JSON.parse(str);
            assert(manifest.appID);
            assert(manifest.shortName);
          }).then(done, done);
        });
      }

      describe('#getFile', function () {
        before(function () {
          this.getFile = function () {
            return this.provider.getFile(appName, version , manifestFile);
          };
        });

        after(function () {
          this.getFile = void 0;
        });

        createGetFileTests.call(this);
      });

      describe('#getLatestFile', function () {
        before(function () {
          this.getFile = function () {
            return this.provider.getLatestFile(appName, manifestFile);
          };
        });

        after(function () {
          this.getFile = void 0;
        });

        createGetFileTests.call(this);
      });
    }

    if (provider.capabilities.getFileList) {
      describe('#getFileList', function () {
        before(function () {
          this.getFileList = function () {
            return this.provider.getFileList(appName, version);
          };
        });

        after(function () {
          this.getFileList = void 0;
        });

        it('returns a promise', function () {
          assert(this.getFileList() instanceof Promise);
        });

        it('resolves to an array of strings', function (done) {
          this.getFileList().then(function (list) {
            assert(Array.isArray(list));
            list.forEach(function (item) {
              assert(typeof item === 'string');
            });

          }).then(done, done);
        });
      });
    }
  });
}

exports.unitTests = providerUnitTests;

