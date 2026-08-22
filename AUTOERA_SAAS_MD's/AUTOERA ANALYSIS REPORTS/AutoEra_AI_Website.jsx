import { useState, useEffect, useRef, useCallback } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────
const T = {
  navy: "#061329",
  navyMid: "#0A1F3F",
  navyLight: "#0F2A52",
  orange: "#FF6B00",
  orangeGlow: "#FF8C00",
  orangeDim: "#CC4500",
  white: "#FFFFFF",
  offWhite: "#E8EDF5",
  grey: "#8899BB",
  greyDim: "#3A4A6B",
  glass: "rgba(255,255,255,0.04)",
  glassBorder: "rgba(255,255,255,0.08)",
};

// ─── GLOBAL STYLES ─────────────────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html { scroll-behavior: smooth; }

    body {
      background: ${T.navy};
      color: ${T.white};
      font-family: 'Inter', sans-serif;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
    }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: ${T.navy}; }
    ::-webkit-scrollbar-thumb { background: ${T.orange}; border-radius: 2px; }

    ::selection { background: ${T.orange}30; color: ${T.white}; }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-12px); }
    }
    @keyframes pulse-ring {
      0% { transform: scale(0.8); opacity: 1; }
      100% { transform: scale(2.2); opacity: 0; }
    }
    @keyframes data-flow {
      0% { stroke-dashoffset: 1000; opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { stroke-dashoffset: 0; opacity: 0; }
    }
    @keyframes shimmer {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes gradient-shift {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }
    @keyframes count-up {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes scan-line {
      0% { top: 0%; }
      100% { top: 100%; }
    }
    @keyframes orbit {
      from { transform: rotate(0deg) translateX(120px) rotate(0deg); }
      to { transform: rotate(360deg) translateX(120px) rotate(-360deg); }
    }
    @keyframes particle-rise {
      0% { transform: translateY(0) translateX(0); opacity: 0.8; }
      100% { transform: translateY(-200px) translateX(var(--dx, 20px)); opacity: 0; }
    }
    @keyframes slide-in-left {
      from { opacity: 0; transform: translateX(-40px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes slide-in-right {
      from { opacity: 0; transform: translateX(40px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes fade-up {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes neural-pulse {
      0%, 100% { r: 3; opacity: 0.4; }
      50% { r: 6; opacity: 1; }
    }
    @keyframes border-glow {
      0%, 100% { border-color: rgba(255,107,0,0.3); }
      50% { border-color: rgba(255,107,0,0.8); }
    }
    @keyframes typewriter {
      from { width: 0; }
      to { width: 100%; }
    }
    @keyframes blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0; }
    }

    .float { animation: float 4s ease-in-out infinite; }
    .float-delay-1 { animation: float 4s ease-in-out 1s infinite; }
    .float-delay-2 { animation: float 4s ease-in-out 2s infinite; }
    .float-delay-3 { animation: float 4s ease-in-out 3s infinite; }

    .fade-up { animation: fade-up 0.7s ease forwards; }
    .slide-left { animation: slide-in-left 0.7s ease forwards; }
    .slide-right { animation: slide-in-right 0.7s ease forwards; }

    .glass-card {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-radius: 16px;
      transition: all 0.3s ease;
    }
    .glass-card:hover {
      background: rgba(255,107,0,0.06);
      border-color: rgba(255,107,0,0.25);
      transform: translateY(-4px);
      box-shadow: 0 20px 60px rgba(255,107,0,0.1);
    }

    .orange-glow {
      box-shadow: 0 0 30px rgba(255,107,0,0.3), 0 0 60px rgba(255,107,0,0.1);
    }

    .section-label {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 3px;
      color: ${T.orange};
      text-transform: uppercase;
    }

    .gradient-text {
      background: linear-gradient(135deg, ${T.white} 0%, ${T.orange} 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .btn-primary {
      background: linear-gradient(135deg, ${T.orange}, ${T.orangeGlow});
      color: white;
      border: none;
      padding: 14px 32px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 15px;
      cursor: pointer;
      transition: all 0.3s ease;
      letter-spacing: 0.3px;
      font-family: 'Inter', sans-serif;
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 40px rgba(255,107,0,0.4);
    }

    .btn-secondary {
      background: rgba(255,255,255,0.05);
      color: white;
      border: 1px solid rgba(255,255,255,0.15);
      padding: 14px 32px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 15px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-family: 'Inter', sans-serif;
    }
    .btn-secondary:hover {
      background: rgba(255,255,255,0.1);
      border-color: rgba(255,107,0,0.4);
      transform: translateY(-2px);
    }

    nav a { text-decoration: none; }

    @media (max-width: 768px) {
      .hide-mobile { display: none !important; }
      .stack-mobile { flex-direction: column !important; }
    }
  `}</style>
);

// ─── NEURAL NETWORK SVG BACKGROUND ─────────────────────────────
const NeuralBackground = () => {
  const nodes = [
    {x:10,y:20},{x:25,y:60},{x:15,y:80},{x:40,y:35},
    {x:55,y:15},{x:70,y:50},{x:85,y:25},{x:90,y:70},
    {x:60,y:80},{x:35,y:70},{x:75,y:90},{x:50,y:55},
    {x:20,y:45},{x:80,y,y:10},{x:45,y:90},
  ].map((n,i) => ({...n, delay: i * 0.3, dur: 2 + (i % 3) * 0.5}));

  const edges = [
    [0,3],[0,12],[1,2],[1,9],[2,9],[3,4],[3,11],[4,5],
    [4,6],[5,11],[5,7],[6,7],[6,13],[7,8],[8,10],[9,10],
    [9,11],[10,14],[11,12],[12,13],[13,14],
  ];

  return (
    <svg
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.15, pointerEvents: "none" }}
      viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id="nodeGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={T.orange} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={`${nodes[a].x}%`} y1={`${nodes[a].y}%`}
          x2={`${nodes[b] ? nodes[b].x : 50}%`} y2={`${nodes[b] ? nodes[b].y : 50}%`}
          stroke={T.orange} strokeWidth="0.15" strokeOpacity="0.4"
          strokeDasharray="0.5 1"
        />
      ))}
      {nodes.map((n, i) => (
        <circle
          key={i} cx={`${n.x}%`} cy={`${n.y}%`} r="0.5"
          fill={T.orange} opacity="0.7" filter="url(#glow)"
        >
          <animate attributeName="opacity" values="0.3;1;0.3"
            dur={`${n.dur}s`} begin={`${n.delay}s`} repeatCount="indefinite" />
          <animate attributeName="r" values="0.4;0.8;0.4"
            dur={`${n.dur}s`} begin={`${n.delay}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
};

// ─── ANIMATED PARTICLES ─────────────────────────────────────────
const Particles = ({ count = 20 }) => {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1 + Math.random() * 2,
    dur: 3 + Math.random() * 4,
    delay: Math.random() * 4,
    dx: (Math.random() - 0.5) * 60,
  }));

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: "absolute",
          left: `${p.x}%`, top: `${p.y}%`,
          width: p.size, height: p.size,
          borderRadius: "50%",
          background: T.orange,
          opacity: 0,
          animation: `particle-rise ${p.dur}s ease-out ${p.delay}s infinite`,
          "--dx": `${p.dx}px`,
        }} />
      ))}
    </div>
  );
};

