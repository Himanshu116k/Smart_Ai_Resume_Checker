import React, { useEffect, useRef, useState } from "react";

const PINK  = "#ff2d78";
const PINK2 = "#ff88bb";
const CYAN  = "#00e5ff";

const lerp   = (a, b, t) => a + (b - a) * t;
const easeIO = t => t < .5 ? 2*t*t : -1+(4-2*t)*t;
const easePow = (t, p=3) => 1 - Math.pow(1-t, p);
const gl     = (ctx, col, blur) => { ctx.shadowColor = col; ctx.shadowBlur = blur; };
const ng     = ctx => { ctx.shadowBlur = 0; };

/* ══════════════════════════════════════════
   CUTE ROBOT CANVAS  (Eilik-style)
══════════════════════════════════════════ */
function CuteRobotCanvas() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx   = canvas.getContext("2d");
    let   raf;
    const t0    = performance.now();

    /* ── activity cycle ── */
    const CYCLE = 16000;
    const ACT   = [
      { id:"wave",     s:0,     e:3200  },
      { id:"writing",  s:3200,  e:6800  },
      { id:"erasing",  s:6800,  e:9400  },
      { id:"placing",  s:9400,  e:12200 },
      { id:"scanning", s:12200, e:16000 },
    ];

    /* ── resume doc ── */
    const DOC = { x:55, y:332, w:310, h:190 };

    /* ── sparks ── */
    const sparks = [];
    let lastSpark = 0;

    /* ── hearts / stars for wave ── */
    const hearts  = [];
    let lastHeart = 0;

    /* ── ambient dots ── */
    const dots = Array.from({length:10}, () => ({
      x: 30+Math.random()*380, y: 8+Math.random()*70,
      vx:(Math.random()-.5)*.45, vy:(Math.random()-.5)*.45,
      r:1.5+Math.random()*1.8,
    }));

    function getAct(now) {
      const ct = now % CYCLE;
      for (const a of ACT) if (ct >= a.s && ct < a.e)
        return { id:a.id, t:(ct-a.s)/(a.e-a.s), ct };
      return { id:"wave", t:0, ct:0 };
    }

    /* ═══════════════════════════════
       DRAW CUTE ROBOT
       CX,CY = center of body
    ═══════════════════════════════ */
    function drawRobot(ctx, act, now) {
      const { id, t: at } = act;
      const CX = 218;  // horizontal center

      /* ── gentle body bob ── */
      const bob   = Math.sin(now * 0.002) * 5;
      const tilt  = Math.sin(now * 0.0015) * 0.05; // slight head tilt

      /* body Y */
      const BY = 280 + bob;

      /* ── ARM angles ── */
      // right arm (from robot's perspective left = our right visually)
      let rArmRot = 0.3;   // default resting
      let lArmRot = -0.25; // left arm resting

      if (id === "wave") {
        const wave = Math.sin(at * Math.PI * 8) * 0.55;
        lArmRot = -1.1 - wave;            // left arm waves up
        rArmRot = 0.35;
      } else if (id === "writing") {
        const sweep = Math.sin(at * Math.PI * 10) * 0.4;
        rArmRot = 0.7 + sweep;
        lArmRot = -0.3;
      } else if (id === "erasing") {
        const sweep = Math.sin(at * Math.PI * 22) * 0.55;
        rArmRot = 0.55 + sweep;
        lArmRot = -0.3;
      } else if (id === "placing") {
        const go = easeIO(Math.min(at * 2, 1));
        rArmRot = lerp(0.3, 0.85, go);
        lArmRot = -0.3;
      } else if (id === "scanning") {
        rArmRot = lerp(0.3, -0.1, Math.sin(at * Math.PI));
        lArmRot = lerp(-0.25, 0.1, Math.sin(at * Math.PI));
      }

      /* ═══ BASE DISC ═══ */
      ctx.save();
      /* shadow under base */
      gl(ctx, "rgba(0,0,0,.55)", 28);
      ctx.beginPath();
      ctx.ellipse(CX, 405+bob*.3, 72, 14, 0, 0, Math.PI*2);
      ctx.fillStyle = "#181828";
      ctx.fill();
      ng(ctx);
      /* base top ring */
      gl(ctx, PINK, 8);
      ctx.beginPath();
      ctx.ellipse(CX, 400+bob*.3, 62, 11, 0, 0, Math.PI*2);
      ctx.fillStyle = "#1a1a30";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,45,120,.5)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ng(ctx);
      /* base glow line */
      ctx.beginPath();
      ctx.ellipse(CX, 400+bob*.3, 40, 5, 0, 0, Math.PI*2);
      ctx.fillStyle = "rgba(255,45,120,.15)";
      ctx.fill();
      ctx.restore();

      /* ═══ BODY ═══ */
      ctx.save();
      ctx.translate(CX, BY);
      /* body outer shadow */
      gl(ctx, "rgba(255,45,120,.18)", 22);
      /* body shape - egg: top narrower, bottom wider */
      ctx.beginPath();
      ctx.moveTo(-52, -55);
      ctx.bezierCurveTo(-58, -30, -68, 10, -64, 45);
      ctx.bezierCurveTo(-60, 75, 60, 75, 64, 45);
      ctx.bezierCurveTo(68, 10, 58, -30, 52, -55);
      ctx.closePath();
      /* body gradient */
      const bodyGrad = ctx.createRadialGradient(-18, -20, 5, 0, 0, 90);
      bodyGrad.addColorStop(0, "#2a2a44");
      bodyGrad.addColorStop(0.5, "#141426");
      bodyGrad.addColorStop(1, "#0e0e1e");
      ctx.fillStyle = bodyGrad;
      ctx.fill();
      ctx.strokeStyle = "rgba(255,45,120,.38)";
      ctx.lineWidth = 1.8;
      ctx.stroke();
      ng(ctx);

      /* body pink accent strip (like Eilik's teal drip) */
      ctx.beginPath();
      ctx.moveTo(-14, -52);
      ctx.bezierCurveTo(-14, -20, -10, 10, -12, 45);
      ctx.bezierCurveTo(-12, 55, 12, 55, 12, 45);
      ctx.bezierCurveTo(10, 10, 14, -20, 14, -52);
      ctx.closePath();
      const accentGrad = ctx.createLinearGradient(0, -52, 0, 55);
      accentGrad.addColorStop(0, "rgba(255,45,120,.6)");
      accentGrad.addColorStop(1, "rgba(255,45,120,.1)");
      ctx.fillStyle = accentGrad;
      ctx.fill();

      /* chest reactor glow */
      const pulse = .55 + .45 * Math.sin(now * .004);
      gl(ctx, PINK, 20*pulse);
      ctx.beginPath();
      ctx.arc(0, 8, 7, 0, Math.PI*2);
      ctx.fillStyle = `rgba(255,45,120,${.7+.3*pulse})`;
      ctx.fill();
      ng(ctx);
      /* outer reactor ring */
      ctx.beginPath();
      ctx.arc(0, 8, 12+3*pulse, 0, Math.PI*2);
      ctx.strokeStyle = `rgba(255,45,120,${.2*pulse})`;
      ctx.lineWidth = 2;
      ctx.stroke();
      /* small chest dot grid */
      [[-20,-10],[-20,5],[20,-10],[20,5]].forEach(([dx,dy])=>{
        ctx.beginPath();
        ctx.arc(dx, dy, 2, 0, Math.PI*2);
        ctx.fillStyle = `rgba(255,45,120,.3)`;
        ctx.fill();
      });

      ctx.restore(); // body

      /* ═══ ARMS ═══ */
      /* right arm (visually right = robot's left) */
      drawArm(ctx, CX, BY, rArmRot, 1, id, at, now);
      /* left arm (visually left = robot's right — the waving one) */
      drawArm(ctx, CX, BY, lArmRot, -1, id, at, now);

      /* ═══ HEAD ═══ */
      ctx.save();
      ctx.translate(CX, BY - 85);
      ctx.rotate(tilt);

      /* head outer glow */
      gl(ctx, "rgba(255,45,120,.2)", 28);
      /* head shape - big round circle */
      ctx.beginPath();
      ctx.arc(0, 0, 68, 0, Math.PI*2);
      const headGrad = ctx.createRadialGradient(-22, -20, 5, 0, 0, 75);
      headGrad.addColorStop(0, "#252540");
      headGrad.addColorStop(0.6, "#141428");
      headGrad.addColorStop(1, "#0e0e1e");
      ctx.fillStyle = headGrad;
      ctx.fill();
      ctx.strokeStyle = "rgba(255,45,120,.42)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ng(ctx);

      /* head pink top accent - like Eilik's teal crown */
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, 67, -Math.PI*.72, -Math.PI*.28);
      ctx.lineWidth = 9;
      gl(ctx, PINK, 14);
      ctx.strokeStyle = PINK;
      ctx.stroke();
      ng(ctx);
      ctx.restore();

      /* ── FACE VISOR (big oval black screen) ── */
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(0, 4, 50, 44, 0, 0, Math.PI*2);
      /* visor gradient */
      const vizGrad = ctx.createRadialGradient(-12, -8, 3, 0, 4, 55);
      vizGrad.addColorStop(0, "#0d0d1a");
      vizGrad.addColorStop(1, "#050508");
      ctx.fillStyle = vizGrad;
      ctx.fill();
      /* visor border glow */
      gl(ctx, PINK, 12);
      ctx.strokeStyle = "rgba(255,45,120,.55)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ng(ctx);
      /* visor inner glare */
      ctx.beginPath();
      ctx.ellipse(-14, -14, 16, 9, -0.5, 0, Math.PI*2);
      ctx.fillStyle = "rgba(255,255,255,.04)";
      ctx.fill();
      ctx.restore();

      /* ── EYES ── */
      const eyeCol  = id === "scanning" ? CYAN : PINK;
      const eyePulse= .7 + .3 * Math.sin(now * (id==="scanning"?.008:.004));
      const eyeBlur = id === "scanning" ? 22 : 14;
      const eyeH    = id === "wave" ? (6+3*Math.abs(Math.sin(at*Math.PI*8))) : 7; // squint when waving

      [-17, 17].forEach(ex => {
        /* eye glow shadow */
        gl(ctx, eyeCol, eyeBlur*eyePulse);
        /* eye shape - D-shaped like Eilik */
        ctx.beginPath();
        ctx.ellipse(ex, 2, 13, eyeH*eyePulse, 0, Math.PI, 0); // top half = flat, bottom = arc
        ctx.fillStyle = eyeCol;
        ctx.fill();
        /* inner bright highlight */
        ng(ctx);
        ctx.beginPath();
        ctx.ellipse(ex-3, -1, 4, 2.5, -0.4, 0, Math.PI*2);
        ctx.fillStyle = `rgba(255,255,255,.35)`;
        ctx.fill();
      });
      ng(ctx);

      /* ── blush cheeks (when waving / happy) ── */
      if (id === "wave") {
        const blushA = .35 * Math.sin(at * Math.PI);
        [-26, 26].forEach(bx => {
          ctx.beginPath();
          ctx.ellipse(bx, 18, 12, 6, 0, 0, Math.PI*2);
          ctx.fillStyle = `rgba(255,45,120,${blushA})`;
          ctx.fill();
        });
      }

      /* ── scanning mode: scan stripe across face ── */
      if (id === "scanning") {
        const sy = -44 + ((now%1800)/1800) * 96;
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(0, 4, 50, 44, 0, 0, Math.PI*2);
        ctx.clip();
        const sg = ctx.createLinearGradient(0, sy-10, 0, sy+10);
        sg.addColorStop(0, "rgba(0,229,255,0)");
        sg.addColorStop(0.5, "rgba(0,229,255,.18)");
        sg.addColorStop(1, "rgba(0,229,255,0)");
        ctx.fillStyle = sg;
        ctx.fillRect(-55, sy-10, 110, 20);
        ctx.restore();
      }

      ctx.restore(); // head
    }

    /* ─── ARM drawing helper ─────────────── */
    function drawArm(ctx, CX, BY, rot, side, id, at, now) {
      /* arm pivot is at shoulder */
      const px = CX + side * 58;
      const py = BY - 32;

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(rot);

      /* arm shadow glow */
      gl(ctx, "rgba(255,45,120,.2)", 14);

      /* upper arm */
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(side*12, 10, side*16, 35, side*10, 55);
      ctx.bezierCurveTo(side*4, 70, side*-8, 70, side*-14, 55);
      ctx.bezierCurveTo(side*-20, 40, side*-14, 12, 0, 0);
      ctx.closePath();
      const armGrad = ctx.createLinearGradient(-10, 0, 20, 60);
      armGrad.addColorStop(0, "#222240");
      armGrad.addColorStop(1, "#151528");
      ctx.fillStyle = armGrad;
      ctx.fill();
      ctx.strokeStyle = "rgba(255,45,120,.4)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ng(ctx);

      /* pink accent line on arm */
      ctx.beginPath();
      ctx.moveTo(side*2, 8);
      ctx.bezierCurveTo(side*5, 22, side*6, 42, side*2, 56);
      ctx.strokeStyle = "rgba(255,45,120,.5)";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.stroke();

      /* hand / tip glow dot */
      const handY = 62;
      const isActive = id !== "wave";
      const hcol = isActive ? PINK : PINK2;
      gl(ctx, hcol, 16);
      ctx.beginPath();
      ctx.arc(side*0, handY, 7.5, 0, Math.PI*2);
      ctx.fillStyle = hcol;
      ctx.fill();
      ng(ctx);

      ctx.restore();
    }

    /* ─── RESUME DOCUMENT ────────────────── */
    function drawResume(ctx, act, now) {
      const { x, y, w, h } = DOC;
      const { id, t: at } = act;
      const cx = x + w/2, cy = y + h/2;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-0.03);
      ctx.translate(-cx, -cy);

      /* paper shadow */
      ctx.shadowColor = "rgba(0,0,0,.6)";
      ctx.shadowBlur  = 20;
      ctx.shadowOffsetY = 8;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 6);
      ctx.fillStyle = "#f2f2f2";
      ctx.fill();
      ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;

      /* pink header bar */
      ctx.fillStyle = PINK;
      ctx.beginPath();
      ctx.roundRect(x, y, w, 32, [6,6,0,0]);
      ctx.fill();

      /* header name placeholder */
      ctx.fillStyle = "rgba(255,255,255,.92)";
      ctx.fillRect(x+10, y+8, 88, 8);
      ctx.fillStyle = "rgba(255,255,255,.55)";
      ctx.fillRect(x+10, y+20, 56, 5);

      /* avatar box */
      ctx.fillStyle = "rgba(255,45,120,.2)";
      ctx.beginPath();
      ctx.roundRect(x+w-52, y+3, 38, 48, 3);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,45,120,.5)";
      ctx.lineWidth = 1; ctx.stroke();

      /* content lines with activity alpha */
      const base = id === "erasing"   ? Math.max(.05, 1 - at*1.6)
                 : id === "writing"   ? Math.min(.92, .1 + at*1.4)
                 : .9;

      const rows = [
        { lx:x+10, ly:y+40, lw:58, lh:5, col:[255,45,120] },
        { lx:x+10, ly:y+52, lw:w-68, lh:4, col:[50,50,75] },
        { lx:x+10, ly:y+62, lw:w-90, lh:4, col:[50,50,75] },
        { lx:x+10, ly:y+72, lw:w-74, lh:4, col:[50,50,75] },
        { lx:x+10, ly:y+84, lw:w-18, lh:1, col:[255,45,120], a:.25 },
        { lx:x+10, ly:y+92, lw:65,   lh:5, col:[255,45,120] },
        { lx:x+10, ly:y+104, lw:w-68, lh:4, col:[50,50,75] },
        { lx:x+10, ly:y+114, lw:w-88, lh:4, col:[50,50,75] },
        { lx:x+10, ly:y+126, lw:52,   lh:5, col:[255,45,120] },
        { lx:x+10, ly:y+138, lw:w-68, lh:4, col:[50,50,75] },
        { lx:x+10, ly:y+148, lw:w-92, lh:4, col:[50,50,75] },
        { lx:x+10, ly:y+158, lw:w-78, lh:4, col:[50,50,75] },
      ];
      rows.forEach(r => {
        const alpha = r.a !== undefined ? r.a : base;
        const [ri,gi,bi] = r.col;
        ctx.fillStyle = `rgba(${ri},${gi},${bi},${Math.max(0,Math.min(1,alpha))})`;
        ctx.fillRect(r.lx, r.ly, r.lw, r.lh);
      });

      /* skill tags */
      [[x+10,y+172,40],[x+58,y+172,50],[x+116,y+172,44]].forEach(([tx,ty,tw])=>{
        ctx.beginPath();
        ctx.roundRect(tx, ty, tw, 13, 7);
        ctx.fillStyle = `rgba(255,45,120,${base*.22})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(255,45,120,${base*.35})`;
        ctx.lineWidth = 1; ctx.stroke();
      });

      /* writing cursor */
      if (id === "writing") {
        const curX = x+10 + Math.abs(Math.sin(at*Math.PI*10))*(w-78);
        const curY = y+52 + Math.floor(at*3)*20;
        gl(ctx, PINK, 10);
        ctx.beginPath();
        ctx.moveTo(curX, curY);
        ctx.lineTo(curX, curY+7);
        ctx.strokeStyle = PINK; ctx.lineWidth = 2; ctx.stroke();
        ng(ctx);
      }

      /* arranging sweep highlight */
      if (id === "arranging") {
        const hy = y+40 + Math.sin(at*Math.PI*2)*80;
        ctx.fillStyle = "rgba(255,45,120,.06)";
        ctx.fillRect(x, hy, w, 22);
      }

      ctx.restore();
    }

    /* ─── PARTICLE FX ────────────────────── */
    function drawFX(ctx, act, now) {
      const { id, t: at } = act;

      /* wave = floating hearts / stars */
      if (id === "wave" && now - lastHeart > 320) {
        hearts.push({
          x: 218 + (Math.random()-.5)*60,
          y: 140,
          vy: -1.4 - Math.random(),
          life: 1,
          size: 8 + Math.random()*8,
          type: Math.random() > .5 ? "heart" : "star",
        });
        lastHeart = now;
      }
      hearts.forEach(h => {
        h.y += h.vy; h.life -= .018; h.vy *= .995;
        if (h.life <= 0) return;
        ctx.globalAlpha = h.life * .8;
        gl(ctx, PINK, 10*h.life);
        ctx.fillStyle = PINK;
        ctx.font = `${h.size}px serif`;
        ctx.textAlign = "center";
        ctx.fillText(h.type === "heart" ? "♥" : "✦", h.x, h.y);
        ng(ctx);
        ctx.globalAlpha = 1;
      });
      ctx.textAlign = "left";
      for (let i = hearts.length-1; i >= 0; i--)
        if (hearts[i].life <= 0) hearts.splice(i, 1);

      /* erasing sparks */
      if (id === "erasing" && now - lastSpark > 60) {
        sparks.push({
          x: DOC.x + 55 + Math.random()*(DOC.w-110),
          y: DOC.y + 30,
          vx: (Math.random()-.5)*5,
          vy: -2 - Math.random()*3,
          life: 1, size: 2+Math.random()*3,
        });
        lastSpark = now;
      }
      sparks.forEach(s => {
        s.x+=s.vx; s.y+=s.vy; s.vy+=.2; s.life-=.05;
        if (s.life<=0) return;
        gl(ctx, PINK, 8);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size*s.life, 0, Math.PI*2);
        ctx.fillStyle = `rgba(255,45,120,${s.life})`;
        ctx.fill();
        ng(ctx);
      });
      for (let i = sparks.length-1; i >= 0; i--)
        if (sparks[i].life <= 0) sparks.splice(i, 1);

      /* scanning: cyan beam from robot to doc */
      if (id === "scanning") {
        const beamAlpha = .18 + .12*Math.sin(now*.007);
        const beamGrad  = ctx.createLinearGradient(218, 210, 218, DOC.y);
        beamGrad.addColorStop(0, `rgba(0,229,255,${beamAlpha})`);
        beamGrad.addColorStop(1, "rgba(0,229,255,0)");
        ctx.beginPath();
        ctx.moveTo(195, 215);
        ctx.lineTo(241, 215);
        ctx.lineTo(DOC.x+DOC.w, DOC.y);
        ctx.lineTo(DOC.x, DOC.y);
        ctx.closePath();
        ctx.fillStyle = beamGrad;
        ctx.fill();
        /* scan line sweep on doc */
        const sy = DOC.y + (DOC.h*.92)*((now%1600)/1600);
        const sg = ctx.createLinearGradient(0, sy-8, 0, sy+8);
        sg.addColorStop(0,"rgba(0,229,255,0)");
        sg.addColorStop(.5,`rgba(0,229,255,.28)`);
        sg.addColorStop(1,"rgba(0,229,255,0)");
        ctx.fillStyle = sg;
        ctx.fillRect(DOC.x, sy-8, DOC.w, 16);
        /* readout tags */
        const ra = Math.min(at*2.5, 1);
        [
          { label:"MATCH: 78%", col:CYAN },
          { label:"SKILLS: 8",  col:PINK },
          { label:"GAPS: 3",    col:"#ffaa00" },
        ].forEach((m, i) => {
          ctx.globalAlpha = ra*(.95-i*.12);
          gl(ctx, m.col, 8);
          ctx.fillStyle = m.col;
          ctx.font = `700 9px "Orbitron",monospace`;
          ctx.fillText(m.label, DOC.x+DOC.w+10, DOC.y+50+i*20);
          ng(ctx);
          ctx.globalAlpha = 1;
        });
      }

      /* placing: floating mini-card at arm tip */
      if (id === "placing") {
        /* approximate arm tip position */
        const tipX = 218 + 58;
        const tipY = (280 + Math.sin(now*.002)*5) - 32 + 62;
        const cw=50, ch=32;
        gl(ctx, PINK, 12);
        ctx.fillStyle="rgba(255,45,120,.12)";
        ctx.strokeStyle=PINK; ctx.lineWidth=1.5;
        ctx.beginPath();
        ctx.roundRect(tipX-cw/2, tipY-ch/2, cw, ch, 4);
        ctx.fill(); ctx.stroke();
        ng(ctx);
        ctx.fillStyle="rgba(255,45,120,.5)";
        ctx.fillRect(tipX-16, tipY-9, 32, 3);
        ctx.fillStyle="rgba(255,45,120,.28)";
        ctx.fillRect(tipX-16, tipY-2, 22, 3);
        ctx.fillRect(tipX-16, tipY+5, 26, 3);
      }

      /* ambient particles */
      dots.forEach(d => {
        d.x+=d.vx; d.y+=d.vy;
        if (d.x<8||d.x>432) d.vx*=-1;
        if (d.y<8||d.y>78)  d.vy*=-1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI*2);
        ctx.fillStyle="rgba(255,45,120,.2)";
        ctx.fill();
      });
      for (let i=0; i<dots.length; i++) for (let j=i+1; j<dots.length; j++) {
        const dx=dots[i].x-dots[j].x, dy=dots[i].y-dots[j].y;
        const dist=Math.sqrt(dx*dx+dy*dy);
        if (dist<90) {
          ctx.beginPath();
          ctx.strokeStyle=`rgba(255,45,120,${(1-dist/90)*.12})`;
          ctx.lineWidth=.8;
          ctx.moveTo(dots[i].x,dots[i].y);
          ctx.lineTo(dots[j].x,dots[j].y);
          ctx.stroke();
        }
      }

      /* activity label */
      const LABELS = {
        wave:"GREETING YOU ♥", writing:"WRITING CONTENT",
        erasing:"REFINING RESUME", placing:"INSERTING ELEMENTS",
        scanning:"AI SCANNING",
      };
      const la = .5 + .35*Math.sin(now*.004);
      ctx.fillStyle = `rgba(255,45,120,${la})`;
      ctx.font = `700 8.5px "Orbitron",monospace`;
      ctx.textAlign = "center";
      ctx.fillText(LABELS[id]||"", 218, 432);
      ctx.textAlign = "left";
    }

    /* ─── BACKGROUND GRID ─────────────────── */
    function drawBg(ctx) {
      ctx.clearRect(0, 0, 440, 445);
      ctx.strokeStyle = "rgba(255,45,120,.04)";
      ctx.lineWidth   = 1;
      for (let x=0; x<440; x+=40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,445); ctx.stroke(); }
      for (let y=0; y<445; y+=40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(440,y); ctx.stroke(); }
      /* ground glow */
      gl(ctx, PINK, 10);
      ctx.beginPath();
      ctx.moveTo(110, 413); ctx.lineTo(326, 413);
      ctx.strokeStyle = "rgba(255,45,120,.4)";
      ctx.lineWidth = 1.5; ctx.stroke();
      ng(ctx);
    }

    /* ─── MAIN LOOP ───────────────────────── */
    function frame(now) {
      const elapsed = now - t0;
      const act     = getAct(elapsed);
      drawBg(ctx);
      drawResume(ctx, act, elapsed);
      drawFX(ctx, act, elapsed);
      drawRobot(ctx, act, elapsed);
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas ref={ref} width={440} height={445}
      style={{ width:"100%", maxWidth:440, display:"block" }} />
  );
}

