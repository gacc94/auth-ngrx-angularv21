import type { IdTokenResult } from '@angular/fire/auth';
import { Token } from '../../domain/entities/token.entity';

/**
 * Maps Firebase IdTokenResult to domain Token entity.
 */
export class TokenMapper {
    /**
     * Converts a Firebase IdTokenResult to a domain Token entity.
     * @param idTokenResult - The Firebase ID token result.
     * @returns A new Token domain entity.
     */
    static toEntity(idTokenResult: IdTokenResult): Token {
        const accessToken = idTokenResult.token;
        const expiresAt = new Date(idTokenResult.expirationTime);
        const issuedAt = new Date(idTokenResult.issuedAtTime);

        return new Token(
            accessToken,
            '', // Firebase handles refresh tokens internally
            expiresAt,
            issuedAt,
            'Bearer',
        );
    }

    /**
     * Creates a Token entity from an access token with a default expiration.
     * @param accessToken - The access token string.
     * @param expiresInMs - Expiration time in milliseconds from now (default 1 hour).
     * @returns A new Token domain entity.
     */
    static fromAccessToken(accessToken: string, expiresInMs = 3600000): Token {
        const now = new Date();
        const expiresAt = new Date(now.getTime() + expiresInMs);

        return new Token(accessToken, '', expiresAt, now, 'Bearer');
    }
}
