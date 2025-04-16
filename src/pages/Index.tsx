
import { useState } from "react";
import { InvoiceForm } from "@/components/invoice/invoice-form";
import { RecentInvoices } from "@/components/invoice/recent-invoices";
import { useInvoices } from "@/contexts/invoice-context";
import { useToast } from "@/components/ui/use-toast";
import { Invoice } from "@/types/invoice";
import { generateInvoicePDF } from "@/utils/pdf-generator";

const Index = () => {
  const { invoices, addInvoice } = useInvoices();
  const { toast } = useToast();
  
  const handleSubmit = async (invoice: Invoice) => {
    // Add the invoice to the context
    addInvoice(invoice);
    
    // Generate and download the PDF
    try {
      await generateInvoicePDF(invoice);
      
      // Show success message with PDF info
      toast({
        title: "Invoice created successfully",
        description: `Invoice ${invoice.invoiceNumber} has been created and downloaded as PDF.`,
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Invoice created",
        description: `Invoice ${invoice.invoiceNumber} has been created but there was an error downloading the PDF.`,
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    // No action needed since we're already on the main page
  };

  const handleViewInvoice = (invoiceId: string) => {
    // Find the invoice
    const invoice = invoices.find(inv => inv.id === invoiceId);
    
    if (invoice) {
      // Generate and download the PDF for the selected invoice
      try {
        generateInvoicePDF(invoice);
        toast({
          title: "Viewing Invoice",
          description: `Invoice ${invoice.invoiceNumber} is being downloaded as PDF.`,
        });
      } catch (error) {
        console.error("Error generating PDF:", error);
        toast({
          title: "Error",
          description: "There was an error generating the PDF.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Display the invoice form directly */}
        <InvoiceForm onSubmit={handleSubmit} onCancel={handleCancel} />
        
        {/* Recent Invoices section below the form */}
        <div className="mt-8">
          <RecentInvoices 
            invoices={invoices} 
            onViewInvoice={handleViewInvoice} 
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
