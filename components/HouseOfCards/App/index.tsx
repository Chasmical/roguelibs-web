"use client";
import { DbCard } from "@lib/Database";
import { GameContext, GameContextProvider } from "../hooks";
import Inventory from "../Inventory";

export interface AppProps {
  initialDeck: DbCard[];
}
export default function App({ initialDeck }: AppProps) {
  const initialState: GameContext = { ui: "map", deck: initialDeck };

  return (
    <GameContextProvider initialState={initialState}>
      <div
        style={{
          position: "relative",
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          backgroundColor: "var(--color-background-darkest)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%) rotateZ(-15deg)",
            fontSize: "8rem",
            color: "var(--color-background)",
            whiteSpace: "nowrap",
            userSelect: "none",
          }}
        >
          <div style={{ display: "flex", flexFlow: "column" }}>
            <div style={{ display: "flex", flexFlow: "row" }}></div>
          </div>
          {"The playfield"}
        </div>
        <Inventory />
      </div>
    </GameContextProvider>
  );
}
