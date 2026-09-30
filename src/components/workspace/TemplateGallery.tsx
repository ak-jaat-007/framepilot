"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { presets } from "@/lib/studio-data";

interface TemplateGalleryProps { selectedId: string | null; onChoose: (id: string) => void; }

export default function TemplateGallery({ selectedId, onChoose }: TemplateGalleryProps) {
  return (
    <motion.div className="template-gallery" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <div className="template-heading"><div><span className="eyebrow">PROMPT STARTERS, NOT PRESETS IN A BOX</span><h2>Find your first frame.</h2><p>Choose a visual direction. We’ll set a useful prompt and starting configuration you can still make your own.</p></div><span className="template-count"><Sparkles size={13} /> 6 directions</span></div>
      <div className="template-grid">
        {presets.map((preset, index) => <button className={`template-card ${selectedId === preset.id ? "is-selected" : ""}`} key={preset.id} onClick={() => onChoose(preset.id)}>
          <span className="template-art-wrap"><span className={`template-art artwork-${preset.scene}`} style={{ backgroundImage: `url("/scenes/${preset.scene}.svg")` }} /><span className="template-art-index">0{index + 1}</span><span className="template-card-arrow"><ArrowUpRight size={16} /></span></span>
          <span className="template-card-body"><span><small>{preset.category}</small><strong>{preset.title}</strong></span><span className="template-card-meta">{preset.duration}s <i>·</i> {preset.aspectRatio}</span></span>
          {selectedId === preset.id && <span className="template-selected-label">Selected</span>}
        </button>)}
      </div>
      <div className="template-footer"><span><Sparkles size={13} /> Every prompt is editable before you generate.</span><span>Choose a direction to continue <span className="template-footer-arrow">↓</span></span></div>
    </motion.div>
  );
}
