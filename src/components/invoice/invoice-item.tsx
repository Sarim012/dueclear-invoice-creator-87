
import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InvoiceItem } from "@/types/invoice";
import { calculateItemAmount, parseNumberInput } from "@/utils/calculations";
import { formatCurrency } from "@/utils/currencies";

interface InvoiceItemRowProps {
  item: InvoiceItem;
  onChange: (updatedItem: InvoiceItem) => void;
  onRemove: () => void;
  currency: string;
}

export function InvoiceItemRow({
  item,
  onChange,
  onRemove,
  currency,
}: InvoiceItemRowProps) {
  const [description, setDescription] = useState(item.description);
  const [quantity, setQuantity] = useState(item.quantity.toString());
  const [rate, setRate] = useState(item.rate.toString());
  const [discount, setDiscount] = useState(item.discount.toString());
  
  // Update parent component when any value changes
  useEffect(() => {
    const quantityNum = parseNumberInput(quantity);
    const rateNum = parseNumberInput(rate);
    const discountNum = parseNumberInput(discount);
    
    const amount = calculateItemAmount(quantityNum, rateNum, discountNum);
    
    onChange({
      ...item,
      description,
      quantity: quantityNum,
      rate: rateNum,
      discount: discountNum,
      amount,
    });
  }, [description, quantity, rate, discount, onChange, item]);

  return (
    <div className="grid grid-cols-12 gap-2 items-center mb-2">
      <div className="col-span-4 sm:col-span-5">
        <Input
          placeholder="Item description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      
      <div className="col-span-2 sm:col-span-1">
        <Input
          type="number"
          min="0"
          placeholder="Qty"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>
      
      <div className="col-span-2">
        <Input
          type="number"
          min="0"
          placeholder="Rate"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
        />
      </div>
      
      <div className="col-span-2 flex items-center">
        <Input
          type="number"
          min="0"
          max="100"
          placeholder="0"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          className="w-full"
        />
        <span className="ml-1">%</span>
      </div>
      
      <div className="col-span-1 text-right whitespace-nowrap">
        {formatCurrency(item.amount || 0, currency)}
      </div>
      
      <div className="col-span-1 flex justify-end">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onRemove}
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
