import { Provider } from '@angular/core';
import { AIAnalysisRepositoryPort } from '@core/voice-assistant/domain/ai-analysis.port';
import { VoiceRecognitionRepositoryPort } from '@core/voice-assistant/domain/voice-recognition.port';
import { FirebaseAIAdapter } from './firebase-ai.adapter';
import { WebSpeechAdapter } from './web-speech.adapter';

export const provideVoiceAssistant = (): Provider[] => [
    {
        provide: VoiceRecognitionRepositoryPort,
        useClass: WebSpeechAdapter,
    },
    {
        provide: AIAnalysisRepositoryPort,
        useClass: FirebaseAIAdapter,
    },
];
