import React, { useEffect, useRef, useState } from "react";

/* ─── palette ─────────────────────────── */
const PINK  = "#ff2d78";
const PINK2 = "#ff88bb";
const CYAN  = "#00e5ff";
const DARK  = "#080808";

/* ─── tiny math helpers ───────────────── */
const lerp      = (a, b, t) => a + (b - a) * t;
const easeIO    = t => t < .5 ? 2*t*t : -1+(4-2*t)*t;
const glow      = (ctx, col, blur) => { ctx.shadowColor = col; ctx.shadowBlur = blur; };
const noGlow    = ctx => { ctx.shadowBlur = 0; };

/* ─── hex path helper ─────────────────── */
function hexPath(ctx, cx, cy, r, rot = 0) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + rot;
    i === 0 ? ctx.moveTo(cx + r*Math.cos(a), cy + r*Math.sin(a))
            : ctx.lineTo(cx + r*Math.cos(a), cy + r*Math.sin(a));
  }
  ctx.closePath();
}

/* ─── draw one limb segment ───────────── */
function drawLimb(ctx, p1, p2, w, col) {
  ctx.beginPath();
  ctx.strokeStyle = col;
  ctx.lineWidth   = w;
  ctx.lineCap     = "round";
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
}

/* ─── draw a glowing joint dot ─────────── */
function drawJoint(ctx, p, r, col, blur = 10) {
  glow(ctx, col, blur);
  ctx.beginPath();
  ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
  ctx.fillStyle = col;
  ctx.fill();
  noGlow(ctx);
}

