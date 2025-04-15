
import { InvoiceItem } from "../types/invoice";

// Calculate the amount for a single item
export const calculateItemAmount = (
  quantity: number,
  rate: number,
  discount: number
): number => {
  const subtotal = quantity * rate;
  const discountAmount = (subtotal * discount) / 100;
  return parseFloat((subtotal - discountAmount).toFixed(2));
};

// Calculate the subtotal of all items
export const calculateSubtotal = (items: InvoiceItem[]): number => {
  return parseFloat(
    items
      .reduce((total, item) => total + (item.amount || 0), 0)
      .toFixed(2)
  );
};

// Calculate the total amount after applying discount, tax, and shipping
export const calculateTotal = (
  subtotal: number,
  discount: number,
  tax: number,
  shipping: number
): number => {
  const discountAmount = (subtotal * discount) / 100;
  const taxAmount = ((subtotal - discountAmount) * tax) / 100;
  return parseFloat(
    (subtotal - discountAmount + taxAmount + shipping).toFixed(2)
  );
};

// Format number to 2 decimal places
export const formatNumber = (value: number): string => {
  return value.toFixed(2);
};

// Parse string to number, handling empty and invalid inputs
export const parseNumberInput = (value: string): number => {
  if (!value || value.trim() === "") return 0;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
};
