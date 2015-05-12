/**
 * Provider error for required methods
 *
 * Any required method which has not been implemented must either throw or
 * return a rejected promise with this error. The base Provider class stubs all
 * methods with this error.
 */

function UnimplementedError(message) {
    this.message = message;
    this.name = 'UnimplementedError';
    Error.captureStackTrace(this, UnimplementedError);
}

UnimplementedError.prototype = Object.create(Error.prototype);
UnimplementedError.prototype.constructor = UnimplementedError;

module.exports = UnimplementedError;