/* ══════════════════════════════════════
   MANNEQUIN CANVAS COMPONENT
══════════════════════════════════════ */
function MannequinCanvas() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx    = canvas.getContext("2d");
    let   raf;
    const start  = performance.now();

    /* ── activity timeline (ms) ─────────── */
    const CYCLE = 14000;
    const TIMELINE = [
      { id: "writing",   s: 0,     e: 4000  },
      { id: "erasing",   s: 4000,  e: 6500  },
      { id: "placing",   s: 6500,  e: 9000  },
      { id: "arranging", s: 9000,  e: 11500 },
      { id: "scanning",  s: 11500, e: 14000 },
    ];

    /* ── document bounds ─────────────────── */
    const DOC = { x: 65, y: 345, w: 305, h: 195, rot: -0.04 };

    /* ── ambient floating particles ──────── */
    const ambient = Array.from({ length: 12 }, () => ({
      x: 20 + Math.random() * 400, y: 10 + Math.random() * 80,
      vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4,
      r: 1.5 + Math.random() * 2,
    }));

    /* ── spark pool for erasing ──────────── */
    const sparks = [];
    let   lastSpark = 0;

    /* ── writing chars pool ──────────────── */
    const chars  = [];
    let   lastChar = 0;

    function getAct(now) {
      const ct = now % CYCLE;
      for (const a of TIMELINE)
        if (ct >= a.s && ct < a.e)
          return { id: a.id, t: (ct - a.s) / (a.e - a.s), ct };
      return { id: "writing", t: 0, ct: 0 };
    }

    function getJoints(act) {
      const MX = 218;
      const H  = { x: MX,      y: 88  };
      const NB = { x: MX,      y: 122 };
      const LS = { x: MX - 46, y: 142 };
      const RS = { x: MX + 46, y: 142 };
      const HP = { x: MX,      y: 255 };
      const LH = { x: MX - 26, y: 258 };
      const RH = { x: MX + 26, y: 258 };
      const LK = { x: MX - 30, y: 325 };
      const RK = { x: MX + 30, y: 325 };
      const LF = { x: MX - 33, y: 395 };
      const RF = { x: MX + 33, y: 395 };

      let LE = { x: MX - 65, y: 205 };
      let RE = { x: MX + 65, y: 205 };
      let LW = { x: MX - 78, y: 268 };
      let RW = { x: MX + 78, y: 268 };

      const { id, t } = act;

      if (id === "writing") {
        const sweep = Math.sin(t * Math.PI * 10) * 55;
        const dip   = Math.sin(t * Math.PI * 2.5) * 12;
        RE = { x: MX + 52, y: 210 + dip };
        RW = { x: DOC.x + DOC.w * 0.28 + sweep, y: DOC.y + 38 + dip };
        LE = { x: MX - 62, y: 195 };
        LW = { x: MX - 75, y: 250 };
      }
      else if (id === "erasing") {
        const sweep = Math.sin(t * Math.PI * 20) * 52;
        RE = { x: MX + 48, y: 208 };
        RW = { x: DOC.x + DOC.w * 0.48 + sweep, y: DOC.y + 32 };
        LE = { x: MX - 58, y: 198 };
        LW = { x: MX - 72, y: 248 };
      }
      else if (id === "placing") {
        const go = easeIO(Math.max((t - .5) * 2, 0));
        const pu = easeIO(Math.min(t * 2, 1));
        RE = { x: MX + lerp(75, 52, go), y: lerp(198, 212, go) };
        RW = { x: lerp(MX + 155, DOC.x + 55, go), y: lerp(188, DOC.y + 48, go) };
        LE = { x: MX - 58, y: 200 };
        LW = { x: MX - 70, y: 252 };
      }
      else if (id === "arranging") {
        const wL = Math.sin(t * Math.PI * 3.5) * 42;
        const wR = Math.sin(t * Math.PI * 3.5 + Math.PI) * 42;
        LE = { x: MX - 52, y: 212 };
        LW = { x: DOC.x + 38 + wL, y: DOC.y + 55 };
        RE = { x: MX + 52, y: 212 };
        RW = { x: DOC.x + DOC.w - 38 + wR, y: DOC.y + 55 };
      }
      else if (id === "scanning") {
        LE = { x: MX - 68, y: 192 };
        LW = { x: MX - 88, y: 240 };
        RE = { x: MX + 68, y: 192 };
        RW = { x: MX + 88, y: 240 };
      }

      return { H, NB, LS, RS, HP, LH, RH, LK, RK, LF, RF, LE, RE, LW, RW };
    }

    /* ─── draw the geometric AI mannequin ── */
    function drawMan(ctx, j, act, t) {
      const { id } = act;
      const MX = 218;
      const BODY   = "#111128";
      const LIMB   = "#1e1e3a";
      const HLIMB  = "#2a2a50";
      const isAct  = id !== "scanning";

      /* ── legs ── */
      drawLimb(ctx, j.LH, j.LK, 9, LIMB);
      drawLimb(ctx, j.RH, j.RK, 9, LIMB);
      drawLimb(ctx, j.LK, j.LF, 8, LIMB);
      drawLimb(ctx, j.RK, j.RF, 8, LIMB);
      glow(ctx, PINK, 5);
      drawLimb(ctx, j.LH, j.LK, 1.5, "rgba(255,45,120,.4)");
      drawLimb(ctx, j.RH, j.RK, 1.5, "rgba(255,45,120,.4)");
      drawLimb(ctx, j.LK, j.LF, 1.5, "rgba(255,45,120,.35)");
      drawLimb(ctx, j.RK, j.RF, 1.5, "rgba(255,45,120,.35)");
      noGlow(ctx);
      drawJoint(ctx, j.LK, 5, PINK, 8);
      drawJoint(ctx, j.RK, 5, PINK, 8);
      /* feet */
      [{ p: j.LF, dx: -3, a: -.12 }, { p: j.RF, dx: 3, a: .12 }].forEach(({ p, dx, a }) => {
        ctx.save();
        ctx.translate(p.x + dx, p.y);
        ctx.rotate(a);
        ctx.fillStyle = LIMB;
        ctx.beginPath();
        ctx.ellipse(0, 0, 13, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      /* ── torso ── */
      ctx.beginPath();
      ctx.moveTo(j.LS.x, j.LS.y);
      ctx.lineTo(j.RS.x, j.RS.y);
      ctx.lineTo(j.RH.x, j.RH.y);
      ctx.lineTo(j.LH.x, j.LH.y);
      ctx.closePath();
      ctx.fillStyle = BODY;
      ctx.fill();
      glow(ctx, PINK, 10);
      ctx.strokeStyle = "rgba(255,45,120,.55)";
      ctx.lineWidth = 1.8;
      ctx.stroke();
      noGlow(ctx);
      /* circuit lines on torso */
      ctx.strokeStyle = "rgba(255,45,120,.18)";
      ctx.lineWidth = 1;
      for (let i = 1; i < 4; i++) {
        const y = j.LS.y + (j.LH.y - j.LS.y) * (i / 4);
        ctx.beginPath();
        ctx.moveTo(j.LS.x + 6, y);
        ctx.lineTo(j.RS.x - 6, y);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(MX, j.LS.y + 8);
      ctx.lineTo(MX, j.LH.y - 8);
      ctx.strokeStyle = "rgba(255,45,120,.28)";
      ctx.stroke();
      /* chest reactor */
      const cy2 = (j.LS.y + j.LH.y) / 2;
      const pr  = 5 + Math.sin(t * .003) * 2;
      glow(ctx, PINK, 18);
      ctx.beginPath(); ctx.arc(MX, cy2, 5, 0, Math.PI * 2); ctx.fillStyle = PINK; ctx.fill();
      noGlow(ctx);
      ctx.beginPath(); ctx.arc(MX, cy2, pr + 4, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,45,120,${.25 + .15 * Math.sin(t * .003)})`;
      ctx.lineWidth = 1; ctx.stroke();

      /* ── arms ── */
      glow(ctx, PINK, isAct ? 10 : 5);
      drawLimb(ctx, j.LS, j.LE, 9, HLIMB);
      drawLimb(ctx, j.LE, j.LW, 8, HLIMB);
      drawLimb(ctx, j.RS, j.RE, 9, HLIMB);
      drawLimb(ctx, j.RE, j.RW, 8, HLIMB);
      drawLimb(ctx, j.LS, j.LE, 1.8, "rgba(255,45,120,.42)");
      drawLimb(ctx, j.LE, j.LW, 1.8, "rgba(255,45,120,.38)");
      drawLimb(ctx, j.RS, j.RE, 1.8, "rgba(255,45,120,.52)");
      drawLimb(ctx, j.RE, j.RW, 1.8, "rgba(255,45,120,.48)");
      noGlow(ctx);
      drawJoint(ctx, j.LE, 5.5, PINK, 9);
      drawJoint(ctx, j.RE, 5.5, PINK, 9);
      /* hands */
      const hcol = id === "scanning" ? CYAN : PINK;
      glow(ctx, hcol, 22);
      drawJoint(ctx, j.LW, 6.5, hcol, 16);
      drawJoint(ctx, j.RW, 6.5, hcol, 16);
      noGlow(ctx);
      /* shoulder joints */
      drawJoint(ctx, j.LS, 7, PINK, 12);
      drawJoint(ctx, j.RS, 7, PINK, 12);

      /* ── head – hexagon ── */
      const HR = 30;
      glow(ctx, PINK, 18);
      hexPath(ctx, j.H.x, j.H.y, HR, Math.PI / 6);
      ctx.fillStyle = BODY;
      ctx.fill();
      ctx.strokeStyle = PINK;
      ctx.lineWidth = 2;
      ctx.stroke();
      noGlow(ctx);
      hexPath(ctx, j.H.x, j.H.y, HR * .62, Math.PI / 6);
      ctx.strokeStyle = "rgba(255,45,120,.28)";
      ctx.lineWidth = 1;
      ctx.stroke();
      /* eyes */
      const isScan = id === "scanning";
      const eCol   = isScan ? CYAN : PINK;
      const ePulse = .65 + .35 * Math.sin(t * (isScan ? .009 : .004));
      glow(ctx, eCol, isScan ? 24 : 12);
      [-10, 10].forEach(dx => {
        ctx.beginPath();
        ctx.arc(j.H.x + dx, j.H.y + 2, 4 * ePulse, 0, Math.PI * 2);
        ctx.fillStyle = eCol;
        ctx.fill();
      });
      noGlow(ctx);
      /* mouth / status bar */
      ctx.beginPath();
      ctx.moveTo(j.H.x - 9, j.H.y + 11);
      ctx.lineTo(j.H.x + 9, j.H.y + 11);
      ctx.strokeStyle = "rgba(255,45,120,.5)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      /* ── neck ── */
      ctx.fillStyle = BODY;
      ctx.fillRect(j.H.x - 6, j.H.y + HR * .85, 12, j.NB.y - j.H.y - HR * .85);
      ctx.strokeStyle = "rgba(255,45,120,.2)";
      ctx.lineWidth = 1;
      ctx.strokeRect(j.H.x - 6, j.H.y + HR * .85, 12, j.NB.y - j.H.y - HR * .85);
    }

    /* ─── draw the resume document ────────── */
    function drawResume(ctx, act, t) {
      const { x, y, w, h, rot } = DOC;
      const cx = x + w / 2, cy = y + h / 2;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.translate(-cx, -cy);

      /* paper shadow */
      ctx.shadowColor   = "rgba(0,0,0,.55)";
      ctx.shadowBlur    = 22;
      ctx.shadowOffsetY = 9;
      ctx.fillStyle = "#f4f4f4";
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 4);
      ctx.fill();
      ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;

      /* pink header */
      ctx.fillStyle = PINK;
      ctx.fillRect(x, y, w, 34);

      /* header placeholders */
      ctx.fillStyle = "rgba(255,255,255,.92)";
      ctx.fillRect(x + 10, y + 8, 85, 8);
      ctx.fillStyle = "rgba(255,255,255,.55)";
      ctx.fillRect(x + 10, y + 20, 55, 5);

      /* photo box */
      ctx.fillStyle = "rgba(255,45,120,.22)";
      ctx.fillRect(x + w - 50, y + 4, 36, 46);
      ctx.strokeStyle = "rgba(255,45,120,.6)";
      ctx.lineWidth = 1; ctx.strokeRect(x + w - 50, y + 4, 36, 46);

      /* content lines — alpha driven by activity */
      const { id, t: at } = act;
      const base = id === "erasing"
        ? Math.max(.1, 1 - at * 1.4)
        : id === "writing"
        ? Math.min(.95, .15 + at * 1.3)
        : .92;

      const sections = [
        /* section A */
        [{ lx: x+10,  ly: y+44, lw: 62, lh: 5,  col: [255,45,120] }],
        [{ lx: x+10,  ly: y+56, lw: w-66, lh: 4, col: [55,55,80]  },
         { lx: x+10,  ly: y+66, lw: w-85, lh: 4, col: [55,55,80]  },
         { lx: x+10,  ly: y+76, lw: w-72, lh: 4, col: [55,55,80]  }],
        /* divider */
        [{ lx: x+10,  ly: y+88, lw: w-20, lh: 1,  col: [255,45,120], alpha: .28 }],
        /* section B */
        [{ lx: x+10,  ly: y+96,  lw: 70, lh: 5,  col: [255,45,120] }],
        [{ lx: x+10,  ly: y+108, lw: w-68, lh: 4, col: [55,55,80]  },
         { lx: x+10,  ly: y+118, lw: w-88, lh: 4, col: [55,55,80]  }],
        /* section C */
        [{ lx: x+10,  ly: y+132, lw: 55, lh: 5,  col: [255,45,120] }],
        [{ lx: x+10,  ly: y+144, lw: w-68, lh: 4, col: [55,55,80]  },
         { lx: x+10,  ly: y+154, lw: w-92, lh: 4, col: [55,55,80]  },
         { lx: x+10,  ly: y+164, lw: w-78, lh: 4, col: [55,55,80]  }],
        /* skill tags */
        [{ lx: x+10,  ly: y+180, lw: 42, lh: 14, col: [255,45,120], alpha: .22, radius: 7 },
         { lx: x+60,  ly: y+180, lw: 52, lh: 14, col: [255,45,120], alpha: .18, radius: 7 },
         { lx: x+120, ly: y+180, lw: 46, lh: 14, col: [255,45,120], alpha: .18, radius: 7 }],
      ];

      sections.forEach((group, gi) => {
        group.forEach(l => {
          const a = (l.alpha !== undefined ? l.alpha : base) *
                    (1 - gi * .04); // slight stagger
          const [r, g, b] = l.col;
          ctx.fillStyle = `rgba(${r},${g},${b},${Math.max(0, Math.min(1, a))})`;
          if (l.radius) {
            ctx.beginPath();
            ctx.roundRect(l.lx, l.ly, l.lw, l.lh, l.radius);
            ctx.fill();
          } else {
            ctx.fillRect(l.lx, l.ly, l.lw, l.lh);
          }
        });
      });

      /* writing cursor blink */
      if (id === "writing") {
        const cx2 = x + 10 + Math.abs(Math.sin(at * Math.PI * 10)) * (w - 76);
        const cy2 = y + 58 + Math.floor(at * 3) * 20;
        glow(ctx, PINK, 10);
        ctx.beginPath();
        ctx.moveTo(cx2, cy2);
        ctx.lineTo(cx2, cy2 + 7);
        ctx.strokeStyle = PINK;
        ctx.lineWidth = 2;
        ctx.stroke();
        noGlow(ctx);
      }

      /* arranging highlight sweep */
      if (id === "arranging") {
        const hy = y + 44 + Math.sin(at * Math.PI * 2) * 80;
        ctx.fillStyle = "rgba(255,45,120,.07)";
        ctx.fillRect(x, hy, w, 20);
      }

      ctx.restore();
    }

    /* ─── extra effects ──────────────────── */
    function drawFX(ctx, act, joints, now) {
      const { id, t: at } = act;
      const { RW } = joints;

      /* ERASING sparks */
      if (id === "erasing" && now - lastSpark > 70) {
        sparks.push({
          x: DOC.x + 50 + Math.random() * (DOC.w - 100),
          y: DOC.y + 35,
          vx: (Math.random() - .5) * 4.5,
          vy: -2.5 - Math.random() * 3,
          life: 1,
          size: 2 + Math.random() * 3,
        });
        lastSpark = now;
      }
      sparks.forEach(s => {
        s.x += s.vx; s.y += s.vy; s.vy += .18; s.life -= .045;
        if (s.life <= 0) return;
        glow(ctx, PINK, 8);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,45,120,${s.life})`;
        ctx.fill();
        noGlow(ctx);
      });
      for (let i = sparks.length - 1; i >= 0; i--)
        if (sparks[i].life <= 0) sparks.splice(i, 1);

      /* PLACING – floating card follows hand */
      if (id === "placing") {
        const cw = 56, ch = 36;
        glow(ctx, PINK, 12);
        ctx.fillStyle = "rgba(255,45,120,.14)";
        ctx.strokeStyle = PINK;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(RW.x - cw / 2, RW.y - ch / 2, cw, ch, 4);
        ctx.fill(); ctx.stroke();
        noGlow(ctx);
        ctx.fillStyle = "rgba(255,45,120,.55)";
        ctx.fillRect(RW.x - 18, RW.y - 10, 36, 3);
        ctx.fillStyle = "rgba(255,45,120,.32)";
        ctx.fillRect(RW.x - 18, RW.y - 3, 27, 3);
        ctx.fillRect(RW.x - 18, RW.y + 4, 21, 3);
      }

      /* SCANNING – cyan scan line + readout */
      if (id === "scanning") {
        const scanY = DOC.y + (DOC.h * .9) * ((now % 1400) / 1400);
        const a = .38 + .28 * Math.sin(now * .005);
        glow(ctx, CYAN, 12);
        ctx.beginPath();
        ctx.moveTo(DOC.x, scanY);
        ctx.lineTo(DOC.x + DOC.w, scanY);
        ctx.strokeStyle = `rgba(0,229,255,${a})`;
        ctx.lineWidth = 1.5; ctx.stroke();
        noGlow(ctx);
        const ra = Math.min(at * 2.2, 1);
        const METRICS = [
          { label: "MATCH: 78%",   col: CYAN },
          { label: "SKILLS: 8",    col: PINK },
          { label: "GAPS: 3",      col: "#ffaa00" },
          { label: "Q GEN: 5",     col: PINK },
        ];
        METRICS.forEach((m, i) => {
          ctx.fillStyle = m.col.replace(")", `,${ra * (.9 - i * .1)})`).replace("rgb", "rgba").replace("##", "rgba(") ||
                          `rgba(255,45,120,${ra * (.9 - i * .1)})`;
          ctx.fillStyle = m.col;
          ctx.globalAlpha = ra * (.95 - i * .1);
          ctx.font = `700 10px "Orbitron", monospace`;
          ctx.fillText(m.label, DOC.x + DOC.w + 10, DOC.y + 52 + i * 20);
        });
        ctx.globalAlpha = 1;
      }

      /* ambient floating particles */
      ambient.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 10 || n.x > 425) n.vx *= -1;
        if (n.y < 8  || n.y > 85)  n.vy *= -1;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,45,120,.22)";
        ctx.fill();
      });
      for (let i = 0; i < ambient.length; i++) {
        for (let j = i + 1; j < ambient.length; j++) {
          const dx = ambient[i].x - ambient[j].x;
          const dy = ambient[i].y - ambient[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < 85) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255,45,120,${(1 - d / 85) * .13})`;
            ctx.lineWidth = .8;
            ctx.moveTo(ambient[i].x, ambient[i].y);
            ctx.lineTo(ambient[j].x, ambient[j].y);
            ctx.stroke();
          }
        }
      }

      /* activity label at bottom */
      const LABELS = {
        writing:   "GENERATING CONTENT",
        erasing:   "REFINING & OPTIMIZING",
        placing:   "INSERTING ELEMENTS",
        arranging: "ORGANIZING LAYOUT",
        scanning:  "AI SCANNING RESUME",
      };
      const la = .55 + .35 * Math.sin(now * .004);
      ctx.fillStyle = `rgba(255,45,120,${la})`;
      ctx.font = `700 8.5px "Orbitron", monospace`;
      ctx.textAlign = "center";
      ctx.fillText(LABELS[id] || "", 218, 432);
      ctx.textAlign = "left";
    }

    function drawBg(ctx) {
      ctx.clearRect(0, 0, 440, 445);
      ctx.strokeStyle = "rgba(255,45,120,.04)";
      ctx.lineWidth   = 1;
      for (let x = 0; x < 440; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 445); ctx.stroke();
      }
      for (let y = 0; y < 445; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(440, y); ctx.stroke();
      }
      /* ground line below feet */
      glow(ctx, PINK, 8);
      ctx.beginPath();
      ctx.moveTo(110, 404); ctx.lineTo(326, 404);
      ctx.strokeStyle = "rgba(255,45,120,.45)";
      ctx.lineWidth = 1.5; ctx.stroke();
      noGlow(ctx);
    }

    function frame(now) {
      const elapsed = now - start;
      const act     = getAct(elapsed);
      const joints  = getJoints(act);
      drawBg(ctx);
      drawResume(ctx, act, elapsed);
      drawFX(ctx, act, joints, elapsed);
      drawMan(ctx, joints, act, elapsed);
      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={ref}
      width={440}
      height={445}
      style={{ width: "100%", maxWidth: 440, display: "block" }}
    />
  );
}

/* ══════════════════════════════════════
   SMALL SHARED COMPONENTS
══════════════════════════════════════ */
function GlowDot({ color = PINK, size = 8 }) {
  return (
    <span style={{
      display: "inline-block", width: size, height: size, borderRadius: "50%",
      background: color, boxShadow: `0 0 8px ${color}, 0 0 20px ${color}`,
      flexShrink: 0,
    }} />
  );
}

function Tag({ children }) {
  return (
    <span style={{
      fontFamily: "'Orbitron', monospace", fontSize: 9, letterSpacing: ".18em",
      color: PINK, border: `1px solid rgba(255,45,120,.35)`,
      borderRadius: 30, padding: "3px 10px",
      background: "rgba(255,45,120,.06)",
    }}>{children}</span>
  );
}

function FeatureCard({ icon, title, desc, delay = 0 }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "rgba(255,45,120,.07)" : "#0d0d0d",
        border: `1px solid ${hov ? "rgba(255,45,120,.45)" : "rgba(255,255,255,.05)"}`,
        borderRadius: 16, padding: "28px 24px",
        transition: "all .3s ease",
        boxShadow: hov ? `0 0 30px rgba(255,45,120,.1)` : "none",
        animation: `fadeUp .6s ease both`,
        animationDelay: `${delay}s`,
        cursor: "default",
      }}
    >
      <div style={{ fontSize: 32, marginBottom: 14 }}>{icon}</div>
      <h3 style={{
        fontFamily: "'Orbitron', monospace", fontSize: 12, fontWeight: 700,
        color: PINK, letterSpacing: ".15em", margin: "0 0 10px",
        textTransform: "uppercase",
      }}>{title}</h3>
      <p style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, color: "#777",
        margin: 0, lineHeight: 1.75,
      }}>{desc}</p>
    </div>
  );
}

function StatPill({ value, label }) {
  return (
    <div style={{ textAlign: "center", padding: "0 20px" }}>
      <div style={{
        fontFamily: "'Orbitron', monospace", fontSize: 32, fontWeight: 900,
        color: PINK, textShadow: `0 0 24px ${PINK}`,
        lineHeight: 1,
      }}>{value}</div>
      <div style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#555",
        marginTop: 6, letterSpacing: ".04em",
      }}>{label}</div>
    </div>
  );
}

function StepBadge({ n, label, desc, last }) {
  return (
    <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          border: `2px solid ${PINK}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Orbitron', monospace", fontSize: 14, fontWeight: 900,
          color: PINK, boxShadow: `0 0 16px rgba(255,45,120,.35)`,
          background: "rgba(255,45,120,.08)",
        }}>{n}</div>
        {!last && <div style={{ width: 1, flex: 1, minHeight: 40, background: "rgba(255,45,120,.2)", margin: "6px 0" }} />}
      </div>
      <div style={{ paddingTop: 8, paddingBottom: last ? 0 : 28 }}>
        <div style={{
          fontFamily: "'Orbitron', monospace", fontSize: 12, fontWeight: 700,
          color: "#e8e8e8", letterSpacing: ".1em", marginBottom: 6,
        }}>{label}</div>
        <p style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#666", margin: 0, lineHeight: 1.7 }}>{desc}</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   MAIN HOMEPAGE
