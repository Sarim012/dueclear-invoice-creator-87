
<?php

/**
 * The core plugin class.
 *
 * This is used to define admin-specific hooks, load dependencies,
 * and the admin-facing site functionality.
 *
 * @since      1.0.0
 */
class Invoice_Creator {

    /**
     * Define the core functionality of the plugin.
     *
     * Load the dependencies, define the locale, and set the hooks for the admin area.
     *
     * @since    1.0.0
     */
    public function __construct() {
        $this->load_dependencies();
        $this->define_admin_hooks();
    }

    /**
     * Load the required dependencies for this plugin.
     *
     * @since    1.0.0
     */
    private function load_dependencies() {
        /**
         * The class responsible for defining all actions that occur in the admin area.
         */
        require_once INVOICE_CREATOR_PLUGIN_DIR . 'admin/class-invoice-creator-admin.php';
    }

    /**
     * Register all of the hooks related to the admin area functionality
     * of the plugin.
     *
     * @since    1.0.0
     */
    private function define_admin_hooks() {
        $plugin_admin = new Invoice_Creator_Admin();
        
        // Add menu items
        add_action('admin_menu', array($plugin_admin, 'register_admin_menu'));
        
        // Register scripts and styles
        add_action('admin_enqueue_scripts', array($plugin_admin, 'enqueue_styles'));
        add_action('admin_enqueue_scripts', array($plugin_admin, 'enqueue_scripts'));
        
        // Register REST API endpoints
        add_action('rest_api_init', array($plugin_admin, 'register_rest_endpoints'));
    }

    /**
     * Run the plugin.
     *
     * @since    1.0.0
     */
    public function run() {
        // Plugin initialization code
    }
}
