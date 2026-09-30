"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Bookmark, Clock3, Film, Search, X } from "lucide-react";
import { getModelName, relativeTime } from "@/lib/studio-data";
import type { HistoryItem } from "@/types/studio";

interface HistoryDrawerProps {
  open: boolean;
  history: HistoryItem[];
  onClose: () => void;
  onRestore: (item: HistoryItem) => void;
}

export default function HistoryDrawer({ open, history, onClose, onRestore }: HistoryDrawerProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "saved">("all");
  const filtered = useMemo(() => history.filter((item) => (filter === "all" || item.saved) && item.prompt.toLowerCase().includes(query.toLowerCase())), [filter, history, query]);

  return (
    <AnimatePresence>
      {open && <>
        <motion.button className="drawer-scrim" aria-label="Close library" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
        <motion.aside className="history-drawer" role="dialog" aria-modal="true" aria-labelledby="history-title" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 32, stiffness: 320 }}>
          <header className="drawer-header"><div><span className="eyebrow">YOUR WORKSPACE</span><h2 id="history-title">Library <span>{history.length}</span></h2></div><button className="icon-button" onClick={onClose} aria-label="Close library"><X size={18} /></button></header>
          <div className="drawer-intro"><span className="drawer-intro-icon"><Film size={15} /></span><p>Your generations live here, ready to revisit or build on.</p></div>
          <div className="library-tools"><label className="library-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your scenes" aria-label="Search library" /><kbd>⌘ K</kbd></label><div className="library-filter" role="group" aria-label="Filter library">{(["all", "saved"] as const).map((value) => <button className={filter === value ? "is-selected" : ""} key={value} onClick={() => setFilter(value)}>{value === "all" ? "All scenes" : <><Bookmark size={12} /> Saved</>}</button>)}</div></div>
          <div className="library-list" aria-live="polite">
            {filtered.length ? filtered.map((item) => <button className="library-item" key={item.id} onClick={() => onRestore(item)}>
              <span className="library-thumb" style={{ backgroundImage: `url("${item.thumbnail}")` }}><span className="library-thumb-play">▶</span></span>
              <span className="library-item-info"><strong>{item.prompt}</strong><span>{getModelName(item.modelId)} <i>·</i> {item.duration}s <i>·</i> {item.aspectRatio}</span><span className="library-item-time"><Clock3 size={11} /> {relativeTime(item.createdAt)} {item.saved && <em><Bookmark size={10} fill="currentColor" /> Saved</em>}</span></span>
              <ArrowUpRight className="library-item-arrow" size={15} />
            </button>) : <div className="library-empty"><span className="library-empty-mark"><Search size={18} /></span><strong>No scenes found</strong><span>Try another search or switch to all scenes.</span></div>}
          </div>
          <footer className="drawer-footer"><span><span className="privacy-dot" /> Saved on this device</span><span>FramePilot Library</span></footer>
        </motion.aside>
      </>}
    </AnimatePresence>
  );
}
