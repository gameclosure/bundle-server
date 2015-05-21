function FileNotFoundError(message) {
    this.message = message;
    this.name = 'FileNotFoundError';
    Error.captureStackTrace(this, FileNotFoundError);
}

FileNotFoundError.prototype = Object.create(Error.prototype);
FileNotFoundError.prototype.constructor = FileNotFoundError;

module.exports = FileNotFoundError;
