/**
 * Base exception class for authentication-related errors.
 * All authentication exceptions extend this base class.
 */
export class AuthException extends Error {
    readonly code: string;

    constructor(message: string, code: string) {
        super(message);
        this.name = 'AuthException';
        this.code = code;
    }
}

/**
 * Thrown when the provided credentials are invalid.
 */
export class InvalidCredentialsException extends AuthException {
    constructor(message = 'Invalid email or password') {
        super(message, 'INVALID_CREDENTIALS');
        this.name = 'InvalidCredentialsException';
    }
}

/**
 * Thrown when the requested user is not found.
 */
export class UserNotFoundException extends AuthException {
    constructor(message = 'User not found') {
        super(message, 'USER_NOT_FOUND');
        this.name = 'UserNotFoundException';
    }
}

/**
 * Thrown when attempting to register with an email that already exists.
 */
export class EmailAlreadyExistsException extends AuthException {
    constructor(message = 'Email already in use') {
        super(message, 'EMAIL_ALREADY_EXISTS');
        this.name = 'EmailAlreadyExistsException';
    }
}

/**
 * Thrown when the provided password does not meet security requirements.
 */
export class WeakPasswordException extends AuthException {
    constructor(message = 'Password is too weak') {
        super(message, 'WEAK_PASSWORD');
        this.name = 'WeakPasswordException';
    }
}

/**
 * Thrown when a network error occurs during authentication.
 */
export class NetworkException extends AuthException {
    constructor(message = 'Network error occurred') {
        super(message, 'NETWORK_ERROR');
        this.name = 'NetworkException';
    }
}

/**
 * Thrown when the user's session has expired.
 */
export class SessionExpiredException extends AuthException {
    constructor(message = 'Session has expired') {
        super(message, 'SESSION_EXPIRED');
        this.name = 'SessionExpiredException';
    }
}

/**
 * Thrown when the Google authentication popup is closed by the user.
 */
export class PopupClosedException extends AuthException {
    constructor(message = 'Authentication popup was closed') {
        super(message, 'POPUP_CLOSED');
        this.name = 'PopupClosedException';
    }
}

/**
 * Thrown when an unknown authentication error occurs.
 */
export class UnknownAuthException extends AuthException {
    constructor(message = 'An unknown authentication error occurred') {
        super(message, 'UNKNOWN_ERROR');
        this.name = 'UnknownAuthException';
    }
}

/**
 * Type guard to check if an object has Firebase error shape.
 */
function isFirebaseError(error: unknown): error is { code?: string; message?: string } {
    return typeof error === 'object' && error !== null;
}

/**
 * Maps Firebase Auth error codes to domain exceptions.
 * @param error - The Firebase error object (unknown type for compatibility with Result.fromPromise).
 * @returns The corresponding domain exception.
 */
export function mapFirebaseAuthError(error: unknown): AuthException {
    if (!isFirebaseError(error)) {
        return new UnknownAuthException('An unknown error occurred');
    }

    const code = error.code ?? '';
    const message = typeof error.message === 'string' ? error.message : 'An unknown error occurred';

    switch (code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/invalid-email':
            return new InvalidCredentialsException();
        case 'auth/user-not-found':
            return new UserNotFoundException();
        case 'auth/email-already-in-use':
            return new EmailAlreadyExistsException();
        case 'auth/weak-password':
            return new WeakPasswordException();
        case 'auth/network-request-failed':
            return new NetworkException();
        case 'auth/popup-closed-by-user':
            return new PopupClosedException();
        case 'auth/id-token-expired':
        case 'auth/session-expired':
            return new SessionExpiredException();
        default:
            return new UnknownAuthException(message);
    }
}
