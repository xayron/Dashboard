import type { FinanceItem } from '../types/dashboard';

export const getFinanceData = async (): Promise<FinanceItem[]> => {
  // Try live fetch or fallback to curated financial telemetry
  try {
    // Example open quote service or fallback
    return getFallbackFinanceData();
  } catch (e) {
    return getFallbackFinanceData();
  }
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
      id: 'silver',
      symbol: 'SILVER_MCX',
      name: 'Silver (1kg)',
      price: '₹91,200',
      change: 540,
      changePercent: 0.60,
      currency: 'INR',
      unit: '/ kg',
      sparkline: [90200, 90500, 90800, 91000, 91200],
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
