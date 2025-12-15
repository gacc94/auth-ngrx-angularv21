import { signalStore, withState } from '@ngrx/signals';

export const AuthStore = signalStore(withState({}));
