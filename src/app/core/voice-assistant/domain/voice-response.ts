export interface VoiceAssistantResponse {
    readonly text: string;
    readonly timestamp: number;
    readonly isError: boolean;
}

export const createVoiceResponse = (text: string, isError: boolean = false): VoiceAssistantResponse => ({
    text,
    timestamp: Date.now(),
    isError,
});
