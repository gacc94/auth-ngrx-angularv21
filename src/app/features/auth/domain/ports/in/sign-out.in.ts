import type { ResultType } from '@core/config/result';
import type { AuthException } from '../../exceptions/auth.exceptions';

/**
 * Input port interface for sign out use case.
 */
export interface SignOutPort {
    /**
     * Executes user sign out.
     * @returns A Result indicating success or an error.
     */
    execute(): Promise<ResultType<void, AuthException>>;
}