// ─── LOGO COMPONENT ─────────────────────────────────────────────
const Logo = ({ size = 36 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0A1F3F" />
          <stop offset="50%" stopColor="#1A3A5C" />
          <stop offset="100%" stopColor="#FF6B00" />
        </linearGradient>
      </defs>
      {/* A shape left leg */}
      <path d="M10 88 L45 12" stroke="url(#logoGrad)" strokeWidth="12" strokeLinecap="round" fill="none" />
      {/* A shape right leg - orange */}
      <path d="M90 88 L45 12" stroke="#FF6B00" strokeWidth="12" strokeLinecap="round" fill="none" />
      {/* Crossbar */}
      <path d="M28 58 L58 58" stroke="#0A1F3F" strokeWidth="8" strokeLinecap="round" />
      <path d="M28 58 L58 58" stroke="#FF6B00" strokeWidth="4" strokeLinecap="round" />
      {/* Circuit nodes */}
      <line x1="22" y1="48" x2="8" y2="48" stroke="#0A1F3F" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="8" cy="48" r="3" fill="#0A1F3F" />
      <line x1="26" y1="55" x2="8" y2="55" stroke="#0A1F3F" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="8" cy="55" r="3" fill="#0A1F3F" />
      <line x1="30" y1="62" x2="8" y2="62" stroke="#0A1F3F" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="8" cy="62" r="3" fill="#0A1F3F" />
    </svg>
    <div>
      <div style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 700,
        fontSize: size * 0.58,
        lineHeight: 1,
        letterSpacing: "-0.5px",
      }}>
        <span style={{ color: T.white }}>AUTO</span>
        <span style={{ color: T.orange }}>ERA</span>
      </div>
      <div style={{ color: T.orange, fontSize: size * 0.22, fontWeight: 700, letterSpacing: "2px" }}>AI</div>
    </div>
  </div>
);

// ─── NAVIGATION ─────────────────────────────────────────────────
const Nav = ({ activeSection }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = ["Platform", "AI Agents", "Solutions", "Roadmap", "Company"];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      padding: "0 32px",
      height: 72,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: scrolled ? "rgba(6,19,41,0.95)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
      transition: "all 0.4s ease",
    }}>
      <Logo size={34} />

      <div className="hide-mobile" style={{ display: "flex", gap: 40, alignItems: "center" }}>
        {links.map(l => (
          <a key={l} href={`#${l.toLowerCase().replace(" ", "-")}`} style={{
            color: T.grey, fontSize: 14, fontWeight: 500,
            transition: "color 0.2s",
            cursor: "pointer",
          }}
          onMouseEnter={e => e.target.style.color = T.white}
          onMouseLeave={e => e.target.style.color = T.grey}
          >{l}</a>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button className="btn-secondary hide-mobile" style={{ padding: "10px 24px", fontSize: 14 }}>
          Sign In
        </button>
        <button className="btn-primary" style={{ padding: "10px 24px", fontSize: 14 }}>
          Book Demo
        </button>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            display: "none", background: "none", border: "1px solid rgba(255,255,255,0.15)",
            color: T.white, padding: "8px 12px", borderRadius: 6, cursor: "pointer", fontSize: 18,
          }}
          className="mobile-menu-btn"
        >☰</button>
      </div>
    </nav>
  );
};

