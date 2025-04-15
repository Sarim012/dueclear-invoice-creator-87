
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PaymentTerms } from "@/types/invoice";

const paymentTermsOptions = [
  { value: "NET7", label: "NET7" },
  { value: "NET15", label: "NET15" },
  { value: "NET30", label: "NET30" },
  { value: "NET45", label: "NET45" },
  { value: "NET60", label: "NET60" },
  { value: "NET90", label: "NET90" },
];

interface PaymentTermsSelectorProps {
  value: PaymentTerms;
  onValueChange: (value: PaymentTerms) => void;
}

export function PaymentTermsSelector({
  value,
  onValueChange,
}: PaymentTermsSelectorProps) {
  const [open, setOpen] = React.useState(false);

  // Safely determine the display value
  const displayValue = React.useMemo(() => {
    const option = paymentTermsOptions.find(opt => opt.value === value);
    return option ? option.label : value || "Select payment terms";
  }, [value]);

  // Safely ensure options is always an array
  const options = React.useMemo(() => {
    return paymentTermsOptions || [];
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-white"
        >
          {displayValue}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search payment terms..." />
          <CommandList>
            <CommandEmpty>No payment terms found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => {
                    onValueChange(option.value as PaymentTerms);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
