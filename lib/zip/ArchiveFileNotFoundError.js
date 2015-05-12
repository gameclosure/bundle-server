function ArchiveFileNotFoundError(message) {
    this.message = message;
    this.name = 'ArchiveFileNotFoundError';
    Error.captureStackTrace(this, ArchiveFileNotFoundError);
}

ArchiveFileNotFoundError.prototype = Object.create(Error.prototype);
ArchiveFileNotFoundError.prototype.constructor = ArchiveFileNotFoundError;

module.exports = ArchiveFileNotFoundError;