// ─── HERO SECTION ────────────────────────────────────────────────
const HeroSection = () => {
  const [typed, setTyped] = useState("");
  const words = ["Dealerships", "Service Centers", "OEM Networks", "Fleet Operators", "EV Companies"];
  const [wordIdx, setWordIdx] = useState(0);

  useEffect(() => {
    let charIdx = 0;
    let forward = true;
    let timeout;

    const type = () => {
      const word = words[wordIdx];
      if (forward) {
        if (charIdx <= word.length) {
          setTyped(word.slice(0, charIdx));
          charIdx++;
          timeout = setTimeout(type, 80);
        } else {
          forward = false;
          timeout = setTimeout(type, 1800);
        }
      } else {
        if (charIdx > 0) {
          charIdx--;
          setTyped(word.slice(0, charIdx));
          timeout = setTimeout(type, 40);
        } else {
          forward = true;
          setWordIdx(i => (i + 1) % words.length);
          timeout = setTimeout(type, 200);
        }
      }
    };
    timeout = setTimeout(type, 500);
    return () => clearTimeout(timeout);
  }, [wordIdx]);

  return (
    <section style={{
      minHeight: "100vh",
      position: "relative",
      display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden",
      padding: "100px 32px 60px",
    }}>
      {/* Radial background */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse 80% 60% at 50% 40%, rgba(255,107,0,0.08) 0%, transparent 70%),
                     radial-gradient(ellipse 60% 40% at 80% 20%, rgba(10,31,63,0.8) 0%, transparent 60%),
                     linear-gradient(180deg, ${T.navyMid} 0%, ${T.navy} 100%)`,
      }} />
      <NeuralBackground />
      <Particles count={25} />

      {/* Grid overlay */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.04,
        backgroundImage: `linear-gradient(rgba(255,107,0,0.5) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,107,0,0.5) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />

      {/* Orbiting rings */}
      <div style={{ position: "absolute", right: "8%", top: "15%", width: 300, height: 300 }}>
        <div className="float" style={{
          position: "absolute", inset: 0,
          border: "1px solid rgba(255,107,0,0.15)",
          borderRadius: "50%",
        }} />
        <div className="float-delay-1" style={{
          position: "absolute", inset: 20,
          border: "1px solid rgba(255,107,0,0.10)",
          borderRadius: "50%",
        }} />
        <div className="float-delay-2" style={{
          position: "absolute", inset: 50,
          border: "2px solid rgba(255,107,0,0.20)",
          borderRadius: "50%",
        }} />
        {/* Pulse */}
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            position: "absolute",
            inset: "50%",
            width: 12, height: 12,
            marginLeft: -6, marginTop: -6,
            borderRadius: "50%",
            border: "2px solid rgba(255,107,0,0.5)",
            animation: `pulse-ring 2s ease-out ${i * 0.7}s infinite`,
          }} />
        ))}
        {/* Center sphere */}
        <div style={{
          position: "absolute", inset: "50%",
          width: 24, height: 24, marginLeft: -12, marginTop: -12,
          borderRadius: "50%",
          background: "radial-gradient(circle, #FF6B00, #CC4500)",
          boxShadow: "0 0 30px rgba(255,107,0,0.6)",
        }} />
        {/* Orbiting dots */}
        {[0, 72, 144, 216, 288].map((deg, i) => (
          <div key={i} style={{
            position: "absolute", top: "50%", left: "50%",
            width: 8, height: 8, marginLeft: -4, marginTop: -4,
            borderRadius: "50%",
            background: i === 0 ? T.orange : "rgba(255,107,0,0.5)",
            animation: `orbit ${3 + i * 0.5}s linear ${i * 0.4}s infinite`,
            transformOrigin: "50% 50%",
            transform: `rotate(${deg}deg) translateX(110px)`,
          }} />
        ))}
      </div>

      {/* Content */}
      <div style={{ position: "relative", textAlign: "center", maxWidth: 900, zIndex: 2 }}>
        {/* Eyebrow */}
        <div className="section-label fade-up" style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          background: "rgba(255,107,0,0.08)",
          border: "1px solid rgba(255,107,0,0.2)",
          borderRadius: 100,
          padding: "8px 20px",
          marginBottom: 32,
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: "50%",
            background: T.orange,
            animation: "pulse-ring 1.5s ease-out infinite",
          }} />
          India's First Automotive AI Operating System
        </div>

        <h1 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "clamp(42px, 7vw, 86px)",
          fontWeight: 900,
          lineHeight: 1.05,
          letterSpacing: "-2px",
          marginBottom: 24,
        }}>
          <span style={{ color: T.white }}>The Intelligence</span>
          <br />
          <span style={{ color: T.orange }}>Behind Every Drive</span>
        </h1>

        <p style={{
          fontSize: "clamp(16px, 2vw, 20px)",
          color: T.grey, lineHeight: 1.7,
          maxWidth: 680, margin: "0 auto 16px",
        }}>
          Transforming <span style={{ color: T.white, fontWeight: 600 }}>
            {typed}<span style={{ animation: "blink 1s step-end infinite", borderRight: `2px solid ${T.orange}` }}> </span>
          </span>
          <br />through Agentic AI that thinks, acts, and learns — autonomously.
        </p>

        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginTop: 40 }}>
          <button className="btn-primary orange-glow" style={{ fontSize: 16, padding: "16px 40px" }}>
            🚀 Book a Demo
          </button>
          <button className="btn-secondary" style={{ fontSize: 16, padding: "16px 40px" }}>
            ▶ Watch Platform Overview
          </button>
          <button className="btn-secondary" style={{ fontSize: 16, padding: "16px 40px" }}>
            ⚡ Explore AI Agents
          </button>
        </div>

        {/* Trust badges */}
        <div style={{
          display: "flex", gap: 32, justifyContent: "center", alignItems: "center",
          marginTop: 64, flexWrap: "wrap",
        }}>
          {[
            { icon: "🏪", label: "500+ Dealers" },
            { icon: "🤖", label: "10 AI Agents" },
            { icon: "📱", label: "WhatsApp Native" },
            { icon: "🌐", label: "Tamil AI — First" },
          ].map(({ icon, label }) => (
            <div key={label} style={{
              display: "flex", alignItems: "center", gap: 8,
              color: T.grey, fontSize: 14, fontWeight: 500,
            }}>
              <span style={{ fontSize: 18 }}>{icon}</span>
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        color: T.greyDim, fontSize: 11, letterSpacing: "2px",
      }}>
        <span style={{ textTransform: "uppercase" }}>Scroll</span>
        <div style={{
          width: 24, height: 40, border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 12, display: "flex", justifyContent: "center",
        }}>
          <div style={{
            width: 4, height: 8, background: T.orange, borderRadius: 2,
            marginTop: 6,
            animation: "float 1.5s ease-in-out infinite",
          }} />
        </div>
      </div>
    </section>
  );
};

