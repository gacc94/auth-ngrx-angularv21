import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AI } from '@angular/fire/ai';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { VoiceAssistantStore } from '@core/voice-assistant/application/voice-assistant.store';
import {
    AudioConversationController,
    FunctionResponse,
    getLiveGenerativeModel,
    ResponseModality,
    startAudioConversation,
} from 'firebase/ai';

@Component({
    selector: 'app-voice-assistant-dialog',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
    template: `
        <div class="voice-dialog">
            <h2 mat-dialog-title>Voice Assistant</h2>

            <mat-dialog-content>
                <div class="voice-content">
                    @if (isListening()) {
                        <div class="listening-state">
                            <div class="waveform">
                                <div class="bar"></div>
                                <div class="bar"></div>
                                <div class="bar"></div>
                                <div class="bar"></div>
                                <div class="bar"></div>
                            </div>
                            <p>Listening...</p>
                            <p class="transcript">{{ store.transcript() }}</p>
                        </div>
                    } @else if (store.isProcessing()) {
                        <div class="processing-state">
                            <mat-icon class="spin">sync</mat-icon>
                            <p>Thinking...</p>
                        </div>
                    } @else if (store.response()) {
                        <div class="response-state">
                            <mat-icon color="primary">smart_toy</mat-icon>
                            <p>{{ store.response() }}</p>
                        </div>
                    } @else if (store.error()) {
                        <div class="error-state">
                            <mat-icon color="warn">error</mat-icon>
                            <p>{{ store.error() }}</p>
                        </div>
                    } @else {
                        <p>How can I help you?</p>
                    }
                </div>
            </mat-dialog-content>

            <mat-dialog-actions align="end">
                <button mat-button mat-dialog-close>Close</button>

                @if (!isListening()) {
                    <button mat-raised-button color="primary" mat (click)="startConversation()"><mat-icon>mic</mat-icon> Speak</button>
                } @else {
                    <button mat-raised-button color="warn" (click)="stopConversation()"><mat-icon>stop</mat-icon> Stop</button>
                }
            </mat-dialog-actions>
        </div>
    `,
    styleUrl: './voice-assistant-dialog.scss',
})
export class VoiceAssistantDialogComponent {
    protected readonly store = inject(VoiceAssistantStore);
    protected readonly ai = inject(AI);

    readonly allowedThemes = [
        'red',
        'green',
        'blue',
        'yellow',
        'cyan',
        'magenta',
        'orange',
        'chartreuse',
        'spring-green',
        'azure',
        'violet',
        'rose',
        'purple',
    ];

    private audioConversationController: AudioConversationController | null = null;

    async startConversation() {
        const liveModel = getLiveGenerativeModel(this.ai, {
            model: 'gemini-2.5-flash-native-audio-preview-12-2025',
            systemInstruction: {
                role: 'system',
                parts: [
                    {
                        text: `You are a helpful assistant that can change the color of the menu of the application. The colors available are: ${this.allowedThemes.join(', ')}. You should also interpret objects or concepts to their most representative color; for example, if the user asks for 'tree color', interpret it as 'green' and update the theme accordingly.`,
                    },
                ],
            },
            generationConfig: {
                responseModalities: [ResponseModality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Achird' },
                    },
                },
            },
            tools: [
                {
                    functionDeclarations: [
                        {
                            name: 'changeMenuColor',
                            description: 'Change the color of the menu of the application.',
                            parameters: {
                                type: 'object',
                                properties: {
                                    color: {
                                        type: 'string',
                                        description: `The color to change the menu color to. Available colors: ${this.allowedThemes.join(', ')}`,
                                    },
                                },
                                required: ['color'],
                            },
                        },
                    ],
                },
            ],
        });

        const session = await liveModel.connect();

        this.audioConversationController = await startAudioConversation(session, {
            functionCallingHandler: async (functionCalling) => {
                console.log('Function calling:', functionCalling);

                for (const call of functionCalling) {
                    if (call.name === 'changeMenuColor') {
                        const args = call.args as any;
                        const color = args.color;
                        console.log('Change menu color to:', color);
                    }
                }
                const colors = this.allowedThemes;
                const fnResp: FunctionResponse = {
                    name: 'changeMenuColor',
                    id: '',
                    response: {
                        prompt: {
                            text: colors.join(','),
                        },
                    },
                };
                console.log('Function response:', fnResp);
                return fnResp;
            },
        });

        this.isListening.set(true);
    }

    async stopConversation() {
        this.audioConversationController?.stop();
        this.isListening.set(false);
    }

    isListening = signal(false);
}
