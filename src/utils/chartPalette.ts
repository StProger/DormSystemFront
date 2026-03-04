export function makePalette(n: number): string[] {
  // Фиолетовая палитра (разные оттенки) под любое количество элементов.
  const hue = 255;   // фиолетовый
  const sat = 75;
  const lStart = 38; // темнее
  const lEnd = 86;   // светлее

  if (n <= 0) return [];
  if (n === 1) return [`hsl(${hue}, ${sat}%, ${(lStart + lEnd) / 2}%)`];

  const res: string[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const l = lStart + (lEnd - lStart) * t;
    res.push(`hsl(${hue}, ${sat}%, ${l}%)`);
  }
  return res;
}