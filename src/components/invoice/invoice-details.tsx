
import { DatePicker } from "./date-picker";
import { PaymentTermsSelector } from "./payment-terms-selector";
import { CurrencySelector } from "./currency-selector";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaymentTerms } from "@/types/invoice";

interface InvoiceDetailsProps {
  invoiceNumber: string;
  onInvoiceNumberChange: (value: string) => void;
  paymentTerms: PaymentTerms;
  onPaymentTermsChange: (value: PaymentTerms) => void;
  issueDate: Date;
  onIssueDateChange: (date: Date) => void;
  dueDate: Date;
  onDueDateChange: (date: Date) => void;
  currency: string;
  onCurrencyChange: (value: string) => void;
}

export function InvoiceDetails({
  invoiceNumber,
  onInvoiceNumberChange,
  paymentTerms,
  onPaymentTermsChange,
  issueDate,
  onIssueDateChange,
  dueDate,
  onDueDateChange,
  currency,
  onCurrencyChange,
}: InvoiceDetailsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="invoiceNumber">Invoice Number</Label>
        <Input
          id="invoiceNumber"
          value={invoiceNumber}
          onChange={(e) => onInvoiceNumberChange(e.target.value)}
          className="bg-white"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="paymentTerms">Payment Terms</Label>
        <PaymentTermsSelector
          value={paymentTerms}
          onValueChange={onPaymentTermsChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="issueDate">Issue Date</Label>
        <DatePicker
          date={issueDate}
          onDateChange={(date) => date && onIssueDateChange(date)}
          className="bg-white"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="dueDate">Due Date</Label>
        <DatePicker
          date={dueDate}
          onDateChange={(date) => date && onDueDateChange(date)}
          className="bg-white"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="currency">Currency</Label>
        <CurrencySelector value={currency} onValueChange={onCurrencyChange} />
      </div>
    </div>
  );
}
