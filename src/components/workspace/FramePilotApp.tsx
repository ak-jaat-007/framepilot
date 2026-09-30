"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import StudioHeader from "@/components/layout/StudioHeader";
import CreationPanel from "@/components/workspace/CreationPanel";
import HistoryDrawer from "@/components/history/HistoryDrawer";
import ModelPicker from "@/components/workspace/ModelPicker";
import TemplateGallery from "@/components/workspace/TemplateGallery";
import PreviewPanel from "@/components/preview/PreviewPanel";
import { useGenerationMachine } from "@/hooks/use-generation-machine";
import { readHistory, writeHistory } from "@/lib/history-storage";
import { models, presets } from "@/lib/studio-data";
import type { HistoryItem, ModelId, ProjectSettings, ReferenceAsset, StudioView } from "@/types/studio";

const initialSettings: ProjectSettings = {
  prompt: "",
  modelId: "cinematic",
  duration: 5,
  aspectRatio: "16:9",
  quality: "1080p",
  bitrate: "Standard",
  scene: "landscape",
  presetId: null,
  motionIntensity: 52,
  cameraMovement: "Slow push",
  seed: "483921",
};

export default function FramePilotApp() {
  const [settings, setSettings] = useState<ProjectSettings>(initialSettings);
  const [reference, setReference] = useState<ReferenceAsset | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryReady, setIsHistoryReady] = useState(false);
  const [activeResult, setActiveResult] = useState<HistoryItem | null>(null);
  const [renderPrompt, setRenderPrompt] = useState("");
  const [view, setView] = useState<StudioView>("create");
  const [modelPickerOpen, setModelPickerOpen] = useState(false);
  const [enhanced, setEnhanced] = useState(false);
  const [toast, setToast] = useState("");
  const generation = useGenerationMachine();
  const generationSnapshot = useRef<ProjectSettings | null>(null);
  const handledGeneration = useRef(0);
  const toastTimer = useRef<number | null>(null);
  const latestReference = useRef<ReferenceAsset | null>(null);

  useEffect(() => {
    // Browser history is hydrated only after the server-rendered shell mounts.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHistory(readHistory());
    setIsHistoryReady(true);
  }, []);

  useEffect(() => {
    latestReference.current = reference;
  }, [reference]);

  useEffect(() => () => {
    if (latestReference.current?.isObjectUrl) URL.revokeObjectURL(latestReference.current.previewUrl);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
  }, []);

  const notify = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 2800);
  }, []);

  const isGenerating = ["preparing", "planning", "rendering", "finalizing"].includes(generation.state.status);
  const canGenerate = settings.prompt.trim().length > 0 && Boolean(reference) && isHistoryReady;
  const creditCost = useMemo(() => 18 + (settings.duration === 10 ? 14 : 0) + (settings.quality === "1080p" ? 5 : 0) + (settings.bitrate === "High" ? 3 : 0), [settings.duration, settings.quality, settings.bitrate]);

  const updateSettings = useCallback((patch: Partial<ProjectSettings>) => {
    setSettings((current) => ({ ...current, ...patch }));
    if ("prompt" in patch) setEnhanced(false);
  }, []);

  const addHistory = useCallback((item: HistoryItem) => {
    setHistory((current) => {
      const next = [item, ...current.filter((entry) => entry.id !== item.id)].slice(0, 24);
      writeHistory(next);
      return next;
    });
  }, []);

  const startGeneration = useCallback(() => {
    if (!settings.prompt.trim() || !reference) {
      notify(!reference ? "Add a reference image to start your scene." : "Add a prompt to start your scene.");
      return;
    }
    const nextId = generation.state.generationId + 1;
    generationSnapshot.current = { ...settings };
    setRenderPrompt(settings.prompt);
    handledGeneration.current = 0;
    setActiveResult(null);
    setView("create");
    generation.start(nextId);
  }, [generation, notify, reference, settings]);

  useEffect(() => {
    if (generation.state.status !== "complete" || generation.state.generationId === handledGeneration.current) return;
    const snapshot = generationSnapshot.current;
    if (!snapshot) {
      generation.fail("The render setup could not be restored. Start a new generation.");
      return;
    }
    handledGeneration.current = generation.state.generationId;
    const created: HistoryItem = {
      ...snapshot,
      id: `scene-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
      status: "complete",
      thumbnail: `/scenes/${snapshot.scene || "landscape"}.svg`,
      saved: false,
    };
    setActiveResult(created);
    addHistory(created);
    notify("Scene rendered and added to your library.");
  }, [addHistory, generation, generation.state.generationId, generation.state.status, notify]);

  const handlePreset = useCallback((id: string) => {
    const preset = presets.find((entry) => entry.id === id);
    if (!preset) return;
    setSettings((current) => ({ ...current, prompt: preset.prompt, modelId: preset.modelId, duration: preset.duration, aspectRatio: preset.aspectRatio, quality: preset.quality, scene: preset.scene, presetId: preset.id }));
    setEnhanced(false);
    setActiveResult(null);
    if (!reference) setReference({ previewUrl: `/scenes/${preset.scene}.svg`, name: `${preset.title} reference`, isObjectUrl: false });
    setView("create");
    notify(`${preset.title} is ready to shape.`);
  }, [notify, reference]);

  const handleEnhance = useCallback(() => {
    const original = settings.prompt.trim().replace(/[.!?]+$/, "");
    if (!original) return;
    const lower = original.toLowerCase();
    const camera = settings.cameraMovement.toLowerCase();
    const light = lower.includes("light") || lower.includes("lighting") ? "preserve the existing light cues" : "soft directional light with layered shadow";
    const composition = lower.includes("close") || lower.includes("portrait") ? "an intimate close composition" : "a composed cinematic frame with clear subject separation";
    const movement = lower.includes("camera") || lower.includes("tracking") || lower.includes("orbit") ? "measured camera motion" : `${camera} camera movement`;
    const atmosphere = lower.includes("mist") || lower.includes("fog") || lower.includes("rain") ? "atmospheric depth and tactile texture" : "subtle atmospheric depth and restrained film grain";
    const enhancedPrompt = `${original}, ${composition}, ${movement}, ${light}, ${atmosphere}.`;
    setSettings((current) => ({ ...current, prompt: enhancedPrompt.slice(0, 800) }));
    setEnhanced(true);
    notify("Prompt expanded locally with composition, camera, and lighting cues.");
  }, [notify, settings.cameraMovement, settings.prompt]);

  const updateReference = useCallback((next: ReferenceAsset) => {
    setReference((current) => {
      if (current?.isObjectUrl) URL.revokeObjectURL(current.previewUrl);
      return next;
    });
    setActiveResult(null);
  }, []);

  const removeReference = useCallback(() => {
    setReference((current) => {
      if (current?.isObjectUrl) URL.revokeObjectURL(current.previewUrl);
      return null;
    });
  }, []);

  const openView = useCallback((target: StudioView) => {
    setView(target);
    if (target === "library") setModelPickerOpen(false);
  }, []);

  const closeLibrary = useCallback(() => setView((current) => current === "library" ? "create" : current), []);

  const applyPromptFromHistory = useCallback((item: HistoryItem) => {
    setSettings((current) => ({ ...current, prompt: item.prompt, presetId: item.presetId, scene: item.scene }));
    setActiveResult(null);
    setView("create");
    setEnhanced(false);
    notify("Prompt returned to your composer.");
  }, [notify]);

  const duplicateSettings = useCallback((item: HistoryItem) => {
    setSettings({ prompt: item.prompt, modelId: item.modelId, duration: item.duration, aspectRatio: item.aspectRatio, quality: item.quality, bitrate: item.bitrate, scene: item.scene, presetId: item.presetId, motionIntensity: item.motionIntensity, cameraMovement: item.cameraMovement, seed: item.seed });
    setReference({ previewUrl: item.thumbnail, name: "Saved scene reference", isObjectUrl: false });
    setActiveResult(item);
    setView("create");
    notify("Setup duplicated. Adjust anything and generate again.");
  }, [notify]);

  const restoreHistory = useCallback((item: HistoryItem) => {
    duplicateSettings(item);
    setView("create");
  }, [duplicateSettings]);

  const saveToLibrary = useCallback((item: HistoryItem) => {
    const nextSaved = !item.saved;
    const updated = { ...item, saved: nextSaved };
    setActiveResult(updated);
    setHistory((current) => {
      const next = current.map((entry) => entry.id === item.id ? updated : entry);
      writeHistory(next);
      return next;
    });
    notify(nextSaved ? "Scene saved to your library." : "Scene removed from saved items.");
  }, [notify]);

  const downloadPreview = useCallback((item: HistoryItem) => {
    const anchor = document.createElement("a");
    anchor.href = item.thumbnail;
    anchor.download = `framepilot-${item.scene}-preview.svg`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    notify("Preview still downloaded. Video export is simulated in this demo.");
  }, [notify]);

  const currentResult = activeResult;

  return (
    <main className="framepilot-app">
      <StudioHeader view={view} modelId={settings.modelId} historyCount={history.length} onNavigate={openView} onChooseModel={() => setModelPickerOpen(true)} />
      <div className="workspace-shell">
        <CreationPanel settings={settings} reference={reference} onSettingsChange={updateSettings} onReferenceChange={updateReference} onReferenceRemove={removeReference} onModelOpen={() => setModelPickerOpen(true)} onEnhance={handleEnhance} enhanced={enhanced} canGenerate={canGenerate} isGenerating={isGenerating} creditCost={creditCost} onGenerate={startGeneration} />
        <div className="right-stage">
          {view === "templates" ? <TemplateGallery selectedId={settings.presetId} onChoose={handlePreset} /> : <PreviewPanel key={currentResult?.id ?? "preview"} status={generation.state.status} progress={generation.state.progress} prompt={isGenerating ? renderPrompt : settings.prompt} scene={settings.scene} result={currentResult} settings={settings} saved={Boolean(currentResult?.saved)} onCancel={() => { generation.cancel(); generationSnapshot.current = null; setRenderPrompt(""); notify("Render cancelled."); }} onGenerate={startGeneration} onUsePrompt={applyPromptFromHistory} onDuplicate={duplicateSettings} onSave={saveToLibrary} onDownload={downloadPreview} onUsePreset={handlePreset} />}
          {generation.state.status === "error" && <div className="error-banner" role="alert"><span>{generation.state.error ?? "The render failed."}</span><button onClick={startGeneration}>Try again</button></div>}
        </div>
      </div>
      <HistoryDrawer open={view === "library"} history={history} onClose={closeLibrary} onRestore={restoreHistory} />
      <ModelPicker open={modelPickerOpen} value={settings.modelId as ModelId} onClose={() => setModelPickerOpen(false)} onChoose={(modelId) => { updateSettings({ modelId }); setModelPickerOpen(false); notify(`${models.find((model) => model.id === modelId)?.name ?? "Model"} selected.`); }} />
      <AnimatePresence>
        {toast && <motion.div className="toast-message" role="status" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}><span><Check size={13} /></span>{toast}<Sparkles size={13} className="toast-sparkle" /></motion.div>}
      </AnimatePresence>
    </main>
  );
}
