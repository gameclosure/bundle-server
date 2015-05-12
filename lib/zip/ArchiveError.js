function ArchiveError(message) {
    this.message = message;
    this.name = 'ArchiveError';
    Error.captureStackTrace(this, ArchiveError);
}

ArchiveError.prototype = Object.create(Error.prototype);
ArchiveError.prototype.constructor = ArchiveError;

module.exports = ArchiveError;
