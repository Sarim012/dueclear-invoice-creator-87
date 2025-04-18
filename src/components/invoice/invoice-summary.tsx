
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/utils/currencies";

interface InvoiceSummaryProps {
  subtotal: number;
  currency: string;
  discountPercent: number;
  onDiscountPercentChange: (value: number) => void;
  taxPercent: number;
  onTaxPercentChange: (value: number) => void;
  shipping: number;
  onShippingChange: (value: number) => void;
  total: number;
}

export function InvoiceSummary({
  subtotal,
  currency,
  discountPercent,
  onDiscountPercentChange,
  taxPercent,
  onTaxPercentChange,
  shipping,
  onShippingChange,
  total,
}: InvoiceSummaryProps) {
  return (
    <div className="md:col-start-2 space-y-3">
      <div className="flex justify-between items-center">
        <span className="font-medium">Subtotal:</span>
        <span>{formatCurrency(subtotal, currency)}</span>
      </div>
      
      <div className="flex justify-between items-center">
        <span>Discount:</span>
        <div className="flex items-center space-x-2 w-28">
          <Input
            type="number"
            min="0"
            max="100"
            value={discountPercent}
            onChange={(e) => onDiscountPercentChange(parseInt(e.target.value) || 0)}
            className="w-full text-right bg-white"
          />
          <span>%</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <span>Tax:</span>
        <div className="flex items-center space-x-2 w-28">
          <Input
            type="number"
            min="0"
            max="100"
            value={taxPercent}
            onChange={(e) => onTaxPercentChange(parseInt(e.target.value) || 0)}
            className="w-full text-right bg-white"
          />
          <span>%</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <span>Shipping:</span>
        <div className="w-28">
          <Input
            type="number"
            min="0"
            value={shipping}
            onChange={(e) => onShippingChange(parseInt(e.target.value) || 0)}
            className="w-full text-right bg-white"
          />
        </div>
      </div>
      
      <Separator />
      
      <div className="flex justify-between font-bold">
        <span>Total:</span>
        <span className="text-xl text-primary">{formatCurrency(total, currency)}</span>
      </div>
    </div>
  );
}
