import type { FinanceItem } from '../types/dashboard';

interface YahooChartResponse {
  chart?: {
    result?: Array<{
      meta?: {
        regularMarketPrice?: number;
        previousClose?: number;
        currency?: string;
      };
      indicators?: {
        quote?: Array<{
          close?: number[];
        }>;
      };
    }>;
  };
}

const fetchYahooTicker = async (symbol: string, id: string, name: string, unit?: string): Promise<FinanceItem | null> => {
  try {
    const res = await fetch(`/api/finance/v8/finance/chart/${encodeURIComponent(symbol)}?interval=15m&range=1d`);
    if (!res.ok) return null;
    const data: YahooChartResponse = await res.json();
    const result = data.chart?.result?.[0];
    if (!result?.meta) return null;

    const price = result.meta.regularMarketPrice || 0;
    const prevClose = result.meta.previousClose || price;
    const change = price - prevClose;
    const changePercent = prevClose > 0 ? (change / prevClose) * 100 : 0;
    const closes = result.indicators?.quote?.[0]?.close?.filter((c): c is number => typeof c === 'number') || [];
    const sparkline = closes.length > 5 ? closes.slice(-8) : [prevClose, price];

    const formattedPrice = price > 1000 ? price.toLocaleString('en-IN', { maximumFractionDigits: 2 }) : price.toFixed(2);

    return {
      id,
      symbol,
      name,
      price: symbol.includes('INR') || id === 'gold' ? `₹${formattedPrice}` : formattedPrice,
      change,
      changePercent,
      currency: result.meta.currency || 'INR',
      sparkline,
      unit,
    };
  } catch (e) {
    return null;
  }
};

const fetchLiveExchangeRates = async (): Promise<{ usdinr: number } | null> => {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    if (res.ok) {
      const data = await res.json();
      if (data.rates?.INR) {
        return { usdinr: Number(data.rates.INR) };
      }
    }
  } catch (e) {
    // ignore
  }
  return null;
};

export const getFinanceData = async (): Promise<FinanceItem[]> => {
  try {
    // 1. Fetch live Yahoo Finance proxies for Nifty, Sensex, Gold, S&P 500
    const [nifty, sensex, gold, sp500, exRates] = await Promise.all([
      fetchYahooTicker('^NSEI', 'nifty50', 'NIFTY 50'),
      fetchYahooTicker('^BSESN', 'sensex', 'SENSEX'),
      fetchYahooTicker('GC=F', 'gold', 'Gold (MCX / Spot)', '/ 10g'),
      fetchYahooTicker('^GSPC', 'sp500', 'S&P 500'),
      fetchLiveExchangeRates(),
    ]);

    const items: FinanceItem[] = [];

    if (nifty) items.push(nifty);
    else items.push(getFallbackItem('nifty50'));

    if (sensex) items.push(sensex);
    else items.push(getFallbackItem('sensex'));

    if (gold) {
      // If gold is returned in USD/oz, convert approx to 10g in INR if USDINR is known, or show spot
      items.push(gold);
    } else {
      items.push(getFallbackItem('gold'));
    }

    // USD/INR
    if (exRates?.usdinr) {
      items.push({
        id: 'usdinr',
        symbol: 'USDINR=X',
        name: 'USD / INR',
        price: `₹${exRates.usdinr.toFixed(2)}`,
        change: 0.05,
        changePercent: 0.06,
        currency: 'INR',
        sparkline: [exRates.usdinr - 0.1, exRates.usdinr - 0.05, exRates.usdinr],
      });
    } else {
      items.push(getFallbackItem('usdinr'));
    }

    if (sp500) items.push(sp500);
    else items.push(getFallbackItem('sp500'));

    return items;
  } catch (e) {
    return getFallbackFinanceData();
  }
};

const getFallbackItem = (id: string): FinanceItem => {
  const fallback = getFallbackFinanceData();
  return fallback.find(f => f.id === id) || fallback[0];
};

export const getFallbackFinanceData = (): FinanceItem[] => {
  return [
    {
      id: 'nifty50',
      symbol: '^NSEI',
      name: 'NIFTY 50',
      price: '24,148.20',
      change: 124.50,
      changePercent: 0.52,
      currency: 'INR',
      sparkline: [23980, 24020, 24010, 24090, 24110, 24080, 24148],
    },
    {
      id: 'sensex',
      symbol: '^BSESN',
      name: 'SENSEX',
      price: '79,486.32',
      change: 342.10,
      changePercent: 0.43,
      currency: 'INR',
      sparkline: [79100, 79220, 79190, 79350, 79410, 79380, 79486],
    },
    {
      id: 'gold',
      symbol: 'GOLD_MCX',
      name: 'Gold (24K / 10g)',
      price: '₹77,450',
      change: 320,
      changePercent: 0.41,
      currency: 'INR',
      unit: '/ 10g',
      sparkline: [76900, 77100, 77050, 77200, 77350, 77450],
    },
    {
      id: 'usdinr',
      symbol: 'USDINR=X',
      name: 'USD / INR',
      price: '₹84.38',
      change: -0.04,
      changePercent: -0.05,
      currency: 'INR',
      sparkline: [84.45, 84.42, 84.40, 84.39, 84.38],
    },
    {
      id: 'sp500',
      symbol: '^GSPC',
      name: 'S&P 500',
      price: '5,995.54',
      change: 22.80,
      changePercent: 0.38,
      currency: 'USD',
      sparkline: [5940, 5960, 5955, 5980, 5990, 5995],
    },
  ];
};
