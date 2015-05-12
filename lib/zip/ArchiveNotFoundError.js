function ArchiveNotFoundError(message) {
    this.message = message;
    this.name = 'ArchiveNotFoundError';
    Error.captureStackTrace(this, ArchiveNotFoundError);
}

ArchiveNotFoundError.prototype = Object.create(Error.prototype);
ArchiveNotFoundError.prototype.constructor = ArchiveNotFoundError;

module.exports = ArchiveNotFoundError;
