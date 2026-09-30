"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownToLine, Bookmark, Check, Expand, Pause, Play, RotateCcw, Volume2, VolumeX, WandSparkles, X } from "lucide-react";
import { presets, relativeTime } from "@/lib/studio-data";
import type { GenerationStatus, HistoryItem, ProjectSettings } from "@/types/studio";

interface PreviewPanelProps {
  status: GenerationStatus;
  progress: number;
  prompt: string;
  scene: string;
  result: HistoryItem | null;
  settings: ProjectSettings;
  saved: boolean;
  onCancel: () => void;
  onGenerate: () => void;
  onUsePrompt: (item: HistoryItem) => void;
  onDuplicate: (item: HistoryItem) => void;
  onSave: (item: HistoryItem) => void;
  onDownload: (item: HistoryItem) => void;
  onUsePreset: (presetId: string) => void;
}

const stageLabels: Record<GenerationStatus, string> = {
  idle: "Ready for your direction",
  preparing: "Preparing scene",
  planning: "Planning camera movement",
  rendering: "Synthesizing motion",
  finalizing: "Finalizing video",
  complete: "Scene complete",
  error: "Something went wrong",
};

function remainingText(progress: number) {
  const seconds = Math.max(1, Math.ceil((100 - progress) * 0.066));
  return `~${seconds}s remaining`;
}

function PrettyTime({ date }: { date: string }) {
  return <span>{relativeTime(date)}</span>;
}

