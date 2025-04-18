
import { PaymentMethod } from "@/types/invoice";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Banknote, CreditCard, Link2, CircleDollarSign, Smartphone } from "lucide-react";

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
  bankDetails?: string;
  onBankDetailsChange?: (value: string) => void;
  paypalId?: string;
  onPaypalIdChange?: (value: string) => void;
  upiId?: string;
  onUpiIdChange?: (value: string) => void;
  paymentLink?: string;
  onPaymentLinkChange?: (value: string) => void;
  cashInstructions?: string;
  onCashInstructionsChange?: (value: string) => void;
}

export function PaymentMethodSelector({ 
  value,
  onChange,
  bankDetails = "",
  onBankDetailsChange,
  paypalId = "",
  onPaypalIdChange,
  upiId = "",
  onUpiIdChange,
  paymentLink = "",
  onPaymentLinkChange,
  cashInstructions = "",
  onCashInstructionsChange
}: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-6">
      <RadioGroup value={value} onValueChange={(v) => onChange(v as PaymentMethod)}>
        <div className="flex flex-col space-y-3">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Bank Transfer" id="bank" />
            <Label htmlFor="bank" className="flex items-center cursor-pointer">
              <Banknote className="mr-2 h-4 w-4" />
              Bank Transfer
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="PayPal" id="paypal" />
            <Label htmlFor="paypal" className="flex items-center cursor-pointer">
              <CreditCard className="mr-2 h-4 w-4" />
              PayPal
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="UPI" id="upi" />
            <Label htmlFor="upi" className="flex items-center cursor-pointer">
              <Smartphone className="mr-2 h-4 w-4" />
              UPI
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Payment Link" id="link" />
            <Label htmlFor="link" className="flex items-center cursor-pointer">
              <Link2 className="mr-2 h-4 w-4" />
              Payment Link
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Cash" id="cash" />
            <Label htmlFor="cash" className="flex items-center cursor-pointer">
              <CircleDollarSign className="mr-2 h-4 w-4" />
              Cash
            </Label>
          </div>
        </div>
      </RadioGroup>

      {/* Conditional Input Fields */}
      {value === "Bank Transfer" && (
        <div className="mt-4">
          <Label htmlFor="bankDetails">Enter bank details</Label>
          <Textarea
            id="bankDetails"
            placeholder="Bank Name, Account Holder Name, Account Number, Account Type, IFSC/SWIFT Code, IBAN, etc..."
            value={bankDetails}
            onChange={(e) => onBankDetailsChange?.(e.target.value)}
            className="mt-1.5"
            rows={4}
          />
        </div>
      )}

      {value === "PayPal" && (
        <div className="mt-4">
          <Label htmlFor="paypalId">Enter PayPal ID</Label>
          <Input
            id="paypalId"
            placeholder="example@domain.com"
            value={paypalId}
            onChange={(e) => onPaypalIdChange?.(e.target.value)}
            className="mt-1.5"
          />
        </div>
      )}

      {value === "UPI" && (
        <div className="mt-4">
          <Label htmlFor="upiId">Enter UPI ID</Label>
          <Input
            id="upiId"
            placeholder="username@upi"
            value={upiId}
            onChange={(e) => onUpiIdChange?.(e.target.value)}
            className="mt-1.5"
          />
        </div>
      )}

      {value === "Payment Link" && (
        <div className="mt-4">
          <Label htmlFor="paymentLink">Enter Payment Link</Label>
          <Input
            id="paymentLink"
            placeholder="https://"
            value={paymentLink}
            onChange={(e) => onPaymentLinkChange?.(e.target.value)}
            className="mt-1.5"
          />
        </div>
      )}

      {value === "Cash" && (
        <div className="mt-4">
          <Label htmlFor="cashInstructions">Cash Payment Instructions</Label>
          <Textarea
            id="cashInstructions"
            placeholder="Enter instructions for cash payment..."
            value={cashInstructions}
            onChange={(e) => onCashInstructionsChange?.(e.target.value)}
            className="mt-1.5"
            rows={4}
          />
        </div>
      )}
    </div>
  );
}
