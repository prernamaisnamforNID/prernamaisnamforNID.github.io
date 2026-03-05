import { useState, useEffect, useRef, useCallback } from "react";

const PIXEL_FONT = "'Press Start 2P', monospace";
const MONTHS = ["JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE","JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"];
const DAYS = ["SUN","MON","TUE","WED","THU","FRI","SAT"];

const THEMES = [
  { bg: "#0d1b2a", panel: "#1b2d40", accent: "#00e5ff", highlight: "#ffd93d", text: "#e0f7ff", sub: "#5ab4c5", name: "DEEP" },
  { bg: "#1a0a2e", panel: "#2d1b45", accent: "#ff6bff", highlight: "#7fff7f", text: "#ffe0ff", sub: "#c08cc8", name: "CORAL" },
  { bg: "#0a1f0a", panel: "#142814", accent: "#00ff88", highlight: "#ffaa00", text: "#d4ffd4", sub: "#60a060", name: "KELP" },
  { bg: "#1a0d00", panel: "#2e1a00", accent: "#ff8c42", highlight: "#00e5ff", text: "#fff0d4", sub: "#c08040", name: "ABYSS" },
];

const T = -1; // transparent

const CREATURES = [
  {
    name: "CLOWNFISH",
    palette: ["#ff6a00","#ffffff","#1a1a1a","#ff8c33","#ffe0b2"],
    pixels: [
      [T,T,T,0,0,0,0,T,T,T],
      [T,T,0,3,3,0,3,0,T,T],
      [T,0,3,1,3,1,3,3,0,T],
      [0,3,1,1,1,1,1,3,3,0],
      [0,3,1,2,1,1,1,3,3,0],
      [0,3,1,1,1,1,1,3,3,0],
      [T,0,3,1,3,1,3,3,0,T],
      [T,T,0,3,0,0,3,0,T,T],
      [T,T,T,0,0,0,0,T,T,T],
      [T,T,T,T,T,T,T,T,T,T],
    ],
    anim: "swim", bubbles: true,
  },
  {
    name: "OCTOPUS",
    palette: ["#cc44cc","#ff88ff","#aa22aa","#ffffff","#330033"],
    pixels: [
      [T,T,0,0,0,0,0,0,T,T],
      [T,0,1,1,0,0,1,1,0,T],
      [0,1,3,1,0,0,1,3,1,0],
      [0,1,1,1,1,1,1,1,1,0],
      [0,0,1,1,1,1,1,1,0,0],
      [T,0,0,0,0,0,0,0,0,T],
      [T,0,T,0,T,T,0,T,0,T],
      [0,T,T,0,T,T,0,T,T,0],
      [0,T,T,0,T,T,0,T,T,0],
      [T,T,T,T,T,T,T,T,T,T],
    ],
    anim: "bob", bubbles: true,
  },
  {
    name: "JELLYFISH",
    palette: ["#88ccff","#aaddff","#ffffff","#cceeff","#4499cc"],
    pixels: [
      [T,T,T,2,2,2,2,T,T,T],
      [T,T,2,0,0,0,0,2,T,T],
      [T,2,0,1,0,0,1,0,2,T],
      [2,0,1,1,0,0,1,1,0,2],
      [2,0,0,0,0,0,0,0,0,2],
      [2,0,0,3,0,0,3,0,0,2],
      [T,2,0,0,0,0,0,0,2,T],
      [T,T,2,2,4,4,2,2,T,T],
      [T,T,T,4,T,T,4,T,T,T],
      [T,T,4,T,T,T,T,4,T,T],
    ],
    anim: "pulse", bubbles: false,
  },
  {
    name: "CRAB",
    palette: ["#dd4422","#ff6644","#aa2200","#ffaa88","#ffffff"],
    pixels: [
      [0,T,T,T,T,T,T,T,T,0],
      [T,0,T,T,T,T,T,T,0,T],
      [T,T,0,2,2,2,2,0,T,T],
      [T,T,2,1,1,1,1,2,T,T],
      [0,2,1,4,1,1,4,1,2,0],
      [2,2,1,1,1,1,1,1,2,2],
      [2,T,2,1,1,1,1,2,T,2],
      [T,T,2,2,T,T,2,2,T,T],
      [T,T,2,T,T,T,T,2,T,T],
      [T,T,T,T,T,T,T,T,T,T],
    ],
    anim: "scuttle", bubbles: false,
  },
  {
    name: "SEAHORSE",
    palette: ["#ffaa33","#ffcc77","#cc7700","#ffffff","#ffdd99"],
    pixels: [
      [T,T,T,T,0,0,T,T,T,T],
      [T,T,T,0,1,1,0,T,T,T],
      [T,T,T,0,1,3,0,T,T,T],
      [T,T,0,1,0,0,T,T,T,T],
      [T,T,0,1,1,0,2,T,T,T],
      [T,T,T,0,1,1,0,T,T,T],
      [T,T,T,0,1,1,0,T,T,T],
      [T,T,T,2,0,1,0,T,T,T],
      [T,T,T,T,2,0,T,T,T,T],
      [T,T,T,T,T,T,T,T,T,T],
    ],
    anim: "float", bubbles: true,
  },
  {
    name: "STARFISH",
    palette: ["#ff6644","#ff9977","#cc3322","#ffccaa","#ffffff"],
    pixels: [
      [T,T,T,T,0,0,T,T,T,T],
      [T,T,T,0,1,1,0,T,T,T],
      [T,0,T,0,1,1,0,T,0,T],
      [T,0,0,0,1,1,0,0,0,T],
      [0,1,1,1,1,1,1,1,1,0],
      [0,1,1,1,1,1,1,1,1,0],
      [T,0,0,0,1,1,0,0,0,T],
      [T,T,0,T,1,1,T,0,T,T],
      [T,T,0,T,0,0,T,0,T,T],
      [T,T,T,T,T,T,T,T,T,T],
    ],
    anim: "spin", bubbles: false,
  },
  {
    name: "PUFFERFISH",
    palette: ["#eecc44","#ffee88","#cc9900","#333300","#ffffff"],
    pixels: [
      [T,T,0,0,0,0,0,0,T,T],
      [T,0,2,2,2,2,2,2,0,T],
      [0,2,1,0,1,1,0,1,2,0],
      [0,2,1,3,1,1,3,1,2,0],
      [0,2,1,1,1,1,1,1,2,0],
      [0,2,0,1,1,1,1,0,2,0],
      [T,0,2,2,4,2,2,2,0,T],
      [T,T,0,0,4,0,0,0,T,T],
      [T,T,T,T,4,T,T,T,T,T],
      [T,T,T,T,T,T,T,T,T,T],
    ],
    anim: "puff", bubbles: true,
  },
  {
    name: "WHALE",
    palette: ["#4488cc","#66aaee","#224466","#ffffff","#88bbff"],
    pixels: [
      [T,T,T,T,T,T,T,T,T,T],
      [T,T,T,T,T,0,0,T,T,T],
      [T,0,0,0,0,0,1,0,T,T],
      [0,1,1,1,0,0,1,1,0,T],
      [0,1,1,1,1,3,1,1,1,0],
      [0,1,1,1,1,1,1,1,1,0],
      [T,0,1,1,1,1,1,1,0,T],
      [T,T,0,0,1,0,1,0,T,T],
      [T,T,T,0,T,T,T,0,T,T],
      [T,T,T,T,T,T,T,T,T,T],
    ],
    anim: "swim", bubbles: true,
  },
  {
    name: "TURTLE",
    palette: ["#44aa44","#66cc66","#226622","#eecc88","#ffffff"],
    pixels: [
      [T,T,T,T,0,0,T,T,T,T],
      [T,T,T,2,2,2,2,T,T,T],
      [T,0,T,2,0,0,2,T,0,T],
      [0,2,0,0,0,0,0,0,2,0],
      [0,2,0,1,0,0,1,0,2,0],
      [0,2,0,0,0,0,0,0,2,0],
      [T,0,T,2,0,0,2,T,0,T],
      [T,T,T,2,2,2,2,T,T,T],
      [T,T,T,T,3,3,T,T,T,T],
      [T,T,T,T,T,T,T,T,T,T],
    ],
    anim: "bob", bubbles: false,
  },
  {
    name: "ANGLERFISH",
    palette: ["#223355","#334466","#112244","#ffff44","#ff4444"],
    pixels: [
      [T,T,T,T,T,T,T,0,T,T],
      [T,T,T,T,T,T,T,3,T,T],
      [T,T,T,T,T,T,0,3,T,T],
      [T,0,0,0,0,0,1,2,T,T],
      [0,1,4,1,0,0,1,1,0,T],
      [0,1,1,1,1,1,1,1,0,T],
      [T,0,1,1,0,0,1,0,T,T],
      [T,T,0,0,2,2,0,T,T,T],
      [T,T,T,T,T,T,T,T,T,T],
      [T,T,T,T,T,T,T,T,T,T],
    ],
    anim: "lurk", bubbles: true,
  },
  {
    name: "SHRIMP",
    palette: ["#ff8866","#ffaa88","#cc4422","#ffffff","#ffccaa"],
    pixels: [
      [T,T,T,T,T,0,0,T,T,T],
      [T,T,T,T,0,2,2,0,T,T],
      [T,T,T,0,1,1,2,T,T,T],
      [T,T,T,0,1,1,0,T,0,T],
      [T,T,0,1,1,0,T,T,0,T],
      [T,0,1,1,0,T,T,T,T,T],
      [0,2,1,0,T,T,T,T,T,T],
      [0,T,0,T,T,T,T,T,T,T],
      [T,T,T,T,T,T,T,T,T,T],
      [T,T,T,T,T,T,T,T,T,T],
    ],
    anim: "dart", bubbles: false,
  },
  {
    name: "SHARK",
    palette: ["#778899","#aabbcc","#556677","#ffffff","#ff3322"],
    pixels: [
      [T,T,T,T,T,T,0,T,T,T],
      [T,T,T,T,T,0,1,T,T,T],
      [T,0,0,0,0,0,0,0,0,T],
      [0,2,2,0,0,0,0,0,1,0],
      [0,2,2,0,3,0,0,1,1,0],
      [0,0,0,0,0,0,0,0,1,0],
      [T,T,0,0,0,0,0,0,0,T],
      [T,T,T,0,T,T,0,T,T,T],
      [T,T,T,T,T,T,T,T,T,T],
      [T,T,T,T,T,T,T,T,T,T],
    ],
    anim: "swim", bubbles: false,
  },
];

