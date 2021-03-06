var ArchiveProvider = require(lib('providers/ArchiveProvider'));
var path = require('path');

var providerTests = require(test('unit/ProviderTests'));

// TODO abstract provider tests from any concrete provider. This is achieveable
// by specifying some setup/teardown functions for various test types.

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

providerTests.unitTests(archiveProvider);

