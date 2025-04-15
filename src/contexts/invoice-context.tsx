
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Invoice } from "../types/invoice";

interface InvoiceContextType {
  invoices: Invoice[];
  addInvoice: (invoice: Invoice) => void;
  getInvoice: (id: string) => Invoice | undefined;
  updateInvoice: (id: string, invoice: Invoice) => void;
  deleteInvoice: (id: string) => void;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

interface InvoiceProviderProps {
  children: ReactNode;
}

export function InvoiceProvider({ children }: InvoiceProviderProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  // Load invoices from localStorage on first render
  useEffect(() => {
    const savedInvoices = localStorage.getItem("invoices");
    if (savedInvoices) {
      try {
        const parsedInvoices = JSON.parse(savedInvoices) as Invoice[];
        
        // Convert string dates back to Date objects
        const formattedInvoices = parsedInvoices.map(invoice => ({
          ...invoice,
          issueDate: new Date(invoice.issueDate),
          dueDate: new Date(invoice.dueDate),
          createdAt: new Date(invoice.createdAt)
        }));
        
        setInvoices(formattedInvoices);
      } catch (error) {
        console.error("Failed to parse invoices from localStorage:", error);
        // If parsing fails, start with empty array
        setInvoices([]);
      }
    }
  }, []);

  // Save invoices to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("invoices", JSON.stringify(invoices));
  }, [invoices]);

  // Add a new invoice
  const addInvoice = (invoice: Invoice) => {
    setInvoices((prevInvoices) => [...prevInvoices, invoice]);
  };

  // Get a specific invoice by ID
  const getInvoice = (id: string) => {
    return invoices.find((invoice) => invoice.id === id);
  };

  // Update an existing invoice
  const updateInvoice = (id: string, updatedInvoice: Invoice) => {
    setInvoices((prevInvoices) =>
      prevInvoices.map((invoice) =>
        invoice.id === id ? updatedInvoice : invoice
      )
    );
  };

  // Delete an invoice
  const deleteInvoice = (id: string) => {
    setInvoices((prevInvoices) =>
      prevInvoices.filter((invoice) => invoice.id !== id)
    );
  };

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        addInvoice,
        getInvoice,
        updateInvoice,
        deleteInvoice,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
}

// Custom hook to use the invoice context
export function useInvoices() {
  const context = useContext(InvoiceContext);
  if (context === undefined) {
    throw new Error("useInvoices must be used within an InvoiceProvider");
  }
  return context;
}