function getDaysInMonth(year, month) { return new Date(year, month + 1, 0).getDate(); }
function getFirstDayOfMonth(year, month) { return new Date(year, month, 1).getDay(); }

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return [r,g,b];
}

function SeaCreatureCanvas({ creature, theme, date }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const SCALE = 18;
  const W = 10, H = 10;
  const CW = W * SCALE, CH = H * SCALE + 64;

  const drawFrame = useCallback((ctx, t) => {
    ctx.clearRect(0, 0, CW, CH);

    // Ocean bg
    const grad = ctx.createLinearGradient(0, 0, 0, CH);
    grad.addColorStop(0, theme.panel);
    grad.addColorStop(1, theme.bg);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CW, CH);

    // Caustic shimmer lines
    for (let c = 0; c < 4; c++) {
      const cx2 = (Math.sin(t * 0.7 + c * 1.5) * 0.5 + 0.5) * CW;
      const cy2 = (Math.sin(t * 0.4 + c * 0.9) * 0.5 + 0.5) * (H * SCALE);
      const g2 = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, 30);
      g2.addColorStop(0, theme.accent + "22");
      g2.addColorStop(1, "transparent");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, CW, H * SCALE);
    }

    // Bubbles
    if (creature.bubbles) {
      for (let b = 0; b < 6; b++) {
        const bx = (Math.sin(t * 0.4 + b * 1.1) * 0.4 + 0.5) * CW;
        const progress = ((t * 0.25 + b * 0.17) % 1.0);
        const by = (1 - progress) * (H * SCALE + 20);
        const r = 2 + (b % 3);
        ctx.save();
        ctx.strokeStyle = theme.accent + "55";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(bx, by, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }

    // Animation offsets
    let ox = 0, oy = 0, sx = 1, sy = 1, rot = 0;
    const { anim } = creature;
    if (anim === "swim") { ox = Math.sin(t * 2) * 10; oy = Math.sin(t * 4) * 3; }
    else if (anim === "bob") { oy = Math.sin(t * 1.5) * 7; }
    else if (anim === "pulse") { const p = 0.82 + Math.sin(t * 2.2) * 0.18; sx = p; sy = p; }
    else if (anim === "scuttle") { ox = Math.sin(t * 3) * 9; oy = Math.abs(Math.sin(t * 6)) * 3; }
    else if (anim === "float") { ox = Math.sin(t * 1.1) * 7; oy = Math.sin(t * 0.7) * 9; rot = Math.sin(t * 1.1) * 0.18; }
    else if (anim === "spin") { rot = t * 0.9; }
    else if (anim === "puff") { const p = 0.78 + Math.abs(Math.sin(t * 1.4)) * 0.38; sx = p; sy = p; }
    else if (anim === "lurk") { ox = Math.sin(t * 0.6) * 13; oy = Math.sin(t * 0.25) * 5; }
    else if (anim === "dart") { ox = Math.sin(t * 4.5) * 15; oy = Math.sin(t * 9) * 6; }

    // Draw pixels
    ctx.save();
    const cx = CW / 2, cy = (H * SCALE) / 2;
    ctx.translate(cx + ox, cy + oy);
    ctx.rotate(rot);
    ctx.scale(sx, sy);
    ctx.translate(-cx, -cy);

    creature.pixels.forEach((row, ry) => {
      row.forEach((colorIdx, rx) => {
        if (colorIdx === T) return;
        ctx.fillStyle = creature.palette[colorIdx];
        ctx.fillRect(rx * SCALE, ry * SCALE, SCALE - 1, SCALE - 1);
      });
    });
    ctx.restore();

    // Bottom labels
    ctx.fillStyle = theme.accent;
    ctx.font = `bold 7px ${PIXEL_FONT}`;
    ctx.textAlign = "center";
    ctx.fillText(`DAY ${String(date).padStart(2,"0")}`, CW / 2, H * SCALE + 22);
    ctx.fillStyle = theme.sub;
    ctx.font = `6px ${PIXEL_FONT}`;
    ctx.fillText(creature.name, CW / 2, H * SCALE + 42);

    // Decorative dots
    for (let d = 0; d < 5; d++) {
      const dx = CW / 2 + (d - 2) * 12;
      const active = Math.floor(t * 2 + 0.5) % 5 === d;
      ctx.fillStyle = active ? theme.highlight : theme.accent + "44";
      ctx.fillRect(dx - 2, H * SCALE + 54, 4, 4);
    }
  }, [creature, theme, date, CW]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let start = null;
    const loop = (ts) => {
      if (!start) start = ts;
      drawFrame(ctx, (ts - start) / 1000);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [drawFrame]);

  return (
    <canvas
      ref={canvasRef}
      width={CW}
      height={CH}
      style={{ imageRendering: "pixelated", display: "block" }}
    />
  );
}

