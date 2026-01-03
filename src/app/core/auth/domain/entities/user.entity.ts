/**
 * Represents a user entity within the authentication domain.
 */
export class User {
    /**
     * Unique identification for the user.
     */
    readonly id: string;

    /**
     * The full name of the user.
     */
    name: string;

    /**
     * The electronic mail address of the user.
     */
    email: string;

    /**
     * The authorization role assigned to the user.
     */
    role: string;

    /**
     * The URL of the user's profile photo.
     */
    photoURL?: string;

    /**
     * Initializes a new instance of the User class.
     *
     * @param id - The unique identifier for the user.
     * @param name - The user's display name.
     * @param email - The user's email address.
     * @param role - The user's access role.
     * @param photoURL - The URL of the user's profile photo.
     */
    constructor(id: string, name: string, email: string, role: string, photoURL?: string) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.photoURL = photoURL;
    }
}
