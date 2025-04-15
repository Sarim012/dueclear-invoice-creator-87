
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Invoice } from '@/types/invoice';
import { format } from 'date-fns';

export const generateInvoicePDF = async (invoice: Invoice): Promise<void> => {
  // Create a temporary container for rendering the invoice
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  container.style.width = '210mm'; // A4 width
  document.body.appendChild(container);
  
  try {
    // Generate HTML content for the invoice
    container.innerHTML = `
      <div id="invoice-pdf" style="padding: 20px; font-family: Arial, sans-serif;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
          ${invoice.logoUrl ? `<img src="${invoice.logoUrl}" alt="Company Logo" style="max-height: 80px;" />` : ''}
          <div style="text-align: right;">
            <h1 style="color: #333; margin: 0;">INVOICE</h1>
            <p style="margin: 5px 0;">#${invoice.invoiceNumber}</p>
            <p style="margin: 5px 0;">Issue Date: ${format(invoice.issueDate, 'dd/MM/yyyy')}</p>
            <p style="margin: 5px 0;">Due Date: ${format(invoice.dueDate, 'dd/MM/yyyy')}</p>
          </div>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
          <div style="width: 45%; padding: 15px; background-color: #f9f9f9;">
            <h3 style="margin-top: 0;">From</h3>
            <pre style="font-family: Arial, sans-serif; white-space: pre-wrap;">${invoice.businessDetails}</pre>
          </div>
          <div style="width: 45%; padding: 15px; background-color: #f9f9f9;">
            <h3 style="margin-top: 0;">Bill To</h3>
            <pre style="font-family: Arial, sans-serif; white-space: pre-wrap;">${invoice.clientDetails}</pre>
          </div>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <thead>
            <tr style="background-color: #000; color: white;">
              <th style="padding: 10px; text-align: left;">DESCRIPTION</th>
              <th style="padding: 10px; text-align: center;">QTY</th>
              <th style="padding: 10px; text-align: center;">RATE</th>
              <th style="padding: 10px; text-align: center;">DISCOUNT</th>
              <th style="padding: 10px; text-align: right;">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map(item => `
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px; text-align: left;">${item.description}</td>
                <td style="padding: 10px; text-align: center;">${item.quantity}</td>
                <td style="padding: 10px; text-align: center;">${item.rate.toFixed(2)}</td>
                <td style="padding: 10px; text-align: center;">${item.discount}%</td>
                <td style="padding: 10px; text-align: right;">${item.amount.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div style="display: flex; justify-content: flex-end;">
          <div style="width: 300px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span>Subtotal:</span>
              <span>${invoice.subtotal.toFixed(2)}</span>
            </div>
            ${invoice.discount > 0 ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>Discount (${invoice.discount}%):</span>
                <span>-${(invoice.subtotal * invoice.discount / 100).toFixed(2)}</span>
              </div>
            ` : ''}
            ${invoice.tax > 0 ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>Tax (${invoice.tax}%):</span>
                <span>${(invoice.subtotal * (1 - invoice.discount / 100) * invoice.tax / 100).toFixed(2)}</span>
              </div>
            ` : ''}
            ${invoice.shipping > 0 ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>Shipping:</span>
                <span>${invoice.shipping.toFixed(2)}</span>
              </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; font-weight: bold; margin-top: 10px; border-top: 1px solid #ddd; padding-top: 10px;">
              <span>Total:</span>
              <span>${invoice.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        ${invoice.paymentMethod === 'Bank Transfer' && invoice.bankDetails ? `
          <div style="margin-top: 30px; padding: 15px; background-color: #f9f9f9;">
            <h3 style="margin-top: 0;">Bank Transfer Payment:</h3>
            <pre style="font-family: Arial, sans-serif; white-space: pre-wrap;">${invoice.bankDetails}</pre>
          </div>
        ` : ''}
        
        <div style="display: flex; justify-content: space-between; margin-top: 30px;">
          ${invoice.notes ? `
            <div style="width: 45%;">
              <h3>Notes</h3>
              <p>${invoice.notes}</p>
            </div>
          ` : ''}
          ${invoice.terms ? `
            <div style="width: 45%;">
              <h3>Terms & Conditions</h3>
              <p>${invoice.terms}</p>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    // Wait for fonts and images to load
    await new Promise(resolve => setTimeout(resolve, 500));

    // Create a canvas from the HTML content
    const canvas = await html2canvas(container.querySelector('#invoice-pdf')!, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // Allow loading of cross-origin images
      logging: false,
    });

    // Generate PDF from canvas
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Calculate the required height and width to maintain aspect ratio
    const imgWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

    // Download the PDF
    pdf.save(`Invoice_${invoice.invoiceNumber}.pdf`);
  } finally {
    // Clean up the temporary container
    document.body.removeChild(container);
  }
};
