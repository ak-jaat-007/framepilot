"use client";

import { useEffect, useReducer } from "react";
import type { GenerationStatus } from "@/types/studio";

export interface GenerationState {
  status: GenerationStatus;
  progress: number;
  startedAt: number | null;
  generationId: number;
  error: string | null;
}

type Action =
  | { type: "start"; id: number; startedAt: number }
  | { type: "tick"; status: GenerationStatus; progress: number }
  | { type: "complete" }
  | { type: "cancel" }
  | { type: "error"; message: string };

const initialState: GenerationState = {
  status: "idle",
  progress: 0,
  startedAt: null,
  generationId: 0,
  error: null,
};

function reducer(state: GenerationState, action: Action): GenerationState {
  switch (action.type) {
    case "start":
      return { status: "preparing", progress: 1, startedAt: action.startedAt, generationId: action.id, error: null };
    case "tick":
      return { ...state, status: action.status, progress: action.progress };
    case "complete":
      return { ...state, status: "complete", progress: 100 };
    case "cancel":
      return { ...initialState, generationId: state.generationId };
    case "error":
      return { ...state, status: "error", error: action.message };
  }
}

const totalDuration = 6600;

function statusAt(progress: number): GenerationStatus {
  if (progress < 15) return "preparing";
  if (progress < 35) return "planning";
  if (progress < 88) return "rendering";
  if (progress < 100) return "finalizing";
  return "complete";
}

export function useGenerationMachine() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!state.startedAt || ["idle", "complete", "error"].includes(state.status)) return;
    const interval = window.setInterval(() => {
      const elapsed = Date.now() - state.startedAt!;
      const progress = Math.min(100, Math.round((elapsed / totalDuration) * 100));
      if (progress >= 100) {
        dispatch({ type: "complete" });
      } else {
        dispatch({ type: "tick", status: statusAt(progress), progress });
      }
    }, 100);
    return () => window.clearInterval(interval);
  }, [state.startedAt, state.status]);

  return {
    state,
    start: (id: number) => dispatch({ type: "start", id, startedAt: Date.now() }),
    cancel: () => dispatch({ type: "cancel" }),
    fail: (message: string) => dispatch({ type: "error", message }),
  };
}
