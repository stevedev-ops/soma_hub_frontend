import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Square, FastForward, Sparkles, Globe } from 'lucide-react';
import { voiceSynth } from '../services/voiceSynthService';

export default function VoicePlayerPill({
  textToRead = '',
  label = 'Read Aloud (Voice AI)',
  swahiliLabel = 'Soma Kwa Sauti',
  preferredLang = 'auto', // 'en' | 'sw' | 'auto'
  compact = false
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(0.95);
  const [currentLang, setCurrentLang] = useState('en');

  useEffect(() => {
    const unsubscribe = voiceSynth.subscribe((event) => {
      if (event.status === 'started') {
        setIsPlaying(true);
        setIsPaused(false);
        setCurrentLang(event.isSwahili ? 'sw' : 'en');
      } else if (event.status === 'paused') {
        setIsPaused(true);
      } else if (event.status === 'resumed') {
        setIsPaused(false);
      } else if (event.status === 'ended' || event.status === 'stopped' || event.status === 'error') {
        setIsPlaying(false);
        setIsPaused(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleTogglePlay = () => {
    if (isPlaying) {
      if (isPaused) {
        voiceSynth.resume();
      } else {
        voiceSynth.pause();
      }
    } else {
      const isSw = preferredLang === 'sw' || (preferredLang === 'auto' && voiceSynth.isSwahiliText(textToRead));
      voiceSynth.speak(textToRead, {
        lang: isSw ? 'sw' : 'en',
        rate: speed
      });
    }
  };

  const handleStop = () => {
    voiceSynth.stop();
  };

  const cycleSpeed = () => {
    let nextSpeed = 0.95;
    if (speed === 0.95) nextSpeed = 0.75; // slow
    else if (speed === 0.75) nextSpeed = 1.2; // fast
    else nextSpeed = 0.95; // normal
    setSpeed(nextSpeed);
  };

  const isSwahili = preferredLang === 'sw' || (preferredLang === 'auto' && voiceSynth.isSwahiliText(textToRead));

  if (compact) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
        <button
          type="button"
          onClick={handleTogglePlay}
          className="glass-pill"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            fontSize: '0.74rem',
            fontWeight: 700,
            cursor: 'pointer',
            background: isPlaying ? 'rgba(0,166,81,0.25)' : 'rgba(255,255,255,0.06)',
            borderColor: isPlaying ? '#00A651' : 'var(--border-subtle)',
            color: isPlaying ? '#34D399' : '#94A3B8'
          }}
          title={isSwahili ? "Sikiliza kwa Kiswahili" : "Listen in English"}
        >
          {isPlaying && !isPaused ? <Pause size={12} /> : <Volume2 size={12} />}
          <span>{isSwahili ? (isPlaying ? 'Inasoma...' : swahiliLabel) : (isPlaying ? 'Reading...' : label)}</span>
          {isSwahili && <span style={{ fontSize: '0.65rem', background: '#00A651', color: '#FFF', padding: '1px 4px', borderRadius: '4px' }}>SW</span>}
        </button>
        {isPlaying && (
          <button
            type="button"
            onClick={handleStop}
            className="glass-pill"
            style={{ padding: '4px 6px', cursor: 'pointer', color: '#EF4444' }}
            title="Stop Speech"
          >
            <Square size={10} />
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      background: isPlaying ? 'rgba(0, 166, 81, 0.14)' : 'rgba(255, 255, 255, 0.04)',
      border: isPlaying ? '1px solid rgba(0, 166, 81, 0.4)' : '1px solid var(--border-subtle)',
      padding: '5px 12px',
      borderRadius: '20px',
      transition: 'all 0.2s ease'
    }}>
      <button
        type="button"
        onClick={handleTogglePlay}
        style={{
          background: isPlaying ? '#00A651' : 'rgba(255,255,255,0.1)',
          border: 'none',
          color: '#FFFFFF',
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: isPlaying ? '0 0 10px rgba(0,166,81,0.5)' : 'none'
        }}
      >
        {isPlaying && !isPaused ? <Pause size={12} /> : <Play size={12} style={{ marginLeft: '1px' }} />}
      </button>

      <span style={{
        fontSize: '0.78rem',
        fontWeight: 700,
        color: isPlaying ? '#34D399' : 'var(--text-primary)',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        {isSwahili ? (isPlaying ? '🎙️ Inasoma kwa Kiswahili' : `🎙️ ${swahiliLabel}`) : (isPlaying ? '🎙️ Reading Aloud...' : `🎙️ ${label}`)}
      </span>

      {/* Language Indicator */}
      <span style={{
        fontSize: '0.65rem',
        background: isSwahili ? '#00A651' : '#3B82F6',
        color: '#FFFFFF',
        padding: '1px 5px',
        borderRadius: '6px',
        fontWeight: 800
      }}>
        {isSwahili ? '🇰🇪 SWAHILI' : 'ENG'}
      </span>

      {/* Speed cycler */}
      <button
        type="button"
        onClick={cycleSpeed}
        className="glass-pill"
        style={{
          fontSize: '0.68rem',
          padding: '2px 6px',
          cursor: 'pointer',
          color: 'var(--text-muted)'
        }}
        title="Click to toggle reading speed (0.75x, 0.95x, 1.2x)"
      >
        {speed}x
      </button>

      {isPlaying && (
        <button
          type="button"
          onClick={handleStop}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#EF4444',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            alignItems: 'center'
          }}
          title="Stop reading"
        >
          <Square size={12} />
        </button>
      )}
    </div>
  );
}
