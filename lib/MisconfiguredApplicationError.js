function MisconfiguredApplicationError(message) {
    this.message = message;
    this.name = 'MisconfiguredApplicationError';
    Error.captureStackTrace(this, MisconfiguredApplicationError);
}

MisconfiguredApplicationError.prototype = Object.create(Error.prototype);
MisconfiguredApplicationError.prototype.constructor =
  MisconfiguredApplicationError;

module.exports = MisconfiguredApplicationError;