/* ══════════════════════════════════════════
   SHARED SMALL COMPONENTS
══════════════════════════════════════════ */
function GlowDot({ color=PINK, size=8 }) {
  return <span style={{
    display:"inline-block", width:size, height:size, borderRadius:"50%",
    background:color, boxShadow:`0 0 8px ${color}, 0 0 20px ${color}`, flexShrink:0,
  }} />;
}

function FeatureCard({ icon, title, desc, delay=0 }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{
      background: hov ? "rgba(255,45,120,.07)" : "#0d0d0d",
      border:`1px solid ${hov?"rgba(255,45,120,.45)":"rgba(255,255,255,.05)"}`,
      borderRadius:16, padding:"28px 24px",
      transition:"all .3s ease",
      boxShadow: hov ? "0 0 30px rgba(255,45,120,.1)" : "none",
      animation:`fadeUp .6s ease both`, animationDelay:`${delay}s`, cursor:"default",
    }}>
      <div style={{fontSize:32, marginBottom:14}}>{icon}</div>
      <h3 style={{fontFamily:"'Orbitron',monospace",fontSize:12,fontWeight:700,color:PINK,
        letterSpacing:".15em",margin:"0 0 10px",textTransform:"uppercase"}}>{title}</h3>
      <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13.5,color:"#777",margin:0,lineHeight:1.75}}>{desc}</p>
    </div>
  );
}

