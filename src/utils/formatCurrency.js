/**
 * Safely format currency values, preventing accidental double dollar signs ($$).
 * Handles numbers (100 -> "$100"), raw strings ("100" -> "$100"), 
 * and pre-formatted strings ("$100" -> "$100", "$$100" -> "$100").
 */
export const formatCurrency = (val, fallback = '100.00') => {
  if (val === undefined || val === null || val === '') {
    return `$${String(fallback).replace(/^\$+/, '').trim()}`;
  }
  const clean = String(val).replace(/^\$+/, '').trim();
  return clean ? `$${clean}` : `$${String(fallback).replace(/^\$+/, '').trim()}`;
};

export default formatCurrency;
