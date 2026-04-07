import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/3bff46a9-4c21-4377-aa90-8d240bb05750/files/14f8084c-f82e-4458-86f0-5e1228f150a1.jpg";
const ARTIST_IMAGE = "https://cdn.poehali.dev/projects/3bff46a9-4c21-4377-aa90-8d240bb05750/files/8efd2129-8f57-4fd7-af42-28ef9a0b28fe.jpg";
const FESTIVAL_IMAGE = "https://cdn.poehali.dev/projects/3bff46a9-4c21-4377-aa90-8d240bb05750/files/ea55f2fd-8ef5-46e2-962d-fa4986da3811.jpg";

const navLinks = ["О нас", "Артисты", "Концерты", "Медиа", "Контакты"];

const artists = [
  { name: "Анна Ветрова", genre: "Классическая музыка", image: ARTIST_IMAGE, description: "Лауреат международных премий, виртуоз скрипки с мировым именем" },
  { name: "Duo Nocturn", genre: "Джаз & Соул", image: HERO_IMAGE, description: "Дуэт, переосмысляющий джазовую традицию через современные звуки" },
  { name: "Орхан Сарез", genre: "Этника & Фьюжн", image: FESTIVAL_IMAGE, description: "Мастер уда и синтеза восточных и западных музыкальных культур" },
];

const concerts = [
  { date: "15", month: "МАЙ", title: "Симфонический вечер", artist: "Анна Ветрова", time: "20:00", price: "от 3 500 ₽" },
  { date: "22", month: "МАЙ", title: "Jazz Night Deluxe", artist: "Duo Nocturn", time: "21:00", price: "от 2 800 ₽" },
  { date: "03", month: "ИЮН", title: "Восточные ритмы", artist: "Орхан Сарез", time: "20:30", price: "от 3 200 ₽" },
  { date: "14", month: "ИЮН", title: "Летний гала-концерт", artist: "Все артисты", time: "19:00", price: "от 5 500 ₽" },
];

const reviews = [
  { name: "Мария К.", text: "Атмосфера, которую невозможно забыть. Каждый вечер здесь — это отдельная история, рассказанная через музыку.", rating: 5 },
  { name: "Александр П.", text: "Лучший камерный зал Москвы. Акустика безупречна, а сервис на уровне пятизвёздочного отеля.", rating: 5 },
  { name: "Елена В.", text: "Приходим сюда уже три года подряд. Волны Музыки стали для нас ритуалом — местом, где время останавливается.", rating: 5 },
];

function useInView(ref: React.RefObject<HTMLElement>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.12 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return inView;
}

function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref);
  return (
    <section
      id={id}
      ref={ref}
      className={`transition-all duration-1000 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"} ${className}`}
    >
      {children}
    </section>
  );
}

function SectionTitle({ label, title, subtitle }: { label: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-16">
      <p className="text-xs tracking-[0.4rem] mb-4 opacity-60" style={{ color: "var(--gold)" }}>— {label} —</p>
      <h2 className="font-display text-5xl md:text-6xl font-light leading-tight mb-5 text-gold-gradient">{title}</h2>
      {subtitle && <p className="text-lg font-light max-w-xl mx-auto leading-relaxed" style={{ opacity: 0.6 }}>{subtitle}</p>}
      <div className="gold-line w-24 mx-auto mt-6" />
    </div>
  );
}

const RADIO_URL = "https://stream.zeno.fm/yn65m0h1k08uv";

