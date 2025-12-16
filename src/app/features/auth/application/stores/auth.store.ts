import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { signalStore, withComputed, withHooks, withMethods, withProps, withState } from '@ngrx/signals';

export const AuthStore = signalStore(
    withState({}),
    withDevtools('AuthStore'),
    withComputed(() => ({})),
    withProps(() => ({})),
    withMethods(() => ({})),
    withHooks(() => ({})),
);
