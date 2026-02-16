// site/lib/viz/engine-e.js
// Concept E: Rising Stakes — CSS Grid bento visualization
// Standalone engine, mounted by React wrapper

const PROVIDER_DISPLAY = {
  db_results:            { name: 'Database',      abbrev: 'DB'  },
  gemini:                { name: 'Gemini',        abbrev: 'GEM' },
  perplexity_sonar_pro:  { name: 'Perplexity',    abbrev: 'PX'  },
  openai_gpt5:           { name: 'OpenAI',        abbrev: 'GPT' },
  claude_sonnet:         { name: 'Claude',        abbrev: 'CL'  },
  perplexity_reasoning:  { name: 'Perplexity R',  abbrev: 'PXR' },
  grok:                  { name: 'Grok',          abbrev: 'GRK' },
}

const TYPE_COLORS = { Federal: '#2563EB', Foundation: '#7C3AED', Corporate: '#059669' }

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
  min-height: 80vh;
  overflow: visible;
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
  height: 56px;
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex; align-items: center;
  padding: 0 24px;
  border-bottom: 1px solid var(--border-light);
}
.${p}header-center {
  flex: 1;
  display: flex; flex-direction: column; align-items: center;
  gap: 1px;
}
.${p}grant-counter {
  font-size: 13px; font-weight: 500;
  color: var(--text-secondary);
  letter-spacing: 0.04em;
}
.${p}grant-counter .${p}count {
  font-family: var(--font-display);
  font-size: 20px;
  color: #B8940E;
  display: inline-block;
  min-width: 24px;
  text-align: center;
  transition: transform 0.15s ease;
}
.${p}grant-counter .${p}count.${p}bump {
  transform: scale(1.3);
}
.${p}header-right {
  display: flex; align-items: center; gap: 14px;
  min-width: 100px;
  justify-content: flex-end;
}

/* ───── Source Status Bar ───── */
.${p}source-bar {
  position: absolute; top: 56px; left: 0; right: 0;
  z-index: 99;
  height: 48px;
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-light);
  display: flex; align-items: center; justify-content: center;
  gap: 10px;
  padding: 0 16px;
}
.${p}source-card {
  width: 120px; height: 34px;
  border-radius: 8px;
  border: 1px solid var(--border-light);
  background: rgba(250,250,250,0.8);
  display: flex; align-items: center; justify-content: center;
  gap: 6px;
  font-size: 11px; font-weight: 600;
  color: var(--text-secondary);
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
}
.${p}source-abbrev {
  font-weight: 700;
  letter-spacing: 0.03em;
}
.${p}source-state {
  font-weight: 400;
  font-size: 10px;
  opacity: 0.7;
}
.${p}source-card.${p}scanning {
  border-color: var(--brand);
  background: rgba(245,207,73,0.06);
  box-shadow: 0 0 10px var(--brand-dim);
  color: #B8940E;
}
.${p}source-card.${p}scanning::before {
  content: '';
  position: absolute; inset: 0;
  border-radius: 8px;
  border: 1px solid var(--brand);
  animation: ${p}sourcePulse 1.5s ease-in-out infinite;
}
@keyframes ${p}sourcePulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.8; }
}
.${p}source-card.${p}complete {
  border-color: #059669;
  color: #059669;
}
.${p}source-card.${p}complete .${p}check-icon {
  display: inline;
}
.${p}check-icon { display: none; }

/* ───── Ticker bar ───── */
.${p}ticker-bar {
  position: absolute; top: 104px; left: 0; right: 0;
  z-index: 98;
  height: 30px;
  background: linear-gradient(90deg, rgba(245,207,73,0.08), rgba(245,207,73,0.04), rgba(245,207,73,0.08));
  border-bottom: 1px solid rgba(245,207,73,0.12);
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 500;
  color: #B8940E;
  overflow: hidden;
  transition: opacity 0.4s ease;
}
.${p}ticker-text {
  white-space: nowrap;
}

/* ───── Progress bar ───── */
.${p}progress-track {
  position: absolute; top: 134px; left: 0; right: 0;
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

/* ───── Ranked Sidebar (left) ───── */
.${p}ranked-sidebar {
  position: absolute;
  top: 137px; left: 0; bottom: 0;
  width: 280px;
  z-index: 50;
  background: rgba(255,255,255,0.96);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-right: 1px solid var(--border-light);
  display: flex; flex-direction: column;
  overflow: hidden;
}
.${p}ranked-header {
  padding: 14px 18px 12px;
  border-bottom: 1px solid var(--border-light);
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  display: flex; align-items: center; gap: 8px;
}
.${p}count-badge {
  background: var(--brand);
  color: #1A1A2E;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 10px;
  min-width: 24px;
  text-align: center;
}
.${p}ranked-list {
  flex: 1;
  overflow-y: auto;
  padding: 4px 0;
}
.${p}ranked-list::-webkit-scrollbar { width: 3px; }
.${p}ranked-list::-webkit-scrollbar-track { background: transparent; }
.${p}ranked-list::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 2px; }
.${p}ranked-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 18px;
  cursor: pointer;
  transition: background 0.15s ease;
  border-bottom: 1px solid rgba(0,0,0,0.03);
  animation: ${p}slideInLeft 0.35s ease forwards;
  opacity: 0;
}
@keyframes ${p}slideInLeft {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}
.${p}ranked-item:hover {
  background: rgba(245,207,73,0.06);
}
.${p}ranked-item.${p}selected {
  background: rgba(245,207,73,0.12);
  border-left: 3px solid var(--brand);
}
.${p}rank-num {
  font-family: var(--font-display);
  font-size: 16px;
  color: var(--text-secondary);
  min-width: 22px;
  text-align: center;
}
.${p}ranked-item.${p}best-match .${p}rank-num {
  color: #B8940E;
}
.${p}rank-info {
  flex: 1;
  min-width: 0;
}
.${p}rank-name {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
}
.${p}rank-meta {
  font-size: 10px;
  color: var(--text-secondary);
  display: flex; gap: 6px; align-items: center;
  margin-top: 2px;
}
.${p}rank-fit {
  font-size: 10px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 8px;
  white-space: nowrap;
  flex-shrink: 0;
}
.${p}rank-crown {
  font-size: 14px;
  flex-shrink: 0;
}

