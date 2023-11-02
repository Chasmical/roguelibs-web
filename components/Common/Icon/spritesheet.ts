export interface SpriteSheetCtorInfo<T extends string> {
  className: string;
  types: T[][];
}
export interface SpriteSheet<T extends string = string> {
  className: string;
  offsets: { [N in T]: { x: number; y: number } };
}

export function createSpriteSheet<T extends string>({ className, types }: SpriteSheetCtorInfo<T>) {
  const sheet: Partial<SpriteSheet<T>> = {
    className,
    offsets: {} as any,
  };

  types.forEach((row, y) =>
    row.forEach((type, x) => {
      sheet.offsets![type] = { x, y };
    }),
  );

  return sheet as SpriteSheet<T>;
}
