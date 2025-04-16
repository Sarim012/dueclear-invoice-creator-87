import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { format, addDays } from "date-fns";
import { Plus, Upload, Calendar, Trash2, Image } from "lucide-react";
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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Create New Invoice</h2>
          <h3 className="text-lg font-medium mb-2">Invoice Details</h3>
        </div>

        {/* Main Invoice Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Logo Upload Section */}
          <div className="md:col-span-1">
            <Card className="h-full">
              <CardContent className="pt-6">
                <div className="flex flex-col space-y-4">
                  <h3 className="text-lg font-medium">Logo</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center space-y-4">
                    {logoUrl ? (
                      <div className="flex flex-col items-center space-y-4">
                        <img
                          src={logoUrl}
                          alt="Uploaded logo"
                          className="w-24 h-24 object-contain"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setLogoFile(null);
                            setLogoUrl(undefined);
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center space-y-4 w-full">
                        <Image className="h-16 w-16 text-gray-400" />
                        <div className="text-center space-y-2">
                          <p className="text-base text-gray-500">Upload logo</p>
                          <p className="text-sm text-gray-400">
                            Supported formats: JPG, PNG, SVG
                          </p>
                          <p className="text-sm text-gray-400">
                            Recommended size: 500px × 500px
                          </p>
                          
                          <FileUpload
                            onFileSelected={handleLogoUpload}
                            maxSizeMB={1}
                            allowedTypes={["image/jpeg", "image/png", "image/svg+xml"]}
                            buttonVariant="black"
                            buttonText="Upload"
                            showFormatInfo={false}
                            className="mt-4"
                          />
                          
                          <p className="text-xs text-gray-400 mt-4">
                            Max upload size: 1 MB
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Invoice Details Right Side */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="bg-white"
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
                label={format(issueDate, "MM/dd/yyyy")}
                className="bg-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <DatePicker
                date={dueDate}
                onDateChange={(date) => date && setDueDate(date)}
                label={format(dueDate, "MM/dd/yyyy")}
                className="bg-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <CurrencySelector value={currency} onValueChange={setCurrency} />
            </div>
          </div>
        </div>

        {/* Business and Client Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="businessDetails">Invoice From</Label>
            <p className="text-sm text-muted-foreground">Your Business Details</p>
            <Textarea
              id="businessDetails"
              placeholder="Business Name, Address, Phone, Email, TAX ID, etc."
              rows={4}
              value={businessDetails}
              onChange={(e) => setBusinessDetails(e.target.value)}
              className="bg-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="clientDetails">Bill To</Label>
            <p className="text-sm text-muted-foreground">Client Details</p>
            <Textarea
              id="clientDetails"
              placeholder="Client/Business Name, Address, Phone, Email, TAX ID, etc."
              rows={4}
              value={clientDetails}
              onChange={(e) => setClientDetails(e.target.value)}
              className="bg-white"
            />
          </div>
        </div>

        {/* Invoice Items */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Items</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 font-medium text-sm">Item Description</th>
                  <th className="py-2 font-medium text-sm text-center w-16">Qty</th>
                  <th className="py-2 font-medium text-sm text-center w-24">Rate</th>
                  <th className="py-2 font-medium text-sm text-center w-24">Discount</th>
                  <th className="py-2 font-medium text-sm text-right w-28">Amount</th>
                  <th className="py-2 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-2">
                      <Input
                        value={item.description}
                        onChange={(e) => handleItemChange({
                          ...item,
                          description: e.target.value
                        })}
                        placeholder="Item description"
                        className="bg-white"
                      />
                    </td>
                    <td className="py-2">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange({
                          ...item,
                          quantity: parseInt(e.target.value) || 0,
                          amount: (parseInt(e.target.value) || 0) * item.rate * (1 - item.discount / 100)
                        })}
                        className="text-center bg-white"
                      />
                    </td>
                    <td className="py-2">
                      <Input
                        type="number"
                        min="0"
                        value={item.rate}
                        onChange={(e) => handleItemChange({
                          ...item,
                          rate: parseFloat(e.target.value) || 0,
                          amount: item.quantity * (parseFloat(e.target.value) || 0) * (1 - item.discount / 100)
                        })}
                        className="text-center bg-white"
                      />
                    </td>
                    <td className="py-2">
                      <div className="flex items-center">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={item.discount}
                          onChange={(e) => handleItemChange({
                            ...item,
                            discount: parseFloat(e.target.value) || 0,
                            amount: item.quantity * item.rate * (1 - (parseFloat(e.target.value) || 0) / 100)
                          })}
                          className="text-center bg-white"
                        />
                        <span className="ml-1">%</span>
                      </div>
                    </td>
                    <td className="py-2 text-right">
                      {formatCurrency(item.amount, currency)}
                    </td>
                    <td className="py-2 text-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={items.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-primary"
            onClick={handleAddItem}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>

        {/* Summary Calculations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  onChange={(e) => setDiscountPercent(parseInt(e.target.value) || 0)}
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
                  onChange={(e) => setTaxPercent(parseInt(e.target.value) || 0)}
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
                  onChange={(e) => setShipping(parseInt(e.target.value) || 0)}
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
                placeholder="Bank Name, Account Holder Name, Account Number, Account Type, IFSC/SWIFT Code, IBAN, etc..."
                rows={4}
                value={bankDetails}
                onChange={(e) => setBankDetails(e.target.value)}
                className="bg-white"
              />
            </div>
          )}
        </div>

        {/* Notes and Terms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Notes to be displayed on the invoice"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="terms">Terms</Label>
            <Textarea
              id="terms"
              placeholder="Terms and conditions for this invoice"
              rows={4}
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              className="bg-white"
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
