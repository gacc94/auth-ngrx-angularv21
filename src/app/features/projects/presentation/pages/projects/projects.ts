import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MaterialModule } from '@shared/material/material.module';

@Component({
    selector: 'app-projects',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MaterialModule],
    template: `
        <div class="projects">
            <header class="projects__header">
                <h1 class="projects__title">Projects</h1>
                <p class="projects__description">Manage and track your projects.</p>
            </header>

            <div class="projects__content">
                <mat-card class="projects__placeholder">
                    <mat-card-content>
                        <mat-icon class="projects__icon">folder</mat-icon>
                        <h2>Project Management</h2>
                        <p>Project management features coming soon.</p>
                    </mat-card-content>
                </mat-card>
            </div>
        </div>
    `,
    styleUrl: './projects.scss',
})
export default class Projects {}