export default function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [radioPlaying, setRadioPlaying] = useState(false);
  const [radioLoading, setRadioLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleRadio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (radioPlaying) {
      audio.pause();
      setRadioPlaying(false);
    } else {
      setRadioLoading(true);
      audio.src = RADIO_URL;
      audio.play()
        .then(() => { setRadioPlaying(true); setRadioLoading(false); })
        .catch(() => setRadioLoading(false));
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--dark-base)", color: "var(--gold-pale)", fontFamily: "Raleway, sans-serif", overflowX: "hidden" }}>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        transition: "all 0.5s ease",
        background: scrolled ? "rgba(12,10,8,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(201,168,76,0.15)" : "none",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={toggleRadio} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px", padding: 0 }}>
            <div style={{
              position: "relative", width: "36px", height: "36px", borderRadius: "50%",
              border: `1px solid ${radioPlaying ? "var(--gold)" : "rgba(201,168,76,0.4)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.3s ease",
              boxShadow: radioPlaying ? "0 0 16px rgba(201,168,76,0.5)" : "none",
              background: radioPlaying ? "rgba(201,168,76,0.12)" : "transparent",
            }}>
              {radioLoading ? (
                <div style={{ width: "14px", height: "14px", border: "2px solid var(--gold)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              ) : radioPlaying ? (
                <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
                  {[1,2,3].map(i => (
                    <div key={i} style={{ width: "3px", background: "var(--gold)", borderRadius: "2px", animation: `barPulse 0.8s ease-in-out ${i * 0.15}s infinite alternate`, height: `${6 + i * 3}px` }} />
                  ))}
                </div>
              ) : (
                <Icon name="Play" size={13} style={{ color: "var(--gold)", marginLeft: "2px" }} />
              )}
              {radioPlaying && (
                <div style={{ position: "absolute", inset: "-4px", borderRadius: "50%", border: "1px solid rgba(201,168,76,0.3)", animation: "radioRing 1.5s ease-out infinite" }} />
              )}
            </div>
            <div>
              <div className="font-display gold-shimmer" style={{ fontSize: "1.5rem", fontWeight: 300, lineHeight: 1 }}>
                Волны Музыки
              </div>
              {radioPlaying && (
                <div style={{ fontSize: "0.55rem", letterSpacing: "0.2rem", color: "var(--gold)", opacity: 0.7, marginTop: "2px" }}>
                  ● РАДИО В ЭФИРЕ
                </div>
              )}
            </div>
          </button>
          <audio ref={audioRef} />
          <div className="hidden md:flex" style={{ alignItems: "center", gap: "40px" }}>
            {navLinks.map((link) => (
              <a key={link} href={`#${link.toLowerCase().replace(" ", "-")}`}
                style={{ fontSize: "0.7rem", letterSpacing: "0.2rem", fontWeight: 300, color: "var(--gold-pale)", opacity: 0.7, textDecoration: "none", transition: "all 0.3s ease" }}
                onMouseEnter={e => { (e.target as HTMLElement).style.opacity = "1"; (e.target as HTMLElement).style.color = "var(--gold-light)"; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.opacity = "0.7"; (e.target as HTMLElement).style.color = "var(--gold-pale)"; }}>
                {link.toUpperCase()}
              </a>
            ))}
            <button style={{
              marginLeft: "16px", padding: "8px 24px",
              border: "1px solid var(--gold)", background: "transparent",
              color: "var(--gold)", fontSize: "0.7rem", letterSpacing: "0.2rem", fontWeight: 400,
              cursor: "pointer", transition: "all 0.3s ease"
            }}
              onMouseEnter={e => { (e.target as HTMLElement).style.background = "var(--gold)"; (e.target as HTMLElement).style.color = "var(--dark-base)"; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.background = "transparent"; (e.target as HTMLElement).style.color = "var(--gold)"; }}>
              БИЛЕТЫ
            </button>
          </div>
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gold)" }}>
            <Icon name={menuOpen ? "X" : "Menu"} size={22} />
          </button>
        </div>
        {menuOpen && (
          <div style={{ background: "rgba(12,10,8,0.98)", borderTop: "1px solid rgba(201,168,76,0.15)", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
            {navLinks.map((link) => (
              <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setMenuOpen(false)}
                style={{ fontSize: "0.7rem", letterSpacing: "0.2rem", fontWeight: 300, color: "var(--gold-pale)", opacity: 0.8, textDecoration: "none" }}>
                {link.toUpperCase()}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <div style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <img src={HERO_IMAGE} alt="hero" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.22 }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(12,10,8,0.5), rgba(12,10,8,0.6), var(--dark-base))" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, var(--dark-base), transparent 30%, transparent 70%, var(--dark-base))" }} />
        </div>

        <div className="animate-float" style={{ position: "absolute", top: "25%", left: "20%", width: "350px", height: "350px", borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.5), transparent 70%)", filter: "blur(60px)", opacity: 0.12 }} />
        <div className="animate-float" style={{ position: "absolute", bottom: "30%", right: "20%", width: "250px", height: "250px", borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.4), transparent 70%)", filter: "blur(40px)", opacity: 0.1, animationDelay: "2s" }} />

        <div className="animate-fade-in-up" style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 24px", maxWidth: "900px" }}>
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.6rem", color: "var(--gold)", opacity: 0.6, marginBottom: "32px" }}>
            — ПРЕМИАЛЬНЫЙ МУЗЫКАЛЬНЫЙ КЛУБ —
          </p>
          <h1 className="font-display" style={{ fontSize: "clamp(4rem, 12vw, 9rem)", fontWeight: 300, lineHeight: 0.95, marginBottom: "24px" }}>
            <span className="gold-shimmer">Волны</span>
            <br />
            <span style={{ color: "var(--gold-pale)", fontStyle: "italic" }}>Музыки</span>
          </h1>
          <div className="gold-line" style={{ width: "120px", margin: "32px auto" }} />
          <p style={{ fontSize: "1.1rem", fontWeight: 300, letterSpacing: "0.05rem", color: "var(--gold-pale)", opacity: 0.65, marginBottom: "48px", maxWidth: "560px", margin: "0 auto 48px", lineHeight: 1.8 }}>
            Место, где музыка становится переживанием.<br />
            Живые концерты. Мировые артисты. Незабываемые вечера.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "center" }}>
            <button style={{
              padding: "16px 40px", background: "var(--gold)", color: "var(--dark-base)",
              border: "none", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.2rem",
              cursor: "pointer", transition: "all 0.3s ease", fontFamily: "Raleway, sans-serif",
              boxShadow: "0 0 0 rgba(201,168,76,0)"
            }}
              onMouseEnter={e => { const el = e.target as HTMLElement; el.style.background = "var(--gold-light)"; el.style.boxShadow = "0 0 40px rgba(201,168,76,0.4)"; }}
              onMouseLeave={e => { const el = e.target as HTMLElement; el.style.background = "var(--gold)"; el.style.boxShadow = "0 0 0 rgba(201,168,76,0)"; }}>
              КУПИТЬ БИЛЕТЫ
            </button>
            <button style={{
              padding: "16px 40px", background: "transparent",
              border: "1px solid rgba(201,168,76,0.4)", color: "var(--gold-pale)",
              fontSize: "0.7rem", fontWeight: 300, letterSpacing: "0.2rem",
              cursor: "pointer", transition: "all 0.3s ease", fontFamily: "Raleway, sans-serif"
            }}
              onMouseEnter={e => { const el = e.target as HTMLElement; el.style.borderColor = "var(--gold)"; el.style.color = "var(--gold)"; }}
              onMouseLeave={e => { const el = e.target as HTMLElement; el.style.borderColor = "rgba(201,168,76,0.4)"; el.style.color = "var(--gold-pale)"; }}>
              АФИША СОБЫТИЙ
            </button>
          </div>
        </div>

        <div style={{ position: "absolute", bottom: "40px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", opacity: 0.35 }}>
          <span style={{ fontSize: "0.6rem", letterSpacing: "0.3rem", color: "var(--gold)" }}>SCROLL</span>
          <div style={{ width: "1px", height: "48px", background: "linear-gradient(to bottom, var(--gold), transparent)" }} />
        </div>
      </div>

      {/* ABOUT */}
      <Section id="о-нас" className="py-32 px-6" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "80px", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: "0.65rem", letterSpacing: "0.4rem", color: "var(--gold)", opacity: 0.6, marginBottom: "24px" }}>— О НАС —</p>
            <h2 className="font-display" style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)", fontWeight: 300, lineHeight: 1.15, marginBottom: "32px", background: "linear-gradient(135deg, #C9A84C, #F5E6C0, #C9A84C)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Музыка как<br /><em>высокое искусство</em>
            </h2>
            <div className="gold-line" style={{ width: "60px", marginBottom: "32px" }} />
            <p style={{ fontWeight: 300, lineHeight: 1.8, opacity: 0.7, fontSize: "1rem", marginBottom: "20px" }}>
              Волны Музыки — это не просто концертный зал. Это пространство, где каждый вечер создаётся история.
              Мы объединяем мировых артистов и ценителей искусства в атмосфере безупречного вкуса.
            </p>
            <p style={{ fontWeight: 300, lineHeight: 1.8, opacity: 0.55, fontSize: "0.95rem" }}>
              Основанный в 2018 году, наш клуб стал синонимом музыкального превосходства в Москве.
              Камерная акустика, авторская программа и сервис высочайшего уровня.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px", marginTop: "48px" }}>
              {[["200+", "Концертов"], ["50+", "Артистов"], ["15K", "Гостей"]].map(([num, label]) => (
                <div key={label} style={{ textAlign: "center", borderTop: "1px solid rgba(201,168,76,0.2)", paddingTop: "16px" }}>
                  <p className="font-display" style={{ fontSize: "2rem", fontWeight: 300, color: "var(--gold)" }}>{num}</p>
                  <p style={{ fontSize: "0.6rem", letterSpacing: "0.2rem", opacity: 0.45, marginTop: "4px" }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <img src={ARTIST_IMAGE} alt="Артист" style={{ width: "100%", height: "500px", objectFit: "cover", opacity: 0.85 }} />
            <div style={{ position: "absolute", inset: 0, border: "1px solid rgba(201,168,76,0.2)" }} />
            <div style={{ position: "absolute", bottom: "-12px", right: "-12px", width: "100%", height: "100%", border: "1px solid rgba(201,168,76,0.1)" }} />
          </div>
        </div>
      </Section>

      <div className="gold-line" style={{ opacity: 0.25 }} />

      {/* ARTISTS */}
      <Section id="артисты" className="py-32 px-6">
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <SectionTitle label="АРТИСТЫ" title="Мастера звука" subtitle="Лучшие музыканты мира на нашей сцене" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px" }}>
            {artists.map((artist, i) => (
              <div key={i} className="group" style={{ border: "1px solid rgba(201,168,76,0.2)", cursor: "pointer", transition: "all 0.3s ease", overflow: "hidden" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.5)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 30px rgba(201,168,76,0.1)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.2)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                <div style={{ position: "relative", overflow: "hidden", height: "300px" }}>
                  <img src={artist.image} alt={artist.name} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.65, transition: "all 0.7s ease" }}
                    onMouseEnter={e => { (e.target as HTMLElement).style.transform = "scale(1.05)"; (e.target as HTMLElement).style.opacity = "0.85"; }}
                    onMouseLeave={e => { (e.target as HTMLElement).style.transform = "scale(1)"; (e.target as HTMLElement).style.opacity = "0.65"; }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, var(--dark-base), transparent)" }} />
                </div>
                <div style={{ padding: "24px", background: "var(--dark-card)" }}>
                  <p style={{ fontSize: "0.65rem", letterSpacing: "0.2rem", color: "var(--gold)", opacity: 0.7, marginBottom: "8px" }}>{artist.genre}</p>
                  <h3 className="font-display" style={{ fontSize: "1.5rem", fontWeight: 300, color: "var(--gold-pale)", marginBottom: "12px" }}>{artist.name}</h3>
                  <p style={{ fontSize: "0.85rem", opacity: 0.5, fontWeight: 300, lineHeight: 1.6 }}>{artist.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <div className="gold-line" style={{ opacity: 0.25 }} />

      {/* CONCERTS */}
      <Section id="концерты" className="py-32 px-6">
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <SectionTitle label="АФИША" title="Ближайшие события" subtitle="Забронируйте место заранее" />
          <div>
            {concerts.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "28px 24px", borderBottom: "1px solid rgba(201,168,76,0.12)", cursor: "pointer", transition: "all 0.3s ease" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.04)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
                  <div style={{ textAlign: "center", width: "60px", flexShrink: 0 }}>
                    <p className="font-display" style={{ fontSize: "2.5rem", fontWeight: 300, color: "var(--gold)", lineHeight: 1 }}>{c.date}</p>
                    <p style={{ fontSize: "0.6rem", letterSpacing: "0.2rem", opacity: 0.45 }}>{c.month}</p>
                  </div>
                  <div style={{ width: "1px", height: "40px", background: "rgba(201,168,76,0.2)" }} />
                  <div>
                    <h3 className="font-display" style={{ fontSize: "1.3rem", fontWeight: 300, color: "var(--gold-pale)", marginBottom: "4px" }}>{c.title}</h3>
                    <p style={{ fontSize: "0.8rem", opacity: 0.5, letterSpacing: "0.05rem" }}>{c.artist} · {c.time}</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                  <span style={{ color: "var(--gold)", fontWeight: 300, fontSize: "0.9rem" }}>{c.price}</span>
                  <button style={{
                    padding: "8px 20px", border: "1px solid rgba(201,168,76,0.3)", background: "transparent",
                    color: "var(--gold)", fontSize: "0.65rem", letterSpacing: "0.15rem", cursor: "pointer",
                    fontFamily: "Raleway, sans-serif", transition: "all 0.3s ease"
                  }}
                    onMouseEnter={e => { const el = e.target as HTMLElement; el.style.background = "var(--gold)"; el.style.color = "var(--dark-base)"; }}
                    onMouseLeave={e => { const el = e.target as HTMLElement; el.style.background = "transparent"; el.style.color = "var(--gold)"; }}>
                    БИЛЕТЫ
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "48px" }}>
            <button style={{
              padding: "14px 40px", border: "1px solid rgba(201,168,76,0.3)", background: "transparent",
              color: "var(--gold)", fontSize: "0.7rem", letterSpacing: "0.2rem", fontWeight: 300,
              cursor: "pointer", fontFamily: "Raleway, sans-serif", transition: "all 0.3s ease"
            }}
              onMouseEnter={e => { const el = e.target as HTMLElement; el.style.background = "var(--gold)"; el.style.color = "var(--dark-base)"; }}
              onMouseLeave={e => { const el = e.target as HTMLElement; el.style.background = "transparent"; el.style.color = "var(--gold)"; }}>
              ПОЛНАЯ АФИША
            </button>
          </div>
        </div>
      </Section>

      <div className="gold-line" style={{ opacity: 0.25 }} />

      {/* MEDIA */}
      <Section id="медиа" className="py-32 px-6">
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <SectionTitle label="МЕДИА" title="Атмосфера клуба" />
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gridTemplateRows: "auto auto", gap: "12px" }}>
            <div style={{ gridRow: "span 2", position: "relative", overflow: "hidden", cursor: "pointer", height: "460px" }}
              className="group">
              <img src={FESTIVAL_IMAGE} alt="festival" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7, transition: "all 0.7s ease" }}
                onMouseEnter={e => { (e.target as HTMLElement).style.transform = "scale(1.04)"; (e.target as HTMLElement).style.opacity = "0.9"; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.transform = "scale(1)"; (e.target as HTMLElement).style.opacity = "0.7"; }} />
              <div style={{ position: "absolute", inset: 0, border: "1px solid rgba(201,168,76,0.15)" }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.3s ease" }}
                className="group-hover:opacity-100">
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", border: "2px solid var(--gold)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="Play" size={22} style={{ color: "var(--gold)", marginLeft: "3px" }} />
                </div>
              </div>
            </div>
            <div style={{ position: "relative", overflow: "hidden", cursor: "pointer", height: "224px" }}>
              <img src={HERO_IMAGE} alt="hall" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7, transition: "all 0.7s ease" }}
                onMouseEnter={e => { (e.target as HTMLElement).style.transform = "scale(1.05)"; (e.target as HTMLElement).style.opacity = "0.9"; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.transform = "scale(1)"; (e.target as HTMLElement).style.opacity = "0.7"; }} />
              <div style={{ position: "absolute", inset: 0, border: "1px solid rgba(201,168,76,0.15)" }} />
            </div>
            <div style={{ position: "relative", overflow: "hidden", cursor: "pointer", height: "224px" }}>
              <img src={ARTIST_IMAGE} alt="artist" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7, transition: "all 0.7s ease" }}
                onMouseEnter={e => { (e.target as HTMLElement).style.transform = "scale(1.05)"; (e.target as HTMLElement).style.opacity = "0.9"; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.transform = "scale(1)"; (e.target as HTMLElement).style.opacity = "0.7"; }} />
              <div style={{ position: "absolute", inset: 0, border: "1px solid rgba(201,168,76,0.15)" }} />
            </div>
          </div>
        </div>
      </Section>

      <div className="gold-line" style={{ opacity: 0.25 }} />

      {/* REVIEWS */}
      <Section className="py-32 px-6" style={{ background: "var(--dark-card)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <SectionTitle label="ОТЗЫВЫ" title="Голоса наших гостей" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px" }}>
            {reviews.map((r, i) => (
              <div key={i} style={{ padding: "36px", border: "1px solid rgba(201,168,76,0.15)", transition: "all 0.3s ease", cursor: "default" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.4)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.15)"; }}>
                <div className="font-display" style={{ fontSize: "3rem", color: "var(--gold)", opacity: 0.3, lineHeight: 1, marginBottom: "16px" }}>"</div>
                <p style={{ fontWeight: 300, lineHeight: 1.8, opacity: 0.65, fontSize: "0.9rem", marginBottom: "32px" }}>{r.text}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <p style={{ color: "var(--gold)", fontSize: "0.85rem", letterSpacing: "0.05rem" }}>{r.name}</p>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {Array.from({ length: r.rating }).map((_, j) => (
                      <Icon key={j} name="Star" size={12} style={{ color: "var(--gold)", fill: "var(--gold)" }} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <div className="gold-line" style={{ opacity: 0.25 }} />

      {/* CONTACT */}
      <Section id="контакты" className="py-32 px-6">
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <SectionTitle label="КОНТАКТЫ" title="Свяжитесь с нами" subtitle="Мы ответим на все ваши вопросы" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "32px", marginBottom: "64px" }}>
            {[
              { icon: "MapPin", label: "АДРЕС", value: "Москва, ул. Большая Никитская, 24" },
              { icon: "Phone", label: "ТЕЛЕФОН", value: "+7 (495) 000-00-00" },
              { icon: "Mail", label: "EMAIL", value: "info@volnymuzyki.ru" },
            ].map(({ icon, label, value }) => (
              <div key={label} style={{ textAlign: "center", cursor: "pointer" }}>
                <div style={{ width: "56px", height: "56px", border: "1px solid rgba(201,168,76,0.25)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", transition: "all 0.3s ease" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--gold)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.25)"; }}>
                  <Icon name={icon} size={18} style={{ color: "var(--gold)" }} />
                </div>
                <p style={{ fontSize: "0.6rem", letterSpacing: "0.25rem", opacity: 0.4, marginBottom: "8px" }}>{label}</p>
                <p style={{ fontWeight: 300, fontSize: "0.85rem", opacity: 0.75 }}>{value}</p>
              </div>
            ))}
          </div>

          <div>
            <p className="font-display" style={{ fontSize: "1.6rem", fontWeight: 300, color: "var(--gold-pale)", marginBottom: "32px", fontStyle: "italic" }}>
              Оставьте заявку — мы подберём лучшие места
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input type="text" placeholder="Ваше имя"
                style={{ width: "100%", background: "transparent", border: "1px solid rgba(201,168,76,0.2)", padding: "16px 20px", fontSize: "0.9rem", fontWeight: 300, letterSpacing: "0.05rem", outline: "none", color: "var(--gold-pale)", fontFamily: "Raleway, sans-serif", boxSizing: "border-box", transition: "border-color 0.3s ease" }}
                onFocus={e => { (e.target as HTMLElement).style.borderColor = "var(--gold)"; }}
                onBlur={e => { (e.target as HTMLElement).style.borderColor = "rgba(201,168,76,0.2)"; }} />
              <input type="text" placeholder="Телефон или email"
                style={{ width: "100%", background: "transparent", border: "1px solid rgba(201,168,76,0.2)", padding: "16px 20px", fontSize: "0.9rem", fontWeight: 300, letterSpacing: "0.05rem", outline: "none", color: "var(--gold-pale)", fontFamily: "Raleway, sans-serif", boxSizing: "border-box", transition: "border-color 0.3s ease" }}
                onFocus={e => { (e.target as HTMLElement).style.borderColor = "var(--gold)"; }}
                onBlur={e => { (e.target as HTMLElement).style.borderColor = "rgba(201,168,76,0.2)"; }} />
              <button style={{
                width: "100%", padding: "18px", background: "var(--gold)", color: "var(--dark-base)",
                border: "none", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.25rem",
                cursor: "pointer", fontFamily: "Raleway, sans-serif", transition: "all 0.3s ease"
              }}
                onMouseEnter={e => { const el = e.target as HTMLElement; el.style.background = "var(--gold-light)"; el.style.boxShadow = "0 0 40px rgba(201,168,76,0.3)"; }}
                onMouseLeave={e => { const el = e.target as HTMLElement; el.style.background = "var(--gold)"; el.style.boxShadow = "none"; }}>
                ОТПРАВИТЬ ЗАЯВКУ
              </button>
            </div>
          </div>
        </div>
      </Section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid rgba(201,168,76,0.12)", padding: "40px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "24px" }}>
          <p className="font-display gold-shimmer" style={{ fontSize: "1.4rem", fontWeight: 300 }}>Волны Музыки</p>
          <p style={{ fontSize: "0.6rem", letterSpacing: "0.15rem", opacity: 0.25 }}>© 2026 ВОЛНЫ МУЗЫКИ. ВСЕ ПРАВА ЗАЩИЩЕНЫ.</p>
          <div style={{ display: "flex", gap: "24px" }}>
            {["VK", "TG", "YT"].map((s) => (
              <button key={s} style={{ background: "none", border: "none", fontSize: "0.65rem", letterSpacing: "0.2rem", opacity: 0.4, cursor: "pointer", color: "var(--gold-pale)", fontFamily: "Raleway, sans-serif", transition: "all 0.3s ease" }}
                onMouseEnter={e => { const el = e.target as HTMLElement; el.style.opacity = "1"; el.style.color = "var(--gold)"; }}
                onMouseLeave={e => { const el = e.target as HTMLElement; el.style.opacity = "0.4"; el.style.color = "var(--gold-pale)"; }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}