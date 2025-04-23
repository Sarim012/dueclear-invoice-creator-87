// Define the data structure for invoice items
export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  discount: number;
  discountType: "percent" | "amount"; // Add discountType
  amount: number;
}

// Define payment methods
export type PaymentMethod = 'Bank Transfer' | 'PayPal' | 'UPI' | 'Payment Link' | 'Cash';

// Define payment terms options
export type PaymentTerms = 'NET7' | 'NET15' | 'NET30' | 'NET45' | 'NET60' | 'NET90';

// Define the main invoice interface
export interface Invoice {
  id: string;
  logoUrl?: string;
  invoiceNumber: string;
  paymentTerms: PaymentTerms;
  issueDate: Date;
  dueDate: Date;
  currency: string;
  businessDetails: string;
  clientDetails: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  paymentMethod: PaymentMethod;
  bankDetails?: string;
  paypalId?: string;
  upiId?: string;
  paymentLink?: string;
  cashInstructions?: string;
  notes?: string;
  terms?: string;
  createdAt: Date;
}

// Define currency option interface
export interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
}
