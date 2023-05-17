export function formatTime(seconds: number) {
  const negative = (seconds < 0);
  seconds = Math.floor(Math.abs(seconds || 0));
  const s = seconds % 60;
  const m = (seconds - s) / 60;
  const h = (seconds - s - 60 * m) / 3600;
  const sStr = (s > 9) ? `${s}` : `0${s}`;
  const mStr = (m > 9 || !h) ? `${m}:` : `0${m}:`;
  const hStr = h ? `${h}:` : '';
  return (negative ? '-' : '') + hStr + mStr + sStr;
}

export const FormatTimePlayer = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export function roundTo(num: number, decimalPlaces: number): number {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(num * factor) / factor;
}