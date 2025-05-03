
(function($) {
    'use strict';

    // Document ready
    $(function() {
        // Handle the invoices listing page
        if ($('#invoice-creator-invoices-list').length > 0) {
            loadInvoices();
        }
        
        // Handle the invoice form page
        if ($('#invoice-creator-form').length > 0) {
            initInvoiceForm();
        }
    });

    /**
     * Load all invoices from the REST API
     */
    function loadInvoices() {
        const invoicesList = $('#invoice-creator-invoices-list');
        
        // Make API request to get invoices
        $.ajax({
            url: invoiceCreator.restUrl + '/invoices',
            method: 'GET',
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-WP-Nonce', invoiceCreator.nonce);
            },
            success: function(response) {
                if (response && response.length > 0) {
                    displayInvoices(response);
                } else {
                    invoicesList.html('<p>No invoices found. <a href="' + 
                        adminUrl('admin.php?page=invoice-creator-new') + 
                        '">Create your first invoice</a>.</p>');
                }
            },
            error: function(error) {
                invoicesList.html('<p>Error loading invoices. Please try again.</p>');
                console.error('Error loading invoices:', error);
            }
        });
    }
    
    /**
     * Display invoices in a table
     */
    function displayInvoices(invoices) {
        const invoicesList = $('#invoice-creator-invoices-list');
        let tableHtml = '<table class="invoice-list-table">';
        
        // Table header
        tableHtml += `
            <thead>
                <tr>
                    <th>Invoice #</th>
                    <th>Client</th>
                    <th>Issue Date</th>
                    <th>Due Date</th>
                    <th>Total</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
        `;
        
        // Table rows
        invoices.forEach(function(invoice) {
            // Parse client details to extract a name
            let clientName = 'Client';
            try {
                // Try to extract first line as client name
                const clientDetails = invoice.client_details;
                if (clientDetails) {
                    clientName = clientDetails.split('\n')[0];
                }
            } catch (e) {
                console.error('Error parsing client details', e);
            }
            
            tableHtml += `
                <tr data-id="${invoice.id}">
                    <td>${invoice.invoice_number}</td>
                    <td>${clientName}</td>
                    <td>${formatDate(invoice.issue_date)}</td>
                    <td>${formatDate(invoice.due_date)}</td>
                    <td>${formatCurrency(invoice.total, invoice.currency)}</td>
                    <td class="invoice-actions">
                        <button class="invoice-view" data-id="${invoice.id}">View/Download</button>
                        <button class="invoice-delete" data-id="${invoice.id}">Delete</button>
                    </td>
                </tr>
            `;
        });
        
        // Close table
        tableHtml += '</tbody></table>';
        
        // Add to DOM
        invoicesList.html(tableHtml);
        
        // Add event listeners
        $('.invoice-view').on('click', function() {
            const invoiceId = $(this).data('id');
            viewInvoice(invoiceId);
        });
        
        $('.invoice-delete').on('click', function() {
            const invoiceId = $(this).data('id');
            if (confirm('Are you sure you want to delete this invoice?')) {
                deleteInvoice(invoiceId);
            }
        });
    }
    
    /**
     * View/download invoice as PDF
     */
    function viewInvoice(invoiceId) {
        alert('PDF download functionality will be implemented here');
        // In a real implementation, we would:
        // 1. Get the invoice data from the API
        // 2. Generate a PDF using jsPDF or redirect to a PHP-generated PDF
    }
    
    /**
     * Delete an invoice
     */
    function deleteInvoice(invoiceId) {
        $.ajax({
            url: invoiceCreator.restUrl + '/invoices/' + invoiceId,
            method: 'DELETE',
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-WP-Nonce', invoiceCreator.nonce);
            },
            success: function(response) {
                if (response && response.success) {
                    $(`tr[data-id="${invoiceId}"]`).fadeOut(400, function() {
                        $(this).remove();
                        // If no invoices left, show message
                        if ($('.invoice-list-table tbody tr').length === 0) {
                            $('#invoice-creator-invoices-list').html('<p>No invoices found. <a href="' + 
                                adminUrl('admin.php?page=invoice-creator-new') + 
                                '">Create your first invoice</a>.</p>');
                        }
                    });
                }
            },
            error: function(error) {
                alert('Error deleting invoice. Please try again.');
                console.error('Error deleting invoice:', error);
            }
        });
    }
    
    /**
     * Initialize the invoice form
     */
    function initInvoiceForm() {
        const formContainer = $('#invoice-creator-form');
        
        // In a real implementation, we would:
        // 1. Load React components
        // 2. Render the form
        // For now, just show a placeholder
        formContainer.html(`
            <div>
                <p>The invoice form will be implemented here with React components.</p>
                <p>This will be a form similar to the one in the main application.</p>
                <p class="description">Coming soon in the next version!</p>
            </div>
        `);
    }
    
    /**
     * Format a date for display
     */
    function formatDate(dateString) {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString();
        } catch (e) {
            return dateString;
        }
    }
    
    /**
     * Format currency for display
     */
    function formatCurrency(amount, currencyCode = 'USD') {
        try {
            return new Intl.NumberFormat('en-US', { 
                style: 'currency', 
                currency: currencyCode 
            }).format(amount);
        } catch (e) {
            return amount;
        }
    }
    
    /**
     * Helper to create admin URLs
     */
    function adminUrl(path) {
        return window.location.origin + '/wp-admin/' + path;
    }

})(jQuery);
