// String normalization for matching
export function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s-]/g, '') // Remove special chars except hyphen
    .replace(/\b(mens?|womens?|unisex|kids?|youth|infant|toddler)\b/g, '') // Remove size indicators
    .replace(/\s+/g, ' ')
    .trim();
}

// Levenshtein distance for fuzzy string matching
export function levenshteinDistance(str1: string, str2: string): number {
  const track = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i += 1) {
    track[0][i] = i;
  }

  for (let j = 0; j <= str2.length; j += 1) {
    track[j][0] = j;
  }

  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1, // deletion
        track[j - 1][i] + 1, // insertion
        track[j - 1][i - 1] + indicator, // substitution
      );
    }
  }

  return track[str2.length][str1.length];
}

// Extract key identifiers from product
export function extractIdentifiers(product: any): Record<string, string | undefined> {
  return {
    sku: product.sku,
    upc: product.upc,
    mpn: product.mpn,
    asin: extractASIN(product.url),
    ean: product.upc, // EAN is often same as UPC
  };
}

// Extract Amazon ASIN from URL
export function extractASIN(url: string): string | undefined {
  const match = url.match(/\/dp\/([A-Z0-9]{10})/i);
  return match?.[1];
}

// Normalize color names
export function normalizeColor(color: string): string {
  const colorMap: Record<string, string> = {
    'navy blue': 'navy',
    'light blue': 'lightblue',
    'dark blue': 'darkblue',
    'light gray': 'lightgray',
    'dark gray': 'darkgray',
    'light grey': 'lightgrey',
    'dark grey': 'darkgrey',
    maroon: 'burgundy',
    crimson: 'red',
    khaki: 'tan',
    'off-white': 'white',
    cream: 'white',
  };

  const normalized = color.toLowerCase().trim();
  return colorMap[normalized] || normalized;
}

// Normalize sizes
export function normalizeSize(size: string, type: 'shoe' | 'apparel' = 'shoe'): string {
  // Convert to standard format
  const sizeNum = parseFloat(size);

  if (!isNaN(sizeNum)) {
    return sizeNum.toString();
  }

  const sizeLower = size.toLowerCase().trim();

  if (type === 'shoe') {
    // Standard shoe sizes: 5, 5.5, 6, etc.
    return sizeLower;
  } else {
    // Apparel sizes
    const apparelMap: Record<string, string> = {
      xs: 'extra-small',
      s: 'small',
      m: 'medium',
      l: 'large',
      xl: 'extra-large',
      xxl: 'extra-extra-large',
    };
    return apparelMap[sizeLower] || sizeLower;
  }
}

// Calculate price proximity
export function priceProximity(price1: number, price2: number, tolerance: number = 0.15): number {
  if (price1 === 0 || price2 === 0) return 0;
  const diff = Math.abs(price1 - price2) / Math.max(price1, price2);
  return Math.max(0, 1 - diff / tolerance);
}