function CreatureModal({ date, month, year, theme, onClose }) {
  const creatureIdx = ((date * 7 + month * 3 + year) % CREATURES.length);
  const creature = CREATURES[creatureIdx];

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0,
      background: "#00000099",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 100, backdropFilter: "blur(3px)",
      animation: "fadeIn 0.15s ease",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: theme.panel,
        border: `4px solid ${theme.accent}`,
        boxShadow: `8px 8px 0 ${theme.accent}44, 0 0 60px ${theme.accent}22`,
        padding: "18px",
        fontFamily: PIXEL_FONT,
        animation: "popIn 0.22s cubic-bezier(0.175,0.885,0.32,1.275)",
        position: "relative",
        minWidth: "210px",
      }}>
        {/* Corner pixels */}
        {[{top:0,left:0},{top:0,right:0},{bottom:0,left:0},{bottom:0,right:0}].map((pos,i) => (
          <div key={i} style={{ position:"absolute", ...pos, width:8, height:8, background: theme.highlight }} />
        ))}

        <div style={{
          color: theme.highlight, fontSize:"7px", textAlign:"center",
          marginBottom:"12px", letterSpacing:"3px",
          textShadow: `0 0 10px ${theme.highlight}`,
        }}>
          ~ SEA FRIEND ~
        </div>

        <div style={{ border:`3px solid ${theme.accent}66`, lineHeight:0, display:"inline-block" }}>
          <SeaCreatureCanvas creature={creature} theme={theme} date={date} />
        </div>

        <div style={{
          marginTop:"12px", textAlign:"center", color: theme.sub,
          fontSize:"6px", borderTop:`2px dashed ${theme.accent}44`,
          paddingTop:"8px", letterSpacing:"1px",
        }}>
          {MONTHS[month].slice(0,3)} {String(date).padStart(2,"0")}, {year}
        </div>

        <button onClick={onClose} style={{
          display:"block", margin:"10px auto 0",
          background: theme.accent, color: theme.bg,
          border:`3px solid ${theme.text}`,
          boxShadow:`3px 3px 0 ${theme.bg}`,
          fontFamily: PIXEL_FONT, fontSize:"7px",
          cursor:"pointer", padding:"7px 16px", letterSpacing:"1px",
          transition:"all 0.1s",
        }}>CLOSE ✕</button>
      </div>
    </div>
  );
}