export default function PreviewPanel({ status, progress, prompt, scene, result, settings, saved, onCancel, onGenerate, onUsePrompt, onDuplicate, onSave, onDownload, onUsePreset }: PreviewPanelProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [playhead, setPlayhead] = useState(0);
  const isGenerating = ["preparing", "planning", "rendering", "finalizing"].includes(status);
  const isComplete = result && !isGenerating && status !== "error";
  const stageDetail = progress >= 35 && progress < 64 ? "Synthesizing motion" : progress >= 64 && progress < 88 ? "Rendering frames" : stageLabels[status];

  useEffect(() => {
    if (!playing || !result) return;
    const timer = window.setInterval(() => {
      setPlayhead((time) => {
        if (time >= result.duration) {
          setPlaying(false);
          return 0;
        }
        return Math.min(result.duration, time + 0.12);
      });
    }, 120);
    return () => window.clearInterval(timer);
  }, [playing, result]);

  const togglePlay = () => {
    if (playhead >= (result?.duration ?? 0)) setPlayhead(0);
    setPlaying((current) => !current);
  };

  return (
    <section className="preview-panel" aria-label="Scene preview">
      <div className="preview-topline">
        <div className="preview-breadcrumb"><span>Studio</span><span className="breadcrumb-slash">/</span><strong>{isComplete ? "Your scene" : "Create video"}</strong></div>
        <div className="preview-specs"><span className="spec-live"><span /> {isComplete ? "LOCAL DEMO RENDER" : "PREVIEW CANVAS"}</span><span>{settings.quality}</span><span>{settings.aspectRatio}</span></div>
      </div>

      <AnimatePresence mode="wait">
        {isGenerating ? (
          <motion.div key="generation" className="preview-content generating-content" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <div className="generation-heading"><div><span className="eyebrow">A LITTLE PATIENCE, A LOT OF PICTURE</span><h2>Building your scene<span className="ellipsis">…</span></h2><p>FramePilot is shaping a local demo render from your setup.</p></div><button className="quiet-button cancel-button" onClick={onCancel}><X size={14} /> Cancel render</button></div>
            <div className="render-frame" ref={frameRef}>
              <div className={`artwork artwork-${scene || "landscape"} render-artwork`} style={{ backgroundImage: `url("/scenes/${scene || "landscape"}.svg")` }} />
              <div className="render-vignette" />
              <div className="render-scanline" style={{ top: `${12 + progress * 0.74}%` }} />
              <div className="render-label"><span className="render-pulse" /> Live render preview</div>
              <div className="render-overlay-copy"><span>{stageDetail}</span><h3>{prompt || "A new scene is taking shape"}</h3></div>
              <div className="render-percent">{progress}<small>%</small></div>
            </div>
            <div className="generation-progress-block">
              <div className="progress-row"><span>{stageLabels[status]}</span><span>{remainingText(progress)}</span></div>
              <div className="progress-track"><motion.div className="progress-fill" animate={{ width: `${progress}%` }} transition={{ duration: 0.28, ease: "easeOut" }} /></div>
              <div className="generation-steps">
                {["Preparing scene", "Camera plan", "Motion render", "Final pass"].map((step, index) => {
                  const thresholds = [0, 15, 35, 88];
                  const isDone = progress >= [15, 35, 88, 100][index];
                  const isCurrent = progress >= thresholds[index] && !isDone;
                  return <span className={`${isDone ? "is-done" : ""} ${isCurrent ? "is-current" : ""}`} key={step}>{isDone ? <Check size={11} /> : <i />}{step}</span>;
                })}
              </div>
            </div>
            <div className="prompt-kept-visible"><WandSparkles size={14} /><span>{prompt || "Your prompt will stay with this render."}</span></div>
          </motion.div>
        ) : isComplete ? (
          <motion.div key={`result-${result.id}`} className="preview-content result-content" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <div className="result-heading"><div><span className="eyebrow">LOCAL MOCK GENERATION · {result.quality} · {result.duration} SEC</span><h2>Your scene is ready<span className="success-dot">.</span></h2><p><PrettyTime date={result.createdAt} /> <span className="meta-separator">·</span> {result.aspectRatio} <span className="meta-separator">·</span> {result.modelId === "cinematic" ? "FramePilot Cinematic" : result.modelId === "motion-pro" ? "Motion Pro" : "Realistic Studio"}</p></div><span className="complete-badge"><Check size={12} /> Complete</span></div>
            <div className="result-frame" ref={frameRef}>
              <div className={`artwork artwork-${result.scene} result-artwork ${playing ? "is-playing" : ""}`} style={{ backgroundImage: `url("${result.thumbnail}")` }} />
              <div className="result-vignette" />
              <div className="result-top-badge"><span /> DEMO PREVIEW</div>
              <div className="result-caption"><span>FRAMEPILOT ORIGINAL</span><p>{result.prompt}</p></div>
              <button className="fullscreen-button" onClick={() => frameRef.current?.requestFullscreen?.()} aria-label="Expand preview" title="Expand preview"><Expand size={15} /></button>
              <button className={`volume-button ${muted ? "is-muted" : ""}`} onClick={() => setMuted((value) => !value)} aria-label={muted ? "Unmute preview" : "Mute preview"} title={muted ? "Unmute" : "Mute"}>{muted ? <VolumeX size={15} /> : <Volume2 size={15} />}</button>
            </div>
            <div className="player-controls">
              <button className="play-button" onClick={togglePlay} aria-label={playing ? "Pause preview" : "Play preview"}>{playing ? <Pause size={13} fill="currentColor" /> : <Play size={14} fill="currentColor" />}</button>
              <span className="player-time">{String(Math.floor(playhead / 60)).padStart(2, "0")}:{(playhead % 60).toFixed(1).padStart(4, "0")}</span>
              <input className="timeline-input" type="range" min="0" max={result.duration} step="0.1" value={playhead} onChange={(event) => setPlayhead(Number(event.target.value))} aria-label="Preview timeline" style={{ "--timeline-progress": `${(playhead / result.duration) * 100}%` } as React.CSSProperties} />
              <span className="player-time">00:{String(result.duration).padStart(2, "0")}</span>
              <span className="player-label">Preview playback</span>
            </div>
            <div className="result-prompt-card"><span className="prompt-card-icon"><WandSparkles size={14} /></span><div><span className="result-prompt-label">PROMPT</span><p>{result.prompt}</p></div></div>
            <div className="result-actions">
              <button className="result-action primary-result-action" onClick={onGenerate}><RotateCcw size={14} /> Regenerate</button>
              <button className="result-action" onClick={() => onUsePrompt(result)}><WandSparkles size={14} /> Use prompt again</button>
              <button className="result-action" onClick={() => onDuplicate(result)}><span className="duplicate-glyph">⧉</span> Duplicate setup</button>
              <div className="result-action-spacer" />
              <button className={`result-action save-result ${saved ? "is-saved" : ""}`} onClick={() => onSave(result)}>{saved ? <Check size={14} /> : <Bookmark size={14} />}{saved ? "Saved" : "Save to library"}</button>
              <button className="icon-button export-button" onClick={() => onDownload(result)} aria-label="Download preview still" title="Download preview still"><ArrowDownToLine size={15} /></button>
            </div>
            <p className="mock-disclosure">This is a local mock render. No AI inference was requested.</p>
          </motion.div>
        ) : (
          <motion.div key="empty" className="preview-content empty-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="empty-heading"><div><span className="eyebrow">YOUR CANVAS</span><h2>Turn one idea into a cinematic scene.</h2><p>Start with a visual, shape it with words, then bring it to life.</p></div><span className="canvas-tag"><span /> New project</span></div>
            <div className="empty-frame">
              <div className={`artwork artwork-${scene || "landscape"} empty-artwork`} style={{ backgroundImage: `url("/scenes/${scene || "landscape"}.svg")` }} />
              <div className="empty-frame-overlay" />
              <div className="empty-frame-note"><span className="empty-note-mark"><WandSparkles size={15} /></span><span>THE FRAMEPILOT STUDIO</span></div>
              <div className="empty-frame-title"><span>MAKE IT MOVE</span><h3>What do you<br />want to see?</h3></div>
              <div className="frame-corners"><i /><i /><i /><i /></div>
              <span className="empty-frame-index">01 <span>/</span> 01</span>
            </div>
            <div className="workflow-strip">
              <div className={`workflow-step ${settings.prompt.trim() ? "is-ready" : ""}`}><span className="workflow-step-num">01</span><span><strong>Set a reference</strong><small>{settings.prompt.trim() ? "Image added" : "Optional image guide"}</small></span><span className={`workflow-state ${settings.prompt.trim() ? "complete" : ""}`}>{settings.prompt.trim() ? <Check size={12} /> : "Optional"}</span></div>
              <div className="workflow-step"><span className="workflow-step-num">02</span><span><strong>Shape the prompt</strong><small>{settings.prompt.trim() ? "Prompt ready" : "Describe your idea"}</small></span><span className={`workflow-state ${settings.prompt.trim() ? "complete" : ""}`}>{settings.prompt.trim() ? <Check size={12} /> : "Next"}</span></div>
              <div className="workflow-step"><span className="workflow-step-num">03</span><span><strong>Generate a scene</strong><small>Preview your direction</small></span><span className="workflow-state">Ready</span></div>
            </div>
            <div className="inspiration-heading"><div><span className="eyebrow">A PLACE TO START</span><h3>Quick inspiration</h3></div><span>6 directions</span></div>
            <div className="inspiration-grid">
              {presets.map((preset) => <button className="inspiration-card" key={preset.id} onClick={() => onUsePreset(preset.id)}>
                <span className={`inspiration-art artwork-${preset.scene}`} style={{ backgroundImage: `url("/scenes/${preset.scene}.svg")` }} />
                <span className="inspiration-card-overlay" /><span className="inspiration-card-copy"><small>{preset.category}</small><strong>{preset.title}</strong></span><span className="inspiration-arrow">↗</span>
              </button>)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
