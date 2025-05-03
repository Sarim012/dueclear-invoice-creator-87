
<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @since      1.0.0
 */
class Invoice_Creator_Admin {

    /**
     * Register the stylesheets for the admin area.
     *
     * @since    1.0.0
     */
    public function enqueue_styles($hook) {
        // Only load on our plugin pages
        if (strpos($hook, 'invoice-creator') === false) {
            return;
        }
        
        wp_enqueue_style('invoice-creator-admin', INVOICE_CREATOR_PLUGIN_URL . 'admin/css/invoice-creator-admin.css', array(), INVOICE_CREATOR_VERSION);
    }

    /**
     * Register the JavaScript for the admin area.
     *
     * @since    1.0.0
     */
    public function enqueue_scripts($hook) {
        // Only load on our plugin pages
        if (strpos($hook, 'invoice-creator') === false) {
            return;
        }
        
        wp_enqueue_script('invoice-creator-admin', INVOICE_CREATOR_PLUGIN_URL . 'admin/js/invoice-creator-admin.js', array('jquery'), INVOICE_CREATOR_VERSION, true);
        
        // Localize the script with necessary data
        wp_localize_script('invoice-creator-admin', 'invoiceCreator', array(
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('invoice_creator_nonce'),
            'restUrl' => rest_url('invoice-creator/v1'),
        ));
    }

    /**
     * Register the admin menu for the plugin.
     *
     * @since    1.0.0
     */
    public function register_admin_menu() {
        add_menu_page(
            __('Invoice Creator', 'invoice-creator'),
            __('Invoice Creator', 'invoice-creator'),
            'manage_options',
            'invoice-creator',
            array($this, 'display_invoices_page'),
            'dashicons-text-page',
            26
        );
        
        add_submenu_page(
            'invoice-creator',
            __('All Invoices', 'invoice-creator'),
            __('All Invoices', 'invoice-creator'),
            'manage_options',
            'invoice-creator',
            array($this, 'display_invoices_page')
        );
        
        add_submenu_page(
            'invoice-creator',
            __('Create Invoice', 'invoice-creator'),
            __('Create Invoice', 'invoice-creator'),
            'manage_options',
            'invoice-creator-new',
            array($this, 'display_invoice_form')
        );
        
        add_submenu_page(
            'invoice-creator',
            __('Settings', 'invoice-creator'),
            __('Settings', 'invoice-creator'),
            'manage_options',
            'invoice-creator-settings',
            array($this, 'display_settings_page')
        );
    }
    
    /**
     * Display the invoices listing page.
     *
     * @since    1.0.0
     */
    public function display_invoices_page() {
        include_once INVOICE_CREATOR_PLUGIN_DIR . 'admin/partials/invoice-creator-admin-invoices.php';
    }
    
    /**
     * Display the invoice creation form.
     *
     * @since    1.0.0
     */
    public function display_invoice_form() {
        include_once INVOICE_CREATOR_PLUGIN_DIR . 'admin/partials/invoice-creator-admin-form.php';
    }
    
    /**
     * Display the settings page.
     *
     * @since    1.0.0
     */
    public function display_settings_page() {
        include_once INVOICE_CREATOR_PLUGIN_DIR . 'admin/partials/invoice-creator-admin-settings.php';
    }
    
    /**
     * Register REST API endpoints for the invoice creator.
     *
     * @since    1.0.0
     */
    public function register_rest_endpoints() {
        register_rest_route('invoice-creator/v1', '/invoices', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_invoices'),
            'permission_callback' => function () {
                return current_user_can('manage_options');
            }
        ));
        
