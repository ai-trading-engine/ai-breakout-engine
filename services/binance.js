import axios from "axios";

export async function fetchKlines(symbol) {
  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1h&limit=100`;

  const response = await fetch(url);
  const data = await response.json();

  return data;
}
