/**
 * Represents an authentication token entity.
 */
export class Token {
    /** The access token used for authorized requests. */
    readonly accessToken: string;

    /** The refresh token used to obtain a new access token. */
    readonly refreshToken: string;

    /** The expiration date and time of the access token. */
    readonly expiresAt: Date;

    /**
     * Creates an instance of Token.
     * @param accessToken - The access token string.
     * @param refreshToken - The refresh token string.
     * @param expiresAt - The expiration date of the token.
     */
    constructor(accessToken: string, refreshToken: string, expiresAt: Date) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.expiresAt = expiresAt;
    }
}
