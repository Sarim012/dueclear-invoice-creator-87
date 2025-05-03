
<div class="wrap">
    <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
    
    <div class="invoice-creator-container">
        <div class="invoice-creator-header">
            <a href="<?php echo esc_url(admin_url('admin.php?page=invoice-creator-new')); ?>" class="page-title-action">Add New Invoice</a>
        </div>
        
        <div id="invoice-creator-invoices-list">
            <div class="invoice-creator-loading">
                <p>Loading invoices...</p>
            </div>
        </div>
    </div>
</div>