// ─── STATS SECTION ──────────────────────────────────────────────
const StatsSection = () => {
  const stats = [
    { value: "₹3–8L", label: "Revenue Recovered Per Dealer/Month", icon: "💰" },
    { value: "90 sec", label: "Job Card Creation (vs 8 min manual)", icon: "⚡" },
    { value: "38%→71%", label: "Insurance Renewal Rate Improvement", icon: "📈" },
    { value: "26,000+", label: "Dealerships Addressable in India", icon: "🏪" },
    { value: "Tamil AI", label: "First Automotive AI in Tamil Language", icon: "🗣️" },
    { value: "₹1,040Cr", label: "Target ARR by Year 5", icon: "🎯" },
  ];

  return (
    <section style={{
      padding: "80px 32px",
      background: `linear-gradient(180deg, ${T.navy} 0%, ${T.navyMid} 50%, ${T.navy} 100%)`,
      borderTop: "1px solid rgba(255,255,255,0.06)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div className="section-label" style={{ marginBottom: 16 }}>By The Numbers</div>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(28px, 4vw, 42px)",
            fontWeight: 800,
          }}>
            The AutoEra AI Impact
          </h2>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 24,
        }}>
          {stats.map(({ value, label, icon }, i) => (
            <div key={i} className="glass-card" style={{ padding: "28px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{icon}</div>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "clamp(22px, 3vw, 32px)",
                fontWeight: 800,
                color: T.orange,
                marginBottom: 8,
              }}>{value}</div>
              <div style={{ color: T.grey, fontSize: 13, lineHeight: 1.5 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── PROBLEM SECTION ────────────────────────────────────────────
const ProblemSection = () => {
  const [hovered, setHovered] = useState(null);

  const problems = [
    { icon: "📵", title: "Missed Follow-Ups", desc: "60–70% of Hot leads go cold because Sales Executives can't call within 30 minutes. ₹2L+ revenue lost per dealer per month.", severity: "CRITICAL" },
    { icon: "🔧", title: "Service Revenue Leakage", desc: "Manual job cards take 8 minutes each. 30% of upsell opportunities missed. No customer communication until they call asking for their car.", severity: "CRITICAL" },
    { icon: "📋", title: "Insurance Renewal Gap", desc: "Only 38% renewal rate in dealerships without automation. ₹50,000+ in commission lost monthly per dealer.", severity: "HIGH" },
    { icon: "👤", title: "Poor Retention", desc: "No post-delivery follow-up system. 70% of customers don't return for second service. Lifetime value is destroyed by inaction.", severity: "HIGH" },
    { icon: "⚙️", title: "Manual Operations", desc: "Job cards on paper. Lead data in Excel. WhatsApp chaos. No single source of truth. Dealer Principal has no data visibility.", severity: "HIGH" },
    { icon: "🚗", title: "Zero Predictive Intelligence", desc: "Fleet vehicles break down without warning. EV battery health unknown. Service demand unpredicted. No AI anywhere in the workflow.", severity: "MEDIUM" },
  ];

  const severityColors = { CRITICAL: "#FF3B5C", HIGH: T.orange, MEDIUM: "#F5C842" };

  return (
    <section style={{ padding: "100px 32px", position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,59,92,0.04) 0%, transparent 70%)",
      }} />
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 70 }}>
          <div className="section-label" style={{ marginBottom: 16, color: "#FF3B5C" }}>The Problem</div>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: 800, marginBottom: 16,
          }}>
            India's Auto Industry Runs on<br />
            <span style={{ color: "#FF3B5C" }}>Manual Chaos</span>
          </h2>
          <p style={{ color: T.grey, fontSize: 18, maxWidth: 600, margin: "0 auto" }}>
            26,000+ dealerships. ₹9,000 Crore problem. Zero AI. Until now.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 24,
        }}>
          {problems.map((p, i) => (
            <div
              key={i}
              className="glass-card"
              style={{
                padding: "32px 28px",
                cursor: "pointer",
                borderColor: hovered === i ? `${severityColors[p.severity]}40` : "rgba(255,255,255,0.08)",
                background: hovered === i ? `${severityColors[p.severity]}08` : "rgba(255,255,255,0.03)",
                transform: hovered === i ? "translateY(-6px)" : "translateY(0)",
                boxShadow: hovered === i ? `0 20px 60px ${severityColors[p.severity]}20` : "none",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <span style={{ fontSize: 36 }}>{p.icon}</span>
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: "1.5px",
                  color: severityColors[p.severity],
                  background: `${severityColors[p.severity]}15`,
                  padding: "4px 10px", borderRadius: 100,
                }}>{p.severity}</span>
              </div>
              <h3 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 20, fontWeight: 700, marginBottom: 12, color: T.white,
              }}>{p.title}</h3>
              <p style={{ color: T.grey, fontSize: 14, lineHeight: 1.7 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── AI AGENTS SECTION ──────────────────────────────────────────
const AIAgentsSection = () => {
  const [activeAgent, setActiveAgent] = useState(0);

  const agents = [
    { id: "sales", icon: "🎯", name: "Sales Agent", color: "#FF6B00", desc: "Scores leads 1–10 using AI. Auto-follows up Hot leads within 30 minutes in Tamil. Books test drives autonomously. Generates EMI quotes.", capabilities: ["AI Lead Scoring 1–10", "30-min Hot Lead Response", "Tamil Voice Outbound Calls", "Auto EMI Quote Generation", "Lost Lead Re-engagement"] },
    { id: "service", icon: "🔧", name: "Service Agent", color: "#00C8F0", desc: "Creates job cards in 90 seconds via voice + plate scan. Sends 6-stage WhatsApp updates automatically. Diagnoses faults with AI.", capabilities: ["90-sec Job Card Creation", "6-Stage WhatsApp Auto-Updates", "AI Fault Diagnosis", "Parts Demand Prediction", "NPS Collection & Escalation"] },
    { id: "crm", icon: "🤝", name: "CRM Agent", color: "#7C3AED", desc: "Manages full customer lifecycle. Runs retention campaigns. Predicts churn. Segments customers for targeted offers.", capabilities: ["Lifecycle Automation", "Churn Prediction Model", "Re-engagement Campaigns", "Customer Segmentation", "Satisfaction Tracking"] },
    { id: "insurance", icon: "🛡️", name: "Insurance Agent", color: "#15803D", desc: "Automates 90/60/30-day renewal sequences. Processes claims with AI damage assessment. Compares 4+ insurers instantly.", capabilities: ["Auto Renewal Sequences", "AI Damage Assessment", "Multi-Insurer Comparison", "One-Click Renewal", "Commission Dashboard"] },
    { id: "finance", icon: "💳", name: "Finance Agent", color: "#B45309", desc: "Pre-screens loan eligibility in 20 seconds. Collects documents via DigiLocker. Compares 10+ banks. Tracks disbursements.", capabilities: ["20-sec Pre-Screening", "DigiLocker Integration", "10-Bank EMI Comparison", "Disbursement Tracking", "NACH Mandate Setup"] },
    { id: "fleet", icon: "🚛", name: "Fleet Agent", color: "#0E7490", desc: "Monitors 2,880 OBD-II data points per vehicle per day. Predicts failures 14 days ahead. Detects fuel theft instantly.", capabilities: ["Real-Time GPS Tracking", "Predictive Maintenance", "Fuel Theft Detection", "Driver Behaviour Scoring", "Fleet Cost Optimisation"] },
    { id: "ev", icon: "⚡", name: "EV Agent", color: "#65A30D", desc: "Daily battery health scoring (0–100). Range anxiety intervention. Degradation forecasting. Replacement planning 6 months ahead.", capabilities: ["Daily Battery Health Score", "Range Anxiety Prevention", "Degradation Forecasting", "Charging Optimisation", "Replacement Planning"] },
    { id: "analytics", icon: "📊", name: "Analytics Agent", color: "#9333EA", desc: "Generates the 8am Dealer Principal brief automatically. Real-time KPI dashboard. Benchmark against peer dealers.", capabilities: ["8am Daily AI Brief", "Real-Time KPI Dashboard", "Peer Benchmarking", "Revenue Forecasting", "Anomaly Detection"] },
    { id: "voice", icon: "🗣️", name: "Voice Agent", color: "#DC2626", desc: "Outbound Tamil/Hindi/English AI voice calls. Natural conversation. Books appointments. Handles objections. No human needed.", capabilities: ["Tamil/Hindi/English AI", "Natural Conversation", "Appointment Booking", "Objection Handling", "Outcome Logging in CRM"] },
    { id: "executive", icon: "👔", name: "Executive Agent", color: "#FF6B00", desc: "Gives the Dealer Principal a complete 2-minute morning brief via WhatsApp. Answers business questions in natural language.", capabilities: ["Morning WhatsApp Brief", "Natural Language Q&A", "Alert on Anomalies", "Performance Summary", "Strategic Recommendations"] },
  ];

  const active = agents[activeAgent];

  return (
    <section id="ai-agents" style={{
      padding: "100px 32px",
      background: `linear-gradient(180deg, ${T.navy} 0%, ${T.navyMid} 100%)`,
      position: "relative", overflow: "hidden",
    }}>
      <NeuralBackground />
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 70 }}>
          <div className="section-label" style={{ marginBottom: 16 }}>AI Operating System</div>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(28px, 4vw, 52px)",
            fontWeight: 800, marginBottom: 16,
          }}>
            10 Specialist AI Agents.<br />
            <span className="gradient-text">One Unified Intelligence.</span>
          </h2>
          <p style={{ color: T.grey, fontSize: 18, maxWidth: 600, margin: "0 auto" }}>
            Each agent is a specialist. Together they form an autonomous AI workforce for your dealership.
          </p>
        </div>

        {/* Agent Selector */}
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center",
          marginBottom: 48,
        }}>
          {agents.map((a, i) => (
            <button
              key={a.id}
              onClick={() => setActiveAgent(i)}
              style={{
                background: activeAgent === i ? `${a.color}20` : "rgba(255,255,255,0.04)",
                border: `1px solid ${activeAgent === i ? a.color : "rgba(255,255,255,0.08)"}`,
                color: activeAgent === i ? a.color : T.grey,
                padding: "10px 20px",
                borderRadius: 100,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                transition: "all 0.2s",
                fontFamily: "'Inter', sans-serif",
                display: "flex", alignItems: "center", gap: 8,
              }}
            >
              <span>{a.icon}</span> {a.name}
            </button>
          ))}
        </div>

        {/* Active Agent Detail */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: `1px solid ${active.color}30`,
          borderRadius: 24,
          padding: "48px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 48,
          boxShadow: `0 0 60px ${active.color}15`,
          transition: "all 0.4s ease",
        }}>
          <div>
            <div style={{
              width: 80, height: 80, borderRadius: 20,
              background: `${active.color}15`,
              border: `1px solid ${active.color}40`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 40, marginBottom: 24,
            }}>{active.icon}</div>
            <h3 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 32, fontWeight: 800, color: active.color, marginBottom: 16,
            }}>{active.name}</h3>
            <p style={{ color: T.grey, fontSize: 16, lineHeight: 1.8, marginBottom: 24 }}>{active.desc}</p>
            <button className="btn-primary" style={{ background: `linear-gradient(135deg, ${active.color}, ${active.color}CC)` }}>
              Learn More →
            </button>
          </div>
          <div>
            <div style={{ color: T.grey, fontSize: 12, fontWeight: 700, letterSpacing: "2px", marginBottom: 20 }}>
              CAPABILITIES
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {active.capabilities.map((cap, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 14,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 10,
                  padding: "14px 18px",
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: active.color, flexShrink: 0,
                    boxShadow: `0 0 10px ${active.color}`,
                  }} />
                  <span style={{ color: T.offWhite, fontSize: 15, fontWeight: 500 }}>{cap}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── PLATFORM MODULES SECTION ───────────────────────────────────
const PlatformSection = () => {
  const modules = [
    { icon: "🎯", name: "SalesMind CRM", tag: "P0 — LIVE", color: T.orange, desc: "Lead capture, AI scoring, WhatsApp automation, test drive scheduling, margin guard, quotation builder." },
    { icon: "🔧", name: "ServicePulse", tag: "P0 — LIVE", color: "#00C8F0", desc: "Digital job cards in 90 seconds, bay management, parts forecasting, 6-stage customer WhatsApp updates." },
    { icon: "🛡️", name: "InsureGuard", tag: "P0 — LIVE", color: "#15803D", desc: "90/60/30-day renewal automation, one-click processing, AI claim assessment, commission dashboard." },
    { icon: "💳", name: "FinanceFlow", tag: "P1 — Q2", color: "#B45309", desc: "DigiLocker document collection, multi-bank EMI comparison, loan tracking, NACH mandate setup." },
    { icon: "🚛", name: "FleetIQ", tag: "P1 — Q2", color: "#0E7490", desc: "OBD-II health monitoring, predictive maintenance 14 days ahead, fuel theft detection, driver scoring." },
    { icon: "⚡", name: "EVIntel", tag: "P2 — Q3", color: "#65A30D", desc: "Battery health scoring, range anxiety intervention, degradation forecasting, charging optimisation." },
    { icon: "📊", name: "Analytics Hub", tag: "P1 — Q2", color: "#9333EA", desc: "8am AI brief, real-time KPI dashboard, peer benchmarking, revenue forecasting, anomaly detection." },
    { icon: "📱", name: "Customer App", tag: "P1 — Q2", color: "#EC4899", desc: "Vehicle health, service booking, insurance renewal, loan EMI, EV battery — all on one screen." },
  ];

  return (
    <section id="platform" style={{ padding: "100px 32px", background: T.navy }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 70 }}>
          <div className="section-label" style={{ marginBottom: 16 }}>Platform Modules</div>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(28px, 4vw, 52px)",
            fontWeight: 800, marginBottom: 16,
          }}>
            Everything a Dealership Needs.<br />
            <span className="gradient-text">In One AI Platform.</span>
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 20,
        }}>
          {modules.map((m, i) => (
            <div key={i} className="glass-card" style={{ padding: "28px 24px", cursor: "pointer" }}>
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginBottom: 16,
              }}>
                <span style={{ fontSize: 32 }}>{m.icon}</span>
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: "1px",
                  color: m.color,
                  background: `${m.color}15`,
                  border: `1px solid ${m.color}30`,
                  padding: "4px 10px", borderRadius: 100,
                }}>{m.tag}</span>
              </div>
              <h3 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 20, fontWeight: 700,
                color: m.color, marginBottom: 10,
              }}>{m.name}</h3>
              <p style={{ color: T.grey, fontSize: 14, lineHeight: 1.7 }}>{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── DIGITAL TWIN SECTION ────────────────────────────────────────
const DigitalTwinSection = () => {
  const [activeNode, setActiveNode] = useState(null);

  const nodes = [
    { id: "vehicle", icon: "🚗", label: "Vehicle", x: "50%", y: "50%", desc: "Real-time health, OBD-II telemetry, battery data, service history, predictive alerts." },
    { id: "dealer", icon: "🏪", label: "Dealership", x: "10%", y: "30%", desc: "Sales pipeline, service WIP, parts inventory, insurance renewals, finance applications." },
    { id: "customer", icon: "👤", label: "Customer", x: "85%", y: "25%", desc: "Lifetime profile, vehicle ownership, service preferences, insurance policies, loan details." },
    { id: "oem", icon: "🏭", label: "OEM", x: "15%", y: "70%", desc: "Warranty tracking, recall management, dealer network analytics, market intelligence." },
    { id: "fleet", icon: "🚛", label: "Fleet", x: "82%", y: "70%", desc: "Route optimisation, driver behaviour, fuel monitoring, predictive maintenance schedule." },
    { id: "ai", icon: "🤖", label: "AI Brain", x: "50%", y: "18%", desc: "Orchestrates all agents. Processes every data stream. Makes autonomous decisions." },
  ];

  const active = activeNode ? nodes.find(n => n.id === activeNode) : null;

  return (
    <section style={{
      padding: "100px 32px",
      background: `linear-gradient(180deg, ${T.navyMid} 0%, ${T.navy} 100%)`,
      position: "relative",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 70 }}>
          <div className="section-label" style={{ marginBottom: 16 }}>Automotive Digital Twin</div>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(28px, 4vw, 52px)",
            fontWeight: 800, marginBottom: 16,
          }}>
            Every Entity. Connected.<br />
            <span className="gradient-text">Intelligently.</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
          {/* Interactive diagram */}
          <div style={{ position: "relative", height: 400 }}>
            {/* Connection lines SVG */}
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
              {nodes.filter(n => n.id !== "vehicle").map((n, i) => (
                <line key={i}
                  x1="50%" y1="50%"
                  x2={n.x} y2={n.y}
                  stroke={activeNode === n.id ? T.orange : "rgba(255,107,0,0.15)"}
                  strokeWidth={activeNode === n.id ? 2 : 1}
                  strokeDasharray="6 4"
                  style={{ transition: "all 0.3s" }}
                >
                  <animate attributeName="stroke-dashoffset" from="100" to="0" dur="3s" repeatCount="indefinite" />
                </line>
              ))}
            </svg>

            {nodes.map(n => (
              <div
                key={n.id}
                onClick={() => setActiveNode(activeNode === n.id ? null : n.id)}
                className={n.id === "vehicle" ? "float" : ""}
                style={{
                  position: "absolute",
                  left: n.x, top: n.y,
                  transform: "translate(-50%, -50%)",
                  width: n.id === "vehicle" ? 80 : 60,
                  height: n.id === "vehicle" ? 80 : 60,
                  borderRadius: "50%",
                  background: activeNode === n.id
                    ? `radial-gradient(circle, ${T.orange}40, ${T.orange}10)`
                    : "rgba(255,255,255,0.05)",
                  border: `2px solid ${activeNode === n.id ? T.orange : "rgba(255,107,0,0.2)"}`,
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  boxShadow: activeNode === n.id ? `0 0 30px ${T.orange}40` : "none",
                  zIndex: n.id === "vehicle" ? 2 : 1,
                }}
              >
                <span style={{ fontSize: n.id === "vehicle" ? 28 : 22 }}>{n.icon}</span>
                <span style={{ fontSize: 9, color: T.grey, fontWeight: 700, letterSpacing: "0.5px", marginTop: 2 }}>
                  {n.label.toUpperCase()}
                </span>
              </div>
            ))}
          </div>

          {/* Detail panel */}
          <div>
            {active ? (
              <div style={{
                background: "rgba(255,107,0,0.05)",
                border: "1px solid rgba(255,107,0,0.2)",
                borderRadius: 20, padding: 32,
                animation: "fade-up 0.3s ease",
              }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>{active.icon}</div>
                <h3 style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 28, fontWeight: 800, color: T.orange, marginBottom: 12,
                }}>{active.label}</h3>
                <p style={{ color: T.grey, fontSize: 16, lineHeight: 1.8 }}>{active.desc}</p>
              </div>
            ) : (
              <div style={{ padding: 32 }}>
                <h3 style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 28, fontWeight: 800, marginBottom: 16,
                }}>Click any node to explore the ecosystem</h3>
                <p style={{ color: T.grey, fontSize: 16, lineHeight: 1.8, marginBottom: 24 }}>
                  AutoEra AI creates a living digital twin of the entire automotive world — every vehicle, dealer, customer, fleet, and OEM connected through a single AI intelligence layer.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {["Real-time data synchronisation", "AI decisions across all entities", "Predictive intelligence at every touchpoint"].map((f, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.orange }} />
                      <span style={{ color: T.offWhite, fontSize: 15 }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── COMPARISON TABLE ───────────────────────────────────────────
const ComparisonSection = () => {
  const features = [
    "Tamil AI Voice Agent",
    "WhatsApp-Native Interface",
    "Predictive Maintenance AI",
    "AI Insurance Renewals",
    "Real-time Dealer P&L Brief",
    "Indian Pricing (₹1,499+/mo)",
    "90-Second Job Card",
    "Multi-Agent Orchestration",
    "OBD-II Fleet Intelligence",
    "EV Battery Health AI",
  ];

  const cols = [
    { name: "AutoEra AI", color: T.orange, tick: true },
    { name: "Traditional DMS", color: T.greyDim, tick: false },
    { name: "Tekion / CDK", color: T.greyDim, tick: false },
    { name: "Generic CRM", color: T.greyDim, tick: false },
  ];

  const data = {
    "Tamil AI Voice Agent": [true, false, false, false],
    "WhatsApp-Native Interface": [true, false, false, false],
    "Predictive Maintenance AI": [true, false, "partial", false],
    "AI Insurance Renewals": [true, false, false, false],
    "Real-time Dealer P&L Brief": [true, false, "partial", false],
    "Indian Pricing (₹1,499+/mo)": [true, false, false, false],
    "90-Second Job Card": [true, false, "partial", false],
    "Multi-Agent Orchestration": [true, false, false, false],
    "OBD-II Fleet Intelligence": [true, false, "partial", false],
    "EV Battery Health AI": [true, false, false, false],
  };

  return (
    <section style={{ padding: "100px 32px", background: T.navy }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div className="section-label" style={{ marginBottom: 16 }}>Why AutoEra</div>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: 800,
          }}>
            Built for India. <span className="gradient-text">Ahead of the World.</span>
          </h2>
        </div>

        <div style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20,
          overflow: "hidden",
        }}>
          {/* Header */}
          <div style={{
            display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr",
            background: "rgba(255,255,255,0.04)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}>
            <div style={{ padding: "20px 24px", color: T.grey, fontSize: 13, fontWeight: 700 }}>Feature</div>
            {cols.map((c, i) => (
              <div key={i} style={{
                padding: "20px 16px", textAlign: "center",
                fontSize: 14, fontWeight: 700,
                color: c.tick ? T.orange : T.greyDim,
                borderLeft: "1px solid rgba(255,255,255,0.06)",
              }}>{c.name}</div>
            ))}
          </div>

          {features.map((f, ri) => (
            <div key={f} style={{
              display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr",
              borderBottom: ri < features.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
              background: ri % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
            }}>
              <div style={{ padding: "16px 24px", color: T.offWhite, fontSize: 14 }}>{f}</div>
              {cols.map((c, ci) => {
                const val = data[f][ci];
                return (
                  <div key={ci} style={{
                    padding: "16px", textAlign: "center",
                    borderLeft: "1px solid rgba(255,255,255,0.04)",
                    fontSize: 18,
                  }}>
                    {val === true ? "✅" : val === "partial" ? "🟡" : "❌"}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── ROADMAP SECTION ────────────────────────────────────────────
const RoadmapSection = () => {
  const milestones = [
    { year: "2026", quarter: "Q1–Q2", title: "The Wedge Launch", color: T.orange, items: ["ServicePulse + Tamil Voice Agent", "50 Chennai dealers", "₹10L MRR", "Series A fundraise starts"] },
    { year: "2026", quarter: "Q3–Q4", title: "Tamil Nadu Scale", color: "#FF8C00", items: ["200 dealers across TN", "InsureGuard + FinanceFlow", "₹40L MRR", "Series A closed"] },
    { year: "2027", quarter: "Q1–Q2", title: "South India Expansion", color: "#00C8F0", items: ["FleetIQ + EVIntel launch", "1 OEM partnership signed", "₹2Cr MRR", "500+ dealers"] },
    { year: "2028", quarter: "Full Year", title: "Pan-India Platform", color: "#7C3AED", items: ["National presence", "2 OEM enterprise contracts", "₹8Cr MRR", "Series B closed"] },
    { year: "2029–30", quarter: "Global", title: "SEA + Middle East", color: "#15803D", items: ["UAE, Indonesia, Thailand", "1,000Cr+ ARR target", "IPO readiness", "Global automotive AI leader"] },
  ];

  return (
    <section id="roadmap" style={{ padding: "100px 32px", background: `linear-gradient(180deg, ${T.navyMid} 0%, ${T.navy} 100%)` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 70 }}>
          <div className="section-label" style={{ marginBottom: 16 }}>Roadmap</div>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(28px, 4vw, 52px)",
            fontWeight: 800,
          }}>
            The Journey to<br />
            <span className="gradient-text">Global Automotive AI</span>
          </h2>
        </div>

        <div style={{ position: "relative" }}>
          {/* Vertical line */}
          <div style={{
            position: "absolute", left: "50%", top: 0, bottom: 0,
            width: 2,
            background: `linear-gradient(180deg, ${T.orange} 0%, rgba(255,107,0,0.1) 100%)`,
            transform: "translateX(-50%)",
          }} />

          {milestones.map((m, i) => (
            <div key={i} style={{
              display: "flex",
              flexDirection: i % 2 === 0 ? "row" : "row-reverse",
              gap: 48,
              marginBottom: 48,
              alignItems: "center",
            }}>
              <div style={{
                flex: 1,
                textAlign: i % 2 === 0 ? "right" : "left",
              }}>
                <div style={{
                  display: "inline-block",
                  background: `${m.color}10`,
                  border: `1px solid ${m.color}30`,
                  borderRadius: 16, padding: "24px 28px",
                }}>
                  <div style={{ color: m.color, fontWeight: 700, fontSize: 13, marginBottom: 6 }}>
                    {m.year} · {m.quarter}
                  </div>
                  <h3 style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 22, fontWeight: 800,
                    color: T.white, marginBottom: 16,
                  }}>{m.title}</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {m.items.map((item, j) => (
                      <div key={j} style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        justifyContent: i % 2 === 0 ? "flex-end" : "flex-start",
                      }}>
                        {i % 2 !== 0 && <div style={{ width: 6, height: 6, borderRadius: "50%", background: m.color, flexShrink: 0 }} />}
                        <span style={{ color: T.grey, fontSize: 14 }}>{item}</span>
                        {i % 2 === 0 && <div style={{ width: 6, height: 6, borderRadius: "50%", background: m.color, flexShrink: 0 }} />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Center dot */}
              <div style={{
                width: 24, height: 24, borderRadius: "50%",
                background: m.color,
                border: `4px solid ${T.navy}`,
                flexShrink: 0,
                boxShadow: `0 0 20px ${m.color}`,
                zIndex: 2,
              }} />

              <div style={{ flex: 1 }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── FOUNDER SECTION ────────────────────────────────────────────
const FounderSection = () => (
  <section style={{ padding: "100px 32px", background: T.navy }}>
    <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
      <div className="section-label" style={{ marginBottom: 16 }}>Founder Vision</div>

      {/* Founder avatar */}
      <div style={{
        width: 120, height: 120, borderRadius: "50%",
        background: `linear-gradient(135deg, ${T.orange}40, ${T.navyLight})`,
        border: `3px solid ${T.orange}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 32px",
        fontSize: 48,
        boxShadow: `0 0 40px ${T.orange}30`,
      }}>🧠</div>

      <h2 style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: "clamp(28px, 4vw, 48px)",
        fontWeight: 800, marginBottom: 8,
      }}>SJ — Santhosh Jecob</h2>
      <p style={{ color: T.orange, fontSize: 16, fontWeight: 600, marginBottom: 32, letterSpacing: "1px" }}>
        Founder & CEO · AutoEra AI Solutions Pvt. Ltd.
      </p>

      <div style={{
        background: "rgba(255,107,0,0.04)",
        border: "1px solid rgba(255,107,0,0.15)",
        borderRadius: 20, padding: "40px 48px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          fontSize: 80, color: T.orange, opacity: 0.2,
          position: "absolute", top: -10, left: 20,
          fontFamily: "Georgia, serif", lineHeight: 1,
        }}>"</div>
        <p style={{
          fontSize: "clamp(16px, 2vw, 20px)",
          lineHeight: 1.9, color: T.offWhite,
          position: "relative", zIndex: 1,
          fontStyle: "italic",
        }}>
          I spent 12 years watching dealerships lose crores every month to problems that had obvious solutions — they just needed someone to build the right technology. Indian automotive is not a niche. It is a ₹9,000 Crore software opportunity that global companies have ignored because they don't understand Tamil Nadu, they don't understand the workshop floor, and they don't understand the language. AutoEra AI was built to be the AI operating system this industry deserves — built in Chennai, for India, and eventually for the world.
        </p>
        <div style={{
          fontSize: 80, color: T.orange, opacity: 0.2,
          position: "absolute", bottom: -40, right: 20,
          fontFamily: "Georgia, serif", lineHeight: 1,
          transform: "rotate(180deg)",
        }}>"</div>
      </div>

      <div style={{
        display: "flex", gap: 24, justifyContent: "center", marginTop: 40, flexWrap: "wrap",
      }}>
        {[
          { icon: "🏭", label: "12+ years Automotive" },
          { icon: "🏋️", label: "Entrepreneur (Step 2 Fitness)" },
          { icon: "📍", label: "Chennai, Tamil Nadu" },
          { icon: "🏆", label: "UDYAM-TN-24-0162449" },
        ].map(({ icon, label }) => (
          <div key={label} style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 100, padding: "10px 20px",
            fontSize: 14, color: T.grey,
          }}>
            <span>{icon}</span> {label}
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── CTA / CONTACT SECTION ──────────────────────────────────────
const CTASection = () => (
  <section style={{
    padding: "120px 32px",
    background: `linear-gradient(135deg, ${T.navyMid} 0%, ${T.navy} 100%)`,
    position: "relative", overflow: "hidden",
  }}>
    <div style={{
      position: "absolute", inset: 0,
      background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(255,107,0,0.08) 0%, transparent 70%)",
    }} />
    <NeuralBackground />

    <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative" }}>
      <div className="section-label" style={{ marginBottom: 16 }}>Get Started</div>
      <h2 style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: "clamp(32px, 5vw, 64px)",
        fontWeight: 900, marginBottom: 20,
        lineHeight: 1.1,
      }}>
        Ready to bring AI to<br />
        <span className="gradient-text">your dealership?</span>
      </h2>
      <p style={{ color: T.grey, fontSize: 18, marginBottom: 48, lineHeight: 1.7 }}>
        Join the dealers in Chennai who are already recovering ₹3–8 Lakhs per month with AutoEra AI. Your first 90-day pilot is fully guided by our team.
      </p>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 16, marginBottom: 48,
      }}>
        {[
          { icon: "📅", label: "Book a Live Demo", desc: "See the platform in action" },
          { icon: "📞", label: "Talk to Sales", desc: "Speak with our team" },
          { icon: "🤝", label: "Partnership Inquiry", desc: "OEM & enterprise partnerships" },
          { icon: "💰", label: "Investor Inquiry", desc: "₹15Cr Seed round open" },
        ].map(({ icon, label, desc }) => (
          <button key={label} className="glass-card" style={{
            padding: "24px 20px",
            cursor: "pointer",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            textAlign: "center",
            fontFamily: "'Inter', sans-serif",
          }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
            <div style={{ color: T.white, fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{label}</div>
            <div style={{ color: T.grey, fontSize: 12 }}>{desc}</div>
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
        <button className="btn-primary orange-glow" style={{ fontSize: 18, padding: "18px 48px" }}>
          🚀 Book Your Free Demo
        </button>
        <button className="btn-secondary" style={{ fontSize: 18, padding: "18px 48px" }}>
          📧 autoera.ai@gmail.com
        </button>
      </div>

      <p style={{ color: T.greyDim, fontSize: 13, marginTop: 24 }}>
        No contract lock-in for pilots · Tamil-language onboarding · Response within 24 hours
      </p>
    </div>
  </section>
);

// ─── FOOTER ─────────────────────────────────────────────────────
const Footer = () => (
  <footer style={{
    padding: "60px 32px 32px",
    background: "#040D1E",
    borderTop: "1px solid rgba(255,255,255,0.06)",
  }}>
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr 1fr",
        gap: 48, marginBottom: 60,
      }}>
        <div>
          <Logo size={32} />
          <p style={{ color: T.grey, fontSize: 14, lineHeight: 1.8, marginTop: 20, maxWidth: 280 }}>
            India's first AI-native automotive operating system. Built in Chennai, Tamil Nadu.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
            {["LinkedIn", "Twitter", "GitHub"].map(s => (
              <div key={s} style={{
                width: 36, height: 36, borderRadius: 8,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", fontSize: 14, color: T.grey,
              }}>{s[0]}</div>
            ))}
          </div>
        </div>

        {[
          { title: "Platform", links: ["ServicePulse", "SalesMind CRM", "InsureGuard", "FinanceFlow", "FleetIQ", "EVIntel"] },
          { title: "Company", links: ["About", "Careers", "Blog", "Press", "Investors", "Contact"] },
          { title: "Legal", links: ["Privacy Policy", "Terms of Service", "DPDP Compliance", "Security", "Cookie Policy"] },
        ].map(({ title, links }) => (
          <div key={title}>
            <div style={{ color: T.white, fontWeight: 700, fontSize: 14, marginBottom: 20 }}>{title}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {links.map(l => (
                <a key={l} style={{ color: T.grey, fontSize: 14, cursor: "pointer", transition: "color 0.2s" }}
                   onMouseEnter={e => e.target.style.color = T.white}
                   onMouseLeave={e => e.target.style.color = T.grey}
                >{l}</a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        paddingTop: 24,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 16,
      }}>
        <div style={{ color: T.greyDim, fontSize: 13 }}>
          © 2026 AutoEra AI Solutions Pvt. Ltd. · UDYAM-TN-24-0162449 · Chennai, Tamil Nadu
        </div>
        <div style={{ color: T.greyDim, fontSize: 13 }}>
          The Intelligence Behind Every Drive
        </div>
      </div>
    </div>
  </footer>
);

// ─── MAIN APP ────────────────────────────────────────────────────
export default function AutoEraWebsite() {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { threshold: 0.3 }
    );
    document.querySelectorAll("section[id]").forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <GlobalStyle />
      <Nav activeSection={activeSection} />
      <main>
        <HeroSection />
        <StatsSection />
        <ProblemSection />
        <AIAgentsSection />
        <PlatformSection />
        <DigitalTwinSection />
        <ComparisonSection />
        <RoadmapSection />
        <FounderSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
