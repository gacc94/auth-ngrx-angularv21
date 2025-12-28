// import { inject, Injectable } from '@angular/core';
// import { Result } from '@core/config/result';
// import { tapResponse } from '@ngrx/operators';
// import { rxMethod } from '@ngrx/signals/rxjs-interop';
// import { pipe, switchMap } from 'rxjs';
// import type { RegisterCredentials } from '../../domain/models/credentials.model';
// import type { SignUpPort } from '../../domain/ports/in/sign-up.in';
// import { SIGN_UP_USECASE } from '../../infrastructure/providers/auth.providers';
// import { AuthStore } from '../stores/auth.store';

// /**
//  * Effects for sign up operations.
//  */
// @Injectable()
// export class SignUpEffects {
//     readonly #signUpUseCase = inject<SignUpPort>(SIGN_UP_USECASE);
//     readonly #authStore = inject(AuthStore);

//     /**
//      * Effect for signing up a new user.
//      */
//     readonly signUp = rxMethod<RegisterCredentials>(
//         pipe(
//             switchMap((credentials) => {
//                 return this.#signUpUseCase.execute(credentials);
//             }),
//             tapResponse({
//                 next: (result) => {
//                     if (Result.isSuccess(result)) {
//                         this.#authStore.setAuthData(result.value);
//                     } else {
//                         this.#authStore.setError(result.error.message);
//                     }
//                 },
//                 error: (error: Error) => {
//                     this.#authStore.setError(error.message);
//                 },
//             }),
//         ),
//     );
// }
