
<?php

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      1.0.0
 */
class Invoice_Creator_Activator {

    /**
     * Creates any necessary database tables for the invoice plugin.
     *
     * @since    1.0.0
     */
    public static function activate() {
        global $wpdb;
        $charset_collate = $wpdb->get_charset_collate();
        
        // Create invoices table
        $table_name = $wpdb->prefix . 'invoice_creator_invoices';
        
        $sql = "CREATE TABLE IF NOT EXISTS $table_name (
            id varchar(36) NOT NULL,
            invoice_number varchar(50) NOT NULL,
            issue_date datetime NOT NULL,
            due_date datetime NOT NULL,
            currency varchar(10) NOT NULL,
            business_details text NOT NULL,
            client_details text NOT NULL,
            items longtext NOT NULL,
            subtotal decimal(10,2) NOT NULL,
            discount decimal(10,2) NOT NULL,
            tax decimal(10,2) NOT NULL,
            shipping decimal(10,2) NOT NULL,
            total decimal(10,2) NOT NULL,
            payment_method varchar(50) NOT NULL,
            payment_details text,
            notes text,
            terms text,
            logo_url varchar(255),
            created_at datetime NOT NULL,
            PRIMARY KEY  (id)
        ) $charset_collate;";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }
}
