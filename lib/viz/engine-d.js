// site/lib/viz/engine-d.js
// Concept D: Discovery Map — D3 force-directed graph visualization
// Standalone engine, mounted by React wrapper

const PROVIDER_DISPLAY = {
  db_results:            { name: 'Database',      abbrev: 'DB',  angle: Math.PI * 1.2 },
  gemini:                { name: 'Gemini',        abbrev: 'GEM', angle: Math.PI * 0.3 },
  perplexity_sonar_pro:  { name: 'Perplexity',    abbrev: 'PX',  angle: Math.PI * 1.7 },
  openai_gpt5:           { name: 'OpenAI',        abbrev: 'GPT', angle: Math.PI * 0.0 },
  claude_sonnet:         { name: 'Claude',        abbrev: 'CL',  angle: Math.PI * 0.8 },
  perplexity_reasoning:  { name: 'Perplexity R',  abbrev: 'PXR', angle: Math.PI * 1.5 },
  grok:                  { name: 'Grok',          abbrev: 'GRK', angle: Math.PI * 0.5 },
}

const TYPE_COLORS = { Federal: '#2563EB', Foundation: '#7C3AED', Corporate: '#059669' }

const PROVIDER_DASH = {
  db_results: 'none',
  gemini: '4,3',
  perplexity_sonar_pro: '1.5,2.5',
  openai_gpt5: '6,2,1.5,2',
  claude_sonnet: '3,2',
  perplexity_reasoning: '1.5,2.5',
  grok: 'double',
}

// ---------------------------------------------------------------------------
// Scoped CSS generator
// ---------------------------------------------------------------------------

const CSS = (p) => `
/* ───── Variables (scoped via container) ───── */
.${p}root {
  --brand: #F5CF49;
  --brand-dim: #F5CF4960;
  --bg: #FAFAFA;
  --bg-surface: #FFFFFF;
  --federal: #2563EB;
  --foundation: #7C3AED;
  --corporate: #059669;
  --text-primary: #1A1A2E;
  --text-secondary: #6B7280;
  --border-light: rgba(0,0,0,0.08);
  --font-display: 'DM Serif Display', serif;
  --font-body: 'DM Sans', sans-serif;
  position: relative;
  width: 100%;
  height: 80vh;
  overflow: hidden;
  background: var(--bg);
  color: var(--text-primary);
  font-family: var(--font-body);
  isolation: isolate; /* Contain internal z-indices so floating React controls stay on top */
}

/* ───── Floating particles ───── */
.${p}starfield {
  position: absolute; inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}
.${p}star {
  position: absolute;
  border-radius: 50%;
  background: var(--brand);
  animation: ${p}twinkle var(--dur) ease-in-out infinite alternate;
}
@keyframes ${p}twinkle {
  0% { opacity: var(--oMin); transform: scale(1); }
  100% { opacity: var(--oMax); transform: scale(var(--sc)); }
}

/* ───── Header ───── */
.${p}header {
  position: absolute; top: 0; left: 0; right: 0;
  z-index: 100;
  height: 48px;
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex; align-items: center;
  padding: 0 18px;
  border-bottom: 1px solid var(--border-light);
}
.${p}header-center {
  flex: 1;
  display: flex; align-items: center; justify-content: center;
  gap: 4px;
}
.${p}grant-counter {
  font-size: 13px; font-weight: 500;
  color: var(--text-secondary);
  letter-spacing: 0.04em;
}
.${p}count {
  font-family: var(--font-display);
  font-size: 20px;
  color: #B8940E;
  display: inline-block;
  min-width: 24px;
  text-align: center;
  transition: transform 0.15s ease;
}
.${p}count.${p}bump {
  transform: scale(1.3);
}

/* ───── Source Status Bar ───── */
.${p}source-bar {
  position: absolute; top: 48px; left: 0; right: 0;
  z-index: 99;
  height: 44px;
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-light);
  display: flex; align-items: center; justify-content: center;
  gap: 8px;
  padding: 0 16px;
  overflow-x: auto;
}
.${p}source-card {
  min-width: 90px;
  padding: 5px 8px;
  border-radius: 8px;
  border: 1px solid rgba(0,0,0,0.06);
  background: rgba(0,0,0,0.015);
  display: flex; align-items: center; gap: 6px;
  font-size: 10px;
  color: var(--text-secondary);
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}
.${p}source-card::before {
  content: '';
  position: absolute; inset: 0;
  border-radius: 8px;
  border: 2px solid var(--brand);
  opacity: 0;
  transition: opacity 0.4s ease;
}
.${p}source-card.${p}scanning::before {
  opacity: 1;
  animation: ${p}source-pulse 1.5s ease-in-out infinite;
}
.${p}source-card.${p}complete {
  border-color: rgba(5,150,105,0.2);
  background: rgba(5,150,105,0.04);
}
.${p}source-card.${p}complete::before { opacity: 0; }
@keyframes ${p}source-pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}
.${p}source-icon {
  width: 16px; height: 16px;
  border-radius: 50%;
  background: rgba(0,0,0,0.06);
  display: flex; align-items: center; justify-content: center;
  font-size: 8px; font-weight: 700;
  color: var(--text-secondary);
  flex-shrink: 0;
  transition: all 0.3s ease;
}
.${p}source-card.${p}scanning .${p}source-icon {
  background: rgba(245,207,73,0.15);
  color: #B8940E;
}
.${p}source-card.${p}complete .${p}source-icon {
  background: rgba(5,150,105,0.12);
  color: #059669;
}
.${p}source-info { flex: 1; min-width: 0; }
.${p}source-name {
  font-size: 9px; font-weight: 600;
  color: var(--text-primary);
  line-height: 1.2;
}
.${p}source-status-text {
  font-size: 8px;
  color: var(--text-secondary);
  line-height: 1.3;
}
.${p}source-count-anim {
  font-weight: 700;
  color: #B8940E;
}

/* ───── Ticker bar ───── */
.${p}ticker {
  position: absolute; top: 92px; left: 0; right: 0;
  z-index: 98;
  height: 28px;
  background: linear-gradient(90deg, rgba(245,207,73,0.08), rgba(245,207,73,0.04), rgba(245,207,73,0.08));
  border-bottom: 1px solid rgba(245,207,73,0.12);
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 500;
  color: #B8940E;
  overflow: hidden;
  white-space: nowrap;
}

/* ───── Progress bar ───── */
.${p}progress-track {
  position: absolute; top: 120px; left: 0; right: 0;
  height: 3px; z-index: 97;
  background: rgba(0,0,0,0.04);
}
.${p}progress-fill {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, var(--brand), #E8B708);
  transition: width 0.5s ease;
  box-shadow: 0 0 8px var(--brand-dim);
}

/* ───── Canvas area ───── */
.${p}canvas {
  position: absolute;
  top: 123px; left: 240px; bottom: 0; right: 0;
  z-index: 1;
  transition: left 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.${p}canvas svg {
  width: 100%; height: 100%;
  background: var(--bg);
}

/* ───── Ranked sidebar ───── */
.${p}sidebar {
  position: absolute;
  top: 123px; left: 0; bottom: 0;
  width: 240px;
  z-index: 50;
  background: rgba(255,255,255,0.96);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-right: 1px solid var(--border-light);
  display: flex; flex-direction: column;
  overflow: hidden;
}
.${p}sidebar-header {
  padding: 12px 14px 10px;
  border-bottom: 1px solid var(--border-light);
  font-size: 12px; font-weight: 600;
  color: var(--text-primary);
  display: flex; align-items: center; gap: 6px;
}
.${p}sidebar-badge {
  background: var(--brand);
  color: #1A1A2E;
  font-size: 10px; font-weight: 700;
  padding: 2px 7px;
  border-radius: 8px;
  min-width: 20px;
  text-align: center;
}
.${p}sidebar-list {
  flex: 1;
  overflow-y: auto;
  padding: 4px 0;
}
.${p}sidebar-list::-webkit-scrollbar { width: 3px; }
.${p}sidebar-list::-webkit-scrollbar-track { background: transparent; }
.${p}sidebar-list::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 2px; }
.${p}ranked-item {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 14px;
  cursor: pointer;
  transition: background 0.15s ease;
  border-bottom: 1px solid rgba(0,0,0,0.03);
  animation: ${p}slideIn 0.35s ease forwards;
  opacity: 0;
}
@keyframes ${p}slideIn {
  from { opacity: 0; transform: translateX(-16px); }
  to { opacity: 1; transform: translateX(0); }
}
.${p}ranked-item:hover { background: rgba(245,207,73,0.06); }
.${p}ranked-item.${p}selected {
  background: rgba(245,207,73,0.12);
  border-left: 3px solid var(--brand);
}
.${p}rank-num {
  font-family: var(--font-display);
  font-size: 14px;
  color: var(--text-secondary);
  min-width: 18px;
  text-align: center;
}
.${p}ranked-item.${p}best .${p}rank-num { color: #B8940E; }
.${p}rank-info { flex: 1; min-width: 0; }
.${p}rank-name {
  font-size: 11px; font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
}
.${p}rank-meta {
  font-size: 9px;
  color: var(--text-secondary);
  display: flex; gap: 5px; align-items: center;
  margin-top: 2px;
}
.${p}rank-fit {
  font-size: 9px; font-weight: 700;
  padding: 1px 5px;
  border-radius: 6px;
  white-space: nowrap;
  flex-shrink: 0;
}
.${p}rank-crown {
  font-size: 12px;
  flex-shrink: 0;
}

/* ───── Tooltip ───── */
.${p}tooltip {
  position: fixed;
  z-index: 200;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease, transform 0.2s ease;
  transform: translateY(6px);
}
.${p}tooltip.${p}visible {
  opacity: 1;
  transform: translateY(0);
}
.${p}tooltip-card {
  background: rgba(255,255,255,0.97);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 12px;
  padding: 14px 16px;
  min-width: 240px;
  max-width: 300px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04);
}
.${p}tt-name {
  font-family: var(--font-display);
  font-size: 14px;
  color: var(--text-primary);
  margin-bottom: 3px;
  line-height: 1.25;
}
.${p}tt-funder {
  font-size: 10px;
  color: var(--text-secondary);
  margin-bottom: 6px;
}
.${p}tt-meta {
  display: flex; gap: 6px; align-items: center;
  font-size: 11px; font-weight: 500;
  margin-bottom: 6px;
  flex-wrap: wrap;
}
.${p}tt-amount { color: #B8940E; font-weight: 600; }
.${p}tt-sep { color: rgba(0,0,0,0.15); }
.${p}tt-deadline { color: var(--text-secondary); }
.${p}tt-fit {
  display: inline-flex; align-items: center;
  padding: 2px 7px;
  border-radius: 8px;
  font-size: 10px; font-weight: 600;
}
.${p}tt-desc {
  font-size: 10px;
  color: var(--text-secondary);
  line-height: 1.5;
  font-style: italic;
  margin-bottom: 4px;
}
.${p}tt-cta {
  font-size: 9px;
  font-weight: 600;
  color: #B8940E;
  letter-spacing: 0.02em;
}

/* ───── Legend panel ───── */
.${p}legend {
  position: absolute;
  top: 132px; left: 250px;
  z-index: 50;
  background: rgba(255,255,255,0.88);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border-light);
  border-radius: 10px;
  padding: 0;
  font-size: 10px;
  color: var(--text-secondary);
  min-width: 160px;
  max-width: 200px;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.6s ease, transform 0.6s ease, left 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  overflow: hidden;
}
.${p}legend.${p}visible { opacity: 1; transform: translateY(0); }
.${p}legend-toggle {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 12px;
  cursor: pointer; user-select: none;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 10px;
  letter-spacing: 0.03em;
}
.${p}legend-toggle:hover { background: rgba(0,0,0,0.02); }
.${p}legend-chevron {
  font-size: 9px;
  color: var(--text-secondary);
  transition: transform 0.2s ease;
}
.${p}legend.${p}collapsed .${p}legend-chevron { transform: rotate(-90deg); }
.${p}legend-body {
  padding: 0 12px 10px;
  display: flex; flex-direction: column; gap: 3px;
}
.${p}legend.${p}collapsed .${p}legend-body { display: none; }
.${p}legend-section-title {
  font-size: 8px; font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-top: 4px;
  opacity: 0.7;
}
.${p}legend-row {
  display: flex; align-items: center; gap: 6px;
  animation: ${p}legendFadeIn 0.4s ease forwards;
}
@keyframes ${p}legendFadeIn {
  from { opacity: 0; transform: translateX(-6px); }
  to { opacity: 1; transform: translateX(0); }
}
.${p}legend-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.${p}legend-ring-sample {
  width: 12px; height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
  background: transparent;
}

/* ───── Labor counter ───── */
.${p}labor {
  position: absolute;
  bottom: 16px; left: 250px;
  z-index: 50;
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 16px;
  padding: 6px 14px;
  font-family: var(--font-body);
  font-size: 10px;
  color: var(--text-secondary);
  display: flex; flex-direction: column; gap: 2px;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.5s ease, transform 0.5s ease, left 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
}
.${p}labor.${p}visible { opacity: 1; transform: translateY(0); }
.${p}labor-line { display: flex; align-items: center; gap: 4px; }
.${p}labor-num { font-weight: 600; color: var(--text-primary); font-variant-numeric: tabular-nums; }
.${p}labor-amount { font-weight: 600; color: #B8940E; }

/* ───── Ranked flash ───── */
.${p}ranked-flash {
  position: absolute;
  top: 50%; left: calc(50% + 120px);
  transform: translate(-50%, -50%) scale(0.7);
  z-index: 150;
  font-family: var(--font-display);
  font-size: 40px;
  color: #B8940E;
  text-shadow: 0 2px 20px rgba(245,207,73,0.3);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.${p}ranked-flash.${p}flash { opacity: 1; transform: translate(-50%, -50%) scale(1); }

/* ───── Node labels (SVG) ───── */
.${p}node-label {
  font-family: 'DM Sans', sans-serif;
  font-size: 10px;
  fill: rgba(26,26,46,0.55);
  text-anchor: middle;
  pointer-events: none;
  user-select: none;
}
.${p}node-label-fit {
  font-family: 'DM Sans', sans-serif;
  font-size: 9px;
  fill: rgba(181,148,14,0.6);
  text-anchor: middle;
  pointer-events: none;
  user-select: none;
}
.${p}org-label {
  font-family: 'DM Serif Display', serif;
  font-size: 12px;
  fill: #B8940E;
  text-anchor: middle;
  pointer-events: none;
  user-select: none;
}

/* ───── Entry sparkle ───── */
@keyframes ${p}sparkle-fade {
  0% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(2.5); }
}
.${p}sparkle {
  position: absolute;
  width: 20px; height: 20px;
  border-radius: 50%;
  pointer-events: none;
  z-index: 10;
  animation: ${p}sparkle-fade 0.6s ease-out forwards;
}

/* ───── Completion overlay ───── */
.${p}completion {
  position: absolute;
  bottom: 60px; left: calc(240px + (100% - 240px) / 2);
  transform: translateX(-50%);
  z-index: 120;
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(245,207,73,0.3);
  border-radius: 16px;
  padding: 16px 28px;
  text-align: center;
  box-shadow: 0 8px 40px rgba(0,0,0,0.08);
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
}
.${p}completion.${p}visible { opacity: 1; pointer-events: auto; }
.${p}completion.${p}fade-out { opacity: 0; transition: opacity 1s ease; }
.${p}completion-title {
  font-family: var(--font-display);
  font-size: 20px;
  color: #B8940E;
  margin-bottom: 4px;
}
.${p}completion-sub {
  font-size: 12px;
  color: var(--text-secondary);
}

/* ───── Detail sidepanel ───── */
.${p}detail-panel {
  position: absolute;
  top: 123px; left: 240px; bottom: 0;
  width: 300px;
  z-index: 50;
  background: #FFFFFF;
  border-right: 1px solid var(--border-light);
  box-shadow: 4px 0 40px rgba(0,0,0,0.08);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.25s ease, visibility 0.25s ease;
  overflow-y: auto;
  overflow-x: hidden;
}
.${p}detail-panel.${p}open { opacity: 1; visibility: visible; }
.${p}detail-panel::-webkit-scrollbar { width: 3px; }
.${p}detail-panel::-webkit-scrollbar-track { background: transparent; }
.${p}detail-panel::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 2px; }
.${p}detail-inner { padding: 20px 20px 32px; }
.${p}detail-close {
  position: absolute;
  top: 12px; right: 12px;
  width: 28px; height: 28px;
  border-radius: 50%;
  background: rgba(0,0,0,0.04);
  border: 1px solid rgba(0,0,0,0.08);
  color: var(--text-secondary);
  font-size: 15px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s ease;
  z-index: 10;
}
.${p}detail-close:hover { background: rgba(0,0,0,0.08); color: var(--text-primary); }
.${p}detail-badges { display: flex; gap: 5px; margin-bottom: 12px; flex-wrap: wrap; }
.${p}detail-badge {
  font-size: 9px; font-weight: 600;
  padding: 2px 8px;
  border-radius: 8px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.${p}detail-badge-type { border: 1px solid; }
.${p}detail-badge-source {
  background: rgba(245,207,73,0.1);
  color: #B8940E;
  border: 1px solid rgba(245,207,73,0.2);
}
.${p}detail-name {
  font-family: var(--font-display);
  font-size: 18px;
  color: var(--text-primary);
  line-height: 1.25;
  margin-bottom: 3px;
}
.${p}detail-funder {
  font-size: 11px;
  color: var(--text-secondary);
  margin-bottom: 16px;
}
.${p}detail-gauge-wrap {
  display: flex; align-items: center; gap: 16px;
  margin-bottom: 16px;
}
.${p}detail-gauge {
  position: relative;
  width: 72px; height: 72px;
  flex-shrink: 0;
}
.${p}detail-gauge svg { width: 72px; height: 72px; }
.${p}detail-gauge-label {
  position: absolute; inset: 0;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  font-family: var(--font-display);
  font-size: 20px;
  color: var(--text-primary);
  line-height: 1;
}
.${p}detail-gauge-label small {
  font-family: var(--font-body);
  font-size: 9px;
  color: var(--text-secondary);
  margin-top: 2px;
}
.${p}detail-meta-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5px;
}
.${p}detail-meta-item {
  background: rgba(0,0,0,0.02);
  border: 1px solid rgba(0,0,0,0.05);
  border-radius: 8px;
  padding: 6px 10px;
}
.${p}detail-meta-label {
  font-size: 8px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 2px;
}
.${p}detail-meta-value {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}
.${p}detail-section { margin-top: 16px; }
.${p}detail-section-title {
  font-size: 9px; font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 5px;
}
.${p}detail-summary {
  font-size: 12px;
  line-height: 1.6;
  color: rgba(26,26,46,0.75);
}
.${p}detail-eligibility {
  font-size: 11px;
  line-height: 1.6;
  color: rgba(26,26,46,0.6);
}
.${p}detail-actions {
  display: flex; gap: 6px;
  margin-top: 20px;
}
.${p}detail-btn {
  flex: 1;
  padding: 8px 12px;
  border-radius: 8px;
  font-family: var(--font-body);
  font-size: 11px; font-weight: 600;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s ease;
  text-decoration: none;
  display: flex; align-items: center; justify-content: center; gap: 5px;
}
.${p}detail-btn-primary {
  background: var(--brand);
  color: #1A1A2E;
  border: none;
}
.${p}detail-btn-primary:hover { background: #E8B708; transform: translateY(-1px); }
.${p}detail-btn-secondary {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid rgba(0,0,0,0.12);
}
.${p}detail-btn-secondary:hover { border-color: rgba(0,0,0,0.25); background: rgba(0,0,0,0.02); }

/* ───── Responsive ───── */
@media (max-width: 768px) {
  .${p}sidebar { display: none; }
  .${p}canvas { left: 0; }
  .${p}legend { left: 8px; }
  .${p}labor { left: 8px; }
  .${p}detail-panel { left: 0; width: 280px; }
  .${p}source-bar { gap: 4px; }
  .${p}source-card { min-width: 70px; padding: 4px 6px; }
}
`

