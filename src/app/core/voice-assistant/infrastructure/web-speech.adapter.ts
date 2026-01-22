import { Injectable, NgZone } from '@angular/core';
import { VoiceRecognitionRepositoryPort } from '@core/voice-assistant/domain/voice-recognition.port';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class WebSpeechAdapter implements VoiceRecognitionRepositoryPort {
    private recognition: any;
    private _isListening = new BehaviorSubject<boolean>(false);
    private _transcript = new Subject<string>();
    private _error = new Subject<string | null>();

    constructor(private ngZone: NgZone) {
        this.initializeSpeechRecognition();
    }

    private initializeSpeechRecognition(): void {
        const { SpeechRecognition, webkitSpeechRecognition } = window as any;
        const SpeechRecognitionConstructor = SpeechRecognition || webkitSpeechRecognition;

        if (SpeechRecognitionConstructor) {
            this.recognition = new SpeechRecognitionConstructor();
            this.recognition.continuous = false; // Stop after one command
            this.recognition.lang = 'en-US'; // Default to English
            this.recognition.interimResults = true; // Show interim results for better UX

            this.recognition.onstart = () => {
                this.ngZone.run(() => this._isListening.next(true));
            };

            this.recognition.onend = () => {
                this.ngZone.run(() => this._isListening.next(false));
            };

            this.recognition.onresult = (event: any) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                }
                if (finalTranscript) {
                    this.ngZone.run(() => this._transcript.next(finalTranscript));
                }
            };

            this.recognition.onerror = (event: any) => {
                this.ngZone.run(() => {
                    this._error.next(event.error);
                    this._isListening.next(false);
                });
            };
        } else {
            console.warn('Speech Recognition API not supported in this browser.');
            this._error.next('Browser not supported');
        }
    }

    start(): void {
        if (this.recognition && !this._isListening.value) {
            try {
                this._error.next(null);
                this.recognition.start();
            } catch (error: any) {
                // If it's already started, just ignore/log checking the error name or message
                if (error.name === 'InvalidStateError' || error.message?.includes('already started')) {
                    console.warn('Speech recognition is already started.');
                } else {
                    console.error('Error starting speech recognition:', error);
                    this._error.next(error.message || 'Error starting speech recognition');
                }
            }
        }
    }

    stop(): void {
        if (this.recognition && this._isListening.value) {
            this.recognition.stop();
        }
    }

    get transcript$(): Observable<string> {
        return this._transcript.asObservable();
    }

    get isListening$(): Observable<boolean> {
        return this._isListening.asObservable();
    }

    get error$(): Observable<string | null> {
        return this._error.asObservable();
    }
}
