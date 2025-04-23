
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/utils/currencies";
import { Percent, DollarSign } from "lucide-react";

interface InvoiceSummaryProps {
  subtotal: number;
  currency: string;
  discountPercent: number;
  onDiscountPercentChange: (value: number) => void;
  discountType: "percent" | "amount";
  onDiscountTypeChange: (value: "percent" | "amount") => void;
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
  discountType,
  onDiscountTypeChange,
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
        <div className="flex items-center space-x-2 w-36">
          <Input
            type="number"
            min="0"
            max={discountType === "percent" ? "100" : undefined}
            value={discountPercent}
            onChange={(e) => onDiscountPercentChange(Number(e.target.value) || 0)}
            className="w-full text-right bg-white"
          />
          <button
            type="button"
            onClick={() => onDiscountTypeChange(discountType === "percent" ? "amount" : "percent")}
            className="rounded bg-muted p-1 hover:bg-muted-foreground/10 transition"
            aria-label={discountType === "percent" ? "Switch to dollar" : "Switch to percent"}
          >
            {discountType === "percent" ? (
              <Percent className="w-5 h-5" />
            ) : (
              <DollarSign className="w-5 h-5" />
            )}
          </button>
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
            onChange={(e) => onTaxPercentChange(Number(e.target.value) || 0)}
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
            onChange={(e) => onShippingChange(Number(e.target.value) || 0)}
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