function StatPill({ value, label }) {
  return (
    <div style={{textAlign:"center",padding:"0 20px"}}>
      <div style={{fontFamily:"'Orbitron',monospace",fontSize:32,fontWeight:900,
        color:PINK,textShadow:`0 0 24px ${PINK}`,lineHeight:1}}>{value}</div>
      <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#555",marginTop:6}}>{label}</div>
    </div>
  );
}

function StepBadge({ n, label, desc, last }) {
  return (
    <div style={{display:"flex",gap:20,alignItems:"flex-start"}}>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0}}>
        <div style={{width:44,height:44,borderRadius:"50%",border:`2px solid ${PINK}`,
          display:"flex",alignItems:"center",justifyContent:"center",
          fontFamily:"'Orbitron',monospace",fontSize:14,fontWeight:900,color:PINK,
          boxShadow:"0 0 16px rgba(255,45,120,.35)",background:"rgba(255,45,120,.08)"}}>{n}</div>
        {!last && <div style={{width:1,flex:1,minHeight:40,background:"rgba(255,45,120,.2)",margin:"6px 0"}} />}
      </div>
      <div style={{paddingTop:8,paddingBottom:last?0:28}}>
        <div style={{fontFamily:"'Orbitron',monospace",fontSize:12,fontWeight:700,
          color:"#e8e8e8",letterSpacing:".1em",marginBottom:6}}>{label}</div>
        <p style={{fontFamily:"'DM Sans'",fontSize:13,color:"#666",margin:0,lineHeight:1.7}}>{desc}</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   HOMEPAGE
