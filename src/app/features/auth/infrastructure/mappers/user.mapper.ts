import { User as FirebaseUser } from '@angular/fire/auth';
import { User } from '../../domain/entities/user.entity';

export class UserMapper {
    static toEntity(user: FirebaseUser): User {
        return new User(user.uid, user.displayName ?? '', user.email ?? '', 'user');
    }
}
