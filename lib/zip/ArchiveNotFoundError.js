var ApplicationNotFoundError = require('../ApplicationNotFoundError');

function ArchiveNotFoundError(message) {
    ApplicationNotFoundError.call(this);
    this.message = message;
    this.name = 'ArchiveNotFoundError';
    Error.captureStackTrace(this, ArchiveNotFoundError);
}

ArchiveNotFoundError.prototype =
  Object.create(ApplicationNotFoundError.prototype);
ArchiveNotFoundError.prototype.constructor = ArchiveNotFoundError;

module.exports = ArchiveNotFoundError;
