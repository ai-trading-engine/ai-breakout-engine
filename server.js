import express from "express";
import dotenv from "dotenv";
import { fetchKlines } from "./services/binance.js";
import { calculateIndicators } from "./services/indicators.js";
import { getPrediction } from "./services/aiClient.js";
import { saveSignals } from "./services/supabaseClient.js";

dotenv.config();
const app = express();
app.use(express.json());

const TOP_PAIRS = [
  "BTCUSDT","ETHUSDT","BNBUSDT","SOLUSDT","XRPUSDT",
  "ADAUSDT","DOGEUSDT","AVAXUSDT","LINKUSDT","MATICUSDT",
  "DOTUSDT","TRXUSDT","LTCUSDT","BCHUSDT","APTUSDT",
  "ARBUSDT","OPUSDT","ATOMUSDT","FILUSDT","NEARUSDT"
];

app.get("/", (req, res) => {
  res.json({ status: "Node Signal Engine Running" });
});

app.get("/scan", async (req, res) => {
  try {
    let results = [];

    for (let symbol of TOP_PAIRS) {
      try {
        const candles = await fetchKlines(symbol);
        const features = calculateIndicators(candles);

        if (!features) continue;

        const probability = await getPrediction(features);

        results.push({
          symbol,
          probability,
          entry: features.close,
          stop_loss: features.close * 0.99,
          take_profit: features.close * 1.02
        });

      } catch (err) {
        console.log(`Error processing ${symbol}:`, err.message);
      }
    }

    results.sort((a, b) => b.probability - a.probability);

    const filtered = results.filter(r => r.probability > 0.65);

    await saveSignals(filtered);

    res.json(filtered);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
