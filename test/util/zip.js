var path = require('path');
var zip = require(path.join(__lib, 'zip'));

var ArchiveNotFoundError = require(lib('zip', 'ArchiveNotFoundError'));
var ArchiveFileNotFoundError = require(lib('zip', 'ArchiveFileNotFoundError'));

describe('util.zip', function () {
  var archivePath = path.join(__fixtures, 'generic.zip');

  describe('#readFile', function () {
    it('returns a buffer', function () {
      var val = zip.readFile(archivePath, 'manifest.json');
      assert(val instanceof Buffer);
    });

    it('throws when the archive is not found', function () {
      assert.throws(function () {
        zip.readFile('arst', 'manifest.json');
      }, ArchiveNotFoundError);
    });

    it('throws when file not in archive', function () {
      assert.throws(function () {
        zip.readFile(archivePath, 'arst');
      }, ArchiveFileNotFoundError);
    });
  });

  describe('#readFileAsText', function () {
    it('returns a string', function () {
      var val = zip.readFileAsText(archivePath, 'manifest.json');
      assert(typeof val === 'string');
    });

    it('throws when the archive is not found', function () {
      assert.throws(function () {
        zip.readFileAsText('arst', 'manifest.json');
      }, ArchiveNotFoundError);
    });

    it('throws when file not in archive', function () {
      assert.throws(function () {
        zip.readFileAsText(archivePath, 'arst');
      }, ArchiveFileNotFoundError);
    });
  });
});
