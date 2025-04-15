
import { useState } from "react";
import { File, FileText } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Invoice } from "@/types/invoice";
import { formatCurrency } from "@/utils/currencies";

interface RecentInvoicesProps {
  invoices: Invoice[];
  onViewInvoice: (invoiceId: string) => void;
}

export function RecentInvoices({ invoices, onViewInvoice }: RecentInvoicesProps) {
  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center">
        <FileText className="h-5 w-5 text-blue-500 mr-2" />
        <CardTitle>Recent Invoices</CardTitle>
      </CardHeader>
      <CardContent>
        {invoices.length > 0 ? (
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex justify-between items-center p-3 rounded-md border hover:bg-muted cursor-pointer transition-colors"
                onClick={() => onViewInvoice(invoice.id)}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{invoice.invoiceNumber}</span>
                  <span className="text-sm text-muted-foreground">
                    {invoice.clientDetails.split('\n')[0]} - {format(new Date(invoice.issueDate), "MMM dd, yyyy")}
                  </span>
                </div>
                <div className="font-medium">
                  {formatCurrency(invoice.total, invoice.currency)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
            <File className="h-16 w-16 mb-4 text-muted" />
            <p className="mb-2 text-base">No invoices yet</p>
            <p className="text-sm">Your recent invoices will appear here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