/* ───── Detail Panel ───── */
.${p}detail-panel {
  position: absolute;
  top: 137px; left: 280px; bottom: 0;
  width: 350px;
  z-index: 45;
  background: #FFFFFF;
  border-right: 1px solid var(--border-light);
  box-shadow: 4px 0 40px rgba(0,0,0,0.08);
  transform: translateX(-100%);
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
}
.${p}detail-panel.${p}open {
  transform: translateX(0);
}
.${p}detail-close {
  position: absolute;
  top: 16px; right: 16px;
  width: 32px; height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(0,0,0,0.05);
  color: var(--text-secondary);
  font-size: 18px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s ease;
  z-index: 5;
}
.${p}detail-close:hover {
  background: rgba(0,0,0,0.1);
  color: var(--text-primary);
}
.${p}detail-header {
  padding: 24px 24px 16px;
  border-bottom: 1px solid var(--border-light);
}
.${p}detail-type-badge {
  display: inline-flex;
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #fff;
  margin-bottom: 10px;
}
.${p}detail-title {
  font-family: var(--font-display);
  font-size: 22px;
  line-height: 1.2;
  margin-bottom: 8px;
}
.${p}detail-funder {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 12px;
}
.${p}detail-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 12px;
}
.${p}detail-stat-block {
  display: flex; flex-direction: column; gap: 2px;
}
.${p}detail-stat-label {
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-secondary);
}
.${p}detail-stat-value {
  font-family: var(--font-display);
  font-size: 20px;
  color: var(--text-primary);
}
.${p}detail-gauge {
  width: 100px; height: 100px;
  margin: 0 auto 16px;
}
.${p}detail-gauge-bg { fill: none; stroke: rgba(0,0,0,0.06); stroke-width: 6; }
.${p}detail-gauge-fill { fill: none; stroke-width: 6; stroke-linecap: round; transition: stroke-dashoffset 1s ease; }
.${p}detail-gauge-text {
  font-family: var(--font-display);
  font-size: 22px;
  fill: var(--text-primary);
  text-anchor: middle;
  dominant-baseline: central;
}
.${p}detail-body {
  padding: 20px 24px;
  flex: 1;
}
.${p}detail-section {
  margin-bottom: 20px;
}
.${p}detail-section-title {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-secondary);
  margin-bottom: 8px;
}
.${p}detail-section-text {
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-primary);
}
.${p}detail-match-reasons {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.${p}detail-match-tag {
  font-size: 10px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 4px;
  background: rgba(245,207,73,0.15);
  color: #B8940E;
}
.${p}detail-actions {
  padding: 16px 24px 24px;
  border-top: 1px solid var(--border-light);
  display: flex;
  gap: 10px;
}
.${p}detail-btn-primary {
  flex: 1;
  padding: 10px 16px;
  border-radius: 8px;
  background: var(--brand);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}
.${p}detail-btn-primary:hover { background: #E8B708; }
.${p}detail-btn-secondary {
  flex: 1;
  padding: 10px 16px;
  border-radius: 8px;
  background: transparent;
  border: 1px solid var(--border-light);
  color: var(--text-secondary);
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
.${p}detail-btn-secondary:hover {
  border-color: rgba(0,0,0,0.2);
  color: var(--text-primary);
}

/* ───── Main scrollable area ───── */
.${p}main-area {
  margin-top: 137px;
  margin-left: 280px;
  padding: 24px 24px 60px 24px;
  z-index: 1;
  transition: margin-left 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.${p}main-area.${p}detail-open {
  margin-left: 630px;
}

/* ───── Bento Grid ───── */
.${p}bento-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: minmax(140px, auto);
  grid-auto-flow: dense;
  gap: 12px;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}

/* ───── Grid Cells ───── */
.${p}grid-cell {
  background: var(--bg-surface);
  border-radius: 14px;
  border: 1px solid var(--border-light);
  padding: 16px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
  display: flex;
  flex-direction: column;
  will-change: transform;
}
.${p}grid-cell:hover {
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border-color: rgba(0,0,0,0.12);
}

/* Cell size classes */
.${p}grid-cell.${p}hero {
  grid-column: span 2;
  grid-row: span 2;
  border-color: var(--brand);
  box-shadow: 0 0 20px var(--brand-dim), 0 4px 20px rgba(0,0,0,0.06);
}
.${p}grid-cell.${p}wide {
  grid-column: span 2;
  grid-row: span 1;
}
.${p}grid-cell.${p}standard {
  grid-column: span 1;
  grid-row: span 1;
}
.${p}grid-cell.${p}compact {
  grid-column: span 1;
  grid-row: span 1;
}

/* Champion glow */
.${p}grid-cell.${p}champion {
  border-color: var(--brand);
  box-shadow: 0 0 24px var(--brand-dim), 0 0 48px rgba(245,207,73,0.15), 0 4px 20px rgba(0,0,0,0.06);
}
.${p}grid-cell.${p}champion::before {
  content: '';
  position: absolute; inset: -1px;
  border-radius: 14px;
  border: 2px solid var(--brand);
  animation: ${p}championGlow 2s ease-in-out infinite alternate;
  pointer-events: none;
}
@keyframes ${p}championGlow {
  0% { box-shadow: 0 0 10px var(--brand-dim); }
  100% { box-shadow: 0 0 24px var(--brand), 0 0 48px var(--brand-dim); }
}

/* ───── Skeleton shimmer ───── */
.${p}grid-cell.${p}skeleton {
  pointer-events: none;
  border: 1px dashed rgba(0,0,0,0.08);
  background: linear-gradient(90deg, rgba(245,207,73,0.03) 0%, rgba(245,207,73,0.08) 50%, rgba(245,207,73,0.03) 100%);
  background-size: 200% 100%;
  animation: ${p}shimmer 1.5s ease-in-out infinite;
}
.${p}skeleton-line {
  height: 12px;
  border-radius: 6px;
  background: rgba(0,0,0,0.04);
  margin-bottom: 8px;
}
.${p}skeleton-line:nth-child(1) { width: 60%; }
.${p}skeleton-line:nth-child(2) { width: 80%; }
.${p}skeleton-line:nth-child(3) { width: 40%; }
@keyframes ${p}shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ───── Breathing border for empty grid ───── */
.${p}bento-grid.${p}breathing {
  border: 2px dashed rgba(245,207,73,0.2);
  border-radius: 18px;
  padding: 12px;
  min-height: 400px;
  animation: ${p}breathe 3s ease-in-out infinite;
}
@keyframes ${p}breathe {
  0%, 100% { border-color: rgba(245,207,73,0.1); }
  50% { border-color: rgba(245,207,73,0.35); }
}
.${p}bento-grid.${p}active {
  border: none;
  padding: 0;
  animation: none;
}

/* ───── Card internals ───── */
.${p}cell-type-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #fff;
  margin-bottom: 6px;
  width: fit-content;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
}
.${p}cell-type-badge.${p}visible {
  opacity: 1;
  transform: translateX(0);
}
.${p}cell-name {
  font-family: var(--font-display);
  font-size: 15px;
  color: var(--text-primary);
  line-height: 1.25;
  margin-bottom: 4px;
  overflow: hidden;
}
.${p}hero .${p}cell-name { font-size: 20px; margin-bottom: 8px; }
.${p}wide .${p}cell-name { font-size: 17px; margin-bottom: 6px; }
.${p}cell-funder {
  font-size: 11px;
  color: var(--text-secondary);
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.${p}hero .${p}cell-funder { font-size: 12px; white-space: normal; }
.${p}cell-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
  font-size: 12px;
  font-weight: 600;
}
.${p}cell-amount {
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: 16px;
}
.${p}hero .${p}cell-amount { font-size: 22px; }
.${p}wide .${p}cell-amount { font-size: 18px; }
.${p}cell-deadline {
  font-size: 10px;
  color: var(--text-secondary);
  font-weight: 400;
}
.${p}cell-fit-bar {
  height: 6px;
  background: rgba(0,0,0,0.05);
  border-radius: 3px;
  overflow: hidden;
  margin: 6px 0;
  position: relative;
}
.${p}hero .${p}cell-fit-bar { height: 8px; margin: 8px 0; }
.${p}cell-fit-fill {
  height: 100%;
  border-radius: 3px;
  width: 0%;
  transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.${p}cell-fit-label {
  font-size: 11px;
  font-weight: 700;
  margin-bottom: 4px;
}
.${p}hero .${p}cell-fit-label { font-size: 14px; }
.${p}cell-summary {
  font-size: 11px;
  color: var(--text-secondary);
  line-height: 1.45;
  margin-top: 6px;
  opacity: 0;
  transition: opacity 0.5s ease;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.${p}hero .${p}cell-summary {
  -webkit-line-clamp: 4;
  font-size: 12px;
}
.${p}cell-summary.${p}visible { opacity: 1; }
.${p}cell-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: auto;
  padding-top: 6px;
  opacity: 0;
  transition: opacity 0.4s ease;
}
.${p}cell-tags.${p}visible { opacity: 1; }
.${p}cell-tag {
  font-size: 9px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(0,0,0,0.04);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.${p}cell-source {
  font-size: 9px;
  color: var(--text-secondary);
  opacity: 0.6;
  margin-top: 4px;
}

/* Crown / medal badges */
.${p}cell-crown {
  position: absolute;
  top: 10px; right: 10px;
  font-size: 22px;
  opacity: 0;
  transform: scale(0) rotate(-15deg);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 5;
}
.${p}cell-crown.${p}visible {
  opacity: 1;
  transform: scale(1) rotate(0deg);
}

/* ───── Champion toast ───── */
.${p}champion-toast {
  position: absolute;
  top: 160px;
  left: 50%;
  transform: translateX(-50%) translateY(-20px);
  background: var(--brand);
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: 15px;
  padding: 8px 20px;
  border-radius: 24px;
  box-shadow: 0 4px 20px var(--brand-dim);
  z-index: 200;
  opacity: 0;
  pointer-events: none;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.${p}champion-toast.${p}show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* ───── Filter Chips ───── */
.${p}filter-bar {
  max-width: 1200px;
  margin: 20px auto 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.5s ease;
  pointer-events: none;
}
.${p}filter-bar.${p}visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: all;
}
.${p}filter-chip {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid var(--border-light);
  background: var(--bg-surface);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.25s ease;
}
.${p}filter-chip:hover {
  border-color: rgba(181,148,14,0.4);
  color: #B8940E;
}
.${p}filter-chip.${p}active {
  background: var(--brand);
  border-color: var(--brand);
  color: var(--text-primary);
}

/* ───── Labor Illusion Counter ───── */
.${p}header-labor {
  font-size: 10px;
  color: var(--text-secondary);
  letter-spacing: 0.02em;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.6s ease;
}
.${p}header-labor.${p}visible {
  opacity: 1;
}
.${p}labor-num {
  font-weight: 700;
  color: #B8940E;
}

/* ───── Summary overlay ───── */
.${p}summary-overlay {
  position: absolute; inset: 0;
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 250;
  display: flex; align-items: center; justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.6s ease;
}
.${p}summary-overlay.${p}visible {
  opacity: 1;
  pointer-events: all;
}
.${p}summary-card {
  background: var(--bg-surface);
  border-radius: 20px;
  padding: 40px;
  max-width: 480px;
  width: 90%;
  box-shadow: 0 8px 40px rgba(0,0,0,0.12);
  text-align: center;
  transform: scale(0.9);
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.${p}summary-overlay.${p}visible .${p}summary-card {
  transform: scale(1);
}
.${p}summary-icon { font-size: 48px; margin-bottom: 16px; }
.${p}summary-title {
  font-family: var(--font-display);
  font-size: 26px;
  margin-bottom: 12px;
  color: var(--text-primary);
}
.${p}summary-body {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 24px;
}
.${p}summary-stats {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 24px;
}
.${p}summary-stat {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
}
.${p}summary-stat-val {
  font-family: var(--font-display);
  font-size: 28px;
  color: #B8940E;
}
.${p}summary-stat-lbl {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-secondary);
}
.${p}summary-dismiss {
  padding: 10px 28px;
  border-radius: 24px;
  background: var(--brand);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}
.${p}summary-dismiss:hover { background: #E8B708; }

/* ───── Responsive ───── */
@media (max-width: 1100px) {
  .${p}ranked-sidebar { width: 240px; }
  .${p}main-area { left: 240px; }
  .${p}detail-panel { left: 240px; width: 320px; }
  .${p}main-area.${p}detail-open { left: 560px; }
}
@media (max-width: 900px) {
  .${p}bento-grid { grid-template-columns: repeat(2, 1fr); }
  .${p}ranked-sidebar { width: 220px; }
  .${p}main-area { left: 220px; }
  .${p}detail-panel { left: 220px; width: 300px; }
  .${p}main-area.${p}detail-open { left: 520px; }
}
@media (max-width: 600px) {
  .${p}source-bar { gap: 4px; }
  .${p}source-card { width: 64px; font-size: 9px; }
  .${p}source-state { display: none; }
  .${p}ranked-sidebar { display: none; }
  .${p}main-area { left: 0; }
  .${p}detail-panel { left: 0; width: 100%; top: 0; z-index: 300; }
  .${p}main-area.${p}detail-open { left: 0; }
}
`

// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------

function parseAmountFromString(amountStr) {
  if (!amountStr) return 0
  const s = String(amountStr).trim()
  if (/^(rolling|varies|tbd|n\/a|per\s|not\s)/i.test(s)) return 0
  // Range → pick upper end
  const rangeParts = s.split(/\s*[-–—]\s*|\s+to\s+/i).filter(p => /\d/.test(p))
  const target = rangeParts.length >= 2 ? rangeParts[rangeParts.length - 1] : s
  const upTo = target.match(/up\s+to\s+([\$\d,.]+\s*[KMBkmb]?)/i)
  const numStr = upTo ? upTo[1] : target
  const cleaned = numStr.replace(/[^0-9.KMBkmb]/g, '')
  if (!cleaned) return 0
  const upper = cleaned.toUpperCase()
  if (upper.includes('B')) { const v = parseFloat(upper); return isNaN(v) ? 0 : v * 1e9 }
  if (upper.includes('M')) { const v = parseFloat(upper); return isNaN(v) ? 0 : v * 1e6 }
  if (upper.includes('K')) { const v = parseFloat(upper); return isNaN(v) ? 0 : v * 1e3 }
  const v = parseFloat(cleaned)
  return isNaN(v) ? 0 : v
}

function formatAmount(amount, fallbackStr) {
  const n = typeof amount === 'number' ? amount : parseAmountFromString(amount)
  if (isNaN(n) || n === 0) return fallbackStr || '$0'
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `$${Math.round(n / 1000)}K`
  return `$${Math.round(n)}`
}

function getCellSizeByRank(rank) {
  if (rank === 0) return 'hero'      // #1
  if (rank <= 2) return 'wide'       // #2-3
  if (rank <= 5) return 'standard'   // #4-6
  return 'compact'                   // #7+
}

function getProviderDisplay(providerKey) {
  if (PROVIDER_DISPLAY[providerKey]) return PROVIDER_DISPLAY[providerKey]
  return { name: providerKey, abbrev: providerKey.slice(0, 3).toUpperCase() }
}

// ---------------------------------------------------------------------------
// Engine
// ---------------------------------------------------------------------------

export default class RisingStakesEngine {
  constructor() {
    this.prefix = 'gve-'
    this.grants = []           // all grants in ranked order (by fit_score desc)
    this.grantMap = new Map()  // id -> grant
    this.container = null
    this.config = null
    this.onSelectCallback = null
    this.revealQueue = []
    this.revealProcessing = false
    this.timers = []
    this.intervals = []
    this.animFrameId = null

    // DOM refs (populated in _buildDOM)
    this.gridEl = null
    this.sidebarEl = null
    this.rankedListEl = null
    this.rankedCountEl = null
    this.detailPanelEl = null
    this.detailHeaderEl = null
    this.detailBodyEl = null
    this.detailActionsEl = null
    this.mainAreaEl = null
    this.sourceBarEl = null
    this.tickerTextEl = null
    this.progressFillEl = null
    this.grantCountEl = null
    this.filterBarEl = null
    this.championToastEl = null
    this.summaryOverlayEl = null
    this.summaryBodyEl = null
    this.summaryStatsEl = null
    this.headerLaborEl = null
    this.laborGrantsEl = null
    this.laborDbsEl = null
    this.laborAmountEl = null
    this.starfieldEl = null
    this.styleEl = null

    // State
    this.currentChampionId = null
    this.selectedGrantId = null
    this.lastReflowTime = 0
    this.activeFilter = null
    this.searchComplete = false
    this.sourceCards = new Map()  // providerKey -> DOM element
    this.laborStartTime = 0
    this.laborRunning = false
    this.providersActivated = new Set()
    this.providersCompleted = new Set()
  }

  // =========================================================================
  // PUBLIC API
  // =========================================================================

  init(container, config) {
    this.container = container
    this.config = config || {}
    this._injectStyles()
    this._buildDOM()
    this._createStarfield()
    this._startLaborCounter()

    // Show breathing grid + skeletons after brief delay
    this._createSkeletons(8)
    const t = setTimeout(() => {
      this.gridEl.classList.remove(this.prefix + 'breathing')
      this.gridEl.classList.add(this.prefix + 'active')
    }, 1500)
    this.timers.push(t)
  }

  addBatch(provider, grants, isInitial) {
    if (!grants || grants.length === 0) return

    // Activate source in source bar
    this._activateSource(provider)

    // Update ticker
    const pd = getProviderDisplay(provider)
    this._updateTicker(`Scanning ${pd.name}...`)

    // Queue grants for variable-cadence reveal
    const sorted = [...grants].sort((a, b) => (b.fit_score || 0) - (a.fit_score || 0))
    const highestIdx = 0 // sorted[0] is highest fit_score

    sorted.forEach((grant, i) => {
      let delay
      if (i < 3) {
        delay = 300
      } else {
        delay = 400
      }
      // Extra pause before the highest fit_score grant in batch
      const extraPause = (i === highestIdx && i > 0) ? 200 : 0

      if (!this.grantMap.has(grant.id)) {
        this.grantMap.set(grant.id, grant)  // Mark seen NOW so next batch can't re-queue
        // Cap total grants at 40 to prevent grid bloat during streaming
        if (this.grants.length + this.revealQueue.length < 40) {
          this.revealQueue.push({ grant, provider, delay: delay + extraPause })
        }
      }
    })

    this._processRevealQueue()
  }

  rerank(grants) {
    if (!grants || grants.length === 0) return

    // Normalize fit scores so top = 100
    const topFit = grants[0]?.fit_score || 1
    if (topFit > 0 && topFit < 100) {
      const scale = 100 / topFit
      grants.forEach(g => { g.fit_score = Math.min(100, Math.round((g.fit_score || 0) * scale)) })
    }

    this._updateTicker('Re-ranking results with cross-encoder model...')

    // Replace all grants with the new ranked set
    this.grants = []
    this.grantMap.clear()
    grants.forEach(g => {
      this.grants.push(g)
      this.grantMap.set(g.id, g)
    })

    // FLIP reflow with new sizes
    this._flipReflow(() => {
      this._assignCellSizes()
      this._rebuildGrid()
    })
    this.lastReflowTime = Date.now()

    // Update champion
    if (this.grants.length > 0) {
      this._updateChampion(this.grants[0])
    }

    // Update sidebar
    this._updateRankedSidebar()
  }

  complete(summary) {
    this.searchComplete = true
    this.laborRunning = false

    // Complete all sources
    this.sourceCards.forEach((el, key) => {
      this._completeSource(key)
    })

    // Final progress fill
    if (this.progressFillEl) {
      this.progressFillEl.style.width = '100%'
    }

    // Final reflow with badges
    this._flipReflow(() => {
      this._assignCellSizes()
      this._rebuildGrid()

      // Assign medals: crown on #1, silver on #2, bronze on #3
      const sorted = [...this.grants]
      if (sorted[0]) this._setCrown(sorted[0].id, '\u{1F451}')
      if (sorted[1]) this._setCrown(sorted[1].id, '\u{1F948}')
      if (sorted[2]) this._setCrown(sorted[2].id, '\u{1F949}')
    })
    this.lastReflowTime = Date.now()

    this._updateRankedSidebar()

    // Confetti
    this._triggerConfetti()

    // Filter chips
    const t1 = setTimeout(() => this._buildFilterChips(), 800)
    this.timers.push(t1)

    // Ticker
    const grantCount = this.grants.length
    const sourceCount = this.providersCompleted.size || this.providersActivated.size
    this._updateTicker(`Search complete! ${grantCount} grants found across ${sourceCount} sources.`)

    if (this.grants.length > 0) {
      const t2 = setTimeout(() => {
        this._updateTicker(`Top match: ${this.grants[0].name} \u2014 ${this.grants[0].fit_score}% fit`)
      }, 4000)
      this.timers.push(t2)
    }

    // Summary overlay
    const totalAmount = this.grants.reduce((s, g) => s + (g.amount || 0), 0)
    const highFit = this.grants.filter(g => (g.fit_score || 0) >= 80).length
    const orgName = (this.config && this.config.focusArea) || 'your organization'

    if (this.summaryBodyEl) {
      this.summaryBodyEl.textContent = (summary && summary.text)
        ? summary.text
        : `We analyzed ${sourceCount} sources and found ${grantCount} grants matching ${orgName}.`
    }

    if (this.summaryStatsEl) {
      this.summaryStatsEl.innerHTML = `
        <div class="${this.prefix}summary-stat">
          <span class="${this.prefix}summary-stat-val">${grantCount}</span>
          <span class="${this.prefix}summary-stat-lbl">Grants Found</span>
        </div>
        <div class="${this.prefix}summary-stat">
          <span class="${this.prefix}summary-stat-val">${formatAmount(totalAmount)}</span>
          <span class="${this.prefix}summary-stat-lbl">Total Available</span>
        </div>
        <div class="${this.prefix}summary-stat">
          <span class="${this.prefix}summary-stat-val">${highFit}</span>
          <span class="${this.prefix}summary-stat-lbl">Strong Matches</span>
        </div>
      `
    }

    const t3 = setTimeout(() => {
      if (this.summaryOverlayEl) this.summaryOverlayEl.classList.add(this.prefix + 'visible')
    }, 1500)
    this.timers.push(t3)
  }

  onGrantSelect(callback) {
    this.onSelectCallback = callback
  }

  // ========================================================================
  // PUBLIC: loadAll — render final state instantly (no animation)
  // ========================================================================
  loadAll(grants) {
    if (!grants || grants.length === 0) return

    // Stop the labor counter animation (init() starts it, but loadAll sets final values)
    this.laborRunning = false
    if (this.animFrameId) { cancelAnimationFrame(this.animFrameId); this.animFrameId = null }

    // Deduplicate by name (same grant from different providers)
    const seen = new Set()
    const uniqueGrants = grants.filter(g => {
      const key = (g.name || '').trim().toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })

    // Sort by fit_score descending, cap at 40
    const sorted = [...uniqueGrants].sort((a, b) => (b.fit_score || 0) - (a.fit_score || 0)).slice(0, 40)

    // Normalize fit scores so top = 100
    const topFit = sorted[0]?.fit_score || 1
    if (topFit > 0 && topFit < 100) {
      const scale = 100 / topFit
      sorted.forEach(g => { g.fit_score = Math.min(100, Math.round((g.fit_score || 0) * scale)) })
    }

    // Clear any queued reveals
    this.revealQueue = []
    this.revealProcessing = false

    // Remove skeletons
    this._removeSkeletons()
    if (this.gridEl) {
      this.gridEl.classList.remove(this.prefix + 'breathing')
      this.gridEl.classList.add(this.prefix + 'active')
    }

    // Add all grants at once, preserving amount as amountStr for display
    this.grants = []
    this.grantMap.clear()
    sorted.forEach(grant => {
      if (!grant.amountStr && typeof grant.amount === 'string') grant.amountStr = grant.amount
      this.grantMap.set(grant.id, grant)
      this.grants.push(grant)
    })

    // Create all cards, fill content immediately, and add to grid
    const prefix = this.prefix
    this.grants.forEach((grant, rank) => {
      const sizeClass = getCellSizeByRank(rank)
      const cell = this._createCard(grant, sizeClass)
      // No animation — just append
      cell.style.opacity = '1'
      cell.style.transform = 'none'

      // Fill card content directly (no staged reveal animation)
      const nameEl = cell.querySelector(`[data-name="${grant.id}"]`)
      if (nameEl) nameEl.textContent = grant.name || ''
      const amountEl = cell.querySelector(`[data-amount="${grant.id}"]`)
      if (amountEl) amountEl.textContent = grant.amountStr || formatAmount(grant.amount || 0)
      const fitScore = grant.fit_score || 0
      const fitLabel = cell.querySelector(`[data-fitlabel="${grant.id}"]`)
      if (fitLabel) fitLabel.textContent = `${Math.round(fitScore)}% fit`
      const fitFill = cell.querySelector(`[data-fitfill="${grant.id}"]`)
      if (fitFill) fitFill.style.width = `${fitScore}%`
      // Make badge and summary visible
      const badge = cell.querySelector(`[data-badge="${grant.id}"]`)
      if (badge) badge.classList.add(prefix + 'visible')
      const summaryEl = cell.querySelector(`[data-summary="${grant.id}"]`)
      if (summaryEl) {
        summaryEl.textContent = grant.summary || ''
        summaryEl.classList.add(prefix + 'visible')
      }
      const tagsEl = cell.querySelector(`[data-tags="${grant.id}"]`)
      if (tagsEl) tagsEl.classList.add(prefix + 'visible')

      if (this.gridEl) this.gridEl.appendChild(cell)
    })

    // Assign sizes and rebuild
    this._assignCellSizes()
    this._rebuildGrid()

    // Set champion
    if (this.grants.length > 0) {
      this._updateChampion(this.grants[0])
    }

    // Medals
    if (sorted[0]) this._setCrown(sorted[0].id, '\u{1F451}')
    if (sorted[1]) this._setCrown(sorted[1].id, '\u{1F948}')
    if (sorted[2]) this._setCrown(sorted[2].id, '\u{1F949}')

    // Update sidebar
    this._updateRankedSidebar()

    // Progress to 100%
    if (this.progressFillEl) this.progressFillEl.style.width = '100%'

    // Counter
    this._updateCounter()

    // Filter chips
    this._buildFilterChips()

    // Ticker — show grant count instead of confusing "mapped" message
    this._updateTicker(`AI discovered ${this.grants.length} grants`)

    // Set labor counter values directly (no animation)
    const totalAmount = this.grants.reduce((sum, g) => {
      const n = typeof g.amount === 'number' ? g.amount : parseFloat(String(g.amount || '0').replace(/[^0-9.]/g, '')) || 0
      return sum + n
    }, 0)
    if (this.laborGrantsEl) this.laborGrantsEl.textContent = String(this.grants.length * 170)
    if (this.laborDbsEl) this.laborDbsEl.textContent = '12'
    if (this.laborAmountEl) this.laborAmountEl.textContent = (totalAmount / 1000000).toFixed(1)
    if (this.headerLaborEl) this.headerLaborEl.classList.add(this.prefix + 'visible')

    // Activate + complete all sources
    const providers = new Set(this.grants.map(g => g.source || 'db_results').filter(Boolean))
    providers.forEach(p => {
      this.providersActivated.add(p)
      this.providersCompleted.add(p)
      this._completeSource(p)
    })

    // Mark search complete
    this.searchComplete = true
    this.laborRunning = false
  }

  reset() {
    this.timers.forEach(t => clearTimeout(t))
    this.timers = []
    this.intervals.forEach(t => clearInterval(t))
    this.intervals = []
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId)
    this.animFrameId = null

    this.grants = []
    this.grantMap.clear()
    this.revealQueue = []
    this.revealProcessing = false
    this.currentChampionId = null
    this.selectedGrantId = null
    this.lastReflowTime = 0
    this.activeFilter = null
    this.searchComplete = false
    this.providersActivated.clear()
    this.providersCompleted.clear()

    if (this.gridEl) {
      this.gridEl.innerHTML = ''
      this.gridEl.classList.add(this.prefix + 'breathing')
      this.gridEl.classList.remove(this.prefix + 'active')
    }
    if (this.grantCountEl) this.grantCountEl.textContent = '0'
    if (this.progressFillEl) this.progressFillEl.style.width = '0%'
    if (this.filterBarEl) {
      this.filterBarEl.classList.remove(this.prefix + 'visible')
      this.filterBarEl.innerHTML = ''
    }
    if (this.summaryOverlayEl) this.summaryOverlayEl.classList.remove(this.prefix + 'visible')
    if (this.championToastEl) this.championToastEl.classList.remove(this.prefix + 'show')
    if (this.tickerTextEl) this.tickerTextEl.textContent = 'Initializing search...'
    if (this.rankedListEl) this.rankedListEl.innerHTML = ''
    if (this.rankedCountEl) this.rankedCountEl.textContent = '0'
    if (this.headerLaborEl) this.headerLaborEl.classList.remove(this.prefix + 'visible')

    this._closeDetail()

    // Reset sources
    this.sourceCards.forEach((el) => {
      el.className = this.prefix + 'source-card'
      const stateEl = el.querySelector('.' + this.prefix + 'source-state')
      if (stateEl) stateEl.textContent = 'Idle'
    })

    // Re-create skeletons
    this._createSkeletons(8)
    const t = setTimeout(() => {
      if (this.gridEl) {
        this.gridEl.classList.remove(this.prefix + 'breathing')
        this.gridEl.classList.add(this.prefix + 'active')
      }
    }, 1500)
    this.timers.push(t)

    this._startLaborCounter()
  }

  destroy() {
    this.timers.forEach(t => clearTimeout(t))
    this.intervals.forEach(t => clearInterval(t))
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId)
    if (this.styleEl && this.styleEl.parentNode) {
      this.styleEl.parentNode.removeChild(this.styleEl)
    }
    if (this.container) this.container.innerHTML = ''

    this.container = null
    this.gridEl = null
    this.sidebarEl = null
    this.grants = []
    this.grantMap.clear()
    this.timers = []
    this.intervals = []
    this.revealQueue = []
    this.sourceCards.clear()
  }

  // =========================================================================
  // PRIVATE — DOM Construction
  // =========================================================================

  _injectStyles() {
    this.styleEl = document.createElement('style')
    this.styleEl.textContent = CSS(this.prefix)
    this.container.prepend(this.styleEl)
  }

  _buildDOM() {
    const p = this.prefix
    const root = document.createElement('div')
    root.className = p + 'root'

    // Starfield
    const starfield = document.createElement('div')
    starfield.className = p + 'starfield'
    this.starfieldEl = starfield
    root.appendChild(starfield)

    // Header
    const header = document.createElement('div')
    header.className = p + 'header'
    header.innerHTML = `
      <div class="${p}header-center">
        <div class="${p}grant-counter">
          <span class="${p}count" data-ref="grantCount">0</span> grants discovered
        </div>
        <div class="${p}header-labor" data-ref="headerLabor">
          Analyzed <span class="${p}labor-num" data-ref="laborGrants">0</span> grants across
          <span class="${p}labor-num" data-ref="laborDbs">0</span> databases &mdash;
          $<span class="${p}labor-num" data-ref="laborAmount">0.0</span>M in matching opportunities
        </div>
      </div>
      <div class="${p}header-right"></div>
    `
    root.appendChild(header)

    // Source bar (dynamic, built from PROVIDER_DISPLAY)
    const sourceBar = document.createElement('div')
    sourceBar.className = p + 'source-bar'
    this.sourceBarEl = sourceBar
    // Populate source cards for all known providers
    Object.keys(PROVIDER_DISPLAY).forEach(key => {
      const pd = PROVIDER_DISPLAY[key]
      const card = document.createElement('div')
      card.className = p + 'source-card'
      card.innerHTML = `
        <span class="${p}source-abbrev">${pd.abbrev}</span>
        <span class="${p}source-state">Idle</span>
        <span class="${p}check-icon"> \u2713</span>
      `
      this.sourceCards.set(key, card)
      sourceBar.appendChild(card)
    })
    root.appendChild(sourceBar)

    // Ticker bar
    const tickerBar = document.createElement('div')
    tickerBar.className = p + 'ticker-bar'
    tickerBar.innerHTML = `<span class="${p}ticker-text" data-ref="tickerText">Initializing search...</span>`
    root.appendChild(tickerBar)

    // Progress bar
    const progressTrack = document.createElement('div')
    progressTrack.className = p + 'progress-track'
    progressTrack.innerHTML = `<div class="${p}progress-fill" data-ref="progressFill"></div>`
    root.appendChild(progressTrack)

    // Ranked sidebar
    const sidebar = document.createElement('div')
    sidebar.className = p + 'ranked-sidebar'
    sidebar.innerHTML = `
      <div class="${p}ranked-header">
        Discovered Grants <span class="${p}count-badge" data-ref="rankedCount">0</span>
      </div>
      <div class="${p}ranked-list" data-ref="rankedList"></div>
    `
    this.sidebarEl = sidebar
    root.appendChild(sidebar)

    // Detail panel
    const detail = document.createElement('div')
    detail.className = p + 'detail-panel'
    detail.innerHTML = `
      <button class="${p}detail-close" data-ref="detailClose">&times;</button>
      <div class="${p}detail-header" data-ref="detailHeader"></div>
      <div class="${p}detail-body" data-ref="detailBody"></div>
      <div class="${p}detail-actions" data-ref="detailActions">
        <button class="${p}detail-btn-primary">View Grant</button>
      </div>
    `
    this.detailPanelEl = detail
    root.appendChild(detail)

    // Main area
    const mainArea = document.createElement('div')
    mainArea.className = p + 'main-area'
    const grid = document.createElement('div')
    grid.className = p + 'bento-grid ' + p + 'breathing'
    this.gridEl = grid
    mainArea.appendChild(grid)

    const filterBar = document.createElement('div')
    filterBar.className = p + 'filter-bar'
    this.filterBarEl = filterBar
    mainArea.appendChild(filterBar)

    this.mainAreaEl = mainArea
    root.appendChild(mainArea)

    // Champion toast
    const toast = document.createElement('div')
    toast.className = p + 'champion-toast'
    this.championToastEl = toast
    root.appendChild(toast)

    // Summary overlay
    const summaryOverlay = document.createElement('div')
    summaryOverlay.className = p + 'summary-overlay'
    summaryOverlay.innerHTML = `
      <div class="${p}summary-card">
        <div class="${p}summary-icon">&#10024;</div>
        <div class="${p}summary-title">Search Complete</div>
        <div class="${p}summary-body" data-ref="summaryBody"></div>
        <div class="${p}summary-stats" data-ref="summaryStats"></div>
        <button class="${p}summary-dismiss" data-ref="summaryDismiss">Explore Results</button>
      </div>
    `
    this.summaryOverlayEl = summaryOverlay
    root.appendChild(summaryOverlay)

    // Append root to container
    this.container.appendChild(root)
    this.rootEl = root

    // Resolve data-ref pointers
    this.grantCountEl = root.querySelector('[data-ref="grantCount"]')
    this.headerLaborEl = root.querySelector('[data-ref="headerLabor"]')
    this.laborGrantsEl = root.querySelector('[data-ref="laborGrants"]')
    this.laborDbsEl = root.querySelector('[data-ref="laborDbs"]')
    this.laborAmountEl = root.querySelector('[data-ref="laborAmount"]')
    this.tickerTextEl = root.querySelector('[data-ref="tickerText"]')
    this.progressFillEl = root.querySelector('[data-ref="progressFill"]')
    this.rankedListEl = root.querySelector('[data-ref="rankedList"]')
    this.rankedCountEl = root.querySelector('[data-ref="rankedCount"]')
    this.detailHeaderEl = root.querySelector('[data-ref="detailHeader"]')
    this.detailBodyEl = root.querySelector('[data-ref="detailBody"]')
    this.detailActionsEl = root.querySelector('[data-ref="detailActions"]')
    this.summaryBodyEl = root.querySelector('[data-ref="summaryBody"]')
    this.summaryStatsEl = root.querySelector('[data-ref="summaryStats"]')

    // Wire events
    const detailCloseBtn = root.querySelector('[data-ref="detailClose"]')
    if (detailCloseBtn) detailCloseBtn.addEventListener('click', () => this._closeDetail())

    const summaryDismiss = root.querySelector('[data-ref="summaryDismiss"]')
    if (summaryDismiss) summaryDismiss.addEventListener('click', () => {
      this.summaryOverlayEl.classList.remove(this.prefix + 'visible')
    })

    // Keyboard handler
    this._keyHandler = (e) => {
      if (e.key === 'Escape') {
        this._closeDetail()
        if (this.summaryOverlayEl) this.summaryOverlayEl.classList.remove(this.prefix + 'visible')
      }
    }
    document.addEventListener('keydown', this._keyHandler)

    // Click-outside to close detail
    this._clickOutsideHandler = (e) => {
      if (this.selectedGrantId !== null) {
        if (!this.detailPanelEl.contains(e.target) &&
            !this.sidebarEl.contains(e.target) &&
            !e.target.closest('.' + this.prefix + 'grid-cell')) {
          this._closeDetail()
        }
      }
    }
    root.addEventListener('click', this._clickOutsideHandler)

  }

  // =========================================================================
  // PRIVATE — Starfield
  // =========================================================================

  _createStarfield() {
    if (!this.starfieldEl) return
    this.starfieldEl.innerHTML = ''
    for (let i = 0; i < 50; i++) {
      const s = document.createElement('div')
      s.className = this.prefix + 'star'
      const size = 2 + Math.random() * 4
      s.style.cssText = `
        width:${size}px; height:${size}px;
        left:${Math.random() * 100}%; top:${Math.random() * 100}%;
        --dur:${2 + Math.random() * 4}s; --oMin:${0.05 + Math.random() * 0.1};
        --oMax:${0.15 + Math.random() * 0.2}; --sc:${1.2 + Math.random() * 0.5};
        animation-delay:-${Math.random() * 5}s;
      `
      this.starfieldEl.appendChild(s)
    }
  }

  // Sound system removed — no audio in visualization

  // =========================================================================
  // PRIVATE — Skeletons
  // =========================================================================

  _createSkeletons(count) {
    if (!this.gridEl) return
    for (let i = 0; i < count; i++) {
      const sk = document.createElement('div')
      sk.className = `${this.prefix}grid-cell ${this.prefix}skeleton ${this.prefix}standard`
      sk.innerHTML = `
        <div class="${this.prefix}skeleton-line"></div>
        <div class="${this.prefix}skeleton-line"></div>
        <div class="${this.prefix}skeleton-line"></div>
      `
      this.gridEl.appendChild(sk)
    }
  }

  _removeSkeletons() {
    if (!this.gridEl) return
    this.gridEl.querySelectorAll('.' + this.prefix + 'skeleton').forEach(s => s.remove())
  }

  // =========================================================================
  // PRIVATE — Card Creation
  // =========================================================================

  _createCard(grant, sizeClass) {
    const p = this.prefix
    const tc = TYPE_COLORS[grant.type] || '#6B7280'
    const fitScore = grant.fit_score || 0
    const fitColor = fitScore >= 90 ? '#B8940E' : fitScore >= 80 ? tc : 'var(--text-secondary)'
    const amountStr = grant.amountStr || formatAmount(grant.amount || 0)
    const providerDisplay = grant.source ? getProviderDisplay(grant.source) : null

    const cell = document.createElement('div')
    cell.className = `${p}grid-cell ${p}${sizeClass}`
    cell.dataset.grantId = grant.id

    let html = ''

    // Crown
    html += `<span class="${p}cell-crown" data-crown="${grant.id}"></span>`

    // Type badge
    html += `<span class="${p}cell-type-badge" style="background:${tc}" data-badge="${grant.id}">${grant.type || ''}</span>`

    // Name — pre-filled so cards never appear empty
    html += `<div class="${p}cell-name" data-name="${grant.id}">${grant.name || ''}</div>`

    // Funder
    html += `<div class="${p}cell-funder">${grant.funder || ''}</div>`

    // Meta row — pre-filled with amount
    html += `<div class="${p}cell-meta">`
    html += `<span class="${p}cell-amount" data-amount="${grant.id}">${amountStr}</span>`
    html += `<span class="${p}cell-deadline">${grant.deadline || ''}</span>`
    html += `</div>`

    // Fit label + bar — pre-filled
    html += `<div class="${p}cell-fit-label" style="color:${fitColor}" data-fitlabel="${grant.id}">${fitScore}% fit</div>`
    html += `<div class="${p}cell-fit-bar"><div class="${p}cell-fit-fill" data-fitfill="${grant.id}" style="background:${fitColor};width:${fitScore}%"></div></div>`

    // Summary (hero/wide only)
    if (sizeClass === 'hero' || sizeClass === 'wide') {
      html += `<div class="${p}cell-summary" data-summary="${grant.id}">${grant.summary || ''}</div>`
    }

    // Tags (hero/wide)
    if (sizeClass === 'hero' || sizeClass === 'wide') {
      const tags = grant.eligibility ? ['eligible'] : []
      if (grant.type) tags.push(grant.type.toLowerCase())
      html += `<div class="${p}cell-tags" data-tags="${grant.id}">`
      tags.forEach(t => {
        html += `<span class="${p}cell-tag">${t}</span>`
      })
      html += `</div>`
    }

    // Source label (hero only)
    if (sizeClass === 'hero' && providerDisplay) {
      html += `<div class="${p}cell-source">via ${providerDisplay.name}</div>`
    }

    cell.innerHTML = html

    // Click handler
    cell.addEventListener('click', () => this._selectCard(grant))

    return cell
  }

  // =========================================================================
  // PRIVATE — Staged Card Materialization
  // =========================================================================

  _materializeCard(grant, cellEl) {
    const p = this.prefix
    const rank = this.grants.indexOf(grant)
    const sizeClass = getCellSizeByRank(rank)
    const amountStr = grant.amountStr || formatAmount(grant.amount || 0)
    const fitScore = grant.fit_score || 0

    if (sizeClass === 'compact') {
      // Compact: quick fade-in, no staged reveal
      cellEl.style.opacity = '0'
      cellEl.style.transform = 'scale(0.95)'
      requestAnimationFrame(() => {
        cellEl.style.transition = 'opacity 0.4s ease, transform 0.4s ease'
        cellEl.style.opacity = '1'
        cellEl.style.transform = 'scale(1)'
      })
      const badge = cellEl.querySelector(`[data-badge="${grant.id}"]`)
      if (badge) badge.classList.add(p + 'visible')
      const nameEl = cellEl.querySelector(`[data-name="${grant.id}"]`)
      if (nameEl) nameEl.textContent = grant.name
      const amountEl = cellEl.querySelector(`[data-amount="${grant.id}"]`)
      if (amountEl) amountEl.textContent = amountStr
      const fitLabel = cellEl.querySelector(`[data-fitlabel="${grant.id}"]`)
      if (fitLabel) fitLabel.textContent = `${fitScore}% fit`
      const fitFill = cellEl.querySelector(`[data-fitfill="${grant.id}"]`)
      if (fitFill) {
        const t = setTimeout(() => { fitFill.style.width = `${fitScore}%` }, 200)
        this.timers.push(t)
      }
      return
    }

    // Staged reveal for standard/wide/hero
    cellEl.style.opacity = '0'
    cellEl.style.transform = 'scale(0.92)'
    requestAnimationFrame(() => {
      cellEl.style.transition = 'opacity 0.3s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
      cellEl.style.opacity = '1'
      cellEl.style.transform = 'scale(1)'
    })

    // Phase 2 (200ms): Type badge slides in
    const t1 = setTimeout(() => {
      const badge = cellEl.querySelector(`[data-badge="${grant.id}"]`)
      if (badge) badge.classList.add(p + 'visible')
    }, 200)
    this.timers.push(t1)

    // Phase 3 (500ms): Grant name typewriter
    const t2 = setTimeout(() => {
      const nameEl = cellEl.querySelector(`[data-name="${grant.id}"]`)
      if (nameEl) this._typewriterEffect(nameEl, grant.name || '', 40)
    }, 500)
    this.timers.push(t2)

    // Phase 4 (800ms): Amount counter rolls up
    const t3 = setTimeout(() => {
      const amountEl = cellEl.querySelector(`[data-amount="${grant.id}"]`)
      if (amountEl) this._counterRollUp(amountEl, amountStr)
    }, 800)
    this.timers.push(t3)

    // Phase 5 (1100ms): Fit score gauge fills
    const t4 = setTimeout(() => {
      const fitLabel = cellEl.querySelector(`[data-fitlabel="${grant.id}"]`)
      if (fitLabel) fitLabel.textContent = `${fitScore}% fit`
      const fitFill = cellEl.querySelector(`[data-fitfill="${grant.id}"]`)
      if (fitFill) fitFill.style.width = `${fitScore}%`
    }, 1100)
    this.timers.push(t4)

    // Phase 6 (1500ms): Summary + tags (hero/wide)
    if (sizeClass === 'hero' || sizeClass === 'wide') {
      const t5 = setTimeout(() => {
        const summary = cellEl.querySelector(`[data-summary="${grant.id}"]`)
        if (summary) summary.classList.add(p + 'visible')
        const tags = cellEl.querySelector(`[data-tags="${grant.id}"]`)
        if (tags) tags.classList.add(p + 'visible')
      }, 1500)
      this.timers.push(t5)
    }
  }

  _typewriterEffect(el, text, charsPerSec) {
    let i = 0
    const interval = 1000 / charsPerSec
    el.textContent = ''
    const tid = setInterval(() => {
      if (i < text.length) {
        el.textContent += text[i]
        i++
      } else {
        clearInterval(tid)
      }
    }, interval)
    this.intervals.push(tid)
  }

  _counterRollUp(el, finalStr) {
    const numMatch = finalStr.match(/[\d.]+/)
    if (!numMatch) { el.textContent = finalStr; return }
    const target = parseFloat(numMatch[0])
    const prefix = finalStr.substring(0, finalStr.indexOf(numMatch[0]))
    const suffix = finalStr.substring(finalStr.indexOf(numMatch[0]) + numMatch[0].length)
    let current = 0
    const steps = 15
    const increment = target / steps
    let step = 0
    const tid = setInterval(() => {
      step++
      current += increment
      if (step >= steps) {
        el.textContent = finalStr
        clearInterval(tid)
      } else {
        const val = target >= 10 ? Math.round(current) : current.toFixed(1)
        el.textContent = prefix + val + suffix
      }
    }, 20)
    this.intervals.push(tid)
  }

  // =========================================================================
  // PRIVATE — Reveal Queue (variable cadence)
  // =========================================================================

  _processRevealQueue() {
    if (this.revealProcessing || this.revealQueue.length === 0) return
    this.revealProcessing = true

    const next = this.revealQueue.shift()
    const t = setTimeout(() => {
      this._revealCard(next.grant, next.provider)
      this.revealProcessing = false
      this._processRevealQueue()
    }, next.delay)
    this.timers.push(t)
  }

  _revealCard(grant, providerKey) {
    // Skip duplicates
    if (this.grantMap.has(grant.id)) return

    // Add to internal state
    this.grantMap.set(grant.id, grant)

    // Insert into sorted position (by fit_score descending)
    let insertIdx = this.grants.findIndex(g => (g.fit_score || 0) < (grant.fit_score || 0))
    if (insertIdx === -1) insertIdx = this.grants.length
    this.grants.splice(insertIdx, 0, grant)

    // Remove skeletons on first grant
    if (this.grants.length === 1) {
      this._removeSkeletons()
      this.gridEl.classList.remove(this.prefix + 'breathing')
      this.gridEl.classList.add(this.prefix + 'active')
    }

    // Determine cell size based on current rank
    const rank = this.grants.indexOf(grant)
    const sizeClass = getCellSizeByRank(rank)

    // Check for new champion
    const isNewChampion = rank === 0 && this.grants.length > 1

    // Create cell
    const cell = this._createCard(grant, sizeClass)

    // FLIP if significant
    const now = Date.now()
    const shouldFLIP = this.grants.length > 1 && (now - this.lastReflowTime > 2000)

    if (shouldFLIP && (sizeClass === 'hero' || sizeClass === 'wide' || isNewChampion)) {
      this._flipReflow(() => {
        this.gridEl.appendChild(cell)
        if (isNewChampion || rank === 0) this._updateChampion(grant)
        this._assignCellSizes()
        this._rebuildGrid()
      })
      this.lastReflowTime = now
    } else {
      this.gridEl.appendChild(cell)
      if (rank === 0) this._updateChampion(grant)
      this._assignCellSizes()
      this._rebuildGrid()
    }

    // Staged materialization
    this._materializeCard(grant, cell)

    // Update counter + ranked list
    this._updateCounter()
    this._updateRankedSidebar()


    // Ticker
    this._updateTickerForGrant(grant, providerKey)

    // Update source count
    if (providerKey) {
      const providerGrants = this.grants.filter(g => g.source === providerKey)
      const card = this.sourceCards.get(providerKey)
      if (card) {
        const stateEl = card.querySelector('.' + this.prefix + 'source-state')
        if (stateEl) stateEl.textContent = `Found ${providerGrants.length}`
      }
    }
  }

  // =========================================================================
  // PRIVATE — Cell Size Assignment
  // =========================================================================

  _assignCellSizes() {
    const p = this.prefix
    this.grants.forEach((grant, rank) => {
      const cell = this.gridEl.querySelector(`[data-grant-id="${grant.id}"]`)
      if (!cell) return
      const newSize = getCellSizeByRank(rank)
      // Strip old size classes
      cell.classList.remove(p + 'hero', p + 'wide', p + 'standard', p + 'compact')
      cell.classList.add(p + newSize)
      if (grant.id === this.currentChampionId) cell.classList.add(p + 'champion')
    })
  }

  // =========================================================================
  // PRIVATE — Grid Rebuild (ordering)
  // =========================================================================

  _rebuildGrid() {
    const p = this.prefix

    // Apply filter
    const display = this.activeFilter
      ? this.grants.filter(g => this._matchesFilter(g, this.activeFilter))
      : [...this.grants]

    // Remove skeletons
    this._removeSkeletons()

    // Group by cell size and reorder: hero first, then wide, standard, compact
    const grouped = { hero: [], wide: [], standard: [], compact: [] }
    display.forEach((g, rank) => {
      const allIdx = this.grants.indexOf(g)
      const size = getCellSizeByRank(allIdx)
      grouped[size].push(g)
    })
    const ordered = [...grouped.hero, ...grouped.wide, ...grouped.standard, ...grouped.compact]

    ordered.forEach(g => {
      const cell = this.gridEl.querySelector(`[data-grant-id="${g.id}"]`)
      if (cell) {
        cell.style.display = ''
        this.gridEl.appendChild(cell) // moves to end = reorder
      }
    })

    // Hide filtered-out
    if (this.activeFilter) {
      this.grants.forEach(g => {
        if (!this._matchesFilter(g, this.activeFilter)) {
          const cell = this.gridEl.querySelector(`[data-grant-id="${g.id}"]`)
          if (cell) cell.style.display = 'none'
        }
      })
    }
  }

  _matchesFilter(grant, filter) {
    if (filter === 'Federal' || filter === 'Foundation' || filter === 'Corporate') return grant.type === filter
    if (filter === '90%+ Fit') return (grant.fit_score || 0) >= 90
    if (filter === '> $500K') return (grant.amount || 0) > 500000
    return true
  }

  // =========================================================================
  // PRIVATE — FLIP Animation
  // =========================================================================

  _flipReflow(callback) {
    if (!this.gridEl) { callback(); return }

    const p = this.prefix
    const cells = this.gridEl.querySelectorAll('.' + p + 'grid-cell:not(.' + p + 'skeleton)')

    // FIRST: Record current positions
    const firstRects = new Map()
    cells.forEach(cell => {
      firstRects.set(cell.dataset.grantId, cell.getBoundingClientRect())
    })

    // Execute the DOM changes
    callback()

    // LAST: Read new positions
    const updatedCells = this.gridEl.querySelectorAll('.' + p + 'grid-cell:not(.' + p + 'skeleton)')
    updatedCells.forEach(cell => {
      const gid = cell.dataset.grantId
      const first = firstRects.get(gid)
      if (!first) return // New cell, skip FLIP

      const last = cell.getBoundingClientRect()
      const dx = first.left - last.left
      const dy = first.top - last.top
      const sx = first.width / last.width
      const sy = first.height / last.height

      if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && Math.abs(sx - 1) < 0.01 && Math.abs(sy - 1) < 0.01) return

      // INVERT
      cell.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`
      cell.style.transformOrigin = 'top left'
      cell.style.transition = 'none'

      // PLAY
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          cell.style.transition = 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1)'
          cell.style.transform = 'translate(0, 0) scale(1, 1)'
          cell.addEventListener('transitionend', function handler() {
            cell.style.transform = ''
            cell.style.transformOrigin = ''
            cell.style.transition = ''
            cell.removeEventListener('transitionend', handler)
          }, { once: true })
        })
      })
    })
  }

  // =========================================================================
  // PRIVATE — Champion Management
  // =========================================================================

  _updateChampion(grant) {
    const p = this.prefix
    const prevChampion = this.currentChampionId
    this.currentChampionId = grant.id

    // Remove champion class from previous
    if (prevChampion) {
      const prevCell = this.gridEl.querySelector(`[data-grant-id="${prevChampion}"]`)
      if (prevCell) {
        prevCell.classList.remove(p + 'champion')
        const prevCrown = prevCell.querySelector(`[data-crown="${prevChampion}"]`)
        if (prevCrown) { prevCrown.classList.remove(p + 'visible'); prevCrown.textContent = '' }
      }
    }

    // Add champion to new
    const newCell = this.gridEl.querySelector(`[data-grant-id="${grant.id}"]`)
    if (newCell) newCell.classList.add(p + 'champion')

    // Show crown
    const t = setTimeout(() => {
      this._setCrown(grant.id, '\u{1F451}')
    }, 600)
    this.timers.push(t)

    // Toast notification (only if not the first grant)
    if (prevChampion && prevChampion !== grant.id) {
      this._showChampionToast(grant)
    }
  }

  _setCrown(grantId, emoji) {
    const p = this.prefix
    const cell = this.gridEl.querySelector(`[data-grant-id="${grantId}"]`)
    if (!cell) return
    const crown = cell.querySelector(`[data-crown="${grantId}"]`)
    if (crown) {
      crown.textContent = emoji
      crown.classList.add(p + 'visible')
    }
  }

  _showChampionToast(grant) {
    if (!this.championToastEl) return
    const p = this.prefix
    this.championToastEl.textContent = `New #1! ${grant.name} (${grant.fit_score}% fit)`
    this.championToastEl.classList.add(p + 'show')
    const t = setTimeout(() => this.championToastEl.classList.remove(p + 'show'), 2500)
    this.timers.push(t)
  }

  // =========================================================================
  // PRIVATE — Source Status Bar
  // =========================================================================

  _activateSource(providerKey) {
    const p = this.prefix
    // If not a known provider, add a card dynamically
    if (!this.sourceCards.has(providerKey)) {
      const pd = getProviderDisplay(providerKey)
      const card = document.createElement('div')
      card.className = p + 'source-card'
      card.innerHTML = `
        <span class="${p}source-abbrev">${pd.abbrev}</span>
        <span class="${p}source-state">Idle</span>
        <span class="${p}check-icon"> \u2713</span>
      `
      this.sourceCards.set(providerKey, card)
      if (this.sourceBarEl) this.sourceBarEl.appendChild(card)
    }

    const card = this.sourceCards.get(providerKey)
    if (!card) return

    this.providersActivated.add(providerKey)
    card.className = p + 'source-card ' + p + 'scanning'
    const stateEl = card.querySelector('.' + p + 'source-state')
    if (stateEl) stateEl.textContent = 'Scanning...'
  }

  _completeSource(providerKey) {
    const p = this.prefix
    const card = this.sourceCards.get(providerKey)
    if (!card) return

    this.providersCompleted.add(providerKey)
    card.className = p + 'source-card ' + p + 'complete'
    const stateEl = card.querySelector('.' + p + 'source-state')
    if (stateEl) stateEl.textContent = 'Done'
  }

  // =========================================================================
  // PRIVATE — Ticker
  // =========================================================================

  _updateTicker(message) {
    if (!this.tickerTextEl) return
    this.tickerTextEl.style.transition = 'opacity 0.2s ease'
    this.tickerTextEl.style.opacity = '0'
    const t = setTimeout(() => {
      this.tickerTextEl.textContent = message
      this.tickerTextEl.style.opacity = '1'
    }, 200)
    this.timers.push(t)
  }

  _updateTickerForGrant(grant, providerKey) {
    const pd = providerKey ? getProviderDisplay(providerKey) : { name: 'Search' }
    const amountStr = grant.amountStr || formatAmount(grant.amount || 0)
    const messages = [
      `Found: ${grant.name} (${grant.fit_score}% fit)`,
      `${grant.funder} \u2014 ${amountStr} available`,
      `New ${(grant.type || '').toLowerCase()} grant via ${pd.name}`,
    ]
    this._updateTicker(messages[Math.floor(Math.random() * messages.length)])
  }

  // =========================================================================
  // PRIVATE — Counter & Progress
  // =========================================================================

  _updateCounter() {
    if (!this.grantCountEl) return
    this.grantCountEl.textContent = this.grants.length
    this.grantCountEl.classList.add(this.prefix + 'bump')
    const t = setTimeout(() => this.grantCountEl.classList.remove(this.prefix + 'bump'), 150)
    this.timers.push(t)
  }

  // =========================================================================
  // PRIVATE — Labor Illusion Counter
  // =========================================================================

  _startLaborCounter() {
    this.laborStartTime = Date.now()
    this.laborRunning = true

    const totalGrants = 67000
    const totalDbs = 5
    const totalAmount = 12.4

    // Show counter after 1.5s
    const t = setTimeout(() => {
      if (this.headerLaborEl) this.headerLaborEl.classList.add(this.prefix + 'visible')
    }, 1500)
    this.timers.push(t)

    const tick = () => {
      if (!this.laborRunning) return
      const elapsed = Date.now() - this.laborStartTime
      const duration = 60000 // 60s nominal
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)

      if (this.laborGrantsEl) this.laborGrantsEl.textContent = Math.floor(eased * totalGrants).toLocaleString()
      if (this.laborDbsEl) this.laborDbsEl.textContent = String(Math.min(Math.floor(progress * 8) + 1, totalDbs))
      if (this.laborAmountEl) this.laborAmountEl.textContent = (eased * totalAmount).toFixed(1)
      if (this.progressFillEl) this.progressFillEl.style.width = `${progress * 100}%`

      this.animFrameId = requestAnimationFrame(tick)
    }
    this.animFrameId = requestAnimationFrame(tick)
  }

  // =========================================================================
  // PRIVATE — Ranked Sidebar
  // =========================================================================

  _updateRankedSidebar() {
    if (!this.rankedListEl || !this.rankedCountEl) return
    const p = this.prefix

    this.rankedCountEl.textContent = String(this.grants.length)
    this.rankedListEl.innerHTML = ''

    this.grants.forEach((grant, idx) => {
      const rank = idx + 1
      const isBest = grant.id === this.currentChampionId
      const isSelected = grant.id === this.selectedGrantId
      const typeColor = TYPE_COLORS[grant.type] || '#6B7280'
      const fitScore = grant.fit_score || 0
      const fitBg = fitScore >= 90 ? 'rgba(245,207,73,0.15)' : fitScore >= 70 ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.03)'
      const fitColor = fitScore >= 90 ? '#B8940E' : fitScore >= 70 ? '#4B5563' : '#9CA3AF'
      const name = grant.name || ''
      const shortName = name.length > 28 ? name.slice(0, 26) + '...' : name
      const amountStr = grant.amountStr || formatAmount(grant.amount || 0)

      const item = document.createElement('div')
      let cls = p + 'ranked-item'
      if (isBest) cls += ' ' + p + 'best-match'
      if (isSelected) cls += ' ' + p + 'selected'
      item.className = cls
      item.dataset.grantId = grant.id
      item.style.animationDelay = (idx * 30) + 'ms'
      item.innerHTML = `
        ${isBest ? `<span class="${p}rank-crown">\u{1F451}</span>` : ''}
        <span class="${p}rank-num">${rank}</span>
        <div class="${p}rank-info">
          <div class="${p}rank-name">${shortName}</div>
          <div class="${p}rank-meta">
            <span style="color:${typeColor};">${grant.type || ''}</span>
            <span>&middot;</span>
            <span>${amountStr}</span>
          </div>
        </div>
        <span class="${p}rank-fit" style="background:${fitBg};color:${fitColor};">${fitScore}%</span>
      `

      item.addEventListener('click', () => this._selectCard(grant))
      this.rankedListEl.appendChild(item)
    })
  }

  _highlightRankedItem(id) {
    if (!this.rankedListEl) return
    const p = this.prefix
    this.rankedListEl.querySelectorAll('.' + p + 'ranked-item').forEach(el => {
      el.classList.toggle(p + 'selected', el.dataset.grantId === String(id))
    })
  }

  // =========================================================================
  // PRIVATE — Detail Panel
  // =========================================================================

  _selectCard(grant) {
    this.selectedGrantId = grant.id
    this._highlightRankedItem(grant.id)
    this._openDetail(grant)

    if (this.onSelectCallback) {
      this.onSelectCallback(grant)
    }
  }

  _openDetail(grant) {
    const p = this.prefix
    const tc = TYPE_COLORS[grant.type] || '#6B7280'
    const fitScore = grant.fit_score || 0
    const fitColor = fitScore >= 90 ? '#B8940E' : tc
    const amountStr = grant.amountStr || formatAmount(grant.amount || 0)
    const providerDisplay = grant.source ? getProviderDisplay(grant.source) : null

    // Fit gauge SVG
    const circumference = 2 * Math.PI * 38
    const offset = circumference - (fitScore / 100) * circumference

    if (this.detailHeaderEl) {
      this.detailHeaderEl.innerHTML = `
        <span class="${p}detail-type-badge" style="background:${tc}">${grant.type || ''}</span>
        <div class="${p}detail-title">${grant.name || ''}</div>
        <div class="${p}detail-funder">${grant.funder || ''}</div>
        <svg class="${p}detail-gauge" viewBox="0 0 100 100">
          <circle class="${p}detail-gauge-bg" cx="50" cy="50" r="38"/>
          <circle class="${p}detail-gauge-fill" cx="50" cy="50" r="38"
            stroke="${fitColor}"
            stroke-dasharray="${circumference}"
            stroke-dashoffset="${offset}"
            transform="rotate(-90 50 50)"/>
          <text class="${p}detail-gauge-text" x="50" y="50">${fitScore}%</text>
        </svg>
        <div class="${p}detail-stats">
          <div class="${p}detail-stat-block">
            <span class="${p}detail-stat-label">Amount</span>
            <span class="${p}detail-stat-value">${amountStr}</span>
          </div>
          <div class="${p}detail-stat-block">
            <span class="${p}detail-stat-label">Deadline</span>
            <span class="${p}detail-stat-value" style="font-size:16px">${grant.deadline || 'Open'}</span>
          </div>
          ${providerDisplay ? `<div class="${p}detail-stat-block">
            <span class="${p}detail-stat-label">Source</span>
            <span class="${p}detail-stat-value" style="font-size:14px;font-family:var(--font-body)">${providerDisplay.name}</span>
          </div>` : ''}
        </div>
      `
    }

    if (this.detailBodyEl) {
      const matchReasonsHtml = (grant.match_reasons && grant.match_reasons.length > 0)
        ? `<div class="${p}detail-section">
            <div class="${p}detail-section-title">Match Reasons</div>
            <div class="${p}detail-match-reasons">
              ${grant.match_reasons.map(r => `<span class="${p}detail-match-tag">${r}</span>`).join('')}
            </div>
          </div>`
        : ''

      this.detailBodyEl.innerHTML = `
        <div class="${p}detail-section">
          <div class="${p}detail-section-title">Summary</div>
          <div class="${p}detail-section-text">${grant.summary || ''}</div>
        </div>
        ${grant.eligibility ? `<div class="${p}detail-section">
          <div class="${p}detail-section-title">Eligibility</div>
          <div class="${p}detail-section-text">${grant.eligibility}</div>
        </div>` : ''}
        ${matchReasonsHtml}
      `
    }

    // Update action buttons with grant URL
    if (this.detailActionsEl) {
      const grantUrl = grant.url || (grant.slug ? `/grants/${grant.slug}` : null)
      this.detailActionsEl.innerHTML = grantUrl
        ? `<a href="${grantUrl}" target="_blank" rel="noopener noreferrer"
            class="${p}detail-btn-primary" style="text-decoration:none;text-align:center;display:block">View Grant</a>`
        : `<button class="${p}detail-btn-primary" data-action="select">View Grant</button>`
      // Wire the fallback button when no URL is available
      if (!grantUrl) {
        const btn = this.detailActionsEl.querySelector('[data-action="select"]')
        if (btn) btn.addEventListener('click', () => {
          if (this.onSelectCallback) this.onSelectCallback(grant)
        })
      }
    }

    this.detailPanelEl.classList.add(p + 'open')
    this.mainAreaEl.classList.add(p + 'detail-open')
  }

  _closeDetail() {
    if (!this.detailPanelEl || !this.mainAreaEl) return
    const p = this.prefix
    this.detailPanelEl.classList.remove(p + 'open')
    this.mainAreaEl.classList.remove(p + 'detail-open')
    this.selectedGrantId = null
    this._highlightRankedItem(null)
  }

  // =========================================================================
  // PRIVATE — Filter Chips
  // =========================================================================

  _buildFilterChips() {
    if (!this.filterBarEl) return
    const p = this.prefix

    const federalCount = this.grants.filter(g => g.type === 'Federal').length
    const foundationCount = this.grants.filter(g => g.type === 'Foundation').length
    const corporateCount = this.grants.filter(g => g.type === 'Corporate').length
    const highFitCount = this.grants.filter(g => (g.fit_score || 0) >= 90).length
    const bigCount = this.grants.filter(g => (g.amount || 0) > 500000).length

    const filters = [
      { label: `Federal (${federalCount})`, key: 'Federal' },
      { label: `Foundation (${foundationCount})`, key: 'Foundation' },
      { label: `Corporate (${corporateCount})`, key: 'Corporate' },
      { label: `90%+ Fit (${highFitCount})`, key: '90%+ Fit' },
      { label: `> $500K (${bigCount})`, key: '> $500K' },
    ]

    this.filterBarEl.innerHTML = ''
    filters.forEach(f => {
      const chip = document.createElement('button')
      chip.className = p + 'filter-chip'
      chip.textContent = f.label
      chip.addEventListener('click', () => {
        if (this.activeFilter === f.key) {
          this.activeFilter = null
          chip.classList.remove(p + 'active')
        } else {
          this.activeFilter = f.key
          this.filterBarEl.querySelectorAll('.' + p + 'filter-chip').forEach(c => c.classList.remove(p + 'active'))
          chip.classList.add(p + 'active')
        }
        this._flipReflow(() => this._rebuildGrid())
      })
      this.filterBarEl.appendChild(chip)
    })

    this.filterBarEl.classList.add(p + 'visible')
  }

  // =========================================================================
  // PRIVATE — Confetti
  // =========================================================================

  _triggerConfetti() {
    if (typeof window === 'undefined' || !window.confetti) return
    const t = setTimeout(() => {
      try {
        window.confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F5CF49', '#E8B708', '#B8940E', '#7C3AED', '#2563EB']
        })
      } catch (_) { /* confetti errors are non-fatal */ }
    }, 400)
    this.timers.push(t)
  }
}
