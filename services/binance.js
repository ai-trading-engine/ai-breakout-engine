import axios from "axios";

export async function fetchKlines(symbol) {
  const url = `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&interval=1h&limit=200`;

  const response = await axios.get(url, {
    headers: { "User-Agent": "Mozilla/5.0" }
  });

  return response.data;
}