// ---------------------------------------------------------------------------
// Utility functions
// ---------------------------------------------------------------------------

function parseAmountSingle(str) {
  if (!str) return 0
  const cleaned = String(str).replace(/[^0-9.KMBkmb]/g, '')
  if (!cleaned) return 0
  const upper = cleaned.toUpperCase()
  if (upper.includes('B')) { const v = parseFloat(upper); return isNaN(v) ? 0 : v * 1e9 }
  if (upper.includes('M')) { const v = parseFloat(upper); return isNaN(v) ? 0 : v * 1e6 }
  if (upper.includes('K')) { const v = parseFloat(upper); return isNaN(v) ? 0 : v * 1e3 }
  const v = parseFloat(cleaned)
  return isNaN(v) ? 0 : v
}

function parseAmount(amountStr) {
  if (!amountStr) return 0
  const s = String(amountStr).trim()
  // Non-numeric descriptors
  if (/^(rolling|varies|tbd|n\/a|per\s|not\s)/i.test(s)) return 0
  // Range: "$50,000 - $500,000" → pick upper end
  const rangeParts = s.split(/\s*[-–—]\s*|\s+to\s+/i).filter(p => /\d/.test(p))
  if (rangeParts.length >= 2) return parseAmountSingle(rangeParts[rangeParts.length - 1])
  // "Up to $X"
  const upTo = s.match(/up\s+to\s+([\$\d,.]+\s*[KMBkmb]?)/i)
  if (upTo) return parseAmountSingle(upTo[1])
  return parseAmountSingle(s)
}

function formatAmount(a, fallbackStr) {
  if (isNaN(a) || a === 0) return fallbackStr || '$0'
  if (a >= 1000000) return '$' + (a / 1000000).toFixed(a % 1000000 === 0 ? 0 : 1) + 'M'
  if (a >= 1000) return '$' + Math.round(a / 1000) + 'K'
  return '$' + Math.round(a)
}

function sizeForAmount(amount) {
  const minA = 75000, maxA = 2000000
  const minR = 18, maxR = 38
  const t = Math.min(1, Math.max(0, (amount - minA) / (maxA - minA)))
  return minR + t * (maxR - minR)
}

function opacityForFit(fit) {
  return 0.5 + (fit / 100) * 0.5
}

function ringPropsForFit(fit) {
  if (fit >= 90) return { width: 3, color: '#B8940E', glow: true, glowStrength: 'strong' }
  if (fit >= 70) return { width: 2, color: 'rgba(0,0,0,0.25)', glow: true, glowStrength: 'subtle' }
  return { width: 1, color: 'rgba(0,0,0,0.12)', glow: false, glowStrength: 'none' }
}

function daysUntilDeadline(deadlineStr) {
  if (!deadlineStr || deadlineStr.toLowerCase() === 'rolling') return Infinity
  const d = new Date(deadlineStr)
  if (isNaN(d.getTime())) return Infinity
  return Math.ceil((d - new Date()) / (1000 * 60 * 60 * 24))
}

