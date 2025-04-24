import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { format, addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { InvoiceHeader } from "./invoice-header";
import { InvoiceDetails } from "./invoice-details";
import { PartyDetails } from "./party-details";
import { InvoiceItemRow } from "./invoice-item";
import { InvoiceSummary } from "./invoice-summary";
import { PaymentMethodSelector } from "./payment-method-selector";
import { NotesAndTerms } from "./notes-and-terms";
import { Invoice, InvoiceItem, PaymentMethod, PaymentTerms } from "@/types/invoice";
import { calculateSubtotal, calculateTotal } from "@/utils/calculations";
import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { generateInvoicePDF } from "@/utils/pdf-generator";

interface InvoiceFormProps {
  onSubmit: (invoice: Invoice) => void;
  onCancel: () => void;
}

export function InvoiceForm({ onSubmit, onCancel }: InvoiceFormProps) {
  // Basic invoice details state
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);
  const [invoiceNumber, setInvoiceNumber] = useState("INV-0001");
  const [paymentTerms, setPaymentTerms] = useState<PaymentTerms>("NET30");
  const [issueDate, setIssueDate] = useState<Date>(new Date());
  const [dueDate, setDueDate] = useState<Date>(addDays(new Date(), 30));
  const [currency, setCurrency] = useState("USD");
  const [businessDetails, setBusinessDetails] = useState("");
  const [clientDetails, setClientDetails] = useState("");
  
  // Invoice items state
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: uuidv4(),
      description: "",
      quantity: 1,
      rate: 0,
      discount: 0,
      discountType: "percent",
      amount: 0,
    },
  ]);

  // Calculations state
  const [subtotal, setSubtotal] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountType, setDiscountType] = useState<"percent" | "amount">("percent");
  const [taxPercent, setTaxPercent] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [total, setTotal] = useState(0);
  
  // Payment method related states
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Bank Transfer");
  const [bankDetails, setBankDetails] = useState("");
  const [paypalId, setPaypalId] = useState("");
  const [upiId, setUpiId] = useState("");
  const [paymentLink, setPaymentLink] = useState("");
  const [cashInstructions, setCashInstructions] = useState("");
  
  // Additional info state
  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState("");
  
  // Add live preview state
  const [isLivePreviewEnabled, setIsLivePreviewEnabled] = useState(false);

  // Function to generate live preview
  const generateLivePreview = async () => {
    if (!isLivePreviewEnabled) return;

    const currentInvoice: Invoice = {
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
      paypalId,
      upiId,
      paymentLink,
      cashInstructions,
      notes,
      terms,
      createdAt: new Date(),
    };

    try {
      await generateInvoicePDF(currentInvoice);
    } catch (error) {
      console.error("Error generating live preview:", error);
    }
  };

  // Update live preview when form data changes
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      generateLivePreview();
    }, 1000); // Debounce for 1 second

    return () => clearTimeout(debounceTimeout);
  }, [
    isLivePreviewEnabled,
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
    discountPercent,
    taxPercent,
    shipping,
    total,
    paymentMethod,
    bankDetails,
    paypalId,
    upiId,
    paymentLink,
    cashInstructions,
    notes,
    terms,
  ]);

  // Handle logo upload
  const handleLogoUpload = (file: File) => {
    setLogoFile(file);
    const url = URL.createObjectURL(file);
    setLogoUrl(url);
  };

  // Items management
  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: uuidv4(),
        description: "",
        quantity: 1,
        rate: 0,
        discount: 0,
        discountType: "percent",
        amount: 0,
      },
    ]);
  };

  const handleItemChange = (updatedItem: InvoiceItem) => {
    setItems(
      items.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  // Update calculations
  useEffect(() => {
    const newSubtotal = calculateSubtotal(items);
    setSubtotal(newSubtotal);
  }, [items]);

  useEffect(() => {
    const newTotal = calculateTotal(
      subtotal,
      discountPercent,
      discountType,
      taxPercent,
      shipping
    );
    setTotal(newTotal);
  }, [subtotal, discountPercent, discountType, taxPercent, shipping]);

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
      paypalId,
      upiId,
      paymentLink,
      cashInstructions,
      notes,
      terms,
      createdAt: new Date(),
      // Note: discountType is only used in calculation, not saved directly to Invoice as per interface
    };
    
    onSubmit(invoice);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Create New Invoice</h2>
            <h3 className="text-lg font-medium mb-2">Invoice Details</h3>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="live-preview"
              checked={isLivePreviewEnabled}
              onCheckedChange={setIsLivePreviewEnabled}
            />
            <label htmlFor="live-preview" className="text-sm text-gray-600">
              Live Preview
            </label>
          </div>
        </div>

        {/* Main Invoice Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Logo Upload Section */}
          <div className="md:col-span-1">
            <InvoiceHeader 
              logoUrl={logoUrl}
              onLogoChange={handleLogoUpload}
            />
          </div>

          {/* Invoice Details Right Side */}
          <div className="md:col-span-2">
            <InvoiceDetails
              invoiceNumber={invoiceNumber}
              onInvoiceNumberChange={setInvoiceNumber}
              paymentTerms={paymentTerms}
              onPaymentTermsChange={setPaymentTerms}
              issueDate={issueDate}
              onIssueDateChange={setIssueDate}
              dueDate={dueDate}
              onDueDateChange={setDueDate}
              currency={currency}
              onCurrencyChange={setCurrency}
            />
          </div>
        </div>

        {/* Business and Client Details */}
        <PartyDetails
          businessDetails={businessDetails}
          onBusinessDetailsChange={setBusinessDetails}
          clientDetails={clientDetails}
          onClientDetailsChange={setClientDetails}
        />

        {/* Invoice Items */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Items</h3>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Description</TableHead>
                  <TableHead className="w-16 text-center">Qty</TableHead>
                  <TableHead className="w-24 text-center">Rate</TableHead>
                  <TableHead className="w-32 text-center">Discount</TableHead>
                  <TableHead className="w-28 text-right">Amount</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <InvoiceItemRow
                    key={item.id}
                    item={item}
                    onChange={handleItemChange}
                    onRemove={() => handleRemoveItem(item.id)}
                    currency={currency}
                  />
                ))}
              </TableBody>
            </Table>
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
          <InvoiceSummary
            subtotal={subtotal}
            currency={currency}
            discountPercent={discountPercent}
            onDiscountPercentChange={setDiscountPercent}
            discountType={discountType}
            onDiscountTypeChange={setDiscountType}
            taxPercent={taxPercent}
            onTaxPercentChange={setTaxPercent}
            shipping={shipping}
            onShippingChange={setShipping}
            total={total}
          />
        </div>

        {/* Payment Method */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">How does this invoice get paid?</h3>
          
          <PaymentMethodSelector
            value={paymentMethod}
            onChange={setPaymentMethod}
            bankDetails={bankDetails}
            onBankDetailsChange={setBankDetails}
            paypalId={paypalId}
            onPaypalIdChange={setPaypalId}
            upiId={upiId}
            onUpiIdChange={setUpiId}
            paymentLink={paymentLink}
            onPaymentLinkChange={setPaymentLink}
            cashInstructions={cashInstructions}
            onCashInstructionsChange={setCashInstructions}
          />
        </div>

        {/* Notes and Terms */}
        <NotesAndTerms
          notes={notes}
          onNotesChange={setNotes}
          terms={terms}
          onTermsChange={setTerms}
        />

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
