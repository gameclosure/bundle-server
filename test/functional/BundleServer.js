var ArchiveProvider = require(lib('providers/ArchiveProvider'));
var BundleServer = require(lib('BundleServer'));
var path = require('path');
var http = require('http');
var request = require('superagent');
var zip = require(lib('zip'));
var fs = require('fs');

var archiveProvider = {
  name: 'ArchiveProvider',
  setup: function () {
    this.provider = ArchiveProvider.create({
      ext: 'zip',
      path: path.join(__fixtures, 'archives')
    });
  },
  capabilities: ArchiveProvider.capabilities
};

var port = 3333;
function location(endpoint) {
  return 'http://localhost:' + port + endpoint;
}

describe('BundleServer', function () {
  var appName = 'shooter';

  before(function () {
    archiveProvider.setup.call(this);
    assert(this.provider);

    var bundleServer = BundleServer.create({provider: this.provider});
    this.server = http.createServer(bundleServer.getExpressApp());
    this.server.listen(port);
  });

  after(function () {
    this.server.close();
  });

  describe('/capabilities', function () {
    it('returns a capabilities object', function (done) {
      request
      .get(location('/capabilities'))
      .end(function (err, res) {
        var capabilities = JSON.parse(res.text);
        assert('watchable' in capabilities);
        assert('bundles' in capabilities);
        assert('getFile' in capabilities);
        assert('getFileList' in capabilities);
        assert.equal(capabilities.watchable,
                     this.provider.capabilities.watchable);
        assert.equal(capabilities.bundles,
                     this.provider.capabilities.bundles);
        assert.equal(capabilities.getFile,
                     this.provider.capabilities.getFile);
        assert.equal(capabilities.getFileList,
                     this.provider.capabilities.getFileList);
        done();
      }.bind(this));
    });
  });

  describe('/apps', function () {
    it('returns a list of applications', function (done) {
      request
      .get(location('/apps'))
      .end(function (err, res) {
        assert(!err);
        assert.equal(res.status, 200);
        var apps = JSON.parse(res.text);
        assert(Array.isArray(apps));
        apps.forEach(function (app) {
          assert(app.id);
          assert(app.name);
          assert(app.description);
          assert(app.icon);
          assert(app.splash);
        });
        done();
      });
    });
  });

  describe('/:app_id', function () {
    it('returns the application metadata', function (done) {
      request
      .get(location('/' + appName))
      .end(function (err, res) {
        assert(!err);
        assert.equal(res.status, 200);
        var app = JSON.parse(res.text);
        assert(app.id);
        assert(app.name);
        assert(app.description);
        assert(app.icon);
        assert(app.splash);
        assert(Array.isArray(app.versions));
        app.versions.forEach(function (version) {
          assert(typeof version === 'string');
        });

        done();
      });
    });

    it('returns a 404 when app is invalid', function (done) {
      request
      .get(location('/not_an_application'))
      .end(function (err, res) {
        assert(err);
        assert(res.notFound);
        done();
      });
    });
  });

  function testBundleFetch(url, versionCheck) {
    var filePath = '/tmp/bundle_server_test_shooter.zip';
    after(function (done) { fs.unlink(filePath, done); });

    it('returns the specified bundle', function (done) {
      request
      .get(url)
      .end(function (err, res) {
        assert.equal(res.header['content-type'], 'application/zip');
        var stream = fs.createWriteStream(filePath);

        stream.on('finish', function () {
          var str = zip.readFileAsText(filePath, 'manifest.json');
          assert(str && typeof str === 'string');
          var manifest = JSON.parse(str);
          assert(manifest.appID);
          assert(manifest.shortName);
          if (versionCheck) {
            assert(versionCheck.indexOf(manifest.version) !== -1);
          }
          done();
        });

        res.pipe(stream);
      });
    });
  }

  describe('/:app_id/bundle/latest', function () {
    testBundleFetch(location('/shooter/bundle/latest'));
  });

  describe('/:app_id/bundle/:version', function () {
    testBundleFetch(location('/shooter/bundle/v2.0.0'), 'v2.0.0');
  });

  describe('/:app_id/file/:version/:path', function () {
    function requestManifest(version, done) {
      request
      .get(location('/shooter/file/' + version + '/manifest.json'))
      .end(function (err, res) {
        assert.equal(res.header['content-type'], 'application/json');
        var manifest = JSON.parse(res.text);
        assert(manifest.appID);
        assert(manifest.shortName);
        done();
      });
    }
    it('returns manifest when path is manifest.json', function (done) {
      requestManifest('v2.0.0', done);
    });

    it('handles the :version latest', function (done) {
      requestManifest('latest', done);
    });

    it('sends a 404 when file is not found', function (done) {
      request
      .get(location('/shooter/file/v2.0.0/arst.png.jpeg.js.com.io'))
      .end(function (err, res) {
        assert(err);
        assert(res.notFound);
        done();
      });
    });
  });

  // describe('/:app_id/files', function () {
  //   it('returns an array of relative paths', function (done) {
  //     request
  //     .get(location('/arstarst/files'))
  //     .end(function (err, res) {
  //   });

  //   it('sends a 404 when app_id is invalid', function (done) {
  //     request
  //     .get(location('/arstarst/files'))
  //     .end(function (err, res) {
  //       assert(err);
  //       assert(res.notFound);
  //       done();
  //     });
  //   });
  // });
});