// ---------------------------------------------------------------------------
// DiscoveryMapEngine
// ---------------------------------------------------------------------------
export default class DiscoveryMapEngine {
  constructor() {
    this._destroyed = false
    this._d3 = null
    this._container = null
    this._config = null
    this._prefix = 'gvd-'
    this._styleEl = null

    // D3 state
    this._svg = null
    this._simulation = null
    this._linkGroup = null
    this._nodeGroup = null
    this._labelGroup = null
    this._corridorGroup = null
    this._sonarGroup = null
    this._defs = null
    this._width = 0
    this._height = 0
    this._activeNodes = []
    this._activeLinks = []
    this._orgNode = null

    // UI state
    this._hoveredId = null
    this._selectedId = null
    this._rerankDone = false
    this._revealedGrants = []
    this._grantIdSet = new Set()  // dedup tracker
    this._currentChampion = null
    this._onGrantSelectCb = null
    this._legendCollapsed = false

    // Legend
    this._legendTypes = {}
    this._legendProviders = {}
    this._legendScoreRanges = {}
    this._legendHasUrgent = false

    // Source status
    this._sourceCards = {}
    this._sourceFoundCounts = {}

    // Labor counter
    this._laborRAF = null
    this._laborStartTime = 0

    // Timers
    this._timers = []
    this._tickerInterval = null
    this._progressRAF = null
    this._searchStartTime = 0

    // Cadence queue
    this._revealQueue = []
    this._revealTimer = null
    this._revealedCount = 0
    this._cadenceState = { fastCount: 0, inPause: false }
    this._llmHasArrived = false

    // DOM refs
    this._els = {}

    // Resize handler
    this._onResize = null
  }

  // ========================================================================
  // PUBLIC: init
  // ========================================================================
  init(container, config, d3) {
    this._d3 = d3
    this._container = container
    this._config = config
    const p = this._prefix

    // Inject scoped CSS
    this._styleEl = document.createElement('style')
    this._styleEl.textContent = CSS(p)
    document.head.appendChild(this._styleEl)

    // Build DOM skeleton
    container.innerHTML = ''
    container.className = (container.className || '') + ` ${p}root`
    this._buildDOM()
    this._createStarfield()
    this._initCanvas()
    this._startLaborCounter()
    this._searchStartTime = Date.now()

    // Show legend after a moment
    this._timers.push(setTimeout(() => {
      if (this._destroyed) return
      this._els.legend?.classList.add(`${p}visible`)
    }, 1000))

    // Resize listener
    this._onResize = () => this._handleResize()
    window.addEventListener('resize', this._onResize)
  }

  // ========================================================================
  // PUBLIC: addBatch
  // ========================================================================
  addBatch(provider, grants, isInitial) {
    if (this._destroyed || !grants.length) return
    const provInfo = PROVIDER_DISPLAY[provider] || { name: provider, abbrev: provider.slice(0, 2).toUpperCase(), angle: Math.random() * Math.PI * 2 }

    // Activate source card
    this._activateSource(provider)

    // Sonar ping
    this._emitSonarPing(provider)

    // Activate corridor
    this._activateCorridor(provider)

    // Convert VizGrants to internal format and queue
    const internalGrants = grants.map(g => ({
      id: g.id,
      name: g.name,
      funder: g.funder,
      amount: parseAmount(g.amount),
      amountStr: g.amount,
      fit: g.fit_score,
      type: g.type,
      provider: provider,
      providerName: provInfo.name,
      summary: g.summary,
      deadline: g.deadline,
      eligibility: g.eligibility,
      url: g.url,
    }))

    internalGrants.forEach(g => {
      if (!this._grantIdSet.has(g.id)) {
        this._grantIdSet.add(g.id)  // Mark seen NOW so next batch can't re-queue
        // Cap total grants at 40 to prevent sidebar bloat during streaming
        if (this._revealedGrants.length + this._revealQueue.length < 40) {
          this._revealQueue.push(g)
        }
      }
    })
    this._revealQueue.sort((a, b) => b.fit - a.fit)

    if (provider !== 'db_results') this._llmHasArrived = true

    // Update source count
    this._updateSourceCount(provider, grants.length)

    // Update ticker
    const big = internalGrants.find(g => g.amount >= 500000)
    if (big) {
      this._setTicker(`Found ${formatAmount(big.amount)} match! ${provInfo.name} returned ${grants.length} grants.`)
    } else if (isInitial) {
      this._setTicker('Analyzing grants across databases...')
    } else {
      this._setTicker(`${provInfo.name} returned ${grants.length} matching grants...`)
    }

    this._scheduleNextReveal()
  }

  // ========================================================================
  // PUBLIC: rerank
  // ========================================================================
  rerank(grants) {
    if (this._destroyed) return
    const p = this._prefix
    const d3 = this._d3
    this._rerankDone = true

    // Normalize fit scores so top = 100
    const topFit = grants[0]?.fit_score || 1
    if (topFit > 0 && topFit < 100) {
      const scale = 100 / topFit
      grants.forEach(g => { g.fit_score = Math.min(100, Math.round((g.fit_score || 0) * scale)) })
      // Also update internal revealed grants
      this._revealedGrants.forEach(rg => {
        const match = grants.find(g => g.id === rg.id)
        if (match) rg.fit = match.fit_score
      })
    }

    // Build rerank order from grants array (already sorted by fit_score)
    const rerankOrder = grants.map(g => g.id)

    // Remove running champion
    this._nodeGroup?.selectAll('.champion-crown').remove()
    this._nodeGroup?.selectAll('.champion-glow').remove()

    // Flash links
    this._linkGroup?.selectAll(`.${p}grant-link`)
      .transition().duration(400).attr('opacity', d => opacityForFit(d.fit) * 0.6)
      .transition().duration(800).attr('opacity', d => opacityForFit(d.fit) * 0.3)

    // Update champion
    const bestId = rerankOrder[0]
    const bestGrant = this._revealedGrants.find(g => g.id === bestId)
    if (bestGrant) this._currentChampion = bestGrant

    // Update radial force
    const w = this._width, h = this._height
    this._simulation?.force('radial', d3.forceRadial(d => {
      if (d.isOrg) return 0
      const rank = rerankOrder.indexOf(d.id)
      if (rank === -1) return Math.min(w, h) * 0.4
      if (rank === 0) return 70
      if (rank < 5) return 90 + rank * 18
      return 130 + rank * 10
    }, w / 2, h / 2).strength(d => {
      if (d.isOrg) return 0
      const rank = rerankOrder.indexOf(d.id)
      if (rank === 0) return 0.15
      if (rank < 5) return 0.10
      return 0.05
    }))

    this._simulation?.alpha(0.6).restart()

    // Best match crown + glow
    const top5 = new Set(rerankOrder.slice(0, 5))
    this._timers.push(setTimeout(() => {
      if (this._destroyed) return
      this._nodeGroup?.selectAll(`.${p}grant-node`)
        .filter(d => d.id === bestId)
        .each(function(d) {
          const g = d3.select(this)
          g.select('.fit-ring').remove()
          g.append('circle').attr('class', 'best-match-glow')
            .attr('r', d.radius + 12).attr('fill', 'none')
            .attr('stroke', '#F5CF49').attr('stroke-width', 4)
            .attr('opacity', 0.6).attr('filter', 'url(#gvd-coronaGlow)')
          function pulseBest() {
            g.select('.best-match-glow')
              .attr('r', d.radius + 10).attr('opacity', 0.7).attr('stroke-width', 4)
              .transition().duration(1500).ease(d3.easeSinInOut)
              .attr('r', d.radius + 18).attr('opacity', 0.2).attr('stroke-width', 2)
              .on('end', pulseBest)
          }
          pulseBest()
          g.append('circle').attr('class', 'best-match-ring')
            .attr('r', d.radius + 4).attr('fill', 'none')
            .attr('stroke', '#F5CF49').attr('stroke-width', 3).attr('opacity', 0.9)
          g.append('text').attr('class', 'best-match-crown')
            .attr('text-anchor', 'middle').attr('x', 0).attr('y', -(d.radius + 12))
            .attr('font-size', '22px').text('\u{1F451}')
          g.select('.node-circle').transition().duration(600).attr('opacity', 1)
        })

      // Highlight best link
      this._linkGroup?.selectAll(`.${p}grant-link`)
        .filter(d => d.target === bestId)
        .transition().duration(600)
        .attr('stroke', '#B8940E').attr('stroke-width', 2.5).attr('opacity', 0.6)

      // Top5 rings
      top5.forEach(id => {
        if (id === bestId) return
        this._nodeGroup?.selectAll(`.${p}grant-node`).filter(d => d.id === id)
          .select('.fit-ring').transition().duration(600)
          .attr('stroke', 'rgba(0,0,0,0.3)').attr('stroke-width', 2)
      })
    }, 500))

    // Render ranked list
    this._timers.push(setTimeout(() => {
      if (this._destroyed) return
      this._renderRankedList(rerankOrder)
    }, 300))

    // Flash "Ranked!" label
    const flash = this._els.rankedFlash
    if (flash) {
      flash.classList.add(`${p}flash`)
      this._timers.push(setTimeout(() => flash?.classList.remove(`${p}flash`), 1500))
    }

  }

  // ========================================================================
  // PUBLIC: complete
  // ========================================================================
  complete(summary) {
    if (this._destroyed) return
    const p = this._prefix

    // Complete all sources
    Object.keys(this._sourceCards).forEach(prov => this._completeSource(prov))

    // Stop progress
    if (this._progressRAF) cancelAnimationFrame(this._progressRAF)
    const progressFill = this._els.progressFill
    if (progressFill) progressFill.style.width = '100%'

    // Show completion overlay (auto-dismisses after 5s)
    const comp = this._els.completion
    if (comp) {
      const titleEl = comp.querySelector(`.${p}completion-title`)
      const subEl = comp.querySelector(`.${p}completion-sub`)
      if (titleEl) titleEl.textContent = `${summary.totalCount} grants discovered`
      if (subEl) subEl.textContent = `Search completed in ${(summary.durationMs / 1000).toFixed(1)}s`
      comp.classList.add(`${p}visible`)
      this._timers.push(setTimeout(() => {
        if (this._destroyed) return
        comp.classList.add(`${p}fade-out`)
        this._timers.push(setTimeout(() => {
          comp.classList.remove(`${p}visible`, `${p}fade-out`)
        }, 1000))
      }, 5000))
    }

    // Start teasers
    this._startCompletionTeasers()

    // Confetti
    this._timers.push(setTimeout(() => {
      if (this._destroyed) return
      if (typeof window !== 'undefined') {
        import('canvas-confetti').then(mod => {
          const confetti = mod.default || mod
          confetti({
            particleCount: 40, spread: 80,
            origin: { x: 0.6, y: 0.5 },
            colors: ['#F5CF49', '#2563EB', '#7C3AED', '#059669'],
            gravity: 0.6, ticks: 80, disableForReducedMotion: true,
          })
        }).catch(() => {})
      }
    }, 300))
  }

  // ========================================================================
  // PUBLIC: onGrantSelect
  // ========================================================================
  onGrantSelect(callback) {
    this._onGrantSelectCb = callback
  }

