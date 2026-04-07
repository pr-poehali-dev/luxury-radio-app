import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

const RADIO_URL = "http://uk4freenew.listen2myradio.com:23326/;";

export default function RadioPlayer() {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [showVolume, setShowVolume] = useState(false);
  const [error, setError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      setError(false);
    } else {
      setLoading(true);
      setError(false);
      audio.src = RADIO_URL;
      audio.load();
      audio.play()
        .then(() => { setPlaying(true); setLoading(false); })
        .catch(() => { setLoading(false); setError(true); });
    }
  };

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(10,8,6,0.97)",
      borderTop: "1px solid rgba(201,168,76,0.25)",
      backdropFilter: "blur(20px)",
      padding: "0 24px",
      height: "64px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "16px",
    }}>
      <audio ref={audioRef} preload="none" />

      {/* Левая часть — статус */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
        <div style={{
          width: "8px", height: "8px", borderRadius: "50%",
          background: error ? "#e74c3c" : playing ? "var(--gold)" : "rgba(201,168,76,0.3)",
          boxShadow: playing ? "0 0 8px rgba(201,168,76,0.8)" : "none",
          animation: playing ? "pulse 1.5s ease-in-out infinite" : "none",
          flexShrink: 0,
        }} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: "0.65rem", letterSpacing: "0.2rem", color: "var(--gold)", opacity: 0.7, whiteSpace: "nowrap" }}>
            {error ? "ОШИБКА ПОДКЛЮЧЕНИЯ" : playing ? "● В ЭФИРЕ" : "РАДИО"}
          </div>
          <div style={{ fontSize: "0.8rem", fontWeight: 300, color: "var(--gold-pale)", opacity: 0.9, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            Волны Музыки — прямой эфир
          </div>
        </div>
      </div>

      {/* Центр — кнопка */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <button onClick={toggle} style={{
          width: "44px", height: "44px", borderRadius: "50%",
          border: "1px solid rgba(201,168,76,0.5)",
          background: playing ? "var(--gold)" : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", transition: "all 0.3s ease",
          boxShadow: playing ? "0 0 20px rgba(201,168,76,0.4)" : "none",
          flexShrink: 0,
        }}>
          {loading ? (
            <div style={{ width: "16px", height: "16px", border: "2px solid var(--gold)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          ) : playing ? (
            <Icon name="Square" size={14} style={{ color: "var(--dark-base)", fill: "var(--dark-base)" }} />
          ) : (
            <Icon name="Play" size={16} style={{ color: "var(--gold)", marginLeft: "2px" }} />
          )}
        </button>

        {/* Эквалайзер-анимация */}
        {playing && (
          <div style={{ display: "flex", gap: "3px", alignItems: "center", height: "20px" }}>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} style={{
                width: "3px", background: "var(--gold)", borderRadius: "2px",
                animation: `barPulse 0.8s ease-in-out ${i * 0.12}s infinite alternate`,
                height: `${8 + (i % 3) * 5}px`,
                opacity: 0.7,
              }} />
            ))}
          </div>
        )}
      </div>

      {/* Правая часть — громкость */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", position: "relative" }}>
        <button
          onClick={() => setShowVolume(v => !v)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gold)", opacity: 0.6, padding: "4px", transition: "opacity 0.2s" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "0.6"; }}
        >
          <Icon name={volume === 0 ? "VolumeX" : volume < 0.5 ? "Volume1" : "Volume2"} size={18} style={{ color: "var(--gold)" }} />
        </button>
        {showVolume && (
          <div style={{
            position: "absolute", bottom: "52px", right: 0,
            background: "rgba(10,8,6,0.97)", border: "1px solid rgba(201,168,76,0.2)",
            padding: "16px 12px", borderRadius: "4px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
          }}>
            <span style={{ fontSize: "0.6rem", letterSpacing: "0.1rem", color: "var(--gold)", opacity: 0.6 }}>{Math.round(volume * 100)}%</span>
            <input type="range" min={0} max={1} step={0.01} value={volume}
              onChange={e => setVolume(parseFloat(e.target.value))}
              style={{ writingMode: "vertical-lr" as React.CSSProperties["writingMode"], direction: "rtl" as React.CSSProperties["direction"], height: "80px", cursor: "pointer", accentColor: "var(--gold)" }}
            />
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes barPulse { from{transform:scaleY(0.4)} to{transform:scaleY(1)} }
      `}</style>
    </div>
  );
}