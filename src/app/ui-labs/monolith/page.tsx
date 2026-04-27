import type { Metadata } from "next";
import { ConceptFMonolith } from "./concept-f";

export const metadata: Metadata = {
  title: "Friend Graph UI Lab: Concept F",
  description:
    "A brutalist, poster-like Friend Graph concept study with strong geometry and self-contained styling.",
};

export default function MonolithUiLabPage() {
  return <ConceptFMonolith />;
}
