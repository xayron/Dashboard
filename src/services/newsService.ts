import type { NewsCategory, NewsItem } from '../types/dashboard';

export const getFallbackNews = (): NewsItem[] => {
  return [
    {
      id: 'news-1',
      title: 'Global Semiconductor Consortium Unveils Next-Gen 1.4nm Architectural Roadmap',
      source: 'Reuters Tech',
      time: '12m ago',
      category: 'Tech',
      isBreaking: true,
      summary: 'Major chipmakers agree on standardized high-NA EUV lithography parameters, accelerating production timelines for low-power neural compute hardware.',
      snippet: 'Major chipmakers agree on standardized high-NA EUV lithography parameters, accelerating production timelines for low-power neural compute hardware.',
      url: 'https://reuters.com',
    },
    {
      id: 'news-2',
      title: 'Global Markets Rally as Central Banks Signal Balanced Inflationary Outlook',
      source: 'Financial Times',
      time: '28m ago',
      category: 'Business',
      summary: 'Equities surged across Asia-Pacific and European exchanges following dovish rate guidance and resilient quarterly manufacturing data.',
      snippet: 'Equities surged across Asia-Pacific and European exchanges following dovish rate guidance and resilient quarterly manufacturing data.',
      url: 'https://ft.com',
    },
    {
      id: 'news-3',
      title: 'James Webb Space Telescope Observes Atmospheric Composition of Habitable-Zone Exoplanet',
      source: 'NASA / Nature',
      time: '45m ago',
      category: 'Science',
      summary: 'Spectroscopic analysis detects water vapor and carbon compound signatures in the atmosphere of an Earth-sized terrestrial world 48 light-years away.',
      snippet: 'Spectroscopic analysis detects water vapor and carbon compound signatures in the atmosphere of an Earth-sized terrestrial world 48 light-years away.',
      url: 'https://nature.com',
    },
    {
      id: 'news-4',
      title: 'Renewable Power Reaches Historic 42% Milestone Across National Grids in Q3',
      source: 'Bloomberg Energy',
      time: '1h ago',
      category: 'Top Stories',
      summary: 'Accelerated grid-scale battery storage deployments and expanded offshore wind capacity drive unprecedented zero-carbon generation records.',
      snippet: 'Accelerated grid-scale battery storage deployments and expanded offshore wind capacity drive unprecedented zero-carbon generation records.',
      url: 'https://bloomberg.com',
    },
    {
      id: 'news-5',
      title: 'International AI Safety Summit Concludes With Framework on Autonomous System Audits',
      source: 'Associated Press',
      time: '2h ago',
      category: 'Tech',
      summary: 'Over twenty nations sign unified standards establishing continuous red-teaming protocols and verification benchmarks for frontier foundation models.',
      snippet: 'Over twenty nations sign unified standards establishing continuous red-teaming protocols and verification benchmarks for frontier foundation models.',
      url: 'https://apnews.com',
    },
    {
      id: 'news-6',
      title: 'High-Speed Rail Corridor Expansion Approved to Connect Major Metropolitan Economic Hubs',
      source: 'The Hindu',
      time: '2h ago',
      category: 'Top Stories',
      summary: 'Government clears ₹68,000-crore infrastructure budget for 650km dedicated electric transit corridor slashing travel time to under two hours.',
      snippet: 'Government clears ₹68,000-crore infrastructure budget for 650km dedicated electric transit corridor slashing travel time to under two hours.',
      url: 'https://thehindu.com',
    },
    {
      id: 'news-7',
      title: 'Breakthrough Solid-State Battery Cell Achieves 1,200 Charge Cycles With 92% Capacity Retention',
      source: 'Science Daily',
      time: '3h ago',
      category: 'Science',
      summary: 'Novel ceramic electrolyte interface eliminates dendritic degradation, opening immediate pathways for 800km-range electric vehicles.',
      snippet: 'Novel ceramic electrolyte interface eliminates dendritic degradation, opening immediate pathways for 800km-range electric vehicles.',
      url: 'https://sciencedaily.com',
    },
    {
      id: 'news-8',
      title: 'Global Trade Consortium Streamlines Maritime Customs Processing With Cryptographic Verification',
      source: 'World Trade Monitor',
      time: '4h ago',
      category: 'World',
      summary: 'Digital bill-of-lading protocols cut average cargo clearance bottlenecks by 38% across top international container terminals.',
      snippet: 'Digital bill-of-lading protocols cut average cargo clearance bottlenecks by 38% across top international container terminals.',
      url: 'https://wto.org',
    },
    {
      id: 'news-9',
      title: 'Quantum Computing Lab Demonstrates Fault-Tolerant Logical Qubits at Scale',
      source: 'MIT Technology Review',
      time: '4h ago',
      category: 'Tech',
      summary: 'Surface code error correction achieves 99.98% fidelity across 128 interconnected logical channels.',
      snippet: 'Surface code error correction achieves 99.98% fidelity across 128 interconnected logical channels.',
      url: 'https://technologyreview.com',
    },
    {
      id: 'news-10',
      title: 'Crude Oil Benchmarks Steady Following Strategic Reserve Rebalancing and Production Guidance',
      source: 'S&P Global Platts',
      time: '5h ago',
      category: 'Business',
      summary: 'Brent crude holds near $78 a barrel as Atlantic basin shipments normalize and demand forecasts remain stable.',
      snippet: 'Brent crude holds near $78 a barrel as Atlantic basin shipments normalize and demand forecasts remain stable.',
      url: 'https://spglobal.com',
    },
    {
      id: 'news-11',
      title: 'WHO Reports Record Decline in Malaria Incidence Following Next-Gen Vaccine Rollout',
      source: 'The Lancet',
      time: '5h ago',
      category: 'Science',
      summary: 'Sub-Saharan pediatric vaccination campaigns achieve a 54% reduction in severe cases across trial districts.',
      snippet: 'Sub-Saharan pediatric vaccination campaigns achieve a 54% reduction in severe cases across trial districts.',
      url: 'https://thelancet.com',
    },
    {
      id: 'news-12',
      title: 'Cross-Border Instant Payment Network Links Seven Southeast Asian Central Banks',
      source: 'Nikkei Asia',
      time: '6h ago',
      category: 'Business',
      summary: 'QR-code interoperability enables zero-spread currency settlement for bilateral travelers and retail merchants.',
      snippet: 'QR-code interoperability enables zero-spread currency settlement for bilateral travelers and retail merchants.',
      url: 'https://asia.nikkei.com',
    },
    {
      id: 'news-13',
      title: 'International Space Station Solar Array Upgrade Successfully Completed During Spacewalk',
      source: 'ESA / NASA',
      time: '6h ago',
      category: 'Science',
      summary: 'Roll-Out Solar Arrays (iROSA) deployment boosts the station power generation capacity by 30%.',
      snippet: 'Roll-Out Solar Arrays (iROSA) deployment boosts the station power generation capacity by 30%.',
      url: 'https://esa.int',
    },
    {
      id: 'news-14',
      title: 'Semiconductor Foundry CapEx Projections Rise 18% as Automotive Edge AI Chips Demand Surges',
      source: 'EE Times',
      time: '7h ago',
      category: 'Tech',
      summary: 'Automotive tier-1 suppliers secure long-term packaging allocations for ASIL-D certified safety silicon.',
      snippet: 'Automotive tier-1 suppliers secure long-term packaging allocations for ASIL-D certified safety silicon.',
      url: 'https://eetimes.com',
    },
    {
      id: 'news-15',
      title: 'UN Climate Council Finalizes Loss and Damage Governance Structure for Island Nations',
      source: 'BBC News',
      time: '8h ago',
      category: 'World',
      summary: 'Direct disbursement protocols guarantee expedited liquidity within 72 hours of declared extreme weather incidents.',
      snippet: 'Direct disbursement protocols guarantee expedited liquidity within 72 hours of declared extreme weather incidents.',
      url: 'https://bbc.com',
    },
    {
      id: 'news-16',
      title: 'Aviation Regulators Certify First Commercial Hydrogen-Electric Regional Turboprop',
      source: 'Flight Global',
      time: '9h ago',
      category: 'Top Stories',
      summary: '50-passenger zero-emission commuter aircraft cleared for initial commercial scheduled routes starting Q2.',
      snippet: '50-passenger zero-emission commuter aircraft cleared for initial commercial scheduled routes starting Q2.',
      url: 'https://flightglobal.com',
    },
    {
      id: 'news-17',
      title: 'Treasury Yields Stabilize Following Record Demand at 10-Year Sovereign Debt Auction',
      source: 'Wall Street Journal',
      time: '10h ago',
      category: 'Business',
      summary: 'Indirect bidding participation reached 71.4%, reflecting persistent institutional appetite for sovereign paper.',
      snippet: 'Indirect bidding participation reached 71.4%, reflecting persistent institutional appetite for sovereign paper.',
      url: 'https://wsj.com',
    },
    {
      id: 'news-18',
      title: 'Open-Source AI Consortium Releases Permissive 70B Multimodal Model Suite',
      source: 'Hugging Face Blog',
      time: '11h ago',
      category: 'Tech',
      summary: 'Weights and full training recipes released under Apache 2.0 with leading code generation and reasoning metrics.',
      snippet: 'Weights and full training recipes released under Apache 2.0 with leading code generation and reasoning metrics.',
      url: 'https://huggingface.co',
    },
  ];
};

