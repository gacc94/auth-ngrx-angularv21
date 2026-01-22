import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { inject } from '@angular/core';
import { AIAnalysisRepositoryPort } from '@core/voice-assistant/domain/ai-analysis.port';
import { createVoiceCommand } from '@core/voice-assistant/domain/voice-command';
import { VoiceRecognitionRepositoryPort } from '@core/voice-assistant/domain/voice-recognition.port';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

type VoiceAssistantState = {
    isListening: boolean;
    transcript: string;
    response: string | null;
    isProcessing: boolean;
    error: string | null;
};

const initialState: VoiceAssistantState = {
    isListening: false,
    transcript: '',
    response: null,
    isProcessing: false,
    error: null,
};

export const VoiceAssistantStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withDevtools('VoiceAssistantStore'),
    withMethods((store) => {
        const voiceRecognition = inject(VoiceRecognitionRepositoryPort);
        const aiAnalysis = inject(AIAnalysisRepositoryPort);

        return {
            startListening: () => {
                patchState(store, { isListening: true, transcript: '', response: null, error: null });
                voiceRecognition.start();
            },
            stopListening: () => {
                patchState(store, { isListening: false });
                voiceRecognition.stop();
            },
            _processCommand: rxMethod<string>(
                pipe(
                    tap(() => patchState(store, { isProcessing: true, isListening: false })),
                    tap(() => voiceRecognition.stop()), // Ensure mic is off
                    switchMap((text) => {
                        const command = createVoiceCommand(text);
                        return aiAnalysis.analyze(command).pipe(
                            tapResponse({
                                next: (response) =>
                                    patchState(store, {
                                        response: response.text,
                                        isProcessing: false,
                                        error: response.isError ? 'Error processing command' : null,
                                    }),
                                error: (error: any) =>
                                    patchState(store, {
                                        error: error.message || 'Unknown error',
                                        isProcessing: false,
                                    }),
                            }),
                        );
                    }),
                ),
            ),
        };
    }),
    withHooks({
        onInit(store) {
            const voiceRecognition = inject(VoiceRecognitionRepositoryPort);

            // Connect to voice recognition streams
            rxMethod<boolean>(pipe(tap((isListening) => patchState(store, { isListening }))))(voiceRecognition.isListening$);

            const startListening = rxMethod<boolean>((isListening) => {
                return isListening;
            });

            const response = startListening(true);

            response.destroy();

            rxMethod<string>(
                pipe(
                    tap((transcript) => {
                        patchState(store, { transcript });
                        // Automatically process final transcripts
                        store._processCommand(transcript);
                    }),
                ),
            )(voiceRecognition.transcript$);

            rxMethod<string | null>(
                pipe(
                    tap((error) => {
                        if (error) patchState(store, { error, isListening: false });
                    }),
                ),
            )(voiceRecognition.error$);
        },
    }),
);
