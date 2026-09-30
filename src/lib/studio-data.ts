import type { AspectRatio, HistoryItem, ScenePreset, StudioModel } from "@/types/studio";

export const models: StudioModel[] = [
  {
    id: "cinematic",
    name: "FramePilot Cinematic",
    description: "Balanced motion with a film-first look.",
    tags: ["Cinematic", "Balanced", "Recommended"],
  },
  {
    id: "motion-pro",
    name: "Motion Pro",
    description: "Confident camera moves and expressive motion.",
    tags: ["Dynamic", "Camera control"],
  },
  {
    id: "realistic",
    name: "Realistic Studio",
    description: "Natural light, grounded movement, rich detail.",
    tags: ["Photoreal", "Subtle motion"],
  },
];

export const aspectRatios: AspectRatio[] = ["21:9", "16:9", "4:3", "1:1", "3:4", "9:16"];

export const presets: ScenePreset[] = [
  {
    id: "portrait",
    title: "Cinematic portrait",
    category: "Character",
    prompt: "A close portrait caught between moments, soft wind moving through the frame, amber light falling across a thoughtful face, shallow depth of field and quiet film grain.",
    modelId: "cinematic",
    duration: 5,
    aspectRatio: "3:4",
    quality: "1080p",
    scene: "portrait",
  },
  {
    id: "product",
    title: "Product commercial",
    category: "Product",
    prompt: "A sculptural glass perfume bottle on dark stone, a ribbon of water catching a precise beam of light, slow orbiting camera, crisp reflections and premium editorial color.",
    modelId: "realistic",
    duration: 5,
    aspectRatio: "16:9",
    quality: "1080p",
    scene: "product",
  },
  {
    id: "anime",
    title: "Anime motion",
    category: "Animation",
    prompt: "A young pilot races above a cloud ocean at sunset, hair and jacket pulled by the wind, bold hand-drawn motion streaks, expressive cel shading and a sweeping follow camera.",
    modelId: "motion-pro",
    duration: 10,
    aspectRatio: "16:9",
    quality: "1080p",
    scene: "anime",
  },
  {
    id: "night-city",
    title: "Night city",
    category: "Atmosphere",
    prompt: "A rain-soaked city street after midnight, passing headlights painting the pavement in red and cyan, gentle handheld push forward, distant signs dissolving into mist.",
    modelId: "cinematic",
    duration: 10,
    aspectRatio: "21:9",
    quality: "1080p",
    scene: "city",
  },
  {
    id: "landscape",
    title: "Epic landscape",
    category: "Environment",
    prompt: "An immense mountain range rising above a sea of clouds at first light, slow aerial drift toward the sunlit ridge, atmospheric haze and a sense of quiet scale.",
    modelId: "cinematic",
    duration: 10,
    aspectRatio: "21:9",
    quality: "1080p",
    scene: "landscape",
  },
  {
    id: "fashion",
    title: "Fashion editorial",
    category: "Editorial",
    prompt: "A model in a sculptural black coat crosses a windswept rooftop, fabric moving in slow motion, cool overcast light, elegant tracking shot and high-contrast magazine styling.",
    modelId: "realistic",
    duration: 5,
    aspectRatio: "3:4",
    quality: "1080p",
    scene: "fashion",
  },
];

const demoPrompts = [
  "A lone astronaut walking across a frozen alien shoreline at blue hour, cinematic anamorphic lighting, slow forward camera movement, subtle wind pushing the suit fabric, distant mountains fading into mist.",
  "A polished watch floating above a black reflective surface, a narrow gold light tracing the bezel as the camera makes a precise half orbit, luxury product film, tactile reflections.",
  "A courier on a motorbike cuts through a rain-drenched neon city, reflections streak across the street, fast lateral tracking shot, deep indigo shadows and electric red signs.",
];

export function makeDemoHistory(now = Date.now()): HistoryItem[] {
  return [
    {
      id: "demo-astronaut",
      createdAt: new Date(now - 1000 * 60 * 28).toISOString(),
      prompt: demoPrompts[0],
      modelId: "cinematic",
      duration: 10,
      aspectRatio: "21:9",
      quality: "1080p",
      bitrate: "High",
      scene: "landscape",
      presetId: "landscape",
      motionIntensity: 48,
      cameraMovement: "Slow push",
      seed: "483921",
      status: "complete",
      thumbnail: "/scenes/landscape.svg",
      saved: true,
    },
    {
      id: "demo-watch",
      createdAt: new Date(now - 1000 * 60 * 60 * 4).toISOString(),
      prompt: demoPrompts[1],
      modelId: "realistic",
      duration: 5,
      aspectRatio: "1:1",
      quality: "1080p",
      bitrate: "Standard",
      scene: "product",
      presetId: "product",
      motionIntensity: 38,
      cameraMovement: "Orbit",
      seed: "728104",
      status: "complete",
      thumbnail: "/scenes/product.svg",
      saved: true,
    },
    {
      id: "demo-city",
      createdAt: new Date(now - 1000 * 60 * 60 * 20).toISOString(),
      prompt: demoPrompts[2],
      modelId: "motion-pro",
      duration: 10,
      aspectRatio: "16:9",
      quality: "720p",
      bitrate: "High",
      scene: "city",
      presetId: "night-city",
      motionIntensity: 72,
      cameraMovement: "Tracking",
      seed: "196035",
      status: "complete",
      thumbnail: "/scenes/city.svg",
      saved: false,
    },
  ];
}

export const promptIdeas = [
  "A lone astronaut on a frozen shoreline at blue hour",
  "A perfume bottle catching a ribbon of light",
  "A midnight drive through a rain-soaked city",
];

export function getModelName(id: string) {
  return models.find((model) => model.id === id)?.name ?? models[0].name;
}

export function formatAspectLabel(ratio: AspectRatio) {
  return ratio.replace(":", " / ");
}

export function relativeTime(date: string) {
  const elapsed = Math.max(0, Date.now() - new Date(date).getTime());
  const minutes = Math.floor(elapsed / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
