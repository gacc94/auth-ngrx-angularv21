import { Observable } from 'rxjs';

export abstract class VoiceRecognitionRepositoryPort {
    abstract start(): void;
    abstract stop(): void;
    abstract get transcript$(): Observable<string>;
    abstract get isListening$(): Observable<boolean>;
    abstract get error$(): Observable<string | null>;
}
