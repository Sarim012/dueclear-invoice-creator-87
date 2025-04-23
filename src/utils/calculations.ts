import { InvoiceItem } from "../types/invoice";

// Calculate the amount for a single item
export const calculateItemAmount = (
  quantity: number,
  rate: number,
  discount: number,
  discountType: "percent" | "amount" = "percent"
): number => {
  const subtotal = quantity * rate;
  let discountAmount = 0;
  if (discountType === "percent") {
    discountAmount = (subtotal * discount) / 100;
  } else {
    discountAmount = discount;
  }
  return parseFloat((subtotal - discountAmount).toFixed(2));
};

// Calculate the subtotal of all items
export const calculateSubtotal = (items: InvoiceItem[]): number => {
  return parseFloat(
    items.reduce((total, item) => total + (item.amount || 0), 0).toFixed(2)
  );
};

// Calculate the total amount after applying discount, tax, and shipping
export const calculateTotal = (
  subtotal: number,
  discount: number,
  discountType: "percent" | "amount" = "percent",
  tax: number,
  shipping: number
): number => {
  let discountAmount = 0;
  if (discountType === "percent") {
    discountAmount = (subtotal * discount) / 100;
  } else {
    discountAmount = discount;
  }
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
