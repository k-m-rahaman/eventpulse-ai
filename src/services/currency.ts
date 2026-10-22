import { CurrencyType } from '../types/event';

export const CURRENCY_SYMBOLS: Record<CurrencyType, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
};

export const EXCHANGE_RATES: Record<CurrencyType, number> = {
  INR: 1,
  USD: 1 / 85, // 1 USD approx 85 INR
  EUR: 1 / 92, // 1 EUR approx 92 INR
};

export function formatCurrency(amount: number, currency: CurrencyType = 'INR'): string {
  if (currency === 'INR') {
    // Format in Indian Numbering system (Lakhs and Crores)
    const formatted = new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
    }).format(Math.round(amount));
    return `₹${formatted}`;
  } else if (currency === 'USD') {
    const formatted = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0,
    }).format(Math.round(amount));
    return `$${formatted}`;
  } else {
    const formatted = new Intl.NumberFormat('de-DE', {
      maximumFractionDigits: 0,
    }).format(Math.round(amount));
    return `€${formatted}`;
  }
}
