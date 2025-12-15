import { patchState, signalStore, withHooks, withMethods, withProps, withState } from '@ngrx/signals';

export const AppStore = signalStore(
    { providedIn: 'root' },
    withState({ count: 0 }),
    withProps(() => ({})),

    withMethods((store) => ({
        increment: () => {
            patchState(store, { count: store.count() + 1 });
        },
        decrement: () => {
            if (store.count() <= 0) return;

            patchState(store, { count: store.count() - 1 });
        },
    })),

    withHooks((store) => ({
        onInit: () => {
            patchState(store, { count: 10 });
        },
    })),
);
