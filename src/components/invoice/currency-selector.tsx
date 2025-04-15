
import { useState, useMemo } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { allCurrencies, commonCurrencies } from "@/utils/currencies";

interface CurrencySelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function CurrencySelector({ value, onValueChange }: CurrencySelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Safely determine the display value using useMemo
  const displayValue = useMemo(() => {
    const selectedCurrency = value ? allCurrencies.find((currency) => currency.code === value) : null;
    return selectedCurrency 
      ? `${selectedCurrency.code} (${selectedCurrency.symbol})` 
      : "Select currency";
  }, [value]);

  // Filter currencies for display based on search term
  const displayCommonCurrencies = useMemo(() => {
    return commonCurrencies || [];
  }, []);

  const displayAllCurrencies = useMemo(() => {
    return allCurrencies
      ? allCurrencies.filter(c => !commonCurrencies.some(common => common.code === c.code))
      : [];
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {displayValue}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput 
              placeholder="Search currency..." 
              className="h-9 border-0 outline-none focus-visible:ring-0"
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
          </div>
          <CommandEmpty>No currency found.</CommandEmpty>
          <CommandGroup heading="Common Currencies">
            {displayCommonCurrencies.map((currency) => (
              <CommandItem
                key={currency.code}
                value={currency.code}
                onSelect={() => {
                  onValueChange(currency.code);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === currency.code ? "opacity-100" : "opacity-0"
                  )}
                />
                {currency.code} ({currency.symbol}) - {currency.name}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="All Currencies">
            {displayAllCurrencies.map((currency) => (
              <CommandItem
                key={currency.code}
                value={currency.code}
                onSelect={() => {
                  onValueChange(currency.code);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === currency.code ? "opacity-100" : "opacity-0"
                  )}
                />
                {currency.code} ({currency.symbol}) - {currency.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
