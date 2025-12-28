import { Token } from '../entities/token.entity';
import { User } from '../entities/user.entity';

/**
 * Represents the result of a successful authentication operation.
 *
 * @description
 * This interface encapsulates the data returned upon a successful login or registration,
 * providing access to the authenticated {@link User} and their associated {@link Token}.
 */
export interface AuthResult {
    /**
     * The authenticated {@link User} entity.
     */
    readonly user: User;

    /**
     * The authentication {@link Token} used for subsequent requests.
     */
    readonly token: Token;
}