  // ========================================================================
  // PUBLIC: loadAll — render final state instantly (no animation)
  // ========================================================================
  loadAll(grants) {
    if (this._destroyed || !grants.length) return
    const d3 = this._d3
    const p = this._prefix

    // Stop animations (init() starts them, but loadAll sets final values)
    if (this._laborRAF) { cancelAnimationFrame(this._laborRAF); this._laborRAF = null }
    if (this._progressRAF) { cancelAnimationFrame(this._progressRAF); this._progressRAF = null }

    // Deduplicate by name (same grant from different providers)
    const seen = new Set()
    const uniqueGrants = grants.filter(g => {
      const key = (g.name || '').trim().toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })

    // Convert to internal format, cap at 40
    const internalGrants = uniqueGrants.slice(0, 40).map(g => ({
      id: g.id,
      name: g.name,
      funder: g.funder,
      amount: parseAmount(g.amount),
      amountStr: g.amount,
      fit: g.fit_score,
      type: g.type,
      provider: g.source || 'db_results',
      providerName: PROVIDER_DISPLAY[g.source || 'db_results']?.name || 'Database',
      summary: g.summary,
      deadline: g.deadline,
      eligibility: g.eligibility,
      url: g.url,
    }))
    internalGrants.sort((a, b) => b.fit - a.fit)

    // Normalize fit scores so top = 100
    const topFit = internalGrants[0]?.fit || 1
    if (topFit > 0 && topFit < 100) {
      const scale = 100 / topFit
      internalGrants.forEach(g => { g.fit = Math.min(100, Math.round(g.fit * scale)) })
    }

    this._rerankDone = true
    this._revealedGrants = []
    this._revealedCount = 0

    // Populate dedup set so subsequent addBatch calls skip these grants
    this._grantIdSet.clear()
    internalGrants.forEach(g => this._grantIdSet.add(g.id))

    // Set labor counter to final values directly
    const totalAmount = internalGrants.reduce((sum, g) => sum + g.amount, 0)
    if (this._els.laborGrants) this._els.laborGrants.textContent = (internalGrants.length * 170).toLocaleString()
    if (this._els.laborDBs) this._els.laborDBs.textContent = '12'
    if (this._els.laborAmount) {
      this._els.laborAmount.textContent = totalAmount >= 1000000
        ? '$' + (totalAmount / 1000000).toFixed(1) + 'M'
        : totalAmount > 0 ? '$' + Math.round(totalAmount / 1000) + 'K' : '$0'
    }
    const labor = this._els.labor
    if (labor) labor.classList.add(`${p}visible`)

    // Activate + complete sources
    const providers = new Set(internalGrants.map(g => g.provider).filter(Boolean))
    providers.forEach(prov => {
      this._sourceFoundCounts[prov] = internalGrants.filter(g => g.provider === prov).length
      this._completeSource(prov)
    })

    // Show sidebar immediately with all grants
    this._renderRankedList(internalGrants.map(g => g.id))

    // Apply rank-based radial force (like rerank) for better visual spread
    const w = this._width, h = this._height
    this._simulation?.force('radial', d3.forceRadial(d => {
      if (d.isOrg) return 0
      const rank = internalGrants.findIndex(g => g.id === d.id)
      if (rank === -1) return Math.min(w, h) * 0.4
      if (rank === 0) return 70
      if (rank < 5) return 90 + rank * 18
      return 130 + rank * 10
    }, w / 2, h / 2).strength(d => {
      if (d.isOrg) return 0
      const rank = internalGrants.findIndex(g => g.id === d.id)
      if (rank === 0) return 0.15
      if (rank < 5) return 0.10
      return 0.05
    }))

    // Add all nodes at once — instant load for post-search toggle (no stagger)
    // NOTE: Do NOT push to _revealedGrants here — _addSingleGrantNode does it internally
    internalGrants.forEach(grant => {
      this._addSingleGrantNode(grant)
    })
    this._revealedCount = internalGrants.length
    this._animateCounter(internalGrants.length)

    // Final setup
    if (this._els.progressFill) this._els.progressFill.style.width = '100%'
    this._els.legend?.classList.add(`${p}visible`)
    this._setTicker(`AI discovered ${internalGrants.length} grants`)

    // Mark best match crown immediately
    if (internalGrants[0]) {
      const best = internalGrants[0]
      this._nodeGroup?.selectAll(`.${p}grant-node`)
        .filter(d => d.id === best.id)
        .each(function() {
          const g = d3.select(this)
          const nd = g.datum()
          g.append('circle').attr('class', 'best-match-ring')
            .attr('r', nd.radius + 4).attr('fill', 'none')
            .attr('stroke', '#F5CF49').attr('stroke-width', 3).attr('opacity', 0.9)
          g.append('text').attr('class', 'best-match-crown')
            .attr('text-anchor', 'middle').attr('x', 0).attr('y', -(nd.radius + 12))
            .attr('font-size', '22px').text('\u{1F451}')
        })
    }
  }

  // ========================================================================
  // PUBLIC: reset
  // ========================================================================
  reset() {
    this._clearTimers()
    this._revealQueue = []
    this._revealTimer = null
    this._revealedCount = 0
    this._revealedGrants = []
    this._currentChampion = null
    this._rerankDone = false
    this._hoveredId = null
    this._selectedId = null
    this._llmHasArrived = false
    this._cadenceState = { fastCount: 0, inPause: false }
    this._legendTypes = {}
    this._legendProviders = {}
    this._legendScoreRanges = {}
    this._legendHasUrgent = false
    this._sourceFoundCounts = {}
    this._searchStartTime = Date.now()

    if (this._container) {
      this._buildDOM()
      this._createStarfield()
      this._initCanvas()
      this._startLaborCounter()
    }
  }

  // ========================================================================
  // PUBLIC: destroy
  // ========================================================================
  destroy() {
    this._destroyed = true
    this._clearTimers()
    if (this._simulation) { this._simulation.stop(); this._simulation = null }
    if (this._styleEl) { this._styleEl.remove(); this._styleEl = null }
    if (this._onResize) { window.removeEventListener('resize', this._onResize); this._onResize = null }
    if (this._resizeObserver) { this._resizeObserver.disconnect(); this._resizeObserver = null }
    if (this._container) this._container.innerHTML = ''
  }

  // ========================================================================
  // PRIVATE: Build DOM
  // ========================================================================
  _buildDOM() {
    const p = this._prefix
    const c = this._container
    c.innerHTML = ''

    const html = `
      <div class="${p}starfield"></div>
      <div class="${p}header">
        <div class="${p}header-center">
          <span class="${p}grant-counter">AI discovered <span class="${p}count">0</span> grants</span>
        </div>
      </div>
      <div class="${p}source-bar"></div>
      <div class="${p}ticker">&nbsp;</div>
      <div class="${p}progress-track"><div class="${p}progress-fill"></div></div>
      <div class="${p}canvas"></div>
      <div class="${p}sidebar">
        <div class="${p}sidebar-header">Discovered Grants <span class="${p}sidebar-badge">0</span></div>
        <div class="${p}sidebar-list"></div>
      </div>
      <div class="${p}legend">
        <div class="${p}legend-toggle"><span>Legend</span><span class="${p}legend-chevron">\u25BC</span></div>
        <div class="${p}legend-body"></div>
      </div>
      <div class="${p}labor">
        <div class="${p}labor-line">Analyzed <span class="${p}labor-num ${p}labor-grants">0</span> grants across <span class="${p}labor-num ${p}labor-dbs">0</span> databases</div>
        <div class="${p}labor-line"><span class="${p}labor-amount">$0</span> in matching opportunities</div>
      </div>
      <div class="${p}ranked-flash">Ranked!</div>
      <div class="${p}tooltip">
        <div class="${p}tooltip-card">
          <div class="${p}tt-name"></div>
          <div class="${p}tt-funder"></div>
          <div class="${p}tt-meta">
            <span class="${p}tt-amount"></span>
            <span class="${p}tt-sep">&middot;</span>
            <span class="${p}tt-deadline"></span>
            <span class="${p}tt-sep">&middot;</span>
            <span class="${p}tt-fit"></span>
          </div>
          <div class="${p}tt-desc"></div>
          <div class="${p}tt-cta">Click to explore &rarr;</div>
        </div>
      </div>
      <div class="${p}detail-panel">
        <button class="${p}detail-close">&times;</button>
        <div class="${p}detail-inner">
          <div class="${p}detail-badges"></div>
          <div class="${p}detail-name"></div>
          <div class="${p}detail-funder"></div>
          <div class="${p}detail-gauge-wrap">
            <div class="${p}detail-gauge">
              <svg viewBox="0 0 72 72"></svg>
              <div class="${p}detail-gauge-label">
                <span class="${p}detail-fit-num"></span>
                <small>fit score</small>
              </div>
            </div>
            <div class="${p}detail-meta-grid">
              <div class="${p}detail-meta-item">
                <div class="${p}detail-meta-label">Amount</div>
                <div class="${p}detail-meta-value ${p}detail-amount"></div>
              </div>
              <div class="${p}detail-meta-item">
                <div class="${p}detail-meta-label">Deadline</div>
                <div class="${p}detail-meta-value ${p}detail-deadline"></div>
              </div>
            </div>
          </div>
          <div class="${p}detail-section">
            <div class="${p}detail-section-title">Summary</div>
            <div class="${p}detail-summary"></div>
          </div>
          <div class="${p}detail-section">
            <div class="${p}detail-section-title">Eligibility</div>
            <div class="${p}detail-eligibility"></div>
          </div>
          <div class="${p}detail-actions">
            <a class="${p}detail-btn ${p}detail-btn-primary" target="_blank">View Grant \u2192</a>
          </div>
        </div>
      </div>
      <div class="${p}completion">
        <div class="${p}completion-title"></div>
        <div class="${p}completion-sub"></div>
      </div>
    `
    c.insertAdjacentHTML('beforeend', html)

    // Cache DOM refs
    this._els = {
      starfield: c.querySelector(`.${p}starfield`),
      counter: c.querySelector(`.${p}count`),
      sourceBar: c.querySelector(`.${p}source-bar`),
      ticker: c.querySelector(`.${p}ticker`),
      progressFill: c.querySelector(`.${p}progress-fill`),
      canvas: c.querySelector(`.${p}canvas`),
      sidebar: c.querySelector(`.${p}sidebar`),
      sidebarBadge: c.querySelector(`.${p}sidebar-badge`),
      sidebarList: c.querySelector(`.${p}sidebar-list`),
      legend: c.querySelector(`.${p}legend`),
      legendBody: c.querySelector(`.${p}legend-body`),
      legendToggle: c.querySelector(`.${p}legend-toggle`),
      labor: c.querySelector(`.${p}labor`),
      laborGrants: c.querySelector(`.${p}labor-grants`),
      laborDBs: c.querySelector(`.${p}labor-dbs`),
      laborAmount: c.querySelector(`.${p}labor-amount`),
      rankedFlash: c.querySelector(`.${p}ranked-flash`),
      tooltip: c.querySelector(`.${p}tooltip`),
      completion: c.querySelector(`.${p}completion`),
      detailPanel: c.querySelector(`.${p}detail-panel`),
      detailClose: c.querySelector(`.${p}detail-close`),
      detailBadges: c.querySelector(`.${p}detail-badges`),
      detailName: c.querySelector(`.${p}detail-name`),
      detailFunder: c.querySelector(`.${p}detail-funder`),
      detailAmount: c.querySelector(`.${p}detail-amount`),
      detailDeadline: c.querySelector(`.${p}detail-deadline`),
      detailFitNum: c.querySelector(`.${p}detail-fit-num`),
      detailGauge: c.querySelector(`.${p}detail-gauge`),
      detailSummary: c.querySelector(`.${p}detail-summary`),
      detailEligibility: c.querySelector(`.${p}detail-eligibility`),
      detailBtnPrimary: c.querySelector(`.${p}detail-btn-primary`),
    }

    // Build source cards
    this._buildSourceBar()

    // Legend toggle
    this._els.legendToggle?.addEventListener('click', () => {
      this._els.legend?.classList.toggle(`${p}collapsed`)
      this._legendCollapsed = !this._legendCollapsed
    })

    // Detail panel close button
    this._els.detailClose?.addEventListener('click', () => this._closeDetail())

    // Start progress bar
    this._startProgress()
  }

  // ========================================================================
  // PRIVATE: Build source bar
  // ========================================================================
  _buildSourceBar() {
    const p = this._prefix
    const bar = this._els.sourceBar
    if (!bar) return
    bar.innerHTML = ''
    this._sourceCards = {}

    const providers = ['db_results', 'gemini', 'perplexity_sonar_pro', 'openai_gpt5', 'claude_sonnet', 'grok']
    providers.forEach(prov => {
      const info = PROVIDER_DISPLAY[prov] || { name: prov, abbrev: '?' }
      const card = document.createElement('div')
      card.className = `${p}source-card`
      card.innerHTML = `
        <div class="${p}source-icon">${info.abbrev}</div>
        <div class="${p}source-info">
          <div class="${p}source-name">${info.name}</div>
          <div class="${p}source-status-text">Idle</div>
        </div>
      `
      bar.appendChild(card)
      this._sourceCards[prov] = card
    })
  }

  // ========================================================================
  // PRIVATE: Source status
  // ========================================================================
  _activateSource(provider) {
    const p = this._prefix
    const card = this._sourceCards[provider]
    if (!card) return
    card.classList.add(`${p}scanning`)
    card.classList.remove(`${p}complete`)
    const statusEl = card.querySelector(`.${p}source-status-text`)
    if (statusEl) statusEl.innerHTML = `Scanning<span class="${p}source-count-anim">...</span>`
  }

