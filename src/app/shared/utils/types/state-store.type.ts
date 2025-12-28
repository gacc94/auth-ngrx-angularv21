import { Signal } from '@angular/core';
import { WritableStateSource } from '@ngrx/signals';

export type StateStore<State extends object> = WritableStateSource<State> & {
    [K in keyof State]: Signal<State[K]>;
};
