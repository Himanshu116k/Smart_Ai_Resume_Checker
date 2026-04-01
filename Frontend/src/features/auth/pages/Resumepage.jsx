import React, { useState, useEffect, useRef } from "react";

const PINK = "#ff2d78";
const PINK_GLOW = "rgba(255,45,120,0.18)";
const PINK_DIM = "rgba(255,45,120,0.08)";

/* ───────── tiny hook ───────── */
function useAnimateIn(deps) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (deps) { setVisible(false); const t = setTimeout(() => setVisible(true), 80); return () => clearTimeout(t); }
  }, [deps]);
  return visible;
}

/* ───────── AI Loading Overlay ───────── */
const AI_STEPS = [
  "Parsing resume structure…",
  "Analyzing job requirements…",
  "Mapping skill alignment…",
  "Generating technical questions…",
  "Building behavioral scenarios…",
  "Crafting 7-day prep plan…",
  "Calculating match score…",
  "Finalizing your report…",
];

function AILoadingOverlay({ visible }) {
  const canvasRef = useRef(null);
  const [stepIdx, setStepIdx] = useState(0);
  const animRef = useRef(null);

  useEffect(() => {
    if (!visible) { setStepIdx(0); return; }
    const iv = setInterval(() => setStepIdx(i => (i + 1) % AI_STEPS.length), 1100);
    return () => clearInterval(iv);
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    const W = canvas.width = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;
    const N = 42;
    const nodes = Array.from({ length: N }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.55, vy: (Math.random() - 0.5) * 0.55,
      r: 2 + Math.random() * 2.5, pulse: Math.random() * Math.PI * 2,
    }));
    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255,45,120,${(1 - dist / 150) * 0.3})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
      nodes.forEach(n => {
        n.pulse += 0.04;
        const glow = 0.5 + 0.5 * Math.sin(n.pulse);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,45,120,${glow})`;
        ctx.shadowColor = PINK; ctx.shadowBlur = 12 * glow;
        ctx.fill(); ctx.shadowBlur = 0;
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      });
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, [visible]);

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 10000,
      background: "rgba(5,5,5,0.97)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      backdropFilter: "blur(8px)",
    }}>
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />

      <div style={{ position: "relative", textAlign: "center", zIndex: 1 }}>
        {/* Animated rings + brain */}
        <div style={{ position: "relative", width: 148, height: 148, margin: "0 auto 36px" }}>
          {/* Outer static ring */}
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `1px solid rgba(255,45,120,0.12)` }} />
          {/* Slow dashed ring */}
          <div style={{ position: "absolute", inset: 8, borderRadius: "50%", border: `1.5px dashed rgba(255,45,120,0.25)`, animation: "spinSlow 10s linear infinite" }} />
          {/* Fast spinner */}
          <div style={{
            position: "absolute", inset: 16, borderRadius: "50%",
            border: `2.5px solid ${PINK}`, borderTopColor: "transparent", borderRightColor: "transparent",
            animation: "spin 1.1s linear infinite",
            boxShadow: `0 0 20px ${PINK}, inset 0 0 8px rgba(255,45,120,0.1)`,
          }} />
          {/* Counter spinner */}
          <div style={{
            position: "absolute", inset: 30, borderRadius: "50%",
            border: `1.5px solid rgba(255,45,120,0.35)`, borderBottomColor: "transparent",
            animation: "spin 0.7s linear infinite reverse",
          }} />
          {/* Innermost glow ring */}
          <div style={{
            position: "absolute", inset: 42, borderRadius: "50%",
            border: `1px solid rgba(255,45,120,0.15)`,
            boxShadow: `0 0 15px rgba(255,45,120,0.2)`,
          }} />
          {/* Icon */}
          <div style={{
            position: "absolute", inset: 0, display: "flex",
            alignItems: "center", justifyContent: "center",
            fontSize: 38, animation: "pulse 1.8s ease-in-out infinite",
          }}>🧠</div>
        </div>

        <div style={{
          fontFamily: "'Orbitron', monospace", fontSize: 20, fontWeight: 900,
          color: "white", letterSpacing: "0.18em", marginBottom: 14,
          textShadow: `0 0 30px rgba(255,45,120,0.5)`,
        }}>AI ANALYZING</div>

        {/* Step label */}
        <div style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 14,
          color: PINK, letterSpacing: "0.06em", marginBottom: 36, height: 22,
        }}>
          {AI_STEPS[stepIdx]}
        </div>

        {/* Step progress dots */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 44 }}>
          {AI_STEPS.map((_, i) => (
            <div key={i} style={{
              width: i === stepIdx ? 22 : 6, height: 6, borderRadius: 3,
              background: i <= stepIdx ? PINK : "rgba(255,45,120,0.18)",
              transition: "all 0.4s ease",
              boxShadow: i === stepIdx ? `0 0 12px ${PINK}` : "none",
            }} />
          ))}
        </div>

        <div style={{
          fontFamily: "'Orbitron', monospace", fontSize: 9,
          letterSpacing: "0.35em", color: "rgba(255,45,120,0.35)",
        }}>POWERED BY ARTIFICIAL INTELLIGENCE</div>
      </div>
    </div>
  );
}

/* ───────── Match Score Hero ───────── */
function MatchScoreHero({ score }) {
  const [displayed, setDisplayed] = useState(0);
  const color = score >= 80 ? "#00e5a0" : score >= 60 ? "#ffaa00" : "#ff4444";
  const label = score >= 80 ? "Excellent Match" : score >= 60 ? "Good Match" : "Needs Improvement";
  const tip = score >= 80
    ? "You're a strong candidate — nail the prep plan to seal the deal!"
    : score >= 60
    ? "Solid foundation. Addressing the skill gaps below will boost your odds significantly."
    : "Focus heavily on the skill gaps and preparation plan before the interview.";

  useEffect(() => {
    let cur = 0;
    const step = Math.ceil(score / 55);
    const iv = setInterval(() => {
      cur = Math.min(cur + step, score);
      setDisplayed(cur);
      if (cur >= score) clearInterval(iv);
    }, 25);
    return () => clearInterval(iv);
  }, [score]);

  const R = 58;
  const circumference = 2 * Math.PI * R;
  const dash = circumference * (displayed / 100);

  return (
    <div style={{
      background: `radial-gradient(ellipse at 50% -20%, rgba(255,45,120,0.15) 0%, #0d0d0d 65%)`,
      border: `1px solid rgba(255,45,120,0.25)`,
      borderRadius: 20, padding: "44px 32px 40px", marginBottom: 22,
      position: "relative", overflow: "hidden",
      animation: "fadeSlideIn 0.7s ease both",
      boxShadow: `0 0 60px rgba(255,45,120,0.06)`,
    }}>
      {/* Decorative top accent line */}
      <div style={{
        position: "absolute", top: 0, left: "20%", right: "20%", height: 2,
        background: `linear-gradient(to right, transparent, ${color}, transparent)`,
        boxShadow: `0 0 10px ${color}`,
      }} />
      {/* Corner orb */}
      <div style={{
        position: "absolute", top: -60, right: -60, width: 200, height: 200,
        borderRadius: "50%", background: `radial-gradient(circle, rgba(255,45,120,0.07), transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* Header label */}
      <div style={{
        fontFamily: "'Orbitron', monospace", fontSize: 11, letterSpacing: "0.3em",
        color: PINK, marginBottom: 32, display: "flex", alignItems: "center",
        justifyContent: "center", gap: 10,
      }}>
        <GlowDot /> RESUME MATCH SCORE
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 52, flexWrap: "wrap" }}>
        {/* Radial gauge */}
        <div style={{ position: "relative", width: 160, height: 160, flexShrink: 0 }}>
          {/* Outer glow pulse ring */}
          <div style={{
            position: "absolute", inset: -8, borderRadius: "50%",
            border: `1px solid ${color}33`,
            boxShadow: `0 0 30px ${color}22`,
            animation: "pulse 2.5s ease-in-out infinite",
          }} />
          <svg width={160} height={160} style={{ transform: "rotate(-90deg)" }}>
            {/* Track */}
            <circle cx={80} cy={80} r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={12} />
            {/* Glow shadow arc */}
            <circle cx={80} cy={80} r={R} fill="none" stroke={color} strokeWidth={14}
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circumference}`}
              style={{ filter: `blur(6px)`, opacity: 0.4 }}
            />
            {/* Main arc */}
            <circle cx={80} cy={80} r={R} fill="none" stroke={color} strokeWidth={10}
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circumference}`}
              style={{ filter: `drop-shadow(0 0 6px ${color})`, transition: "stroke-dasharray 0.04s linear" }}
            />
          </svg>
          {/* Center number */}
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
          }}>
            <span style={{
              fontFamily: "'Orbitron', monospace", fontSize: 44, fontWeight: 900,
              color, lineHeight: 1,
              textShadow: `0 0 24px ${color}, 0 0 48px ${color}66`,
            }}>{displayed}</span>
            <span style={{
              fontFamily: "'Orbitron', monospace", fontSize: 11,
              color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", marginTop: 2,
            }}>/ 100</span>
          </div>
        </div>

        {/* Right panel */}
        <div style={{ textAlign: "left", flex: 1, minWidth: 220 }}>
          {/* Score label badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: `${color}15`, border: `1px solid ${color}44`,
            borderRadius: 40, padding: "6px 18px", marginBottom: 14,
            boxShadow: `0 0 20px ${color}22`,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, boxShadow: `0 0 8px ${color}` }} />
            <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 12, fontWeight: 700, color, letterSpacing: "0.1em" }}>
              {label}
            </span>
          </div>

          <p style={{ fontFamily: "'DM Sans'", fontSize: 13.5, color: "#777", lineHeight: 1.7, margin: "0 0 22px", maxWidth: 280 }}>
            {tip}
          </p>

          {/* Mini metric bars */}
          {[
            { label: "Technical Fit",   val: Math.min(100, score + 5) },
            { label: "Experience Fit",  val: Math.max(0, score - 8)   },
            { label: "Skills Match",    val: score                     },
          ].map(({ label: l, val }) => (
            <div key={l} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#555" }}>{l}</span>
                <span style={{ fontFamily: "'Orbitron'", fontSize: 9, color: "#444", letterSpacing: "0.05em" }}>{val}%</span>
              </div>
              <div style={{ height: 3, background: "#181818", borderRadius: 3, overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${val}%`,
                  background: `linear-gradient(to right, ${PINK}, #ff88bb)`,
                  borderRadius: 3, transition: "width 1s cubic-bezier(0.4,0,0.2,1)",
                  boxShadow: `0 0 8px rgba(255,45,120,0.4)`,
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───────── Shared small components ───────── */
function GlowDot({ style }) {
  return <span style={{
    display: "inline-block", width: 8, height: 8, borderRadius: "50%",
    background: PINK, boxShadow: `0 0 8px ${PINK}, 0 0 20px ${PINK}`,
    flexShrink: 0, ...style,
  }} />;
}

