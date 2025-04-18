
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
import { Invoice, InvoiceItem, PaymentMethod } from "@/types/invoice";
import { calculateSubtotal, calculateTotal } from "@/utils/calculations";
import { Plus } from "lucide-react";

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
      amount: 0,
    },
  ]);
  
  // Calculations state
  const [subtotal, setSubtotal] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);
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
      taxPercent,
      shipping
    );
    setTotal(newTotal);
  }, [subtotal, discountPercent, taxPercent, shipping]);

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
                  <InvoiceItemRow
                    key={item.id}
                    item={item}
                    onChange={handleItemChange}
                    onRemove={() => handleRemoveItem(item.id)}
                    currency={currency}
                  />
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
          <InvoiceSummary
            subtotal={subtotal}
            currency={currency}
            discountPercent={discountPercent}
            onDiscountPercentChange={setDiscountPercent}
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
