"use client";
import InventorySlot from "./InventorySlot";
import { useState } from "react";

export default function InventoryTooltipPreview() {
  const [sprite, setSprite] = useState("/Generic6.png");
  const [tooltipColor, setTooltipColor] = useState("#FFED00");
  const [text, setText] = useState("$123");

  const spriteHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setSprite(reader.result as string));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div style={{ padding: "10px", border: "3px dashed var(--color-secondary)", width: "max-content" }}>
      <input type="file" accept="image/*" onChange={spriteHandler} style={{ margin: "5px" }} />
      <div style={{ margin: "5px" }}>
        <InventorySlot sprite={sprite} tooltip={text} tooltipColor={tooltipColor} />
      </div>
      <input
        type="text"
        placeholder="$123"
        onChange={e => setText(e.target.value)}
        style={{ fontSize: "22px", margin: "5px" }}
      />
      <input type="color" value={tooltipColor} onChange={e => setTooltipColor(e.target.value)} />
    </div>
  );
}
