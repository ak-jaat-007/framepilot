# FramePilot

**A focused reference-to-motion creative studio inspired by modern AI video workflows.**

## Overview

FramePilot is a focused creative studio for turning a reference image and a motion prompt into a cinematic animated scene. Shape a visual direction with a prompt, choose a model and output settings, then preview a locally simulated result.

The interface brings the creation flow, templates, and project history together in one workspace. Results are self-contained demo renders; FramePilot does not perform real AI inference.

## Product Decisions

- A single, focused creation workflow keeps the reference, prompt, settings, and preview close together.
- A small set of model choices keeps setup approachable.
- Compact output controls cover the options most useful to a short scene.
- Local prompt enhancement adds composition, camera, lighting, and atmosphere cues while keeping the prompt editable.
- Staged progress makes the simulated generation process clear.
- A library and history make it easy to revisit results and iterate on their settings.

## Core Features

- Upload a local reference image and use it as the visual base for the animated preview.
- Write and edit a motion prompt in the prompt composer.
- Enhance a prompt locally with cinematic direction.
- Choose from three demo model profiles.
- Set duration, aspect ratio, quality, and bitrate.
- Adjust motion intensity, camera movement, and seed in advanced controls.
- Follow staged generation feedback from preparation through finalization.
- Play, pause, and scrub an animated result preview.
- Save and restore results in a browser-local library.
- Start from scene templates with prepared prompts and settings.
- Track simulated credits for local demo generations.

## How It Works

**Reference -> Prompt -> Settings -> Generate -> Preview -> Iterate**

## Technical Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Lucide React
- Framer Motion

## Architecture

The interface is built from focused components under `src/components`, with the main client-side workspace in `FramePilotApp`. A client-side generation state machine drives the staged progress flow and completion state. History is stored in `localStorage`, and a deterministic local rendering simulation produces the animated preview.

## Demo / Product Scope

FramePilot is a frontend product prototype. It uses a local deterministic rendering simulation instead of an external AI video-generation API. This keeps the demo self-contained and avoids API keys or backend infrastructure.

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production Build

```bash
npm run lint
npm run build
```

## Live Demo

[https://framepilot-theta.vercel.app/](https://framepilot-theta.vercel.app/)

## Repository

[https://github.com/ak-jaat-007/framepilot](https://github.com/ak-jaat-007/framepilot)

## Agent Capture

The repository includes the required `.agent-logs/` capture records, `.codex/` hook configuration, and `CAPTURE-TEST.md` used for the assignment workflow.

## Notes

Generated media in the demo is simulated locally. No external API keys are required.

## Author

Aman Kaliramna
