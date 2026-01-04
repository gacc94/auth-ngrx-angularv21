import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthStore } from '@app/core/auth/application/stores/auth.store';
import { MATERIAL_IMPORTS } from '@app/shared/material/material.imports';

/**
 * Registration page component.
 * Handles new user registration with email and password.
 */
@Component({
    selector: 'app-register',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ReactiveFormsModule, ...MATERIAL_IMPORTS, RouterLink],
    templateUrl: './register.html',
    styleUrl: './register.scss',
})
export default class Register {
    readonly #fb = inject(FormBuilder);
    protected readonly authStore = inject(AuthStore);

    /** Registration form with email, password, and password confirmation. */
    protected readonly registerForm = this.#fb.group({
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
    });

    /** Toggle password visibility. */
    protected hidePassword = true;
    protected hideConfirmPassword = true;

    constructor() {}

    /**
     * Handles form submission.
     */
    protected onSubmit(): void {
        if (this.registerForm.invalid) {
            this.registerForm.markAllAsTouched();
            return;
        }

        const { password, confirmPassword } = this.registerForm.getRawValue();
        if (password !== confirmPassword) {
            this.registerForm.get('confirmPassword')?.setErrors({ mismatch: true });
            return;
        }

        const { name, email } = this.registerForm.getRawValue();

        this.authStore.signUp({
            name: name ?? '',
            email: email ?? '',
            password: password ?? '',
        });
    }

    /**
     * Gets error message for name field.
     */
    protected getNameError(): string {
        const control = this.registerForm.get('name');
        if (control?.hasError('required')) return 'Name is required';
        if (control?.hasError('minlength')) return 'Name must be at least 2 characters';
        return '';
    }

    /**
     * Gets error message for email field.
     */
    protected getEmailError(): string {
        const control = this.registerForm.get('email');
        if (control?.hasError('required')) return 'Email is required';
        if (control?.hasError('email')) return 'Enter a valid email';
        return '';
    }

    /**
     * Gets error message for password field.
     */
    protected getPasswordError(): string {
        const control = this.registerForm.get('password');
        if (control?.hasError('required')) return 'Password is required';
        if (control?.hasError('minlength')) return 'Password must be at least 6 characters';
        return '';
    }

    /**
     * Gets error message for confirm password field.
     */
    protected getConfirmPasswordError(): string {
        const control = this.registerForm.get('confirmPassword');
        if (control?.hasError('required')) return 'Confirm your password';
        if (control?.hasError('mismatch')) return 'Passwords do not match';
        return '';
    }
}
