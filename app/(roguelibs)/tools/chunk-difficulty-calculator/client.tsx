"use client";
import { useState } from "react";
import Button from "@components/Common/Button";
import Icon from "@components/Common/Icon";
import round from "lodash/round";
import styles from "./page.module.scss";
import clsx from "clsx";

export default function ChunkDifficultyCalculator() {
  const [chance1, setChance1] = useState<number | null>(100);
  const [chance2, setChance2] = useState<number | null>(null);
  const [chance3, setChance3] = useState<number | null>(null);

  function createOnChange(setter: typeof setChance1): React.ChangeEventHandler<HTMLInputElement> {
    return e => {
      const value = "" + e.target.value;
      setter(value ? +value : null);
    };
  }

  const [quickGame, setQuickGame] = useState(false);
  const [playerCount, setPlayerCount] = useState(1);
  const floorsPerLevel = quickGame ? 2 : 3;

  return (
    <div className={clsx(styles.container, "markdown")}>
      <h1>Chunk Difficulty Calculator</h1>
      <p>
        {
          "Streets of Rogue sets the difficulty separately for every chunk on the level, and it does so opaquely, and through multiple abstractions. This tool calculates and aggregates everything in a neat table, so it can help chunk makers better understand their chunk's difficulty and NPC spawn chances."
        }
      </p>
      <div role="panel" className={styles.inputs}>
        <Button onClick={() => setQuickGame(b => !b)}>
          <Icon type={quickGame ? "check_small" : "cross_small"} />
          {"Quick Game"}
        </Button>
        <Button
          className={styles.playersButton}
          onClick={() => setPlayerCount(p => (p === 4 ? 1 : p + 1))}
          onAuxClick={e => (setPlayerCount(p => (p === 1 ? 4 : p - 1)), e.preventDefault())}
          onContextMenu={e => e.preventDefault()}
        >
          <div className={styles.playersGrid}>
            <Icon type="person" size={16} alpha={playerCount >= 1 ? 1 : 0.2} />
            <Icon type="person" size={16} alpha={playerCount >= 2 ? 1 : 0.2} />
            <Icon type="person" size={16} alpha={playerCount >= 3 ? 1 : 0.2} />
            <Icon type="person" size={16} alpha={playerCount >= 4 ? 1 : 0.2} />
          </div>
          {playerCount + (playerCount === 1 ? "-Player" : "-Players")}
        </Button>
      </div>
      <div className={styles.split}>
        <table>
          <thead>
            <tr>
              <th rowSpan={2}>District</th>
              <th rowSpan={2}>Floor</th>
              <th colSpan={5}>Chunk Difficulty</th>
            </tr>
            <tr>
              <th>Lvl 1</th>
              <th>Lvl 2</th>
              <th>Lvl 3</th>
              <th>Lvl 4</th>
              <th>Lvl 5</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: quickGame ? 11 : 16 }).map((_, index) => {
              const district = Math.floor(index / floorsPerLevel);
              const floor = index - district * floorsPerLevel;
              const ldi = Math.min(Math.max(index + playerCount - 1, 1), 10);
              const map = difficultyMap[ldi];
              const sum = Object.values(map).reduce((a, b) => a + b);

              return (
                <tr key={index} className={clsx(floor || styles.firstDistrictFloor)}>
                  {!!floor || <th rowSpan={floorsPerLevel}>{districts[district]}</th>}
                  <th>{district + 1 + "-" + (floor + 1)}</th>
                  <td>{formatChance(map[1], sum)}</td>
                  <td>{formatChance(map[2], sum)}</td>
                  <td>{formatChance(map[3], sum)}</td>
                  <td>{formatChance(map[4], sum)}</td>
                  <td>{formatChance(map[5], sum)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <table>
          <thead>
            <tr>
              <th rowSpan={2}>District</th>
              <th rowSpan={2}>Floor</th>
              <th colSpan={3}>NPC Spawn Chance</th>
            </tr>
            <tr>
              <th>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={chance1 ?? ""}
                  onChange={createOnChange(setChance1)}
                  placeholder="0"
                />
              </th>
              <th>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={chance2 ?? ""}
                  onChange={createOnChange(setChance2)}
                  placeholder={"" + (chance3 ? 0 : chance1)}
                />
              </th>
              <th>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={chance3 ?? ""}
                  onChange={createOnChange(setChance3)}
                  placeholder={"" + (chance2 ? 0 : chance1)}
                />
              </th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: quickGame ? 11 : 16 }).map((_, index) => {
              const district = Math.floor(index / floorsPerLevel);
              const floor = index - district * floorsPerLevel;
              const ldi = Math.min(Math.max(index + playerCount - 1, 1), 10);
              const map = difficultyMap[ldi];
              const sum = Object.values(map).reduce((a, b) => a + b);

              const sc1 = (chance1 ?? 0) / 100;
              const sc2 = chance2 ? chance2 / 100 : chance3 ? 0 : sc1;
              const sc3 = chance3 ? chance3 / 100 : chance2 ? 0 : sc1;

              const diff345 = (map[3] ?? 0) + (map[4] ?? 0) + (map[5] ?? 0);

              return (
                <tr key={index} className={clsx(floor || styles.firstDistrictFloor)}>
                  {!!floor || <th rowSpan={floorsPerLevel}>{districts[district]}</th>}
                  <th>{district + 1 + "-" + (floor + 1)}</th>
                  <td>{formatChance((map[1] ?? 0) * sc1, sum)}</td>
                  <td>{formatChance((map[2] ?? 0) * sc2, sum)}</td>
                  <td>{formatChance(diff345 * sc3, sum)}</td>
                  <td>{formatChance((map[1] ?? 0) * sc1 + (map[2] ?? 0) * sc2 + diff345 * sc3, sum)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const districts = ["Slums", "Industrial", "Park", "Downtown", "Uptown", "Mayor Village"];

function formatChance(num: number | null | undefined, sum: number) {
  const percent = ((num ?? 0) / sum) * 100;
  const digits = percent >= 10 ? 0 : percent >= 1 ? 1 : 2;
  return round(percent, digits) + "%";
}

type LevelDifficulty = 1 | 2 | 3 | 4 | 5;
const difficultyMap: Record<number, Partial<Record<LevelDifficulty, number>>> = {
  1: { 1: 10, 2: 5 },
  2: { 1: 10, 2: 5 },
  3: { 1: 5, 2: 10 },
  4: { 1: 10, 2: 5 },
  5: { 1: 5, 2: 5, 3: 5 },
  6: { 1: 5, 2: 5, 3: 5 },
  7: { 1: 5, 2: 5, 3: 5 },
  8: { 1: 5, 2: 5, 3: 5, 4: 5 },
  9: { 1: 5, 2: 5, 3: 5, 4: 5 },
  10: { 1: 3, 2: 5, 3: 5, 4: 5, 5: 5 },
};
