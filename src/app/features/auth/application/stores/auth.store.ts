import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { inject } from '@angular/core';
import { signalStore, withComputed, withHooks, withMethods, withProps, withState } from '@ngrx/signals';
import { AUTH_STATE } from '../states/auth.state';

export const AuthStore = signalStore(
    // { protectedState: false, providedIn: 'root' },
    withState(() => inject(AUTH_STATE)),
    withDevtools('AuthStore'),
    withComputed(() => ({})),
    withProps(() => ({})),
    withMethods(() => ({})),
    withHooks(() => ({})),
);
