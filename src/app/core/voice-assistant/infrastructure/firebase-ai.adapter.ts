import { inject, Injectable } from '@angular/core';
import { getAI, getGenerativeModel } from '@angular/fire/ai';
import { FirebaseApp } from '@angular/fire/app';
import { AIAnalysisRepositoryPort } from '@core/voice-assistant/domain/ai-analysis.port';
import { VoiceCommand } from '@core/voice-assistant/domain/voice-command';
import { createVoiceResponse, VoiceAssistantResponse } from '@core/voice-assistant/domain/voice-response';
import { catchError, from, map, Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class FirebaseAIAdapter implements AIAnalysisRepositoryPort {
    private firebaseApp = inject(FirebaseApp);

    analyze(command: VoiceCommand): Observable<VoiceAssistantResponse> {
        return from(this.generateResponse(command.text)).pipe(
            map((text) => createVoiceResponse(text)),
            catchError((error) => {
                console.error('Firebase AI Error:', error);
                return of(createVoiceResponse('Sorry, I am having trouble understanding you right now.', true));
            }),
        );
    }

    private async generateResponse(prompt: string): Promise<string> {
        const ai = getAI(this.firebaseApp);
        const model = getGenerativeModel(ai, { model: 'gemini-2.5-flash' });

        const result = await model.generateContent(prompt);
        const response = result.response;
        const fn = response.functionCalls();
        if (fn && fn.length > 0) {
            const call = fn[0];
            if (call.name === 'changeMenuColor') {
                console.log('Change menu color to:', call.args);
            }
        }
        return response.text();
    }
}
