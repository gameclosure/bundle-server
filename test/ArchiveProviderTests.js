var ArchiveProvider = require(__lib + '/providers/ArchiveProvider');
var path = require('path');

var providerTests = require(test('ProviderTests'));

// TODO abstract provider tests from any concrete provider. This is achieveable
// by specifying some setup/teardown functions for various test types.

var archiveProvider = {
  name: 'ArchiveProvider',
  setup: function () {
    this.provider = ArchiveProvider.create({
      ext: 'zip',
      path: path.join(__fixtures, 'archives')
    });
  }
};

providerTests.unitTests(archiveProvider);

