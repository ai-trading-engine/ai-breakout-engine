export async function fetchKlines(symbol) {
  try {
    const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1h&limit=100`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data;

  } catch (error) {
    console.error(`Error fetching ${symbol}:`, error.message);
    return null;
  }
}