function SectionHeader({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "36px 0 16px" }}>
      <GlowDot />
      <h2 style={{
        margin: 0, fontFamily: "'Orbitron', monospace", fontSize: 13,
        fontWeight: 700, letterSpacing: "0.2em", color: PINK, textTransform: "uppercase",
      }}>{children}</h2>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, ${PINK}, transparent)`, opacity: 0.4 }} />
    </div>
  );
}

function Badge({ severity }) {
  const colors = { high: "#ff4444", medium: "#ffaa00", low: "#00e5a0" };
  const color = colors[severity] || "#888";
  return <span style={{
    display: "inline-block", padding: "2px 10px", borderRadius: 30, fontSize: 10,
    fontFamily: "'Orbitron', monospace", fontWeight: 700, letterSpacing: "0.1em",
    color, border: `1px solid ${color}`, background: `${color}18`,
    textTransform: "uppercase", verticalAlign: "middle", marginLeft: 8,
  }}>{severity}</span>;
}

function QuestionCard({ q, a, index, intention, delay = 0 }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      background: "#0d0d0d",
      border: `1px solid rgba(255,45,120,${open ? 0.45 : 0.15})`,
      borderRadius: 12, marginBottom: 12, overflow: "hidden",
      boxShadow: open ? `0 0 24px rgba(255,45,120,0.08)` : "none",
      transition: "border-color 0.2s, box-shadow 0.2s",
      animation: `fadeSlideIn 0.5s ease both`, animationDelay: `${delay}s`,
    }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: "100%", background: "none", border: "none", padding: "16px 20px",
        display: "flex", alignItems: "flex-start", gap: 14, cursor: "pointer", textAlign: "left",
      }}>
        <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 11, color: PINK, fontWeight: 900, minWidth: 28, paddingTop: 2 }}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <span style={{ flex: 1, fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#e8e8e8", fontWeight: 500, lineHeight: 1.6 }}>{q}</span>
        <span style={{ color: PINK, fontSize: 18, transition: "transform 0.3s", transform: open ? "rotate(45deg)" : "rotate(0deg)", flexShrink: 0, paddingTop: 2 }}>+</span>
      </button>
      {open && (
        <div style={{ padding: "0 20px 20px 62px", animation: "fadeSlideIn 0.25s ease" }}>
          {intention && <p style={{ fontFamily: "'DM Sans'", fontSize: 11, color: PINK, margin: "0 0 10px", opacity: 0.8 }}>🎯 {intention}</p>}
          <div style={{ background: "#141414", border: `1px solid rgba(255,45,120,0.12)`, borderRadius: 8, padding: "14px 16px" }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, color: "#b0b0b0", margin: 0, lineHeight: 1.75 }}>{a}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function DayCard({ day, focus, tasks, delay }) {
  return (
    <div style={{
      background: "#0d0d0d", border: `1px solid rgba(255,45,120,0.15)`,
      borderRadius: 12, padding: "18px 20px",
      animation: `fadeSlideIn 0.5s ease both`, animationDelay: `${delay}s`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <div style={{
          fontFamily: "'Orbitron', monospace", fontSize: 10, fontWeight: 900,
          color: "#0a0a0a", background: PINK, borderRadius: 6,
          padding: "4px 10px", letterSpacing: "0.1em", boxShadow: `0 0 12px ${PINK}`,
        }}>DAY {day}</div>
        <span style={{ fontFamily: "'DM Sans'", fontSize: 14, fontWeight: 500, color: "#e8e8e8" }}>{focus}</span>
      </div>
      <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
        {tasks.map((task, i) => (
          <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
            <span style={{ color: PINK, fontSize: 14, marginTop: 2, flexShrink: 0 }}>▸</span>
            <span style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#999", lineHeight: 1.6 }}>{task}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SkillGapBar({ skill, severity, delay }) {
  const widths = { high: "90%", medium: "60%", low: "35%" };
  const colors = { high: "#ff4444", medium: "#ffaa00", low: "#00e5a0" };
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), delay * 1000 + 200); return () => clearTimeout(t); }, []);
  return (
    <div style={{ marginBottom: 16, animation: `fadeSlideIn 0.5s ease both`, animationDelay: `${delay}s` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#ccc" }}>{skill}</span>
        <Badge severity={severity} />
      </div>
      <div style={{ height: 4, background: "#1a1a1a", borderRadius: 4, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: animated ? widths[severity] || "50%" : "0%",
          background: `linear-gradient(to right, ${colors[severity]}, ${colors[severity]}99)`,
          borderRadius: 4, transition: "width 0.9s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: `0 0 8px ${colors[severity]}`,
        }} />
      </div>
    </div>
  );
}

function FloatingLabel({ label, value, onChange, type = "textarea" }) {
  const [focused, setFocused] = useState(false);
  const hasValue = value && value.length > 0;
  const base = {
    width: "100%", background: "#0d0d0d",
    border: `1px solid ${focused ? PINK : "rgba(255,255,255,0.08)"}`,
    borderRadius: 10, color: "#e8e8e8",
    fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s", boxSizing: "border-box",
    boxShadow: focused ? `0 0 0 3px ${PINK_DIM}, 0 0 20px ${PINK_GLOW}` : "none",
  };
  return (
    <div style={{ position: "relative", marginBottom: 20 }}>
      <label style={{
        position: "absolute", top: focused || hasValue ? -10 : type === "textarea" ? 16 : 14,
        left: 14, fontSize: focused || hasValue ? 10 : 13,
        color: focused ? PINK : "#555", fontFamily: "'Orbitron', monospace",
        letterSpacing: "0.1em", transition: "all 0.2s ease",
        pointerEvents: "none", background: focused || hasValue ? "#0a0a0a" : "transparent",
        padding: "0 4px", zIndex: 1, textTransform: "uppercase",
      }}>{label}</label>
      {type === "textarea"
        ? <textarea value={value} onChange={onChange} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            rows={5} style={{ ...base, padding: "20px 16px 12px", resize: "vertical" }} />
        : <input type={type} onChange={onChange} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            style={{ ...base, padding: "14px 16px" }} />
      }
    </div>
  );
}

/* ───────── Main Export ───────── */
export default function InterviewAnalyzer() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const resultRef = useRef(null);
  const visible = useAnimateIn(data);

  useEffect(() => {
    let iv;
    if (loading) {
      setProgress(0);
      iv = setInterval(() => setProgress(p => p < 85 ? p + Math.random() * 6 : p), 500);
    } else {
      setProgress(100);
      const t = setTimeout(() => setProgress(0), 700);
      return () => clearTimeout(t);
    }
    return () => clearInterval(iv);
  }, [loading]);

  useEffect(() => {
    if (data && resultRef.current) setTimeout(() => resultRef.current.scrollIntoView({ behavior: "smooth" }), 300);
  }, [data]);

  const handleUpload = async () => {
    if (!file || !jobDescription || !selfDescription) {
      setError("⚠ All fields are required — please fill everything before analyzing.");
      return;
    }
    setError("");
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jobDescription);
    formData.append("selfDescription", selfDescription);
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/interview", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Server error");
      const result = await res.json();
      setData(result?.interviewReport || null);
    } catch {
      setError("✕ Something went wrong. Please check the server and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; background: #080808; color: white; }
        textarea { font-family: 'DM Sans', sans-serif; }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.65; transform: scale(1.06); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes spinSlow { to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: ${PINK}; border-radius: 4px; }
      `}</style>

      {/* Scanlines */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9000,
        background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.03) 2px,rgba(0,0,0,0.03) 4px)",
      }} />

      {/* AI Loading Overlay */}
      <AILoadingOverlay visible={loading} />

      {/* Top progress bar */}
      {loading && (
        <div style={{
          position: "fixed", top: 0, left: 0, height: 2, width: `${progress}%`,
          background: `linear-gradient(to right, ${PINK}, #ff88bb)`,
          boxShadow: `0 0 14px ${PINK}`, zIndex: 9998, transition: "width 0.5s ease",
        }} />
      )}

      <div style={{ minHeight: "100vh", background: "#080808", padding: "0 0 80px" }}>
        {/* Hero header */}
        <div style={{ position: "relative", overflow: "hidden", borderBottom: `1px solid rgba(255,45,120,0.15)` }}>
          <div style={{
            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
            width: 640, height: 320,
            background: `radial-gradient(ellipse, rgba(255,45,120,0.11) 0%, transparent 70%)`,
            pointerEvents: "none",
          }} />
          <div style={{ maxWidth: 860, margin: "0 auto", padding: "60px 24px 48px", position: "relative" }}>
            <div style={{
              fontFamily: "'Orbitron', monospace", fontSize: 10, letterSpacing: "0.35em",
              color: PINK, marginBottom: 16, display: "flex", alignItems: "center", gap: 10,
            }}><GlowDot /> AI-POWERED CAREER INTELLIGENCE</div>
            <h1 style={{
              fontFamily: "'Orbitron', monospace", fontSize: "clamp(28px, 5vw, 52px)",
              fontWeight: 900, margin: "0 0 16px", lineHeight: 1.1,
              background: `linear-gradient(135deg, #ffffff 0%, #ff2d78 60%, #ff88bb 100%)`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>INTERVIEW<br />ANALYZER</h1>
            <p style={{ fontFamily: "'DM Sans'", fontSize: 15, color: "#666", margin: 0, fontWeight: 300, maxWidth: 420, lineHeight: 1.7 }}>
              Upload your resume, describe the role — get a complete AI-generated interview prep kit in seconds.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 860, margin: "0 auto", padding: "48px 24px 0" }}>
          {/* Input card */}
          <div style={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "32px 28px", marginBottom: 32 }}>
            <SectionHeader>Input Details</SectionHeader>
            <div style={{ marginTop: 24 }}>
              <FloatingLabel label="Job Description" value={jobDescription} onChange={e => setJobDescription(e.target.value)} />
              <FloatingLabel label="Your Self Description" value={selfDescription} onChange={e => setSelfDescription(e.target.value)} />

              {/* File drop zone */}
              <div style={{
                border: `2px dashed ${file ? PINK : "rgba(255,255,255,0.08)"}`,
                borderRadius: 10, padding: "28px", textAlign: "center",
                background: file ? PINK_DIM : "#0a0a0a",
                transition: "all 0.3s", marginBottom: 24,
                cursor: "pointer", position: "relative",
              }}>
                <input type="file" accept=".pdf,.doc,.docx" onChange={e => setFile(e.target.files[0])}
                  style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%", height: "100%" }} />
                <div style={{ fontSize: 30, marginBottom: 8 }}>{file ? "✅" : "⬆"}</div>
                <p style={{ fontFamily: "'Orbitron', monospace", fontSize: 11, letterSpacing: "0.15em", color: file ? PINK : "#444", margin: "0 0 4px", fontWeight: 700 }}>
                  {file ? file.name : "UPLOAD RESUME"}
                </p>
                <p style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#333", margin: 0 }}>
                  {file ? "File selected — ready to analyze" : "PDF, DOC, DOCX supported"}
                </p>
              </div>

              {error && (
                <div style={{ background: "rgba(255,60,60,0.08)", border: "1px solid rgba(255,60,60,0.25)", borderRadius: 8, padding: "12px 16px", marginBottom: 20, fontFamily: "'DM Sans'", fontSize: 13, color: "#ff6b6b" }}>
                  {error}
                </div>
              )}

              <button onClick={handleUpload} disabled={loading} style={{
                width: "100%", padding: "17px 32px",
                background: `linear-gradient(135deg, #ff2d78, #ff6ba8)`,
                border: "none", borderRadius: 10, color: "white",
                fontFamily: "'Orbitron', monospace", fontSize: 13, fontWeight: 700, letterSpacing: "0.2em",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: `0 0 30px rgba(255,45,120,0.4), 0 4px 20px rgba(255,45,120,0.3)`,
                transition: "all 0.3s", opacity: loading ? 0.5 : 1,
              }}>
                ANALYZE & GENERATE REPORT →
              </button>
            </div>
          </div>

          {/* ─── Results ─── */}
          {data && (
            <div ref={resultRef} style={{ opacity: visible ? 1 : 0, transition: "opacity 0.6s ease" }}>

              {/* ★ Match Score — BIG */}
              {data.matchScore !== undefined && <MatchScoreHero score={data.matchScore} />}

              {/* Skill Gaps */}
              {data.skillGaps?.length > 0 && (
                <div style={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "28px", marginBottom: 20 }}>
                  <SectionHeader>Skill Gap Analysis</SectionHeader>
                  <div style={{ marginTop: 20 }}>
                    {data.skillGaps.map((gap, i) => <SkillGapBar key={i} skill={gap.skill} severity={gap.severity} delay={i * 0.1} />)}
                  </div>
                </div>
              )}

              {/* Technical Questions */}
              {data.technicalQuestions?.length > 0 && (
                <div style={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "28px", marginBottom: 20 }}>
                  <SectionHeader>Technical Questions</SectionHeader>
                  <p style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#444", margin: "0 0 20px" }}>Click any question to reveal the model answer.</p>
                  {data.technicalQuestions.map((q, i) => <QuestionCard key={i} index={i} q={q.question} a={q.answer} intention={q.intention} delay={i * 0.07} />)}
                </div>
              )}

              {/* Behavioral Questions */}
              {data.behavioralQuestion?.length > 0 && (
                <div style={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "28px", marginBottom: 20 }}>
                  <SectionHeader>Behavioral Questions</SectionHeader>
                  <p style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#444", margin: "0 0 20px" }}>Craft compelling STAR-method answers with these.</p>
                  {data.behavioralQuestion.map((q, i) => <QuestionCard key={i} index={i} q={q.question} a={q.answer} intention={q.intention} delay={i * 0.07} />)}
                </div>
              )}

              {/* 7-Day Plan */}
              {data.preparationPlan?.length > 0 && (
                <div style={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "28px", marginBottom: 20 }}>
                  <SectionHeader>7-Day Preparation Plan</SectionHeader>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14, marginTop: 20 }}>
                    {data.preparationPlan.map((plan, i) => <DayCard key={i} day={plan.day} focus={plan.focus} tasks={plan.tasks || []} delay={i * 0.08} />)}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div style={{ textAlign: "center", padding: "32px 0 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
                <div style={{ flex: 1, height: 1, background: "rgba(255,45,120,0.15)" }} />
                <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 10, letterSpacing: "0.25em", color: "#2a2a2a" }}>REPORT COMPLETE</span>
                <GlowDot />
                <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 10, letterSpacing: "0.25em", color: "#2a2a2a" }}>
                  {new Date(data.createdAt).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })}
                </span>
                <div style={{ flex: 1, height: 1, background: "rgba(255,45,120,0.15)" }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}