══════════════════════════════════════════ */
export default function HomePage() {
  const [my, setMy] = useState(0);
  useEffect(() => {
    const onMove = e => setMy(e.clientY/window.innerHeight-.5);
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=DM+Sans:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html,body{background:#080808;color:white;overflow-x:hidden;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        @keyframes pulseDot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.5)}}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:#0a0a0a}
        ::-webkit-scrollbar-thumb{background:${PINK};border-radius:4px}
      `}</style>

      {/* scanlines */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9000,
        background:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.025) 2px,rgba(0,0,0,.025) 4px)"}} />

      {/* ── NAV ── */}
      <nav style={{position:"sticky",top:0,zIndex:100,
        borderBottom:"1px solid rgba(255,45,120,.1)",
        background:"rgba(8,8,8,.92)",backdropFilter:"blur(14px)"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",
          justifyContent:"space-between",padding:"16px 28px"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <GlowDot />
            <span style={{fontFamily:"'Orbitron',monospace",fontSize:13,fontWeight:900,
              color:"white",letterSpacing:".12em"}}>
              INTERVUE<span style={{color:PINK}}>AI</span>
            </span>
          </div>
          <div style={{display:"flex",gap:28,alignItems:"center"}}>
            {["Features","How it Works","Results"].map(l=>(
              <span key={l} style={{fontFamily:"'DM Sans'",fontSize:13,color:"#555",cursor:"pointer",transition:"color .2s"}}
                onMouseEnter={e=>e.target.style.color=PINK}
                onMouseLeave={e=>e.target.style.color="#555"}>{l}</span>
            ))}
            <a href="/resume" style={{fontFamily:"'Orbitron',monospace",fontSize:10,fontWeight:700,
              letterSpacing:".15em",color:"white",textDecoration:"none",
              background:`linear-gradient(135deg,${PINK},${PINK2})`,
              padding:"9px 18px",borderRadius:8,
              boxShadow:"0 0 20px rgba(255,45,120,.35)"}}>ANALYZE NOW</a>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{maxWidth:1100,margin:"0 auto",padding:"80px 28px 60px",
        display:"grid",gridTemplateColumns:"1fr 1fr",gap:40,
        alignItems:"center",minHeight:"88vh"}}>

        {/* left copy */}
        <div style={{transform:`translateY(${my*14}px)`,transition:"transform .1s linear"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,marginBottom:28,
            background:"rgba(255,45,120,.08)",border:"1px solid rgba(255,45,120,.3)",
            borderRadius:40,padding:"6px 16px",animation:"fadeUp .5s ease both"}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:PINK,
              animation:"pulseDot 1.8s ease-in-out infinite"}} />
            <span style={{fontFamily:"'Orbitron',monospace",fontSize:9,letterSpacing:".2em",color:PINK}}>
              AI-POWERED INTERVIEW COACHING
            </span>
          </div>

          <h1 style={{fontFamily:"'Orbitron',monospace",
            fontSize:"clamp(30px,4vw,56px)",fontWeight:900,lineHeight:1.08,
            margin:"0 0 20px",animation:"fadeUp .6s .1s ease both"}}>
            <span style={{background:`linear-gradient(135deg,#fff 0%,${PINK} 55%,${PINK2} 100%)`,
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
              YOUR AI<br />INTERVIEW<br />COACH
            </span>
          </h1>

          <p style={{fontFamily:"'DM Sans'",fontSize:15,color:"#666",lineHeight:1.8,
            maxWidth:420,marginBottom:36,animation:"fadeUp .6s .2s ease both"}}>
            Upload your resume, paste the job description and get an instant
            <span style={{color:PINK}}> match score</span>, personalized technical &amp; behavioral
            questions, skill gap analysis and a <span style={{color:PINK}}>7-day prep plan</span> —
            all generated by AI in seconds.
          </p>

          <div style={{display:"flex",gap:14,flexWrap:"wrap",animation:"fadeUp .6s .3s ease both"}}>
            <a href="/analyze" style={{fontFamily:"'Orbitron',monospace",fontSize:11,fontWeight:700,
              letterSpacing:".18em",color:"white",textDecoration:"none",
              background:`linear-gradient(135deg,${PINK},${PINK2})`,
              padding:"16px 30px",borderRadius:10,display:"inline-block",
              boxShadow:"0 0 36px rgba(255,45,120,.45),0 4px 20px rgba(255,45,120,.3)"}}>
              ANALYZE MY RESUME →
            </a>
            <button style={{fontFamily:"'Orbitron',monospace",fontSize:10,fontWeight:600,
              letterSpacing:".12em",color:"#666",background:"none",
              border:"1px solid rgba(255,255,255,.08)",
              padding:"16px 24px",borderRadius:10,cursor:"pointer"}}>WATCH DEMO</button>
          </div>

          <div style={{display:"flex",gap:20,marginTop:44,flexWrap:"wrap",animation:"fadeUp .6s .4s ease both"}}>
            {[["✓ Free to use","#555"],["✓ Instant results","#555"],["✓ AI-personalized",PINK]].map(([t,c])=>(
              <span key={t} style={{fontFamily:"'DM Sans'",fontSize:12,color:c}}>{t}</span>
            ))}
          </div>
        </div>

        {/* right — cute robot */}
        <div style={{display:"flex",justifyContent:"center",alignItems:"center",
          position:"relative",animation:"floatY 5s ease-in-out infinite"}}>
          <div style={{position:"absolute",inset:"10%",
            background:"radial-gradient(ellipse,rgba(255,45,120,.1) 0%,transparent 70%)",
            pointerEvents:"none"}} />
          <div style={{position:"relative",borderRadius:20,
            border:"1px solid rgba(255,45,120,.14)",background:"#0a0a0a",
            overflow:"hidden",
            boxShadow:"0 0 60px rgba(255,45,120,.08),0 20px 60px rgba(0,0,0,.5)"}}>
            {/* terminal title bar */}
            <div style={{padding:"10px 16px",borderBottom:"1px solid rgba(255,45,120,.1)",
              display:"flex",alignItems:"center",gap:7}}>
              {[PINK,"#ffaa00","#00e5a0"].map((c,i)=>(
                <div key={i} style={{width:9,height:9,borderRadius:"50%",background:c,opacity:.7}} />
              ))}
              <span style={{fontFamily:"'Orbitron',monospace",fontSize:8.5,
                letterSpacing:".18em",color:"#333",marginLeft:8}}>AI RESUME ENGINEER — ACTIVE</span>
              <div style={{marginLeft:"auto",display:"flex",gap:5,alignItems:"center"}}>
                <div style={{width:5,height:5,borderRadius:"50%",background:"#00e5a0",
                  animation:"pulseDot 1.4s ease-in-out infinite"}} />
                <span style={{fontFamily:"'Orbitron',monospace",fontSize:7.5,color:"#00e5a0",letterSpacing:".1em"}}>LIVE</span>
              </div>
            </div>
            <CuteRobotCanvas />
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section style={{borderTop:"1px solid rgba(255,45,120,.1)",
        borderBottom:"1px solid rgba(255,45,120,.1)",background:"rgba(255,45,120,.03)"}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"36px 28px",
          display:"flex",justifyContent:"space-around",alignItems:"center",flexWrap:"wrap",gap:24}}>
          <StatPill value="78%"  label="Average Match Score" />
          <div style={{width:1,height:40,background:"rgba(255,45,120,.15)"}} />
          <StatPill value="5+"   label="Technical Questions Generated" />
          <div style={{width:1,height:40,background:"rgba(255,45,120,.15)"}} />
          <StatPill value="3"    label="Behavioral Scenarios" />
          <div style={{width:1,height:40,background:"rgba(255,45,120,.15)"}} />
          <StatPill value="7"    label="Day Personalized Prep Plan" />
          <div style={{width:1,height:40,background:"rgba(255,45,120,.15)"}} />
          <StatPill value="∞"    label="Resumes Analyzed" />
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{maxWidth:1100,margin:"0 auto",padding:"90px 28px"}}>
        <div style={{textAlign:"center",marginBottom:56}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:10,marginBottom:18}}>
            <GlowDot /><span style={{fontFamily:"'Orbitron',monospace",fontSize:10,letterSpacing:".25em",color:PINK}}>WHAT WE GENERATE</span><GlowDot />
          </div>
          <h2 style={{fontFamily:"'Orbitron',monospace",fontSize:"clamp(22px,3vw,38px)",
            fontWeight:900,color:"white",lineHeight:1.2,marginBottom:14}}>
            Everything You Need to<br /><span style={{color:PINK}}>Ace the Interview</span>
          </h2>
          <p style={{fontFamily:"'DM Sans'",fontSize:14,color:"#555",maxWidth:480,margin:"0 auto"}}>
            Our AI reads your actual resume and the job description together to produce a fully personalized report — not generic advice.
          </p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:18}}>
          <FeatureCard delay={0}    icon="🎯" title="Match Score"          desc="Instantly see a 0–100 score showing how well your profile aligns with the job requirements, broken down into Technical Fit, Experience Fit and Skills Match." />
          <FeatureCard delay={.07}  icon="💻" title="Technical Questions"  desc="AI generates 5 role-specific technical interview questions complete with model answers and the interviewer's hidden intention — so you know exactly what they're testing." />
          <FeatureCard delay={.14}  icon="💬" title="Behavioral Scenarios" desc="3 STAR-method behavioral questions crafted around your actual projects and experience, with suggested answers you can adapt to your own story." />
          <FeatureCard delay={.21}  icon="📊" title="Skill Gap Analysis"   desc="We map your resume against the job requirements and flag each missing skill with a severity level — High, Medium or Low — so you know what to prioritize." />
          <FeatureCard delay={.28}  icon="📅" title="7-Day Prep Plan"      desc="A structured, day-by-day study plan that covers your exact gaps — React hooks, AWS, testing frameworks and more — tailored to your profile and the role." />
          <FeatureCard delay={.35}  icon="📄" title="Resume Intelligence"  desc="The AI reads your actual resume text, not just keywords. It understands your projects, tech stack and experience level to personalize every single output." />
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{background:"rgba(255,45,120,.03)",borderTop:"1px solid rgba(255,45,120,.08)",borderBottom:"1px solid rgba(255,45,120,.08)"}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"90px 28px",
          display:"grid",gridTemplateColumns:"1fr 1fr",gap:80,alignItems:"center"}}>
          <div>
            <div style={{display:"inline-flex",alignItems:"center",gap:10,marginBottom:18}}>
              <GlowDot /><span style={{fontFamily:"'Orbitron',monospace",fontSize:10,letterSpacing:".25em",color:PINK}}>HOW IT WORKS</span>
            </div>
            <h2 style={{fontFamily:"'Orbitron',monospace",fontSize:"clamp(20px,2.5vw,34px)",
              fontWeight:900,color:"white",lineHeight:1.2,marginBottom:44}}>
              Three Steps to<br /><span style={{color:PINK}}>Interview Ready</span>
            </h2>
            <div style={{display:"flex",flexDirection:"column"}}>
              <StepBadge n="01" label="Upload Your Resume + Job Description"
                desc="Paste the job description and upload your resume (PDF or DOCX). Add a brief self-description to help the AI understand your goals." />
              <StepBadge n="02" label="AI Analyzes Everything"
                desc="Our AI reads both documents together, calculates your match score, identifies skill gaps and crafts personalized questions in seconds." />
              <StepBadge n="03" label="Prepare and Ace It" last
                desc="Work through your custom Q&A, close your skill gaps with the 7-day plan, and walk into the interview confident and prepared." />
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {[
              { label:"resume.pdf uploaded",      col:"#00e5a0", icon:"📄" },
              { label:"Job description parsed",   col:PINK,      icon:"📋" },
              { label:"Match score: 78%",         col:PINK,      icon:"🎯" },
              { label:"5 questions generated",    col:PINK2,     icon:"❓" },
              { label:"3 skill gaps identified",  col:"#ffaa00", icon:"📊" },
              { label:"7-day plan ready",         col:"#00e5a0", icon:"✅" },
            ].map((item,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:14,
                background:"#0d0d0d",border:"1px solid rgba(255,255,255,.05)",
                borderLeft:`3px solid ${item.col}`,borderRadius:"0 10px 10px 0",
                padding:"14px 18px",animation:`fadeUp .5s ease both`,
                animationDelay:`${i*.08}s`}}>
                <span style={{fontSize:18}}>{item.icon}</span>
                <span style={{fontFamily:"'Orbitron',monospace",fontSize:10.5,color:item.col,letterSpacing:".1em"}}>{item.label}</span>
                <div style={{marginLeft:"auto",width:6,height:6,borderRadius:"50%",background:item.col,opacity:.7}} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI IN ACTION ── */}
      <section style={{maxWidth:1100,margin:"0 auto",padding:"90px 28px"}}>
        <div style={{textAlign:"center",marginBottom:52}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:10,marginBottom:16}}>
            <GlowDot /><span style={{fontFamily:"'Orbitron',monospace",fontSize:10,letterSpacing:".25em",color:PINK}}>AI IN ACTION</span><GlowDot />
          </div>
          <h2 style={{fontFamily:"'Orbitron',monospace",fontSize:"clamp(20px,2.5vw,34px)",
            fontWeight:900,color:"white",lineHeight:1.2}}>
            Watch the AI <span style={{color:PINK}}>Work on Your Resume</span>
          </h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:14}}>
          {[
            { icon:"👋", act:"WAVING",   label:"Greets you and gets ready to work" },
            { icon:"✍️", act:"WRITING",  label:"Generates content tailored to you" },
            { icon:"🗑️", act:"ERASING",  label:"Removes weak or mismatched sections" },
            { icon:"📦", act:"PLACING",  label:"Inserts matching skill cards" },
            { icon:"🔍", act:"SCANNING", label:"Deep-scans for gaps and opportunities" },
          ].map((item,i)=>(
            <div key={i} style={{background:"#0d0d0d",border:"1px solid rgba(255,45,120,.12)",
              borderRadius:14,padding:"22px 18px",textAlign:"center",
              animation:`fadeUp .5s ${i*.08}s ease both`}}>
              <div style={{fontSize:28,marginBottom:10}}>{item.icon}</div>
              <div style={{fontFamily:"'Orbitron',monospace",fontSize:9.5,fontWeight:700,
                color:PINK,letterSpacing:".15em",marginBottom:8}}>{item.act}</div>
              <p style={{fontFamily:"'DM Sans'",fontSize:12,color:"#666",margin:0,lineHeight:1.6}}>{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{maxWidth:1100,margin:"0 auto 80px",padding:"0 28px"}}>
        <div style={{background:`radial-gradient(ellipse at 50% 0%,rgba(255,45,120,.14) 0%,#0d0d0d 70%)`,
          border:"1px solid rgba(255,45,120,.22)",borderRadius:24,padding:"70px 40px",
          textAlign:"center",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:"20%",right:"20%",height:2,
            background:`linear-gradient(to right,transparent,${PINK},transparent)`,
            boxShadow:`0 0 12px ${PINK}`}} />
          <div style={{display:"inline-flex",alignItems:"center",gap:10,marginBottom:20}}>
            <GlowDot /><span style={{fontFamily:"'Orbitron',monospace",fontSize:10,letterSpacing:".25em",color:PINK}}>READY TO START?</span><GlowDot />
          </div>
          <h2 style={{fontFamily:"'Orbitron',monospace",fontSize:"clamp(22px,3.5vw,44px)",
            fontWeight:900,color:"white",lineHeight:1.15,marginBottom:18}}>
            Nail Your Next Interview<br /><span style={{color:PINK}}>with AI on Your Side</span>
          </h2>
          <p style={{fontFamily:"'DM Sans'",fontSize:14,color:"#666",
            maxWidth:440,margin:"0 auto 36px"}}>
            It's free, instant and fully personalized. Upload your resume now and walk into your interview prepared.
          </p>
          <a href="/analyze" style={{fontFamily:"'Orbitron',monospace",fontSize:12,fontWeight:700,
            letterSpacing:".2em",color:"white",textDecoration:"none",
            background:`linear-gradient(135deg,${PINK},${PINK2})`,
            padding:"18px 42px",borderRadius:12,display:"inline-block",
            boxShadow:"0 0 40px rgba(255,45,120,.5),0 6px 30px rgba(255,45,120,.3)"}}>
            GENERATE MY REPORT →
          </a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{borderTop:"1px solid rgba(255,45,120,.1)",padding:"30px 28px"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",
          justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <GlowDot size={6} />
            <span style={{fontFamily:"'Orbitron',monospace",fontSize:11,fontWeight:900,color:"#333",letterSpacing:".1em"}}>
              INTERVUE<span style={{color:PINK}}>AI</span>
            </span>
          </div>
          <span style={{fontFamily:"'DM Sans'",fontSize:12,color:"#333"}}>Built for job seekers who prepare smarter.</span>
          <div style={{display:"flex",gap:16}}>
            {["Privacy","Terms","Contact"].map(l=>(
              <span key={l} style={{fontFamily:"'DM Sans'",fontSize:12,color:"#333",cursor:"pointer"}}>{l}</span>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}