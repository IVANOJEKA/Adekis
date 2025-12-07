/**
 * Voice Announcement Utility
 * Uses Web Speech API to announce queue token numbers
 */

class VoiceAnnouncer {
    constructor() {
        this.synthesis = window.speechSynthesis;
        this.isSpeaking = false;
    }

    /**
     * Check if speech synthesis is supported
     */
    isSupported() {
        return 'speechSynthesis' in window;
    }

    /**
     * Announce a token number with department
     * @param {string} tokenNumber - The queue token (e.g., "D-001")
     * @param {string} department - Department name (e.g., "Doctor")
     * @param {string} patientName - Patient name (optional)
     */
    announceToken(tokenNumber, department, patientName = null) {
        if (!this.isSupported()) {
            console.warn('Speech synthesis not supported in this browser');
            return Promise.reject(new Error('Speech synthesis not supported'));
        }

        // Cancel any ongoing speech
        this.synthesis.cancel();

        return new Promise((resolve, reject) => {
            const utterance = new SpeechSynthesisUtterance();

            // Construct announcement text
            let text = `Token number ${this.formatTokenForSpeech(tokenNumber)}`;

            if (patientName) {
                text += `, ${patientName}`;
            }

            text += `, please proceed to ${department} counter`;

            utterance.text = text;
            utterance.lang = 'en-US';
            utterance.rate = 0.75; // Slower for maximum clarity  
            utterance.pitch = 1.1; // Slightly higher pitch for female voice
            utterance.volume = 1.0; // Maximum volume

            // Wait for voices to load, then select female voice
            const selectVoice = () => {
                const voices = this.synthesis.getVoices();
                const femaleVoice = voices.find(voice =>
                    voice.name.toLowerCase().includes('female') ||
                    voice.name.toLowerCase().includes('zira') ||
                    voice.name.toLowerCase().includes('samantha') ||
                    voice.name.toLowerCase().includes('victoria') ||
                    voice.name.toLowerCase().includes('karen') ||
                    (voice.name.toLowerCase().includes('google') && voice.lang === 'en-US')
                ) || voices.find(voice => voice.lang === 'en-US' && !voice.name.toLowerCase().includes('male'));

                if (femaleVoice) {
                    utterance.voice = femaleVoice;
                    console.log('Using voice:', femaleVoice.name);
                }
            };

            // Try to set voice immediately
            selectVoice();

            // Fallback: set voice when voices are loaded
            if (this.synthesis.getVoices().length === 0) {
                this.synthesis.onvoiceschanged = selectVoice;
            }

            utterance.onstart = () => {
                this.isSpeaking = true;
            };

            utterance.onend = () => {
                this.isSpeaking = false;
                resolve();
            };

            utterance.onerror = (event) => {
                this.isSpeaking = false;
                reject(event.error);
            };

            this.synthesis.speak(utterance);
        });
    }

    /**
     * Format token number for speech (e.g., "D-001" becomes "D dash zero zero one")
     */
    formatTokenForSpeech(tokenNumber) {
        return tokenNumber
            .split('')
            .map(char => {
                if (char === '-') return 'dash';
                if (/\d/.test(char)) return char; // Keep numbers as is
                return char; // Keep letters as is
            })
            .join(' ');
    }

    /**
     * Stop any ongoing announcement
     */
    stop() {
        if (this.synthesis.speaking) {
            this.synthesis.cancel();
            this.isSpeaking = false;
        }
    }

    /**
     * Check if currently speaking
     */
    getSpeakingStatus() {
        return this.isSpeaking;
    }

    /**
     * Get available voices
     */
    getVoices() {
        return this.synthesis.getVoices();
    }

    /**
     * Test announcement
     */
    testAnnouncement() {
        return this.announceToken('T-001', 'Test', 'Test Patient');
    }
}

// Create singleton instance
const voiceAnnouncer = new VoiceAnnouncer();

export default voiceAnnouncer;
