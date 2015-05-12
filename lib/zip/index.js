var Zip = require('adm-zip');
var ArchiveNotFoundError = require('./ArchiveNotFoundError');
var ArchiveFileNotFoundError = require('./ArchiveFileNotFoundError');
var ArchiveError = require('./ArchiveError');

function openZip(archive) {
  try {
    var zip = new Zip(archive);
  } catch (e) {
    switch (e) {
      case 'Invalid filename':
        throw new ArchiveNotFoundError(archive);
      default:
        console.error(e);
        throw e;
    }
  }

  zip.$archive = archive;

  return zip;
}

function getEntry(zip, file) {
  var entry = zip.getEntry(file);
  if (!entry) {
    throw new ArchiveFileNotFoundError(zip.$archive + ': ' + file);
  }

  return entry;
}

function readFile(archive, file) {
  var zip = openZip(archive);
  var entry = getEntry(zip, file);

  try {
    return zip.readFile(entry);
  } catch (e) {
    return ArchiveError(archive + '; ' + file);
  }
}

function readFileAsText(archive, file) {
  var zip = openZip(archive);
  var entry = getEntry(zip, file);

  try {
    return zip.readAsText(entry);
  } catch (e) {
    return ArchiveError(archive + '; ' + file);
  }
}

exports.readFile = readFile;
exports.readFileAsText = readFileAsText;