        register_rest_route('invoice-creator/v1', '/invoices/(?P<id>[a-zA-Z0-9-]+)', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_invoice'),
            'permission_callback' => function () {
                return current_user_can('manage_options');
            }
        ));
        
        register_rest_route('invoice-creator/v1', '/invoices', array(
            'methods' => 'POST',
            'callback' => array($this, 'create_invoice'),
            'permission_callback' => function () {
                return current_user_can('manage_options');
            }
        ));
        
        register_rest_route('invoice-creator/v1', '/invoices/(?P<id>[a-zA-Z0-9-]+)', array(
            'methods' => 'DELETE',
            'callback' => array($this, 'delete_invoice'),
            'permission_callback' => function () {
                return current_user_can('manage_options');
            }
        ));
    }
    
    /**
     * Get all invoices.
     *
     * @since    1.0.0
     */
    public function get_invoices() {
        global $wpdb;
        $table_name = $wpdb->prefix . 'invoice_creator_invoices';
        
        $results = $wpdb->get_results("SELECT * FROM $table_name ORDER BY created_at DESC", ARRAY_A);
        
        return new WP_REST_Response($results, 200);
    }
    
    /**
     * Get a specific invoice.
     *
     * @since    1.0.0
     */
    public function get_invoice($request) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'invoice_creator_invoices';
        
        $invoice_id = $request['id'];
        $result = $wpdb->get_row(
            $wpdb->prepare("SELECT * FROM $table_name WHERE id = %s", $invoice_id),
            ARRAY_A
        );
        
        if (!$result) {
            return new WP_Error('not_found', 'Invoice not found', array('status' => 404));
        }
        
        return new WP_REST_Response($result, 200);
    }
    
    /**
     * Create a new invoice.
     *
     * @since    1.0.0
     */
    public function create_invoice($request) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'invoice_creator_invoices';
        
        $params = $request->get_params();
        
        // Prepare the data
        $data = array(
            'id' => isset($params['id']) ? sanitize_text_field($params['id']) : wp_generate_uuid4(),
            'invoice_number' => sanitize_text_field($params['invoiceNumber']),
            'issue_date' => sanitize_text_field($params['issueDate']),
            'due_date' => sanitize_text_field($params['dueDate']),
            'currency' => sanitize_text_field($params['currency']),
            'business_details' => sanitize_textarea_field($params['businessDetails']),
            'client_details' => sanitize_textarea_field($params['clientDetails']),
            'items' => json_encode($params['items']),
            'subtotal' => floatval($params['subtotal']),
            'discount' => floatval($params['discount']),
            'tax' => floatval($params['tax']),
            'shipping' => floatval($params['shipping']),
            'total' => floatval($params['total']),
            'payment_method' => sanitize_text_field($params['paymentMethod']),
            'payment_details' => $this->get_payment_details($params),
            'notes' => isset($params['notes']) ? sanitize_textarea_field($params['notes']) : '',
            'terms' => isset($params['terms']) ? sanitize_textarea_field($params['terms']) : '',
            'logo_url' => isset($params['logoUrl']) ? esc_url_raw($params['logoUrl']) : '',
            'created_at' => current_time('mysql', true),
        );
        
        $result = $wpdb->insert($table_name, $data);
        
        if (!$result) {
            return new WP_Error('insert_error', 'Error creating invoice', array('status' => 500));
        }
        
        return new WP_REST_Response(array(
            'success' => true,
            'id' => $data['id'],
        ), 201);
    }
    
    /**
     * Delete an invoice.
     *
     * @since    1.0.0
     */
    public function delete_invoice($request) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'invoice_creator_invoices';
        
        $invoice_id = $request['id'];
        
        $result = $wpdb->delete(
            $table_name,
            array('id' => $invoice_id),
            array('%s')
        );
        
        if (!$result) {
            return new WP_Error('delete_error', 'Error deleting invoice', array('status' => 500));
        }
        
        return new WP_REST_Response(array(
            'success' => true,
        ), 200);
    }
    
    /**
     * Get payment details based on payment method.
     *
     * @since    1.0.0
     */
    private function get_payment_details($params) {
        $payment_method = $params['paymentMethod'];
        $payment_details = '';
        
        switch ($payment_method) {
            case 'Bank Transfer':
                $payment_details = isset($params['bankDetails']) ? sanitize_textarea_field($params['bankDetails']) : '';
                break;
            case 'PayPal':
                $payment_details = isset($params['paypalId']) ? sanitize_text_field($params['paypalId']) : '';
                break;
            case 'UPI':
                $payment_details = isset($params['upiId']) ? sanitize_text_field($params['upiId']) : '';
                break;
            case 'Payment Link':
                $payment_details = isset($params['paymentLink']) ? esc_url_raw($params['paymentLink']) : '';
                break;
            case 'Cash':
                $payment_details = isset($params['cashInstructions']) ? sanitize_textarea_field($params['cashInstructions']) : '';
                break;
        }
        
        return $payment_details;
    }
}
