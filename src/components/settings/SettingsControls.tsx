"use client";

import { ChevronDown, Dices, Film, SlidersHorizontal } from "lucide-react";
import { aspectRatios } from "@/lib/studio-data";
import type { AspectRatio, Bitrate, Duration, ProjectSettings, Quality } from "@/types/studio";

interface SettingsControlsProps {
  settings: ProjectSettings;
  onChange: (patch: Partial<ProjectSettings>) => void;
  disabled?: boolean;
}

const ratioSize: Record<AspectRatio, [number, number]> = {
  "21:9": [21, 9],
  "16:9": [16, 9],
  "4:3": [4, 3],
  "1:1": [1, 1],
  "3:4": [3, 4],
  "9:16": [9, 16],
};

function Segment<T extends string | number>({ values, value, onChange, disabled, label }: {
  values: readonly T[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <div className="segmented-control" role="group" aria-label={label}>
      {values.map((item) => <button key={item} className={value === item ? "is-selected" : ""} aria-pressed={value === item} onClick={() => onChange(item)} disabled={disabled}>{item}</button>)}
    </div>
  );
}

export default function SettingsControls({ settings, onChange, disabled }: SettingsControlsProps) {
  return (
    <section className="studio-section settings-section" aria-labelledby="settings-heading">
      <div className="section-heading settings-heading">
        <div className="section-title-wrap"><span className="section-number">04</span><h2 id="settings-heading">Output settings</h2></div>
        <span className="settings-note"><Film size={12} /> Ready to render</span>
      </div>

      <div className="setting-row duration-row">
        <div className="setting-label"><span>Duration</span><span className="setting-value">{settings.duration}s</span></div>
        <Segment<Duration> label="Video duration" values={[5, 10]} value={settings.duration} onChange={(duration) => onChange({ duration })} disabled={disabled} />
      </div>

      <div className="setting-row ratio-row">
        <div className="setting-label"><span>Aspect ratio</span><span className="setting-value">{settings.aspectRatio}</span></div>
        <div className="ratio-grid" role="group" aria-label="Aspect ratio">
          {aspectRatios.map((ratio) => {
            const [width, height] = ratioSize[ratio];
            return <button key={ratio} className={`ratio-option ${settings.aspectRatio === ratio ? "is-selected" : ""}`} onClick={() => onChange({ aspectRatio: ratio })} aria-pressed={settings.aspectRatio === ratio} disabled={disabled}>
              <span className="ratio-icon"><span style={{ width: `${10 + width / 4}px`, height: `${7 + height / 3}px` }} /></span><span>{ratio}</span>
            </button>;
          })}
        </div>
      </div>

      <div className="settings-duo">
        <div className="setting-row">
          <div className="setting-label"><span>Quality</span></div>
          <Segment<Quality> label="Video quality" values={["720p", "1080p"]} value={settings.quality} onChange={(quality) => onChange({ quality })} disabled={disabled} />
        </div>
        <div className="setting-row">
          <div className="setting-label"><span>Bitrate</span></div>
          <Segment<Bitrate> label="Video bitrate" values={["Standard", "High"]} value={settings.bitrate} onChange={(bitrate) => onChange({ bitrate })} disabled={disabled} />
        </div>
      </div>

      <div className="advanced-wrap">
        <details className="advanced-details">
          <summary><span><SlidersHorizontal size={14} /> Advanced controls</span><ChevronDown size={14} className="advanced-chevron" /></summary>
          <div className="advanced-content">
            <label className="range-setting"><span>Motion intensity <strong>{settings.motionIntensity}%</strong></span>
              <input type="range" min="0" max="100" value={settings.motionIntensity} onChange={(event) => onChange({ motionIntensity: Number(event.target.value) })} disabled={disabled} />
              <span className="range-ends"><small>Subtle</small><small>Expressive</small></span>
            </label>
            <label className="select-setting"><span>Camera movement</span>
              <select value={settings.cameraMovement} onChange={(event) => onChange({ cameraMovement: event.target.value })} disabled={disabled}>
                <option>Slow push</option><option>Orbit</option><option>Tracking</option><option>Handheld drift</option><option>Locked frame</option>
              </select>
            </label>
            <label className="select-setting seed-setting"><span>Seed</span>
              <span className="seed-input"><input value={settings.seed} onChange={(event) => onChange({ seed: event.target.value.replace(/\D/g, "").slice(0, 8) })} inputMode="numeric" aria-label="Generation seed" disabled={disabled} /><button className="icon-button small" onClick={() => onChange({ seed: String(Math.floor(Math.random() * 900000 + 100000)) })} aria-label="Randomize seed" disabled={disabled}><Dices size={14} /></button></span>
            </label>
            <p className="advanced-note">Mock controls shape the demo setup; no external model is called.</p>
          </div>
        </details>
      </div>
    </section>
  );
}
