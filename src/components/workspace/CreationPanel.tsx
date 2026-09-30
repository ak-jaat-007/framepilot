"use client";

import { motion } from "framer-motion";
import { ChevronRight, Sparkles, WandSparkles } from "lucide-react";
import { getModelName } from "@/lib/studio-data";
import type { ProjectSettings, ReferenceAsset } from "@/types/studio";
import PromptComposer from "@/components/prompt/PromptComposer";
import ReferenceUploader from "@/components/reference/ReferenceUploader";
import SettingsControls from "@/components/settings/SettingsControls";

interface CreationPanelProps {
  settings: ProjectSettings;
  reference: ReferenceAsset | null;
  onSettingsChange: (patch: Partial<ProjectSettings>) => void;
  onReferenceChange: (reference: ReferenceAsset) => void;
  onReferenceRemove: () => void;
  onModelOpen: () => void;
  onEnhance: () => void;
  enhanced: boolean;
  canGenerate: boolean;
  isGenerating: boolean;
  creditCost: number;
  onGenerate: () => void;
}

export default function CreationPanel({ settings, reference, onSettingsChange, onReferenceChange, onReferenceRemove, onModelOpen, onEnhance, enhanced, canGenerate, isGenerating, creditCost, onGenerate }: CreationPanelProps) {
  return (
    <aside className="creation-panel">
      <div className="creation-scroll">
        <div className="creation-heading">
          <div><span className="eyebrow">YOUR CREATIVE STUDIO</span><h1>Make a scene.</h1><p>One idea, shaped into motion.</p></div>
          <span className="workflow-help" title="Start with an image and a clear prompt" aria-label="Workflow help">?</span>
        </div>

        <ReferenceUploader reference={reference} onChange={onReferenceChange} onRemove={onReferenceRemove} />
        <PromptComposer value={settings.prompt} onChange={(prompt) => onSettingsChange({ prompt, presetId: null })} onEnhance={onEnhance} enhanced={enhanced} disabled={isGenerating} />

        <section className="studio-section model-section" aria-labelledby="model-heading">
          <div className="section-heading">
            <div className="section-title-wrap"><span className="section-number">03</span><h2 id="model-heading">Model</h2></div>
            <span className="model-recommendation"><span className="recommendation-dot" /> Recommended</span>
          </div>
          <button className="selected-model-row" onClick={onModelOpen} disabled={isGenerating}>
            <span className="selected-model-icon"><WandSparkles size={16} /></span>
            <span className="selected-model-copy"><strong>{getModelName(settings.modelId)}</strong><span>Optimized for cinematic storytelling</span></span>
            <span className="change-model">Change <ChevronRight size={14} /></span>
          </button>
        </section>

        <SettingsControls settings={settings} onChange={onSettingsChange} disabled={isGenerating} />

        <div className="creation-footnote"><Sparkles size={13} /><span>Your prompt and reference stay in this browser.</span></div>
      </div>

      <div className="generate-dock">
        <motion.button className="generate-button" onClick={onGenerate} disabled={!canGenerate || isGenerating} whileHover={canGenerate && !isGenerating ? { y: -1 } : undefined} whileTap={canGenerate && !isGenerating ? { scale: 0.99 } : undefined}>
          <span>{isGenerating ? "Creating your scene" : "Generate video"}</span>
          {isGenerating ? <span className="button-working-dot" /> : <span className="generate-arrow"><ChevronRight size={17} /></span>}
        </motion.button>
        <div className="generate-meta">
          <span>{isGenerating ? "Mock render in progress" : `Estimated cost · ${creditCost} credits`}</span>
          {!canGenerate && !isGenerating && <span className="generate-requirement">Add a reference image and prompt</span>}
          {canGenerate && !isGenerating && <span className="credit-balance">1,240 available</span>}
        </div>
      </div>
    </aside>
  );
}
