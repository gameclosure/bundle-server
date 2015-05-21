var FileNotFoundError = require('../FileNotFoundError');

function ArchiveFileNotFoundError(message) {
    FileNotFoundError.call(this);
    this.message = message;
    this.name = 'ArchiveFileNotFoundError';
    Error.captureStackTrace(this, ArchiveFileNotFoundError);
}

ArchiveFileNotFoundError.prototype = Object.create(FileNotFoundError.prototype);
ArchiveFileNotFoundError.prototype.constructor = ArchiveFileNotFoundError;

module.exports = ArchiveFileNotFoundError;
