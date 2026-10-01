"use client";

import { Aperture, ChevronDown, Layers3, Sparkles } from "lucide-react";
import type { StudioView } from "@/types/studio";
import { models } from "@/lib/studio-data";

interface StudioHeaderProps {
  view: StudioView;
  modelId: string;
  historyCount: number;
  credits: number;
  onNavigate: (view: StudioView) => void;
  onChooseModel: () => void;
}

export default function StudioHeader({ view, modelId, historyCount, credits, onNavigate, onChooseModel }: StudioHeaderProps) {
  const selectedModel = models.find((model) => model.id === modelId) ?? models[0];

  return (
    <header className="topbar">
      <a className="brand" href="#create" onClick={(event) => { event.preventDefault(); onNavigate("create"); }} aria-label="FramePilot home">
        <span className="brand-mark"><Aperture size={18} strokeWidth={2.2} /></span>
        <span>framepilot<span className="brand-period">.</span></span>
      </a>

      <nav className="top-nav" aria-label="Main navigation">
        <button className={`nav-link ${view === "create" ? "is-active" : ""}`} onClick={() => onNavigate("create")}>Create</button>
        <button className={`nav-link ${view === "library" ? "is-active" : ""}`} onClick={() => onNavigate("library")}>
          Library <span className="nav-count">{historyCount}</span>
        </button>
        <button className={`nav-link ${view === "templates" ? "is-active" : ""}`} onClick={() => onNavigate("templates")}>Templates</button>
      </nav>

      <div className="topbar-tools">
        <button className="model-indicator" onClick={onChooseModel} aria-label={`Current model: ${selectedModel.name}. Change model`}>
          <span className="model-indicator-dot" />
          <span>{selectedModel.name}</span>
          <ChevronDown size={13} />
        </button>
        <div className="credits-indicator" aria-label={`${credits.toLocaleString()} credits available`}>
          <Sparkles size={14} /> <span>{credits.toLocaleString()}</span><span className="credits-label">credits</span>
        </div>
        <div className="avatar" aria-label="FramePilot creator profile">FP</div>
        <button className="mobile-library" onClick={() => onNavigate(view === "library" ? "create" : "library")} aria-label="Open library">
          <Layers3 size={18} />
        </button>
      </div>
    </header>
  );
}
