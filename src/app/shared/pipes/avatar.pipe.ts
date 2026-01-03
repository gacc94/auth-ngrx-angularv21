import { Pipe, PipeTransform } from '@angular/core';

/** Default fallback avatar path */
const DEFAULT_AVATAR = 'assets/images/default-avatar.svg';

/**
 * Transforms a photo URL to a valid avatar source.
 * Returns the provided URL if valid, otherwise returns a default fallback avatar.
 *
 * @example
 * ```html
 * <img [src]="user.photoURL | avatar" alt="User avatar" />
 * ```
 */
@Pipe({
    name: 'avatar',
    pure: true,
})
export class AvatarPipe implements PipeTransform {
    /**
     * Transforms the input photo URL to a valid avatar source.
     *
     * @param photoURL - The user's photo URL (can be null or undefined)
     * @returns The photo URL if valid, otherwise the default avatar path
     */
    transform(photoURL: string | null | undefined): string {
        return photoURL?.trim() || DEFAULT_AVATAR;
    }
}
