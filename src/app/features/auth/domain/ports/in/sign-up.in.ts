import type { ResultType } from '@core/config/result';
import type { AuthException } from '../../exceptions/auth.exceptions';
import type { AuthResult } from '../../models/auth-result.model';
import type { RegisterCredentials } from '../../models/credentials.model';

/**
 * Input port interface for user sign up use case.
 */
export interface SignUpPort {
    /**
     * Executes user sign up with email and password.
     * @param credentials - The registration credentials including name, email, and password.
     * @returns A Result containing the authentication result or an error.
     */
    execute(credentials: RegisterCredentials): Promise<ResultType<AuthResult, AuthException>>;
}
