import type { ResultType } from '@core/config/result';
import type { AuthException } from '../../exceptions/auth.exceptions';
import type { AuthResult } from '../../models/auth-result.model';
import type { Credentials } from '../../models/credentials.model';

/**
 * Input port interface for sign in with email use case.
 */
export interface SignInWithEmailPort {
    /**
     * Executes sign in with email and password.
     * @param credentials - The user's email and password.
     * @returns A Result containing the authentication result or an error.
     */
    execute(credentials: Credentials): Promise<ResultType<AuthResult, AuthException>>;
}
