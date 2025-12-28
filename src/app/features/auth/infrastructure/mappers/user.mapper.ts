import type { User as FirebaseUser } from '@angular/fire/auth';
import { User } from '../../domain/entities/user.entity';

/**
 * Maps Firebase User to domain User entity.
 */
export class UserMapper {
    /**
     * Converts a Firebase User to a domain User entity.
     * @param user - The Firebase User object.
     * @returns A new User domain entity.
     */
    static toEntity(user: FirebaseUser): User {
        return new User(user.uid, user.displayName ?? '', user.email ?? '', 'user', user.photoURL ?? undefined);
    }
}
