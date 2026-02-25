export async function fetchKlines(symbol) {
  try {
    // Bybit expects uppercase symbol like BTCUSDT
    const url = `https://api.bybit.com/v5/market/kline?category=spot&symbol=${symbol}&interval=60&limit=100`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();

    if (!json.result || !json.result.list) {
      throw new Error("Invalid Bybit response structure");
    }

    const rawData = json.result.list;

    // Bybit returns newest first → reverse to oldest first
    const candles = rawData.reverse().map(candle => ({
      openTime: parseInt(candle[0]),
      open: parseFloat(candle[1]),
      high: parseFloat(candle[2]),
      low: parseFloat(candle[3]),
      close: parseFloat(candle[4]),
      volume: parseFloat(candle[5])
    }));

    return candles;

  } catch (error) {
    console.error(`Error fetching ${symbol}:`, error.message);
    return null;
  }
}
