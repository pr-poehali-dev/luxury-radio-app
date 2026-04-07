import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

export interface Track {
  id: number;
  title: string;
  artist: string;
  genre: string;
  src: string;
  duration?: string;
}

export const PLAYLIST: Track[] = [
  { id: 1, title: "Лунная соната", artist: "Людвиг ван Бетховен", genre: "Классика", src: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Moonlight-sonata.ogg", duration: "5:02" },
  { id: 2, title: "Clair de Lune", artist: "Клод Дебюсси", genre: "Классика", src: "https://upload.wikimedia.org/wikipedia/commons/b/b5/DebussyClair_de_lune.ogg", duration: "4:47" },
  { id: 3, title: "Waltz No.2", artist: "Дмитрий Шостакович", genre: "Классика", src: "https://upload.wikimedia.org/wikipedia/commons/3/32/Shostakovich-waltz2.ogg", duration: "3:55" },
  { id: 4, title: "Gymnopédie No.1", artist: "Эрик Сати", genre: "Импрессионизм", src: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Gymnopedie_No._1.ogg", duration: "3:20" },
  { id: 5, title: "Spring (Four Seasons)", artist: "Антонио Вивальди", genre: "Барокко", src: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Vivaldi-Spring.ogg", duration: "10:21" },
  { id: 6, title: "Nocturne Op.9 No.2", artist: "Фридерик Шопен", genre: "Романтизм", src: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Chopin_nocturne_op9_n2.ogg", duration: "4:18" },
  { id: 7, title: "Air on the G String", artist: "Иоганн С. Бах", genre: "Барокко", src: "https://upload.wikimedia.org/wikipedia/commons/6/60/BachAirinG.ogg", duration: "5:15" },
  { id: 8, title: "Canon in D", artist: "Иоганн Пахельбель", genre: "Барокко", src: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Pachelbel_canon_piano.ogg", duration: "4:44" },
];

function formatTime(sec: number) {
  if (!isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function MusicPlayer() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [filter, setFilter] = useState("Все");
  const audioRef = useRef<HTMLAudioElement>(null);

  const genres = ["Все", ...Array.from(new Set(PLAYLIST.map(t => t.genre)))];
  const filtered = filter === "Все" ? PLAYLIST : PLAYLIST.filter(t => t.genre === filter);
  const current = PLAYLIST[currentIdx];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    if (playing) {
      audio.src = current.src;
      audio.play().catch(() => setPlaying(false));
    }
  }, [currentIdx]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  const playTrack = (idx: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentIdx(idx);
    setPlaying(true);
    audio.src = PLAYLIST[idx].src;
    audio.play().catch(() => setPlaying(false));
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      if (!audio.src) audio.src = current.src;
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  const prev = () => {
    const idx = (currentIdx - 1 + PLAYLIST.length) % PLAYLIST.length;
    playTrack(idx);
  };

  const next = () => {
    let idx: number;
    if (shuffle) {
      do { idx = Math.floor(Math.random() * PLAYLIST.length); } while (idx === currentIdx && PLAYLIST.length > 1);
    } else {
      idx = (currentIdx + 1) % PLAYLIST.length;
    }
    playTrack(idx);
  };

  const onTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) setCurrentTime(audio.currentTime);
  };

  const onLoadedMetadata = () => {
    const audio = audioRef.current;
    if (audio) setDuration(audio.duration);
  };

  const onEnded = () => {
    if (repeat) {
      audioRef.current?.play();
    } else {
      next();
    }
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const t = parseFloat(e.target.value);
    audio.currentTime = t;
    setCurrentTime(t);
  };

  const gold = "var(--gold)";
  const pale = "var(--gold-pale)";
  const dark = "var(--dark-base)";
  const card = "rgba(20,16,10,0.95)";

  return (
    <section id="медиа" style={{ padding: "80px 24px", background: "var(--dark-card)" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.4rem", color: gold, opacity: 0.6, marginBottom: "16px" }}>— МЕДИАТЕКА —</p>
          <h2 className="font-display text-gold-gradient" style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)", fontWeight: 300 }}>Музыкальная коллекция</h2>
          <div className="gold-line" style={{ width: "80px", margin: "24px auto 0" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>

          {/* Левая — плеер */}
          <div style={{ background: card, border: "1px solid rgba(201,168,76,0.2)", padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
            <audio
              ref={audioRef}
              onTimeUpdate={onTimeUpdate}
              onLoadedMetadata={onLoadedMetadata}
              onEnded={onEnded}
              preload="metadata"
            />

            {/* Обложка / визуализация */}
            <div style={{ position: "relative", width: "100%", paddingBottom: "60%", background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.15)", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
                {playing ? (
                  <div style={{ display: "flex", gap: "6px", alignItems: "flex-end", height: "48px" }}>
                    {[1,2,3,4,5,6,7,8].map(i => (
                      <div key={i} style={{
                        width: "6px", background: `linear-gradient(to top, ${gold}, rgba(201,168,76,0.3))`,
                        borderRadius: "3px",
                        animation: `barPulse 0.6s ease-in-out ${i * 0.08}s infinite alternate`,
                        height: `${16 + Math.sin(i) * 20 + 10}px`,
                      }} />
                    ))}
                  </div>
                ) : (
                  <Icon name="Music" size={48} style={{ color: gold, opacity: 0.3 }} />
                )}
                <div style={{ textAlign: "center", padding: "0 16px" }}>
                  <p className="font-display" style={{ fontSize: "1.2rem", fontWeight: 300, color: pale }}>{current.title}</p>
                  <p style={{ fontSize: "0.75rem", color: gold, opacity: 0.6, letterSpacing: "0.1rem", marginTop: "4px" }}>{current.artist}</p>
                </div>
              </div>
            </div>

            {/* Прогресс */}
            <div>
              <input type="range" min={0} max={duration || 1} step={0.1} value={currentTime}
                onChange={seek}
                style={{ width: "100%", accentColor: gold, cursor: "pointer" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", opacity: 0.5, color: pale, marginTop: "4px" }}>
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Кнопки управления */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px" }}>
              <button onClick={() => setShuffle(s => !s)} style={{ background: "none", border: "none", cursor: "pointer", opacity: shuffle ? 1 : 0.35, transition: "opacity 0.2s" }}>
                <Icon name="Shuffle" size={18} style={{ color: gold }} />
              </button>
              <button onClick={prev} style={{ background: "none", border: "none", cursor: "pointer", opacity: 0.7 }}>
                <Icon name="SkipBack" size={22} style={{ color: pale }} />
              </button>
              <button onClick={togglePlay} style={{
                width: "52px", height: "52px", borderRadius: "50%",
                background: gold, border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 24px rgba(201,168,76,0.4)",
                transition: "all 0.2s ease",
              }}>
                <Icon name={playing ? "Pause" : "Play"} size={20} style={{ color: dark, marginLeft: playing ? 0 : "2px" }} />
              </button>
              <button onClick={next} style={{ background: "none", border: "none", cursor: "pointer", opacity: 0.7 }}>
                <Icon name="SkipForward" size={22} style={{ color: pale }} />
              </button>
              <button onClick={() => setRepeat(r => !r)} style={{ background: "none", border: "none", cursor: "pointer", opacity: repeat ? 1 : 0.35, transition: "opacity 0.2s" }}>
                <Icon name="Repeat" size={18} style={{ color: gold }} />
              </button>
            </div>

            {/* Громкость */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Icon name={volume === 0 ? "VolumeX" : volume < 0.5 ? "Volume1" : "Volume2"} size={16} style={{ color: gold, opacity: 0.6 }} />
              <input type="range" min={0} max={1} step={0.01} value={volume}
                onChange={e => setVolume(parseFloat(e.target.value))}
                style={{ flex: 1, accentColor: gold, cursor: "pointer" }}
              />
              <span style={{ fontSize: "0.65rem", color: gold, opacity: 0.5, minWidth: "28px" }}>{Math.round(volume * 100)}%</span>
            </div>
          </div>

          {/* Правая — треклист */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Фильтр по жанрам */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {genres.map(g => (
                <button key={g} onClick={() => setFilter(g)} style={{
                  padding: "6px 16px", fontSize: "0.6rem", letterSpacing: "0.15rem",
                  border: `1px solid ${filter === g ? gold : "rgba(201,168,76,0.2)"}`,
                  background: filter === g ? "rgba(201,168,76,0.12)" : "transparent",
                  color: filter === g ? gold : pale,
                  cursor: "pointer", transition: "all 0.2s", fontFamily: "Raleway, sans-serif",
                }}>
                  {g.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Список треков */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2px", maxHeight: "420px", overflowY: "auto" }}>
              {filtered.map((track) => {
                const isActive = track.id === current.id;
                return (
                  <div key={track.id} onClick={() => playTrack(PLAYLIST.indexOf(track))}
                    style={{
                      display: "flex", alignItems: "center", gap: "12px",
                      padding: "12px 16px", cursor: "pointer",
                      background: isActive ? "rgba(201,168,76,0.08)" : "transparent",
                      border: `1px solid ${isActive ? "rgba(201,168,76,0.3)" : "rgba(201,168,76,0.06)"}`,
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.04)"; }}
                    onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                  >
                    <div style={{ width: "28px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {isActive && playing ? (
                        <div style={{ display: "flex", gap: "2px", alignItems: "flex-end" }}>
                          {[1,2,3].map(i => (
                            <div key={i} style={{ width: "3px", background: gold, borderRadius: "1px", animation: `barPulse 0.6s ease-in-out ${i * 0.1}s infinite alternate`, height: `${6 + i * 3}px` }} />
                          ))}
                        </div>
                      ) : (
                        <span style={{ fontSize: "0.7rem", color: pale, opacity: isActive ? 1 : 0.35 }}>{track.id}</span>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "0.85rem", fontWeight: isActive ? 400 : 300, color: isActive ? gold : pale, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{track.title}</p>
                      <p style={{ fontSize: "0.7rem", opacity: 0.5, color: pale, marginTop: "2px" }}>{track.artist}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
                      <span style={{ fontSize: "0.6rem", padding: "2px 8px", border: "1px solid rgba(201,168,76,0.2)", color: gold, opacity: 0.5, letterSpacing: "0.05rem" }}>{track.genre}</span>
                      {track.duration && <span style={{ fontSize: "0.7rem", opacity: 0.4, color: pale }}>{track.duration}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes barPulse{from{transform:scaleY(0.3)}to{transform:scaleY(1)}}`}</style>
    </section>
  );
}
