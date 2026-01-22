import { Component, inject, provideAppInitializer, provideEnvironmentInitializer, providePlatformInitializer } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { VoiceAssistantDialogComponent } from '../voice-assistant-dialog/voice-assistant-dialog';

@Component({
    selector: 'app-voice-assistant-fab',
    standalone: true,
    imports: [MatButtonModule, MatIconModule, MatDialogModule],
    template: `
        <button mat-fab color="primary" class="voice-fab" (click)="openAssistant()">
            <mat-icon>mic</mat-icon>
        </button>
    `,
    styleUrl: './voice-assistant-fab.scss',
})
export class VoiceAssistantFabComponent {
    private dialog = inject(MatDialog);

    openAssistant() {
        this.dialog.open(VoiceAssistantDialogComponent, {
            width: '400px',
            panelClass: 'voice-assistant-panel',
        });
    }
}
provideEnvironmentInitializer;
provideAppInitializer;
providePlatformInitializer;
