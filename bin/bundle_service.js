#!/usr/bin/env node

var assert = require('assert');
var argv = require('minimist')(process.argv.slice(3));
var path = require('path');

// Helper functions for getting paths
var paths = (function () {
  var join = path.join.bind(null, '..');
  var pathJoinLib = join.bind(null, 'lib');
  var pathJoinTests = join.bind(null, 'test');

  return {
    lib: function () { return pathJoinLib.apply(null, arguments); },
    tests: function () { return pathJoinTests.apply(null, arguments); }
  };
})();

// Valid commands
var commands = {
  run: Run
};

// Check that we are running a valid command
var cmd = commands[process.argv[2]];
assert(cmd);

cmd();

/**
 * Run a bundle server
 */
function Run() {
  var BundleServer = require(paths.lib('BundleServer'));
  var provider;

  switch (argv.provider) {
    case 'archive':
      var ArchiveProvider = require(paths.lib('providers', 'ArchiveProvider'));
      provider = ArchiveProvider.create({
        path: path.resolve(argv.path || paths.tests('fixtures/archives'))
      });
      break;
    default:
      console.error('Must specify valid provider (--provider archive)');
      process.exit(1);
  }

  var server = BundleServer.create({ provider: provider, argv: argv});
  var port = argv.port || 3000;
  server.getExpressApp().listen(port, function () {
    console.log('listening on port', port);
  });
}
