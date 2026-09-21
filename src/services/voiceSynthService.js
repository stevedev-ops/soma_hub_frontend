// SomaHome Voice AI Read-Aloud Synthesis Service (Web Speech API)

class VoiceSynthService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.currentUtterance = null;
    this.isPlaying = false;
    this.isPaused = false;
    this.listeners = new Set();
    this.voices = [];

    if (this.synth) {
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  getBestVoice(lang = 'en') {
    if (!this.voices.length) this.loadVoices();
    
    if (lang === 'sw' || lang === 'sw-KE') {
      // Look for Swahili voices, or fallback to clear African English or neutral voice
      const swVoice = this.voices.find(v => v.lang.startsWith('sw'));
      if (swVoice) return swVoice;
      const keVoice = this.voices.find(v => v.lang.includes('KE') || v.lang.includes('ZA'));
      if (keVoice) return keVoice;
      return this.voices.find(v => v.lang.startsWith('en')) || this.voices[0];
    }

    // Default English
    const enKe = this.voices.find(v => v.lang === 'en-KE');
    if (enKe) return enKe;
    const enGb = this.voices.find(v => v.lang === 'en-GB');
    if (enGb) return enGb;
    const enUs = this.voices.find(v => v.lang === 'en-US');
    if (enUs) return enUs;
    return this.voices.find(v => v.lang.startsWith('en')) || this.voices[0];
  }

  // Detect Swahili text automatically
  isSwahiliText(text = '') {
    const lower = text.toLowerCase();
    const swahiliMarkers = [
      'habari', 'jambo', 'kwa', 'katika', 'shule', 'watoto', 'mwalimu', 
      'kusoma', 'mashairi', 'nyakati', 'nomino', 'sarufi', 'elimu', 
      'mazingira', 'kiswahili', 'tashbihi', 'hadithi', 'mwanzo', 'mwisho',
      'sukuma', 'shilingi', 'jiko'
    ];
    return swahiliMarkers.some(m => lower.includes(m));
  }

  speak(text, options = {}) {
    if (!this.synth) {
      console.warn('Speech synthesis is not supported in this browser.');
      return;
    }

    this.stop();

    const cleanText = text.replace(/[*_#`]/g, '').trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const isSw = options.lang === 'sw' || this.isSwahiliText(cleanText);
    
    utterance.lang = isSw ? 'sw-KE' : (options.lang || 'en-KE');
    utterance.voice = this.getBestVoice(utterance.lang);
    
    // For Swahili or young learners, slightly slower rate is clearer
    utterance.rate = options.rate || (isSw ? 0.88 : 0.95);
    utterance.pitch = options.pitch || 1.05; // Slightly warmer pitch for children

    utterance.onstart = () => {
      this.isPlaying = true;
      this.isPaused = false;
      this.notifyListeners({ status: 'started', text: cleanText, isSwahili: isSw });
    };

    utterance.onpause = () => {
      this.isPaused = true;
      this.notifyListeners({ status: 'paused' });
    };

    utterance.onresume = () => {
      this.isPaused = false;
      this.notifyListeners({ status: 'resumed' });
    };

    utterance.onend = () => {
      this.isPlaying = false;
      this.isPaused = false;
      this.notifyListeners({ status: 'ended' });
    };

    utterance.onerror = (e) => {
      this.isPlaying = false;
      this.isPaused = false;
      this.notifyListeners({ status: 'error', error: e });
    };

    // Word boundary tracking for highlighting
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        this.notifyListeners({
          status: 'word',
          charIndex: event.charIndex,
          charLength: event.charLength
        });
      }
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  pause() {
    if (this.synth && this.isPlaying) {
      this.synth.pause();
    }
  }

  resume() {
    if (this.synth && this.isPaused) {
      this.synth.resume();
    }
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isPlaying = false;
      this.isPaused = false;
      this.notifyListeners({ status: 'stopped' });
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners(data) {
    this.listeners.forEach(cb => {
      try { cb(data); } catch (e) {}
    });
  }
}

export const voiceSynth = new VoiceSynthService();
