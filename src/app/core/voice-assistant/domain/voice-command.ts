export interface VoiceCommand {
    readonly text: string;
    readonly timestamp: number;
    readonly language: string;
}

export const createVoiceCommand = (text: string): VoiceCommand => ({
    text,
    timestamp: Date.now(),
    language: navigator.language || 'en-US',
});
