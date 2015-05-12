/**
 * Provider error when a capability is unsupported
 *
 * Providers which do not support a feature should overwrite the base
 * implementation with a method that throws/rejects with this error.
 */

function CapabilityError(message) {
    this.message = message;
    this.name = 'CapabilityError';
    Error.captureStackTrace(this, CapabilityError);
}

CapabilityError.prototype = Object.create(Error.prototype);
CapabilityError.prototype.constructor = CapabilityError;

module.exports = CapabilityError;
