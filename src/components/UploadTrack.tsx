import { useState, useRef, useCallback } from "react";
import Icon from "@/components/ui/icon";
import { Track } from "@/components/MusicPlayer";

const UPLOAD_URL = "https://functions.poehali.dev/e412491a-06ac-4ad6-a6e2-ccaaaa175e3e";

const GENRES = ["Классика", "Джаз", "Барокко", "Романтизм", "Импрессионизм", "Поп", "Рок", "Этника", "Разное"];

interface Props {
  onUploaded: (track: Track) => void;
  nextId: number;
}

export default function UploadTrack({ onUploaded, nextId }: Props) {
  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [genre, setGenre] = useState("Разное");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const gold = "var(--gold)";
  const pale = "var(--gold-pale)";
  const dark = "var(--dark-base)";

  const reset = () => {
    setFile(null);
    setTitle("");
    setArtist("");
    setGenre("Разное");
    setError("");
    setSuccess(false);
  };

  const close = () => { setOpen(false); reset(); };

  const onFile = (f: File) => {
    if (!f.type.startsWith("audio/")) { setError("Выберите аудиофайл (MP3, OGG, WAV)"); return; }
    if (f.size > 50 * 1024 * 1024) { setError("Файл слишком большой (макс. 50 МБ)"); return; }
    setError("");
    setFile(f);
    if (!title) setTitle(f.name.replace(/\.[^.]+$/, ""));
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) onFile(f);
  }, [title]);

  const toBase64 = (f: File): Promise<string> =>
    new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res((reader.result as string).split(",")[1]);
      reader.onerror = rej;
      reader.readAsDataURL(f);
    });

  const submit = async () => {
    if (!file) { setError("Выберите файл"); return; }
    if (!title.trim()) { setError("Введите название трека"); return; }
    setLoading(true);
    setError("");
    try {
      const base64 = await toBase64(file);
      const res = await fetch(UPLOAD_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: base64, filename: file.name, title: title.trim(), artist: artist.trim() || "Неизвестный артист", genre }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Ошибка загрузки"); setLoading(false); return; }
      setSuccess(true);
      onUploaded({ id: nextId, title: data.title, artist: data.artist, genre: data.genre, src: data.url });
      setTimeout(close, 1500);
    } catch {
      setError("Ошибка соединения. Попробуйте снова.");
    }
    setLoading(false);
  };

  const inputStyle = {
    width: "100%", background: "transparent",
    border: "1px solid rgba(201,168,76,0.2)",
    padding: "12px 16px", fontSize: "0.9rem", fontWeight: 300,
    outline: "none", color: pale, fontFamily: "Raleway, sans-serif",
    boxSizing: "border-box" as const, transition: "border-color 0.3s ease",
  };

  return (
    <>
      <button onClick={() => setOpen(true)} style={{
        display: "flex", alignItems: "center", gap: "8px",
        padding: "10px 20px", border: `1px solid ${gold}`,
        background: "transparent", color: gold,
        fontSize: "0.65rem", letterSpacing: "0.2rem",
        cursor: "pointer", fontFamily: "Raleway, sans-serif",
        transition: "all 0.3s ease",
      }}
        onMouseEnter={e => { const el = e.currentTarget; el.style.background = "rgba(201,168,76,0.1)"; }}
        onMouseLeave={e => { const el = e.currentTarget; el.style.background = "transparent"; }}
      >
        <Icon name="Upload" size={14} style={{ color: gold }} />
        ЗАГРУЗИТЬ ТРЕК
      </button>

      {open && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "24px",
        }} onClick={e => { if (e.target === e.currentTarget) close(); }}>
          <div style={{
            background: "rgba(12,10,8,0.98)", border: "1px solid rgba(201,168,76,0.25)",
            padding: "40px", maxWidth: "480px", width: "100%",
            display: "flex", flexDirection: "column", gap: "20px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 className="font-display" style={{ fontSize: "1.4rem", fontWeight: 300, color: pale }}>Загрузить трек</h3>
              <button onClick={close} style={{ background: "none", border: "none", cursor: "pointer", color: pale, opacity: 0.5 }}>
                <Icon name="X" size={20} style={{ color: pale }} />
              </button>
            </div>

            {/* Зона drag & drop */}
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              style={{
                border: `2px dashed ${dragging ? gold : file ? "rgba(201,168,76,0.5)" : "rgba(201,168,76,0.2)"}`,
                background: dragging ? "rgba(201,168,76,0.05)" : "transparent",
                padding: "32px", textAlign: "center", cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              <input ref={inputRef} type="file" accept="audio/*" style={{ display: "none" }}
                onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
              {file ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                  <Icon name="Music" size={32} style={{ color: gold }} />
                  <p style={{ color: pale, fontSize: "0.9rem", fontWeight: 300 }}>{file.name}</p>
                  <p style={{ color: gold, fontSize: "0.7rem", opacity: 0.6 }}>{(file.size / 1024 / 1024).toFixed(1)} МБ</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                  <Icon name="Upload" size={32} style={{ color: gold, opacity: 0.4 }} />
                  <p style={{ color: pale, fontSize: "0.85rem", fontWeight: 300, opacity: 0.7 }}>
                    Перетащите MP3-файл сюда<br />или нажмите для выбора
                  </p>
                  <p style={{ color: gold, fontSize: "0.65rem", opacity: 0.4, marginTop: "4px" }}>MP3, OGG, WAV — до 50 МБ</p>
                </div>
              )}
            </div>

            {/* Поля */}
            <input
              value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Название трека *"
              style={inputStyle}
              onFocus={e => { (e.target as HTMLElement).style.borderColor = gold; }}
              onBlur={e => { (e.target as HTMLElement).style.borderColor = "rgba(201,168,76,0.2)"; }}
            />
            <input
              value={artist} onChange={e => setArtist(e.target.value)}
              placeholder="Артист / Исполнитель"
              style={inputStyle}
              onFocus={e => { (e.target as HTMLElement).style.borderColor = gold; }}
              onBlur={e => { (e.target as HTMLElement).style.borderColor = "rgba(201,168,76,0.2)"; }}
            />
            <select value={genre} onChange={e => setGenre(e.target.value)} style={{
              ...inputStyle, cursor: "pointer",
              background: "rgba(12,10,8,0.98)",
            }}>
              {GENRES.map(g => <option key={g} value={g} style={{ background: "#0c0a08" }}>{g}</option>)}
            </select>

            {error && <p style={{ color: "#e74c3c", fontSize: "0.8rem", margin: 0 }}>{error}</p>}

            {success ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", padding: "16px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)" }}>
                <Icon name="CheckCircle" size={20} style={{ color: gold }} />
                <span style={{ color: gold, fontSize: "0.9rem" }}>Трек успешно добавлен!</span>
              </div>
            ) : (
              <button onClick={submit} disabled={loading} style={{
                padding: "14px", background: loading ? "rgba(201,168,76,0.4)" : gold,
                border: "none", color: dark, fontSize: "0.75rem",
                fontWeight: 700, letterSpacing: "0.2rem",
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "Raleway, sans-serif", transition: "all 0.3s ease",
              }}>
                {loading ? "ЗАГРУЖАЮ..." : "ДОБАВИТЬ В КОЛЛЕКЦИЮ"}
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
