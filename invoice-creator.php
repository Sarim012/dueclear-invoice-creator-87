
<?php
/**
 * Plugin Name: Invoice Creator
 * Plugin URI: https://lovable.dev/projects/208ab0bd-cf08-4df5-b674-01e67f2dfdd3
 * Description: Create and manage professional invoices directly from WordPress.
 * Version: 1.0.0
 * Author: Lovable
 * Text Domain: invoice-creator
 */

// If this file is called directly, abort.
if (!defined('WPINC')) {
    die;
}

// Define plugin constants
define('INVOICE_CREATOR_VERSION', '1.0.0');
define('INVOICE_CREATOR_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('INVOICE_CREATOR_PLUGIN_URL', plugin_dir_url(__FILE__));

/**
 * The code that runs during plugin activation.
 */
function activate_invoice_creator() {
    // Create plugin tables if needed
    require_once INVOICE_CREATOR_PLUGIN_DIR . 'includes/class-invoice-creator-activator.php';
    Invoice_Creator_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 */
function deactivate_invoice_creator() {
    // Cleanup tasks
    require_once INVOICE_CREATOR_PLUGIN_DIR . 'includes/class-invoice-creator-deactivator.php';
    Invoice_Creator_Deactivator::deactivate();
}

register_activation_hook(__FILE__, 'activate_invoice_creator');
register_deactivation_hook(__FILE__, 'deactivate_invoice_creator');

/**
 * The core plugin class that is used to define admin-specific hooks.
 */
require INVOICE_CREATOR_PLUGIN_DIR . 'includes/class-invoice-creator.php';

/**
 * Begins execution of the plugin.
 */
function run_invoice_creator() {
    $plugin = new Invoice_Creator();
    $plugin->run();
}
run_invoice_creator();
