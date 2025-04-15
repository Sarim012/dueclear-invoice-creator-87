
import { useState } from "react";
import { InvoiceForm } from "@/components/invoice/invoice-form";
import { RecentInvoices } from "@/components/invoice/recent-invoices";
import { useInvoices } from "@/contexts/invoice-context";
import { useToast } from "@/components/ui/use-toast";
import { Invoice } from "@/types/invoice";

const Index = () => {
  const { invoices, addInvoice } = useInvoices();
  const { toast } = useToast();
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);

  const handleSubmit = (invoice: Invoice) => {
    addInvoice(invoice);
    setIsCreatingInvoice(false);
    toast({
      title: "Invoice created",
      description: `Invoice ${invoice.invoiceNumber} has been created successfully.`,
    });
  };

  const handleCancel = () => {
    setIsCreatingInvoice(false);
  };

  const handleViewInvoice = (invoiceId: string) => {
    // For future implementation: Navigate to invoice detail page
    toast({
      title: "View Invoice",
      description: `Viewing invoice ${invoiceId}`,
    });
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      {isCreatingInvoice ? (
        <div className="max-w-5xl mx-auto">
          <InvoiceForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
            <button
              onClick={() => setIsCreatingInvoice(true)}
              className="px-6 py-2 bg-black text-white rounded-md hover:bg-black/90 transition-colors"
            >
              Create New Invoice
            </button>
          </div>

          <RecentInvoices 
            invoices={invoices} 
            onViewInvoice={handleViewInvoice} 
          />
        </div>
      )}
    </div>
  );
};

export default Index;
