import { DbCard } from "@lib/Database";
import { ImmerStateSetter, useImmerState } from "@lib/hooks";
import { createContext, useContext, useMemo } from "react";

export interface GameContext {
  ui: "table" | "inventory" | "map";
  deck: DbCard[];
}
const GameContext = createContext<readonly [GameContext, ImmerStateSetter<GameContext>] | null>(null);

export function useGame() {
  const [value, mutateValue] = useContext(GameContext)!;
  return { ...value, mutate: mutateValue };
}

export interface GameContextProviderProps {
  initialState: GameContext | (() => GameContext);
  children?: React.ReactNode;
}
export function GameContextProvider({ initialState, children }: GameContextProviderProps) {
  const [context, mutateContext] = useImmerState<GameContext>(initialState);

  const value = useMemo(() => [context, mutateContext] as const, [context, mutateContext]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
