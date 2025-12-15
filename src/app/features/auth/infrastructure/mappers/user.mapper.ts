import { UserState } from '../states/user.state';

export class UserMapper {
    static toUserState(user: any): UserState {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        } satisfies UserState;
    }
}
