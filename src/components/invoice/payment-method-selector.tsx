
import { PaymentMethod } from "@/types/invoice";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Banknote, CreditCard, Link2, CircleDollarSign, Smartphone } from "lucide-react";

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
}

export function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
  return (
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
  );
}
