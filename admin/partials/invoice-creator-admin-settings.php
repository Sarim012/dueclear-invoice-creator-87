
<div class="wrap">
    <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
    
    <form method="post" action="options.php">
        <?php
        settings_fields('invoice_creator_settings');
        do_settings_sections('invoice-creator-settings');
        submit_button();
        ?>
    </form>
</div>
