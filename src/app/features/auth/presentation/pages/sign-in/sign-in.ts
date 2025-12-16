import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialModule } from '@shared/material.module';

@Component({
    selector: 'app-sign-in',
    imports: [MaterialModule],
    templateUrl: './sign-in.html',
    styleUrl: './sign-in.scss',
})
export default class SignIn {
    readonly #router = inject(Router);

    signInGoogle() {
        this.#router.navigate(['dashboard']);
    }
}
