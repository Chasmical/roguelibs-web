import SetCanonicalUrl from "@components/Specialized/SetCanonicalUrl";
import ChunkDifficultyCalculator from "./client";
import { Metadata } from "next";

export function generateMetadata(): Metadata {
  const description =
    "Streets of Rogue sets the difficulty separately for every chunk on the level, and it does so opaquely, and through multiple abstractions. This tool calculates and aggregates everything in a neat table, so it can help chunk makers better understand their chunk's difficulty and NPC spawn chances.";
  return {
    title: "Chunk Difficulty Calculator",
    description,
    authors: [{ name: "Abbysssal", url: "/user/Abbysssal" }],
    openGraph: {
      type: "article",
      title: "Chunk Difficulty Calculator",
      description,
      url: "/tools/chunk-difficulty-calculator",
      authors: ["Abbysssal"],
      locale: "en",
      siteName: "RogueLibs Web",
      section: "Tools",
      tags: ["streets of rogue", "tool", "chunks", "level editor", "calculator"],
    },
    twitter: {
      card: "summary_large_image",
      title: "Chunk Difficulty Calculator",
      description,
      images: [],
    },
  };
}

export default async function ChunkDifficultyCalculatorPage() {
  return (
    <>
      <ChunkDifficultyCalculator />
      <SetCanonicalUrl url="/tools/chunk-difficulty-calculator" />
    </>
  );
}
