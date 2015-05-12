var ArchiveProvider = require(__lib + '/providers/ArchiveProvider');
var path = require('path');

describe('ArchiveProvider', function () {
  before(function () {
    this.provider = ArchiveProvider.create({
      ext: 'zip',
      path: path.join(__fixtures, 'archives')
    });
  });

  describe('getApps', function () {
    it('returns a promise', function () {
      assert(this.provider.getApps() instanceof Promise);
    });

    it('resolves to an array', function (done) {
      this.provider.getApps().then(function (apps) {
        assert(Array.isArray(apps));
      }).then(done, done);
    });

    it('resolves an array of app metadata objects', function (done) {
      this.provider.getApps().then(function (apps) {
        assert(Array.isArray(apps));
        apps.forEach(function (app) {
          assert.equal(app.toString(), '[object Object]');
          assert(app.id);
          assert(app.name);
          assert(app.description);
          assert(app.icon);
          assert(app.splash);
        });
      }).then(done, done);
    });

  });

});
