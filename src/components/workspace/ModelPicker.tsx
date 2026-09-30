"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Clapperboard, Sparkles, Waves, X } from "lucide-react";
import { models } from "@/lib/studio-data";
import type { ModelId } from "@/types/studio";

const modelIcons = { cinematic: Clapperboard, "motion-pro": Waves, realistic: Sparkles };

interface ModelPickerProps { open: boolean; value: ModelId; onClose: () => void; onChoose: (id: ModelId) => void; }

export default function ModelPicker({ open, value, onClose, onChoose }: ModelPickerProps) {
  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open, onClose]);

  return <AnimatePresence>
    {open && <motion.div className="modal-scrim" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.section className="model-modal" role="dialog" aria-modal="true" aria-labelledby="model-modal-title" initial={{ opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.98 }} transition={{ duration: 0.16 }}>
        <header className="model-modal-header"><div><span className="eyebrow">PICK YOUR LOOK</span><h2 id="model-modal-title">Choose a model</h2><p>Three distinct starting points. Change anytime.</p></div><button className="icon-button" onClick={onClose} aria-label="Close model picker"><X size={17} /></button></header>
        <div className="model-options">
          {models.map((model) => {
            const Icon = modelIcons[model.id];
            const selected = model.id === value;
            return <button className={`model-option ${selected ? "is-selected" : ""}`} key={model.id} onClick={() => onChoose(model.id)} aria-pressed={selected}>
              <span className={`model-option-icon model-icon-${model.id}`}><Icon size={18} /></span>
              <span className="model-option-copy"><strong>{model.name}</strong><small>{model.description}</small><span className="model-tags">{model.tags.map((tag) => <em key={tag}>{tag}</em>)}</span></span>
              <span className="model-option-check">{selected && <Check size={15} />}</span>
            </button>;
          })}
        </div>
        <footer className="model-modal-footer"><span><Sparkles size={12} /> All models run as a local demo pipeline.</span><button className="quiet-button" onClick={onClose}>Done</button></footer>
      </motion.section>
    </motion.div>}
  </AnimatePresence>;
}