  _updateSourceCount(provider, count) {
    const p = this._prefix
    this._sourceFoundCounts[provider] = (this._sourceFoundCounts[provider] || 0) + count
    const card = this._sourceCards[provider]
    if (!card) return
    const statusEl = card.querySelector(`.${p}source-status-text`)
    if (statusEl) statusEl.innerHTML = `Found <span class="${p}source-count-anim">${this._sourceFoundCounts[provider]}</span>`
  }

  _completeSource(provider) {
    const p = this._prefix
    const card = this._sourceCards[provider]
    if (!card) return
    card.classList.remove(`${p}scanning`)
    card.classList.add(`${p}complete`)
    const count = this._sourceFoundCounts[provider] || 0
    const statusEl = card.querySelector(`.${p}source-status-text`)
    if (statusEl) statusEl.innerHTML = `<span style="color:#059669;">\u2713</span> ${count} found`
  }

  // ========================================================================
  // PRIVATE: Starfield
  // ========================================================================
  _createStarfield() {
    const el = this._els.starfield
    if (!el) return
    el.innerHTML = ''
    const p = this._prefix
    for (let i = 0; i < 30; i++) {
      const star = document.createElement('div')
      star.className = `${p}star`
      const size = Math.random() * 4 + 2
      star.style.cssText = `width:${size}px;height:${size}px;left:${Math.random() * 100}%;top:${Math.random() * 100}%;--oMin:${(Math.random() * 0.03 + 0.01).toFixed(3)};--oMax:${(Math.random() * 0.08 + 0.03).toFixed(3)};--dur:${(Math.random() * 6 + 3).toFixed(1)}s;--sc:${(Math.random() * 0.5 + 1).toFixed(2)};animation-delay:${(Math.random() * 4).toFixed(1)}s;`
      el.appendChild(star)
    }
  }

  // Sound system removed — no audio in visualization

  // ========================================================================
  // PRIVATE: Canvas & D3 setup
  // ========================================================================
  _initCanvas() {
    const d3 = this._d3
    if (!d3) return
    const wrap = this._els.canvas
    if (!wrap) return
    wrap.innerHTML = ''

    // Use getBoundingClientRect for reliable dimensions (clientWidth/Height
    // can return 0 if layout hasn't settled for absolutely-positioned elements)
    const rect = wrap.getBoundingClientRect()
    this._width = Math.round(rect.width) || 600
    this._height = Math.round(rect.height) || 400

    this._svg = d3.select(wrap).append('svg')
      .attr('viewBox', `0 0 ${this._width} ${this._height}`)
      // No width/height attrs — CSS width:100%;height:100% handles sizing;
      // viewBox ensures coordinate space matches measured dimensions

    // ResizeObserver to catch layout shifts after initial render
    if (typeof ResizeObserver !== 'undefined' && !this._resizeObserver) {
      this._resizeObserver = new ResizeObserver(() => {
        if (!this._destroyed) this._handleResize()
      })
      this._resizeObserver.observe(wrap)
    }

    this._defs = this._svg.append('defs')
    this._buildFilters()

    // Layer order
    this._corridorGroup = this._svg.append('g').attr('class', 'corridors')
    this._sonarGroup = this._svg.append('g').attr('class', 'sonar')
    this._linkGroup = this._svg.append('g').attr('class', 'links')
    this._nodeGroup = this._svg.append('g').attr('class', 'nodes')
    this._labelGroup = this._svg.append('g').attr('class', 'labels')

    this._drawCorridors()

    // Org center node
    const w = this._width, h = this._height
    this._orgNode = {
      id: 'org', x: w / 2, y: h / 2, fx: w / 2, fy: h / 2,
      radius: 24, isOrg: true,
    }
    this._activeNodes = [this._orgNode]
    this._activeLinks = []

    this._renderOrgNode()

    this._simulation = d3.forceSimulation(this._activeNodes)
      .force('radial', d3.forceRadial(d => {
        if (d.isOrg) return 0
        const fit = d.grant ? d.grant.fit : 50
        const maxR = Math.min(w, h) * 0.38
        const minR = 80
        return maxR - (fit / 100) * (maxR - minR)
      }, w / 2, h / 2).strength(0.3))
      .force('collide', d3.forceCollide(d => (d.radius || 20) + 16).strength(0.9).iterations(5))
      .force('charge', d3.forceManyBody().strength(-50))
      .force('centerX', d3.forceX(w / 2).strength(0.02))
      .force('centerY', d3.forceY(h / 2).strength(0.02))
      .alphaDecay(0.015)
      .velocityDecay(0.35)
      .on('tick', () => this._ticked())

    this._simulation.alpha(0.5).restart()
  }

  // ========================================================================
  // PRIVATE: SVG Filters
  // ========================================================================
  _buildFilters() {
    const defs = this._defs

    // Org glow
    const orgGlow = defs.append('filter').attr('id', 'gvd-orgGlow')
      .attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%')
    orgGlow.append('feGaussianBlur').attr('in', 'SourceGraphic').attr('stdDeviation', '10').attr('result', 'blur')
    orgGlow.append('feColorMatrix').attr('in', 'blur').attr('type', 'matrix')
      .attr('values', '1 0 0 0 0.72  0 1 0 0 0.58  0 0 1 0 0.05  0 0 0 0.5 0')
    const orgMerge = orgGlow.append('feMerge')
    orgMerge.append('feMergeNode').attr('in', 'blur')
    orgMerge.append('feMergeNode').attr('in', 'SourceGraphic')

    // Strong glow (90%+ fit)
    const strongGlow = defs.append('filter').attr('id', 'gvd-strongGlow')
      .attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%')
    strongGlow.append('feGaussianBlur').attr('in', 'SourceGraphic').attr('stdDeviation', '6').attr('result', 'blur')
    strongGlow.append('feColorMatrix').attr('in', 'blur').attr('type', 'matrix')
      .attr('values', '1 0 0 0 0.72  0 1 0 0 0.58  0 0 1 0 0.05  0 0 0 0.35 0')
    const strongMerge = strongGlow.append('feMerge')
    strongMerge.append('feMergeNode').attr('in', 'blur')
    strongMerge.append('feMergeNode').attr('in', 'SourceGraphic')

    // Subtle glow (70-89%)
    const subtleGlow = defs.append('filter').attr('id', 'gvd-subtleGlow')
      .attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%')
    subtleGlow.append('feGaussianBlur').attr('in', 'SourceGraphic').attr('stdDeviation', '3').attr('result', 'blur')
    const subtleMerge = subtleGlow.append('feMerge')
    subtleMerge.append('feMergeNode').attr('in', 'blur')
    subtleMerge.append('feMergeNode').attr('in', 'SourceGraphic')

    // Corona glow (champion)
    const coronaGlow = defs.append('filter').attr('id', 'gvd-coronaGlow')
      .attr('x', '-100%').attr('y', '-100%').attr('width', '300%').attr('height', '300%')
    coronaGlow.append('feGaussianBlur').attr('in', 'SourceGraphic').attr('stdDeviation', '14').attr('result', 'blur')
    coronaGlow.append('feColorMatrix').attr('in', 'blur').attr('type', 'matrix')
      .attr('values', '1 0 0 0 0.96  0 1 0 0 0.81  0 0 1 0 0.29  0 0 0 0.7 0')
    const coronaMerge = coronaGlow.append('feMerge')
    coronaMerge.append('feMergeNode').attr('in', 'blur')
    coronaMerge.append('feMergeNode').attr('in', 'SourceGraphic')

    // Urgency glow
    const urgencyGlow = defs.append('filter').attr('id', 'gvd-urgencyGlow')
      .attr('x', '-60%').attr('y', '-60%').attr('width', '220%').attr('height', '220%')
    urgencyGlow.append('feGaussianBlur').attr('in', 'SourceGraphic').attr('stdDeviation', '4').attr('result', 'blur')
    urgencyGlow.append('feColorMatrix').attr('in', 'blur').attr('type', 'matrix')
      .attr('values', '1 0 0 0 0.97  0 0 0 0 0.45  0 0 0 0 0.09  0 0 0 0.3 0')
    const urgMerge = urgencyGlow.append('feMerge')
    urgMerge.append('feMergeNode').attr('in', 'blur')
    urgMerge.append('feMergeNode').attr('in', 'SourceGraphic')

    // Selection glow
    const selGlow = defs.append('filter').attr('id', 'gvd-selectionGlow')
      .attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%')
    selGlow.append('feGaussianBlur').attr('in', 'SourceGraphic').attr('stdDeviation', '5').attr('result', 'blur')
    selGlow.append('feColorMatrix').attr('in', 'blur').attr('type', 'matrix')
      .attr('values', '1 0 0 0 0.96  0 1 0 0 0.81  0 0 1 0 0.29  0 0 0 0.6 0')
    const selMerge = selGlow.append('feMerge')
    selMerge.append('feMergeNode').attr('in', 'blur')
    selMerge.append('feMergeNode').attr('in', 'SourceGraphic')
  }

