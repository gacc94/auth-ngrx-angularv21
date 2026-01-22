import { Observable } from 'rxjs';
import { VoiceCommand } from './voice-command';
import { VoiceAssistantResponse } from './voice-response';

export abstract class AIAnalysisRepositoryPort {
    abstract analyze(command: VoiceCommand): Observable<VoiceAssistantResponse>;
}
