var express = require('express');
var ApplicationNotFoundError = require('./ApplicationNotFoundError');
var FileNotFoundError = require('./FileNotFoundError');
var mime = require('mime');

/**
 * Serve devkit applications
 *
 * The BundleServer wraps an instance of some class which implements the
 * {@link Provider} interface.
 */

function BundleServer(provider) {
  var app = this.app = express();

  app.get('/apps', function (req, res, next) {
    provider.getApps().then(function (apps) {
      res.json(apps);
    }).catch(next);
  });

  app.get('/capabilities', function (req, res) {
    res.json(provider.capabilities);
  });

  app.get('/:app_id', function (req, res, next) {
    var app_id = req.params.app_id;
    provider.getAttributes(app_id).then(function (attrs) {
      res.json(attrs);
    }).catch(next);
  });

  app.get('/:app_id/bundle/latest', function (req, res, next) {
    var app_id = req.params.app_id;
    provider.getLatestBundle(app_id).then(function (archivePath) {
      res.sendFile(archivePath);
    }).catch(next);
  });

  app.get('/:app_id/bundle/:version', function (req, res, next) {
    var version = req.params.version;
    var app_id = req.params.app_id;

    provider.getBundle(app_id, version).then(function (archivePath) {
      res.sendFile(archivePath);
    }).catch(next);
  });

  if (provider.capabilities.watchable) {
    // TODO
    app.get('/:app_id/watch', function (req, res, next) {
      next(new Error('not implemented'));
    });
  }

  if (provider.capabilities.getFile) {
    app.get('/:app_id/file/:version/*', function (req, res, next) {
      var file = req.params[0];
      var app_id = req.params.app_id;
      var version = req.params.version;

      provider.getFile(app_id, version, file).then(function (buffer) {
        res.set('Content-Type', mime.lookup(file));
        res.send(buffer);
      }).catch(next);
    });
  }

  // if (provider.capabilities.getFileList) {
  //   app.get('/:app_id/files', function (req, res, next) {

  //   });
  // }

  app.use(function (err, req, res, next) {
    var notFound =
      err instanceof ApplicationNotFoundError ||
      err instanceof FileNotFoundError;

    if (notFound) {
      return res.status(404).end();
    }

    return res.status(500).end();
  });
}

BundleServer.prototype.getExpressApp = function getExpressApp() {
  return this.app;
};

BundleServer.create = function (opts) {
  var server = new BundleServer(opts.provider);
  return server;
};

module.exports = BundleServer;