  // ========================================================================
  // PRIVATE: Corridors
  // ========================================================================
  _drawCorridors() {
    const cx = this._width / 2, cy = this._height / 2
    const maxLen = Math.max(this._width, this._height) * 0.55

    Object.keys(PROVIDER_DISPLAY).forEach(prov => {
      const info = PROVIDER_DISPLAY[prov]
      const x2 = cx + Math.cos(info.angle) * maxLen
      const y2 = cy + Math.sin(info.angle) * maxLen

      this._corridorGroup.append('line')
        .attr('class', `corridor corridor-${prov}`)
        .attr('x1', cx).attr('y1', cy)
        .attr('x2', x2).attr('y2', y2)
        .attr('stroke', TYPE_COLORS.Foundation)
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '6,6')
        .attr('opacity', 0.08)
    })
  }

  _activateCorridor(provider) {
    this._corridorGroup?.selectAll(`.corridor-${provider}`)
      .transition().duration(400)
      .attr('opacity', 0.25)
      .attr('stroke', '#B8940E')
      .transition().duration(3000)
      .attr('opacity', 0.08)
      .attr('stroke', TYPE_COLORS.Foundation)
  }

  // ========================================================================
  // PRIVATE: Sonar ping
  // ========================================================================
  _emitSonarPing(provider) {
    const d3 = this._d3
    const cx = this._width / 2, cy = this._height / 2
    const maxR = Math.max(this._width, this._height) * 0.5
    const typeMap = {
      db_results: 'Federal', gemini: 'Foundation', perplexity_sonar_pro: 'Foundation',
      openai_gpt5: 'Foundation', claude_sonnet: 'Foundation', grok: 'Corporate',
      perplexity_reasoning: 'Foundation',
    }
    const color = TYPE_COLORS[typeMap[provider]] || '#B8940E'

    const ping = this._sonarGroup?.append('circle')
      .attr('cx', cx).attr('cy', cy)
      .attr('r', 5)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-opacity', 0.3)
      .attr('stroke-width', 2)

    ping?.transition().duration(1500).ease(d3.easeQuadOut)
      .attr('r', maxR)
      .attr('stroke-opacity', 0)
      .attr('stroke-width', 0.5)
      .remove()
  }

  // ========================================================================
  // PRIVATE: Org node
  // ========================================================================
  _renderOrgNode() {
    const d3 = this._d3
    const p = this._prefix
    const orgName = this._config?.focusArea || 'Your Organization'

    this._nodeGroup.selectAll('.org-node').data([this._orgNode]).join(
      enter => {
        const g = enter.append('g').attr('class', 'org-node')
        g.append('circle').attr('r', 24).attr('fill', '#F5CF49').attr('filter', 'url(#gvd-orgGlow)').attr('opacity', 1)
        g.append('circle').attr('r', 30).attr('fill', 'none').attr('stroke', '#F5CF49')
          .attr('stroke-width', 1.5).attr('opacity', 0.3).attr('class', 'org-pulse-ring')
        return g
      }
    ).attr('transform', d => `translate(${d.x},${d.y})`)

    this._labelGroup.selectAll('.org-text').data([this._orgNode]).join(
      enter => enter.append('text').attr('class', `org-text ${p}org-label`).attr('dy', 40)
        .text(orgName.length > 30 ? orgName.slice(0, 28) + '...' : orgName)
    ).attr('x', d => d.x).attr('y', d => d.y)

    // Pulse animation
    const ring = this._svg?.select('.org-pulse-ring')
    if (ring && !ring.empty()) {
      const pulse = () => {
        if (this._destroyed) return
        ring.attr('r', 30).attr('opacity', 0.3)
          .transition().duration(2000).ease(d3.easeSinInOut)
          .attr('r', 42).attr('opacity', 0)
          .on('end', pulse)
      }
      pulse()
    }
  }

  // ========================================================================
  // PRIVATE: Tick function
  // ========================================================================
  _ticked() {
    const p = this._prefix
    const w = this._width, h = this._height

    this._activeNodes.forEach(d => {
      if (d.isOrg) return
      const margin = d.radius + 10
      d.x = Math.max(margin, Math.min(w - margin, d.x))
      d.y = Math.max(margin, Math.min(h - margin, d.y))
    })

    const org = this._orgNode

    this._linkGroup?.selectAll(`.${p}grant-link`)
      .attr('x1', org.x).attr('y1', org.y)
      .attr('x2', d => { const n = this._activeNodes.find(n => n.id === d.target); return n ? n.x : 0 })
      .attr('y2', d => { const n = this._activeNodes.find(n => n.id === d.target); return n ? n.y : 0 })

    this._activeLinks.forEach(ld => {
      const safeTarget = ld.target.replace(/[^a-zA-Z0-9_-]/g, '_')
      const grad = this._defs?.select(`#gvd-linkGrad-${safeTarget}`)
      if (grad && !grad.empty()) {
        const n = this._activeNodes.find(n => n.id === ld.target)
        if (n) grad.attr('x1', org.x).attr('y1', org.y).attr('x2', n.x).attr('y2', n.y)
      }
    })

    this._nodeGroup?.selectAll(`.${p}grant-node`).attr('transform', d => `translate(${d.x},${d.y})`)
    this._nodeGroup?.selectAll('.org-node').attr('transform', d => `translate(${d.x},${d.y})`)
    this._labelGroup?.selectAll(`.${p}label-name`).attr('x', d => d.x).attr('y', d => d.y + d.radius + 14)
    this._labelGroup?.selectAll(`.${p}label-fit`).attr('x', d => d.x).attr('y', d => d.y + d.radius + 25)
    this._labelGroup?.selectAll('.org-text').attr('x', org.x).attr('y', org.y)
  }

  // ========================================================================
  // PRIVATE: Add single grant node
  // ========================================================================
  _addSingleGrantNode(grant) {
    const d3 = this._d3
    const p = this._prefix
    const r = sizeForAmount(grant.amount)
    const provInfo = PROVIDER_DISPLAY[grant.provider] || { angle: 0, abbrev: '?' }
    const baseAngle = provInfo.angle || 0
    const hashCode = [...grant.id].reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0)
    const jitter = ((Math.abs(hashCode) * 137.508) % 360) * (Math.PI / 180)
    const angle = baseAngle + jitter
    const edgeDist = Math.max(this._width, this._height) * 0.3
    const startX = this._width / 2 + Math.cos(angle) * edgeDist
    const startY = this._height / 2 + Math.sin(angle) * edgeDist

    const ringProps = ringPropsForFit(grant.fit)
    const isUrgent = daysUntilDeadline(grant.deadline) <= 60

    const nodeData = {
      id: grant.id,
      x: startX + (Math.random() - 0.5) * 60,
      y: startY + (Math.random() - 0.5) * 60,
      radius: r, grant: grant, type: grant.type, isOrg: false,
    }
    this._activeNodes.push(nodeData)

    const linkData = { source: 'org', target: grant.id, fit: grant.fit, type: grant.type }
    this._activeLinks.push(linkData)

    // Link gradient
    const safeId = grant.id.replace(/[^a-zA-Z0-9_-]/g, '_')
    const gradId = `gvd-linkGrad-${safeId}`
    this._defs?.append('linearGradient').attr('id', gradId)
      .attr('gradientUnits', 'userSpaceOnUse')
      .call(g => {
        g.append('stop').attr('offset', '0%').attr('stop-color', 'rgba(181,148,14,0.4)').attr('stop-opacity', opacityForFit(grant.fit) * 0.5)
        g.append('stop').attr('offset', '100%').attr('stop-color', TYPE_COLORS[grant.type]).attr('stop-opacity', opacityForFit(grant.fit) * 0.3)
      })

    // Draw link
    this._linkGroup?.append('line').attr('class', `${p}grant-link`).datum(linkData)
      .attr('stroke', `url(#${gradId})`)
      .attr('stroke-width', grant.fit >= 90 ? 1.5 : 0.7)
      .attr('opacity', 0)
      .transition().duration(600)
      .attr('opacity', opacityForFit(grant.fit) * 0.25)

    // Node group
    const gNode = this._nodeGroup?.append('g').attr('class', `${p}grant-node`).datum(nodeData)
      .attr('transform', `translate(${nodeData.x},${nodeData.y})`)
      .style('cursor', 'pointer')
      .on('mouseenter', (event, d) => { this._showTooltip(event, d) })
      .on('mousemove', (event) => { this._moveTooltip(event) })
      .on('mouseleave', () => { this._hideTooltip() })
      .on('click', (event, d) => {
        event.stopPropagation()
        this._handleGrantClick(d)
      })

    // Glow filter
    let glowFilter = null
    if (ringProps.glowStrength === 'strong') glowFilter = 'url(#gvd-strongGlow)'
    else if (ringProps.glowStrength === 'subtle') glowFilter = 'url(#gvd-subtleGlow)'

    // Sparkles
    this._spawnSparkles(nodeData.x, nodeData.y, TYPE_COLORS[grant.type])

    // Circle grows
    gNode?.append('circle').attr('class', 'node-circle')
      .attr('r', 0).attr('fill', TYPE_COLORS[grant.type])
      .attr('opacity', opacityForFit(grant.fit))
      .attr('filter', glowFilter)
      .attr('stroke', 'rgba(255,255,255,0.6)').attr('stroke-width', 1)
      .transition().duration(300).ease(d3.easeBackOut.overshoot(1.5))
      .attr('r', r)

    // Fit ring
    const providerDash = PROVIDER_DASH[grant.provider] || 'none'
    if (providerDash === 'double') {
      gNode?.append('circle').attr('class', 'ring-outer').attr('r', 0)
        .attr('fill', 'none').attr('stroke', ringProps.color)
        .attr('stroke-width', Math.max(1, ringProps.width * 0.5)).attr('opacity', 0)
        .transition().delay(300).duration(300).ease(d3.easeBackOut.overshoot(1.5))
        .attr('r', r + ringProps.width + 2).attr('opacity', 0.8)
      gNode?.append('circle').attr('class', 'ring-inner').attr('r', 0)
        .attr('fill', 'none').attr('stroke', ringProps.color)
        .attr('stroke-width', Math.max(1, ringProps.width * 0.5)).attr('opacity', 0)
        .transition().delay(300).duration(300).ease(d3.easeBackOut.overshoot(1.5))
        .attr('r', r + 1).attr('opacity', 0.8)
    } else {
      const ring = gNode?.append('circle').attr('class', 'fit-ring').attr('r', 0)
        .attr('fill', 'none').attr('stroke', ringProps.color)
        .attr('stroke-width', ringProps.width).attr('opacity', 0)
      if (providerDash !== 'none') ring?.attr('stroke-dasharray', providerDash)
      ring?.transition().delay(300).duration(300).ease(d3.easeBackOut.overshoot(1.5))
        .attr('r', r + 1).attr('opacity', 0.8)
    }

    // Amount label for big grants
    if (grant.amount > 200000) {
      const amountText = gNode?.append('text')
        .attr('class', 'amount-label')
        .attr('text-anchor', 'middle').attr('y', -(r + 8))
        .attr('font-family', 'DM Sans, sans-serif')
        .attr('font-size', '10px').attr('font-weight', '600')
        .attr('fill', '#B8940E').attr('opacity', 0)

      amountText?.transition().delay(600).duration(300)
        .attr('opacity', 0.8)
        .tween('text', function() {
          const i = d3.interpolateNumber(0, grant.amount)
          return function(t) {
            d3.select(this).text(formatAmount(Math.round(i(t))))
          }
        })
    }

    // Fit arc
    const fitArc = gNode?.append('circle')
      .attr('class', 'fit-arc')
      .attr('r', r + 5)
      .attr('fill', 'none')
      .attr('stroke', grant.fit >= 90 ? '#B8940E' : grant.fit >= 70 ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.1)')
      .attr('stroke-width', 2)
      .attr('opacity', 0)

    const circumference = 2 * Math.PI * (r + 5)
    const fitFraction = grant.fit / 100
    fitArc?.attr('stroke-dasharray', `0 ${circumference}`)
      .attr('transform', 'rotate(-90)')
      .transition().delay(900).duration(300)
      .attr('opacity', 0.6)
      .attr('stroke-dasharray', `${fitFraction * circumference} ${circumference}`)

    // Urgency pulse
    if (isUrgent) {
      const urgencyR = r + 5
      const pulseRing = gNode?.append('circle').attr('class', 'urgency-ring')
        .attr('r', urgencyR).attr('fill', 'none').attr('stroke', '#F97316')
        .attr('stroke-width', 2).attr('opacity', 0.25).attr('filter', 'url(#gvd-urgencyGlow)')
      function pulseUrgency() {
        pulseRing?.attr('r', urgencyR).attr('opacity', 0.3).attr('stroke-width', 2)
          .transition().duration(3500).ease(d3.easeSinInOut)
          .attr('r', urgencyR + 5).attr('opacity', 0.08).attr('stroke-width', 1)
          .on('end', pulseUrgency)
      }
      pulseUrgency()
    }

    // Source letter
    const srcLetter = (PROVIDER_DISPLAY[grant.provider] || {}).abbrev || '?'
    gNode?.append('text').attr('class', 'source-letter')
      .attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
      .attr('font-family', 'DM Sans, sans-serif')
      .attr('font-size', r < 25 ? '8px' : '10px').attr('font-weight', '600')
      .attr('fill', 'rgba(255,255,255,0.7)').attr('pointer-events', 'none')
      .text(srcLetter.slice(0, 2)).attr('opacity', 0)
      .transition().delay(400).duration(300).attr('opacity', 1)

    // Labels for big grants
    if (grant.amount >= 300000) {
      const shortName = grant.name.length > 18 ? grant.name.slice(0, 16) + '...' : grant.name
      this._labelGroup?.append('text').datum(nodeData)
        .attr('class', `${p}label-name ${p}node-label`)
        .attr('x', nodeData.x).attr('y', nodeData.y + r + 14)
        .text(shortName).attr('opacity', 0)
        .transition().delay(300).duration(400).attr('opacity', 0.55)
      this._labelGroup?.append('text').datum(nodeData)
        .attr('class', `${p}label-fit ${p}node-label-fit`)
        .attr('x', nodeData.x).attr('y', nodeData.y + r + 25)
        .text(`${grant.fit}% fit`).attr('opacity', 0)
        .transition().delay(400).duration(400).attr('opacity', 0.45)
    }


    // Update tracked state
    this._revealedGrants.push(grant)
    this._updateLegend(grant)
    this._addToRankedList(grant)
    this._checkChampion(grant)

    // Update simulation
    this._simulation?.nodes(this._activeNodes)
    this._simulation?.force('collide', this._d3.forceCollide(d => (d.radius || 20) + 16).strength(0.9).iterations(5))
    this._simulation?.alpha(Math.min(0.8, (this._simulation?.alpha() || 0) + 0.3)).restart()

    // Update counter
    this._animateCounter(this._revealedGrants.length)
  }

  // ========================================================================
  // PRIVATE: Sparkles
  // ========================================================================
  _spawnSparkles(x, y, color) {
    const p = this._prefix
    const wrap = this._els.canvas
    if (!wrap) return
    for (let i = 0; i < 4; i++) {
      const spark = document.createElement('div')
      spark.className = `${p}sparkle`
      const ox = (Math.random() - 0.5) * 30
      const oy = (Math.random() - 0.5) * 30
      spark.style.left = (x + ox - 10) + 'px'
      spark.style.top = (y + oy - 10) + 'px'
      spark.style.background = `radial-gradient(circle, ${color}60, transparent)`
      spark.style.animationDelay = (i * 60) + 'ms'
      wrap.appendChild(spark)
      this._timers.push(setTimeout(() => spark.remove(), 700))
    }
  }

  // ========================================================================
  // PRIVATE: Champion
  // ========================================================================
  _checkChampion(grant) {
    const d3 = this._d3
    const engine = this // eslint-disable-line @typescript-eslint/no-this-alias
    if (!this._currentChampion || grant.fit > this._currentChampion.fit) {
      const prev = this._currentChampion
      this._currentChampion = grant

      if (prev) {
        this._nodeGroup?.selectAll(`.${this._prefix}grant-node`)
          .filter(d => d.id === prev.id)
          .each(function() {
            const g = d3.select(this)
            g.select('.champion-crown').transition().duration(300).attr('opacity', 0).remove()
            g.select('.champion-glow').transition().duration(300).attr('opacity', 0).remove()
          })
      }

      this._timers.push(setTimeout(() => {
        if (this._destroyed) return
        this._nodeGroup?.selectAll(`.${this._prefix}grant-node`)
          .filter(d => d.id === grant.id)
          .each(function(d) {
            const g = d3.select(this)
            g.select('.champion-crown').remove()
            g.select('.champion-glow').remove()
            g.append('circle').attr('class', 'champion-glow')
              .attr('r', d.radius + 10).attr('fill', 'none')
              .attr('stroke', '#F5CF49').attr('stroke-width', 3)
              .attr('opacity', 0).attr('filter', 'url(#gvd-coronaGlow)')
              .transition().duration(400).attr('opacity', 0.5)
            g.append('text').attr('class', 'champion-crown')
              .attr('text-anchor', 'middle').attr('x', 0).attr('y', -(d.radius + 10))
              .attr('font-size', '18px').text('\u{1F451}')
              .attr('opacity', 0)
              .transition().delay(200).duration(300).attr('opacity', 1)
            engine._spawnSparkles(d.x, d.y, '#F5CF49')
          })
      }, prev ? 400 : 0))

      this._renderRankedList()
    }
  }

  // ========================================================================
  // PRIVATE: Legend
  // ========================================================================
  _updateLegend(grant) {
    this._legendTypes[grant.type] = (this._legendTypes[grant.type] || 0) + 1
    this._legendProviders[grant.providerName || grant.provider] = (this._legendProviders[grant.providerName || grant.provider] || 0) + 1
    if (grant.fit >= 90) this._legendScoreRanges['90%+ (excellent)'] = (this._legendScoreRanges['90%+ (excellent)'] || 0) + 1
    else if (grant.fit >= 70) this._legendScoreRanges['70-89% (strong)'] = (this._legendScoreRanges['70-89% (strong)'] || 0) + 1
    else this._legendScoreRanges['<70% (potential)'] = (this._legendScoreRanges['<70% (potential)'] || 0) + 1
    if (daysUntilDeadline(grant.deadline) <= 60) this._legendHasUrgent = true
    this._renderLegend()
  }

  _renderLegend() {
    const p = this._prefix
    const container = this._els.legendBody
    if (!container) return
    let html = ''

    const typeEntries = Object.entries(this._legendTypes)
    if (typeEntries.length > 0) {
      html += `<div class="${p}legend-section-title">Funder Type</div>`
      typeEntries.forEach(([type, count]) => {
        html += `<div class="${p}legend-row"><div class="${p}legend-dot" style="background:${TYPE_COLORS[type]}"></div> ${type} (${count})</div>`
      })
    }

    const scoreOrder = ['90%+ (excellent)', '70-89% (strong)', '<70% (potential)']
    const hasScores = scoreOrder.some(l => this._legendScoreRanges[l])
    if (hasScores) {
      html += `<div class="${p}legend-section-title">Fit Score</div>`
      const scoreStyles = {
        '90%+ (excellent)': 'border:2px solid #B8940E;box-shadow:0 0 4px rgba(245,207,73,0.3);',
        '70-89% (strong)': 'border:2px solid rgba(0,0,0,0.2);',
        '<70% (potential)': 'border:1px solid rgba(0,0,0,0.1);',
      }
      scoreOrder.forEach(label => {
        if (this._legendScoreRanges[label]) {
          html += `<div class="${p}legend-row"><div class="${p}legend-ring-sample" style="${scoreStyles[label]}"></div> ${label} (${this._legendScoreRanges[label]})</div>`
        }
      })
    }

    container.innerHTML = html
  }

  // ========================================================================
  // PRIVATE: Ranked list
  // ========================================================================
  _addToRankedList() {
    this._renderRankedList()
  }

  _renderRankedList(customOrder) {
    const p = this._prefix
    const listEl = this._els.sidebarList
    const countEl = this._els.sidebarBadge
    if (!listEl || !countEl) return

    countEl.textContent = this._revealedGrants.length

    let orderedGrants
    if (customOrder) {
      orderedGrants = customOrder.map(id => this._revealedGrants.find(g => g.id === id)).filter(Boolean)
    } else {
      orderedGrants = [...this._revealedGrants].sort((a, b) => b.fit - a.fit)
    }

    const bestId = this._currentChampion ? this._currentChampion.id : null
    listEl.innerHTML = ''

    orderedGrants.forEach((grant, idx) => {
      const rank = idx + 1
      const isBest = grant.id === bestId
      const isSelected = grant.id === this._selectedId
      const typeColor = TYPE_COLORS[grant.type]
      const fitBg = grant.fit >= 90 ? 'rgba(245,207,73,0.15)' : grant.fit >= 70 ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.03)'
      const fitColor = grant.fit >= 90 ? '#B8940E' : grant.fit >= 70 ? '#4B5563' : '#9CA3AF'
      const shortName = grant.name.length > 24 ? grant.name.slice(0, 22) + '...' : grant.name

      const item = document.createElement('div')
      item.className = `${p}ranked-item${isBest ? ` ${p}best` : ''}${isSelected ? ` ${p}selected` : ''}`
      item.dataset.grantId = grant.id
      item.style.animationDelay = (idx * 30) + 'ms'
      item.innerHTML = `
        ${isBest ? `<span class="${p}rank-crown">\u{1F451}</span>` : ''}
        <span class="${p}rank-num">${rank}</span>
        <div class="${p}rank-info">
          <div class="${p}rank-name">${shortName}</div>
          <div class="${p}rank-meta">
            <span style="color:${typeColor};">${grant.type}</span>
            <span>&middot;</span>
            <span>${grant.amountStr || formatAmount(grant.amount, grant.amountStr)}</span>
          </div>
        </div>
        <span class="${p}rank-fit" style="background:${fitBg};color:${fitColor};">${grant.fit}%</span>
      `
      item.addEventListener('click', () => this._handleGrantClick(
        this._activeNodes.find(n => n.id === grant.id) || { grant }
      ))
      listEl.appendChild(item)
    })
  }

  // ========================================================================
  // PRIVATE: Tooltip
  // ========================================================================
  _showTooltip(event, d) {
    if (!d.grant) return
    const p = this._prefix
    const g = d.grant
    const tt = this._els.tooltip
    if (!tt) return

    tt.querySelector(`.${p}tt-name`).textContent = g.name
    tt.querySelector(`.${p}tt-funder`).textContent = g.funder
    tt.querySelector(`.${p}tt-amount`).textContent = g.amountStr || formatAmount(g.amount)
    tt.querySelector(`.${p}tt-deadline`).textContent = 'Due ' + (g.deadline || 'Rolling')
    const fitEl = tt.querySelector(`.${p}tt-fit`)
    fitEl.textContent = g.fit + '% fit'
    fitEl.style.background = TYPE_COLORS[g.type] + '18'
    fitEl.style.color = TYPE_COLORS[g.type]
    tt.querySelector(`.${p}tt-desc`).textContent = g.summary ? '"' + g.summary.slice(0, 80) + '..."' : ''
    tt.classList.add(`${p}visible`)
    this._moveTooltip(event)
  }

  _moveTooltip(event) {
    const tt = this._els.tooltip
    if (!tt) return
    let x = event.clientX + 16
    let y = event.clientY - 10
    const ttRect = tt.getBoundingClientRect()
    if (x + ttRect.width > window.innerWidth - 20) x = event.clientX - ttRect.width - 16
    if (y + ttRect.height > window.innerHeight - 10) y = window.innerHeight - ttRect.height - 10
    if (y < 10) y = 10
    tt.style.left = x + 'px'
    tt.style.top = y + 'px'
  }

  _hideTooltip() {
    const p = this._prefix
    this._els.tooltip?.classList.remove(`${p}visible`)
  }

  // ========================================================================
  // PRIVATE: Grant click → open detail panel
  // ========================================================================
  _handleGrantClick(d) {
    if (!d?.grant) return
    const p = this._prefix
    const d3 = this._d3
    const g = d.grant

    // Track selection
    this._selectedId = d.id

    // Remove prior selection rings
    this._nodeGroup?.selectAll('.selection-ring').remove()
    this._nodeGroup?.selectAll('.selection-glow').remove()

    // --- Populate detail panel ---
    const typeColor = TYPE_COLORS[g.type] || '#6B7280'

    // Badges: type + source
    if (this._els.detailBadges) {
      this._els.detailBadges.innerHTML =
        `<span class="${p}detail-badge ${p}detail-badge-type" style="color:${typeColor};border-color:${typeColor}30;background:${typeColor}0A;">${g.type}</span>` +
        `<span class="${p}detail-badge ${p}detail-badge-source">via ${g.providerName || g.provider}</span>`
    }

    // Text fields
    if (this._els.detailName) this._els.detailName.textContent = g.name
    if (this._els.detailFunder) this._els.detailFunder.textContent = g.funder || ''
    if (this._els.detailAmount) this._els.detailAmount.textContent = g.amountStr || formatAmount(g.amount)
    if (this._els.detailDeadline) this._els.detailDeadline.textContent = g.deadline || 'Rolling'
    if (this._els.detailFitNum) this._els.detailFitNum.textContent = g.fit + '%'
    if (this._els.detailSummary) this._els.detailSummary.textContent = g.summary || ''
    if (this._els.detailEligibility) this._els.detailEligibility.textContent = g.eligibility || 'Contact funder for eligibility details.'

    // View Grant link
    if (this._els.detailBtnPrimary) {
      if (g.url) {
        this._els.detailBtnPrimary.href = g.url
        this._els.detailBtnPrimary.style.pointerEvents = ''
        this._els.detailBtnPrimary.style.opacity = ''
      } else {
        this._els.detailBtnPrimary.removeAttribute('href')
        this._els.detailBtnPrimary.style.pointerEvents = 'none'
        this._els.detailBtnPrimary.style.opacity = '0.4'
      }
    }

    // Fit gauge
    this._drawFitGauge(g.fit, typeColor)

    // --- Open panel (overlays on canvas, no layout shift) ---
    this._els.detailPanel?.classList.add(`${p}open`)

    // --- Highlight selected node, dim others ---
    this._nodeGroup?.selectAll(`.${p}grant-node`).select('.node-circle')
      .transition().duration(300)
      .attr('opacity', nd => nd.id === d.id ? 1 : 0.25)

    this._linkGroup?.selectAll(`.${p}grant-link`)
      .transition().duration(300)
      .attr('opacity', ld => ld.target === d.id ? opacityForFit(ld.fit) * 0.6 : 0.04)
      .attr('stroke-width', ld => ld.target === d.id ? 2.5 : 0.5)

    // Selection glow + ring on clicked node
    this._nodeGroup?.selectAll(`.${p}grant-node`).filter(nd => nd.id === d.id)
      .each(function(nd) {
        const gEl = d3.select(this)
        gEl.append('circle').attr('class', 'selection-glow')
          .attr('r', nd.radius + 10)
          .attr('fill', 'none').attr('stroke', '#F5CF49')
          .attr('stroke-width', 3).attr('opacity', 0.4)
          .attr('filter', 'url(#gvd-selectionGlow)')
        gEl.append('circle').attr('class', 'selection-ring')
          .attr('r', nd.radius + 5)
          .attr('fill', 'none').attr('stroke', '#F5CF49')
          .attr('stroke-width', 3).attr('opacity', 0.9)
      })

    // Highlight sidebar item
    this._highlightSidebarItem(d.id)

    // --- Also emit to parent React (secondary) ---
    if (this._onGrantSelectCb) {
      this._onGrantSelectCb({
        id: g.id,
        name: g.name,
        funder: g.funder,
        amount: g.amountStr || formatAmount(g.amount),
        deadline: g.deadline,
        fit_score: g.fit,
        summary: g.summary,
        type: g.type,
        url: g.url,
        eligibility: g.eligibility,
      })
    }
  }

  // ========================================================================
  // PRIVATE: Close detail panel
  // ========================================================================
  _closeDetail() {
    const p = this._prefix
    this._selectedId = null

    // Close panel (no layout shift to undo)
    this._els.detailPanel?.classList.remove(`${p}open`)

    // Remove selection visuals
    this._nodeGroup?.selectAll('.selection-ring').remove()
    this._nodeGroup?.selectAll('.selection-glow').remove()

    // Restore node opacities
    this._nodeGroup?.selectAll(`.${p}grant-node`).select('.node-circle')
      .transition().duration(300)
      .attr('opacity', nd => opacityForFit(nd.grant?.fit || 50))

    // Restore link opacities
    this._linkGroup?.selectAll(`.${p}grant-link`)
      .transition().duration(300)
      .attr('opacity', ld => opacityForFit(ld.fit) * 0.25)
      .attr('stroke-width', ld => ld.fit >= 90 ? 1.5 : 0.7)

    // Clear sidebar highlight
    this._highlightSidebarItem(null)
  }

  // ========================================================================
  // PRIVATE: Draw fit gauge SVG arc
  // ========================================================================
  _drawFitGauge(fit, color) {
    const gaugeEl = this._els.detailGauge?.querySelector('svg')
    if (!gaugeEl) return
    gaugeEl.innerHTML = ''

    const cx = 36, cy = 36, r = 30
    const circumference = 2 * Math.PI * r
    const pct = fit / 100

    // Background track
    const track = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    track.setAttribute('cx', cx)
    track.setAttribute('cy', cy)
    track.setAttribute('r', r)
    track.setAttribute('fill', 'none')
    track.setAttribute('stroke', 'rgba(0,0,0,0.06)')
    track.setAttribute('stroke-width', '4')
    gaugeEl.appendChild(track)

    // Colored arc
    const arc = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    arc.setAttribute('cx', cx)
    arc.setAttribute('cy', cy)
    arc.setAttribute('r', r)
    arc.setAttribute('fill', 'none')
    arc.setAttribute('stroke', color)
    arc.setAttribute('stroke-width', '4')
    arc.setAttribute('stroke-linecap', 'round')
    arc.setAttribute('stroke-dasharray', `${pct * circumference} ${circumference}`)
    arc.setAttribute('transform', `rotate(-90 ${cx} ${cy})`)
    arc.style.transition = 'stroke-dasharray 0.8s ease'
    gaugeEl.appendChild(arc)
  }

  // ========================================================================
  // PRIVATE: Highlight sidebar item
  // ========================================================================
  _highlightSidebarItem(id) {
    const p = this._prefix
    const items = this._els.sidebarList?.querySelectorAll(`.${p}ranked-item`)
    if (!items) return
    items.forEach(el => {
      el.classList.toggle(`${p}selected`, el.dataset.grantId === id)
    })
  }

  // ========================================================================
  // PRIVATE: Reveal cadence
  // ========================================================================
  _getNextDelay() {
    if (this._cadenceState.inPause) {
      this._cadenceState.inPause = false
      this._cadenceState.fastCount = 0
      return 2000 + Math.random() * 1000
    }
    this._cadenceState.fastCount++
    if (this._cadenceState.fastCount >= 2 + Math.floor(Math.random() * 2)) {
      this._cadenceState.inPause = true
      return 600
    }
    return 600
  }

  _pickNextGrant() {
    if (this._revealQueue.length === 0) return null
    this._revealQueue.sort((a, b) => b.fit - a.fit)

    if (this._llmHasArrived) {
      const idx = Math.floor(Math.random() * this._revealQueue.length)
      return this._revealQueue.splice(idx, 1)[0]
    } else {
      const windowBracket = Math.floor(this._revealedCount / 3)
      const poolWindowSize = 5 + windowBracket * 5
      const effectiveWindow = Math.min(poolWindowSize, this._revealQueue.length)
      const idx = Math.floor(Math.random() * effectiveWindow)
      return this._revealQueue.splice(idx, 1)[0]
    }
  }

  _scheduleNextReveal() {
    if (this._revealQueue.length === 0 || this._revealTimer !== null || this._destroyed) return

    const delay = this._getNextDelay()
    this._revealTimer = setTimeout(() => {
      this._revealTimer = null
      if (this._revealQueue.length === 0 || this._destroyed) return

      const grant = this._pickNextGrant()
      if (!grant) return

      this._addSingleGrantNode(grant)
      this._revealedCount++

      // Rebalance forces periodically
      if (this._revealedCount % 5 === 0) this._rebalanceForces()

      if (this._revealQueue.length > 0) this._scheduleNextReveal()
    }, delay)
    this._timers.push(this._revealTimer)
  }

  _rebalanceForces() {
    if (this._rerankDone || !this._simulation) return
    const d3 = this._d3
    const w = this._width, h = this._height
    this._simulation.force('radial', d3.forceRadial(d => {
      if (d.isOrg) return 0
      const fit = d.grant ? d.grant.fit : 50
      const maxR = Math.min(w, h) * 0.38
      const minR = 80
      return maxR - (fit / 100) * (maxR - minR)
    }, w / 2, h / 2).strength(0.08))
    this._simulation.alpha(0.3).restart()
  }

  // ========================================================================
  // PRIVATE: Ticker
  // ========================================================================
  _setTicker(text) {
    if (this._els.ticker) this._els.ticker.textContent = text
  }

  _startCompletionTeasers() {
    const topFit = this._revealedGrants.length > 0 ? Math.max(...this._revealedGrants.map(g => g.fit)) : 0
    const high90 = this._revealedGrants.filter(g => g.fit >= 90).length
    const over500K = this._revealedGrants.filter(g => g.amount >= 500000).length
    const totalAmount = this._revealedGrants.reduce((sum, g) => sum + g.amount, 0)
    const totalStr = totalAmount >= 1000000 ? '$' + (totalAmount / 1000000).toFixed(1) + 'M' : '$' + Math.round(totalAmount / 1000) + 'K'

    const teasers = [
      `Your top match has a ${topFit}% fit score`,
      `${high90} grants with 90%+ fit`,
      `Over ${totalStr} in matching grants found`,
    ].filter(t => !t.includes('0 grants with'))

    if (teasers.length === 0) return
    let idx = 0
    this._setTicker(teasers[0])
    this._tickerInterval = setInterval(() => {
      if (this._destroyed) { clearInterval(this._tickerInterval); return }
      idx = (idx + 1) % teasers.length
      this._setTicker(teasers[idx])
    }, 3500)
  }

  // ========================================================================
  // PRIVATE: Counter animation
  // ========================================================================
  _animateCounter(target) {
    const p = this._prefix
    const el = this._els.counter
    if (!el) return
    el.textContent = target
    el.classList.add(`${p}bump`)
    this._timers.push(setTimeout(() => el?.classList.remove(`${p}bump`), 150))
  }

  // ========================================================================
  // PRIVATE: Progress bar
  // ========================================================================
  _startProgress() {
    const startTime = performance.now()
    const update = () => {
      if (this._destroyed) return
      const elapsed = performance.now() - startTime
      // Progress over ~60s, but capped so it doesn't complete before 'complete' envelope
      const pct = Math.min(95, (elapsed / 60000) * 100)
      if (this._els.progressFill) this._els.progressFill.style.width = pct + '%'
      if (pct < 95) this._progressRAF = requestAnimationFrame(update)
    }
    this._progressRAF = requestAnimationFrame(update)
  }

  // ========================================================================
  // PRIVATE: Labor counter
  // ========================================================================
  _startLaborCounter() {
    const p = this._prefix
    const labor = this._els.labor
    if (!labor) return
    labor.classList.add(`${p}visible`)

    this._laborStartTime = performance.now()
    const laborGrantsTarget = 67000
    const laborTargetDBs = 12

    const tick = () => {
      if (this._destroyed) return
      const elapsed = performance.now() - this._laborStartTime
      const progress = Math.min(1, elapsed / 60000)

      const easedProgress = 1 - Math.pow(1 - progress, 2)
      const currentGrants = Math.round(easedProgress * laborGrantsTarget)
      const currentDBs = Math.min(laborTargetDBs, Math.floor(progress * laborTargetDBs * 1.3) + 1)

      const matchAmount = this._revealedGrants.reduce((sum, g) => sum + g.amount, 0)

      if (this._els.laborGrants) this._els.laborGrants.textContent = currentGrants.toLocaleString()
      if (this._els.laborDBs) this._els.laborDBs.textContent = currentDBs
      if (this._els.laborAmount) {
        this._els.laborAmount.textContent = matchAmount >= 1000000
          ? '$' + (matchAmount / 1000000).toFixed(1) + 'M'
          : matchAmount > 0 ? '$' + Math.round(matchAmount / 1000) + 'K' : '$0'
      }

      if (progress < 1) this._laborRAF = requestAnimationFrame(tick)
    }
    this._laborRAF = requestAnimationFrame(tick)
  }

  // ========================================================================
  // PRIVATE: Resize
  // ========================================================================
  _handleResize() {
    if (this._destroyed || !this._simulation) return
    const d3 = this._d3
    const wrap = this._els.canvas
    if (!wrap) return

    const rect = wrap.getBoundingClientRect()
    const newW = Math.round(rect.width)
    const newH = Math.round(rect.height)
    // Skip if dimensions haven't meaningfully changed or are invalid
    if (newW < 100 || newH < 100) return
    if (Math.abs(newW - this._width) < 5 && Math.abs(newH - this._height) < 5) return

    this._width = newW
    this._height = newH
    this._svg?.attr('viewBox', `0 0 ${this._width} ${this._height}`)

    if (this._orgNode) {
      this._orgNode.fx = this._width / 2
      this._orgNode.fy = this._height / 2
    }

    const w = this._width, h = this._height
    this._simulation.force('radial', d3.forceRadial(d => {
      if (d.isOrg) return 0
      const fit = d.grant ? d.grant.fit : 50
      const maxR = Math.min(w, h) * 0.38
      const minR = 80
      return maxR - (fit / 100) * (maxR - minR)
    }, w / 2, h / 2).strength(0.08))
    this._simulation.alpha(0.3).restart()
  }

  // ========================================================================
  // PRIVATE: Clear timers
  // ========================================================================
  _clearTimers() {
    this._timers.forEach(t => clearTimeout(t))
    this._timers = []
    if (this._revealTimer) { clearTimeout(this._revealTimer); this._revealTimer = null }
    if (this._progressRAF) cancelAnimationFrame(this._progressRAF)
    if (this._laborRAF) cancelAnimationFrame(this._laborRAF)
    if (this._tickerInterval) { clearInterval(this._tickerInterval); this._tickerInterval = null }
    if (this._simulation) this._simulation.stop()
  }
}
