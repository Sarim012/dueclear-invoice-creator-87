
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { format, addDays } from "date-fns";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DatePicker } from "./date-picker";
import { PaymentTermsSelector } from "./payment-terms-selector";
import { CurrencySelector } from "./currency-selector";
import { InvoiceItemRow } from "./invoice-item";
import { PaymentMethodSelector } from "./payment-method-selector";
import { FileUpload } from "../ui/file-upload";
import { Invoice, InvoiceItem, PaymentMethod, PaymentTerms } from "@/types/invoice";
import { 
  calculateSubtotal, 
  calculateTotal,
  formatNumber,
} from "@/utils/calculations";
import { formatCurrency } from "@/utils/currencies";

interface InvoiceFormProps {
  onSubmit: (invoice: Invoice) => void;
  onCancel: () => void;
}

export function InvoiceForm({ onSubmit, onCancel }: InvoiceFormProps) {
  // Basic invoice details
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);
  const [invoiceNumber, setInvoiceNumber] = useState("INV-0001");
  const [paymentTerms, setPaymentTerms] = useState<PaymentTerms>("NET30");
  const [issueDate, setIssueDate] = useState<Date>(new Date());
  const [dueDate, setDueDate] = useState<Date>(addDays(new Date(), 30));
  const [currency, setCurrency] = useState("USD");
  const [businessDetails, setBusinessDetails] = useState("");
  const [clientDetails, setClientDetails] = useState("");
  
  // Invoice items
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: uuidv4(),
      description: "",
      quantity: 1,
      rate: 0,
      discount: 0,
      amount: 0,
    },
  ]);
  
  // Calculations
  const [subtotal, setSubtotal] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [taxPercent, setTaxPercent] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [total, setTotal] = useState(0);
  
  // Payment and additional info
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Bank Transfer");
  const [bankDetails, setBankDetails] = useState("");
  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState("");

  // Update subtotal when items change
  useEffect(() => {
    const newSubtotal = calculateSubtotal(items);
    setSubtotal(newSubtotal);
  }, [items]);

  // Update total when relevant fields change
  useEffect(() => {
    const newTotal = calculateTotal(
      subtotal,
      discountPercent,
      taxPercent,
      shipping
    );
    setTotal(newTotal);
  }, [subtotal, discountPercent, taxPercent, shipping]);

  // Update due date when payment terms change
  useEffect(() => {
    if (issueDate) {
      let days = 30; // Default NET30
      
      switch (paymentTerms) {
        case 'NET7':
          days = 7;
          break;
        case 'NET15':
          days = 15;
          break;
        case 'NET30':
          days = 30;
          break;
        case 'NET45':
          days = 45;
          break;
        case 'NET60':
          days = 60;
          break;
        case 'NET90':
          days = 90;
          break;
      }
      
      setDueDate(addDays(issueDate, days));
    }
  }, [paymentTerms, issueDate]);

  // Handle logo upload
  const handleLogoUpload = (file: File) => {
    setLogoFile(file);
    const url = URL.createObjectURL(file);
    setLogoUrl(url);
  };

  // Handle adding a new invoice item
  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: uuidv4(),
        description: "",
        quantity: 1,
        rate: 0,
        discount: 0,
        amount: 0,
      },
    ]);
  };

  // Handle updating an invoice item
  const handleItemChange = (updatedItem: InvoiceItem) => {
    setItems(
      items.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      )
    );
  };

  // Handle removing an invoice item
  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const invoice: Invoice = {
      id: uuidv4(),
      logoUrl,
      invoiceNumber,
      paymentTerms,
      issueDate,
      dueDate,
      currency,
      businessDetails,
      clientDetails,
      items,
      subtotal,
      discount: discountPercent,
      tax: taxPercent,
      shipping,
      total,
      paymentMethod,
      bankDetails,
      notes,
      terms,
      createdAt: new Date(),
    };
    
    onSubmit(invoice);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Create New Invoice</h2>
          <h3 className="text-lg font-medium mb-2">Invoice Details</h3>
        </div>

        {/* Logo Upload Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 w-full max-w-xs flex flex-col items-center">
                {logoUrl ? (
                  <div className="flex flex-col items-center space-y-2">
                    <img
                      src={logoUrl}
                      alt="Uploaded logo"
                      className="w-32 h-32 object-contain"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setLogoFile(null);
                        setLogoUrl(undefined);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="mb-2 text-center">
                      <div className="text-muted-foreground mb-2">Upload logo</div>
                      <div className="text-sm text-muted-foreground mb-1">
                        Supported formats: JPG, PNG, SVG
                      </div>
                      <div className="text-sm text-muted-foreground mb-4">
                        Recommended size: 500px × 500px
                      </div>
                      
                      <FileUpload
                        onFileSelected={handleLogoUpload}
                        maxSizeMB={1}
                        allowedTypes={["image/jpeg", "image/png", "image/svg+xml"]}
                      />
                      
                      <div className="text-xs text-muted-foreground mt-2">
                        Max upload size: 1 MB
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Invoice Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="invoiceNumber">Invoice Number</Label>
            <Input
              id="invoiceNumber"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="paymentTerms">Payment Terms</Label>
            <PaymentTermsSelector
              value={paymentTerms}
              onValueChange={setPaymentTerms}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="issueDate">Issue Date</Label>
            <DatePicker
              date={issueDate}
              onDateChange={(date) => date && setIssueDate(date)}
              label={format(new Date(), "MM/dd/yyyy")}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <DatePicker
              date={dueDate}
              onDateChange={(date) => date && setDueDate(date)}
              label="Select due date"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <CurrencySelector value={currency} onValueChange={setCurrency} />
          </div>
        </div>

        {/* Business and Client Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="businessDetails">Invoice From</Label>
            <p className="text-sm text-muted-foreground">Your Business Details</p>
            <Textarea
              id="businessDetails"
              placeholder="Business Name,
Address,
Phone,
Email,
TAX ID, etc."
              rows={5}
              value={businessDetails}
              onChange={(e) => setBusinessDetails(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="clientDetails">Bill To</Label>
            <p className="text-sm text-muted-foreground">Client Details</p>
            <Textarea
              id="clientDetails"
              placeholder="Client/Business Name,
Address,
Phone,
Email,
TAX ID, etc."
              rows={5}
              value={clientDetails}
              onChange={(e) => setClientDetails(e.target.value)}
            />
          </div>
        </div>

        {/* Invoice Items */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Items</h3>
          
          <div className="grid grid-cols-12 gap-2 font-medium text-sm mb-2">
            <div className="col-span-4 sm:col-span-5">Item Description</div>
            <div className="col-span-2 sm:col-span-1">Qty</div>
            <div className="col-span-2">Rate</div>
            <div className="col-span-2">Discount</div>
            <div className="col-span-1 text-right">Amount</div>
            <div className="col-span-1"></div>
          </div>
          
          {items.map((item) => (
            <InvoiceItemRow
              key={item.id}
              item={item}
              onChange={handleItemChange}
              onRemove={() => handleRemoveItem(item.id)}
              currency={currency}
            />
          ))}
          
          <Button
            type="button"
            variant="outline"
            className="text-primary"
            onClick={handleAddItem}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>

        {/* Summary Calculations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-start-2 space-y-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatCurrency(subtotal, currency)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Discount:</span>
              <div className="flex items-center space-x-2 w-1/3">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(parseInt(e.target.value) || 0)}
                  className="w-full"
                />
                <span>%</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Tax:</span>
              <div className="flex items-center space-x-2 w-1/3">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(parseInt(e.target.value) || 0)}
                  className="w-full"
                />
                <span>%</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Shipping:</span>
              <div className="w-1/3">
                <Input
                  type="number"
                  min="0"
                  value={shipping}
                  onChange={(e) => setShipping(parseInt(e.target.value) || 0)}
                  className="w-full"
                />
              </div>
            </div>
            
            <Separator />
            
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span className="text-xl text-primary">{formatCurrency(total, currency)}</span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">How does this invoice get paid?</h3>
          
          <PaymentMethodSelector
            value={paymentMethod}
            onChange={setPaymentMethod}
          />
          
          {paymentMethod === "Bank Transfer" && (
            <div className="mt-4">
              <Label htmlFor="bankDetails">Enter bank details</Label>
              <Textarea
                id="bankDetails"
                placeholder="Bank Name,
Account Holder Name,
Account Number,
Account Type,
IFSC/SWIFT Code,
IBAN, etc..."
                rows={5}
                value={bankDetails}
                onChange={(e) => setBankDetails(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Notes and Terms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Notes to be displayed on the invoice"
              rows={5}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="terms">Terms</Label>
            <Textarea
              id="terms"
              placeholder="Terms and conditions for this invoice"
              rows={5}
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-black text-white hover:bg-black/90">
            Create Invoice
          </Button>
        </div>
      </div>
    </form>
  );
}
