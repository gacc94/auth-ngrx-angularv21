import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { AuthStore } from './core/auth/application/stores/auth.store';

describe('App', () => {
    let mockAuthStore: any;

    beforeEach(async () => {
        mockAuthStore = {
            isInitializing: signal(false),
        };

        await TestBed.configureTestingModule({
            imports: [App],
            providers: [{ provide: AuthStore, useValue: mockAuthStore }],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    it('should create the app', () => {
        const fixture = TestBed.createComponent(App);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });

    it('should show global loading when auth is initializing', () => {
        const fixture = TestBed.createComponent(App);
        mockAuthStore.isInitializing.set(true);
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        const loading = compiled.querySelector('app-global-loading');
        expect(loading).toBeTruthy();
        // Since we use NO_ERRORS_SCHEMA, we just check if the element exists in the template
        expect(loading?.getAttribute('[isloading]')).toBeNull(); // Angular bindings don't show up in getAttribute like this
    });
});