══════════════════════════════════════ */
export default function HomePage() {
  /* subtle parallax on hero text */
  const [my, setMy] = useState(0);
  useEffect(() => {
    const onMove = e => setMy(e.clientY / window.innerHeight - .5);
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: #080808; color: white; overflow-x: hidden; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-12px); }
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: .5; transform: scale(1.5); }
        }
        @keyframes spinSlow { to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: ${PINK}; border-radius: 4px; }
      `}</style>

      {/* ── scanlines ── */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9000,
        background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.025) 2px,rgba(0,0,0,.025) 4px)",
      }} />

      {/* ════════ NAV ════════ */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        borderBottom: "1px solid rgba(255,45,120,.1)",
        background: "rgba(8,8,8,.92)",
        backdropFilter: "blur(14px)",
      }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 28px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <GlowDot />
            <span style={{
              fontFamily: "'Orbitron', monospace", fontSize: 13, fontWeight: 900,
              color: "white", letterSpacing: ".12em",
            }}>INTERVUE<span style={{ color: PINK }}>AI</span></span>
          </div>
          <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
            {["Features", "How it Works", "Results"].map(l => (
              <span key={l} style={{
                fontFamily: "'DM Sans'", fontSize: 13, color: "#555",
                cursor: "pointer", transition: "color .2s",
              }}
                onMouseEnter={e => e.target.style.color = PINK}
                onMouseLeave={e => e.target.style.color = "#555"}
              >{l}</span>
            ))}
            <a href="/analyze" style={{
              fontFamily: "'Orbitron', monospace", fontSize: 10, fontWeight: 700,
              letterSpacing: ".15em", color: "white", textDecoration: "none",
              background: `linear-gradient(135deg, ${PINK}, ${PINK2})`,
              padding: "9px 18px", borderRadius: 8,
              boxShadow: `0 0 20px rgba(255,45,120,.35)`,
            }}>ANALYZE NOW</a>
          </div>
        </div>
      </nav>

      {/* ════════ HERO ════════ */}
      <section style={{
        maxWidth: 1100, margin: "0 auto",
        padding: "80px 28px 60px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 40,
        alignItems: "center",
        minHeight: "88vh",
      }}>
        {/* LEFT – copy */}
        <div style={{ transform: `translateY(${my * 14}px)`, transition: "transform .1s linear" }}>
          {/* pill tag */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28,
            background: "rgba(255,45,120,.08)", border: "1px solid rgba(255,45,120,.3)",
            borderRadius: 40, padding: "6px 16px",
            animation: "fadeUp .5s ease both",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: PINK, animation: "pulseDot 1.8s ease-in-out infinite" }} />
            <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 9, letterSpacing: ".2em", color: PINK }}>
              AI-POWERED INTERVIEW COACHING
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: "clamp(30px, 4vw, 56px)",
            fontWeight: 900, lineHeight: 1.08,
            margin: "0 0 20px",
            animation: "fadeUp .6s .1s ease both",
          }}>
            <span style={{
              background: `linear-gradient(135deg, #fff 0%, ${PINK} 55%, ${PINK2} 100%)`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              YOUR AI<br />INTERVIEW<br />COACH
            </span>
          </h1>

          <p style={{
            fontFamily: "'DM Sans'", fontSize: 15, color: "#666",
            lineHeight: 1.8, maxWidth: 420, marginBottom: 36,
            animation: "fadeUp .6s .2s ease both",
          }}>
            Upload your resume, paste the job description and get an instant
            <span style={{ color: PINK }}> match score</span>, personalized technical &amp; behavioral
            questions, skill gap analysis and a <span style={{ color: PINK }}>7-day prep plan</span> —
            all generated by AI in seconds.
          </p>

          {/* CTA row */}
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", animation: "fadeUp .6s .3s ease both" }}>
            <a href="/analyze" style={{
              fontFamily: "'Orbitron', monospace", fontSize: 11, fontWeight: 700,
              letterSpacing: ".18em", color: "white", textDecoration: "none",
              background: `linear-gradient(135deg, ${PINK}, ${PINK2})`,
              padding: "16px 30px", borderRadius: 10,
              boxShadow: `0 0 36px rgba(255,45,120,.45), 0 4px 20px rgba(255,45,120,.3)`,
              display: "inline-block",
            }}>ANALYZE MY RESUME →</a>
            <button style={{
              fontFamily: "'Orbitron', monospace", fontSize: 10, fontWeight: 600,
              letterSpacing: ".12em", color: "#666",
              background: "none", border: "1px solid rgba(255,255,255,.08)",
              padding: "16px 24px", borderRadius: 10, cursor: "pointer",
            }}>WATCH DEMO</button>
          </div>

          {/* trust row */}
          <div style={{
            display: "flex", gap: 20, marginTop: 44, flexWrap: "wrap",
            animation: "fadeUp .6s .4s ease both",
          }}>
            {[["✓ Free to use", "#555"], ["✓ Instant results", "#555"], ["✓ AI-personalized", PINK]].map(([t, c]) => (
              <span key={t} style={{ fontFamily: "'DM Sans'", fontSize: 12, color: c }}>{t}</span>
            ))}
          </div>
        </div>

        {/* RIGHT – mannequin canvas */}
        <div style={{
          display: "flex", justifyContent: "center", alignItems: "center",
          position: "relative", animation: "floatY 6s ease-in-out infinite",
        }}>
          {/* glow halo behind canvas */}
          <div style={{
            position: "absolute", inset: "10%",
            background: `radial-gradient(ellipse, rgba(255,45,120,.09) 0%, transparent 70%)`,
            pointerEvents: "none",
          }} />
          <div style={{
            position: "relative", borderRadius: 20,
            border: "1px solid rgba(255,45,120,.12)",
            background: "#0a0a0a",
            overflow: "hidden",
            boxShadow: `0 0 60px rgba(255,45,120,.07), 0 20px 60px rgba(0,0,0,.5)`,
          }}>
            {/* top bar */}
            <div style={{
              padding: "10px 16px", borderBottom: "1px solid rgba(255,45,120,.1)",
              display: "flex", alignItems: "center", gap: 7,
            }}>
              {[PINK, "#ffaa00", "#00e5a0"].map((c, i) => (
                <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: c, opacity: .7 }} />
              ))}
              <span style={{
                fontFamily: "'Orbitron', monospace", fontSize: 8.5,
                letterSpacing: ".18em", color: "#333", marginLeft: 8,
              }}>AI RESUME ENGINEER — ACTIVE</span>
              <div style={{ marginLeft: "auto", display: "flex", gap: 5, alignItems: "center" }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#00e5a0", animation: "pulseDot 1.4s ease-in-out infinite" }} />
                <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 7.5, color: "#00e5a0", letterSpacing: ".1em" }}>LIVE</span>
              </div>
            </div>
            <MannequinCanvas />
          </div>
        </div>
      </section>

      {/* ════════ STATS STRIP ════════ */}
      <section style={{
        borderTop: "1px solid rgba(255,45,120,.1)",
        borderBottom: "1px solid rgba(255,45,120,.1)",
        background: "rgba(255,45,120,.03)",
      }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto", padding: "36px 28px",
          display: "flex", justifyContent: "space-around",
          alignItems: "center", flexWrap: "wrap", gap: 24,
        }}>
          <StatPill value="78%"  label="Average Match Score" />
          <div style={{ width: 1, height: 40, background: "rgba(255,45,120,.15)" }} />
          <StatPill value="5+"   label="Technical Questions Generated" />
          <div style={{ width: 1, height: 40, background: "rgba(255,45,120,.15)" }} />
          <StatPill value="3"    label="Behavioral Scenarios" />
          <div style={{ width: 1, height: 40, background: "rgba(255,45,120,.15)" }} />
          <StatPill value="7"    label="Day Personalized Prep Plan" />
          <div style={{ width: 1, height: 40, background: "rgba(255,45,120,.15)" }} />
          <StatPill value="∞"    label="Resumes Analyzed" />
        </div>
      </section>

      {/* ════════ FEATURES ════════ */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "90px 28px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <GlowDot />
            <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 10, letterSpacing: ".25em", color: PINK }}>
              WHAT WE GENERATE
            </span>
            <GlowDot />
          </div>
          <h2 style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: "clamp(22px, 3vw, 38px)",
            fontWeight: 900, color: "white", lineHeight: 1.2, marginBottom: 14,
          }}>
            Everything You Need to<br />
            <span style={{ color: PINK }}>Ace the Interview</span>
          </h2>
          <p style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#555", maxWidth: 480, margin: "0 auto" }}>
            Our AI reads your actual resume and the job description together to produce a fully personalized report — not generic advice.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 18,
        }}>
          <FeatureCard delay={0}    icon="🎯" title="Match Score"
            desc="Instantly see a 0–100 score showing how well your profile aligns with the job requirements, broken down into Technical Fit, Experience Fit and Skills Match." />
          <FeatureCard delay={0.07} icon="💻" title="Technical Questions"
            desc="AI generates 5 role-specific technical interview questions complete with model answers and the interviewer's hidden intention — so you know exactly what they're testing." />
          <FeatureCard delay={0.14} icon="💬" title="Behavioral Scenarios"
            desc="3 STAR-method behavioral questions crafted around your actual projects and experience, with suggested answers you can adapt to your own story." />
          <FeatureCard delay={0.21} icon="📊" title="Skill Gap Analysis"
            desc="We map your resume against the job requirements and flag each missing skill with a severity level — High, Medium or Low — so you know what to prioritize." />
          <FeatureCard delay={0.28} icon="📅" title="7-Day Prep Plan"
            desc="A structured, day-by-day study plan that covers your exact gaps — React hooks, AWS, testing frameworks and more — tailored to your profile and the role." />
          <FeatureCard delay={0.35} icon="📄" title="Resume Intelligence"
            desc="The AI reads your actual resume text, not just keywords. It understands your projects, tech stack and experience level to personalize every single output." />
        </div>
      </section>

      {/* ════════ HOW IT WORKS ════════ */}
      <section style={{ background: "rgba(255,45,120,.03)", borderTop: "1px solid rgba(255,45,120,.08)", borderBottom: "1px solid rgba(255,45,120,.08)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "90px 28px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          {/* left */}
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <GlowDot />
              <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 10, letterSpacing: ".25em", color: PINK }}>HOW IT WORKS</span>
            </div>
            <h2 style={{
              fontFamily: "'Orbitron', monospace", fontSize: "clamp(20px, 2.5vw, 34px)",
              fontWeight: 900, color: "white", lineHeight: 1.2, marginBottom: 44,
            }}>Three Steps to<br /><span style={{ color: PINK }}>Interview Ready</span></h2>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <StepBadge n="01" label="Upload Your Resume + Job Description"
                desc="Paste the job description and upload your resume (PDF or DOCX). Add a brief self-description to help the AI understand your goals." />
              <StepBadge n="02" label="AI Analyzes Everything"
                desc="Our AI reads both documents together, calculates your match score, identifies skill gaps and crafts personalized questions in seconds." />
              <StepBadge n="03" label="Prepare and Ace It" last
                desc="Work through your custom Q&A, close your skill gaps with the 7-day plan, and walk into the interview confident and prepared." />
            </div>
          </div>

          {/* right – visual highlight boxes */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { label: "resume.pdf uploaded",        col: "#00e5a0", icon: "📄" },
              { label: "Job description parsed",     col: PINK,      icon: "📋" },
              { label: "Match score: 78%",           col: PINK,      icon: "🎯" },
              { label: "5 questions generated",      col: PINK2,     icon: "❓" },
              { label: "3 skill gaps identified",    col: "#ffaa00", icon: "📊" },
              { label: "7-day plan ready",           col: "#00e5a0", icon: "✅" },
            ].map((item, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 14,
                background: "#0d0d0d",
                border: `1px solid rgba(255,255,255,.05)`,
                borderLeft: `3px solid ${item.col}`,
                borderRadius: "0 10px 10px 0",
                padding: "14px 18px",
                animation: `fadeUp .5s ease both`,
                animationDelay: `${i * .08}s`,
              }}>
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 10.5, color: item.col, letterSpacing: ".1em" }}>{item.label}</span>
                <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: item.col, opacity: .7 }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ WHAT THE AI DOES (activity showcase) ════════ */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "90px 28px" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <GlowDot />
            <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 10, letterSpacing: ".25em", color: PINK }}>AI IN ACTION</span>
            <GlowDot />
          </div>
          <h2 style={{
            fontFamily: "'Orbitron', monospace", fontSize: "clamp(20px, 2.5vw, 34px)",
            fontWeight: 900, color: "white", lineHeight: 1.2,
          }}>
            Watch the AI <span style={{ color: PINK }}>Work on Your Resume</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
          {[
            { icon: "✍️", act: "WRITING",   label: "Generates content tailored to you" },
            { icon: "🗑️", act: "ERASING",   label: "Removes weak or mismatched sections" },
            { icon: "📦", act: "PLACING",   label: "Inserts matching skill cards" },
            { icon: "📐", act: "ARRANGING", label: "Organizes sections for maximum impact" },
            { icon: "🔍", act: "SCANNING",  label: "Deep-scans for gaps and opportunities" },
          ].map((item, i) => (
            <div key={i} style={{
              background: "#0d0d0d",
              border: "1px solid rgba(255,45,120,.12)",
              borderRadius: 14, padding: "22px 18px", textAlign: "center",
              animation: `fadeUp .5s ${i * .08}s ease both`,
            }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{item.icon}</div>
              <div style={{
                fontFamily: "'Orbitron', monospace", fontSize: 9.5, fontWeight: 700,
                color: PINK, letterSpacing: ".15em", marginBottom: 8,
              }}>{item.act}</div>
              <p style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#666", margin: 0, lineHeight: 1.6 }}>
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════ CTA ════════ */}
      <section style={{
        maxWidth: 1100, margin: "0 auto 80px", padding: "0 28px",
      }}>
        <div style={{
          background: `radial-gradient(ellipse at 50% 0%, rgba(255,45,120,.14) 0%, #0d0d0d 70%)`,
          border: "1px solid rgba(255,45,120,.22)",
          borderRadius: 24, padding: "70px 40px",
          textAlign: "center", position: "relative", overflow: "hidden",
        }}>
          {/* top accent line */}
          <div style={{
            position: "absolute", top: 0, left: "20%", right: "20%", height: 2,
            background: `linear-gradient(to right, transparent, ${PINK}, transparent)`,
            boxShadow: `0 0 12px ${PINK}`,
          }} />
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <GlowDot />
            <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 10, letterSpacing: ".25em", color: PINK }}>READY TO START?</span>
            <GlowDot />
          </div>
          <h2 style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: "clamp(22px, 3.5vw, 44px)",
            fontWeight: 900, color: "white", lineHeight: 1.15, marginBottom: 18,
          }}>
            Nail Your Next Interview<br />
            <span style={{ color: PINK }}>with AI on Your Side</span>
          </h2>
          <p style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#666", marginBottom: 36, maxWidth: 440, margin: "0 auto 36px" }}>
            It's free, instant and fully personalized. Upload your resume now and walk into your interview prepared.
          </p>
          <a href="/analyze" style={{
            fontFamily: "'Orbitron', monospace", fontSize: 12, fontWeight: 700,
            letterSpacing: ".2em", color: "white", textDecoration: "none",
            background: `linear-gradient(135deg, ${PINK}, ${PINK2})`,
            padding: "18px 42px", borderRadius: 12, display: "inline-block",
            boxShadow: `0 0 40px rgba(255,45,120,.5), 0 6px 30px rgba(255,45,120,.3)`,
          }}>GENERATE MY REPORT →</a>
        </div>
      </section>

      {/* ════════ FOOTER ════════ */}
      <footer style={{ borderTop: "1px solid rgba(255,45,120,.1)", padding: "30px 28px" }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto",
          display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <GlowDot size={6} />
            <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 11, fontWeight: 900, color: "#333", letterSpacing: ".1em" }}>
              INTERVUE<span style={{ color: PINK }}>AI</span>
            </span>
          </div>
          <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#333" }}>
            Built for job seekers who prepare smarter.
          </span>
          <div style={{ display: "flex", gap: 16 }}>
            {["Privacy", "Terms", "Contact"].map(l => (
              <span key={l} style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#333", cursor: "pointer" }}>{l}</span>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}