"use client";

import { motion } from "framer-motion";
import { ArrowDownToLine, Check, WandSparkles } from "lucide-react";
import { promptIdeas } from "@/lib/studio-data";

interface PromptComposerProps {
  value: string;
  onChange: (value: string) => void;
  onEnhance: () => void;
  enhanced: boolean;
  disabled?: boolean;
}

export default function PromptComposer({ value, onChange, onEnhance, enhanced, disabled }: PromptComposerProps) {
  const remaining = 800 - value.length;
  return (
    <section className="studio-section prompt-section" aria-labelledby="prompt-heading">
      <div className="section-heading">
        <div className="section-title-wrap"><span className="section-number">02</span><h2 id="prompt-heading">Describe your scene</h2></div>
        <span className="required-label">Required <span>·</span></span>
      </div>
      <div className="prompt-shell">
        <textarea
          className="prompt-input"
          value={value}
          maxLength={800}
          onChange={(event) => onChange(event.target.value)}
          placeholder="A lone astronaut crossing a frozen shoreline at blue hour…"
          aria-label="Describe the video you want to create"
          disabled={disabled}
        />
        <div className="prompt-footer">
          <span className={`character-count ${remaining < 80 ? "is-low" : ""}`}>{remaining} characters left</span>
          <motion.button className={`enhance-button ${enhanced ? "is-enhanced" : ""}`} onClick={onEnhance} disabled={!value.trim() || disabled} whileTap={{ scale: 0.97 }}>
            {enhanced ? <Check size={14} /> : <WandSparkles size={14} />}
            {enhanced ? "Enhanced" : "Enhance prompt"}
          </motion.button>
        </div>
      </div>
      <div className="prompt-hints">
        <span className="hint-label">Try a starting point</span>
        <div className="suggestion-list">
          {promptIdeas.map((idea, index) => (
            <button key={idea} className="suggestion-chip" title={idea} onClick={() => onChange(idea)} disabled={disabled}>
              <span className="suggestion-dot">{index === 0 ? "✳" : index === 1 ? "◌" : "↗"}</span>{idea.length > 37 ? `${idea.slice(0, 36)}…` : idea}
            </button>
          ))}
        </div>
      </div>
      <div className="prompt-tip"><ArrowDownToLine size={12} /><span>Include a subject, a camera move, and a mood for stronger results.</span></div>
    </section>
  );
}
