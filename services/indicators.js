import { RSI, EMA } from "technicalindicators";

export function calculateIndicators(candles) {
  if (!candles || candles.length < 50) return null;

  const closes = candles.map(c => parseFloat(c[4]));
  const volumes = candles.map(c => parseFloat(c[5]));

  const rsi = RSI.calculate({ values: closes, period: 14 });
  const ema20 = EMA.calculate({ values: closes, period: 20 });
  const ema50 = EMA.calculate({ values: closes, period: 50 });

  if (!rsi.length || !ema20.length || !ema50.length) return null;

  return {
    rsi: rsi[rsi.length - 1],
    ema20: ema20[ema20.length - 1],
    ema50: ema50[ema50.length - 1],
    volume: volumes[volumes.length - 1],
    close: closes[closes.length - 1]
  };
}