export default function PixelCalendar() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [themeIdx, setThemeIdx] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);

  const theme = THEMES[themeIdx];
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const isToday = (d) =>
    d === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();

  return (
    <div style={{
      minHeight: "100vh",
      background: theme.bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: PIXEL_FONT, fontSize: "10px",
      padding: "20px",
      transition: "background 0.4s",
      backgroundImage: `radial-gradient(${theme.accent}15 1px, transparent 1px)`,
      backgroundSize: "20px 20px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        * { box-sizing: border-box; }
        .px-btn:hover { transform: translate(-2px,-2px); filter: brightness(1.25); }
        .px-btn:active { transform: translate(2px,2px); }
        .day-cell { cursor: pointer; transition: all 0.1s; position: relative; }
        .day-cell:hover { transform: scale(1.2); z-index: 5; filter: brightness(1.4); }
        .day-cell:hover::after { content:'🐟'; position:absolute; top:-14px; left:50%; transform:translateX(-50%); font-size:10px; }
        .day-cell:active { transform: scale(0.9); }
        .theme-btn:hover { transform: scale(1.15); }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes popIn { from{transform:scale(0.4) rotate(-8deg);opacity:0} to{transform:scale(1) rotate(0deg);opacity:1} }
        @keyframes glow { 0%,100%{text-shadow:0 0 6px currentColor} 50%{text-shadow:0 0 18px currentColor,0 0 30px currentColor} }
      `}</style>

      <div style={{ width: "100%", maxWidth: "420px" }}>
        <div style={{
          textAlign:"center", marginBottom:"8px",
          color: theme.accent, fontSize:"7px", letterSpacing:"3px",
          display:"flex", alignItems:"center", justifyContent:"center", gap:"8px",
          animation:"glow 3s infinite",
        }}>
          <span style={{ animation:"float 2.5s ease-in-out infinite" }}>🐠</span>
          PIXEL SEA CAL
          <span style={{ animation:"float 2.5s ease-in-out infinite 0.8s" }}>🐙</span>
        </div>
        <div style={{ textAlign:"center", color:theme.sub, fontSize:"6px", marginBottom:"12px", letterSpacing:"1px" }}>
          ▼ CLICK ANY DATE TO MEET A SEA FRIEND ▼
        </div>

        <div style={{
          border:`4px solid ${theme.accent}`,
          boxShadow:`5px 5px 0 ${theme.accent}55`,
          background: theme.panel,
          padding:"16px",
        }}>
          {/* Month nav */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"16px" }}>
            <button className="px-btn" onClick={prevMonth} style={{
              background:theme.accent, color:theme.bg,
              border:`3px solid ${theme.text}`, boxShadow:`3px 3px 0 ${theme.bg}`,
              fontFamily:PIXEL_FONT, fontSize:"10px", cursor:"pointer", padding:"6px 10px", transition:"all 0.1s",
            }}>◄</button>
            <div style={{ textAlign:"center" }}>
              <div style={{ color:theme.highlight, fontSize:"11px", marginBottom:"4px", letterSpacing:"2px" }}>
                {MONTHS[currentMonth]}
              </div>
              <div style={{ color:theme.sub, fontSize:"8px" }}>{currentYear}</div>
            </div>
            <button className="px-btn" onClick={nextMonth} style={{
              background:theme.accent, color:theme.bg,
              border:`3px solid ${theme.text}`, boxShadow:`3px 3px 0 ${theme.bg}`,
              fontFamily:PIXEL_FONT, fontSize:"10px", cursor:"pointer", padding:"6px 10px", transition:"all 0.1s",
            }}>►</button>
          </div>

          {/* Day headers */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"3px", marginBottom:"6px" }}>
            {DAYS.map((d,i) => (
              <div key={d} style={{
                textAlign:"center",
                color: i===0 ? theme.accent : i===6 ? theme.highlight : theme.sub,
                fontSize:"7px", padding:"4px 0",
                borderBottom:`2px solid ${theme.accent}44`,
              }}>{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"3px" }}>
            {cells.map((d,i) => {
              const dw = i % 7;
              const isT = isToday(d);
              return (
                <div
                  key={i}
                  className={d ? "day-cell" : ""}
                  onClick={() => d && setSelectedDate(d)}
                  style={{
                    aspectRatio:"1",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:"9px",
                    background: d ? (isT ? theme.accent : `${theme.bg}88`) : "transparent",
                    color: d ? (isT ? theme.bg : (dw===0 ? theme.accent : dw===6 ? theme.highlight : theme.text)) : "transparent",
                    border: d ? (isT ? `2px solid ${theme.highlight}` : `2px solid ${theme.accent}44`) : "2px solid transparent",
                    boxShadow: isT ? `0 0 12px ${theme.accent}aa, 2px 2px 0 ${theme.highlight}` : "none",
                  }}
                >
                  {d}
                  {isT && <span style={{
                    position:"absolute", bottom:"2px", left:"50%", transform:"translateX(-50%)",
                    width:"4px", height:"4px", background:theme.highlight,
                    display:"block", animation:"blink 1s infinite",
                  }}/>}
                </div>
              );
            })}
          </div>

          <div style={{
            marginTop:"14px", textAlign:"center", color:theme.sub, fontSize:"7px",
            borderTop:`2px dashed ${theme.accent}44`, paddingTop:"10px", letterSpacing:"1px",
          }}>
            TODAY: {DAYS[today.getDay()]} {today.getDate()} {MONTHS[today.getMonth()].slice(0,3)} {today.getFullYear()}
          </div>
        </div>

        {/* Theme switcher */}
        <div style={{ display:"flex", justifyContent:"center", gap:"8px", marginTop:"14px" }}>
          {THEMES.map((t,i) => (
            <button key={t.name} className="theme-btn" onClick={() => setThemeIdx(i)} title={t.name} style={{
              width:"22px", height:"22px", background:t.accent,
              border: i===themeIdx ? `3px solid #fff` : `2px solid ${t.accent}88`,
              boxShadow: i===themeIdx ? `0 0 8px ${t.accent}` : "none",
              cursor:"pointer", transition:"all 0.15s",
            }}/>
          ))}
        </div>
        <div style={{ textAlign:"center", color:theme.sub, fontSize:"7px", marginTop:"6px", letterSpacing:"2px" }}>
          {THEMES[themeIdx].name} MODE
        </div>
      </div>

      {selectedDate !== null && (
        <CreatureModal
          date={selectedDate}
          month={currentMonth}
          year={currentYear}
          theme={theme}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
}
