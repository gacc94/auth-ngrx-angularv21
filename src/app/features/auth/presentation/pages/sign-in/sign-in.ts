import { Component, inject } from '@angular/core';
import { MaterialModule } from '@shared/material.module';
import { AppStore } from '../../../../../app.store';

@Component({
    selector: 'app-sign-in',
    imports: [MaterialModule],
    templateUrl: './sign-in.html',
    styleUrl: './sign-in.scss',
})
export default class SignIn {
    protected readonly appStore: InstanceType<typeof AppStore> | null = inject(AppStore, { optional: true });
}
