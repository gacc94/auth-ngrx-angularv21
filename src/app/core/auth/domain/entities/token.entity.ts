/**
 * Represents an authentication token entity.
 * Manages token lifecycle including expiration and validation.
 */
export class Token {
    /** The access token used for authorized requests. */
    readonly accessToken: string;

    /** The refresh token used to obtain a new access token. */
    readonly refreshToken: string;

    /** The expiration date and time of the access token. */
    readonly expiresAt: Date;

    /** The date and time when the token was issued. */
    readonly issuedAt: Date;

    /** The type of token (e.g., 'Bearer'). */
    readonly tokenType: string;

    /**
     * Creates an instance of Token.
     * @param accessToken - The access token string.
     * @param refreshToken - The refresh token string.
     * @param expiresAt - The expiration date of the token.
     * @param issuedAt - The date when the token was issued.
     * @param tokenType - The type of token, defaults to 'Bearer'.
     */
    constructor(accessToken: string, refreshToken: string, expiresAt: Date, issuedAt: Date = new Date(), tokenType: string = 'Bearer') {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.expiresAt = expiresAt;
        this.issuedAt = issuedAt;
        this.tokenType = tokenType;
    }

    /**
     * Checks if the token has expired.
     * @returns True if the current time is past the expiration time.
     */
    isExpired(): boolean {
        return new Date() >= this.expiresAt;
    }

    /**
     * Checks if the token is valid.
     * A token is valid if it has not expired and has a non-empty access token.
     * @returns True if the token is valid.
     */
    isValid(): boolean {
        return !this.isExpired() && this.accessToken.length > 0;
    }

    /**
     * Gets the remaining time until the token expires in milliseconds.
     * @returns The remaining time in milliseconds, or 0 if expired.
     */
    getRemainingTime(): number {
        const remaining = this.expiresAt.getTime() - Date.now();
        return remaining > 0 ? remaining : 0;
    }
}
