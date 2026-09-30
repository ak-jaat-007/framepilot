export type ModelId = "cinematic" | "motion-pro" | "realistic";
export type AspectRatio = "21:9" | "16:9" | "4:3" | "1:1" | "3:4" | "9:16";
export type Duration = 5 | 10;
export type Quality = "720p" | "1080p";
export type Bitrate = "Standard" | "High";
export type GenerationStatus = "idle" | "preparing" | "planning" | "rendering" | "finalizing" | "complete" | "error";
export type StudioView = "create" | "library" | "templates";

export interface StudioModel {
  id: ModelId;
  name: string;
  description: string;
  tags: string[];
}

export interface ScenePreset {
  id: string;
  title: string;
  category: string;
  prompt: string;
  modelId: ModelId;
  duration: Duration;
  aspectRatio: AspectRatio;
  quality: Quality;
  scene: string;
}

export interface ProjectSettings {
  prompt: string;
  modelId: ModelId;
  duration: Duration;
  aspectRatio: AspectRatio;
  quality: Quality;
  bitrate: Bitrate;
  scene: string;
  presetId: string | null;
  motionIntensity: number;
  cameraMovement: string;
  seed: string;
}

export interface HistoryItem extends ProjectSettings {
  id: string;
  createdAt: string;
  status: "complete";
  thumbnail: string;
  saved: boolean;
}

export interface ReferenceAsset {
  previewUrl: string;
  name: string;
  isObjectUrl: boolean;
}
