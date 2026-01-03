import { ChangeDetectionStrategy, Component, inject, linkedSignal, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthStore } from '@app/core/auth/application/stores/auth.store';
import { MaterialModule } from '@app/shared/material/material.module';

/**
 * Sign-in page component.
 * Handles user authentication with email/password and Google.
 */
@Component({
    selector: 'app-sign-in',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ReactiveFormsModule, MaterialModule, RouterLink],
    templateUrl: './sign-in.html',
    styleUrl: './sign-in.scss',
})
export default class SignIn {
    readonly #fb = inject(FormBuilder);
    protected readonly authStore = inject(AuthStore);

    protected readonly $isLoading = linkedSignal(() => this.authStore.status() === 'logging-in');

    /** Login form with email and password. */
    protected readonly loginForm = this.#fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
    });

    /** Toggle password visibility. */
    protected hidePassword = signal(true);

    constructor() {}

    /**
     * Handles form submission for email/password login.
     */
    protected onSubmit(): void {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        const { email, password } = this.loginForm.value;
        if (!email || !password) return;

        this.authStore.signInWithEmailAndPassword({ email, password });
    }

    /**
     * Handles Google sign-in.
     */
    signInWithGoogle(): void {
        this.authStore.signInWithGoogle();
    }

    /**
     * Gets error message for email field.
     */
    protected getEmailError(): string {
        const control = this.loginForm.get('email');
        if (control?.hasError('required')) return 'Email is required';
        if (control?.hasError('email')) return 'Enter a valid email';
        return '';
    }

    /**
     * Gets error message for password field.
     */
    protected getPasswordError(): string {
        const control = this.loginForm.get('password');
        if (control?.hasError('required')) return 'Password is required';
        if (control?.hasError('minlength')) return 'Password must be at least 6 characters long';
        return '';
    }
}
