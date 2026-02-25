const express = require("express");
const axios = require("axios");
const { Pool } = require("pg");
const { RSI, EMA, ATR } = require("technicalindicators");

const app = express();
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const PAIRS = ["BTCUSDT","ETHUSDT","SOLUSDT","BNBUSDT"];

async function fetchCandles(symbol) {
  const res = await axios.get(
    `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&interval=5m&limit=100`
  );
  return res.data;
}

async function processPair(symbol) {
  const candles = await fetchCandles(symbol);

  const closes = candles.map(c => parseFloat(c[4]));
  const highs = candles.map(c => parseFloat(c[2]));
  const lows = candles.map(c => parseFloat(c[3]));
  const volumes = candles.map(c => parseFloat(c[5]));

  const rsi = RSI.calculate({ values: closes, period: 14 }).slice(-1)[0];
  const ema9 = EMA.calculate({ values: closes, period: 9 }).slice(-1)[0];
  const ema21 = EMA.calculate({ values: closes, period: 21 }).slice(-1)[0];
  const atr = ATR.calculate({
    high: highs,
    low: lows,
    close: closes,
    period: 14
  }).slice(-1)[0];

  const breakout =
    closes[closes.length - 1] >
    Math.max(...closes.slice(-20));

  await pool.query(
    `INSERT INTO features(symbol,timestamp,rsi,ema9,ema21,atr,volume_spike,breakout_flag)
     VALUES($1,NOW(),$2,$3,$4,$5,$6,$7)`,
    [
      symbol,
      rsi,
      ema9,
      ema21,
      atr,
      volumes[volumes.length - 1],
      breakout ? 1 : 0
    ]
  );
}

setInterval(() => {
  PAIRS.forEach(p => processPair(p));
}, 300000); // 5 minutes

app.listen(3000, () => console.log("Server running"));
