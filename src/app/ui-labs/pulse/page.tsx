import type { Metadata } from "next";
import { PulseLabExperience } from "./pulse-lab-experience";

export const metadata: Metadata = {
  title: "Friend Graph Pulse Lab",
  description:
    "Concept D for Friend Graph: a kinetic startup demo with bold color blocking and motion-forward reveal cues.",
};

export default function PulsePage() {
  return <PulseLabExperience />;
}
