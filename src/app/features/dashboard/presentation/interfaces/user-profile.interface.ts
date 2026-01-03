/**
 * User profile data interface for display in sidenav.
 */
export interface UserProfile {
    /** Display name of the user */
    readonly name: string;
    /** Email address of the user */
    readonly email: string;
    /** Optional avatar URL */
    readonly avatarUrl?: string;
}