export const cleanNewsText = (raw?: string): string => {
  if (!raw) return '';
  let cleaned = raw;
  try {
    if (typeof DOMParser !== 'undefined') {
      const doc = new DOMParser().parseFromString(cleaned, 'text/html');
      cleaned = doc.body.textContent || '';
      // If it still contains HTML entities or tags after first pass, parse again
      if (cleaned.includes('&') || cleaned.includes('<')) {
        const doc2 = new DOMParser().parseFromString(cleaned, 'text/html');
        cleaned = doc2.body.textContent || cleaned;
      }
    }
  } catch {
    // fallback to regex
  }

  return cleaned
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&bull;/g, '•')
    .replace(/&hellip;/g, '…')
    .replace(/&#(\d+);/g, (_, dec) => {
      try { return String.fromCharCode(Number(dec)); } catch { return ''; }
    })
    .replace(/\s+/g, ' ')
    .trim();
};

export const fetchNews = async (): Promise<NewsItem[]> => {
  try {
    const res = await fetch('/api/news');
    if (!res.ok) throw new Error('News API response not ok');
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return data.map((item: any, idx: number) => {
        let category: NewsCategory = 'Top Stories';
        const cleanTitle = cleanNewsText(item.title);
        const lower = cleanTitle.toLowerCase();
        if (lower.includes('tech') || lower.includes('ai') || lower.includes('chip') || lower.includes('software') || lower.includes('google') || lower.includes('apple')) {
          category = 'Tech';
        } else if (lower.includes('market') || lower.includes('bank') || lower.includes('inflation') || lower.includes('stock') || lower.includes('trade') || lower.includes('economy')) {
          category = 'Business';
        } else if (lower.includes('space') || lower.includes('telescope') || lower.includes('health') || lower.includes('climate') || lower.includes('energy') || lower.includes('science')) {
          category = 'Science';
        } else if (lower.includes('summit') || lower.includes('un') || lower.includes('global') || lower.includes('treaty') || lower.includes('war') || lower.includes('foreign')) {
          category = 'World';
        }

        let timeStr = 'Recent';
        if (item.time) {
          const parsed = new Date(item.time);
          if (!isNaN(parsed.getTime())) {
            const diffMin = Math.max(1, Math.floor((Date.now() - parsed.getTime()) / (1000 * 60)));
            if (diffMin < 60) timeStr = `${diffMin}m ago`;
            else if (diffMin < 1440) timeStr = `${Math.floor(diffMin / 60)}h ago`;
            else timeStr = `${Math.floor(diffMin / 1440)}d ago`;
          }
        }

        const cleanSource = cleanNewsText(item.source || 'News Feed');
        const cleanSnippet = cleanNewsText(item.snippet || item.summary || '');
        return {
          id: `live-news-${idx}`,
          title: cleanTitle,
          source: cleanSource,
          time: timeStr,
          category,
          snippet: cleanSnippet,
          summary: cleanSnippet,
          url: item.url,
          isBreaking: idx === 0,
        };
      });
    }
  } catch (e) {
    // Fall back to curated live offline headlines
  }

  return getFallbackNews();
};
