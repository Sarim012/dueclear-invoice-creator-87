
<?php

/**
 * Fired during plugin deactivation.
 *
 * This class defines all code necessary to run during the plugin's deactivation.
 *
 * @since      1.0.0
 */
class Invoice_Creator_Deactivator {

    /**
     * Plugin deactivation tasks.
     *
     * @since    1.0.0
     */
    public static function deactivate() {
        // For now, we'll leave the database intact to preserve user data
        // Future versions might include an option to remove all data
    }
}
